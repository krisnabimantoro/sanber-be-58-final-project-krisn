import exp from "constants";
import mongoose from "mongoose";
import { ref } from "yup";

const Schema = mongoose.Schema;

import mail from "../utils/mail/mail";
import UserModel from "./user.model";

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
    min: 1,
    max: 5,
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

orderSchema.post("save", async function (doc, next) {
  const order = doc;
  // console.log("Send email to", user.email)
  const user = await UserModel.findById(order.createdBy);
  const content = await mail.render("order.ejs", {
    customerName: user?.fullName,
    orderItems: order.orderItem,
    grandTotal: order.grandTotal,
    contactEmail:"krisna",
    companyName: "cek",
    year:2024
  });
  
  await mail.send({
    to:"krisnabmntr49@gmail.com",
    subject: "Your Order Confirmation",
    content
  });
  next()
});
const OrderModel = mongoose.model("orders", orderSchema);

export default OrderModel;
