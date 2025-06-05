const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/tb_user.model');
const { jwtSecret } = require('../config/jwt.config');

// ✅ 회원가입
router.post('/register', async (req, res) => {
    try {
        const { login_id, password, name, phone_number, oauth_provider, oauth_id } = req.body;

        // 일반 회원만 login_id 중복 체크
        if (login_id) {
            const exists = await User.findOne({ login_id });
            if (exists) {
                return res.status(400).json({ error: '이미 존재하는 login_id입니다.' });
            }
        }

        // 패스워드 해시 (일반 사용자만 해당)
        const hashedPw = password ? await bcrypt.hash(password, 10) : null;

        // User 생성
        const user = new User({
            login_id,
            password: hashedPw,
            name,
            phone_number,
            oauth_provider: oauth_provider || null,
            oauth_id: oauth_id || null,
            wallet: req.body.wallet // wallet은 선택
        });

        await user.save();
        res.json({ message: '회원가입 성공', userId: user._id });

    } catch (err) {
        res.status(500).json({ error: '회원가입 실패', detail: err.message });
    }
});


// ✅ 로그인 (일반 사용자만)
router.post('/login', async (req, res) => {
    const { login_id, password } = req.body;

    try {
        const user = await User.findOne({ login_id });

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 비밀번호 비교
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        // JWT 발급
        const payload = {
            id: user._id
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        res.json({
            message: '로그인 성공',
            token,
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ error: '로그인 실패', detail: err.message });
    }
});

// ✅ 로그인 ( OAuth 사용자만)
router.post('/oauth/register', async (req, res) => {
    try {
        const { oauth_provider, oauth_id, name, phone_number } = req.body;

        if (!oauth_provider || !oauth_id) {
            return res.status(400).json({ error: 'oauth_provider와 oauth_id는 필수입니다.' });
        }

        // 기존 사용자 존재 여부 확인
        let user = await User.findOne({ oauth_provider, oauth_id });

        if (user) {
            return res.json({ message: '이미 등록된 사용자입니다.', userId: user._id });
        }

        // 사용자 등록
        user = new User({
            name,
            phone_number,
            oauth_provider,
            oauth_id
        });

        await user.save();

        res.status(201).json({
            message: 'OAuth 사용자 등록 완료',
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ error: '등록 실패', detail: err.message });
    }
});

module.exports = router;
