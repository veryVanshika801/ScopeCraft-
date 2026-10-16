/**
 * ScopeCraft Audio Recording & Hardware Diagnostic Utility
 * Handles robust microphone capture via navigator.mediaDevices.getUserMedia,
 * cross-browser MediaRecorder initialization, track cleanup, and detailed
 * error differentiation (NotAllowedError, NotFoundError, NotReadableError,
 * OverconstrainedError, SecurityError, NotSupportedError).
 */

export type AudioRecorderErrorCode =
  | 'not_allowed'
  | 'not_found'
  | 'not_readable'
  | 'overconstrained'
  | 'security'
  | 'unsupported'
  | 'recorder_failed'
  | 'unknown';

export interface AudioErrorDetails {
  code: AudioRecorderErrorCode;
  rawName: string;
  rawMessage: string;
  title: string;
  description: string;
  isPermissionDenied: boolean;
  troubleshootingSteps: string[];
}

/**
 * Checks whether the browser and security context support audio capture.
 */
export function checkAudioCaptureSupport(): {
  isSupported: boolean;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  reason?: string;
} {
  if (typeof window === 'undefined') {
    return {
      isSupported: false,
      isSecureContext: false,
      hasMediaDevices: false,
      hasGetUserMedia: false,
      reason: 'Window object unavailable (SSR or non-browser environment).',
    };
  }

  const isSecure = window.isSecureContext ?? (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const hasMediaDevices = Boolean(navigator && navigator.mediaDevices);
  const hasGetUserMedia = Boolean(hasMediaDevices && navigator.mediaDevices.getUserMedia);

  if (!isSecure) {
    return {
      isSupported: false,
      isSecureContext: false,
      hasMediaDevices,
      hasGetUserMedia,
      reason: 'Microphone capture requires a secure context (HTTPS or localhost).',
    };
  }

  if (!hasGetUserMedia) {
    return {
      isSupported: false,
      isSecureContext: true,
      hasMediaDevices,
      hasGetUserMedia,
      reason: 'navigator.mediaDevices.getUserMedia is not supported in this browser.',
    };
  }

  return {
    isSupported: true,
    isSecureContext: true,
    hasMediaDevices: true,
    hasGetUserMedia: true,
  };
}

/**
 * Safely inspects current microphone permission state via the Permissions API
 * without failing on unsupported browsers or names.
 */
export async function queryMicrophonePermissionState(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
  if (typeof navigator === 'undefined' || !navigator.permissions || !navigator.permissions.query) {
    return 'unsupported';
  }

  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return status.state;
  } catch (e) {
    // Some browsers throw TypeError for 'microphone' in permissions.query
    return 'unsupported';
  }
}

/**
 * Detects the optimal supported audio MIME type for MediaRecorder.
 */
export function getSupportedAudioMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return undefined;
  }

  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/wav',
  ];

  for (const type of candidateTypes) {
    try {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    } catch (e) {
      // Continue to next candidate
    }
  }

  return undefined; // Default browser container
}

/**
 * Diagnoses errors from getUserMedia and converts them into precise,
 * actionable diagnostics without falsely claiming permission was denied.
 */
export function diagnoseAudioError(err: any): AudioErrorDetails {
  const name = err?.name || '';
  const message = err?.message || String(err || '');
  const lowerMsg = message.toLowerCase();

  // 1. NotAllowedError / PermissionDeniedError
  if (
    name === 'NotAllowedError' ||
    name === 'PermissionDeniedError' ||
    lowerMsg.includes('permission denied') ||
    lowerMsg.includes('permission dismissed') ||
    lowerMsg.includes('not-allowed')
  ) {
    return {
      code: 'not_allowed',
      rawName: name,
      rawMessage: message,
      title: 'Microphone Permission Blocked or Denied',
      description:
        'Microphone access was denied or dismissed. Chrome or macOS security settings are currently preventing audio capture.',
      isPermissionDenied: true,
      troubleshootingSteps: [
        'Chrome Address Bar: Look at the address bar for the lock/settings icon (or tune icon on the left). Verify "Microphone" is set to "Allow".',
        'macOS System Settings: Open System Settings → Privacy & Security → Microphone. Confirm that "Google Chrome" is toggled ON (blue).',
        'If recently changed: Refresh the browser tab and click "Try Again".',
      ],
    };
  }

  // 2. NotFoundError / DevicesNotFoundError
  if (
    name === 'NotFoundError' ||
    name === 'DevicesNotFoundError' ||
    lowerMsg.includes('not found') ||
    lowerMsg.includes('device not found') ||
    lowerMsg.includes('no microphone')
  ) {
    return {
      code: 'not_found',
      rawName: name,
      rawMessage: message,
      title: 'No Microphone Device Found',
      description:
        'No audio input device was found on this system. A working microphone is required to capture speech.',
      isPermissionDenied: false,
      troubleshootingSteps: [
        'Connect an internal or external microphone, USB headset, or AirPods.',
        'macOS: Open System Settings → Sound → Input, and confirm a functional input device is selected.',
        'Ensure the microphone is not muted or disabled via a hardware switch.',
      ],
    };
  }

  // 3. NotReadableError / TrackStartError
  if (
    name === 'NotReadableError' ||
    name === 'TrackStartError' ||
    lowerMsg.includes('not readable') ||
    lowerMsg.includes('could not start') ||
    lowerMsg.includes('hardware error') ||
    lowerMsg.includes('in use')
  ) {
    return {
      code: 'not_readable',
      rawName: name,
      rawMessage: message,
      title: 'Microphone In Use or Blocked by System Process',
      description:
        'The microphone was found and permission is allowed, but the browser could not read audio. Another application or system service likely has exclusive lock on the microphone.',
      isPermissionDenied: false,
      troubleshootingSteps: [
        'Close other video or audio applications (Zoom, Microsoft Teams, FaceTime, Google Meet, Discord, QuickTime, Skype).',
        'Check if another browser tab or window is actively recording audio.',
        'Restart Google Chrome to reset the CoreAudio input stream lock.',
      ],
    };
  }

  // 4. OverconstrainedError
  if (
    name === 'OverconstrainedError' ||
    name === 'ConstraintNotSatisfiedError' ||
    lowerMsg.includes('overconstrained')
  ) {
    return {
      code: 'overconstrained',
      rawName: name,
      rawMessage: message,
      title: 'Audio Hardware Constraints Could Not Be Satisfied',
      description:
        'The requested audio quality or channel constraints are incompatible with your current audio input device.',
      isPermissionDenied: false,
      troubleshootingSteps: [
        'Retry with standard audio constraints (automatically handled on "Try Again").',
        'Select a different audio input device in system settings.',
      ],
    };
  }

  // 5. SecurityError
  if (
    name === 'SecurityError' ||
    lowerMsg.includes('security') ||
    lowerMsg.includes('permissions policy') ||
    lowerMsg.includes('feature policy')
  ) {
    return {
      code: 'security',
      rawName: name,
      rawMessage: message,
      title: 'Microphone Blocked by Security Policy',
      description:
        'Microphone capture is restricted by document security headers or an iframe sandbox permissions policy.',
      isPermissionDenied: false,
      troubleshootingSteps: [
        'Verify the app is running in a secure context (HTTPS).',
        'If loaded in an iframe, the iframe container must have allow="microphone".',
        'Open the page in a dedicated top-level browser tab.',
      ],
    };
  }

  // 6. NotSupportedError or missing APIs
  if (
    name === 'NotSupportedError' ||
    lowerMsg.includes('not supported') ||
    lowerMsg.includes('notsupported')
  ) {
    return {
      code: 'unsupported',
      rawName: name,
      rawMessage: message,
      title: 'Audio Capture API Unsupported',
      description:
        'Audio recording APIs are not supported in this browser version or environment.',
      isPermissionDenied: false,
      troubleshootingSteps: [
        'Use an updated release of Google Chrome, Microsoft Edge, or Safari.',
        'Use manual typing or the sample dictation buttons to insert requirements.',
      ],
    };
  }

  // 7. Generic error (do NOT claim permission denied)
  return {
    code: 'unknown',
    rawName: name || 'Error',
    rawMessage: message || 'Unknown audio recording error occurred.',
    title: 'Audio Recording Failure',
    description:
      message || 'An unexpected failure occurred while starting audio recording.',
    isPermissionDenied: false,
    troubleshootingSteps: [
      'Click "Try Again" to re-initialize the audio session.',
      'Check browser console for any underlying system diagnostics.',
      'Use the manual transcript input area if audio hardware remains unresponsive.',
    ],
  };
}

/**
 * Robust Audio Recording Session Manager
 * Safely requests media streams, records audio using MediaRecorder,
 * ensures all tracks are terminated upon finish/cancel/error, and prevents
 * duplicate sessions or memory leaks.
 */
export class AudioRecordingManager {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioBlob: Blob | null = null;
  private audioUrl: string | null = null;
  private isRecordingActive = false;

  /**
   * Starts microphone recording in response to a direct user click.
   */
  public async startRecording(onChunk?: (chunk: Blob) => void): Promise<{
    stream: MediaStream;
    mimeType: string;
  }> {
    // 1. Terminate any previous session first
    this.cleanup();

    // 2. Environment support checks
    const support = checkAudioCaptureSupport();
    if (!support.isSupported) {
      throw new DOMException(
        support.reason || 'Audio capture is unsupported in this environment.',
        support.isSecureContext ? 'NotSupportedError' : 'SecurityError'
      );
    }

    // 3. Directly invoke getUserMedia
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (primaryErr) {
      // If overconstrained, retry with minimal audio: true constraint
      if ((primaryErr as any)?.name === 'OverconstrainedError') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        throw primaryErr;
      }
    }

    // 4. Verify stream track health
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      stream.getTracks().forEach((track) => track.stop());
      throw new DOMException(
        'No audio track received from the microphone stream.',
        'NotFoundError'
      );
    }

    this.mediaStream = stream;
    this.audioChunks = [];
    this.audioBlob = null;

    // 5. Initialize MediaRecorder with detected supported MIME type
    const mimeType = getSupportedAudioMimeType();
    let recorder: MediaRecorder;
    try {
      if (mimeType) {
        recorder = new MediaRecorder(stream, { mimeType });
      } else {
        recorder = new MediaRecorder(stream);
      }
    } catch (recInitErr) {
      console.warn('MediaRecorder init with mimeType failed, falling back to default:', recInitErr);
      try {
        recorder = new MediaRecorder(stream);
      } catch (fallbackErr) {
        this.cleanup();
        throw new DOMException(
          'MediaRecorder could not be initialized with this audio stream.',
          'NotSupportedError'
        );
      }
    }

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
        if (onChunk) {
          onChunk(event.data);
        }
      }
    };

    recorder.onerror = (event: any) => {
      console.error('MediaRecorder error:', event.error || event);
      this.isRecordingActive = false;
    };

    // Collect audio data every 250ms for live processing
    try {
      recorder.start(250);
    } catch (e) {
      recorder.start();
    }

    this.mediaRecorder = recorder;
    this.isRecordingActive = true;

    return {
      stream,
      mimeType: recorder.mimeType || mimeType || 'audio/webm',
    };
  }

  /**
   * Stops recording, closes all stream tracks, and constructs the resulting audio Blob.
   */
  public stopRecording(): Promise<{ blob: Blob | null; url: string | null }> {
    return new Promise((resolve) => {
      this.isRecordingActive = false;

      const finalize = () => {
        if (this.audioChunks.length > 0) {
          const mime = this.mediaRecorder?.mimeType || 'audio/webm';
          this.audioBlob = new Blob(this.audioChunks, { type: mime });
          if (this.audioUrl) {
            try {
              URL.revokeObjectURL(this.audioUrl);
            } catch (e) {}
          }
          try {
            this.audioUrl = URL.createObjectURL(this.audioBlob);
          } catch (e) {
            this.audioUrl = null;
          }
        }

        // Release hardware: stop all media tracks
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch (e) {}
          });
          this.mediaStream = null;
        }

        resolve({ blob: this.audioBlob, url: this.audioUrl });
      };

      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          finalize();
        };
        try {
          this.mediaRecorder.stop();
        } catch (e) {
          finalize();
        }
      } else {
        finalize();
      }
    });
  }

  /**
   * Immediately terminates all tracks, closes the recorder, and frees resources.
   */
  public cleanup() {
    this.isRecordingActive = false;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    this.mediaRecorder = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.mediaStream = null;
    }

    if (this.audioUrl) {
      try {
        URL.revokeObjectURL(this.audioUrl);
      } catch (e) {}
      this.audioUrl = null;
    }

    this.audioChunks = [];
    this.audioBlob = null;
  }

  public getStream(): MediaStream | null {
    return this.mediaStream;
  }

  public isRecording(): boolean {
    return this.isRecordingActive;
  }

  public getAudioBlob(): Blob | null {
    return this.audioBlob;
  }

  public getAudioUrl(): string | null {
    return this.audioUrl;
  }
}
