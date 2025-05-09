import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

export const expensesRoute = new Hono();

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3),
  description: z.string(),
  amount: z.number().positive(),
  category: z.string(),
});

const createExpenseSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

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
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const { title, description, amount, category } = c.req.valid("json");
    const newExpense: Expense = {
      id: fakeExpenses.length + 1,
      title,
      description,
      amount,
      category,
    };
    fakeExpenses.push(newExpense);
    return c.json({ expense: newExpense }, 201);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const expense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense });
  });
