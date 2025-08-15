import React, { useState, useRef } from 'react';

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setTranscript('');
    setReply('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = async () => {
      setLoading(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      try {
        const resTranscribe = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        const dataTranscribe = await resTranscribe.json();
        const transcription = dataTranscribe.transcription;
        setTranscript(transcription || '');
        const resAsk = await fetch('/api/ask-dpe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: transcription }),
        });
        const dataAsk = await resAsk.json();
        const dpeReply = dataAsk.reply;
        setReply(dpeReply || '');
        const resTts = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: dpeReply }),
        });
        const dataTts = await resTts.json();
        const audioUrl = dataTts.audioUrl;
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-6">
      <button
        onClick={recording ? stopRecording : startRecording}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {loading && <p className="mt-2 text-gray-500">Processing...</p>}
      {transcript && <p className="mt-2 text-center">You said: {transcript}</p>}
      {reply && <p className="mt-2 text-center">DPE: {reply}</p>}
    </div>
  );
}
