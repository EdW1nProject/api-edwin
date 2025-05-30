const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/api/fbdl', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            creator: 'Edwin',
            message: 'Masukkan url parameters !'
        });
    }

    try {
        const response = await axios.get(`https://facebook-video-downloader.fly.dev/app/main.php?url=${encodeURIComponent(url)}`);
        
        const data = response.data;

        if (!data || typeof data !== 'object') {
            return res.status(500).json({
                status: false,
                creator: 'Edwin',
                message: 'Gagal mengambil data dari server eksternal.'
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({
            status: false,
            creator: 'Edwin',
            message: 'Terjadi kesalahan saat memproses permintaan.',
            error: err.message
        });
    }
});

module.exports = router;
