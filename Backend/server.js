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
    origin: function(origin, callback) {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(null, true); // 🔥 allow all for now (fix later)
        }
    },
    credentials: true
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
