import axios from "axios";

export const getQuestions = async (amount = 10) => {
  const res = await axios.get(
    `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
  );
  return res.data.results;
};
