import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Deposit, Loan, FinancialSummary, UserRole, DevProfile, LoanStatus, Installment } from './types';
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
  deleteDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { INITIAL_DEV_PROFILE } from './mockData';

type Theme = 'light' | 'dark';

export const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🥳', '😏']
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝']
  },
  {
    name: 'Hands',
    emojis: ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '🖐️', '✋', '🖖', '👋', '🤚', '✍️', '👏', '🙌', '👐', '🤲', '🙏']
  },
  {
    name: 'Cool',
    emojis: ['🦁', '🐯', '🦊', '🐱', '🐶', '🦄', '🐲', '🤖', '👾', '👽', '👻', '🦸', '🦹', '🧙', '🧛', '🧟', '🕵️', '👨‍💻', '👩‍💻', '👤']
  }
];

const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(c => c.emojis);

interface AppState {
  currentUser: User | null;
  users: User[];
  deposits: Deposit[];
  loans: Loan[];
  devProfile: DevProfile;
  summary: FinancialSummary;
  loading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  addDeposit: (deposit: Omit<Deposit, 'id' | 'entryDate'>) => Promise<void>;
  deleteDeposit: (depositId: string) => Promise<void>;
  issueLoan: (loan: Omit<Loan, 'id' | 'status' | 'installments' | 'remainingBalance' | 'recoverableAmount' | 'waiverAmount'>, initialStatus?: LoanStatus) => Promise<void>;
  approveLoan: (loanId: string) => Promise<void>;
  rejectLoan: (loanId: string) => Promise<void>;
  payInstallment: (loanId: string, installmentId: string) => Promise<void>;
  updateUser: (uid: string, data: Partial<User>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  updateDevProfile: (data: Partial<DevProfile>) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [devProfile, setDevProfile] = useState<DevProfile>(INITIAL_DEV_PROFILE);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
        } else {
          const randomEmoji = ALL_EMOJIS[Math.floor(Math.random() * ALL_EMOJIS.length)];
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New Member',
            email: firebaseUser.email || '',
            role: UserRole.MEMBER,
            avatar: randomEmoji,
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

  useEffect(() => {
    if (!currentUser) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const usersList = snap.docs.map(d => d.data() as User);
      setUsers(usersList);
      const updatedSelf = usersList.find(u => u.id === currentUser.id);
      if (updatedSelf) setCurrentUser(updatedSelf);
    });

    const unsubDeposits = onSnapshot(query(collection(db, 'deposits'), orderBy('paymentDate', 'desc')), (snap) => {
      setDeposits(snap.docs.map(d => ({ ...d.data(), id: d.id } as Deposit)));
    });

    const unsubLoans = onSnapshot(collection(db, 'loans'), (snap) => {
      setLoans(snap.docs.map(d => ({ ...d.data(), id: d.id } as Loan)));
    });

    const unsubDev = onSnapshot(doc(db, 'settings', 'devProfile'), (docSnap) => {
      if (docSnap.exists()) {
        setDevProfile(docSnap.data() as DevProfile);
      }
    });

    return () => {
      unsubUsers();
      unsubDeposits();
      unsubLoans();
      unsubDev();
    };
  }, [currentUser?.id]);

  const summary: FinancialSummary = (() => {
    const activeLoans = loans.filter(l => l.status !== LoanStatus.PENDING);
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
    const totalLoansIssued = activeLoans.reduce((sum, l) => sum + l.totalAmount, 0);
    const totalRecoveries = activeLoans.reduce((sum, l) => {
      return sum + l.installments.reduce((iSum, i) => iSum + i.paidAmount, 0);
    }, 0);
    const totalWaivers = activeLoans.reduce((sum, l) => sum + l.waiverAmount, 0);
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
      
      const randomEmoji = ALL_EMOJIS[Math.floor(Math.random() * ALL_EMOJIS.length)];
      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        role,
        avatar: randomEmoji,
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

  const addDeposit = async (deposit: Omit<Deposit, 'id' | 'entryDate'>) => {
    await addDoc(collection(db, 'deposits'), {
      ...deposit,
      entryDate: new Date().toISOString().split('T')[0]
    });
  };

  const deleteDeposit = async (depositId: string) => {
    await deleteDoc(doc(db, 'deposits', depositId));
  };

  const issueLoan = async (params: Omit<Loan, 'id' | 'status' | 'installments' | 'remainingBalance' | 'recoverableAmount' | 'waiverAmount'>, initialStatus: LoanStatus = LoanStatus.ACTIVE) => {
    const recoverableAmount = params.totalAmount * 0.7;
    const waiverAmount = params.totalAmount * 0.3;
    const duration = Number(params.durationMonths);
    const installmentAmount = Math.ceil(recoverableAmount / duration);
    
    const installments: Installment[] = Array.from({ length: duration }).map((_, i) => {
      const date = new Date(params.startDate);
      date.setMonth(date.getMonth() + i + 1);
      return {
        id: Math.random().toString(36).substring(2, 9),
        dueDate: date.toISOString().split('T')[0],
        amount: installmentAmount,
        paidAmount: 0,
        status: 'PENDING'
      };
    });

    await addDoc(collection(db, 'loans'), {
      ...params,
      recoverableAmount,
      waiverAmount,
      remainingBalance: recoverableAmount,
      status: initialStatus,
      installments
    });
  };

  const approveLoan = async (loanId: string) => {
    await updateDoc(doc(db, 'loans', loanId), {
      status: LoanStatus.ACTIVE
    });
  };

  const rejectLoan = async (loanId: string) => {
    await deleteDoc(doc(db, 'loans', loanId));
  };

  const payInstallment = async (loanId: string, installmentId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const updatedInstallments = loan.installments.map(inst => {
      if (inst.id === installmentId && inst.status === 'PENDING') {
        return { 
          ...inst, 
          status: 'PAID' as const, 
          paidAmount: inst.amount, 
          paidDate: new Date().toISOString().split('T')[0] 
        };
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

  const updateUser = async (uid: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  };

  const deleteUser = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };

  const updateDevProfile = async (data: Partial<DevProfile>) => {
    const devRef = doc(db, 'settings', 'devProfile');
    await setDoc(devRef, { ...devProfile, ...data }, { merge: true });
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, deposits, loans, devProfile, summary, loading, theme, toggleTheme,
      loginWithGoogle, loginWithEmail, signupWithEmail, logout,
      addDeposit, deleteDeposit, issueLoan, approveLoan, rejectLoan, payInstallment, updateUser, deleteUser, updateDevProfile
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