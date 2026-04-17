import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getCourses = () => api.get('/courses');
export const createCourse = (data) => api.post('/courses', data);
export const getClasses = () => api.get('/classes');
export const createClass = (data) => api.post('/classes', data);
export const updateClass = (id, data) => api.put(`/classes/${id}`, data);
export const markAttendance = (data) => api.post('/attendance', data);
export const getStudentAttendance = (studentId) => api.get(`/attendance/student/${studentId}`);
export const getSessionAttendance = (sessionId) => api.get(`/attendance/session/${sessionId}`);

export default api;
