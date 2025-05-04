"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, MessageSquare, Menu, X } from 'lucide-react';
import ChatInterface from './ChatInterface';

// Group chats by date - helper function
const groupChatsByDate = (chats) => {
  const grouped = {};
  
  chats.forEach(chat => {
    const date = new Date(chat.created_at);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
    
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

  useEffect(() => {
    if (userId) {
      loadChatSessions();
    } else {
      setIsLoading(false);
      handleNewChat(); // Create a new chat for guest users
    }
  }, [userId]);

  const loadChatSessions = async () => {
    try {
      setIsLoading(true);
      
      // First check if the chat_sessions table exists
      const { error: tableCheckError } = await supabase
        .from('chat_sessions')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.error('Error checking chat_sessions table:', tableCheckError);
        // If table doesn't exist or there's another error, create a new chat
        handleNewChat();
        setIsLoading(false);
        return;
      }
      
      // Try to get chat sessions using RPC function
      const { data: chatGroups, error: groupError } = await supabase
        .rpc('get_chat_sessions', { user_id_param: userId });
      
      // Fall back to direct query if RPC fails
      if (groupError) {
        
        // Get all chat sessions for this user
        const { data: sessions, error: sessionsError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('last_message_time', { ascending: false });
          
        if (sessionsError) {
          console.error('Error getting chat sessions:', sessionsError);
          handleNewChat();
          setIsLoading(false);
          return;
        }
        
        if (sessions && sessions.length > 0) {
          // For each session, get the first user message to use as title
          const enhancedSessions = await Promise.all(sessions.map(async (session) => {
            const { data: messages } = await supabase
              .from('chat_history')
              .select('*')
              .eq('chat_session_id', session.id)
              .eq('message_type', 'user')
              .order('created_at', { ascending: true })
              .limit(1);
              
            let title = "New Chat";
            if (messages && messages.length > 0) {
              title = messages[0].content.length > 30 ? 
                `${messages[0].content.substring(0, 30)}...` : 
                messages[0].content;
            }
            
            return {
              ...session,
              title
            };
          }));
          
          const groupedChats = groupChatsByDate(enhancedSessions);
          setChatSessions(groupedChats);
          
          // Set the most recent chat as active
          if (!activeChatId && enhancedSessions.length > 0) {
            setActiveChatId(enhancedSessions[0].id);
          }
        } else {
          // No chat sessions found, create a new one
          handleNewChat();
        }
      } else if (chatGroups && chatGroups.length > 0) {
        // RPC function worked, use the results
        const groupedChats = groupChatsByDate(chatGroups);
        setChatSessions(groupedChats);
        
        // Set the most recent chat as active
        if (!activeChatId) {
          setActiveChatId(chatGroups[0].id);
        }
      } else {
        // No chat sessions found, create a new one
        handleNewChat();
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      // Create a new chat if there's an error
      handleNewChat();
    } finally {
      setIsLoading(false);
      setIsFirstTimeLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      // Generate a new UUID for the chat session
      const newChatId = crypto.randomUUID();
      setActiveChatId(newChatId);
      
      // If this is the first time loading and user ID exists, create a session in database
      if (!isFirstTimeLoading && userId) {
        // Create the chat session in database
        const { error } = await supabase
          .from('chat_sessions')
          .insert({
            id: newChatId,
            user_id: userId,
            created_at: new Date().toISOString(),
            last_message_time: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error creating new chat session:', error);
        }
      }
      
      // Update sidebar immediately for better UX
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const newChat = {
        id: newChatId,
        title: "New Chat",
        created_at: new Date().toISOString(),
        last_message_time: new Date().toISOString()
      };
      
      setChatSessions(prev => {
        const updated = {...prev};
        if (!updated[today]) {
          updated[today] = [];
        }
        updated[today] = [newChat, ...updated[today]];
        return updated;
      });
      
      // Close sidebar on mobile after creating new chat
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      
      return newChatId;
    } catch (error) {
      console.error('Error in handleNewChat:', error);
      return null;
    }
  };

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
        
        {/* New Chat Button */}
        <div className="p-4 border-b border-green-700">
          <button 
            onClick={handleNewChat}
            className="flex items-center justify-center w-full p-3 bg-[#6faa61] hover:bg-green-600 
            rounded-lg text-white font-medium transition-colors">
            <PlusCircle size={18} className="mr-2" />
            New Plant Chat
          </button>
        </div>
        
        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            Object.entries(chatSessions).map(([date, chats]) => (
              <div key={date} className="mb-4">
                <h3 className="text-xs text-[#6faa61] px-3 py-1">{date}</h3>
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center w-full p-3 rounded-lg mb-1 text-left ${
                      activeChatId === chat.id 
                        ? 'bg-[#6faa61] text-white' 
                        : 'hover:bg-green-700 text-[#6faa61]'
                    }`}
                  >
                    <MessageSquare size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{chat.title || "New Chat"}</span>
                  </button>
                ))}
              </div>
            ))
          )}
          
          {!isLoading && Object.keys(chatSessions).length === 0 && (
            <div className="text-center py-8 text-green-300">
              <p>No chat history yet.</p>
              <p>Start a new chat!</p>
            </div>
          )}
        </div>
        
        {/* User Account Info (Placeholder) */}
        <div className="p-4 border-t border-green-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#6faa61] flex items-center justify-center mr-2">
              {userId ? userId.substring(0, 1).toUpperCase() : "G"}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-[#6faa61]">{userId ? `${userId}` : "Guest User"}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <ChatInterface 
          userId={userId} 
          chatSessionId={activeChatId}
          onChatUpdate={(firstMsg) => {
            // Update the chat title in sidebar based on first message
            if (firstMsg && activeChatId) {
              setChatSessions(prev => {
                const newSessions = {...prev};
                for (const date in newSessions) {
                  const chatIndex = newSessions[date].findIndex(c => c.id === activeChatId);
                  if (chatIndex !== -1) {
                    newSessions[date][chatIndex].title = firstMsg;
                    break;
                  }
                }
                return newSessions;
              });
            }
          }}
          onNewSession={handleNewChat}
        />
      </div>
    </div>
  );
};

export default Chat;