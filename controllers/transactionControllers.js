import Transaction from "../models/transactionModel.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("userId")
            .populate("classId")
            .populate("courseId");
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate("userId")
            .populate("classId")
            .populate("courseId");
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update transaction
export const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getUserTransactions = async (req, res) => {
    try {

        const { userId } = req.body;

        const transactions = await Transaction.find({ userId }).populate(["courseId", "classId"]);

        return res.status(200).json({ payload: transactions })
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}