import React from 'react';
import { Play, Pause, Square, Power } from 'lucide-react';
import { WorkerState } from '../types';

interface ControlPanelProps {
  status: WorkerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ status, onStart, onPause, onResume, onStop }) => {
  const isRunning = status === WorkerState.RUNNING;
  const isPaused = status === WorkerState.PAUSED;
  const isIdle = status === WorkerState.IDLE || status === WorkerState.COMPLETED || status === WorkerState.ERROR;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 md:p-6 backdrop-blur-lg bg-opacity-95 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Status Indicator text */}
            <div className="flex flex-col">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Status</span>
                <span className={`text-lg font-bold font-mono flex items-center gap-2 
                    ${status === 'RUNNING' ? 'text-green-500' : 
                      status === 'PAUSED' ? 'text-amber-500' : 
                      status === 'ERROR' ? 'text-red-500' : 'text-zinc-400'}`}>
                    {status === 'RUNNING' && <span className="animate-pulse">●</span>}
                    {status}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Start / Resume */}
          {(isIdle || isPaused) && (
            <button
              onClick={isPaused ? onResume : onStart}
              className="flex items-center gap-2 bg-betfair-yellow hover:bg-yellow-500 text-black px-6 py-3 rounded font-bold shadow-lg shadow-yellow-500/10 transition-all active:scale-95 flex-1 md:flex-none justify-center"
            >
              <Play size={18} fill="currentColor" />
              {isPaused ? 'RESUME' : 'START JOB'}
            </button>
          )}

          {/* Pause */}
          {isRunning && (
            <button
              onClick={onPause}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-amber-500 border border-amber-500/30 px-6 py-3 rounded font-bold transition-all active:scale-95 flex-1 md:flex-none justify-center"
            >
              <Pause size={18} fill="currentColor" />
              PAUSE
            </button>
          )}

          {/* Stop / Emergency */}
          {!isIdle && (
            <button
              onClick={onStop}
              className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-6 py-3 rounded font-bold transition-all active:scale-95 flex-1 md:flex-none justify-center"
            >
              <Square size={18} fill="currentColor" />
              STOP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};