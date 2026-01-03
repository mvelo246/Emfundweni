import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// School Info API
export const getSchoolInfo = () => api.get('/school-info');
export const updateSchoolInfo = (data: any) => api.put('/school-info', data);

// Top Students API
export const getTopStudents = () => api.get('/top-students');
export const getTopStudentsByYear = (year: number) => api.get(`/top-students/year/${year}`);
export const addStudent = (data: any) => api.post('/top-students', data);
export const updateStudent = (id: number, data: any) => api.put(`/top-students/${id}`, data);
export const deleteStudent = (id: number) => api.delete(`/top-students/${id}`);

// Auth API
export const login = (username: string, password: string) => 
  api.post('/auth/login', { username, password });
export const verifyToken = () => api.post('/auth/verify');

export default api;

