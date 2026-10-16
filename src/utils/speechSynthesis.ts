/**
 * Text-to-Speech (TTS) Engine using browser SpeechSynthesis API
 */

export interface TTSState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentVoiceURI: string | null;
  activeTextSnippet: string | null;
  currentSectionTitle: string | null;
}

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  isDefault: boolean;
}

export class ScopeTextToSpeech {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private queue: Array<{ text: string; sectionTitle?: string }> = [];
  private queueIndex = 0;
  private rate = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private onStateChange: (state: Partial<TTSState>) => void;

  constructor(onStateChange: (state: Partial<TTSState>) => void) {
    this.onStateChange = onStateChange;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      this.onStateChange({ isSupported: false });
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Default to natural or preferred English/Hindi voice if available
    if (!this.selectedVoice && this.voices.length > 0) {
      this.selectedVoice =
        this.voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
        this.voices.find((v) => v.lang.startsWith('en')) ||
        this.voices[0];
    }
  }

  public getVoices(): VoiceOption[] {
    return this.voices.map((v) => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      isDefault: v.default,
    }));
  }

  public setVoiceByURI(voiceURI: string) {
    const matched = this.voices.find((v) => v.voiceURI === voiceURI);
    if (matched) {
      this.selectedVoice = matched;
      this.onStateChange({ currentVoiceURI: voiceURI });
    }
  }

  public setVoiceForLanguage(langCode: 'en' | 'hi' | 'hinglish') {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    if (langCode === 'hi') {
      const hiVoice = this.voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
      if (hiVoice) {
        this.selectedVoice = hiVoice;
        this.onStateChange({ currentVoiceURI: hiVoice.voiceURI });
        return;
      }
    }
    // Fallback to Indian English or primary English for Hinglish/English
    const enInVoice = this.voices.find((v) => v.lang.toLowerCase() === 'en-in');
    const enVoice =
      enInVoice ||
      this.voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) ||
      this.voices.find((v) => v.lang.startsWith('en')) ||
      this.voices[0];

    if (enVoice) {
      this.selectedVoice = enVoice;
      this.onStateChange({ currentVoiceURI: enVoice.voiceURI });
    }
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.75, Math.min(2.0, newRate));
    this.onStateChange({ rate: this.rate });
  }

  /**
   * Splits long markdown/text into smaller digestible phrases (to prevent Chromium 15-second cutoff)
   */
  private segmentText(rawText: string): string[] {
    // Strip markdown formatting symbols for smooth speech
    const clean = rawText
      .replace(/#+\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/•\s/g, 'Deliverable: ')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/```[\s\S]*?```/g, '');

    // Split by sentences or paragraph chunks
    const chunks = clean.match(/[^.!?\n]+[.!?\n]+/g) || [clean];
    return chunks.map((c) => c.trim()).filter((c) => c.length > 2);
  }

  public speakSections(sections: Array<{ title: string; content: string }>) {
    this.stop();
    if (!this.synth) {
      this.onStateChange({ isSupported: false });
      return;
    }

    this.queue = [];
    for (const sec of sections) {
      const pieces = this.segmentText(sec.content);
      for (const piece of pieces) {
        this.queue.push({ text: piece, sectionTitle: sec.title });
      }
    }

    this.queueIndex = 0;
    if (this.queue.length > 0) {
      this.playNextChunk();
    }
  }

  public speakSingleText(text: string, title: string = 'Reading') {
    this.speakSections([{ title, content: text }]);
  }

  private playNextChunk() {
    if (!this.synth || this.queueIndex >= this.queue.length) {
      this.stop();
      return;
    }

    const item = this.queue[this.queueIndex];
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.rate = this.rate;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onstart = () => {
      this.onStateChange({
        isPlaying: true,
        isPaused: false,
        activeTextSnippet: item.text,
        currentSectionTitle: item.sectionTitle || 'Speaking',
      });
    };

    utterance.onend = () => {
      this.queueIndex++;
      if (this.queueIndex < this.queue.length) {
        this.playNextChunk();
      } else {
        this.stop();
      }
    };

    utterance.onerror = (e) => {
      console.warn('TTS utterance error:', e);
      this.stop();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.onStateChange({ isPaused: true, isPlaying: false });
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.onStateChange({ isPaused: false, isPlaying: true });
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.queue = [];
    this.queueIndex = 0;
    this.currentUtterance = null;
    this.onStateChange({
      isPlaying: false,
      isPaused: false,
      activeTextSnippet: null,
      currentSectionTitle: null,
    });
  }
}
