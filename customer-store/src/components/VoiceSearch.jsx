import React, { useRef, useState } from 'react';

export default function VoiceSearch({ onResult }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const supported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.onresult = (event) => {
      const res = event.results[event.results.length - 1];
      const text = res[0].transcript.trim();
      setTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* noop */
      }
    }
    setListening(false);
    if (transcript.trim()) {
      onResult(transcript);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`inline-mic-btn ${listening ? 'listening' : ''}`}
        id="micBtn"
        onClick={toggle}
        aria-label="Voice search"
      >
        <i className="bi bi-mic-fill"></i>
      </button>
      {listening && (
        <div id="transcript" style={{ position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
          {transcript || 'Listening...'}
        </div>
      )}
    </>
  );
}