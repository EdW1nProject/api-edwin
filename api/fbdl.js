const express = require('express');
const axios = require('axios');
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
        const { data } = await axios.get(`https://vapis.my.id/api/fbdl?url=${encodeURIComponent(url)}`);

        if (!data || !data.status || !data.data || (!data.data.hd_url && !data.data.sd_url)) {
            return res.status(500).json({
                status: 500,
                creator: "Edwin",
                error: "Gagal mendapatkan link video."
            });
        }

        res.json({
            status: 200,
            creator: "Edwin",
            source: url,
            title: data.data.title,
            hd_download: data.data.hd_url || null,
            sd_download: data.data.sd_url || null
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
