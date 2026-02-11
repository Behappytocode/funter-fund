import { User, UserRole, Deposit, Loan, LoanStatus, DevProfile } from './types';

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Manager',
    email: 'admin@funters.com',
    role: UserRole.ADMIN,
    avatar: '👑',
    joinedAt: '2023-01-01',
    contact: '+92 300 1234567'
  },
  {
    id: 'u2',
    name: 'Ahmed Khan',
    email: 'ahmed@funters.com',
    role: UserRole.MEMBER,
    avatar: '🧔',
    joinedAt: '2023-02-15',
    contact: '+92 321 7654321'
  },
  {
    id: 'u3',
    name: 'Sara Ali',
    email: 'sara@funters.com',
    role: UserRole.MEMBER,
    avatar: '👩',
    joinedAt: '2024-05-10'
  }
];

export const SEED_DEPOSITS: Deposit[] = [
  {
    id: 'd1',
    memberId: 'u2',
    memberName: 'Ahmed Khan',
    amount: 5000,
    paymentDate: '2024-01-05',
    entryDate: '2024-01-06',
    notes: 'Monthly contribution Jan',
    receiptImage: 'https://picsum.photos/seed/receipt1/400/600'
  },
  {
    id: 'd2',
    memberId: 'u2',
    memberName: 'Ahmed Khan',
    amount: 5000,
    paymentDate: '2024-02-05',
    entryDate: '2024-02-05',
    notes: 'Monthly contribution Feb',
    receiptImage: 'https://picsum.photos/seed/receipt2/400/600'
  }
];

export const SEED_LOANS: Loan[] = [
  {
    id: 'l1',
    memberId: 'u2',
    memberName: 'Ahmed Khan',
    totalAmount: 50000,
    recoverableAmount: 35000,
    waiverAmount: 15000,
    remainingBalance: 35000,
    durationMonths: 10,
    startDate: '2024-03-01',
    status: LoanStatus.ACTIVE,
    installments: Array.from({ length: 10 }).map((_, i) => ({
      id: `i1-${i}`,
      dueDate: `2024-${String(4 + i).padStart(2, '0')}-01`,
      amount: 3500,
      paidAmount: 0,
      status: 'PENDING'
    }))
  }
];

export const INITIAL_DEV_PROFILE: DevProfile = {
  name: 'Abubakar',
  title: 'Full Stack Developer',
  email: 'abubakar@funters.com',
  image: '👨‍💻',
  bio: "I'm Abubakar, the developer behind this Fund Manager platform. I am a Full Stack Developer dedicated to building robust, scalable applications that simplify community management and financial coordination."
};