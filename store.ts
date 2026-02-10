
import { DBState, User, Payment, Attendance, MembershipType } from './types';
import { ADMIN_CREDENTIALS } from './constants';

const DB_KEY = 'forge_gym_db';

const initialState: DBState = {
  users: [
    {
      id: 'admin-001',
      name: 'Forge Admin',
      email: ADMIN_CREDENTIALS.email,
      role: 'admin',
      joinedAt: new Date().toISOString(),
      password: ADMIN_CREDENTIALS.password
    }
  ],
  payments: [],
  attendance: [],
  currentUser: null
};

export const getDB = (): DBState => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : initialState;
};

export const saveDB = (state: DBState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(state));
};

export const addUser = (user: Omit<User, 'id' | 'joinedAt'>): User => {
  const db = getDB();
  const newUser: User = {
    ...user,
    id: `u-${Date.now()}`,
    joinedAt: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
};

export const logAttendance = (userId: string) => {
  const db = getDB();
  const now = new Date();
  const newAttendance: Attendance = {
    id: `att-${Date.now()}`,
    userId,
    date: now.toISOString().split('T')[0],
    checkInTime: now.toLocaleTimeString()
  };
  db.attendance.push(newAttendance);
  saveDB(db);
  return newAttendance;
};

export const addPayment = (payment: Omit<Payment, 'id' | 'date' | 'status'>) => {
  const db = getDB();
  const newPayment: Payment = {
    ...payment,
    id: `pay-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'Completed'
  };
  db.payments.push(newPayment);
  
  // Update user membership status
  const userIndex = db.users.findIndex(u => u.id === payment.userId);
  if (userIndex !== -1) {
    const expiry = new Date();
    const months = payment.plan === MembershipType.MONTHLY ? 1 : payment.plan === MembershipType.QUARTERLY ? 3 : 12;
    expiry.setMonth(expiry.getMonth() + months);
    db.users[userIndex].membershipType = payment.plan;
    db.users[userIndex].membershipExpiry = expiry.toISOString();
  }
  
  saveDB(db);
  return newPayment;
};
