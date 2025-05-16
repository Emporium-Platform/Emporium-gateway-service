# Emporium Gateway Service

Node.js-based gateway service for the Emporium online bookstore, featuring caching and load balancing capabilities.

## Features

- In-memory LRU caching for read operations
- Round-robin load balancing
- Cache invalidation on writes
- Cache statistics monitoring
- Support for multiple catalog and order service instances

## Environment Variables

- `PORT`: Server port (default: 3000)
- `CATALOG_SERVICES`: Comma-separated catalog service URLs
- `ORDER_SERVICES`: Comma-separated order service URLs
- `CACHE_ENABLED`: Enable/disable caching (default: true)
- `CACHE_CAPACITY`: Maximum cache entries (default: 100)
- `CACHE_TTL`: Cache entry lifetime in ms (default: 300000)

## API Endpoints

### Book Operations
```
GET /search/:topic
Returns books matching the topic (cached)

GET /info/:itemNumber
Returns book details (cached)

POST /purchase/:itemNumber
Process book purchase (invalidates cache)
```

### Cache Operations
```
GET /cache/stats
Returns cache statistics

POST /cache/invalidate
Body: { "key": "cache-key" }
Invalidates specific cache entry
```

### Health Check
```
GET /health
Returns service health status
```

## Running the Service

```bash
docker-compose up --build
```

Service will be available at:
- Gateway: http://localhost:3000
- Connects to:
  - Catalog Primary: http://localhost:5001
  - Catalog Backup: http://localhost:5002

## Implementation Notes

### Caching
- LRU (Least Recently Used) implementation
- Automatic invalidation on write operations
- Cache statistics tracking
- Configurable cache size and TTL

### Load Balancing
- Round-robin distribution
- Separate balancing for catalog and order services
- Write operations directed to primary catalog
- Even distribution of read requests

### Error Handling
- Automatic failover between replicas
- Circuit breaking for failed services
- Detailed error logging
