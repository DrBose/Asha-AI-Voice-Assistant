
import React from 'react';
import { SessionStatus } from '../types';

interface StatusIndicatorProps {
  status: SessionStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusContent = () => {
    switch (status) {
      case 'IDLE':
        return {
          text: 'Ready to start',
          color: 'bg-gray-400',
          pulse: false,
        };
      case 'CONNECTING':
        return {
          text: 'Connecting...',
          color: 'bg-yellow-500',
          pulse: true,
        };
      case 'CONNECTED':
        return {
          text: 'Listening... (Start speaking)',
          color: 'bg-green-500',
          pulse: true,
        };
      case 'ERROR':
        return {
          text: 'An error occurred. Please restart.',
          color: 'bg-red-500',
          pulse: false,
        };
      case 'DISCONNECTED':
        return {
          text: 'Session ended',
          color: 'bg-gray-500',
          pulse: false,
        };
      default:
        return {
          text: 'Unknown Status',
          color: 'bg-gray-400',
          pulse: false,
        };
    }
  };

  const { text, color, pulse } = getStatusContent();

  return (
    <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <span className={`relative flex h-3 w-3 mr-3`}>
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${color} ${pulse ? 'animate-ping' : ''} opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${color}`}
        ></span>
      </span>
      <p className="text-sm font-medium text-gray-700">{text}</p>
    </div>
  );
};

export default StatusIndicator;
