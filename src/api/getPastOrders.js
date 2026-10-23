const getPastOrders = async (page) => {
  const response = await fetch(`/api/past-orders?page=${page}`);
  const data = await response.json();
  return data;
};

export default getPastOrders;
