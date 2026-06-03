import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, User } from 'lucide-react';

const API = '/api/chat';
const QUICK_QUESTIONS = ['瓷贴片是什么？', '做瓷贴片疼吗？', '怎么获取报价？', '需要磨牙吗？', '能维持多久？', '怎么预约面诊？'];
const QUICK_REPLIES = ['流程是怎样的？', '所有人都适合吗？', '和烤瓷牙有什么区别？', '怎么维护保养？', '会变色吗？', '可以分期付款吗？'];
const POLL_INTERVAL = 2000;

function getSessionKey() {
  let key = localStorage.getItem('chat_session_key');
  if (!key) {
    key = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem('chat_session_key', key);
  }
  return key;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('ai');
  const [agentName, setAgentName] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMsgIdRef = useRef(0);
  const pollTimerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 500); }, []);

  // Init session
  useEffect(() => {
    (async () => {
      try {
        const sessionKey = getSessionKey();
        const res = await fetch(`${API}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionKey }),
        });
        const data = await res.json();
        setSessionId(data.session.id);
        // Load initial messages
        const msgRes = await fetch(`${API}/session/${data.session.id}/messages`);
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
        setSessionStatus(msgData.sessionStatus || 'ai');
        setAgentName(msgData.agentName || '');
        if (msgData.messages?.length) {
          lastMsgIdRef.current = msgData.messages[msgData.messages.length - 1].id;
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  // Poll for new messages
  useEffect(() => {
    if (!sessionId) return;
    const poll = async () => {
      try {
        const res = await fetch(`${API}/session/${sessionId}/messages?since=${lastMsgIdRef.current}`);
        const data = await res.json();
        if (data.messages?.length) {
          setMessages((prev) => {
            // Deduplicate by id
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
            if (!newMsgs.length) return prev;
            return [...prev, ...newMsgs];
          });
          lastMsgIdRef.current = data.messages[data.messages.length - 1].id;
        }
        setSessionStatus(data.sessionStatus || 'ai');
        setAgentName(data.agentName || '');
      } catch (e) { /* ignore */ }
    };
    pollTimerRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(pollTimerRef.current);
  }, [sessionId]);

  const handleSend = useCallback(async (text) => {
    const msg = (text || input.trim());
    if (!msg || !sessionId || sending) return;
    setInput('');
    setSending(true);

    // Optimistic user message
    const tempId = 'temp_' + Date.now();
    setMessages((p) => [...p, { id: tempId, role: 'user', text: msg }]);

    try {
      const res = await fetch(`${API}/session/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg }),
      });
      if (res.ok) {
        // Poll immediately for response
        const pollRes = await fetch(`${API}/session/${sessionId}/messages?since=${lastMsgIdRef.current}`);
        const data = await pollRes.json();
        if (data.messages?.length) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
            return newMsgs.length ? [...prev.filter((m) => m.id !== tempId), ...newMsgs] : prev;
          });
          if (data.messages.length) {
            lastMsgIdRef.current = data.messages[data.messages.length - 1].id;
          }
        }
        setSessionStatus(data.sessionStatus || 'ai');
        setAgentName(data.agentName || '');
      }
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  }, [input, sessionId, sending]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-cream flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-gold" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-brown to-brown-light px-4 sm:px-6 py-4 flex items-center gap-3 shadow-lg shadow-brown/10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-cream/10 hover:bg-cream/20 flex items-center justify-center text-cream/80 hover:text-cream transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            {sessionStatus === 'agent' ? (
              <User className="w-4.5 h-4.5 text-gold" />
            ) : (
              <Sparkles className="w-4.5 h-4.5 text-gold" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-cream font-medium text-sm truncate">
              {sessionStatus === 'agent' ? `人工客服 · ${agentName}` : '智能客服 · 小美'}
            </div>
            <div className="text-cream/50 text-xs flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${sessionStatus === 'agent' ? 'bg-amber-400' : 'bg-green-400'}`} />
              {sessionStatus === 'agent' ? '人工服务中' : '在线 · AI秒回复'}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/booking')}
          className="px-4 py-2 bg-gold text-brown rounded-full text-xs font-semibold hover:bg-gold-light transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
        >
          预约面诊
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* System message */}
            {msg.role === 'system' ? (
              <div className="w-full flex justify-center">
                <div className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-xs text-gold-dark font-medium">
                  {msg.text}
                </div>
              </div>
            ) : (
              <>
                {(msg.role === 'bot' || msg.role === 'agent') && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1 ${
                    msg.role === 'agent' ? 'bg-amber-100' : 'bg-gradient-to-br from-gold to-gold-dark'
                  }`}>
                    {msg.role === 'agent' ? (
                      <User className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-brown text-cream rounded-br-md'
                      : msg.role === 'agent'
                      ? 'bg-amber-50 text-brown border border-amber-200 rounded-bl-md'
                      : 'bg-white text-brown border border-brown/5 rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-brown-light flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                    <span className="text-cream text-[10px] font-bold">你</span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}

        {/* Quick questions */}
        {messages.length <= 1 && (
          <div className="pt-2">
            <p className="text-xs text-brown-light/50 mb-2 px-1">常见问题，点击提问：</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => handleSend(q)}
                  className="px-3 py-2 bg-white border border-brown/10 rounded-xl text-xs text-brown-light hover:border-gold hover:text-gold hover:shadow-sm transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 1 && (
          <div className="pt-1">
            <p className="text-xs text-brown-light/50 mb-2 px-1">还想了解：</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => handleSend(q)}
                  className="px-3 py-2 bg-white border border-brown/10 rounded-xl text-xs text-brown-light hover:border-gold hover:text-gold hover:shadow-sm transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 bg-white border-t border-brown/5 px-4 sm:px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={sessionStatus === 'agent' ? `正在与${agentName || '人工客服'}对话...` : '输入问题...'}
            disabled={sending}
            className="flex-1 px-5 py-3 rounded-2xl border border-brown/10 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none text-sm text-brown placeholder:text-brown-light/30 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-full bg-brown hover:bg-brown-light disabled:bg-brown/20 text-cream flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
        <p className="text-[10px] text-brown-light/30 text-center mt-3">
          臻白瓷贴片 · {sessionStatus === 'agent' ? '人工客服服务中' : 'AI智能客服'}
        </p>
      </div>
    </div>
  );
}
