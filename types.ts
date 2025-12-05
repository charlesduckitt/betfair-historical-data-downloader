export enum WorkerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPING = 'STOPPING',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface SystemStats {
  downloadedFiles: number;
  parsedMarkets: number;
  errors: number;
  queueSize: number;
  diskSpaceFreeGB: number;
  downloadSpeed: number; // files per minute
  activeThreads: number;
  currentYear: string;
  currentMonth: string;
}

export interface AppState {
  status: WorkerState;
  stats: SystemStats;
  logs: LogEntry[];
  isAuthenticated: boolean;
  config: {
    appKey: string;
    ssoid: string;
  };
}

export interface AuthCredentials {
  appKey: string;
  ssoid: string;
}