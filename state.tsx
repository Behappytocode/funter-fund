import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Deposit, Loan, FinancialSummary, UserRole, UserStatus, DevProfile, LoanStatus, Installment, FeedbackMessage } from './types';
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
  orderBy,
  where
} from 'firebase/firestore';
import { INITIAL_DEV_PROFILE } from './mockData';

type Theme = 'light' | 'dark';

export const EMOJI_CATEGORIES = [
  {
    name: 'Smileys & Emotion',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🥳', '😏', '🤡', '💩', '👻', '💀', '👽', '👾', '🤖']
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌']
  },
  {
    name: 'Thumbs & Hands',
    emojis: ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '🖐️', '✋', '🖖', '👋', '🤚', '✍️', '👏', '🙌', '👐', '🤲', '🙏', '🤝', '💅', '🤳']
  },
  {
    name: 'Cool Avatars',
    emojis: ['🦁', '🐯', '🦊', '🐱', '🐶', '🐺', '🐻', '🐼', '🐹', '🐰', '🦒', '🐘', '🦏', '🦄', '🐲', '🦖', '🐉', '🦸', '🦹', '🧙', '🧛', '🧟', '🕵️', '👨‍💻', '👩‍💻', '👤', '🌈', '🔥', '⚡', '✨']
  }
];

const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(c => c.emojis);

interface AppState {
  currentUser: User | null;
  users: User[];
  deposits: Deposit[];
  loans: Loan[];
  feedbackMessages: FeedbackMessage[];
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
  sendFeedback: (content: string, threadId: string) => Promise<void>;
  updateUser: (uid: string, data: Partial<User>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  approveUser: (uid: string) => Promise<void>;
  updateDevProfile: (data: Partial<DevProfile>) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
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
        try {
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
              status: UserStatus.PENDING,
              avatar: randomEmoji,
              joinedAt: new Date().toISOString().split('T')[0]
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setCurrentUser(newUser);
          }
        } catch (e) {
          console.error("User initialization error:", e);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser || !auth.currentUser) return;

    // Users listener: Members can often only read themselves if rules are strict. 
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const usersList = snap.docs.map(d => d.data() as User);
      setUsers(usersList);
      const updatedSelf = usersList.find(u => u.id === currentUser.id);
      if (updatedSelf) setCurrentUser(updatedSelf);
    }, (err) => console.warn("Users listener restricted:", err.message));

    // Deposits listener: If Member, only listen to own deposits
    const depositsBaseQuery = collection(db, 'deposits');
    const depositsFilteredQuery = currentUser.role === UserRole.ADMIN 
      ? query(depositsBaseQuery, orderBy('paymentDate', 'desc'))
      : query(depositsBaseQuery, where('memberId', '==', currentUser.id), orderBy('paymentDate', 'desc'));

    const unsubDeposits = onSnapshot(depositsFilteredQuery, (snap) => {
      setDeposits(snap.docs.map(d => ({ ...d.data(), id: d.id } as Deposit)));
    }, (err) => console.warn("Deposits listener restricted:", err.message));

    // Loans listener: If Member, only listen to own loans
    const loansBaseQuery = collection(db, 'loans');
    const loansFilteredQuery = currentUser.role === UserRole.ADMIN 
      ? loansBaseQuery
      : query(loansBaseQuery, where('memberId', '==', currentUser.id));

    const unsubLoans = onSnapshot(loansFilteredQuery, (snap) => {
      setLoans(snap.docs.map(d => ({ ...d.data(), id: d.id } as Loan)));
    }, (err) => console.warn("Loans listener restricted:", err.message));

    // Feedback listener: Filter by threadId (which is the member's ID)
    const feedbackBaseQuery = collection(db, 'feedback');
    const feedbackFilteredQuery = currentUser.role === UserRole.ADMIN
      ? query(feedbackBaseQuery, orderBy('timestamp', 'asc'))
      : query(feedbackBaseQuery, where('threadId', '==', currentUser.id), orderBy('timestamp', 'asc'));

    const unsubFeedback = onSnapshot(feedbackFilteredQuery, (snap) => {
      setFeedbackMessages(snap.docs.map(d => ({ ...d.data(), id: d.id } as FeedbackMessage)));
    }, (err) => console.warn("Feedback listener restricted:", err.message));

    const unsubDev = onSnapshot(doc(db, 'settings', 'devProfile'), (docSnap) => {
      if (docSnap.exists()) {
        setDevProfile(docSnap.data() as DevProfile);
      }
    }, (err) => console.warn("Settings listener restricted:", err.message));

    return () => {
      unsubUsers();
      unsubDeposits();
      unsubLoans();
      unsubFeedback();
      unsubDev();
    };
  }, [currentUser?.id, currentUser?.role]);

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
        status: UserStatus.PENDING,
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
    const recoverableAmount = Number(params.totalAmount) * 0.7;
    const waiverAmount = Number(params.totalAmount) * 0.3;
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

    try {
      await addDoc(collection(db, 'loans'), {
        memberId: params.memberId,
        memberName: params.memberName,
        totalAmount: Number(params.totalAmount),
        durationMonths: Number(params.durationMonths),
        startDate: params.startDate,
        recoverableAmount,
        waiverAmount,
        remainingBalance: recoverableAmount,
        status: initialStatus,
        installments,
        requestedBy: auth.currentUser?.uid || params.memberId,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Firestore issueLoan error:", error);
      throw error;
    }
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

  const sendFeedback = async (content: string, threadId: string) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'feedback'), {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || '👤',
        content: content.trim(),
        timestamp: new Date().toISOString(),
        threadId: threadId
      });
    } catch (error) {
      console.error("Firestore sendFeedback error:", error);
      throw error;
    }
  };

  const updateUser = async (uid: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  };

  const deleteUser = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };

  const approveUser = async (uid: string) => {
    await updateDoc(doc(db, 'users', uid), {
      status: UserStatus.APPROVED
    });
  };

  const updateDevProfile = async (data: Partial<DevProfile>) => {
    const devRef = doc(db, 'settings', 'devProfile');
    await setDoc(devRef, { ...devProfile, ...data }, { merge: true });
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, deposits, loans, feedbackMessages, devProfile, summary, loading, theme, toggleTheme,
      loginWithGoogle, loginWithEmail, signupWithEmail, logout,
      addDeposit, deleteDeposit, issueLoan, approveLoan, rejectLoan, payInstallment, sendFeedback, updateUser, deleteUser, approveUser, updateDevProfile
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