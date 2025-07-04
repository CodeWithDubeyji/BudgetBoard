import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models';
import { z } from 'zod';

// Zod schema for input validation
const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required').max(100),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  category: z.string().min(1, 'Category is required'),
});


// --- GET: Fetch all transactions ---
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).sort({ date: -1 }); // Sort by most recent
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('API_TRANSACTIONS_GET_ERROR:', error);
    return NextResponse.json({ message: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// --- POST: Create a new transaction ---
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate request body against Zod schema
    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.log('Validated transaction data:', validation.data);
    
    // Create new transaction using the validated data
    const newTransaction = await Transaction.create({
        ...validation.data,
        date: new Date(validation.data.date), // Convert string date to Date object
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('API_TRANSACTIONS_POST_ERROR:', error);
    return NextResponse.json({ message: 'Failed to create transaction' }, { status: 500 });
  }
}