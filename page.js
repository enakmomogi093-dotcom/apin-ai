'use client';
import { useState, useEffect, useRef } from 'react';

export default function GeminiClone() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [limitCount, setLimitCount] = useState(18);
  const [isPro, setIsPro] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!isPro && limitCount <= 0) {
      alert('Limit gratis kamu sudah habis! Tunggu 6 jam atau upgrade ke Pro.');
      return;
    }

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    if (!isPro) {
      setLimitCount(prev => Math.max(0, prev - 1));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', content: 'Terjadi kesalahan pada server AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Teks / Kode berhasil disalin!');
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-[#131314] text-[#E3E3E3] font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-[#1E1F20] transition-all duration-300 flex flex-col justify-between border-r border-[#333] overflow-hidden z-20`}>
        <div className="p-4 flex flex-col gap-4 w-64">
          <button 
            onClick={handleNewChat}
            className="w-full bg-[#282a2c] hover:bg-[#3c3f41] text-left px-4 py-3 rounded-full text-sm font-medium transition flex items-center gap-3 text-white border border-[#444]"
          >
            <span className="text-lg">+</span> Percakapan Baru
          </button>
          
          <div className="text-xs text-gray-400 mt-2">
            <p className="font-semibold text-gray-200 mb-1">Riwayat Percakapan</p>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {messages.length > 0 ? (
                <div className="p-2 hover:bg-[#282a2c] rounded cursor-pointer truncate text-gray-300">
                  {messages[0].content}
                </div>
              ) : (
                <p className="italic text-gray-500">Belum ada riwayat</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 w-64 border-t border-[#333] bg-[#1a1b1c]">
          <div className="text-xs text-gray-400">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-200">{isPro ? 'ApinnAI Pro ✨' : 'ApinnAI Free'}</span>
              <span className="text-blue-400">{isPro ? 'Unlimited' : `${limitCount}/20`}</span>
            </div>
            {!isPro && (
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden my-2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-full" style={{ width: `${(limitCount/20)*100}%` }}></div>
              </div>
            )}
            <p className="text-[10px] text-gray-500 mb-2">Batas limit pulih setiap 6 jam otomatis.</p>
            <button 
              onClick={() => setIsPro(!isPro)} 
              className="w-full py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-lg font-bold shadow hover:opacity-90 transition text-xs"
            >
              {isPro ? 'Mode Pro Aktif' : 'Upgrade ke Pro ✨'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between relative bg-[#131314]">
        {/* Header */}
        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#131314] z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#282a2c] rounded-lg text-gray-300"
              title="Toggle Sidebar"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
              ApinnAI Gemini
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs bg-[#282a2c] text-gray-300 px-3 py-1.5 rounded-full border border-gray-700">
              Gemini 2.5 Flash
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </div>
        </div>

        {/* Chat History / Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto">
          {messages.length === 0 && (
            <div className="text-center mt-24 md:mt-32 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                Halo, Mau kubantu apa hari ini?
              </h2>
              <p className="text-gray-400 text-sm md:text-base">Buat web, edit foto/kode, WhatsApp bot, atau tanya apa saja.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto mt-8 text-left">
                <div onClick={() => setInput('Buatkan kode template HTML & CSS untuk landing page')} className="p-3 bg-[#1e1f20] hover:bg-[#282a2c] rounded-xl border border-[#333] cursor-pointer text-xs text-gray-300">
                  <p className="font-semibold text-white mb-1">💻 Fix / Buat Code</p>
                  Bikin script web HTML / CSS / JS instan
                </div>
                <div onClick={() => setInput('Bagaimana cara membuat bot WhatsApp dengan Baileys dan Pairing Code?')} className="p-3 bg-[#1e1f20] hover:bg-[#282a2c] rounded-xl border border-[#333] cursor-pointer text-xs text-gray-300">
                  <p className="font-semibold text-white mb-1">🤖 WhatsApp Bot</p>
                  Panduan script bot WA pairing code
                </div>
                <div onClick={() => setInput('Berikan saran ide bisnis AI SaaS otomatis')} className="p-3 bg-[#1e1f20] hover:bg-[#282a2c] rounded-xl border border-[#333] cursor-pointer text-xs text-gray-300">
                  <p className="font-semibold text-white mb-1">✨ Saran & Ide AI</p>
                  Eksplorasi ide dan strategi digital
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 flex-shrink-0 flex items-center justify-center text-black font-bold text-xs mt-1">
                  AI
                </div>
              )}
              <div className={`p-4 rounded-2xl max-w-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#282a2c] text-white rounded-br-none' : 'bg-transparent text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'model' && (
                  <div className="mt-3 flex items-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(msg.content)}
                      className="text-xs text-gray-400 hover:text-white bg-[#1e1f20] hover:bg-[#2c2d2e] px-2.5 py-1 rounded-md border border-gray-700 transition flex items-center gap-1.5"
                    >
                      📋 Salin Teks
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 flex-shrink-0 flex items-center justify-center text-black font-bold text-xs">
                AI
              </div>
              <div className="text-gray-400 text-sm animate-pulse">ApinnAI sedang berpikir...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-[#131314] max-w-4xl w-full mx-auto">
          <form onSubmit={sendMessage} className="relative bg-[#1e1f20] rounded-2xl border border-[#333] flex items-center px-4 py-2.5 shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan, kode, atau perintah web di sini..."
              className="w-full bg-transparent focus:outline-none text-white pr-12 text-sm placeholder-gray-500"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 bg-white hover:bg-gray-200 text-black p-2 rounded-full font-bold transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center w-8 h-8 text-xs"
            >
              ↑
            </button>
          </form>
          <p className="text-center text-[11px] text-gray-500 mt-2">
            ApinnAI dapat menampilkan info yang kurang akurat. Verifikasi kode dan script penting sebelum digunakan.
          </p>
        </div>
      </div>
    </div>
  );
}