const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    customerAddress: {
      type: String,
      required: true,
      trim: true
    },

    items: {
      type: [
        {
          id: {
            type: Number
          },
          name: {
            type: String,
            required: true
          },
          price: {
            type: Number,
            required: true,
            min: 0
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
              validator: Number.isInteger,
              message: "Quantity must be a whole number"
            }
          }
        }
      ],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item"
      }
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    orderDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
