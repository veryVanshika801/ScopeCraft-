import React, { useEffect, useState } from 'react';
import { ScopeTextToSpeech, TTSState, VoiceOption } from '../utils/speechSynthesis';

interface AudioPlayerBarProps {
  ttsEngine: ScopeTextToSpeech;
  ttsState: TTSState;
  onStop: () => void;
  className?: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  ttsEngine,
  ttsState,
  onStop,
  className = '',
}) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);

  useEffect(() => {
    setVoices(ttsEngine.getVoices());
  }, [ttsEngine]);

  if (!ttsState.isSupported) {
    return (
      <div className={`p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between ${className}`}>
        <span>Text-to-Speech is not supported in this browser. Please use Chrome, Safari, or Edge.</span>
        <button onClick={onStop} className="text-amber-800 font-bold ml-2">×</button>
      </div>
    );
  }

  if (!ttsState.isPlaying && !ttsState.isPaused) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-[#22221F] text-[#F5F0E7] border-t border-[#F5F0E7]/20 shadow-2xl px-6 py-3.5 transition-all animate-in slide-in-from-bottom duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Indicator & Current Text */}
        <div className="flex items-center gap-3 overflow-hidden w-full md:w-auto">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A6AD99]">
              {ttsState.isPaused ? 'Paused' : 'Listening to'}
            </span>
          </div>

          <div className="truncate">
            <span className="font-serif italic font-medium text-sm text-[#F5F0E7] mr-2">
              {ttsState.currentSectionTitle || 'Proposal Monograph'}
            </span>
            {ttsState.activeTextSnippet && (
              <span className="text-xs text-[#F5F0E7]/70 font-sans truncate hidden sm:inline">
                "{ttsState.activeTextSnippet.slice(0, 90)}..."
              </span>
            )}
          </div>
        </div>

        {/* Center / Right: Controls */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Speed selector */}
          <div className="flex items-center gap-1 text-[11px] font-mono bg-[#39483B]/50 px-2 py-1 border border-[#F5F0E7]/10">
            <span className="text-[#A6AD99] mr-1">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => ttsEngine.setRate(speed)}
                className={`px-1.5 py-0.5 rounded-none cursor-pointer transition-colors ${
                  ttsState.rate === speed
                    ? 'bg-[#F5F0E7] text-[#22221F] font-bold'
                    : 'text-[#F5F0E7]/70 hover:text-[#F5F0E7]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Voice selector button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVoiceSelect(!showVoiceSelect)}
              className="text-[11px] font-mono text-[#A6AD99] hover:text-[#F5F0E7] underline underline-offset-2 cursor-pointer"
            >
              Voice Settings
            </button>

            {showVoiceSelect && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-[#22221F] border border-[#F5F0E7]/20 p-3 shadow-2xl text-xs space-y-2 z-50">
                <div className="flex items-center justify-between pb-1 border-b border-[#F5F0E7]/10">
                  <span className="font-mono text-[10px] uppercase text-[#A6AD99]">Available Browser Voices</span>
                  <button onClick={() => setShowVoiceSelect(false)} className="text-sm text-[#F5F0E7]/60 hover:text-[#F5F0E7]">×</button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {voices.map((v) => (
                    <button
                      key={v.voiceURI}
                      type="button"
                      onClick={() => {
                        ttsEngine.setVoiceByURI(v.voiceURI);
                        setShowVoiceSelect(false);
                      }}
                      className={`w-full text-left p-1.5 text-[11px] font-sans truncate transition-colors ${
                        ttsState.currentVoiceURI === v.voiceURI
                          ? 'bg-[#39483B] text-[#F5F0E7]'
                          : 'text-[#F5F0E7]/80 hover:bg-[#F5F0E7]/10'
                      }`}
                    >
                      {v.name} ({v.lang})
                    </button>
                  ))}
                  {voices.length === 0 && (
                    <span className="text-[11px] text-[#F5F0E7]/50 block p-1">
                      Loading voices from browser speech engine...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Play / Pause Toggle */}
          {ttsState.isPaused ? (
            <button
              type="button"
              onClick={() => ttsEngine.resume()}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>▶ Resume</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => ttsEngine.pause()}
              className="px-4 py-1.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>⏸ Pause</span>
            </button>
          )}

          {/* Stop Button */}
          <button
            type="button"
            onClick={() => {
              ttsEngine.stop();
              onStop();
            }}
            className="px-3 py-1.5 border border-[#F5F0E7]/30 hover:border-[#F5F0E7] text-[#F5F0E7] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            ⏹ Stop
          </button>
        </div>
      </div>
    </div>
  );
};
