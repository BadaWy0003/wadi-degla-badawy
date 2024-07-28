const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salespersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesPerson', required: true },
  status: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  orderNumber: { type: String, required: true },
  shippingType: { type: String },
  shippingPort: { type: String },
  PaymentTerms: { type: String },
  items: [orderItemSchema],
  comments: { type: String },
  shipmentTotalContainers: { type: Number },
  totalBoxes: { type: Number },
  netWeight: { type: Number },
  grossWeight: { type: Number },
  discount: { type: Number },
  total: { type: Number },
  totalMeters: { type: Number },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
