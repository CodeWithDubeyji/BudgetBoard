import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models';
import { Budget } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Expects "YYYY-MM" format

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { message: 'Valid month query parameter in YYYY-MM format is required' },
        { status: 400 }
      );
    }
    
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // --- 1. Fetch Budgets for the month ---
    const budgets = await Budget.find({ month: month });
    const budgetMap = new Map(budgets.map(b => [b.category, b.amount]));
    
    // --- 2. Fetch and Aggregate Transactions for the month ---
    const transactions = await Transaction.aggregate([
      // Stage 1: Filter transactions to the specified month
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      // Stage 2: Group by category and sum the amounts
      {
        $group: {
          _id: '$category', // Group by the category field
          totalSpent: { $sum: '$amount' }, // Sum the amounts for each category
        },
      },
      // Stage 3: Rename _id to category for clarity
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalSpent: 1,
        },
      },
    ]);
    
    const spendingByCategory = new Map(transactions.map(t => [t.category, t.totalSpent]));

    // --- 3. Combine Budget and Spending Data ---
    const allCategories = new Set([...budgetMap.keys(), ...spendingByCategory.keys()]);
    
    const budgetVsActual = Array.from(allCategories).map(category => ({
        category: category,
        budget: budgetMap.get(category) || 0,
        actual: spendingByCategory.get(category) || 0,
    }));

    // --- 4. Calculate Overall Totals and Recent Transactions ---
    const totalExpenses = transactions.reduce((sum, item) => sum + item.totalSpent, 0);
    const totalBudget = budgets.reduce((sum, item) => sum + item.amount, 0);
    const recentTransactions = await Transaction.find({
        date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 }).limit(5);

    // --- 5. Assemble the final response payload ---
    const responsePayload = {
        totalExpenses,
        totalBudget,
        budgetVsActual,
        recentTransactions,
    };
    
    return NextResponse.json(responsePayload, { status: 200 });

  } catch (error) {
    console.error('API_DASHBOARD_SUMMARY_ERROR:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Failed to fetch dashboard summary', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Failed to fetch dashboard summary' }, { status: 500 });
  }
}