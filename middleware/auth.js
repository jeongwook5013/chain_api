const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰

    if (!token) return res.status(401).json({ error: '토큰이 없습니다.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
        req.user = user; // user.id 로 사용 가능
        next();
    });
};

module.exports = authenticateToken;
