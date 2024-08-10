import { Request, Response } from "express";
import OrderModel from "../models/orders.model";

import ProductsModel from "../models/products.model";
import { Types } from "mongoose";
import UserModel from "../models/user.model";
import { IReqUser } from "../utils/interfaces";

import * as Yup from "yup";

const orderItemSchema = Yup.object().shape({
  productId: Yup.string().required(),
  quantity: Yup.number().required().min(1).max(5),
});

const orderValidationSchema = Yup.object().shape({
  grandTotal: Yup.number().required(),
  orderItem: Yup.array().of(orderItemSchema).required().min(1),
  status: Yup.string().required(),
});

interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
}

export default {
  async createOrder(req: Request, res: Response) {
    await orderValidationSchema.validate(req.body);
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
      }
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
      
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({
          data: error.errors,
          message: "Failed create order",
        });
        return;
      }
    }
  },
  async historyOrder(req: Request, res: Response) {
    try {
      const userId = (req as IReqUser).user.id;
      const user = await UserModel.findById(userId);

      const { limit = 10, page = 1 } = req.query as unknown as IPaginationQuery;

      const query = { createdBy: user };

      const result = await OrderModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAd: -1 });
      const total = await ProductsModel.countDocuments(query);

      res.status(200).json({
        data: result,
        message: "Succes get order",
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get history order",
      });
    }
  },
};
