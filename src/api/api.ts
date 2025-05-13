import axios from "axios";

export const createPayment = async (data: any) => {
  const response = await axios.post("http://localhost:3001/api/payment", data);
  return response.data;
};
