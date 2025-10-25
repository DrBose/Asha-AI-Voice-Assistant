
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useLiveSession } from './hooks/useLiveSession';
import { SessionStatus, TranscriptEntry, Language } from './types';
import { LANGUAGES } from './constants';
import LanguageSelector from './components/LanguageSelector';
import ControlPanel from './components/ControlPanel';
import StatusIndicator from './components/StatusIndicator';
import Transcript from './components/Transcript';
import SummaryModal from './components/SummaryModal';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [status, setStatus] = useState<SessionStatus>('IDLE');
  
  // Load initial transcript from localStorage
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(() => {
    try {
      const savedTranscript = localStorage.getItem('transcriptHistory');
      return savedTranscript ? JSON.parse(savedTranscript) : [];
    } catch (error) {
      console.error("Failed to parse transcript from localStorage", error);
      return [];
    }
  });

  const [currentUserTranscription, setCurrentUserTranscription] = useState('');
  const [currentAiTranscription, setCurrentAiTranscription] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  // State for summary modal
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');


  // Persist transcript to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('transcriptHistory', JSON.stringify(transcript));
    } catch (error) {
      console.error("Failed to save transcript to localStorage", error);
    }
  }, [transcript]);

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
  
  const handleClearHistory = () => {
    if (isSessionActive) return;
    setTranscript([]);
  };

  const handleSummarize = async () => {
    if (transcript.length === 0 || isSessionActive) return;

    setIsSummarizing(true);
    setIsSummaryModalOpen(true);
    setSummaryText(''); // Clear previous summary

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const conversationHistory = transcript
        .map(entry => `${entry.speaker === 'user' ? 'Health Worker' : 'Asha AI'}: ${entry.text}`)
        .join('\n');

      const prompt = `Please summarize the following conversation between a rural health worker and an AI assistant named Asha. The summary should be concise and capture the key points of the report being filed. Format the output clearly.
      
Conversation:
${conversationHistory}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setSummaryText(response.text);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setSummaryText("Sorry, I was unable to generate a summary at this time. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <h1 className="text-xl font-bold text-gray-800">Asha AI Voice Assistant</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSummarize}
            disabled={isSessionActive || transcript.length === 0 || isSummarizing}
            title="Summarize conversation"
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSummarizing ? (
              <svg className="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-4V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={handleClearHistory}
            disabled={isSessionActive || transcript.length === 0}
            title="Clear conversation history"
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            disabled={isSessionActive}
          />
        </div>
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
      
      <SummaryModal 
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summaryText={summaryText}
        isLoading={isSummarizing}
      />
    </div>
  );
};

export default App;
