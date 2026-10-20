import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Check, CheckCheck } from 'lucide-react';
import { Avatar, EmptyState } from '../../components/ui';
import { MESSAGES_DATA } from '../../data/mockData';
import toast from 'react-hot-toast';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now - d) / 3600000;
  if (diffH < 1) return `${Math.floor((now - d) / 60000)}m ago`;
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function MessagesPage() {
  const [conversations] = useState(MESSAGES_DATA);
  const [activeConv, setActiveConv] = useState(MESSAGES_DATA[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(activeConv?.messages || []);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages(activeConv?.messages || []);
  }, [activeConv]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = { id: `m_${Date.now()}`, from: 'me', text: newMessage, time: new Date().toISOString() };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m_reply_${Date.now()}`, from: 'them', text: 'Thanks for the message! I will get back to you soon. 😊', time: new Date().toISOString() },
      ]);
    }, 2000);
  };

  const filteredConvs = conversations.filter((c) =>
    !searchQuery || c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Conversations list */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--sidebar-border)', background: 'var(--bg-surface)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input className="input pl-9 text-sm" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
              style={{ background: activeConv?.id === conv.id ? 'var(--sidebar-item-active)' : 'transparent' }}
              onClick={() => setActiveConv(conv)}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={conv.participant.name} initials={conv.participant.initials} size="md" />
                {conv.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2" style={{ borderColor: 'var(--bg-surface)' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{conv.participant.name}</span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{formatDate(conv.lastMessageTime)}</span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}>
            <Avatar name={activeConv.participant.name} initials={activeConv.participant.initials} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{activeConv.participant.name}</p>
              <p className="text-xs" style={{ color: activeConv.participant.isOnline ? '#10b981' : 'var(--text-muted)' }}>
                {activeConv.participant.isOnline ? 'Online' : 'Offline'} · {activeConv.participant.designation}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="btn btn-ghost btn-sm"><Phone size={16} /></button>
              <button className="btn btn-ghost btn-sm"><Video size={16} /></button>
              <button className="btn btn-ghost btn-sm"><MoreVertical size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ background: 'var(--bg-base)' }}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                    msg.from === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'
                  }`}
                  style={{
                    background: msg.from === 'me' ? '#6366f1' : 'var(--bg-surface)',
                    color: msg.from === 'me' ? 'white' : 'var(--text-primary)',
                    border: msg.from !== 'me' ? '1px solid var(--border-default)' : 'none',
                  }}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.from === 'me' ? 'justify-end' : ''}`}>
                    <span className="text-[10px]" style={{ opacity: 0.6 }}>{formatTime(msg.time)}</span>
                    {msg.from === 'me' && <CheckCheck size={12} style={{ opacity: 0.6 }} />}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3 border-t flex items-center gap-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}><Paperclip size={18} /></button>
            <input
              className="input flex-1"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}><Smile size={18} /></button>
            <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!newMessage.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState icon="💬" title="No conversation selected" description="Select a conversation from the left to start chatting." />
        </div>
      )}
    </div>
  );
}
