import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function App() {
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    fetch("/api/expenses/total-spend")
      .then((res) => res.json())
      .then((data) => setTotalSpend(data.totalSpend));
  }, []);

  return (
    <main className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Total Spend</CardTitle>
          <CardDescription>
            The total amount of money you have spent so far.
          </CardDescription>
        </CardHeader>
        <CardContent>{totalSpend}</CardContent>
      </Card>
    </main>
  );
}

export default App;
