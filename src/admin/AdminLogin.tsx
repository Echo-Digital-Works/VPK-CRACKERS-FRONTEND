import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 md:px-10 py-20 bg-cover bg-center"
      style={{ backgroundImage: 'url("/download (2).jpg")' }}
    >
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"></div>

      <div className="w-full max-w-6xl min-h-[500px] md:h-[600px] flex rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 bg-brand-darker">
        
        {/* Left Side - Form (White) */}
        <div className="w-full md:w-1/2 bg-white p-10 md:p-16 flex flex-col justify-center relative z-20 rounded-3xl md:rounded-r-none md:rounded-l-3xl">
          
          <h2 className="text-4xl font-black text-[#1A2530] mb-12 tracking-wider">
            ADMIN <span className="text-brand-orange">LOGIN</span>
          </h2>
          
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-full mb-6 text-center text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 max-w-sm">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                <FiUser size={20} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#f0f7f7] text-gray-800 placeholder-gray-400 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                <FiLock size={20} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f0f7f7] text-gray-800 placeholder-gray-400 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium"
                required
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider transition-colors shadow-lg shadow-brand-orange/30"
              >
                LOGIN
              </button>
            </div>
          </form>

          {/* Torn Edge Effect SVG */}
          <svg 
            className="absolute right-0 top-0 h-full text-white translate-x-[99%] w-8 z-10 hidden md:block drop-shadow-xl" 
            preserveAspectRatio="none" 
            viewBox="0 0 30 100"
          >
            <path 
              d="M0,0 L15,0 L5,5 L20,10 L10,18 L25,25 L8,32 L22,40 L12,48 L28,55 L15,62 L25,70 L10,78 L20,85 L5,92 L15,100 L0,100 Z" 
              fill="currentColor" 
            />
          </svg>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block md:w-1/2 relative rounded-r-3xl overflow-hidden">
          <img 
            src="/download (2).jpg" 
            alt="Fireworks" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-12 right-12 text-right">
            <h1 className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
              VPK <span className="text-brand-gold">CRACKERS</span>
            </h1>
            <p className="text-xl text-gray-200 mt-2 font-medium tracking-widest drop-shadow-md">
              ADMINISTRATION
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
