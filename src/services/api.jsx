import axios from "axios";

const api = axios.create({
  baseURL: "https://app.e-kontroll.com.br/api/v1/metodo", // Substitua pela URL da sua API
});

export default api;
