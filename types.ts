
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinedAt: string;
  contact?: string;
}

export interface Deposit {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: string;
  entryDate: string;
  notes?: string;
  receiptImage?: string;
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface Installment {
  id: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'PENDING' | 'PAID';
  paidDate?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  totalAmount: number; // 100%
  recoverableAmount: number; // 70%
  waiverAmount: number; // 30%
  remainingBalance: number; // Of the recoverable 70%
  durationMonths: number;
  startDate: string;
  status: LoanStatus;
  installments: Installment[];
}

export interface DevProfile {
  name: string;
  title: string;
  email: string;
  image: string;
  bio: string;
}

export interface FinancialSummary {
  currentBalance: number;
  totalDeposits: number;
  totalLoansIssued: number;
  totalRecoveries: number;
  totalWaivers: number;
}
