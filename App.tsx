import React, { useState } from 'react';
import { AppProvider, useApp } from './state';
import { UserRole } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Deposits from './components/Deposits';
import Loans from './components/Loans';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { Mail, Lock, User as UserIcon, Shield, AlertCircle, ExternalLink } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useApp();
  const [method, setMethod] = useState<'GOOGLE' | 'EMAIL'>('EMAIL');
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MEMBER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDomainError = error.includes('auth/unauthorized-domain');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'LOGIN') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name, role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none mb-6 transform rotate-6">
             <img src="https://img.icons8.com/ios-filled/100/ffffff/handshake.png" alt="Logo" className="w-12 h-12" />
           </div>
           <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none transition-colors">SKP Fund</h1>
           <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">Friendship that Stands in Crisis</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setMethod('EMAIL'); setError(''); }}
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${method === 'EMAIL' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
            >
              EMAIL
            </button>
            <button 
              onClick={() => { setMethod('GOOGLE'); setError(''); }}
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${method === 'GOOGLE' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
            >
              GOOGLE
            </button>
          </div>

          {method === 'GOOGLE' ? (
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Google Access</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2 mb-8">Quick and secure access via Google.</p>
              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black py-4 rounded-[22px] shadow-sm hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                {loading ? 'Connecting...' : 'Sign in with Google'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-2">
                <button 
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${mode === 'LOGIN' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
                >
                  SIGN IN
                </button>
                <button 
                  type="button"
                  onClick={() => setMode('SIGNUP')}
                  className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${mode === 'SIGNUP' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
                >
                  SIGN UP
                </button>
              </div>

              {mode === 'SIGNUP' && (
                <div className="space-y-4">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none dark:text-slate-200 transition-colors"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                    <select 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none appearance-none dark:text-slate-200 transition-colors"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      <option value={UserRole.MEMBER} className="dark:bg-slate-900">SIGNUP AS MEMBER</option>
                      <option value={UserRole.ADMIN} className="dark:bg-slate-900">SIGNUP AS ADMIN</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none dark:text-slate-200 transition-colors"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none dark:text-slate-200 transition-colors"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-[22px] shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'LOGIN' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          )}

          {error && (
            <div className={`mt-6 p-4 rounded-2xl flex flex-col gap-2 ${isDomainError ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30' : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30'}`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`shrink-0 mt-0.5 ${isDomainError ? 'text-amber-500' : 'text-rose-500'}`} size={14} />
                <p className={`text-[9px] font-black uppercase leading-tight ${isDomainError ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
                  {isDomainError ? 'Authorized Domain Required' : 'Authentication Error'}
                </p>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {isDomainError 
                  ? `Your deployment domain "${window.location.hostname}" is not authorized in Firebase. Add it to the list in your Firebase Console to enable login.` 
                  : error}
              </p>
              {isDomainError && (
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase mt-1 hover:underline"
                >
                  Firebase Console <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 text-center transition-colors">
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
              Private communal fund. Instant access granted to authorized members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { currentUser, loading } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!currentUser) return <AuthScreen />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'deposits' && <Deposits />}
      {activeTab === 'loans' && <Loans />}
      {activeTab === 'admin' && <AdminPanel />}
      {activeTab === 'profile' && <Profile />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;