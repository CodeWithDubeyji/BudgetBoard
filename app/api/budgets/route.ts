import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Budget } from '@/lib/models'; // Use the named import for Budget
import { z } from 'zod';

// Zod schema for input validation
const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
});

// --- GET: Fetch budgets for a specific month ---
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { message: 'Month query parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate month format just in case
    if (!/^\d{4}-\d{2}$/.test(month)) {
         return NextResponse.json({ message: 'Invalid month format. Use YYYY-MM.' }, { status: 400 });
    }

    const budgets = await Budget.find({ month: month });
    return NextResponse.json(budgets, { status: 200 });

  } catch (error) {
    console.error('API_BUDGETS_GET_ERROR:', error);
    return NextResponse.json({ message: 'Failed to fetch budgets' }, { status: 500 });
  }
}


// --- POST: Create or update a budget (Upsert) ---
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const validation = budgetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { category, month, amount } = validation.data;

    // Find a budget by category and month and update it, or create it if it doesn't exist.
    const updatedBudget = await Budget.findOneAndUpdate(
      { category: category, month: month }, // The filter to find the document
      { $set: { amount: amount } }, // The data to update or set
      { 
        upsert: true,       // If no document is found, insert a new one
        new: true,          // Return the new or updated document, not the old one
        runValidators: true // Ensure schema validations are run on update
      }
    );

    return NextResponse.json(updatedBudget, { status: 201 });

  } catch (error) {
    console.error('API_BUDGETS_POST_ERROR:', error);
    return NextResponse.json({ message: 'Failed to create or update budget' }, { status: 500 });
  }
}