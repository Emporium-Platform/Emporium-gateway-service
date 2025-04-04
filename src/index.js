const express = require("express")
const cors = require("cors")
const config = require("./config/config")
const axios = require("axios")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Basic root endpoint for testing
app.get("/health", (req, res) => {
    res.json({ message: "Welcome to Emporium Gateway Service" })
})

// Search books by topic
app.get("/search/:topic", async (req, res) => {
    try {
        const response = await axios.get(`${config.services.catalog}/search/${req.params.topic}`)
        res.json(response.data)
    } catch (error) {
        console.error("Error in search:", error.message)
        res.status(500).json({ error: "Failed to search books" })
    }
})

// Get book info by item number
app.get("/info/:itemNumber", async (req, res) => {
    try {
        const response = await axios.get(`${config.services.catalog}/info/${req.params.itemNumber}`)
        res.json(response.data)
    } catch (error) {
        console.error("Error in info:", error.message)
        res.status(500).json({ error: "Failed to get book information" })
    }
})

// Purchase book by item number
app.post("/purchase/:itemNumber", async (req, res) => {
    try {
        const response = await axios.post(`${config.services.order}/purchase/${req.params.itemNumber}`)
        res.json(response.data)
    } catch (error) {
        console.error("Error in purchase:", error.message)
        res.status(500).json({ error: "Failed to process purchase" })
    }
})

// Start server
app.listen(config.port, () => {
    console.log(`Gateway service running on port ${config.port}`)
    console.log("Service URLs:", config.services)
})
