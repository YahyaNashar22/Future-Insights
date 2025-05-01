import express from "express";
import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} from "../controllers/transactionControllers.js";

const transactionRouter = express.Router();

transactionRouter.post("/", createTransaction);
transactionRouter.get("/", getAllTransactions);
transactionRouter.get("/:id", getTransactionById);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;
