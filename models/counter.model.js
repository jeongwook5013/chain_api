const mongoose = require('mongoose');

// 카운터 스키마 정의
const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // 카운터 이름 (예: 'car_number')
    seq: { type: Number, default: 1 }                     // 현재 시퀀스 값
});

// ✅ 카운터 값을 증가시키고 새로운 값을 반환하는 static 메서드 추가
CounterSchema.statics.getNextSequence = async function (name) {
    const counter = await this.findOneAndUpdate(
        { name },                      // 카운터 이름으로 찾기 (예: 'car_number')
        { $inc: { seq: 1 } },          // seq 값을 1 증가
        { new: true, upsert: true }    // 없으면 생성 (upsert), 최신값 반환 (new)
    );
    return counter.seq;
};

// 모델 export
module.exports = mongoose.model('Counter', CounterSchema);
