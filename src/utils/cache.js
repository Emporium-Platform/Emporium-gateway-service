class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.hits = 0;
        this.misses = 0;
    }

    get(key) {
        if (!this.cache.has(key)) {
            this.misses++;
            return null;
        }
        
        // Get value and refresh position in LRU
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        this.hits++;
        
        return value;
    }

    set(key, value) {
        // Remove oldest if at capacity
        if (this.cache.size >= this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, value);
    }

    invalidate(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }

    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total === 0 ? 0 : (this.hits / total) * 100;
        
        return {
            size: this.cache.size,
            capacity: this.capacity,
            hits: this.hits,
            misses: this.misses,
            hitRate: `${hitRate.toFixed(2)}%`
        };
    }
}

module.exports = LRUCache;
