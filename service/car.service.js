const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Car = require('../models/tb_car.model');
const User = require('../models/tb_user.model');
const Counter = require('../models/tb_counter.model');

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // 서버 루트에 uploads 폴더 만들어야 함
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // ex) 1627382938473.jpg
    }
});
const upload = multer({ storage });

router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const {
            seller_id,
            car_model,
            car_year,
            price,
            description,
            type,
            manufacturer,
            car_number
        } = req.body;

        // 판매자 확인
        const seller = await User.findById(seller_id);
        if (!seller) {
            return res.status(404).json({ error: '해당 판매자 ID를 가진 사용자가 존재하지 않습니다.' });
        }

        // car_number 자동증가 (입력받은 car_number는 사용하지 않는게 맞음)
        let counter = await Counter.findOneAndUpdate(
            { name: 'car_number' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const generatedCarNumber = String(counter.seq).padStart(7, '0');

        // 이미지 파일명 배열
        let images = [];
        if (req.file) {
            images.push(req.file.filename);
        }

        const newCar = new Car({
            seller_id,
            car_model,
            car_year,
            car_number: generatedCarNumber,
            price,
            images,
            description,
            type,
            manufacturer
        });

        await newCar.save();

        res.status(201).json({
            message: '차량 등록 성공',
            car_id: newCar._id,
            car_number: generatedCarNumber
        });
    } catch (err) {
        res.status(500).json({ error: '차량 등록 실패', detail: err.message });
    }
});

module.exports = router;
