const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const WalletSchema = new mongoose.Schema({
    wallet_address: { type: String, required: true },
    balance: { type: Number, default: 0 }
}, { _id: false });

const UserCarSchema = new mongoose.Schema({
    car_id: { type: String },
    car_model: { type: String, required: true },
    car_year: { type: Number, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    phone_number: { type: String, required: false, unique: false },

    // 일반 로그인 사용자
    login_id: { type: String, required: false, unique: true },
    password: { type: String, required: false },

    // OAuth 사용자 정보
    oauth_provider: { type: String, enum: ['genesis', 'hyundai', 'google', null], default: null },
    oauth_id: { type: String, required: false },

    // 차량 정보 및 지갑 정보
    user_cars: { type: [UserCarSchema], required: false },
    wallet: { type: WalletSchema, required: false }
});

// ✅ 이 줄이 반드시 필요합니다!
module.exports = mongoose.model('User', UserSchema);
