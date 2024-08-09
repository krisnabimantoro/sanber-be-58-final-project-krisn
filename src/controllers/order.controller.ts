import { Request, Response } from "express";
import OrderModel from "../models/orders.model";

import ProductsModel from "../models/products.model";
import { Types } from "mongoose";
import UserModel from "../models/user.model";
import { IReqUser } from "../utils/interfaces";

// Define interface for OrderItem
// interface OrderItem {
//   name: string;
//   productId: Types.ObjectId;
//   price: number;
//   quantity: number;
// }

// // Define interface for the request body
// interface OrderRequestBody {
//   grandTotal?: number; // Optional, can be calculated on server
//   orderItem: OrderItem[];
//   createdBy: Types.ObjectId;
//   status: "pending" | "completed" | "cancelled";
// }

export default {
  async createOrder(req: Request, res: Response) {
    const { grandTotal, orderItem, status } = req.body;

    const userId = (req as IReqUser).user.id;
    const createdBy = await UserModel.findById(userId);
  
    try {

      for (let item of orderItem) {
        const product = await ProductsModel.findById(item.productId);

        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }

        if (item.quantity > product.qty) {
          return res.status(400).json({ message: `Quantity for product ${product.name} exceeds available stock` });
        }

        item.name = product.name;
        item.price = product.price;
        // grandTotal += item.price * item.quantity;

        // Update product stock
        product.qty -= item.quantity;
        await product.save();

        const result = new OrderModel({
          grandTotal,
          orderItem,
          createdBy,
          status,
        });

        await result.save();
        res.status(201).json({
          data: result,
          message: "Succes create order",
        });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async historyOrder(req: Request, res: Response) {
    try {
    } catch (error) {}
  },
};
