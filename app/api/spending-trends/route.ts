import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models';
import { Budget } from '@/lib/models'; // Make sure Budget is a named export from models.ts

export async function GET() {
  try {
    await connectDB();

    // --- Query 1: Aggregate total expenses per month from Transactions ---
    const monthlyExpenses = await Transaction.aggregate([
      {
        $project: {
          amount: 1,
          month: { $dateToString: { format: "%Y-%m", date: "$date" } },
        },
      },
      {
        $group: {
          _id: '$month',
          expenses: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Query 2: Aggregate total budget per month from Budgets ---
    // A user might set budgets category-by-category, so we must sum them up.
    const monthlyBudgets = await Budget.aggregate([
      {
        $group: {
          _id: '$month',
          budget: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Merge the two datasets in your application logic ---
    // This is often clearer and more maintainable than a complex $lookup pipeline for this use case.
    const expensesMap = new Map(monthlyExpenses.map(item => [item._id, item.expenses]));
    const budgetMap = new Map(monthlyBudgets.map(item => [item._id, item.budget]));
    
    // Get a unique, sorted list of all months present in either dataset
    const allMonths = Array.from(new Set([...expensesMap.keys(), ...budgetMap.keys()])).sort();

    const spendingTrendData = allMonths.map(month => {
      return {
        month: month,
        expenses: expensesMap.get(month) || 0,
        budget: budgetMap.get(month) || 0,
      };
    });

    return NextResponse.json(spendingTrendData, { status: 200 });

  } catch (error) {
    console.error('API_SPENDING_TRENDS_GET_ERROR:', error);
    return NextResponse.json(
      { message: 'Failed to fetch spending trend data' },
      { status: 500 }
    );
  }
}