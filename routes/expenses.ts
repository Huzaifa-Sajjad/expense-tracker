import { Hono } from "hono";

export const expensesRoute = new Hono();

type Expense = {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
};

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    description: "Weekly groceries",
    amount: 100,
    category: "Food",
  },
  {
    id: 2,
    title: "Rent",
    description: "Monthly rent",
    amount: 1200,
    category: "Housing",
  },
  {
    id: 3,
    title: "Utilities",
    description: "Electricity and water bills",
    amount: 200,
    category: "Utilities",
  },
  {
    id: 4,
    title: "Transportation",
    description: "Gas and public transport",
    amount: 150,
    category: "Transport",
  },
];

expensesRoute
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", async (c) => {
    const { title, description, amount, category } = await c.req.json();
    const newExpense: Expense = {
      id: fakeExpenses.length + 1,
      title,
      description,
      amount,
      category,
    };
    fakeExpenses.push(newExpense);
    return c.json({ expenses: fakeExpenses });
  });
