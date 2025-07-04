# 💰 BudgetBoard

A modern, responsive budget tracking and expense management application built with Next.js 14, TypeScript, and MongoDB. BudgetBoard helps you track expenses, set budgets, and visualize your spending patterns with beautiful charts and intuitive interfaces.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![ShadCN/UI](https://img.shields.io/badge/ShadCN-UI-000000)

## ✨ Features

### 📊 Dashboard
- **Real-time budget overview** with spending summaries
- **Interactive charts** including pie charts, bar charts, and trend analysis
- **Budget vs. actual spending** comparisons
- **Category-wise progress bars** with visual indicators
- **Over-budget warnings** with toast notifications
- **Recent transactions** feed

### 💳 Transaction Management
- **Add, edit, and delete** transactions
- **Advanced filtering** by category, date range, amount, and description
- **Responsive table** with pagination and sorting
- **Real-time updates** after transaction changes

### 🎯 Budget Planning
- **Monthly budget setting** for all categories
- **Category-based budgeting** with predefined categories
- **Budget progress tracking** with visual indicators
- **Responsive grid layout** for all screen sizes

### 📱 Responsive Design
- **Mobile-first approach** using Tailwind CSS
- **Adaptive layouts** for mobile, tablet, and desktop
- **Touch-friendly interfaces** with proper spacing
- **Collapsible sidebar** with mobile optimization

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm**, **yarn**, **pnpm**, or **bun**
- **MongoDB** database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BudgetBoard/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/budgetboard
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   ├── page.tsx             # Main dashboard page
│   │   ├── transactions/        # Transactions page
│   │   │   └── page.tsx
│   │   └── budget/              # Budget management page
│   │       └── page.tsx
│   ├── api/                     # API routes
│   │   ├── transactions/        # Transaction CRUD operations
│   │   ├── budgets/             # Budget management
│   │   └── dashboard-summary/   # Dashboard data aggregation
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                  # Reusable components
│   ├── ui/                      # ShadCN/UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── sidebar.tsx
│   │   ├── table.tsx
│   │   └── chart.tsx
│   └── features/                # Feature-specific components
│       ├── dashboard/           # Dashboard components
│       │   ├── CategoryPieChart.tsx
│       │   ├── BudgetVsActualChart.tsx
│       │   ├── SpendingTrendsChart.tsx
│       │   ├── MonthlyExpensesChart.tsx
│       │   ├── BudgetProgressBars.tsx
│       │   ├── RecentTransactions.tsx
│       │   └── DashboardSidebar.tsx
│       └── transactions/        # Transaction components
│           ├── AddTransactionDialog.tsx
│           ├── TransactionForm.tsx
│           └── TransactionsTable.tsx
├── lib/                         # Utility libraries
│   ├── utils.ts                 # Common utilities
│   ├── constants.ts             # App constants
│   └── mongodb.ts               # Database connection
├── hooks/                       # Custom React hooks
│   └── use-mobile.ts            # Mobile detection hook
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Global types
└── public/                      # Static assets
```

## 🎨 UI Components

BudgetBoard uses **ShadCN/UI** components built on top of **Radix UI** and styled with **Tailwind CSS**:

### Core Components
- **Sidebar**: Collapsible navigation with mobile support
- **Cards**: Clean containers for content sections
- **Tables**: Responsive data tables with filtering
- **Charts**: Interactive visualizations using Recharts
- **Dialogs**: Modal forms for adding/editing data
- **Progress Bars**: Visual budget tracking indicators

### Responsive Design
- **Mobile breakpoint**: 768px (using `useIsMobile` hook)
- **Adaptive grids**: 1-4 columns based on screen size
- **Touch-friendly**: Proper spacing and interaction areas
- **Sidebar behavior**: Auto-collapse on mobile

## 📊 Charts & Visualizations

### Available Chart Types
1. **Category Pie Chart**: Spending distribution by category
2. **Budget vs Actual Chart**: Comparison bar chart
3. **Spending Trends Chart**: Time-series spending patterns
4. **Monthly Expenses Chart**: Month-over-month analysis
5. **Budget Progress Bars**: Category-wise progress tracking

### Chart Configuration
Charts use the `chart.tsx` component with:
- **Responsive containers**: Auto-resize based on viewport
- **Theme support**: Light/dark mode compatibility
- **Interactive tooltips**: Detailed data on hover
- **Custom styling**: CSS variables for theming

## 🔧 API Routes

### Transactions API (`/api/transactions`)
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets API (`/api/budgets`)
- `GET /api/budgets?month=YYYY-MM` - Fetch monthly budgets
- `POST /api/budgets` - Create/update budget

### Dashboard API (`/api/dashboard-summary`)
- `GET /api/dashboard-summary?month=YYYY-MM` - Get dashboard data

## 💾 Database Schema

### Transaction Model
```typescript
interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Budget Model
```typescript
interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Categories

Predefined spending categories:
- **Food** - Groceries, restaurants, dining
- **Transport** - Gas, public transport, car maintenance
- **Utilities** - Electricity, water, internet, phone
- **Entertainment** - Movies, games, subscriptions
- **Health** - Medical, pharmacy, fitness
- **Education** - Books, courses, learning materials
- **Shopping** - Clothes, electronics, general purchases
- **Other** - Miscellaneous expenses

## 📱 Mobile Optimization

### Responsive Features
- **Collapsible sidebar**: Automatically hides on mobile
- **Touch-friendly buttons**: Larger tap targets
- **Responsive grids**: 1-4 columns based on screen size
- **Mobile-first design**: Optimized for smaller screens
- **Swipe gestures**: Supported in tables and modals

### Mobile Hook Usage
```typescript
import { useIsMobile } from '@/hooks/use-mobile';

const isMobile = useIsMobile(); // Returns true for screens < 768px
```

## 🛠️ Development

### Adding New Components
1. **UI Components**: Add to `components/ui/` following ShadCN patterns
2. **Feature Components**: Add to `components/features/[feature]/`
3. **Export**: Update relevant index files

### Adding New Charts
1. Create component in `components/features/dashboard/`
2. Use the base `Chart` component from `components/ui/chart.tsx`
3. Configure with proper chart data interface
4. Add to dashboard layout

### Styling Guidelines
- Use **Tailwind CSS** for all styling
- Follow **mobile-first** responsive design
- Use **CSS variables** for theming
- Maintain **consistent spacing** (4px grid)

## 🚀 Deployment

### Build the Application
```bash
npm run build
npm run start
```

### Environment Variables
Required for production:
```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Deployment Platforms
- **Vercel** (recommended): Automatic deployments from Git
- **Netlify**: Alternative hosting platform
- **Docker**: Containerized deployment option

## 📖 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Features and API reference
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### Component Libraries
- [ShadCN/UI](https://ui.shadcn.com/) - Component library documentation
- [Radix UI](https://www.radix-ui.com/) - Primitive components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### Charts & Visualization
- [Recharts](https://recharts.org/) - Chart library documentation
- [Chart.js](https://www.chartjs.org/) - Alternative charting library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Style
- Use **TypeScript** for type safety
- Follow **ESLint** and **Prettier** configurations
- Write **descriptive commit messages**
- Add **JSDoc comments** for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**BudgetBoard** - Take control of your finances with modern web technology! 💰✨
