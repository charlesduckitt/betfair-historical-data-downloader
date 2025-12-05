import React from 'react';
import { Database, HardDrive, Activity, AlertCircle, Layers } from 'lucide-react';
import { SystemStats, WorkerState } from '../types';

interface StatsGridProps {
  stats: SystemStats;
  state: WorkerState;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, state }) => {
  const isDangerDisk = stats.diskSpaceFreeGB < 10;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg relative overflow-hidden group">
        <div className="absolute right-2 top-2 text-zinc-700 group-hover:text-betfair-yellow transition-colors">
          <Database size={20} />
        </div>
        <div className="text-zinc-400 text-xs uppercase font-medium mb-1">Downloaded</div>
        <div className="text-2xl font-mono text-white font-bold">{stats.downloadedFiles.toLocaleString()}</div>
        <div className="text-xs text-zinc-500 mt-1">.bz2 Archives</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg relative overflow-hidden group">
         <div className="absolute right-2 top-2 text-zinc-700 group-hover:text-green-500 transition-colors">
          <Layers size={20} />
        </div>
        <div className="text-zinc-400 text-xs uppercase font-medium mb-1">Parsed Markets</div>
        <div className="text-2xl font-mono text-white font-bold">{stats.parsedMarkets.toLocaleString()}</div>
        <div className="text-xs text-green-500/70 mt-1">Ready for Analysis</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg relative overflow-hidden group">
         <div className="absolute right-2 top-2 text-zinc-700 group-hover:text-blue-500 transition-colors">
          <Activity size={20} />
        </div>
        <div className="text-zinc-400 text-xs uppercase font-medium mb-1">Throughput</div>
        <div className="text-2xl font-mono text-white font-bold">{stats.downloadSpeed}</div>
        <div className="text-xs text-zinc-500 mt-1">Files / Minute</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg relative overflow-hidden group">
        <div className={`absolute right-2 top-2 transition-colors ${stats.errors > 0 ? 'text-red-500' : 'text-zinc-700'}`}>
          <AlertCircle size={20} />
        </div>
        <div className="text-zinc-400 text-xs uppercase font-medium mb-1">Errors</div>
        <div className={`text-2xl font-mono font-bold ${stats.errors > 0 ? 'text-red-500' : 'text-white'}`}>
          {stats.errors}
        </div>
        <div className="text-xs text-zinc-500 mt-1">Rate Limited / Failed</div>
      </div>

      <div className={`bg-zinc-900 border p-4 rounded-lg relative overflow-hidden group transition-colors ${isDangerDisk ? 'border-red-900 bg-red-900/10' : 'border-zinc-800'}`}>
        <div className={`absolute right-2 top-2 transition-colors ${isDangerDisk ? 'text-red-500' : 'text-zinc-700'}`}>
          <HardDrive size={20} />
        </div>
        <div className="text-zinc-400 text-xs uppercase font-medium mb-1">Disk Free</div>
        <div className={`text-2xl font-mono font-bold ${isDangerDisk ? 'text-red-400' : 'text-white'}`}>
          {stats.diskSpaceFreeGB.toFixed(1)} GB
        </div>
        <div className="text-xs text-zinc-500 mt-1">Threshold: 10GB</div>
      </div>
    </div>
  );
};