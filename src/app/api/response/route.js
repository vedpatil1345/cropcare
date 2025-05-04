import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-2.0-flash"; // For image + text
const textOnlyModelName = "gemini-2.0-flash"; // For text-only

// System instruction implemented as a chat history preamble
const getSystemInstruction = () => [
  {
    role: 'user',
    parts: [{ 
      text: "You are Cropcare, a friendly and knowledgeable farming assistant. Help users with their farming questions and provide practical advice. When analyzing plant images, identify the plant species, detect any diseases or pests, provide treatment options prioritizing organic remedies, and include brief growing tips. Keep responses concise and farmer-friendly."
    }]
  },
  {
    role: 'model',
    parts: [{ 
      text: "I understand my role as Cropcare, a farming assistant. I'll identify plants, detect issues, suggest treatments with a focus on organic options, and provide growing tips. I'll keep my responses practical and accessible."
    }]
  }
];

async function generateResponse(model, userMessage, history = [], image = null) {
  try {
    // Start with the system instruction
    const chatHistory = getSystemInstruction();
    
    // Add conversation history (convert from our format to Gemini's format)
    if (history && history.length > 0) {
      for (const msg of history) {
        // Skip the initial greeting message
        if (msg.type === 'initial') continue;
        
        chatHistory.push({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
    
    // Create the current user message parts
    const userMessageParts = [];
    
    // Add the text prompt
    if (userMessage && userMessage.trim()) {
      userMessageParts.push({ text: userMessage });
    } else if (image) {
      // Default text if only an image is provided
      userMessageParts.push({ text: "Please analyze this plant image." });
    }
    
    // Add the image if provided
    if (image) {
      if (!image.startsWith("data:image/")) {
        throw new Error("Invalid image format");
      }

      const imageData = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      userMessageParts.push({
        inlineData: {
          mimeType,
          data: imageData,
        }
      });
    }
    
    // Add the user message to chat history
    chatHistory.push({
      role: 'user',
      parts: userMessageParts
    });
    
    // Configure generation parameters
    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 2048,
    };
    
    // Generate content
    const result = await model.generateContent({
      contents: chatHistory,
      generationConfig,
    });
    
    const response = result.response;
    
    // Extract text from response
    if (response && response.text && typeof response.text === 'function') {
      return response.text();
    }
    
    if (response?.candidates?.[0]?.content?.parts) {
      return response.candidates[0].content.parts.map(part => part.text).join('');
    }
    
    console.warn("Empty or unexpected response from Gemini");
    return "Sorry, I couldn't generate a helpful response at this time. Please try again.";
  } catch (error) {
    console.error("Error generating content:", error.message);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
}

export async function POST(request) {
  try {
    const { prompt, history, image, chatSessionId } = await request.json();
    
    console.log('API received request:', { 
      promptPreview: prompt?.substring(0, 50), 
      historyLength: history?.length,
      hasImage: !!image,
      chatSessionId
    });

    // Make sure we have a valid chat session ID
    if (!chatSessionId) {
      return NextResponse.json(
        { error: 'Missing chat session ID' },
        { status: 400 }
      );
    }

    // Update the last_message_time in the chat_sessions table
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ last_message_time: new Date().toISOString() })
      .eq('id', chatSessionId);

    if (updateError) {
      console.error('Error updating chat session:', updateError);
      // Try to insert if update failed (might not exist yet)
      const { error: insertError } = await supabase
        .from('chat_sessions')
        .insert({
          id: chatSessionId,
          user_id: history[0]?.userId || 'guest',
          created_at: new Date().toISOString(),
          last_message_time: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error creating chat session:', insertError);
      }
    }
    
    // Choose the appropriate model based on whether an image is present
    const model = image 
      ? genAI.getGenerativeModel({ model: modelName })
      : genAI.getGenerativeModel({ model: textOnlyModelName });
    
    // Generate response
    const responseText = await generateResponse(model, prompt, history, image);
    
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}