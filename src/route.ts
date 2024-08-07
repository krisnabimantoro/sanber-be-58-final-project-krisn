import express from "express";
import authMiddleware from "./middlewares/auth.middleware";
import aclMiddleware from "./middlewares/acl.middleware";
import categoryController from "./controllers/categories.controller";
import productsController from "./controllers/products.controller";
import authController from "./controllers/auth.controller";

const router = express.Router();

router.get("/products", productsController.findAll);
router.post("/products", productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", productsController.update);
router.delete("/products/:id", productsController.delete);

router.get("/categories", categoryController.findAll);
router.post("/categories", categoryController.create);
router.get("/categories/:id", categoryController.findOne);
router.put("/categories/:id", categoryController.update);
router.delete("/categories/:id", categoryController.delete);

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get(
    "/auth/me",
    [authMiddleware, aclMiddleware(["admin"])],
    authController.me
  );
router.put("/auth/profile", authMiddleware, authController.profile);

export default router;
