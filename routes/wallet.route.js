const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // JWT 인증 미들웨어
const userService = require('../service/user.service'); // 사용자 서비스 로직

// ✅ 지갑 주소 업데이트 라우트
router.post('/wallet', verifyToken, async (req, res) => {
  const userId = req.userId;
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ error: '지갑 주소가 없습니다.' });
  }

  try {
    const updatedUser = await userService.updateWalletAddress(userId, wallet_address);
    res.json({ message: '지갑 주소 저장 성공', address: updatedUser.wallet.wallet_address });
  } catch (error) {
    res.status(500).json({ error: 'DB 업데이트 실패', detail: error.message });
  }
});

module.exports = router;
