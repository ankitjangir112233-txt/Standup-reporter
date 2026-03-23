const cron = require('node-cron');
const Update = require('./Models/Update');
const User = require('./Models/User');
const { sendSummaryEmail, sendReminderEmail } = require('./Services/emailService');

// REMINDER — fires at 8:45 AM daily
cron.schedule('45 8 * * *', async () => {
    console.log('Reminder cron fired...');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // get all members
        const allMembers = await User.find({ role: 'member' });

        // get who has submitted today
        const todayUpdates = await Update.find({
            createdAt: { $gte: today }
        });

        // find who has NOT submitted
        const submittedIds = todayUpdates.map(u => u.userId.toString());
        const notSubmitted = allMembers.filter(
            member => !submittedIds.includes(member._id.toString())
        );

        // send reminder to each
        for (const member of notSubmitted) {
            await sendReminderEmail(member.email, member.name);
        }

        console.log(`Reminders sent to ${notSubmitted.length} members`);

    } catch (error) {
        console.log('Reminder cron error:', error.message);
    }
});


// SUMMARY — fires at 9:00 AM daily
cron.schedule('0 9 * * *', async () => {
    console.log('Summary cron fired...');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // get today's updates
        const updates = await Update.find({
            createdAt: { $gte: today }
        });

        if (updates.length === 0) {
            console.log('No updates today — skipping email');
            return;
        }

        await sendSummaryEmail(updates);

    } catch (error) {
        console.log('Summary cron error:', error.message);
    }
});

console.log('Scheduler started');