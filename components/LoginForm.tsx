import React, { useState } from 'react';
import { Key, Lock, Server } from 'lucide-react';
import { AuthCredentials } from '../types';

interface LoginFormProps {
  onLogin: (creds: AuthCredentials) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [appKey, setAppKey] = useState('');
  const [ssoid, setSsoid] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ appKey, ssoid });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Copyright Header */}
      <div className="absolute top-8 left-0 right-0 text-center z-20">
        <span className="text-zinc-600 font-mono text-xs uppercase tracking-[0.2em] select-none">
          © Ascot Wealth Management 2025
        </span>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-betfair-yellow rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-lg shadow-2xl backdrop-blur-sm z-10">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-betfair-yellow/10 rounded-full flex items-center justify-center mb-4 border border-betfair-yellow/20">
              <Server className="w-8 h-8 text-betfair-yellow" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Betfair History Sync</h1>
            <p className="text-zinc-400 text-sm mt-2">London Bundle • Manager-Worker Node</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Application Key</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3 w-5 h-5 text-zinc-500 group-focus-within:text-betfair-yellow transition-colors" />
                <input
                  type="text"
                  value={appKey}
                  onChange={(e) => setAppKey(e.target.value)}
                  placeholder="Enter X-Application header"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-betfair-yellow focus:ring-1 focus:ring-betfair-yellow transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Session Token (SSOID)</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500 group-focus-within:text-betfair-yellow transition-colors" />
                <input
                  type="password"
                  value={ssoid}
                  onChange={(e) => setSsoid(e.target.value)}
                  placeholder="Paste SSOID from browser cookie"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-betfair-yellow focus:ring-1 focus:ring-betfair-yellow transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-betfair-yellow hover:bg-yellow-500 text-black font-bold rounded shadow-lg shadow-yellow-900/20 transition-all transform active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Authenticating...' : 'Connect to Node'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Target API: historicdata.betfair.com</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                System Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};