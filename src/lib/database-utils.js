// lib/database-utils.js
import { supabase } from './supabase';

/**
 * Database utility functions for chat operations
 */

/**
 * Create a new chat session
 */
export async function createChatSession(userId, sessionName = 'New Chat', context = {}) {
  try {
    const sessionId = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        id: sessionId,
        clerk_user_id: userId,
        session_name: sessionName,
        context: {
          language: 'en',
          ...context
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create chat session:', error);
    throw error;
  }
}

/**
 * Get all chat sessions for a user with message counts
 */
export async function getChatSessions(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        message_count:chat_messages(count)
      `)
      .eq('clerk_user_id', userId)
      .order('start_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get chat sessions:', error);
    throw error;
  }
}

/**
 * Get chat messages for a session
 */
export async function getChatMessages(sessionId, userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get chat messages:', error);
    throw error;
  }
}

/**
 * Save a chat message
 */
export async function saveChatMessage(sessionId, userId, message, messageType, options = {}) {
  try {
    const messageData = {
      session_id: sessionId,
      clerk_user_id: userId,
      message: message,
      message_type: messageType,
      language: options.language || 'en',
      image_url: options.imageUrl || null,
      confidence: options.confidence || null
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save chat message:', error);
    throw error;
  }
}

/**
 * Delete a chat session and all its messages
 */
export async function deleteChatSession(sessionId, userId) {
  try {
    // Start a transaction-like operation
    // First delete all messages
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId)
      .eq('clerk_user_id', userId);

    if (messagesError) {
      console.error('Error deleting messages:', messagesError);
      throw messagesError;
    }

    // Then delete the session
    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('clerk_user_id', userId);

    if (sessionError) {
      console.error('Error deleting session:', sessionError);
      throw sessionError;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete chat session:', error);
    throw error;
  }
}

/**
 * Update chat session name
 */
export async function updateChatSessionName(sessionId, userId, newName) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ 
        session_name: newName,
        end_time: null // Reset end_time when updating
      })
      .eq('id', sessionId)
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session name:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update session name:', error);
    throw error;
  }
}

/**
 * Get the first user message from a chat session (for title generation)
 */
export async function getFirstUserMessage(sessionId, userId) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('message')
      .eq('session_id', sessionId)
      .eq('clerk_user_id', userId)
      .eq('message_type', 'user')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting first user message:', error);
      throw error;
    }

    return data?.message || null;
  } catch (error) {
    console.error('Failed to get first user message:', error);
    return null;
  }
}

/**
 * Enhanced chat session fetching with titles
 */
export async function getChatSessionsWithTitles(userId, limit = 50) {
  try {
    const sessions = await getChatSessions(userId, limit);
    
    // Filter sessions that have messages
    const sessionsWithMessages = sessions.filter(session => 
      session.message_count && session.message_count[0]?.count > 0
    );

    // Get titles for each session
    const enhancedSessions = await Promise.all(
      sessionsWithMessages.map(async (session) => {
        const firstMessage = await getFirstUserMessage(session.id, userId);
        
        let title = session.session_name || 'New Chat';
        if (firstMessage) {
          title = firstMessage.length > 40 ? 
            `${firstMessage.substring(0, 40)}...` : 
            firstMessage;
        }
        
        return {
          ...session,
          title,
          message_count: session.message_count[0]?.count || 0
        };
      })
    );

    return enhancedSessions;
  } catch (error) {
    console.error('Failed to get sessions with titles:', error);
    throw error;
  }
}

/**
 * Clean up old empty chat sessions
 */
export async function cleanupEmptySessions(userId, olderThanDays = 7) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // Get sessions with no messages that are older than cutoff
    const { data: emptySessions, error: fetchError } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        start_time,
        chat_messages!left(id)
      `)
      .eq('clerk_user_id', userId)
      .lt('start_time', cutoffDate.toISOString())
      .is('chat_messages.id', null);

    if (fetchError) {
      console.error('Error fetching empty sessions:', fetchError);
      throw fetchError;
    }

    if (emptySessions && emptySessions.length > 0) {
      const sessionIds = emptySessions.map(s => s.id);
      
      const { error: deleteError } = await supabase
        .from('chat_sessions')
        .delete()
        .in('id', sessionIds)
        .eq('clerk_user_id', userId);

      if (deleteError) {
        console.error('Error deleting empty sessions:', deleteError);
        throw deleteError;
      }

      return sessionIds.length;
    }

    return 0;
  } catch (error) {
    console.error('Failed to cleanup empty sessions:', error);
    throw error;
  }
}

/**
 * Validate database connection and tables
 */
export async function validateDatabaseConnection() {
  try {
    // Test chat_sessions table
    const { error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('id')
      .limit(1);
      
    if (sessionsError) {
      throw new Error(`chat_sessions table error: ${sessionsError.message}`);
    }

    // Test chat_messages table
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .select('id')
      .limit(1);
      
    if (messagesError) {
      throw new Error(`chat_messages table error: ${messagesError.message}`);
    }

    return { success: true, message: 'Database connection validated' };
  } catch (error) {
    console.error('Database validation failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Error handler wrapper for database operations
 */
export function withErrorHandler(operation) {
  return async (...args) => {
    try {
      return await operation(...args);
    } catch (error) {
      console.error(`Database operation failed:`, error);
      
      // Handle common Supabase errors
      if (error.code === 'PGRST116') {
        throw new Error('No data found');
      } else if (error.code === '23505') {
        throw new Error('Duplicate entry');
      } else if (error.code === '23503') {
        throw new Error('Foreign key constraint violation');
      }
      
      throw error;
    }
  };
}