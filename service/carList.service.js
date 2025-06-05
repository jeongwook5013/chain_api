const express = require('express');
const router = express.Router();
const Car = require('../models/tb_car.model');

router.get('/list', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // 기본값: 1페이지
    const limit = parseInt(req.query.limit) || 12; // 기본값: 12개
    const skip = (page - 1) * limit;

    try {
        const total = await Car.countDocuments(); // 전체 개수
        const cars = await Car.find()
            .populate('seller_id', 'name phone_number')
            .skip(skip)
            .limit(limit)
            .exec();

        res.json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            items: cars
        });
    } catch (err) {
        res.status(500).json({ error: '차량 목록 조회 실패', detail: err.message });
    }
});

module.exports = router;
