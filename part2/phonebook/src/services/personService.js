import axios from "axios";
// const baseUrl = "http://localhost:3001/api/persons";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
  // .catch((error) => console.log(error.response.data.error));
};

const update = (id, newNumber) => {
  const request = axios.put(`${baseUrl}/${id}`, newNumber);
  return request.then((response) => response.data);
};

const del = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, update, del };
