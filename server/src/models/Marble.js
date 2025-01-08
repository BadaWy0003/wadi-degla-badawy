const mongoose = require('mongoose');

const finishSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  { _id: false },
);

const marbleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    finishes: [finishSchema],
  },
  { timestamps: true },
);

const Marble = mongoose.model('Marble', marbleSchema);

module.exports = Marble;
