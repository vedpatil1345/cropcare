"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, Image, X, Globe, ChevronDown } from 'lucide-react';
import { marked } from 'marked';
import { supabase } from '@/lib/supabase';

// Language configurations
const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', nativeName: 'English' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी' },
  'as': { name: 'Assamese', nativeName: 'অসমীয়া' },
  'bn': { name: 'Bengali', nativeName: 'বাংলা' },
  'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  'kn': { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  'ks': { name: 'Kashmiri', nativeName: 'کٲشُر' },
  'ml': { name: 'Malayalam', nativeName: 'മലയാളം' },
  'mr': { name: 'Marathi', nativeName: 'मराठी' },
  'ne': { name: 'Nepali', nativeName: 'नेपाली' },
  'or': { name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  'pa': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  'sa': { name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  'sd': { name: 'Sindhi', nativeName: 'سنڌي' },
  'ta': { name: 'Tamil', nativeName: 'தமிழ்' },
  'te': { name: 'Telugu', nativeName: 'తెలుగు' },
  'ur': { name: 'Urdu', nativeName: 'اردو' }
};

// Translations for UI elements
const TRANSLATIONS = {
  'en': {
    welcomeMessage: "Hello! I'm Cropcare, your plant care assistant. Upload a photo or describe your plant issue, and I'll help you diagnose problems and provide care advice.",
    placeholder: "Ask Cropcare about your plants...",
    uploadImageTitle: "Upload plant image",
    removeImage: "Remove image",
    imageUploadedAnalysis: "Image uploaded for analysis",
    errorLoadHistory: "Failed to load chat history",
    errorCreateSession: "Failed to create new chat session",
    errorInitSession: "Failed to initialize chat session",
    errorProcessing: "I'm having trouble processing your request. Please try again.",
    errorGeneral: "Sorry, I encountered an error processing your request. Please try again in a moment.",
    errorInvalidFile: "Please upload a valid image file",
    errorFileSize: "Image file too large. Please upload an image under 5MB.",
    errorReadFile: "Failed to read image file",
    you: "You",
    cropcare: "Cropcare",
    selectLanguage: "Select Language"
  },
  'hi': {
    welcomeMessage: "नमस्ते! मैं क्रॉपकेयर हूँ, आपका पौधों की देखभाल सहायक। फोटो अपलोड करें या अपनी पौधों की समस्या बताएं, और मैं समस्याओं का निदान और देखभाल की सलाह प्रदान करूंगा।",
    placeholder: "अपने पौधों के बारे में क्रॉपकेयर से पूछें...",
    uploadImageTitle: "पौधे की तस्वीर अपलोड करें",
    removeImage: "तस्वीर हटाएं",
    imageUploadedAnalysis: "विश्लेषण के लिए तस्वीर अपलोड की गई",
    errorLoadHistory: "चैट इतिहास लोड करने में विफल",
    errorCreateSession: "नया चैट सत्र बनाने में विफल",
    errorInitSession: "चैट सत्र प्रारंभ करने में विफल",
    errorProcessing: "मुझे आपके अनुरोध को संसाधित करने में कठिनाई हो रही है। कृपया पुनः प्रयास करें।",
    errorGeneral: "खुशी से, मुझे आपके अनुरोध को संसाधित करने में त्रुटि का सामना करना पड़ा। कृपया एक क्षण में पुनः प्रयास करें।",
    errorInvalidFile: "कृपया एक वैध चित्र फ़ाइल अपलोड करें",
    errorFileSize: "चित्र फ़ाइल बहुत बड़ी है। कृपया 5MB से कम का चित्र अपलोड करें।",
    errorReadFile: "चित्र फ़ाइल पढ़ने में विफल",
    you: "आप",
    cropcare: "क्रॉपकेयर",
    selectLanguage: "भाषा चुनें"
  },
  'gu': {
    welcomeMessage: "નમસ્તે! હું ક્રોપકેર છું, તમારો છોડ સંભાળ સહાયક. ફોટો અપલોડ કરો અથવા તમારી છોડની સમસ્યા વર્ણવો, અને હું સમસ્યાઓનું નિદાન અને સંભાળની સલાહ આપીશ.",
    placeholder: "તમારા છોડ વિશે ક્રોપકેરને પૂછો...",
    uploadImageTitle: "છોડનો ફોટો અપલોડ કરો",
    removeImage: "ફોટો દૂર કરો",
    imageUploadedAnalysis: "વિશ્લેષણ માટે ફોટો અપલોડ કર્યો",
    errorLoadHistory: "ચેટ ઇતિહાસ લોડ કરવામાં નિષ્ફળ",
    errorCreateSession: "નવો ચેટ સત્ર બનાવવામાં નિષ્ફળ",
    errorInitSession: "ચેટ સત્ર શરૂ કરવામાં નિષ્ફળ",
    errorProcessing: "મને તમારી વિનંતી પર કાર્ય કરવામાં મુશ્કેલી પડી રહી છે. કૃપા કરીને ફરી પ્રયાસ કરો.",
    errorGeneral: "માફ કરજો, મને તમારી વિનંતી પર કાર્ય કરતા સમયે ભૂલનો સામનો કરવો પડ્યો. કૃપા કરીને એક ક્ષણમાં ફરી પ્રયાસ કરો.",
    errorInvalidFile: "કૃપા કરીને માન્ય ઇમેજ ફાઇલ અપલોડ કરો",
    errorFileSize: "ઇમેજ ફાઇલ ખૂબ મોટી છે. કૃપા કરીને 5MB થી ઓછી ઇમેજ અપલોડ કરો.",
    errorReadFile: "ઇમેજ ફાઇલ વાંચવામાં નિષ્ફળ",
    you: "તમે",
    cropcare: "ક્રોપકેર",
    selectLanguage: "ભાષા પસંદ કરો"
  },
  'ta': {
    welcomeMessage: "வணக்கம்! நான் கிராப்கேர், உங்கள் தாவர பராமரிப்பு உதவியாளர். புகைப்படத்தை பதிவேற்றவும் அல்லது உங்கள் தாவர பிரச்சினையை விவரிக்கவும், நான் பிரச்சினைகளை கண்டறிந்து பராமரிப்பு ஆலோசனை வழங்குவேன்.",
    placeholder: "உங்கள் தாவரங்களைப் பற்றி கிராப்கேரிடம் கேளுங்கள்...",
    uploadImageTitle: "தாவர படத்தை பதிவேற்றவும்",
    removeImage: "படத்தை அகற்றவும்",
    imageUploadedAnalysis: "பகுப்பாய்வுக்காக படம் பதிவேற்றப்பட்டது",
    errorLoadHistory: "அரட்டை வரலாற்றை ஏற்ற முடியவில்லை",
    errorCreateSession: "புதிய அரட்டை அமர்வை உருவாக்க முடியவில்லை",
    errorInitSession: "அரட்டை அமர்வை தொடங்க முடியவில்லை",
    errorProcessing: "உங்கள் கோரிக்கையை செயலாக்குவதில் எனக்கு சிக்கல் உள்ளது. தயவு செய்து மீண்டும் முயற்சிக்கவும்.",
    errorGeneral: "மன்னிக்கவும், உங்கள் கோரிக்கையை செயலாக்குவதில் நான் பிழையை எதிர்கொண்டேன். தயவு செய்து ஒரு நிமிடத்தில் மீண்டும் முயற்சிக்கவும்.",
    errorInvalidFile: "தயவு செய்து சரியான படக் கோப்பை பதிவேற்றவும்",
    errorFileSize: "படக் கோப்பு மிகவும் பெரியது. தயவு செய்து 5MB க்கு குறைவான படத்தை பதிவேற்றவும்.",
    errorReadFile: "படக் கோப்பைப் படிக்க முடியவில்லை",
    you: "நீங்கள்",
    cropcare: "கிராப்கேர்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்"
  },
  'te': {
    welcomeMessage: "నమస్కారం! నేను క్రాప్‌కేర్, మీ మొక్కల సంరక్షణ సహాయకుడను. ఫోటో అప్‌లోడ్ చేయండి లేదా మీ మొక్క సమస్యను వివరించండి, మరియు నేను సమస్యలను నిర్ధారించి సంరక్షణ సలహా అందిస్తాను.",
    placeholder: "మీ మొక్కల గురించి క్రాప్‌కేర్‌ని అడగండి...",
    uploadImageTitle: "మొక్క ఫోటోని అప్‌లోడ్ చేయండి",
    removeImage: "ఫోటోని తొలగించండి",
    imageUploadedAnalysis: "విశ్లేషణ కోసం ఫోటో అప్‌లోడ్ చేయబడింది",
    errorLoadHistory: "చాట్ చరిత్రను లోడ్ చేయడంలో విఫలమైంది",
    errorCreateSession: "కొత్త చాట్ సెషన్‌ను సృష్టించడంలో విఫలమైంది",
    errorInitSession: "చాట్ సెషన్‌ను ప్రారంభించడంలో విఫలమైంది",
    errorProcessing: "మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో నాకు ఇబ్బంది అవుతోంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    errorGeneral: "క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో నేను లోపాన్ని ఎదుర్కొన్నాను. దయచేసి ఒక క్షణంలో మళ్లీ ప్రయత్నించండి.",
    errorInvalidFile: "దయచేసి చెల్లుబాటు అయ్యే ఇమేజ్ ఫైల్‌ను అప్‌లోడ్ చేయండి",
    errorFileSize: "ఇమేజ్ ఫైల్ చాలా పెద్దది. దయచేసి 5MB కి తక్కువ ఇమేజ్‌ను అప్‌లోడ్ చేయండి.",
    errorReadFile: "ఇమేజ్ ఫైల్‌ను చదవడంలో విఫలమైంది",
    you: "మీరు",
    cropcare: "క్రాప్‌కేర్",
    selectLanguage: "భాషను ఎంచుకోండి"
  }
};

const ChatInterface = ({ userId, chatSessionId, onChatUpdate, onNewSession }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get current translations
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  // Initial welcome message based on language
  const getInitialMessage = (lang) => ({
    message_type: 'bot',
    message: TRANSLATIONS[lang]?.welcomeMessage || TRANSLATIONS['en'].welcomeMessage
  });

  // Load chat history when chatSessionId changes
  useEffect(() => {
    if (chatSessionId && userId) {
      loadChatHistory();
    } else {
      setChatHistory([getInitialMessage(currentLanguage)]);
      setIsInitializing(false);
    }
  }, [chatSessionId, userId]);

  // Update welcome message when language changes
  useEffect(() => {
    if (chatHistory.length === 1 && chatHistory[0].message_type === 'bot') {
      setChatHistory([getInitialMessage(currentLanguage)]);
    }
  }, [currentLanguage]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Update the chat title in parent component based on first message
    if (chatHistory.length > 1 && onChatUpdate) {
      const firstUserMsg = chatHistory.find(msg => msg.message_type === 'user');
      if (firstUserMsg && firstUserMsg.message) {
        const title = firstUserMsg.message.length > 30 ? 
          `${firstUserMsg.message.substring(0, 30)}...` : 
          firstUserMsg.message;
        onChatUpdate(title);
      }
    }
  }, [chatHistory, onChatUpdate]);

  const loadChatHistory = async () => {
    if (!userId || !chatSessionId) {
      setChatHistory([getInitialMessage(currentLanguage)]);
      setIsInitializing(false);
      return;
    }

    try {
      setIsInitializing(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, message, message_type, image_url, language, created_at')
        .eq('session_id', chatSessionId)
        .eq('clerk_user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Set language from first message if available
        const firstMsg = data[0];
        if (firstMsg.language && SUPPORTED_LANGUAGES[firstMsg.language]) {
          setCurrentLanguage(firstMsg.language);
        }

        const formattedHistory = data.map(msg => ({
          id: msg.id,
          message_type: msg.message_type,
          message: msg.message || '',
          image: msg.image_url || null,
          created_at: msg.created_at,
          language: msg.language
        }));
        setChatHistory([getInitialMessage(firstMsg.language || currentLanguage), ...formattedHistory]);
      } else {
        setChatHistory([getInitialMessage(currentLanguage)]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError(t.errorLoadHistory);
      setChatHistory([getInitialMessage(currentLanguage)]);
    } finally {
      setIsInitializing(false);
    }
  };

  const saveChatMessage = async (messageData) => {
    if (!userId || !chatSessionId) {
      console.warn('Cannot save message: Missing userId or chatSessionId');
      return null;
    }
    
    if (!messageData.message_type || !messageData.message) {
      console.warn('Cannot save message: Missing required fields');
      return null;
    }

    try {
      const messageToSave = {
        session_id: chatSessionId,
        clerk_user_id: userId,
        message_type: messageData.message_type,
        message: messageData.message,
        language: currentLanguage,
        image_url: messageData.image || null,
        confidence: messageData.message_type === 'bot' ? 0.95 : null
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(messageToSave)
        .select()
        .single();

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in saveChatMessage:', error);
      return null;
    }
  };

  const ensureChatSession = async () => {
    if (!userId || !chatSessionId) return false;

    try {
      // Check if session exists
      const { data: existingSession, error: checkError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', chatSessionId)
        .eq('clerk_user_id', userId)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Session doesn't exist, create it
        const { error: insertError } = await supabase
          .from('chat_sessions')
          .insert({
            id: chatSessionId,
            clerk_user_id: userId,
            session_name: 'New Chat',
            context: { language: currentLanguage }
          });

        if (insertError) {
          console.error('Error creating chat session:', insertError);
          return false;
        }
        return true;
      } else if (checkError) {
        console.error('Error checking chat session:', checkError);
        return false;
      }
      
      return true; // Session exists
    } catch (error) {
      console.error('Error ensuring chat session:', error);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return;
    
    // If no chatSessionId, create new session
    if (!chatSessionId && onNewSession) {
      try {
        const newSessionId = await onNewSession();
        if (!newSessionId) {
          setError(t.errorCreateSession);
          return;
        }
      } catch (error) {
        console.error('Error creating new session:', error);
        setError(t.errorCreateSession);
        return;
      }
    }

    // Ensure chat session exists
    const sessionExists = await ensureChatSession();
    if (!sessionExists && userId) {
      setError(t.errorInitSession);
      return;
    }

    const userMessage = {
      message_type: 'user',
      message: message || t.imageUploadedAnalysis,
      image: image
    };

    // Update UI immediately
    setChatHistory(prev => [...prev, { ...userMessage, id: Date.now() }]);
    
    // Clear inputs
    const currentMessage = message;
    const currentImage = image;
    setMessage('');
    setImage(null);
    setIsLoading(true);
    setError(null);
    
    try {
      // Save user message if user is logged in
      if (userId) {
        await saveChatMessage(userMessage);
      }

      // Get AI response
      const response = await fetch('/api/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentMessage.trim(),
          image: currentImage,
          chatSessionId: chatSessionId,
          clerkUserId: userId,
          language: SUPPORTED_LANGUAGES[currentLanguage]?.nativeName
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const botMessage = {
        message_type: 'bot',
        message: data.response || t.errorProcessing
      };

      setChatHistory(prev => [...prev, { ...botMessage, id: Date.now() + 1 }]);
      
      // Save bot message if user is logged in
      if (userId) {
        await saveChatMessage(botMessage);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setError(error.message);
      
      const errorMessage = {
        message_type: 'bot',
        message: t.errorGeneral
      };
      setChatHistory(prev => [...prev, { ...errorMessage, id: Date.now() + 2 }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t.errorInvalidFile);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError(t.errorFileSize);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result);
      setError(null);
    };
    reader.onerror = () => {
      setError(t.errorReadFile);
    };
    reader.readAsDataURL(file);
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Language Selector */}
      <div className="flex justify-end p-4 bg-white border-b border-green-100">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-[#6faa61] rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
            <Globe size={16} />
            <span className="text-sm font-medium">
              {SUPPORTED_LANGUAGES[currentLanguage]?.nativeName}
            </span>
            <ChevronDown size={14} />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-green-200 z-50 max-h-80 overflow-y-auto">
              <div className="p-2 border-b border-green-100">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {t.selectLanguage}
                </span>
              </div>
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-green-50 transition-colors ${
                    currentLanguage === code ? 'bg-green-100 text-[#6faa61] font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{lang.nativeName}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

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
        ) : (
          chatHistory.map((chat, index) => (
            <div key={chat.id || index} className={`mb-4 ${chat.message_type === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-4 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                  chat.message_type === 'user'
                    ? 'bg-green-100 text-[#6faa61] rounded-tr-none shadow-md'
                    : 'bg-[#6faa61] text-white rounded-tl-none shadow-md'
                }`}
              >
                {chat.image && (
                  <div className="mb-3">
                    <img
                      src={chat.image}
                      alt="Plant upload"
                      className="max-w-full h-64 rounded-lg shadow-sm object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {chat.message_type === 'bot' ? (
                  <div
                    className="text-sm md:text-base leading-relaxed prose prose-sm prose-invert prose-p:my-1 max-w-full"
                    dangerouslySetInnerHTML={{ __html: marked(chat.message || '') }}  
                  />
                ) : (
                  <p className="text-sm md:text-base leading-relaxed">{chat.message || ''}</p> 
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${chat.message_type === 'user' ? 'text-right mr-2' : 'ml-2'}`}>
                {chat.message_type === 'user' ? t.you : t.cropcare}
                {chat.created_at && (
                  <span className="ml-2">
                    {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
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
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                  aria-label={t.removeImage}
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
              onKeyPress={handleKeyPress}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent outline-none text-[#6faa61] placeholder-[#6faa61]"
              disabled={isLoading}
              dir={['ur', 'ar'].includes(currentLanguage) ? 'rtl' : 'ltr'}
            />
            <button
              onClick={triggerFileInput}
              disabled={isLoading}
              className="ml-2 bg-green-50 rounded-full p-2 text-[#6faa61] hover:bg-green-100 transition-colors disabled:opacity-50"
              title={t.uploadImageTitle}
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
              disabled={(!message.trim() && !image) || isLoading}
              className={`ml-2 rounded-full p-2 text-white transition-colors ${
                (message.trim() || image) && !isLoading
                  ? 'bg-[#6faa61] hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
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