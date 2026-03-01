import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "accept": "application/json",
  }
});

export const api = {
  createBook: async (book) => {
    const response = await apiClient.post("/books", book);
    return response.data;
  },
  
  getBooks: async () => {
    const response = await apiClient.get("/books");
    return response.data;
  },
  
  getBookById: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },
  
  updateBook: async (id, book) => {
    const response = await apiClient.patch(`/books/${id}`, book);
    return response.data;
  },
  
  deleteBook: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  }
};