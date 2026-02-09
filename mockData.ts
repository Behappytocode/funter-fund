
import { User, UserRole, Deposit, Loan, LoanStatus, DevProfile } from './types';

// Fix: Removed 'status' property and 'UserStatus' import as they are not defined in User interface or types.ts
export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Manager',
    email: 'admin@funters.com',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/200',
    joinedAt: '2023-01-01',
    contact: '+92 300 1234567'
  },
  {
    id: 'u2',
    name: 'Ahmed Khan',
    email: 'ahmed@funters.com',
    role: UserRole.MEMBER,
    avatar: 'https://picsum.photos/seed/member1/200',
    joinedAt: '2023-02-15',
    contact: '+92 321 7654321'
  },
  {
    id: 'u3',
    name: 'Sara Ali',
    email: 'sara@funters.com',
    role: UserRole.MEMBER,
    avatar: 'https://picsum.photos/seed/member2/200',
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
  name: 'Senior Systems Architect',
  title: 'Full Stack Engineer',
  email: 'dev@funtersfund.io',
  image: 'https://picsum.photos/seed/dev/300',
  bio: 'Specializing in robust communal financial systems and secure mobile architectures.'
};
