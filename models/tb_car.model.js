const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  seller_id: { type: String, required: true, ref: 'User' },
  car_model: { type: String, required: true },
  car_year: { type: Number, required: true },
  car_number: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  description: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);
