const cache = {
    passwordEntries: null,
    lastFetch: 0,
};

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes TTL for cache

const getAllPasswordEntries = async (req, res) => {
    const now = Date.now();

    if (cache.passwordEntries && (now - cache.lastFetch) < CACHE_TTL) {
        console.log('Serving from cache');
        return res.status(200).json(cache.passwordEntries);
    }

    try {
        const passwordEntries = await PasswordEntry.find();
        cache.passwordEntries = passwordEntries;
        cache.lastFetch = now;
        res.status(200).json(passwordEntries);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};