import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogTerminalProps {
  logs: LogEntry[];
}

export const LogTerminal: React.FC<LogTerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-400';
      case 'WARN': return 'text-amber-400';
      case 'ERROR': return 'text-red-500';
      case 'SUCCESS': return 'text-green-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-lg flex flex-col h-96 font-mono text-sm shadow-inner overflow-hidden">
      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs text-zinc-400 font-medium tracking-wider">SYSTEM LOGS</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto terminal-scroll bg-[#0c0c0c]">
        {logs.length === 0 ? (
          <div className="text-zinc-600 italic">No logs available. System idle.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="mb-1 leading-relaxed break-all">
              <span className="text-zinc-600 mr-2 select-none">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={`font-bold mr-2 w-16 inline-block ${getLevelColor(log.level)}`}>{log.level}</span>
              <span className="text-zinc-300">{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};