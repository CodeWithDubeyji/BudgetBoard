import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models';

export async function GET() {
  try {
    await connectDB();

    const monthlyExpenses = await Transaction.aggregate([
      // Stage 1: Project a new field 'month' in "YYYY-MM" format
      {
        $project: {
          amount: 1, // Keep the amount field
          month: { 
            $dateToString: { format: "%Y-%m", date: "$date" } 
          },
        },
      },
      // Stage 2: Group by the new 'month' field and sum the amounts
      {
        $group: {
          _id: '$month', // Group by the "YYYY-MM" string
          expenses: { $sum: '$amount' }, // Sum the amounts for each month
        },
      },
      // Stage 3: Reshape the output to match the frontend's expectation
      {
        $project: {
          _id: 0, // Exclude the default _id field
          month: '$_id', // Rename _id to month
          expenses: 1, // Keep the calculated expenses
        },
      },
      // Stage 4: Sort the results by month chronologically
      {
        $sort: {
          month: 1, // 1 for ascending order
        },
      },
    ]);

    return NextResponse.json(monthlyExpenses, { status: 200 });

  } catch (error) {
    console.error('API_MONTHLY_EXPENSES_GET_ERROR:', error);
    return NextResponse.json(
      { message: 'Failed to fetch monthly expenses' },
      { status: 500 }
    );
  }
}