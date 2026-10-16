import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  AudioRecordingManager,
  diagnoseAudioError,
  checkAudioCaptureSupport,
  queryMicrophonePermissionState,
  AudioErrorDetails,
} from '../utils/audioRecorder';
import {
  isSpeechRecognitionSupported,
  ScopeSpeechRecognizer,
  SupportedSpeechLang,
} from '../utils/speechRecognition';

export type VoiceRecordingState =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'stopping'
  | 'complete'
  | 'error';

interface VoiceInputButtonProps {
  onAcceptTranscript: (text: string, mode: 'append' | 'replace') => void;
  fieldLabel: string;
  currentValue?: string;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onAcceptTranscript,
  fieldLabel,
  currentValue = '',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recordingState, setRecordingState] = useState<VoiceRecordingState>('idle');
  const [selectedLang, setSelectedLang] = useState<SupportedSpeechLang>('en-US');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [editedTranscript, setEditedTranscript] = useState('');
  const [errorDetails, setErrorDetails] = useState<AudioErrorDetails | null>(null);
  const [insertMode, setInsertMode] = useState<'append' | 'replace'>('append');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [activeMimeType, setActiveMimeType] = useState<string>('');
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [sttNotice, setSttNotice] = useState<string | null>(null);

  const audioManagerRef = useRef<AudioRecordingManager | null>(null);
  const recognizerRef = useRef<ScopeSpeechRecognizer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or retrieve manager instance
  if (!audioManagerRef.current) {
    audioManagerRef.current = new AudioRecordingManager();
  }

  const isSttSupported = isSpeechRecognitionSupported();
  const supportCheck = checkAudioCaptureSupport();

  // Inspect permission state safely on open
  useEffect(() => {
    if (isOpen) {
      queryMicrophonePermissionState().then((state) => {
        setPermissionState(state);
      });
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.cleanup();
      }
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const stopActiveSession = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }

    if (audioManagerRef.current && audioManagerRef.current.isRecording()) {
      setRecordingState('stopping');
      try {
        const { url } = await audioManagerRef.current.stopRecording();
        if (url) {
          setRecordedAudioUrl(url);
        }
        setRecordingState('complete');
      } catch (e) {
        setRecordingState('complete');
      }
    } else {
      setRecordingState('idle');
    }
  }, []);

  const handleOpenModal = () => {
    setIsOpen(true);
    // Explicitly do NOT start recording on open - start in 'idle' state
    setRecordingState('idle');
    setErrorDetails(null);
    setSttNotice(null);
    setFinalTranscript('');
    setInterimText('');
    setEditedTranscript('');
    setRecordingSeconds(0);
    setRecordedAudioUrl(null);
    setShowTroubleshooting(false);
  };

  const handleClose = () => {
    stopActiveSession();
    if (audioManagerRef.current) {
      audioManagerRef.current.cleanup();
    }
    setIsOpen(false);
  };

  /**
   * Primary recording initiator triggered ONLY by explicit user click.
   */
  const handleStartRecording = async (langToUse = selectedLang) => {
    // Prevent duplicate sessions
    if (recordingState === 'requesting' || recordingState === 'recording') {
      return;
    }

    setErrorDetails(null);
    setSttNotice(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setRecordingState('requesting');

    // Pre-flight check
    const envCheck = checkAudioCaptureSupport();
    if (!envCheck.isSupported) {
      const err = new DOMException(
        envCheck.reason || 'Microphone recording is not supported in this browser.',
        envCheck.isSecureContext ? 'NotSupportedError' : 'SecurityError'
      );
      const diagnosed = diagnoseAudioError(err);
      setErrorDetails(diagnosed);
      setRecordingState('error');
      return;
    }

    try {
      // 1. Request microphone stream via getUserMedia directly inside click handler
      const { stream, mimeType } = await audioManagerRef.current!.startRecording();
      setActiveMimeType(mimeType);

      // Verify active track
      const tracks = stream.getAudioTracks();
      if (!tracks || tracks.length === 0 || !tracks[0].enabled) {
        throw new DOMException('Microphone track is unavailable or muted.', 'NotFoundError');
      }

      // Update state to active recording
      setRecordingState('recording');
      setPermissionState('granted');

      // Start elapsed timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // 2. Start speech-to-text transcription engine in parallel
      if (isSttSupported) {
        try {
          recognizerRef.current = new ScopeSpeechRecognizer(
            (final, interim) => {
              setFinalTranscript((prev) => {
                const combined = (prev + ' ' + final).trim();
                setEditedTranscript(combined);
                return combined;
              });
              setInterimText(interim);
            },
            (notice, isPermission) => {
              if (isPermission) {
                // If audioManager already captured the audio stream, then microphone permission IS granted!
                // The issue is Google's cloud STT endpoint restriction in the current iframe/sandbox.
                setSttNotice(
                  'Microphone audio captured successfully. Live cloud speech transcription is restricted in this frame — you can type or edit your transcript directly.'
                );
              } else {
                setSttNotice(notice);
              }
            },
            () => {
              // STT engine stopped naturally
            },
            true // micStreamActive = true
          );

          recognizerRef.current.start(langToUse);
        } catch (sttErr) {
          console.warn('Speech recognition start failed, audio recording continues:', sttErr);
          setSttNotice(
            'Audio capture is running. Automatic speech-to-text service is currently resting; feel free to type notes or use sample dictation.'
          );
        }
      } else {
        setSttNotice(
          'Microphone recording is active. Native browser speech-to-text is unavailable in this engine, but your audio session is live and you can type below.'
        );
      }
    } catch (captureErr: any) {
      console.error('Audio capture failure:', captureErr);
      if (timerRef.current) clearInterval(timerRef.current);
      const diagnosed = diagnoseAudioError(captureErr);
      setErrorDetails(diagnosed);
      setRecordingState('error');

      if (diagnosed.isPermissionDenied) {
        setPermissionState('denied');
        setShowTroubleshooting(true);
      }
    }
  };

  const handleLanguageChange = (lang: SupportedSpeechLang) => {
    setSelectedLang(lang);
    if (recordingState === 'recording') {
      stopActiveSession().then(() => {
        setTimeout(() => handleStartRecording(lang), 300);
      });
    }
  };

  const handleAccept = () => {
    const textToInsert = editedTranscript.trim() || finalTranscript.trim();
    if (textToInsert) {
      onAcceptTranscript(textToInsert, insertMode);
    }
    handleClose();
  };

  const handleClearText = () => {
    setEditedTranscript('');
    setFinalTranscript('');
    setInterimText('');
  };

  return (
    <>
      {/* Microphone Trigger Button */}
      <button
        type="button"
        onClick={handleOpenModal}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors cursor-pointer border ${
          recordingState === 'recording'
            ? 'bg-rose-100 text-rose-900 border-rose-400 animate-pulse'
            : 'bg-[#F5F0E7] text-[#39483B] hover:text-[#22221F] border-[#22221F]/15 hover:border-[#39483B]/50'
        } ${className}`}
        title={`Speak into ${fieldLabel} via Talk-to-Scope voice input`}
        aria-label={`Record voice for ${fieldLabel}`}
      >
        <span className="text-sm">🎙</span>
        <span className="hidden sm:inline">Talk-to-Scope</span>
      </button>

      {/* Voice Review & Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#22221F]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#22221F]/10">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    recordingState === 'recording'
                      ? 'bg-rose-600 animate-ping'
                      : recordingState === 'requesting'
                      ? 'bg-amber-500 animate-pulse'
                      : recordingState === 'complete'
                      ? 'bg-emerald-600'
                      : 'bg-[#39483B]'
                  }`}
                />
                <h3 className="font-serif text-xl font-medium text-[#22221F]">
                  Talk-to-Scope: Voice Input
                </h3>
                <span className="text-[10px] font-mono uppercase bg-[#E9E0D2] text-[#39483B] px-2 py-0.5">
                  {fieldLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-2xl text-[#22221F]/40 hover:text-[#22221F] leading-none cursor-pointer"
                aria-label="Close voice modal"
              >
                ×
              </button>
            </div>

            {/* Language Selector & Dynamic Recording Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#22221F]/60 text-[11px] uppercase">Language:</span>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en-US')}
                  className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer border ${
                    selectedLang === 'en-US'
                      ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B]'
                      : 'bg-[#F5F0E7] text-[#22221F] border-[#22221F]/15'
                  }`}
                >
                  English (US/UK/IN)
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('hi-IN')}
                  className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer border ${
                    selectedLang === 'hi-IN'
                      ? 'bg-[#39483B] text-[#F5F0E7] border-[#39483B]'
                      : 'bg-[#F5F0E7] text-[#22221F] border-[#22221F]/15'
                  }`}
                >
                  Hinglish / हिन्दी (IN)
                </button>
              </div>

              {/* Status Badges */}
              {recordingState === 'recording' && (
                <div className="flex items-center gap-2.5 text-rose-800 font-mono text-xs">
                  {/* Animated Soundwave bars */}
                  <div className="flex items-end gap-1 h-5 px-1.5 py-0.5 bg-rose-50 border border-rose-200">
                    <span className="w-1 bg-rose-600 animate-pulse rounded-xs" style={{ height: '60%', animationDuration: '0.4s' }} />
                    <span className="w-1 bg-rose-600 animate-pulse rounded-xs" style={{ height: '100%', animationDuration: '0.6s' }} />
                    <span className="w-1 bg-rose-600 animate-pulse rounded-xs" style={{ height: '40%', animationDuration: '0.5s' }} />
                    <span className="w-1 bg-rose-600 animate-pulse rounded-xs" style={{ height: '85%', animationDuration: '0.35s' }} />
                    <span className="w-1 bg-rose-600 animate-pulse rounded-xs" style={{ height: '55%', animationDuration: '0.7s' }} />
                  </div>
                  <span className="font-semibold">Live Mic Active ({recordingSeconds}s)</span>
                </div>
              )}

              {recordingState === 'requesting' && (
                <div className="flex items-center gap-2 text-amber-800 font-mono text-xs animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Requesting microphone access...</span>
                </div>
              )}

              {recordingState === 'stopping' && (
                <div className="flex items-center gap-2 text-[#39483B] font-mono text-xs animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#39483B]" />
                  <span>Finalizing audio tracks...</span>
                </div>
              )}

              {recordingState === 'complete' && (
                <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Audio Captured ({recordingSeconds}s)</span>
                </div>
              )}

              {recordingState === 'idle' && (
                <div className="flex items-center gap-1.5 text-[#22221F]/60 font-mono text-[11px]">
                  <span>Ready to record</span>
                </div>
              )}
            </div>

            {/* Audio Preview Player if recorded */}
            {recordedAudioUrl && (
              <div className="p-3 bg-[#E9E0D2]/50 border border-[#22221F]/15 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#39483B] font-semibold uppercase">Captured Audio:</span>
                  <audio controls src={recordedAudioUrl} className="h-8 max-w-[240px]" />
                </div>
                {activeMimeType && (
                  <span className="font-mono text-[10px] text-[#22221F]/60 bg-[#FFFFFF] px-2 py-1 border border-[#22221F]/10">
                    {activeMimeType}
                  </span>
                )}
              </div>
            )}

            {/* Quick Demo Voice Simulation Chips */}
            <div className="p-2.5 bg-[#F5F0E7]/60 border border-[#22221F]/10 flex flex-wrap items-center gap-2 text-[11px] font-sans">
              <span className="font-mono text-[10px] uppercase text-[#39483B] font-semibold">Test Voice Dictation:</span>
              <button
                type="button"
                onClick={() => {
                  const demo = "Client requires an editorial publishing hub with responsive layout, clear typography, and a 4-week timeline.";
                  setFinalTranscript((prev) => (prev ? `${prev} ${demo}` : demo));
                  setEditedTranscript((prev) => (prev ? `${prev} ${demo}` : demo));
                }}
                className="px-2 py-0.5 bg-[#FFFFFF] hover:bg-[#E9E0D2] border border-[#22221F]/15 text-[#22221F] cursor-pointer"
              >
                + English Sample Dictation
              </button>
              <button
                type="button"
                onClick={() => {
                  const demo = "Client ko bilingual portal chahiye, payment gateway integration ke sath. Launch deadline agle mahine hai.";
                  setFinalTranscript((prev) => (prev ? `${prev} ${demo}` : demo));
                  setEditedTranscript((prev) => (prev ? `${prev} ${demo}` : demo));
                }}
                className="px-2 py-0.5 bg-[#FFFFFF] hover:bg-[#E9E0D2] border border-[#22221F]/15 text-[#22221F] cursor-pointer"
              >
                + Hinglish Sample Dictation
              </button>
            </div>

            {/* Granular Error Diagnosis Display */}
            {errorDetails && (
              <div
                className={`p-4 border text-xs space-y-2.5 ${
                  errorDetails.code === 'not_allowed'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : errorDetails.code === 'not_found'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : errorDetails.code === 'not_readable'
                    ? 'bg-orange-50 border-orange-300 text-orange-950'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>{errorDetails.title}</span>
                    </div>
                    <p className="leading-relaxed">{errorDetails.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartRecording(selectedLang)}
                    className="shrink-0 px-3 py-1.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-[11px] font-mono uppercase tracking-wider cursor-pointer"
                  >
                    ↻ Try Again
                  </button>
                </div>

                {/* Specific troubleshooting bullet points */}
                {errorDetails.troubleshootingSteps.length > 0 && (
                  <div className="pt-2 border-t border-black/10 space-y-1">
                    <div className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-80">
                      Recommended Steps:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 font-sans text-[11px]">
                      {errorDetails.troubleshootingSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Collapsible macOS / Chrome Guide */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                    className="font-mono text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
                  >
                    {showTroubleshooting ? 'Hide macOS & Chrome Setup Guide ▲' : 'Show macOS & Chrome Setup Guide ▼'}
                  </button>
                </div>
              </div>
            )}

            {/* Persistent macOS & Chrome Troubleshooting Guide */}
            {showTroubleshooting && (
              <div className="p-4 bg-[#F5F0E7] border border-[#22221F]/20 text-xs space-y-3 font-sans">
                <div className="font-serif font-bold text-sm text-[#22221F]">
                  macOS & Google Chrome Microphone Guide
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-[#FFFFFF] border border-[#22221F]/10 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-[#39483B] font-bold">
                      1. Chrome Site Settings
                    </div>
                    <p className="text-[#22221F]/80">
                      Click the <strong>tune/lock icon</strong> on the left side of the address bar. Verify that <strong>Microphone</strong> is toggled to <strong>Allow</strong>.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF] border border-[#22221F]/10 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-[#39483B] font-bold">
                      2. macOS System Permissions
                    </div>
                    <p className="text-[#22221F]/80">
                      Go to <strong>System Settings → Privacy & Security → Microphone</strong>. Ensure <strong>Google Chrome</strong> is enabled (blue switch).
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF] border border-[#22221F]/10 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-[#39483B] font-bold">
                      3. Input Device Selection
                    </div>
                    <p className="text-[#22221F]/80">
                      Go to <strong>System Settings → Sound → Input</strong> and confirm your built-in mic or headset is receiving signal.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF] border border-[#22221F]/10 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-[#39483B] font-bold">
                      4. Refresh & Retry
                    </div>
                    <p className="text-[#22221F]/80">
                      After granting macOS or Chrome access, reload the browser tab once so the browser process registers the updated permissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STT Notice (when mic is active but cloud STT is restricted in iframe) */}
            {sttNotice && (
              <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-950 text-xs flex items-center justify-between gap-2">
                <span>{sttNotice}</span>
                <button
                  type="button"
                  onClick={() => setSttNotice(null)}
                  className="font-mono text-[10px] text-sky-800 hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Live Recording Area & Transcript Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="transcript-box" className="font-mono uppercase text-[#22221F]/70 text-[11px]">
                  Review & Edit Transcribed Text:
                </label>
                {interimText && (
                  <span className="text-[#39483B] italic text-[11px] font-sans">
                    Listening: "{interimText}"
                  </span>
                )}
              </div>

              <textarea
                id="transcript-box"
                rows={4}
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                placeholder={
                  recordingState === 'recording'
                    ? 'Microphone active! Speak now... your transcript will appear here in real time.'
                    : recordingState === 'requesting'
                    ? 'Requesting microphone permission from browser...'
                    : 'Transcribed text will appear here. You can also type or edit directly at any time.'
                }
                className="w-full p-4 bg-[#F5F0E7]/40 border border-[#22221F]/20 text-xs text-[#22221F] focus:outline-none focus:border-[#39483B] leading-relaxed font-sans"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#22221F]/70 pt-1">
                {/* Insert mode options */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[#22221F]/60">Insertion:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name={`insertMode-${fieldLabel}`}
                      checked={insertMode === 'append'}
                      onChange={() => setInsertMode('append')}
                      className="text-[#39483B]"
                    />
                    <span>Append to existing text</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name={`insertMode-${fieldLabel}`}
                      checked={insertMode === 'replace'}
                      onChange={() => setInsertMode('replace')}
                      className="text-[#39483B]"
                    />
                    <span>Replace entire field</span>
                  </label>
                </div>

                {currentValue && (
                  <span className="font-mono text-[10px] text-[#22221F]/50">
                    Existing field: {currentValue.length} characters
                  </span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#22221F]/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {recordingState === 'recording' ? (
                  <button
                    type="button"
                    onClick={stopActiveSession}
                    className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⏹ Stop Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartRecording(selectedLang)}
                    disabled={recordingState === 'requesting' || recordingState === 'stopping'}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      recordingState === 'requesting' || recordingState === 'stopping'
                        ? 'bg-[#22221F]/20 text-[#22221F]/40 cursor-wait'
                        : 'bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7]'
                    }`}
                  >
                    <span>🎙 Start Recording</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClearText}
                  className="px-3 py-2 text-xs font-mono text-[#22221F]/60 hover:text-[#22221F] underline cursor-pointer"
                >
                  Clear Text
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-mono text-[#22221F]/70 hover:text-[#22221F] cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={!editedTranscript.trim() && !finalTranscript.trim()}
                  className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer font-medium ${
                    editedTranscript.trim() || finalTranscript.trim()
                      ? 'bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7]'
                      : 'bg-[#22221F]/20 text-[#22221F]/40 cursor-not-allowed'
                  }`}
                >
                  ✓ Accept & Insert Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
