import express from "express";
import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getUserTransactions,
} from "../controllers/transactionControllers.js";

const transactionRouter = express.Router();

transactionRouter.post("/", createTransaction);
transactionRouter.post("/user-transactions", getUserTransactions);

transactionRouter.get("/", getAllTransactions);
transactionRouter.get("/:id", getTransactionById);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;
