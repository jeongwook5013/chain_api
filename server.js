const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 미들웨어
app.use(cors());
app.use(express.json()); // JSON 요청 파싱

// ✅ MongoDB 연결
mongoose.connect('mongodb+srv://leehj:qwertyasdfzxcv@cluster.d2zx1ey.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB 연결 성공');
}).catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
});

// ✅ 라우터 연결
const userservice = require('./service/user.service');   // 일반 회원가입/로그인, OAuth 회원등록 등
const oauthservice = require('./service/genesis.service'); // OAuth 인증 흐름 전용 (access, refresh 등)

app.use('/api/users', userservice); // ex: POST /api/users/register
app.use('/oauth', oauthservice);    // ex: GET /oauth/access

// ✅ 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
