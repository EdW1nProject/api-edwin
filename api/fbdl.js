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
        const { data } = await axios.get(`https://apidl.asepharyana.cloud/api/downloader/fbdl?url=${encodeURIComponent(url)}`);

        if (!data.status || !data.data || data.data.length === 0) {
            return res.status(500).json({
                status: 500,
                creator: "Edwin",
                error: "Gagal mendapatkan data video."
            });
        }

        // Ambil video resolusi tertinggi (jika perlu, kamu bisa ubah strategi pemilihan)
        const videoData = data.data[0];

        res.json({
            status: 200,
            creator: "Edwin",
            source: url,
            resolution: videoData.resolution,
            thumbnail: videoData.thumbnail,
            download_link: videoData.url
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
