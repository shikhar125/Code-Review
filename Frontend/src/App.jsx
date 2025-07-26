import { useState, useRef, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!code.trim()) return;
    setMessages((msgs) => [...msgs, { type: 'user', content: code }]);
    setLoading(true);
    setError('');
    setCode('');
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setMessages((msgs) => [
        ...msgs,
        { type: 'assistant', content: response.data }
      ]);
    } catch (err) {
      setError('Could not get review. Please check your connection or try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  }

  return (
    <div className="chatgpt-container">
      <div className="chatgpt-header">AI Code Reviewer</div>
      <div className="chatgpt-chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatgpt-message ${msg.type === 'user' ? 'user' : 'assistant'}`}
          >
            {msg.type === 'user' ? (
              <pre className="chatgpt-user-code">{msg.content}</pre>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>{msg.content}</Markdown>
            )}
          </div>
        ))}
        {loading && (
          <div className="chatgpt-message assistant">
            <span className="spinner"></span> Analyzing your code...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chatgpt-input-area">
        <textarea
          className="chatgpt-input"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your code here and press Ctrl+Enter to send..."
          rows={3}
          spellCheck="false"
        />
        <button
          className="chatgpt-send-btn"
          onClick={handleSend}
          disabled={loading || !code.trim()}
        >
          {loading ? <span className="spinner"></span> : "Send"}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App
