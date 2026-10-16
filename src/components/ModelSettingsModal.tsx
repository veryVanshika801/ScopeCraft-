import React, { useEffect, useState } from 'react';
import { ModelProviderStatus } from '../types/proposal';
import { BotanicalDivider } from './Ornaments';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<ModelProviderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/model-status')
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch((err) => console.error('Failed to fetch model status:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#22221F]/70 backdrop-blur-xs flex items-center justify-center p-6 selection:bg-[#39483B] selection:text-[#F5F0E7]">
      <div className="bg-[#FFFFFF] border border-[#22221F]/20 p-8 sm:p-10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#22221F]/15">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#39483B] block">
              Inference Architecture
            </span>
            <h2 className="font-serif text-2xl font-medium text-[#22221F]">
              Open-Weight Model Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-[#22221F]/40 hover:text-[#22221F] p-1 leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Live Server Status */}
        <div className="p-5 bg-[#F5F0E7] border border-[#22221F]/15 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#22221F]/70">
              Runtime Provider Status:
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 border ${
                status?.hasKey
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {loading
                ? 'Inspecting...'
                : status?.hasKey
                ? 'Active Open-Weight Key Loaded'
                : 'Studio Engine (Demo Synthesis Mode)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#22221F]/80 pt-2 border-t border-[#22221F]/10">
            <div>Provider: <strong>{status?.provider || 'groq'}</strong></div>
            <div>Model: <strong>{status?.model || 'llama-3.3-70b-versatile'}</strong></div>
            <div className="col-span-2 truncate">Endpoint: {status?.endpoint || 'https://api.groq.com/openai/v1'}</div>
          </div>
        </div>

        {/* Informative Guidance */}
        <div className="space-y-4 text-xs text-[#22221F]/80 leading-relaxed font-sans">
          <h4 className="font-serif text-base font-medium text-[#22221F]">
            How Open-Weight Inference Works in ScopeCraft
          </h4>
          <p>
            ScopeCraft is deliberately architected to run with <strong>open-weight language models</strong> (such as Meta Llama 3.3 70B, Mistral Nemo, and Qwen 2.5) rather than proprietary black-box APIs.
          </p>

          <div className="space-y-2 pt-2">
            <div className="font-medium text-[#22221F]">Option 1: Groq Cloud (Recommended Free Tier)</div>
            <p className="text-[#22221F]/70">
              1. Obtain a free API key at <code className="bg-stone-100 px-1 py-0.5 font-mono">console.groq.com/keys</code>.<br />
              2. Add to your local environment file: <br />
              <code className="block bg-[#22221F] text-[#F5F0E7] p-2 mt-1 font-mono text-[11px]">
                OPEN_WEIGHT_API_KEY="gsk_..."<br />
                OPEN_WEIGHT_PROVIDER="groq"<br />
                OPEN_WEIGHT_MODEL="llama-3.3-70b-versatile"
              </code>
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="font-medium text-[#22221F]">Option 2: Hugging Face Serverless / Together AI</div>
            <p className="text-[#22221F]/70">
              You can also specify Hugging Face or Together AI endpoints with models like <code className="font-mono">meta-llama/Llama-3.3-70B-Instruct</code>.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="font-medium text-[#22221F]">Option 3: ScopeCraft Studio Engine (Out of the Box)</div>
            <p className="text-[#22221F]/70">
              When no external key is supplied, ScopeCraft seamlessly activates its built-in Studio Engine. It synthesizes full, customized architectural proposals tailored to your brief, clearly labeled as Demo Synthesis Mode so you can design and evaluate with zero friction.
            </p>
          </div>
        </div>

        <BotanicalDivider className="my-6" />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#39483B] hover:bg-[#2e3a2f] text-[#F5F0E7] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
