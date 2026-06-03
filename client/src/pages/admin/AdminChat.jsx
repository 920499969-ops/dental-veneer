import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, Sparkles, Send, ArrowLeft, Trash2, RotateCcw } from 'lucide-react';

const API = '/api/admin/chat';

export default function AdminChat() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [trashSessions, setTrashSessions] = useState([]);
  const pollRef = useRef(null);
  const sessPollRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(API + '/sessions', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchSessions();
    sessPollRef.current = setInterval(fetchSessions, 5000);
    return () => clearInterval(sessPollRef.current);
  }, [fetchSessions]);

  const fetchMessages = useCallback(async (sid) => {
    try {
      const res = await fetch(API + '/sessions/' + sid + '/messages', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
      });
      const data = await res.json();
      setMessages(data.messages || []);
      setActiveSession((prev) => prev ? { ...data.session } : null);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!activeSession) return;
    fetchMessages(activeSession.id);
    pollRef.current = setInterval(() => fetchMessages(activeSession.id), 2000);
    return () => clearInterval(pollRef.current);
  }, [activeSession?.id, fetchMessages]);

  const handleTakeover = async () => {
    if (!activeSession) return;
    await fetch(API + '/sessions/' + activeSession.id + '/takeover', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
    });
    fetchMessages(activeSession.id);
    fetchSessions();
  };

  const handleRelease = async () => {
    if (!activeSession) return;
    await fetch(API + '/sessions/' + activeSession.id + '/release', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
    });
    fetchMessages(activeSession.id);
    fetchSessions();
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('确定删除此会话？可在"最近删除"中恢复。')) return;
    await fetch(API + '/sessions/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
    });
    if (activeSession?.id === id) setActiveSession(null);
    fetchSessions();
  };

  const handleRestoreSession = async (id) => {
    await fetch(API + '/sessions/' + id + '/restore', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
    });
    fetchTrash();
    fetchSessions();
  };

  const fetchTrash = async () => {
    try {
      const res = await fetch(API + '/sessions/deleted', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
      });
      const data = await res.json();
      setTrashSessions(data.sessions || []);
    } catch (e) {}
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeSession) return;
    setInput('');
    await fetch(API + '/sessions/' + activeSession.id + '/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('admin_token'),
      },
      body: JSON.stringify({ text }),
    });
    fetchMessages(activeSession.id);
    fetchSessions();
  };

  const getRoleClass = (role) => {
    if (role === 'user') return 'bg-brown text-cream rounded-br-md';
    if (role === 'agent') return 'bg-amber-50 border border-amber-200 text-brown rounded-br-md';
    return 'bg-white border border-brown/5 text-brown rounded-bl-md shadow-sm';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Session list sidebar */}
      <div className="lg:w-80 flex-shrink-0 bg-white rounded-2xl sm:rounded-3xl border border-brown/5 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-brown/5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-brown flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gold" /> {showTrash ? '最近删除' : '在线客服'}
            </h2>
            <button
              onClick={() => { setShowTrash(!showTrash); if (!showTrash) fetchTrash(); }}
              className="text-xs text-brown-light/50 hover:text-gold transition-colors"
            >
              {showTrash ? '返回列表' : '最近删除'}
            </button>
          </div>
          <p className="text-xs text-brown-light mt-0.5">{(showTrash ? trashSessions : sessions).length} 个会话</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <svg className="animate-spin w-5 h-5 text-gold" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (showTrash ? trashSessions : sessions).length === 0 ? (
            <div className="text-center py-12 text-brown-light/40 text-sm">{showTrash ? '回收站为空' : '暂无客户咨询'}</div>
          ) : (
            (showTrash ? trashSessions : sessions).map((s) => (
              <div key={s.id} className="relative">
                <button
                  onClick={() => { if (!showTrash) { setActiveSession(s); setInput(''); } }}
                  className={
                    'w-full text-left p-4 border-b border-brown/5 hover:bg-brown/[0.02] transition-all ' +
                    (activeSession?.id === s.id ? 'bg-gold/5 border-l-2 border-l-gold' : '')
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-brown text-sm">{s.customer_name || '访客'}</span>
                    <span className={
                      'px-2 py-0.5 rounded-full text-[10px] font-medium ' +
                      (s.status === 'agent' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')
                    }>
                      {s.status === 'agent' ? (s.agent_name || '人工') : 'AI'}
                    </span>
                  </div>
                  {s.status === 'agent' && s.agent_name && (
                    <p className="text-[10px] text-amber-600 mt-0.5">👤 {s.agent_name} 服务中</p>
                  )}
                  <p className="text-xs text-brown-light/60 truncate">{s.lastMessage?.text || '暂无消息'}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-brown-light/40">{(s.updated_at || '').slice(5, 16)}</span>
                    {s.unread > 0 && !showTrash && (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {s.unread}
                      </span>
                    )}
                  </div>
                </button>
                {/* Delete / Restore button */}
                {!showTrash ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-50 text-brown-light/30 hover:text-red-500 transition-all"
                    title="删除会话"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRestoreSession(s.id); }}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-green-50 text-brown-light/30 hover:text-green-500 transition-all"
                    title="恢复会话"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-brown/5 shadow-sm flex flex-col overflow-hidden min-h-0">
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-brown-light/30 gap-3">
            <MessageCircle className="w-12 h-12" />
            <p className="text-sm">选择左侧会话开始查看</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-brown/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveSession(null)} className="lg:hidden p-1.5 rounded-lg hover:bg-brown/5 text-brown-light">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="font-medium text-brown text-sm flex items-center gap-2">
                    {activeSession.customer_name || '访客'}
                    <span className={
                      'px-1.5 py-0.5 rounded text-[10px] font-normal ' +
                      (activeSession.status === 'agent' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')
                    }>
                      {activeSession.status === 'agent' ? '人工' : 'AI'}
                    </span>
                  </div>
                  <div className="text-xs text-brown-light/50">
                    {activeSession.status === 'agent'
                      ? '👤 ' + (activeSession.agent_name || '员工') + ' 正在服务中'
                      : 'AI自动回复中'}
                  </div>
                </div>
              </div>
              <div>
                {activeSession.status === 'ai' ? (
                  <button onClick={handleTakeover}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-100 transition-all flex items-center gap-1.5">
                    <User className="w-3 h-3" /> 接管
                  </button>
                ) : (
                  <button onClick={handleRelease}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:bg-green-100 transition-all flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> 交还AI
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream/30">
              {messages.map((msg, i) => (
                <motion.div key={msg.id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={'flex ' + (msg.role === 'agent' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'system' ? (
                    <div className="w-full flex justify-center">
                      <div className="px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-[11px] text-gold-dark">{msg.text}</div>
                    </div>
                  ) : (
                    <div className="max-w-[80%]">
                      <div className={'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' + getRoleClass(msg.role)}>
                        {msg.text}
                      </div>
                      <div className={'text-[10px] text-brown-light/40 mt-1 ' + (msg.role === 'agent' ? 'text-right' : 'text-left')}>
                        {msg.role === 'user' ? '客户' : msg.role === 'agent' ? '客服' : 'AI'} · {(msg.created_at || '').slice(11, 16)}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3 sm:p-4 border-t border-brown/5">
              {activeSession.status === 'agent' ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={'回复 ' + (activeSession.customer_name || '客户') + '...'}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-brown/10 bg-cream/50 focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none text-sm text-brown placeholder:text-brown-light/30" />
                  <button onClick={handleSend} disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-brown/20 text-white flex items-center justify-center transition-all active:scale-90 flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-brown-light/40 py-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI自动回复中，点击"接管"按钮可人工介入
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
