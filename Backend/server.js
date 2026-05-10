const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// 🔥 DEBUG (remove later)
console.log("MONGO_URI:", process.env.MONGO_URI);

const connectDB = require('./Config/db');
const authRoutes = require('./Routes/auth');
const updateRoutes = require('./Routes/updates');
require('./scheduler');

const app = express();

// ✅ Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000", // Covering CRA default port too
        "https://standup-reporter.vercel.app",
        "https://standup-reporter.vercel.app/", // Added trailing slash
        /\.vercel\.app$/ 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/updates', updateRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// ✅ Start server ONLY after DB connects
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server failed to start:", error);
    }
};

startServer();
