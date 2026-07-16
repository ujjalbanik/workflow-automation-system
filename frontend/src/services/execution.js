import api from "../api/axios";

export const getDashboardStats = async () => {
  const { data } = await api.get("/dashboard/");
  return data;
};

export const getExecutions = async () => {
  const { data } = await api.get("/executions/");
  return data.results;
};

export const getExecution = async (id) => {
  const { data } = await api.get(`/executions/${id}/`);
  return data;
};
