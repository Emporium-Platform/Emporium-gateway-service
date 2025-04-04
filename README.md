# Emporium Gateway Service

The Gateway Service is a crucial component of the Emporium platform, serving as the API gateway that handles routing and communication between client applications and various microservices (catalog and order services).

## Features

- Centralized API gateway for the Emporium platform
- Request routing to appropriate microservices
- Health check endpoint
- Error handling and logging
- CORS support

## Tech Stack

- Node.js
- Express.js
- Axios for HTTP requests
- CORS middleware
- Docker support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Emporium-Platform/Emporium-gateway-service.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the service:
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```

## Environment Variables

The service can be configured using the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port number for the gateway service | 3000 |
| CATALOG_SERVICE_URL | URL of the catalog service | http://localhost:5000 |
| ORDER_SERVICE_URL | URL of the order service | http://localhost:4000 |

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the service.

**Response**:
```json
{
    "status": "healthy"
}
```

### Search Books by Topic
```
GET /search/:topic
```
Searches for books based on the provided topic.

**Parameters**:
- `topic` (path parameter): The topic to search for

**Response**: List of books matching the topic.

### Get Book Information
```
GET /info/:itemNumber
```
Retrieves detailed information about a specific book.

**Parameters**:
- `itemNumber` (path parameter): The unique identifier of the book

**Response**: Detailed book information.

### Purchase Book
```
POST /purchase/:itemNumber
```
Initiates a purchase transaction for a specific book.

**Parameters**:
- `itemNumber` (path parameter): The unique identifier of the book to purchase

**Response**: Purchase confirmation details.

## Running with Docker Compose

The gateway service is part of a multi-service Docker Compose setup that includes the catalog-service and order-service.

### Step 1: Start the Services
To build and run the gateway, catalog, and order services together, navigate to the project directory containing the docker-compose.yml file and run:

```bash
docker-compose up --build
```

This command will:
- Build fresh images for emporium-gateway-service, emporium-catalog-service, and emporium-order-service
- Start each service in its own container and connect them over a shared network
- Expose the gateway service on port 3000, the catalog service on port 5000, and the order service on port 4000

## Error Handling

The service includes comprehensive error handling:
- Service-specific error responses
- Global error handler for unhandled exceptions
- Error logging for debugging
- Appropriate HTTP status codes and error messages

## Development

To run the service in development mode with hot-reload:
```bash
npm run dev
```

The service will automatically restart when changes are detected in the source code.
