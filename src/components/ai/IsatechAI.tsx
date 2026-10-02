import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { askIsatechAI, AIMessage } from '../../services/ai';

interface IsatechAIProps {
  onNavigate: (route: string) => void;
}

export const IsatechAI: React.FC<IsatechAIProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Bonjour 👋 Je suis l\'assistant officiel **ISATECH AI**.\n\nBienvenue à l\'**Institut des Sciences Appliquées et de la Technologie**. Comment puis-je vous accompagner dans votre orientation parmi nos 8 filières et vos démarches d\'admission ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const SUGGESTIONS = [
    'Quelles sont les 8 filières ?',
    'Organigramme de la direction',
    'Je veux faire du développement informatique',
    'Comment candidater en ligne ?',
    'Où se trouve l\'école à Koumassi ?',
    'Voir la galerie photo'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: AIMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askIsatechAI(textToSend, messages);
      const assistantMsg: AIMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: response.text,
        suggestedAction: response.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: 'Une erreur momentanée est survenue. Vous pouvez joindre le secrétariat administratif d\'ISATech à Koumassi.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (route: string) => {
    onNavigate(route);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3.5 bg-[#002060] text-white rounded-full shadow-2xl border-2 border-white hover:bg-[#001744] hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Ouvrir l'assistant ISATECH AI"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#002060]">
              <Bot className="w-5 h-5 text-[#002060] group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#002060] animate-pulse" />
            </div>

            <div className="flex flex-col text-left pr-1">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                ISATECH AI
              </span>
              <span className="text-[11px] font-medium text-slate-200">
                Orientation & Admissions
              </span>
            </div>

            <Sparkles className="w-4 h-4 text-slate-200 animate-spin" style={{ animationDuration: '8s' }} />
          </button>
        )}
      </div>

      {/* Floating Modal Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-[#002060]/20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#002060] text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#002060] font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white">ISATECH AI</h3>
                  <span className="text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">OFFICIEL</span>
                </div>
                <p className="text-[11px] text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Institut des Sciences Appliquées & Tech
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'assistant',
                    text: 'Conversation réinitialisée. Comment puis-je vous guider ?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ])}
                title="Effacer la conversation"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slogan banner */}
          <div className="bg-[#001744] text-[11px] text-center text-slate-200 py-1.5 border-b border-white/10 italic">
            « L’excellence demeure notre credo » — Fondé en 2001 • 2000+ Diplômés
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#002060] text-white font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {m.text}

                  {m.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex">
                      <button
                        onClick={() => handleActionClick(m.suggestedAction!.route)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#002060] hover:bg-[#001744] rounded-lg transition-colors shadow-xs"
                      >
                        <span>{m.suggestedAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-white px-3 py-2 rounded-xl w-fit border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#002060] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#002060] animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-[#002060] animate-bounce" style={{ animationDelay: '0.4s' }} />
                <span className="ml-1 text-[11px] text-slate-500 font-medium">ISATECH AI vous répond...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="text-[11px] bg-slate-100 hover:bg-[#002060] hover:text-white text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question sur les formations ou l'école..."
              className="flex-1 text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#002060] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white disabled:opacity-40 transition-all flex items-center justify-center font-bold"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
