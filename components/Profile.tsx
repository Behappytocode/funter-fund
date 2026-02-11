import React, { useState } from 'react';
import { useApp, EMOJI_CATEGORIES } from '../state';
import { UserRole } from '../types';
import { Mail, Github, Linkedin, Camera, LogOut, Save, X, Edit3, Shield, User as UserIcon, Sparkles, Code2, Cpu, Globe } from 'lucide-react';

const EmojiPickerModal: React.FC<{ onSelect: (emoji: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
  const [activeCat, setActiveCat] = useState(EMOJI_CATEGORIES[0].name);

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl slide-in-from-bottom sm:slide-in-from-top duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Pick Avatar Emoji</h4>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {EMOJI_CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCat(cat.name)}
              className={`px-4 py-2 text-[9px] font-black rounded-xl transition-all whitespace-nowrap shrink-0 uppercase tracking-tighter ${activeCat === cat.name ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="p-6 h-[320px] overflow-y-auto grid grid-cols-5 gap-3 no-scrollbar">
          {EMOJI_CATEGORIES.find(c => c.name === activeCat)?.emojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="aspect-square flex items-center justify-center text-3xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { devProfile, currentUser, logout, updateUser, updateDevProfile } = useApp();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingDev, setIsEditingDev] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'USER' | 'DEV' | null>(null);
  
  const getSafeAvatar = (avatar: any) => {
    if (!avatar || typeof avatar !== 'string') return '👤';
    if (avatar.length > 8 || avatar.includes('/') || avatar.includes('.') || avatar.includes('?')) {
      return '👤';
    }
    return avatar;
  };

  // User Edit State
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userAvatar, setUserAvatar] = useState(getSafeAvatar(currentUser?.avatar) || '👤');
  
  // Dev Edit State
  const [devName, setDevName] = useState(devProfile.name);
  const [devTitle, setDevTitle] = useState(devProfile.title);
  const [devImage, setDevImage] = useState(getSafeAvatar(devProfile.image) || '👨‍💻');
  const [devBio, setDevBio] = useState(devProfile.bio);

  const handleSaveUser = async () => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, {
        name: userName,
        avatar: userAvatar
      });
      setIsEditingUser(false);
    } catch (e) {
      console.error("Failed to update user profile", e);
    }
  };

  const handleSaveDev = async () => {
    try {
      await updateDevProfile({
        name: devName,
        title: devTitle,
        image: devImage,
        bio: devBio
      });
      setIsEditingDev(false);
    } catch (e) {
      console.error("Failed to update dev profile", e);
    }
  };

  return (
    <div className="animate-in flex flex-col items-center pb-24">
      {pickerTarget && (
        <EmojiPickerModal 
          onSelect={(emoji) => {
            if (pickerTarget === 'USER') setUserAvatar(emoji);
            if (pickerTarget === 'DEV') setDevImage(emoji);
          }} 
          onClose={() => setPickerTarget(null)} 
        />
      )}
      
      {/* Dev Header - Mesh Gradient Redesign */}
      <div className="w-full bg-slate-900 h-52 rounded-t-[48px] relative transition-all shadow-2xl overflow-hidden group">
         {/* Animated Mesh Gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900">
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-600/10 blur-[100px] rounded-full animate-pulse delay-700" />
         </div>
         
         {/* Grid Pattern Overlay */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

         <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              {/* Pulsing Outer Ring */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping -z-10 scale-110" />
              
              <div className="w-36 h-36 rounded-full border-[8px] border-slate-50 dark:border-slate-950 shadow-2xl flex items-center justify-center bg-white dark:bg-slate-900 transition-all overflow-hidden relative group">
                 <span className="text-7xl select-none transition-transform group-hover:scale-110 duration-500">
                   {isEditingDev ? devImage : getSafeAvatar(devProfile.image)}
                 </span>
                 
                 {/* Decorative Overlay */}
                 <div className="absolute inset-0 border-[2px] border-emerald-500/30 rounded-full pointer-events-none" />
              </div>

              {/* Verified Badge */}
              <div className="absolute bottom-1 right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-950">
                <Shield size={12} fill="currentColor" />
              </div>

              {isEditingDev && (
                <button 
                  onClick={() => setPickerTarget('DEV')}
                  className="absolute -top-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
                  title="Change Avatar"
                >
                  <Sparkles size={16} />
                </button>
              )}
            </div>
         </div>
      </div>

      <div className="mt-20 w-full px-6 flex flex-col items-center text-center">
        {isEditingDev ? (
          <div className="w-full space-y-5 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl mt-4 animate-in fade-in duration-500">
             <div className="space-y-1.5 text-left">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
               <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black outline-none dark:text-slate-100 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="Developer Name"
               />
             </div>
             
             <div className="space-y-1.5 text-left">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Title</label>
               <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none dark:text-slate-100 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all"
                  value={devTitle}
                  onChange={(e) => setDevTitle(e.target.value)}
                  placeholder="e.g. Lead Engineer"
               />
             </div>

             <div className="space-y-1.5 text-left">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">About the Architect</label>
               <textarea 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-medium outline-none h-32 resize-none dark:text-slate-100 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all leading-relaxed"
                  value={devBio}
                  onChange={(e) => setDevBio(e.target.value)}
                  placeholder="Short bio about your contributions..."
               />
             </div>

             <div className="flex gap-3 pt-2">
                <button onClick={handleSaveDev} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-[22px] text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">Apply Changes</button>
                <button onClick={() => setIsEditingDev(false)} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-[22px] font-black text-[10px] uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Discard</button>
             </div>
          </div>
        ) : (
          <div className="space-y-10 w-full">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter transition-colors uppercase italic">{devProfile.name}</h2>
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.25em]">{devProfile.title}</p>
              </div>
            </div>

            {/* Social Grid - Glassmorphism cards */}
            <div className="grid grid-cols-3 gap-4 w-full px-4">
              <a href="#" className="aspect-square bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-2 transition-all group">
                <Github size={24} className="mb-2 transition-transform group-hover:scale-110" />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Github</span>
              </a>
              <a href="#" className="aspect-square bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-2 transition-all group">
                <Linkedin size={24} className="mb-2 transition-transform group-hover:scale-110" />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">LinkedIn</span>
              </a>
              <a href={`mailto:${devProfile.email}`} className="aspect-square bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-2 transition-all group">
                <Mail size={24} className="mb-2 transition-transform group-hover:scale-110" />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Contact</span>
              </a>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 relative transition-all">
              <div className="absolute -top-3 left-8 bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Architect's Note</div>
              <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-center italic">
                "{devProfile.bio}"
              </p>
            </div>
            
            {/* Project Admin Tooltip */}
            {currentUser?.role === UserRole.ADMIN && !isEditingDev && (
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={() => setIsEditingDev(true)} 
                  className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Edit3 size={16} /> Update Project Lead
                </button>
                <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Admin Control Module Enabled</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modernized Separator */}
      <div className="w-full px-12 my-16 flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent flex-1" />
        <Code2 size={16} className="text-slate-300 dark:text-slate-700" />
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent flex-1" />
      </div>

      {/* User Account Section - Modernized */}
      <div className="w-full px-6 space-y-6">
        <div className="flex items-center gap-3 mb-2 px-2">
          <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Authorized Session</h3>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none group transition-all">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-[28px] border-2 border-slate-50 dark:border-slate-800 shadow-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-all overflow-hidden group-hover:scale-105">
                <span className="text-4xl select-none">{isEditingUser ? userAvatar : getSafeAvatar(currentUser?.avatar)}</span>
              </div>
              {isEditingUser && (
                <button 
                  onClick={() => setPickerTarget('USER')}
                  className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
                >
                  <Sparkles size={12} />
                </button>
              )}
            </div>

            {isEditingUser ? (
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-100 transition-all"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveUser} className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all">Save Profile</button>
                  <button onClick={() => setIsEditingUser(false)} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[9px] font-black uppercase">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight truncate uppercase leading-tight">{currentUser?.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{currentUser?.role}</p>
                  <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Member since {currentUser?.joinedAt}</p>
                </div>
                <button 
                  onClick={() => setIsEditingUser(true)}
                  className="mt-4 text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                >
                  <Edit3 size={12} /> Customize Identity
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="w-full bg-slate-900 dark:bg-slate-800 text-white font-black py-6 rounded-[32px] flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-[10px] hover:bg-indigo-600 dark:hover:bg-indigo-700 active:scale-95 transition-all shadow-2xl shadow-indigo-100 dark:shadow-none mt-10"
        >
          <LogOut size={20} /> End Secure Session
        </button>
      </div>

      {/* Tech Stack - Modern Pill badges */}
      <div className="mt-20 flex flex-wrap justify-center gap-2 px-10 mb-12">
        {[
          { icon: Cpu, name: 'Vite Core' },
          { icon: Code2, name: 'React 19' },
          { icon: Shield, name: 'Firebase' },
          { icon: Globe, name: 'Gemini AI' }
        ].map(tech => (
          <div key={tech.name} className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-indigo-100 dark:hover:border-indigo-900">
            <tech.icon size={10} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;