const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url || !url.includes('facebook.com')) {
        return res.status(400).json({
            status: 400,
            creator: 'Edwin',
            error: 'Masukkan URL Facebook yang valid!'
        });
    }

    try {
        const payload = new URLSearchParams({ url });

        const response = await axios.post(
            'https://facebook-video-downloader.fly.dev/app/main.php',
            payload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        let data = response.data;

        // Cek apakah respon berupa objek (JSON)
        if (typeof data === 'object' && data.links) {
            const links = data.links;
            const downloadLink = links["Download High Quality"] || links["Download Low Quality"];

            if (!downloadLink) {
                return res.status(404).json({
                    status: 404,
                    creator: "Edwin",
                    error: "Link video tidak ditemukan."
                });
            }

            return res.json({
                status: 200,
                creator: "Edwin",
                source: url,
                type: 'video',
                quality: links["Download High Quality"] ? 'high' : 'low',
                download_link: downloadLink
            });
        }

        // Jika bukan JSON, berarti HTML — lakukan scraping
        if (typeof data === 'string') {
            const match = data.match(/href="(https:\/\/[^"]+\.fbcdn\.net\/[^"]+)"/);

            if (!match || !match[1]) {
                return res.status(500).json({
                    status: 500,
                    creator: 'Edwin',
                    error: 'Gagal parsing HTML respons. Link video tidak ditemukan.'
                });
            }

            return res.json({
                status: 200,
                creator: "Edwin",
                source: url,
                type: 'video',
                quality: 'unknown',
                download_link: match[1]
            });
        }

        // Jika tidak dikenali
        return res.status(500).json({
            status: 500,
            creator: 'Edwin',
            error: 'Respons tidak dikenali dari server downloader.'
        });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({
            status: 500,
            creator: 'Edwin',
            error: 'Terjadi kesalahan saat menghubungi API pihak ketiga.'
        });
    }
});

module.exports = router;
