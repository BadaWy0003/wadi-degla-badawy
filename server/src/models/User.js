const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTypeEnum = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'CUSTOMER'];

const userSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  taxId: { type: String },
  password: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  salespersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesPerson' },
  userType: { type: String, enum: UserTypeEnum, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
