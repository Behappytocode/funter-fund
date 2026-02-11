
import React, { useState } from 'react';
import { useApp } from '../state';
import { UserRole } from '../types';
import { Mail, Github, Linkedin, Camera, LogOut, Save, X, Edit3, Shield, User as UserIcon } from 'lucide-react';

const Profile: React.FC = () => {
  const { devProfile, currentUser, logout, updateUser, updateDevProfile } = useApp();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingDev, setIsEditingDev] = useState(false);
  
  // User Edit State
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userAvatar, setUserAvatar] = useState(currentUser?.avatar || '');
  
  // Dev Edit State
  const [devName, setDevName] = useState(devProfile.name);
  const [devTitle, setDevTitle] = useState(devProfile.title);
  const [devImage, setDevImage] = useState(devProfile.image);
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

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setUserAvatar(newAvatar);
  };

  return (
    <div className="animate-in flex flex-col items-center pb-24">
      
      {/* Dev Header Banner Area */}
      <div className="w-full bg-indigo-600 dark:bg-indigo-900 h-40 rounded-t-[40px] relative transition-colors shadow-lg overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="2" />
            </svg>
         </div>
         <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-[6px] border-[#97bc3a] shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
                 <img 
                  src={isEditingDev ? devImage : devProfile.image} 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditingDev && (
                <button 
                  onClick={() => setDevImage(`https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`)}
                  className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                  title="Randomize Dev Avatar"
                >
                  <Camera size={14} />
                </button>
              )}
            </div>
         </div>
      </div>

      <div className="mt-20 w-full px-6 flex flex-col items-center text-center">
        {isEditingDev ? (
          <div className="w-full space-y-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
             <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-black outline-none dark:text-slate-100"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                placeholder="Developer Name"
             />
             <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold outline-none dark:text-slate-100"
                value={devTitle}
                onChange={(e) => setDevTitle(e.target.value)}
                placeholder="Job Title"
             />
             <textarea 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-medium outline-none h-24 resize-none dark:text-slate-100"
                value={devBio}
                onChange={(e) => setDevBio(e.target.value)}
                placeholder="Bio"
             />
             <div className="flex gap-2">
                <button onClick={handleSaveDev} className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-colors">Update Profile</button>
                <button onClick={() => setIsEditingDev(false)} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
             </div>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">{devProfile.name}</h2>
            <p className="text-[14px] font-black text-[#97bc3a] uppercase tracking-[0.3em] mt-3">{devProfile.title}</p>

            <div className="flex items-center justify-center gap-6 mt-10">
              <a href="#" className="w-14 h-14 bg-white dark:bg-slate-900 shadow-md border border-slate-50 dark:border-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-all active:scale-90">
                <Github size={24} />
              </a>
              <a href="#" className="w-14 h-14 bg-white dark:bg-slate-900 shadow-md border border-slate-50 dark:border-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-all active:scale-90">
                <Linkedin size={24} />
              </a>
              <a href={`mailto:${devProfile.email}`} className="w-14 h-14 bg-white dark:bg-slate-900 shadow-md border border-slate-50 dark:border-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-all active:scale-90">
                <Mail size={24} />
              </a>
            </div>

            <div className="mt-12 px-6 max-w-sm">
              <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                {devProfile.bio}
              </p>
            </div>
            
            {currentUser?.role === UserRole.ADMIN && !isEditingDev && (
              <button 
                onClick={() => setIsEditingDev(true)} 
                className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
              >
                <Edit3 size={14} /> Edit Dev Profile
              </button>
            )}
          </>
        )}
      </div>

      {/* Separator */}
      <div className="w-full px-12 my-12">
        <div className="h-px bg-slate-200 dark:bg-slate-800 w-full transition-colors" />
      </div>

      {/* User Account Section */}
      <div className="w-full px-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Member Account</h3>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl border-2 border-slate-50 dark:border-slate-800 shadow-md overflow-hidden bg-slate-50 dark:bg-slate-800 transition-colors">
                <img 
                  src={isEditingUser ? userAvatar : (currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`)} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {isEditingUser && (
                <button 
                  onClick={generateRandomAvatar}
                  className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera size={10} />
                </button>
              )}
            </div>

            {isEditingUser ? (
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-100 transition-colors"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveUser} className="flex-1 bg-indigo-600 text-white font-black py-2 rounded-lg text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-colors">Save</button>
                  <button onClick={() => setIsEditingUser(false)} className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-[9px] font-black">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate uppercase">{currentUser?.name}</h4>
                <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">{currentUser?.role}</p>
                <button 
                  onClick={() => setIsEditingUser(true)}
                  className="mt-2 text-[8px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <Edit3 size={10} /> Edit Details
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="w-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 font-black py-5 rounded-[28px] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] hover:bg-rose-100 dark:hover:bg-rose-900/50 active:scale-95 transition-all shadow-lg shadow-rose-100 dark:shadow-none"
        >
          <LogOut size={18} /> LOGOUT SECURELY
        </button>
      </div>

      {/* Tech Stack Footer */}
      <div className="mt-16 flex flex-wrap justify-center gap-3 px-12 mb-12">
        {['React 19', 'Firebase', 'Gemini AI', 'Tailwind'].map(tech => (
          <span key={tech} className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Profile;
