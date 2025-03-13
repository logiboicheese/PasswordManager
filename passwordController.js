const cache = {
    passwordEntries: null,
    lastFetch: 0,
};

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes TTL for cache

const clearCache = () => {
    cache.passwordEntries = null;
    cache.lastFetch = 0;
};

const getAllPasswordEntries = async (req, res) => {
    const now = Date.now();

    if (cache.passwordEntries && (now - cache.lastFetch) < CACHE_TTL) {
        console.log('Serving from cache');
        return res.status(200).json(cache.passwordEntries);
    }

    clearCache(); // Clear the cache before fetching new entries
    
    try {
        // If using Mongoose, `.lean()` ensures we get plain JS objects, reducing memory usage.
        const passwordEntries = await PasswordEntry.find().lean();
        cache.passwordEntries = passwordEntries;
        cache.lastFetch = now;
        res.status(200).json(passwordEntries);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Consider adding a periodic cache cleanup to ensure memory is managed efficiently
// Especially useful if the server has long uptime and infrequent cache hits.
setInterval(() => {
    const now = Date.now();
    if (cache.passwordEntries && (now - cache.lastFetch) >= CACHE_TTL) {
        console.log('Clearing stale cache');
        clearCache();
    }
}, CACHE_TTL);