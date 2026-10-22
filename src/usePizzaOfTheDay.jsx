import { useState, useEffect } from "react";

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);

  async function fetchPizzaOfTheDay() {
    const response = await fetch("/api/pizza-of-the-day");
    const data = await response.json();
    setPizzaOfTheDay(data);
  }

  useEffect(() => {
    fetchPizzaOfTheDay();
  }, []);

  return pizzaOfTheDay;
};
