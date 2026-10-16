/**
 * Voice Input (Speech-to-Text) Utility using browser Web Speech API
 */

export interface SpeechRecognitionHookState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  permissionDenied: boolean;
}

export type SupportedSpeechLang = 'en-US' | 'hi-IN';

// Window augmentation for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export class ScopeSpeechRecognizer {
  private recognition: any = null;
  private isListening = false;
  private onTranscriptUpdate: (finalText: string, interimText: string) => void;
  private onError: (err: string, isPermission: boolean) => void;
  private onEnd: () => void;
  private currentLanguage: SupportedSpeechLang = 'en-US';
  private micStreamActive = false;

  constructor(
    onTranscriptUpdate: (finalText: string, interimText: string) => void,
    onError: (err: string, isPermission: boolean) => void,
    onEnd: () => void,
    micStreamActive = false
  ) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onError = onError;
    this.onEnd = onEnd;
    this.micStreamActive = micStreamActive;

    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item.isFinal) {
              final += item[0].transcript + ' ';
            } else {
              interim += item[0].transcript;
            }
          }

          this.onTranscriptUpdate(final, interim);
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event.error);
          const errType = event.error;

          // If getUserMedia has already captured active mic audio, a 'not-allowed' error
          // from webkitSpeechRecognition means the cloud Speech Recognition service / iframe
          // does not allow Google cloud transcription, NOT that hardware mic was denied!
          if (errType === 'not-allowed' || errType === 'service-not-allowed') {
            if (this.micStreamActive) {
              this.onError(
                'Cloud speech-to-text service is restricted in this iframe. Audio is actively recording; you can review or type directly.',
                false
              );
            } else {
              this.onError(
                'Microphone access was denied. Please allow microphone permissions in your browser address bar or OS settings.',
                true
              );
            }
          } else if (errType === 'no-speech') {
            this.onError('No speech detected yet. Please speak clearly into your microphone.', false);
          } else if (errType === 'network') {
            this.onError('Network connection error to browser speech service.', false);
          } else if (errType === 'aborted') {
            // User stopped or aborted; do not show error
          } else {
            this.onError(`Speech recognition notice: ${errType}`, false);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.onEnd();
        };
      } catch (e) {
        console.warn('Error instantiating SpeechRecognition:', e);
      }
    }
  }

  public setMicStreamActive(active: boolean) {
    this.micStreamActive = active;
  }

  public setLanguage(lang: SupportedSpeechLang) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(lang?: SupportedSpeechLang) {
    if (!this.recognition) {
      return;
    }
    if (this.isListening) return;

    try {
      this.recognition.lang = lang || this.currentLanguage;
      this.recognition.start();
      this.isListening = true;
    } catch (e: any) {
      console.warn('Start recognition caught error:', e);
      if (e.name !== 'InvalidStateError') {
        // Recognition already started or busy
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // already stopped
      }
      this.isListening = false;
    }
  }

  public abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}
