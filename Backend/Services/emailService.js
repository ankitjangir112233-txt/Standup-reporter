const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendSummaryEmail = async (updates) => {
    try {
        const body = updates.map(u => `
Name             : ${u.name}
Completed Work   : ${u.completedWork}
Objectives       : ${u.objectives}
Blockers         : ${u.blockers}
        `).join('\n─────────────────────────\n');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.TEAM_EMAIL,
            subject: `Daily Standup Summary — ${new Date().toDateString()}`,
            text: `DAILY STANDUP REPORT\n${'='.repeat(40)}\n${body}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Summary email sent successfully');

    } catch (error) {
        console.log('Email error:', error.message);
    }
};

const sendReminderEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Standup Reminder — Please submit your update',
            text: `Hi ${name},\n\nThis is a reminder to submit your daily standup update before 9:00 AM.\n\nThank you`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent to ${name}`);

    } catch (error) {
        console.log('Reminder error:', error.message);
    }
};

module.exports = { sendSummaryEmail, sendReminderEmail };