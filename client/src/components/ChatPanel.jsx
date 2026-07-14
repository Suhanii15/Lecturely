import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaSpinner, FaExclamationCircle, FaChevronUp, FaChevronDown, FaBrain } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import api from '../api';

const MessageContent = ({ content }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => <p className="text-sm leading-relaxed mb-1 last:mb-0">{children}</p>,
      strong: ({ children }) => <strong className="font-bold text-surface-900">{children}</strong>,
      ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 my-1 text-sm">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 my-1 text-sm">{children}</ol>,
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      code: ({ children }) => (
        <code className="bg-surface-200 text-surface-800 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const ChatPanel = ({ lectureId, notesId, isCompleted }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open || !lectureId || !isCompleted) return;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get(`/api/chat/${lectureId}`, { headers: { token } });
        if (data.success) setMessages(data.messages);
      } catch { /* ignore */ }
      setLoadingHistory(false);
    };
    fetchHistory();
  }, [open, lectureId, isCompleted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    setError(null);

    const optimistic = { _id: `temp-${Date.now()}`, role: 'user', content: text, createdAt: new Date() };
    setMessages(prev => [...prev, optimistic]);

    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post(`/api/chat/${lectureId}`,
        { content: text },
        { headers: { token } }
      );
      if (data.success) {
        setMessages(prev => prev.filter(m => m._id !== optimistic._id).concat(data.messages));
      } else {
        setError(data.message || 'Failed to send message');
        setMessages(prev => prev.filter(m => m._id !== optimistic._id));
      }
    } catch (err) {
      if (err.response) {
        setError(`Server error (${err.response.status}). Make sure the server has the latest code and Gemini API key.`);
      } else if (err.request) {
        setError('Cannot reach the server. Check your connection or the server may be down.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setMessages(prev => prev.filter(m => m._id !== optimistic._id));
    }
    setSending(false);
  }, [input, sending, lectureId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-surface-100 rounded-2xl border border-surface-200 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-200/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
            <FaBrain className="text-white text-sm" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-surface-900">Ask Your Notes</h3>
            <p className="text-[11px] text-surface-500">{open ? 'Click to close' : 'Ask questions about this lecture'}</p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-lg bg-surface-200 flex items-center justify-center">
          {open ? <FaChevronUp className="text-[10px] text-surface-500" /> : <FaChevronDown className="text-[10px] text-surface-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-surface-200"
          >
            <div className="flex flex-col h-[420px]">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth">
                {loadingHistory && (
                  <div className="flex items-center justify-center py-10">
                    <FaSpinner className="text-brand-500 text-lg animate-spin" />
                  </div>
                )}

                {!loadingHistory && messages.length === 0 && (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                      <FaRobot className="text-brand-400 text-xl" />
                    </div>
                    <p className="text-sm font-semibold text-surface-700 mb-1">Ask anything about this lecture</p>
                    <p className="text-xs text-surface-400 max-w-xs mx-auto">
                      Get summaries, explanations, key takeaways, or exam-focused answers.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg._id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-brand-100'
                        : 'bg-gradient-to-br from-brand-500 to-brand-600'
                    }`}>
                      {msg.role === 'user'
                        ? <FaUser className="text-brand-500 text-[11px]" />
                        : <FaRobot className="text-white text-[11px]" />
                      }
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-surface-50 text-surface-700 border border-surface-200'} rounded-2xl px-4 py-2.5`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <MessageContent content={msg.content} />
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                      <FaRobot className="text-white text-[11px]" />
                    </div>
                    <div className="bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3">
                      <FaSpinner className="text-brand-500 text-sm animate-spin" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <FaExclamationCircle className="text-red-400 text-xs shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              <div className="border-t border-surface-200 px-5 py-3 bg-surface-100">
                <div className="flex items-center gap-2">
                  <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Ask a question about this lecture..."
                    disabled={sending || !isCompleted}
                    className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all disabled:opacity-50" />
                  <button onClick={sendMessage} disabled={sending || !input.trim() || !isCompleted}
                    className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0">
                    {sending
                      ? <FaSpinner className="text-white text-sm animate-spin" />
                      : <FaPaperPlane className="text-white text-[11px]" />
                    }
                  </button>
                </div>
                <p className="text-[10px] text-surface-400 mt-1.5 text-center">
                  Answers are grounded in this lecture's content only
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPanel;
