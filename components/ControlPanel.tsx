
import React from 'react';
import { SessionStatus } from '../types';

interface ControlPanelProps {
  status: SessionStatus;
  onStart: () => void;
  onStop: () => void;
}

const MicrophoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7v1h6v-1h-2v-2.07z" clipRule="evenodd"></path></svg>
);

const StopIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path></svg>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ status, onStart, onStop }) => {
  const isSessionActive = status === 'CONNECTING' || status === 'CONNECTED';

  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={onStart}
        disabled={isSessionActive}
        className="flex items-center justify-center w-32 px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <MicrophoneIcon className="w-5 h-5 mr-2" />
        Start
      </button>
      <button
        onClick={onStop}
        disabled={!isSessionActive}
        className="flex items-center justify-center w-32 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <StopIcon className="w-5 h-5 mr-2" />
        Stop
      </button>
    </div>
  );
};

export default ControlPanel;
