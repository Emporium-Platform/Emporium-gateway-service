const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic root endpoint for testing
app.get('/health', (req, res) => {
    res.json({ message: 'Welcome to Emporium Gateway Service' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Gateway service running on port ${PORT}`);
});
