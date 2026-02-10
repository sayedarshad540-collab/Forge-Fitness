
import { MembershipType, MembershipPlan } from './types';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-monthly',
    name: MembershipType.MONTHLY,
    price: 1500,
    durationMonths: 1,
    features: ['Access to all gym equipment', 'Standard Locker room access', '1 Free Trainer Consultation']
  },
  {
    id: 'plan-quarterly',
    name: MembershipType.QUARTERLY,
    price: 4000,
    durationMonths: 3,
    features: ['Everything in Monthly', '2 Guest Passes per month', 'Diet Plan Consultation', 'Steam Room Access']
  },
  {
    id: 'plan-yearly',
    name: MembershipType.YEARLY,
    price: 14000,
    durationMonths: 12,
    features: ['Everything in Quarterly', 'Unlimited Guest Passes', 'Personal Trainer (2 sessions/mo)', 'Exclusive Forge Gear Kit']
  }
];

export const ADMIN_CREDENTIALS = {
  email: 'admin@forge.com',
  password: 'admin'
};
