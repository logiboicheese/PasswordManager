// Assuming an in-memory cache (simple demonstration)
const cache = {
    passwordEntries: null,
    lastFetch: 0,
};

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes TTL for cache

const getAllPasswordEntries = async (req, res) => {
    const now = Date.now();

    try {
        // Check if cache exists and is within TTL
        if(cache.passwordEntries && (now - cache.lastFetch) < CACHE_TTL) {
            console.log('Serving from cache');
            return res.status(200).json(cache.passwordEntries);
        }

        const passwordEntries = await PasswordEntry.find();
        
        // Update cache with new data
        cache.passwordEntries = passwordEntries;
        cache.lastFetch = now;

        res.status(200).json(passwordEntries);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};