"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, MessageSquare, Menu, X, Trash2 } from 'lucide-react';
import ChatInterface from './ChatInterface';

// Group chats by date - helper function
const groupChatsByDate = (chats) => {
  const grouped = {};
  
  chats.forEach(chat => {
    const date = new Date(chat.start_time || chat.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateStr;
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateStr = 'Yesterday';
    } else {
      dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
    
    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    
    // Only add if it's not already in the group
    if (!grouped[dateStr].find(c => c.id === chat.id)) {
      grouped[dateStr].push(chat);
    }
  });
  
  return grouped;
};

const Chat = ({ userId }) => {
  const [chatSessions, setChatSessions] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingSessionId, setDeletingSessionId] = useState(null);

  useEffect(() => {
    if (userId) {
      loadChatSessions();
    } else {
      setIsLoading(false);
      handleNewChat(); // Create a new chat for guest users
    }
  }, [userId]);

  const loadChatSessions = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Get all chat sessions for this user
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('clerk_user_id', userId)
        .order('start_time', { ascending: false });
        
      if (sessionsError) {
        console.error('Error getting chat sessions:', sessionsError);
        throw sessionsError;
      }
      
      if (sessions && sessions.length > 0) {
        // For each session, check if it has messages and get the first user message for title
        const enhancedSessions = await Promise.all(
          sessions.map(async (session) => {
            // Get message count
            const { count: messageCount } = await supabase
              .from('chat_messages')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id);
            
            // Skip sessions with no messages
            if (!messageCount || messageCount === 0) {
              return null;
            }
            
            // Get the first user message to use as title
            const { data: firstMessage } = await supabase
              .from('chat_messages')
              .select('message')
              .eq('session_id', session.id)
              .eq('message_type', 'user')
              .order('created_at', { ascending: true })
              .limit(1)
              .single();
              
            let title = session.session_name || "New Chat";
            if (firstMessage && firstMessage.message) {
              title = firstMessage.message.length > 40 ? 
                `${firstMessage.message.substring(0, 40)}...` : 
                firstMessage.message;
            }
            
            return {
              ...session,
              title,
              message_count: messageCount
            };
          })
        );
        
        // Filter out null sessions (those without messages)
        const validSessions = enhancedSessions.filter(session => session !== null);
        
        if (validSessions.length > 0) {
          const groupedChats = groupChatsByDate(validSessions);
          setChatSessions(groupedChats);
          
          // Set the most recent chat as active if none is selected
          if (!activeChatId) {
            setActiveChatId(validSessions[0].id);
          }
        } else {
          // No valid sessions found, create a new one
          handleNewChat();
        }
      } else {
        // No chat sessions found, create a new one
        handleNewChat();
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setError('Failed to load chat history');
      handleNewChat();
    } finally {
      setIsLoading(false);
      setIsFirstTimeLoading(false);
    }
  };

  const handleNewChat = useCallback(async () => {
    try {
      setError(null);
      const newChatId = crypto.randomUUID();
      setActiveChatId(newChatId);
      
      // If user is logged in and not first time loading, create session in database
      if (userId && !isFirstTimeLoading) {
        const { error: insertError } = await supabase
          .from('chat_sessions')
          .insert({
            id: newChatId,
            clerk_user_id: userId,
            session_name: 'New Chat',
            context: { language: 'en' }
          });
          
        if (insertError) {
          console.error('Error creating chat session:', insertError);
          setError('Failed to create new chat session');
          return null;
        }
        
        // Add to local state
        const newChat = {
          id: newChatId,
          title: "New Chat",
          start_time: new Date().toISOString(),
          message_count: 0
        };
        
        setChatSessions(prev => {
          const updated = {...prev};
          if (!updated['Today']) {
            updated['Today'] = [];
          }
          updated['Today'] = [newChat, ...updated['Today']];
          return updated;
        });
      }
      
      // Close sidebar on mobile after creating new chat
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      
      return newChatId;
    } catch (error) {
      console.error('Error in handleNewChat:', error);
      setError('Failed to create new chat session');
      return null;
    }
  }, [userId, isFirstTimeLoading]);

  const handleDeleteSession = async (sessionId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId || !sessionId || deletingSessionId) return;
    
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this chat session? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      setDeletingSessionId(sessionId);
      setError(null);
      
      // Delete messages first (foreign key constraint)
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
        
      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        throw new Error(`Failed to delete messages: ${messagesError.message}`);
      }
      
      // Delete the chat session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('clerk_user_id', userId);
        
      if (sessionError) {
        console.error('Error deleting session:', sessionError);
        throw new Error(`Failed to delete session: ${sessionError.message}`);
      }
      
      // Remove from local state
      setChatSessions(prev => {
        const updated = {...prev};
        for (const dateKey in updated) {
          updated[dateKey] = updated[dateKey].filter(chat => chat.id !== sessionId);
          if (updated[dateKey].length === 0) {
            delete updated[dateKey];
          }
        }
        return updated;
      });
      
      // If deleted session was active, switch to another or create new
      if (activeChatId === sessionId) {
        const allSessions = Object.values(chatSessions).flat();
        const remainingSessions = allSessions.filter(s => s.id !== sessionId);
        
        if (remainingSessions.length > 0) {
          setActiveChatId(remainingSessions[0].id);
        } else {
          handleNewChat();
        }
      }
      
    } catch (error) {
      console.error('Error deleting session:', error);
      setError(`Failed to delete chat session: ${error.message}`);
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleChatUpdate = useCallback((title) => {
    if (title && activeChatId) {
      setChatSessions(prev => {
        const updated = {...prev};
        for (const dateKey in updated) {
          const chatIndex = updated[dateKey].findIndex(c => c.id === activeChatId);
          if (chatIndex !== -1) {
            updated[dateKey][chatIndex] = {
              ...updated[dateKey][chatIndex],
              title: title
            };
            
            // Update session name in database
            if (userId) {
              supabase
                .from('chat_sessions')
                .update({ session_name: title })
                .eq('id', activeChatId)
                .eq('clerk_user_id', userId)
                .then(({ error }) => {
                  if (error) {
                    console.error('Error updating session name:', error);
                  }
                });
            }
            break;
          }
        }
        return updated;
      });
    }
  }, [activeChatId, userId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-[80vh] md:h-[93vh] bg-gray-100">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-15 left-4 z-50 bg-[#6faa61] text-white p-2 rounded-full shadow-lg"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
        transition-transform duration-300 ease-in-out bg-[#eef9e5] text-white 
        w-64 md:w-80 fixed inset-y-0 top-14 md:top-0 left-0 z-40 md:relative overflow-hidden flex flex-col pt-8 md:pt-0`}>
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex-1 pr-2">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="flex-shrink-0 hover:text-red-900"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        {/* New Chat Button */}
        <div className="p-4 border-b border-green-700">
          <button 
            onClick={handleNewChat}
            disabled={isLoading}
            className="flex items-center justify-center w-full p-3 bg-[#6faa61] hover:bg-green-600 
            rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <PlusCircle size={18} className="mr-2" />
            New Plant Chat
          </button>
        </div>
        
        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-[#6faa61] rounded-full"></div>
                <div className="w-2 h-2 bg-[#6faa61] rounded-full"></div>
                <div className="w-2 h-2 bg-[#6faa61] rounded-full"></div>
              </div>
            </div>
          ) : (
            Object.entries(chatSessions).map(([date, chats]) => (
              <div key={date} className="mb-4">
                <h3 className="text-xs text-[#6faa61] px-3 py-1 font-medium">{date}</h3>
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`group relative mb-1 rounded-lg ${
                      activeChatId === chat.id 
                        ? 'bg-[#6faa61]' 
                        : 'hover:bg-green-100'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveChatId(chat.id);
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`flex items-center w-full p-3 text-left pr-10 ${
                        activeChatId === chat.id 
                          ? 'text-white' 
                          : 'text-[#6faa61]'
                      }`}
                    >
                      <MessageSquare size={16} className="mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="truncate block text-sm">{chat.title || "New Chat"}</span>
                        {chat.message_count > 0 && (
                          <span className="text-xs opacity-70">
                            {chat.message_count} message{chat.message_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                    
                    {/* Delete Button */}
                    {userId && (
                      <button
                        onClick={(e) => handleDeleteSession(chat.id, e)}
                        disabled={deletingSessionId === chat.id}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 
                          opacity-0 group-hover:opacity-100 transition-opacity
                          p-1.5 rounded-full hover:bg-red-500 hover:text-white
                          ${activeChatId === chat.id ? 'text-white hover:bg-red-600' : 'text-red-500'}
                          ${deletingSessionId === chat.id ? 'opacity-100 cursor-not-allowed' : ''}
                        `}
                        title="Delete chat"
                      >
                        {deletingSessionId === chat.id ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
          
          {!isLoading && Object.keys(chatSessions).length === 0 && (
            <div className="text-center py-8 text-[#6faa61]">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-2">No chat history yet.</p>
              <p className="text-sm opacity-75">Start a new chat to begin!</p>
            </div>
          )}
        </div>
        
        {/* User Account Info */}
        <div className="p-4 border-t border-green-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#6faa61] flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">
                {userId ? userId.substring(0, 1).toUpperCase() : "G"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#6faa61] truncate">
                {userId ? `User: ${userId}` : "Guest User"}
              </p>
              <p className="text-xs text-green-600 truncate">
                {userId ? "Logged in" : "Not logged in"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <ChatInterface 
          userId={userId} 
          chatSessionId={activeChatId}
          onChatUpdate={handleChatUpdate}
          onNewSession={handleNewChat}
        />
      </div>
    </div>
  );
};

export default Chat;