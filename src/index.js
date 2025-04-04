const express = require("express")
const cors = require("cors")
const config = require("./config/config")
const axios = require("axios")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy" })
})

// Search books by topic
app.get("/search/:topic", async (req, res) => {
    try {
        console.log(`Searching for books with topic: ${req.params.topic}`)
        const response = await axios.get(`${config.services.catalog}/search/${req.params.topic}`)
        res.json(response.data)
    } catch (error) {
        console.error('Error searching for books:', error.message)
        res.status(error.response?.status || 500).json({ error: 'Failed to search books' })
    }
})

// Get book info by item number
app.get("/info/:itemNumber", async (req, res) => {
    try {
        console.log(`Fetching info for book ID: ${req.params.itemNumber}`)
        const response = await axios.get(`${config.services.catalog}/info/${req.params.itemNumber}`)
        res.json(response.data)
    } catch (error) {
        console.error('Error fetching book info:', error.message)
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch book info' })
    }
})

// Purchase book by item number
app.post("/purchase/:itemNumber", async (req, res) => {
    try {
        console.log(`Purchasing book ID: ${req.params.itemNumber}`)
        const response = await axios.post(`${config.services.order}/purchase/${req.params.itemNumber}`)
        res.json(response.data)
    } catch (error) {
        console.error('Error processing purchase:', error.message)
        res.status(error.response?.status || 500).json({ error: 'Failed to process purchase' })
    }
})

// Error handler middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(config.port, () => {
    console.log(`Gateway Service running on port ${config.port}`)
    console.log('Service URLs:', config.services)
})
