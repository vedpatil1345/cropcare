import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-2.0-flash";

// Enhanced system instruction
const getSystemInstruction = (location, date,language) => [
  {
    role: 'user',
    parts: [{ 
      text: `You are Cropcare, an expert farming assistant AI with deep knowledge of agriculture, plant pathology, pest management, and sustainable farming practices.

Your expertise includes:
- Plant identification and disease diagnosis from images
- Pest identification and integrated pest management (IPM)
- Organic and sustainable farming solutions
- Crop-specific growing advice and seasonal recommendations
- Soil health and nutrient management
- Weather-related farming guidance

Current Context:
- Respond in: ${language}
- Location: ${location || 'Location not specified'}
- Date: ${date}
- Focus on solutions appropriate for this location and season

Guidelines for responses:
1. Always provide practical, actionable advice
2. Prioritize organic and sustainable solutions
3. Include specific treatment steps when diagnosing problems
4. Consider local climate and seasonal factors
5. Provide preventive measures to avoid future issues
6. Keep language simple and farmer-friendly
7. When analyzing images, structure your response as:
   - Plant identification
   - Problem diagnosis (if any)
   - Treatment recommendations (organic first)
   - Prevention tips
   - General growing advice

Remember previous conversations in this chat session to provide consistent, building advice.`
    }]
  },
  {
    role: 'model',
    parts: [{ 
      text: "I understand. I'm Cropcare, your farming assistant. I'll help you with plant identification, disease diagnosis, pest management, and growing advice. I'll prioritize organic solutions, consider your location and season, and remember our conversation history to provide consistent guidance. How can I help you with your farming today?"
    }]
  }
];

// Improved chat history fetching with error handling
async function fetchChatHistory(sessionId, clerkUserId, limit = 15) {
  if (!sessionId || !clerkUserId) {
    return [];
  }

  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('message, message_type, created_at')
      .eq('session_id', sessionId)
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: true })
      .limit(limit * 2); // Get more messages to account for user/bot pairs

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return messages || [];
  } catch (error) {
    console.error('Error in fetchChatHistory:', error);
    return [];
  }
}

// Enhanced response generation with better error handling
async function generateResponse(model, userMessage, chatHistory = [], image = null, location = null, language='English') {
  try {
    // Start with system instruction
    let conversationHistory = getSystemInstruction(location, new Date().toLocaleDateString(),language);
    
    // Add chat history (properly formatted)
    if (chatHistory && chatHistory.length > 0) {
      // Skip initial/system messages and focus on actual conversation
      const relevantHistory = chatHistory.filter(msg => 
        msg.message_type !== 'initial' && 
        msg.message && 
        msg.message.trim().length > 0
      );

      for (const msg of relevantHistory) {
        conversationHistory.push({
          role: msg.message_type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.message }]
        });
      }
    }
    
    // Prepare current user message
    const userMessageParts = [];
    
    // Add text prompt
    if (userMessage && userMessage.trim()) {
      userMessageParts.push({ text: userMessage });
    } else if (image) {
      userMessageParts.push({ text: "Please analyze this plant image and provide detailed farming advice including identification, any visible issues, treatment recommendations, and growing tips." });
    }
    
    // Add image if provided
    if (image) {
      try {
        if (!image.startsWith("data:image/")) {
          throw new Error("Invalid image format");
        }

        const imageData = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];

        // Validate image data
        if (!imageData || !mimeType) {
          throw new Error("Invalid image data format");
        }

        userMessageParts.push({
          inlineData: {
            mimeType,
            data: imageData,
          }
        });
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        throw new Error(`Image processing failed: ${imageError.message}`);
      }
    }
    
    // Ensure we have some content to send
    if (userMessageParts.length === 0) {
      userMessageParts.push({ text: "Hello, I need help with plant care." });
    }
    
    // Add current user message to conversation
    conversationHistory.push({
      role: 'user',
      parts: userMessageParts
    });
    
    // Enhanced generation config for better responses
    const generationConfig = {
      temperature: 0.3, // Lower for more consistent, focused responses
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 3000, // Increased for more detailed responses
    };
    
    // Generate content with conversation context
    const result = await model.generateContent({
      contents: conversationHistory,
      generationConfig,
    });
    
    const response = result.response;
    
    // Extract text from response with multiple fallbacks
    let responseText = '';
    
    if (response && response.text && typeof response.text === 'function') {
      responseText = response.text();
    } else if (response?.candidates?.[0]?.content?.parts) {
      responseText = response.candidates[0].content.parts
        .map(part => part.text || '')
        .join('')
        .trim();
    }
    
    // Validate response
    if (!responseText || responseText.length < 10) {
      console.warn("Short or empty response from Gemini:", responseText);
      return "I apologize, but I couldn't generate a helpful response at this time. Please try rephrasing your question or uploading a clearer image if you're seeking plant analysis.";
    }
    
    return responseText;
    
  } catch (error) {
    console.error("Error generating content:", error);
    
    // Handle specific error types
    if (error.message.includes('SAFETY')) {
      return "I couldn't analyze this content due to safety restrictions. Please try with a different image or question about plant care.";
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      return "I'm experiencing high demand right now. Please try again in a few moments.";
    } else if (error.message.includes('Invalid image')) {
      return "I couldn't process the uploaded image. Please try uploading a different image in JPG, PNG, or WebP format.";
    }
    
    return `I encountered an error while processing your request. Please try again, and if the problem persists, try rephrasing your question.`;
  }
}

// Enhanced session management
async function ensureChatSession(sessionId, clerkUserId, language = 'en', location = null) {
  if (!sessionId || !clerkUserId) {
    throw new Error('Missing session ID or user ID');
  }

  try {
    // Check if session exists
    const { data: existingSession, error: checkError } = await supabase
      .from('chat_sessions')
      .select('id, context')
      .eq('id', sessionId)
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (checkError && checkError.code === 'PGRST116') {
      // Session doesn't exist, create it
      const { error: insertError } = await supabase
        .from('chat_sessions')
        .insert({
          id: sessionId,
          clerk_user_id: clerkUserId,
          session_name: 'New Chat',
          context: { language, location }
        });
        
      if (insertError) {
        console.error('Error creating chat session:', insertError);
        throw new Error(`Failed to create chat session: ${insertError.message}`);
      }
      
      return { language, location };
    } else if (checkError) {
      console.error('Error checking chat session:', checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }
    
    return existingSession.context || { language, location };
  } catch (error) {
    console.error('Error ensuring chat session:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { prompt, image, chatSessionId, clerkUserId, language = 'en', location } = await request.json();
    
    // Validate required parameters
    if (!chatSessionId) {
      return NextResponse.json(
        { error: 'Missing chat session ID' },
        { status: 400 }
      );
    }
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    // Validate input content
    if (!prompt?.trim() && !image) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // Ensure chat session exists
    let sessionContext;
    try {
      sessionContext = await ensureChatSession(chatSessionId, clerkUserId, language, location);
    } catch (sessionError) {
      console.error('Session management error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to manage chat session' },
        { status: 500 }
      );
    }

    const sessionLocation = location || sessionContext?.location;

    // Fetch chat history from database
    const chatHistory = await fetchChatHistory(chatSessionId, clerkUserId, 15);

    // Save user message to database
    let userMessageId = null;
    if (prompt?.trim() || image) {
      try {
        const { data: savedMessage, error: userMessageError } = await supabase
          .from('chat_messages')
          .insert({
            session_id: chatSessionId,
            clerk_user_id: clerkUserId,
            message: prompt?.trim() || 'Image uploaded for analysis',
            message_type: 'user',
            language: language,
            image_url: image || null
          })
          .select('id')
          .single();

        if (userMessageError) {
          console.error('Error saving user message:', userMessageError);
        } else {
          userMessageId = savedMessage?.id;
        }
      } catch (saveError) {
        console.error('Failed to save user message:', saveError);
      }
    }
    
    // Generate response
    let responseText;
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      responseText = await generateResponse(
        model, 
        prompt, 
        chatHistory, 
        image, 
        sessionLocation,
        language
      );
    } catch (generationError) {
      console.error('Response generation error:', generationError);
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    // Save bot response to database
    try {
      const { error: botMessageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: chatSessionId,
          clerk_user_id: clerkUserId,
          message: responseText,
          message_type: 'bot',
          language: language,
          confidence: 0.95
        });

      if (botMessageError) {
        console.error('Error saving bot message:', botMessageError);
      }
    } catch (saveError) {
      console.error('Failed to save bot message:', saveError);
    }
    
    return NextResponse.json({ 
      response: responseText,
      chatSessionId: chatSessionId,
      success: true
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request', 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}