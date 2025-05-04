"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, Image, X } from 'lucide-react';
import { marked } from 'marked';
import { supabase } from '../../lib/supabase';

// Initial welcome message
const InitialMsg = {
  type: 'bot',
  content: "Hello! I'm Cropcare, your plant care assistant. Upload a photo or describe your plant issue, and I'll help you diagnose problems and provide care advice."
};

const ChatInterface = ({ userId, chatSessionId, onChatUpdate, onNewSession }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);


  // Load chat history when chatSessionId changes
  useEffect(() => {
    if (chatSessionId) {
      loadChatHistory();
    } else {
      setChatHistory([InitialMsg]);
      setIsInitializing(false);
    }
  }, [chatSessionId]);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Update the chat title in parent component based on first message
    if (chatHistory.length > 1 && onChatUpdate) {
      const firstUserMsg = chatHistory.find(msg => msg.type === 'user');
      if (firstUserMsg) {
        onChatUpdate(firstUserMsg.content);
      }
    }
  }, [chatHistory]);

  const loadChatHistory = async () => {
    try {
      setIsInitializing(true);
      
      // Make sure we have both userId and chatSessionId
      if (!userId || !chatSessionId) {
        setChatHistory([InitialMsg]);
        setIsInitializing(false);
        return;
      }
      
      
      
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .eq('chat_session_id', chatSessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error loading chat history:', error);
        throw error;
      }


      if (data && Array.isArray(data) && data.length > 0) {
        const formattedHistory = data.map(msg => ({
          id: msg.id,
          type: msg.message_type || 'bot',
          content: msg.content || '',
          image: msg.image_url || null
        }));
        setChatHistory(formattedHistory);
      } else {
        // No history found for this chat session, start with initial message
        setChatHistory([InitialMsg]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChatHistory([InitialMsg]);
    } finally {
      setIsInitializing(false);
    }
  };

  const saveChatMessage = async (message) => {
    try {
      // Skip saving if there's no userId or chatSessionId
      if (!userId || !chatSessionId) {
        console.error('Cannot save message: Missing userId or chatSessionId', { userId, chatSessionId });
        return null;
      }
      
      // Check for required fields based on schema
      if (!message.type) {
        console.error('Cannot save message: Missing message type');
        return null;
      }
      
      const messageToSave = {
        user_id: userId,
        chat_session_id: chatSessionId,
        message_type: message.type,
        content: message.content || '',
        // Only include image_url if it exists
        ...(message.image && { image_url: message.image }),
        created_at: new Date().toISOString()
      };
      

      
      // First check if table exists and has expected structure
      const { error: tableCheckError } = await supabase
        .from('chat_history')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.error('Supabase table error:', tableCheckError);
        throw new Error(`Table check failed: ${JSON.stringify(tableCheckError)}`);
      }
      
      const { data, error } = await supabase
        .from('chat_history')
        .insert(messageToSave)
        .select();

      if (error) {
        console.error('Supabase insert error:', JSON.stringify(error));
        throw new Error(`Insert failed: ${JSON.stringify(error)}`);
      }
      
      return data;
    } catch (error) {
      // Improve error logging with more details
      console.error('Error saving chat message:', error.message || error);
      
      // Check if the error message contains useful information about the schema
      if (error.message) {
        if (error.message.includes('column')) {
          console.error('This is likely a table structure issue. Please check your Supabase schema.');
          console.error('Expected columns: user_id, chat_session_id, message_type, content, image_url, created_at');
        } else if (error.message.includes('foreign key')) {
          console.error('This might be a foreign key constraint issue. Check if the user_id and chat_session_id exist.');
        }
      }
      
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return;
    
    // If there's no chatSessionId, we need to create a new session
    if (!chatSessionId && onNewSession) {
      const newSessionId = await onNewSession();
      
      // Store the message temporarily
      localStorage.setItem('pendingMessage', message);
      if (image) localStorage.setItem('pendingImage', image);
      return;
    }
    
    // Check for saved message from new session creation
    const pendingMessage = localStorage.getItem('pendingMessage');
    const pendingImage = localStorage.getItem('pendingImage');
    if (pendingMessage) {
      setMessage(pendingMessage);
      localStorage.removeItem('pendingMessage');
    }
    if (pendingImage) {
      setImage(pendingImage);
      localStorage.removeItem('pendingImage');
    }

    const userMessage = {
      type: 'user',
      content: message,
      image: image
    };

    // Update UI immediately for better user experience
    setChatHistory(prev => [...prev, userMessage]);
    
    
    // Clear input fields immediately for better UX
    const currentMessage = message;
    const currentImage = image;
    setMessage('');
    setImage(null);
    setIsLoading(true);
    
    // Save to db in the background
    try {
      const savedMessage = await saveChatMessage(userMessage);
      
      if (!savedMessage) {
        console.error('Failed to save message to database, but continuing with local chat');
        // Continue anyway - frontend experience is priority
      }
    } catch (error) {
      console.error('Failed to save user message:', error);
      // Continue anyway - frontend experience is priority
    }

    try {
      const response = await fetch('/api/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentMessage.trim(),
          history: chatHistory,
          image: currentImage,
          chatSessionId: chatSessionId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        throw new Error(`Failed to get response: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      const botMessage = {
        type: 'bot',
        content: data.response || "I understand your question about your plants, but I'm having trouble formulating a response right now."
      };

      setChatHistory(prev => [...prev, botMessage]);
      
      try {
        const savedBotMsg = await saveChatMessage(botMessage);
        if (!savedBotMsg) {
          console.error('Bot message not saved to database, but showing in UI');
        }
      } catch (saveError) {
        console.error('Failed to save bot message:', saveError);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        type: 'bot',
        content: "Sorry, I encountered an error processing your request. Please try again in a moment."
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      try {
        await saveChatMessage(errorMessage);
      } catch (saveError) {
        console.error('Failed to save error message:', saveError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 pb-24 overflow-y-auto bg-gradient-to-b from-green-50 to-white"
      >
        {isInitializing ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-[#6faa61] rounded-full"></div>
              <div className="w-3 h-3 bg-[#6faa61] rounded-full"></div>
              <div className="w-3 h-3 bg-[#6faa61] rounded-full"></div>
            </div>
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-[#6faa61]">Ask Cropcare about your plant issues</p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={chat.id || index} className={`mb-4 ${chat.type === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-4 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                  chat.type === 'user'
                    ? 'bg-green-100 text-[#6faa61] rounded-tr-none shadow-md'
                    : 'bg-[#6faa61] text-white rounded-tl-none shadow-md'
                }`}
              >
                {chat.image && (
                  <div className="mb-3">
                    <img
                      src={chat.image}
                      alt="Uploaded plant"
                      className="max-w-full h-64 rounded-lg shadow-sm"
                    />
                  </div>
                )}
                {chat.type === 'bot' ? (
                  <div
                    className="text-sm md:text-base leading-relaxed prose prose-sm prose-invert prose-p:my-1 max-w-full"
                    dangerouslySetInnerHTML={{ __html: marked(chat.content) }}
                  />
                ) : (
                  <p className="text-sm md:text-base leading-relaxed">{chat.content}</p>
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${chat.type === 'user' ? 'text-right mr-2' : 'ml-2'}`}>
                {chat.type === 'user' ? 'You' : 'Cropcare'}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-green-700 text-white p-3 rounded-lg rounded-tl-none shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-12">
        <div className="flex flex-col max-w-4xl mx-auto">
          {/* Image Preview */}
          <div className={`image-preview-container mb-2 ${image ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'} transition-all duration-300`}>
            {image && (
              <div className="relative inline-block bg-white p-1 rounded-lg shadow-md">
                <img
                  src={image}
                  alt="Preview"
                  className="h-16 w-auto object-cover rounded-lg"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-lg border border-[#6faa61]">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Cropcare about your plants..."
              className="flex-1 bg-transparent outline-none text-[#6faa61] placeholder-[#6faa61]"
            />
            <button
              onClick={triggerFileInput}
              className="ml-2 bg-green-50 rounded-full p-2 text-[#6faa61] hover:bg-green-100 transition-colors"
              title="Upload plant image"
            >
              <Image size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() && !image}
              className={`ml-2 rounded-full p-2 text-white transition-colors ${
                message.trim() || image
                  ? 'bg-[#6faa61] hover:bg-green-700'
                  : 'bg-[#6faa61] cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;