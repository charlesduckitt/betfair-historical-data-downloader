import React, { useState, useEffect, useCallback } from "react";
import { LayoutDashboard, Settings, User } from "lucide-react";
import { api } from "./services/api";
import {
  AppState,
  WorkerState,
  AuthCredentials,
  SystemStats,
  LogEntry,
} from "./types";
import { LoginForm } from "./components/LoginForm";
import { StatsGrid } from "./components/StatsGrid";
import { LogTerminal } from "./components/LogTerminal";
import { ControlPanel } from "./components/ControlPanel";

const INITIAL_STATS: SystemStats = {
  downloadedFiles: 0,
  parsedMarkets: 0,
  errors: 0,
  queueSize: 0,
  diskSpaceFreeGB: 0,
  downloadSpeed: 0,
  activeThreads: 0,
  currentYear: "-",
  currentMonth: "-",
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [status, setStatus] = useState<WorkerState>(WorkerState.IDLE);
  const [stats, setStats] = useState<SystemStats>(INITIAL_STATS);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Polling Logic
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isAuthenticated) {
      const fetchStatus = async () => {
        try {
          const data = await api.pollStatus();
          if (data.status) setStatus(data.status);
          if (data.stats) setStats(data.stats);

          if (data.logs && data.logs.length > 0) {
            setLogs((prev) => [...prev, ...data.logs!].slice(-200)); // Keep last 200 logs
          }
        } catch (error) {
          console.error("Failed to poll status", error);
          // In a real app, might want to show a toast
        }
      };

      fetchStatus();
      intervalId = setInterval(fetchStatus, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleLogin = async (creds: AuthCredentials) => {
    setAuthLoading(true);
    try {
      const result = await api.login(creds);
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        alert(result.message || "Login failed");
      }
    } catch (e) {
      alert("Connection error to Backend");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      await api.start();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePause = async () => {
    try {
      await api.pause();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResume = async () => {
    try {
      await api.resume();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    if (
      confirm(
        "Are you sure you want to stop the downloader? This will clear the current queue."
      )
    ) {
      try {
        await api.stop();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} isLoading={authLoading} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-300 pb-24">
      {/* Corporate Header Bar */}
      <div className="bg-black border-b border-zinc-900 h-6 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-[10px] text-zinc-600 font-mono tracking-wider">
          CONFIDENTIAL // INTERNAL SYSTEM
        </span>
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
          © Ascot Wealth Management 2025
        </span>
      </div>

      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-[#121212] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-betfair-yellow rounded flex items-center justify-center font-bold text-black">
                B
              </div>
              <span className="font-bold text-white tracking-tight">
                Historic Data Manager
              </span>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                BASIC PLAN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-zinc-500">Target Range</span>
                <span className="text-xs font-mono text-betfair-yellow">
                  MAY 2015 - PRESENT
                </span>
              </div>
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <Settings size={20} />
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Worker Node Dashboard
            </h1>
            <p className="text-zinc-500 text-sm">
              Managing concurrent downloads from historicdata.betfair.com
            </p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg">
            <div className="text-right">
              <div className="text-xs text-zinc-500 uppercase">
                Current Target
              </div>
              <div className="text-sm font-mono text-white font-bold">
                {stats.currentMonth} {stats.currentYear}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800"></div>
            <div className="text-right">
              <div className="text-xs text-zinc-500 uppercase">Queue</div>
              <div className="text-sm font-mono text-white font-bold">
                {stats.queueSize.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} state={status} />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logs Section (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <LogTerminal logs={logs} />

            {/* Progress Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">
                  Batch Progress
                </span>
                <span className="text-xs text-zinc-500">
                  Worker Utilization: {stats.activeThreads}/10 Threads
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden">
                {/* Fake progress bar logic just for visuals based on active threads */}
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    status === "RUNNING"
                      ? "bg-betfair-yellow w-full animate-pulse"
                      : "bg-zinc-800 w-0"
                  }`}
                  style={{ width: status === "RUNNING" ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Config / Instructions Side Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-4">
              Node Configuration
            </h3>

            <div className="space-y-4">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-xs text-zinc-500 uppercase mb-1">
                  Output Directory
                </div>
                <div className="font-mono text-xs text-green-400 break-all">
                  ./data/processed/
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-xs text-zinc-500 uppercase mb-1">
                  Rate Limit Strategy
                </div>
                <div className="font-mono text-xs text-zinc-300">
                  Exponential Backoff (Max 5 retries)
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-white mb-2">
                  Instructions
                </h4>
                <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4">
                  <li>Ensure disk has {">"} 10GB free space.</li>
                  <li>Do not close this tab while running.</li>
                  <li>
                    Logs are saved to <code>/logs/app.log</code> inside
                    container.
                  </li>
                  <li>
                    To export data, copy the <code>history.db</code> file.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ControlPanel
        status={status}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
      />
    </div>
  );
};

export default App;
