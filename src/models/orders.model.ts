import exp from "constants";
import mongoose from "mongoose";
import { ref } from "yup";

const Schema = mongoose.Schema;

// interface item {
//   name: String;
//   productId: Schema.Types.ObjectId;
//   price: number;
//   quantity: number;
// }

// const response

const itemSchema = new Schema({
  name: {
    type: String,
    ref: "products",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  price: {
    type: Number,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema({
  grandTotal: {
    type: Number,
    required: true,
  },
  orderItem: {
    type: [itemSchema],
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  status: {
    type: String,
    enum: ["pending", "complete", "cancelled"],
    default: "pending",
  },
});

const OrderModel = mongoose.model("orders", orderSchema);

export default OrderModel;
