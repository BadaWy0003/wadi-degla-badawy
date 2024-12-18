const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  rnc: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  whatsapp: { type: String },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  address: { type: String },
  port: { type: String, required: true },
  password: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  salespersonId: { type: Schema.Types.ObjectId, ref: 'SalesPerson' },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
