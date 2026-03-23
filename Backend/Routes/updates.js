const express = require('express');
const router = express.Router();
const Update = require('../Models/Update');
const User = require('../Models/User');
const protect = require('../Middleware/auth');
const { sendSummaryEmail, sendReminderEmail } = require('../Services/emailService');


// POST /api/updates — save standup
router.post('/', protect, async (req, res) => {
    try {
        const { completedWork, objectives, blockers } = req.body;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const alreadySubmitted = await Update.findOne({
            userId: req.user.id,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        if (alreadySubmitted) {
            return res.status(400).json({
                message: 'Already submitted today'
            });
        }

        const update = await Update.create({
            userId: req.user.id,
            name: req.user.name,
            completedWork,
            objectives,
            blockers: blockers || 'None'
        });

        return res.status(201).json({
            message: 'Standup submitted successfully',
            update
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// GET /api/updates/mine — check if logged in user submitted today
router.get('/mine', protect, async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const myUpdate = await Update.findOne({
            userId: req.user.id,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        return res.json({ submitted: myUpdate ? true : false });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// GET /api/updates/users — get all users (admin only)
router.get('/users', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admins only.'
            });
        }

        const users = await User.find()
            .select('-password')
            .sort({ name: 1 });

        return res.json(users);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// GET /api/updates/today — today's updates (admin only)
router.get('/today', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admins only.'
            });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const updates = await Update.find({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        }).sort({ createdAt: -1 });

        return res.json(updates);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// GET /api/updates — all updates (admin only)
router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admins only.'
            });
        }

        const updates = await Update.find()
            .sort({ createdAt: -1 });

        return res.json(updates);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// POST /api/updates/send-summary — admin sends summary email
router.post('/send-summary', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admins only.'
            });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const updates = await Update.find({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        if (updates.length === 0) {
            return res.status(400).json({
                message: 'No updates submitted today yet'
            });
        }

        await sendSummaryEmail(updates);

        return res.json({
            message: 'Summary email sent successfully',
            totalUpdates: updates.length
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// POST /api/updates/send-reminders — admin sends reminders
router.post('/send-reminders', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admins only.'
            });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const allMembers = await User.find({ role: 'member' });

        const todayUpdates = await Update.find({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        const submittedIds = todayUpdates.map(u => u.userId.toString());

        const notSubmitted = allMembers.filter(
            member => !submittedIds.includes(member._id.toString())
        );

        if (notSubmitted.length === 0) {
            return res.json({
                message: 'Everyone has submitted today'
            });
        }

        for (const member of notSubmitted) {
            await sendReminderEmail(member.email, member.name);
        }

        return res.json({
            message: `Reminders sent to ${notSubmitted.length} members`,
            members: notSubmitted.map(m => m.name)
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;