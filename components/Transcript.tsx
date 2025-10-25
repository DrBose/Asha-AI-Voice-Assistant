
import React from 'react';
import { TranscriptEntry } from '../types';

interface TranscriptProps {
  transcript: TranscriptEntry[];
  currentUserTranscription: string;
  currentAiTranscription: string;
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
        You
    </div>
);

const AiIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
    </div>
);


const TranscriptMessage: React.FC<{ entry: TranscriptEntry }> = ({ entry }) => {
  const isUser = entry.speaker === 'user';
  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <AiIcon />}
      <div className={`p-3 rounded-lg max-w-lg ${isUser ? 'bg-teal-100 text-teal-900' : 'bg-white text-gray-800 border'}`}>
        <p className="text-sm">{entry.text}</p>
      </div>
       {isUser && <UserIcon />}
    </div>
  );
};


const InProgressTranscript: React.FC<{ speaker: 'user' | 'ai', text: string }> = ({ speaker, text }) => {
    if(!text) return null;
    const isUser = speaker === 'user';
    return (
        <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && <AiIcon />}
            <div className={`p-3 rounded-lg max-w-lg opacity-70 ${isUser ? 'bg-teal-50 text-teal-700' : 'bg-gray-50 text-gray-600 border'}`}>
                <p className="text-sm italic">{text}</p>
            </div>
            {isUser && <UserIcon />}
        </div>
    );
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, currentUserTranscription, currentAiTranscription }) => {
  return (
    <div className="space-y-4">
      {transcript.length === 0 && !currentUserTranscription && (
         <div className="text-center text-gray-500 py-10">
            <p>Press 'Start' to begin your conversation.</p>
            <p className="text-sm">Your report transcript will appear here.</p>
        </div>
      )}
      {transcript.map((entry) => (
        <TranscriptMessage key={entry.id} entry={entry} />
      ))}
      <InProgressTranscript speaker="user" text={currentUserTranscription} />
      <InProgressTranscript speaker="ai" text={currentAiTranscription} />
    </div>
  );
};

export default Transcript;
