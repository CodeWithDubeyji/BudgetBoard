import mongoose, { Schema, Document } from 'mongoose'

// Interface for TypeScript to understand the Transaction document shape
export interface ITransaction extends Document {
  amount: number
  date: Date
  description: string
  category: string
}

const TransactionSchema: Schema = new Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide an amount for the transaction.']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the transaction.'],
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the transaction.'],
    trim: true,
    maxlength: [100, 'Description cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    trim: true
  },
})

// This prevents Mongoose from redefining the model every time in a serverless environment
export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)

export interface IBudget extends Document {
  category: string
  amount: number
  month: string // Stored in "YYYY-MM" format
}

const BudgetSchema: Schema = new Schema({
  category: {
    type: String,
    required: [true, 'Please provide a category.']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount.'],
    min: [0, 'Budget amount cannot be negative.']
  },
  month: {
    type: String,
    required: [true, 'Please specify the month for the budget.'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format.']
  }
})

// Create a compound unique index to prevent duplicate budgets for the same category and month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true })

// Export the Budget model, preventing re-compilation
export const Budget =
  mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema)
