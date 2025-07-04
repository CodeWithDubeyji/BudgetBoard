import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models';
import { z } from 'zod';
import mongoose from 'mongoose';

// Zod schema for validation (we'll make it partial for updates)
const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required').max(100),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  category: z.string().min(1, 'Category is required'), 
});

const updateTransactionSchema = transactionSchema.partial(); // All fields are now optional

interface Params {
  params: { id: string };
}

// --- GET: Fetch a single transaction by ID ---
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error('API_TRANSACTION_ID_GET_ERROR:', error);
    return NextResponse.json({ message: 'Failed to fetch transaction' }, { status: 500 });
  }
}

// --- PUT: Update a transaction by ID ---
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      validation.data,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedTransaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error('API_TRANSACTION_ID_PUT_ERROR:', error);
    return NextResponse.json({ message: 'Failed to update transaction' }, { status: 500 });
  }
}

// --- DELETE: Delete a transaction by ID ---
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('API_TRANSACTION_ID_DELETE_ERROR:', error);
    return NextResponse.json({ message: 'Failed to delete transaction' }, { status: 500 });
  }
}