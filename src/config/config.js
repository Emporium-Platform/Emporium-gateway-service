const config = {
    port: process.env.PORT || 3000,
    services: {
        catalog: process.env.CATALOG_SERVICES ? 
            process.env.CATALOG_SERVICES.split(',') : 
            ['http://localhost:5001', 'http://localhost:5002'],
        order: process.env.ORDER_SERVICES ? 
            process.env.ORDER_SERVICES.split(',') : 
            ['http://localhost:5003', 'http://localhost:5004']
    },
    cache: {
        enabled: process.env.CACHE_ENABLED !== 'false',
        capacity: parseInt(process.env.CACHE_CAPACITY || '100'),
        ttl: parseInt(process.env.CACHE_TTL || '300000'), // 5 minutes in milliseconds
    }
};

module.exports = config;
