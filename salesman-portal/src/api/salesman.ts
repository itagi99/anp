import axios from 'axios';
import api from './client';

export interface Salesman {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
}

export const login = async (employee_id: string, password: string) => {
  const { data } = await api.post('/salesman/login', { employee_id, password });
  return data as { token: string; salesman: Salesman };
};

export const getDashboard = async () => {
  const { data } = await api.get('/salesman/dashboard');
  return data;
};

export const punch = async (type: 'in' | 'out', lat?: number, lng?: number) => {
  const { data } = await api.post('/salesman/punch', { type, lat, lng });
  return data;
};

export const getAttendance = async () => {
  const { data } = await api.get('/salesman/attendance');
  return data as { attendance: any[] };
};

export const getBeatCustomers = async (beat_id?: string) => {
  const { data } = await api.get('/salesman/beat/customers', { params: beat_id ? { beat_id } : {} });
  return data;
};

export const getCustomers = async () => {
  const { data } = await api.get('/salesman/customers');
  return data as { customers: any[] };
};

export const getProducts = async (search?: string) => {
  const { data } = await api.get('/salesman/products', { params: search ? { search } : {} });
  return data as { products: any[] };
};

export const createOrder = async (customer_id: string, items: any[]) => {
  const { data } = await api.post('/salesman/orders', { customer_id, items });
  return data;
};

export const getOrders = async () => {
  const { data } = await api.get('/salesman/orders');
  return data as { orders: any[] };
};

export const getOrderDetail = async (id: string) => {
  const { data } = await api.get(`/salesman/orders/${id}`);
  return data as { order: any };
};

export const getReports = async () => {
  const { data } = await api.get('/salesman/reports');
  return data;
};

export const getNotifications = async () => {
  const { data } = await api.get('/salesman/notifications');
  return data as { notifications: any[] };
};

export { axios };
