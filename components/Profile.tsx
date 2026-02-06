
import React from 'react';
import { useApp } from '../state';
import { Mail, Github, Linkedin, ExternalLink, Code } from 'lucide-react';

const Profile: React.FC = () => {
  const { devProfile } = useApp();

  return (
    <div className="animate-in fade-in duration-700 flex flex-col items-center">
      {/* Dev Header Section */}
      <div className="w-full bg-indigo-600 h-24 mb-12 rounded-[40px] relative">
         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white">
                 <img 
                  src="https://picsum.photos/seed/abubakar/300" 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white" />
            </div>
         </div>
      </div>

      <div className="text-center mt-4 space-y-1">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Abubakar</h2>
        <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Full Stack Developer</p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-6 mt-8">
        <a href="#" className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90">
          <Github size={18} />
        </a>
        <a href="#" className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90">
          <Linkedin size={18} />
        </a>
        <a href={`mailto:${devProfile.email}`} className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90">
          <Mail size={18} />
        </a>
      </div>

      {/* Bio Text */}
      <div className="mt-12 px-6 text-center max-w-sm">
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          I'm Abubakar, the developer behind this Fund Manager platform. I am a Full Stack Developer dedicated to building robust, scalable applications that simplify community management and financial coordination.
        </p>
        <p className="text-xs font-medium text-slate-500 leading-relaxed mt-6">
          With deep expertise in React and the MERN stack, I've designed this system to provide maximum transparency with a mobile-first philosophy.
        </p>
      </div>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap justify-center gap-2 mt-12 px-4 mb-20">
        {['REACT 19', 'NODE.JS', 'TYPESCRIPT', 'TAILWIND CSS', 'GEMINI AI', 'RECHARTS'].map(tech => (
          <span key={tech} className="bg-slate-800 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-slate-100">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Profile;
