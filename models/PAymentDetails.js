const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserLogin",
    },
    transactionId: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  amount: { type: Number,},
  credits: { type: Number,},
  currency: { type: String,},
  customerId: { type: String, default: null },
  paymentMethod: {
    id: { type: String },
    type: { type: String },
    card: {
      brand: { type: String },
      last4: { type: String },
      exp_month: { type: Number },
      exp_year: { type: Number },
      country: { type: String },
      fingerprint: { type: String },
      checks: {
        cvc_check: { type: String },
        address_line1_check: { type: String },
        address_postal_code_check: { type: String }
      }
    }
  },
  status: { type: String, },
  created: { type: Date, },
  updated: { type: Date, },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model("Payment", PaymentSchema);
