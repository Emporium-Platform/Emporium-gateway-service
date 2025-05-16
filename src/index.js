const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const axios = require("axios");
const LRUCache = require("./utils/cache");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize cache
const cache = new LRUCache(config.cache.capacity);

// Load balancing indexes
let catalogIndex = 0;
let orderIndex = 0;

// Helper function for round-robin load balancing
function getNextServer(servers, currentIndex) {
    const server = servers[currentIndex];
    return {
        server,
        nextIndex: (currentIndex + 1) % servers.length
    };
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy" })
})

// Cache stats endpoint
app.get("/cache/stats", (req, res) => {
    res.json(cache.getStats());
});

// Cache invalidation endpoint
app.post("/cache/invalidate", (req, res) => {
    const { key } = req.body;
    if (!key) {
        return res.status(400).json({ error: "Key is required" });
    }
    
    const wasInvalidated = cache.invalidate(key);
    console.log(`Cache invalidation for key ${key}: ${wasInvalidated ? 'succeeded' : 'key not found'}`);
    res.json({ invalidated: wasInvalidated });
});

// Search books by topic
app.get("/search/:topic", async (req, res) => {
    try {
        const topic = req.params.topic;
        const cacheKey = `search:${topic}`;
        
        // Check cache first
        if (config.cache.enabled) {
            const cachedResult = cache.get(cacheKey);
            if (cachedResult) {
                console.log(`Cache hit for search: ${topic}`);
                return res.json(cachedResult);
            }
        }

        // Select next catalog server
        const { server, nextIndex } = getNextServer(config.services.catalog, catalogIndex);
        catalogIndex = nextIndex;
        
        console.log(`Searching for books with topic: ${topic} on ${server}`);
        const response = await axios.get(`${server}/search/${topic}`);
        
        // Cache the result
        if (config.cache.enabled) {
            cache.set(cacheKey, response.data);
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('Error searching for books:', error.message);
        res.status(error.response?.status || 500).json({ error: 'Failed to search books' });
    }
});

// Get book info by item number
app.get("/info/:itemNumber", async (req, res) => {
    try {
        const itemNumber = req.params.itemNumber;
        const cacheKey = `book:${itemNumber}`;
        
        // Check cache first
        if (config.cache.enabled) {
            const cachedResult = cache.get(cacheKey);
            if (cachedResult) {
                console.log(`Cache hit for book ID: ${itemNumber}`);
                return res.json(cachedResult);
            }
        }

        // Select next catalog server
        const { server, nextIndex } = getNextServer(config.services.catalog, catalogIndex);
        catalogIndex = nextIndex;
        
        console.log(`Fetching info for book ID: ${itemNumber} from ${server}`);
        const response = await axios.get(`${server}/info/${itemNumber}`);
        
        // Cache the result
        if (config.cache.enabled) {
            cache.set(cacheKey, response.data);
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching book info:', error.message);
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch book info' });
    }
});

// Purchase book by item number
app.post("/purchase/:itemNumber", async (req, res) => {
    try {
        const itemNumber = req.params.itemNumber;
        
        // Select next order server
        const { server, nextIndex } = getNextServer(config.services.order, orderIndex);
        orderIndex = nextIndex;
        
        console.log(`Purchasing book ID: ${itemNumber} via ${server}`);
        const response = await axios.post(`${server}/purchase/${itemNumber}`, req.body);
        
        // Invalidate cache for this book
        if (config.cache.enabled) {
            cache.invalidate(`book:${itemNumber}`);
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('Error processing purchase:', error.message);
        res.status(error.response?.status || 500).json({ error: 'Failed to process purchase' });
    }
});

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
