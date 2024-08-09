import { Request, Response } from "express";
import OrderModel from "../models/orders.model";

import ProductsModel from "../models/products.model";
import { Types } from "mongoose";

// Define interface for OrderItem
interface OrderItem {
    name: string;
    productId: Types.ObjectId;
    price: number;
    quantity: number;
  }
  
  // Define interface for the request body
  interface OrderRequestBody {
    grandTotal?: number; // Optional, can be calculated on server
    orderItems: OrderItem[];
    createdBy: Types.ObjectId;
    status: 'pending' | 'completed' | 'cancelled';
  }

export default {
  async orderItem(req: Request, res: Response) {
    const { orderItems, createdBy, status } = req.body as OrderRequestBody;
    try {
      //   const { grandTotal, orderItem, createdBy, status = ["pending"] } = req.body;

      //   const result = await OrderModel.create(grandTotal, orderItem, createdBy, status);
      //   const result = await OrderModel.create(req.body)

      //   const user = req.user._id;
      let grandTotal = 0;

      for (let item of orderItems) {
        // Fetch product details from MongoDB
        const product = await ProductsModel.findById(item.productId);

        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }

        // Check if the requested quantity is available
        if (item.quantity > product.qty) {
          return res.status(400).json({ message: `Quantity for product ${product.name} exceeds available stock` });
        }
        grandTotal += item.price * item.quantity;

        // Update product stock
        product.qty -= item.quantity;
        await product.save();

        const result = new OrderModel({
          grandTotal,
          orderItems,
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
      res.status(400).json({
        error: error,
      });
    }
  },
};
