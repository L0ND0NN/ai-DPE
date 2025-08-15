import React from 'react';
import VoiceRecorder from '../components/VoiceRecorder';

export default function Session() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Mock Oral Session</h1>
      <p className="mb-4 text-lg text-center">
        Press the button to start your mock oral session. Speak clearly into your microphone.
      </p>
      <VoiceRecorder />
    </div>
  );
}
