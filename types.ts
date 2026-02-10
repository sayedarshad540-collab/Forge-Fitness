
export enum MembershipType {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly'
}

export interface MembershipPlan {
  id: string;
  name: MembershipType;
  price: number;
  durationMonths: number;
  features: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  membershipType?: MembershipType;
  membershipExpiry?: string;
  joinedAt: string;
  password?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  plan: MembershipType;
  status: 'Completed' | 'Pending';
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkInTime: string;
}

export interface DBState {
  users: User[];
  payments: Payment[];
  attendance: Attendance[];
  currentUser: User | null;
}
