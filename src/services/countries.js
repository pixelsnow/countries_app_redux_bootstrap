import axios from "axios";

const baseUrl = "https://restcountries.com/v3.1/all";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getSingle = async (country) => {
  const response = await axios.get(baseUrl + "/name/" + country);
  return response.data;
};

const exportedObject = { getAll, getSingle };

export default exportedObject;
