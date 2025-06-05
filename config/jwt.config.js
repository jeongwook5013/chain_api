require('dotenv').config(); 

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_default_secret_key',
    jwtExpires: process.env.JWT_EXPIRES_IN || '1d' // 1일 기본 만료
};
