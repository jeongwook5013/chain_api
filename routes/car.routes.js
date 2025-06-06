const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Car = require('../models/tb_car.model');

router.get('/mycars', authenticateToken, async (req, res) => {
  try {
    const seller_id = req.user.id;  // JWT 미들웨어에서 추출된 유저 ID

    const cars = await Car.find({ seller_id }).sort({ created_at: -1 });

    res.json({ cars });
  } catch (error) {
    console.error('차량 목록 조회 오류:', error);
    res.status(500).json({ error: '차량 목록을 불러오는 데 실패했습니다.' });
  }
});

module.exports = router;
