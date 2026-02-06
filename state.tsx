
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Deposit, Loan, FinancialSummary, UserRole, DevProfile, UserStatus, LoanStatus } from './types';
import { auth, db, googleProvider } from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { INITIAL_DEV_PROFILE } from './mockData';

interface AppState {
  currentUser: User | null;
  users: User[];
  deposits: Deposit[];
  loans: Loan[];
  devProfile: DevProfile;
  summary: FinancialSummary;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  addDeposit: (deposit: Omit<Deposit, 'id' | 'entryDate'>) => Promise<void>;
  issueLoan: (loan: Omit<Loan, 'id' | 'status' | 'installments' | 'remainingBalance' | 'recoverableAmount' | 'waiverAmount'>) => Promise<void>;
  payInstallment: (loanId: string, installmentId: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [devProfile, setDevProfile] = useState<DevProfile>(INITIAL_DEV_PROFILE);
  const [loading, setLoading] = useState(true);

  // Sync Auth State and Current User Profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
        } else {
          // This case mainly handles Google Login for first-time users
          // Email signups are handled in signupWithEmail explicitly
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New Member',
            email: firebaseUser.email || '',
            role: UserRole.MEMBER,
            status: UserStatus.PENDING,
            avatar: firebaseUser.photoURL || '',
            joinedAt: new Date().toISOString().split('T')[0]
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Sync Data Collections
  useEffect(() => {
    if (!currentUser) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => d.data() as User));
    });

    const unsubDeposits = onSnapshot(query(collection(db, 'deposits'), orderBy('paymentDate', 'desc')), (snap) => {
      setDeposits(snap.docs.map(d => ({ ...d.data(), id: d.id } as Deposit)));
    });

    const unsubLoans = onSnapshot(collection(db, 'loans'), (snap) => {
      setLoans(snap.docs.map(d => ({ ...d.data(), id: d.id } as Loan)));
    });

    return () => {
      unsubUsers();
      unsubDeposits();
      unsubLoans();
    };
  }, [currentUser]);

  const summary: FinancialSummary = (() => {
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
    const totalLoansIssued = loans.reduce((sum, l) => sum + l.totalAmount, 0);
    const totalRecoveries = loans.reduce((sum, l) => {
      return sum + l.installments.reduce((iSum, i) => iSum + i.paidAmount, 0);
    }, 0);
    const totalWaivers = loans.reduce((sum, l) => sum + l.waiverAmount, 0);
    const currentBalance = totalDeposits - totalLoansIssued + totalRecoveries;

    return {
      currentBalance,
      totalDeposits,
      totalLoansIssued,
      totalRecoveries,
      totalWaivers
    };
  })();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
      throw e;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error("Email login failed", e);
      throw e;
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });
      
      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        role,
        status: UserStatus.PENDING,
        joinedAt: new Date().toISOString().split('T')[0]
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setCurrentUser(newUser);
    } catch (e) {
      console.error("Email signup failed", e);
      throw e;
    }
  };

  const logout = () => signOut(auth);

  const approveUser = async (userId: string) => {
    await updateDoc(doc(db, 'users', userId), { status: UserStatus.APPROVED });
  };

  const rejectUser = async (userId: string) => {
    await updateDoc(doc(db, 'users', userId), { status: UserStatus.REJECTED });
  };

  const addDeposit = async (deposit: Omit<Deposit, 'id' | 'entryDate'>) => {
    await addDoc(collection(db, 'deposits'), {
      ...deposit,
      entryDate: new Date().toISOString().split('T')[0]
    });
  };

  const issueLoan = async (params: Omit<Loan, 'id' | 'status' | 'installments' | 'remainingBalance' | 'recoverableAmount' | 'waiverAmount'>) => {
    const recoverableAmount = params.totalAmount * 0.7;
    const waiverAmount = params.totalAmount * 0.3;
    const installmentAmount = recoverableAmount / params.durationMonths;
    
    const installments = Array.from({ length: params.durationMonths }).map((_, i) => {
      const date = new Date(params.startDate);
      date.setMonth(date.getMonth() + i + 1);
      return {
        id: Math.random().toString(36).substr(2, 9),
        dueDate: date.toISOString().split('T')[0],
        amount: installmentAmount,
        paidAmount: 0,
        status: 'PENDING' as const
      };
    });

    await addDoc(collection(db, 'loans'), {
      ...params,
      recoverableAmount,
      waiverAmount,
      remainingBalance: recoverableAmount,
      status: LoanStatus.ACTIVE,
      installments
    });
  };

  const payInstallment = async (loanId: string, installmentId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const updatedInstallments = loan.installments.map(inst => {
      if (inst.id === installmentId && inst.status === 'PENDING') {
        return { ...inst, status: 'PAID' as const, paidAmount: inst.amount, paidDate: new Date().toISOString().split('T')[0] };
      }
      return inst;
    });

    const recoveredSoFar = updatedInstallments.reduce((sum, i) => sum + i.paidAmount, 0);
    const remaining = loan.recoverableAmount - recoveredSoFar;
    const isCompleted = remaining <= 0;

    await updateDoc(doc(db, 'loans', loanId), {
      installments: updatedInstallments,
      remainingBalance: Math.max(0, remaining),
      status: isCompleted ? LoanStatus.COMPLETED : loan.status
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, deposits, loans, devProfile, summary, loading,
      loginWithGoogle, loginWithEmail, signupWithEmail, logout, approveUser, rejectUser,
      addDeposit, issueLoan, payInstallment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
