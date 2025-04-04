const config = {
    port: process.env.PORT || 3000,
    services: {
        catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:5000',
        order: process.env.ORDER_SERVICE_URL || 'http://localhost:4000'
    }
};

module.exports = config;
