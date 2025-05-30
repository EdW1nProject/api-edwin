const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            status: 400,
            creator: 'Edwin',
            error: 'Masukkan URL Facebook!'
        });
    }

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const $ = cheerio.load(html);
        const regex = /"playable_url":"(https:\\/\\/video[^"]+)"/;
        const match = html.match(regex);

        if (!match || !match[1]) {
            return res.status(500).json({
                status: 500,
                creator: 'Edwin',
                error: 'Gagal mendapatkan link video.'
            });
        }

        // Unescape string URL
        const videoUrl = match[1].replace(/\\u0025/g, '%').replace(/\\/g, '');

        res.json({
            status: 200,
            creator: 'Edwin',
            source: url,
            download_link: decodeURIComponent(videoUrl)
        });

    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({
            status: 500,
            creator: 'Edwin',
            error: 'Terjadi kesalahan, coba lagi nanti!'
        });
    }
});

module.exports = router;
