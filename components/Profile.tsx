import React, { useState } from 'react';
import { useApp } from '../state';
import { UserRole } from '../types';
import { Mail, Github, Linkedin, ExternalLink, Code, Camera, LogOut, Save, X, Edit3 } from 'lucide-react';

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

  const generateRandomDevAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
    setDevImage(newAvatar);
  };

  return (
    <div className="animate-in flex flex-col items-center pb-12">
      
      {/* User Account Section */}
      <div className="w-full mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Edit3 size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Account Settings</h3>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex flex-col items-center">
            <div className="relative group mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-indigo-50 dark:border-indigo-900 shadow-xl overflow-hidden bg-slate-50 dark:bg-slate-800 transition-colors">
                <img 
                  src={isEditingUser ? userAvatar : (currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`)} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {isEditingUser && (
                <button 
                  onClick={generateRandomAvatar}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                  title="Randomize Avatar"
                >
                  <Camera size={14} />
                </button>
              )}
            </div>

            {isEditingUser ? (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-100 transition-colors"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Avatar Image URL</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-medium outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-100 transition-colors"
                    value={userAvatar}
                    onChange={(e) => setUserAvatar(e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveUser}
                    className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    <Save size={14} /> Save Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingUser(false);
                      setUserName(currentUser?.name || '');
                      setUserAvatar(currentUser?.avatar || '');
                    }}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black px-4 py-3 rounded-2xl text-[10px] uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{currentUser?.name}</h2>
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1 mb-6">{currentUser?.role}</p>
                <button 
                  onClick={() => setIsEditingUser(true)}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all"
                >
                  Edit My Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dev Profile Section */}
      <div className="w-full flex items-center gap-3 mb-10">
        <Code size={16} className="text-slate-400" />
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Developer Meta</h3>
        {currentUser?.role === UserRole.ADMIN && !isEditingDev && (
          <button onClick={() => setIsEditingDev(true)} className="ml-auto p-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
            <Edit3 size={14} />
          </button>
        )}
      </div>

      <div className="w-full bg-slate-800 dark:bg-slate-900 h-24 mb-12 rounded-[40px] relative transition-colors shadow-lg">
         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-8 border-white dark:border-slate-950 shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
                 <img 
                  src={isEditingDev ? devImage : devProfile.image} 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditingDev && (
                <button 
                  onClick={generateRandomDevAvatar}
                  className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                  title="Randomize Dev Avatar"
                >
                  <Camera size={14} />
                </button>
              )}
            </div>
         </div>
      </div>

      {isEditingDev ? (
        <div className="w-full px-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
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
                <button onClick={handleSaveDev} className="flex-1 bg-slate-800 dark:bg-indigo-600 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-indigo-700 transition-colors">Update Global Dev Profile</button>
                <button onClick={() => setIsEditingDev(false)} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
             </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mt-4 space-y-1">
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{devProfile.name}</h2>
            <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">{devProfile.title}</p>
          </div>

          <div className="flex items-center gap-6 mt-8">
            <a href="#" className="w-10 h-10 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all active:scale-90">
              <Github size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all active:scale-90">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${devProfile.email}`} className="w-10 h-10 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all active:scale-90">
              <Mail size={18} />
            </a>
          </div>

          <div className="mt-12 px-6 text-center max-w-sm">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "{devProfile.bio}"
            </p>
          </div>
        </>
      )}

      {/* Tech Stack */}
      <div className="flex flex-wrap justify-center gap-2 mt-12 px-4 mb-12">
        {['REACT 19', 'NODE.JS', 'TYPESCRIPT', 'TAILWIND', 'GEMINI AI', 'FIREBASE'].map(tech => (
          <span key={tech} className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-200 dark:border-slate-700 transition-colors">
            {tech}
          </span>
        ))}
      </div>

      {/* Clear Logout Button */}
      <div className="w-full px-6 mb-20">
        <button 
          onClick={() => logout()}
          className="w-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 font-black py-5 rounded-[28px] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] hover:bg-rose-100 dark:hover:bg-rose-900/50 active:scale-95 transition-all shadow-lg shadow-rose-100 dark:shadow-none"
        >
          <LogOut size={18} /> LOGOUT SECURELY
        </button>
      </div>
    </div>
  );
};

export default Profile;