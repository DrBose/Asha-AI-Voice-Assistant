
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLiveSession } from './hooks/useLiveSession';
import { SessionStatus, TranscriptEntry, Language } from './types';
import { LANGUAGES } from './constants';
import LanguageSelector from './components/LanguageSelector';
import ControlPanel from './components/ControlPanel';
import StatusIndicator from './components/StatusIndicator';
import Transcript from './components/Transcript';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [status, setStatus] = useState<SessionStatus>('IDLE');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentUserTranscription, setCurrentUserTranscription] = useState('');
  const [currentAiTranscription, setCurrentAiTranscription] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const handleTurnComplete = useCallback((userInput: string, aiInput: string) => {
    setTranscript(prev => [
      ...prev,
      { id: Date.now(), speaker: 'user', text: userInput },
      { id: Date.now() + 1, speaker: 'ai', text: aiInput },
    ]);
    setCurrentUserTranscription('');
    setCurrentAiTranscription('');
  }, []);

  const { startSession, stopSession } = useLiveSession({
    language: selectedLanguage,
    onStatusChange: setStatus,
    onUserTranscription: setCurrentUserTranscription,
    onAiTranscription: setCurrentAiTranscription,
    onTurnComplete: handleTurnComplete,
  });

  const isSessionActive = status === 'CONNECTING' || status === 'CONNECTED';

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentUserTranscription, currentAiTranscription]);

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <h1 className="text-xl font-bold text-gray-800">Asha AI Voice Assistant</h1>
        </div>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          disabled={isSessionActive}
        />
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <StatusIndicator status={status} />
        <Transcript
          transcript={transcript}
          currentUserTranscription={currentUserTranscription}
          currentAiTranscription={currentAiTranscription}
        />
        <div ref={transcriptEndRef} />
      </main>

      <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <ControlPanel
          status={status}
          onStart={startSession}
          onStop={stopSession}
        />
      </footer>
    </div>
  );
};

export default App;
