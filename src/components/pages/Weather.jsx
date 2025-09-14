'use client'
import { useState, useEffect, useCallback } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, ChevronDown, ChevronUp, AlertTriangle, MapPin, Loader, Search, Globe } from 'lucide-react';

// Language data for all major Indian languages
const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    translations: {
      // Header and main title
      appTitle: 'Farm Weather Assistant',
      locationPlaceholder: 'Enter city name (e.g., Paris, Tokyo, Cairo)',
      currentLocation: 'Current Location',
      
      // Current weather section
      currentConditions: 'Current Conditions',
      today: 'Today',
      humidity: 'Humidity',
      wind: 'Wind',
      condition: 'Condition',
      
      // Forecast section
      weeklyForecast: '7-Day Forecast',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
      
      // Days of week
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
      
      // Farming insights
      farmingInsights: 'Farming Insights',
      recommendedActions: 'Recommended Actions:',
      weatherAlerts: 'Weather Alerts',
      noRecommendations: 'No recommendations available at the moment.',
      
      // Priority levels
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      
      // Footer
      weatherDataProvider: 'Weather data provided by Open-Meteo API',
      aiPowered: 'Farming insights powered by Gemini AI',
      lastUpdated: 'Last updated',
      
      // Loading and error states
      loadingWeather: 'Loading weather forecast...',
      locationNotFound: 'No locations found matching your search. Please try a different query.',
      weatherDataError: 'Failed to fetch weather data',
      farmingAdviceError: 'Failed to generate farming recommendations',
      
      // Weather conditions
      clear: 'clear sky',
      mainlyClear: 'mainly clear',
      partlyCloudy: 'partly cloudy',
      overcast: 'overcast',
      fog: 'fog',
      drizzle: 'drizzle',
      rain: 'rain',
      snow: 'snow',
      thunderstorm: 'thunderstorm',
      
      // Months
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    translations: {
      appTitle: 'कृषि मौसम सहायक',
      locationPlaceholder: 'शहर का नाम दर्ज करें (जैसे, दिल्ली, मुंबई, कोलकाता)',
      currentLocation: 'वर्तमान स्थान',
      
      currentConditions: 'वर्तमान मौसम',
      today: 'आज',
      humidity: 'आर्द्रता',
      wind: 'हवा',
      condition: 'स्थिति',
      
      weeklyForecast: '7-दिन का पूर्वानुमान',
      showDetails: 'विवरण दिखाएं',
      hideDetails: 'विवरण छुपाएं',
      
      mon: 'सोम',
      tue: 'मंगल',
      wed: 'बुध',
      thu: 'गुरु',
      fri: 'शुक्र',
      sat: 'शनि',
      sun: 'रवि',
      
      farmingInsights: 'कृषि सुझाव',
      recommendedActions: 'सुझाए गए कार्य:',
      weatherAlerts: 'मौसम चेतावनी',
      noRecommendations: 'फिलहाल कोई सुझाव उपलब्ध नहीं है।',
      
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      
      weatherDataProvider: 'मौसम डेटा Open-Meteo API द्वारा प्रदान किया गया',
      aiPowered: 'कृषि सुझाव Gemini AI द्वारा संचालित',
      lastUpdated: 'अंतिम अपडेट',
      
      loadingWeather: 'मौसम पूर्वानुमान लोड हो रहा है...',
      locationNotFound: 'आपकी खोज से मेल खाने वाला कोई स्थान नहीं मिला। कृपया दूसरी खोज करें।',
      weatherDataError: 'मौसम डेटा प्राप्त करने में असफल',
      farmingAdviceError: 'कृषि सुझाव उत्पन्न करने में असफल',
      
      clear: 'साफ आसमान',
      mainlyClear: 'मुख्यतः साफ',
      partlyCloudy: 'आंशिक बादल',
      overcast: 'घना बादल',
      fog: 'कोहरा',
      drizzle: 'बूंदाबांदी',
      rain: 'बारिश',
      snow: 'बर्फ',
      thunderstorm: 'तूफान',
      
      january: 'जनवरी',
      february: 'फरवरी',
      march: 'मार्च',
      april: 'अप्रैल',
      may: 'मई',
      june: 'जून',
      july: 'जुलाई',
      august: 'अगस्त',
      september: 'सितंबर',
      october: 'अक्टूबर',
      november: 'नवंबर',
      december: 'दिसंबर'
    }
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    translations: {
      appTitle: 'কৃষি আবহাওয়া সহায়ক',
      locationPlaceholder: 'শহরের নাম লিখুন (যেমন, ঢাকা, কলকাতা, চট্টগ্রাম)',
      currentLocation: 'বর্তমান অবস্থান',
      
      currentConditions: 'বর্তমান আবহাওয়া',
      today: 'আজ',
      humidity: 'আর্দ্রতা',
      wind: 'বাতাস',
      condition: 'অবস্থা',
      
      weeklyForecast: '৭-দিনের পূর্বাভাস',
      showDetails: 'বিস্তারিত দেখান',
      hideDetails: 'বিস্তারিত লুকান',
      
      mon: 'সোম',
      tue: 'মঙ্গল',
      wed: 'বুধ',
      thu: 'বৃহঃ',
      fri: 'শুক্র',
      sat: 'শনি',
      sun: 'রবি',
      
      farmingInsights: 'কৃষি পরামর্শ',
      recommendedActions: 'প্রস্তাবিত কাজ:',
      weatherAlerts: 'আবহাওয়া সতর্কতা',
      noRecommendations: 'এই মুহূর্তে কোন পরামর্শ উপলব্ধ নেই।',
      
      high: 'উচ্চ',
      medium: 'মধ্যম',
      low: 'নিম্ন',
      
      weatherDataProvider: 'আবহাওয়া তথ্য Open-Meteo API দ্বারা প্রদত্ত',
      aiPowered: 'কৃষি পরামর্শ Gemini AI দ্বারা চালিত',
      lastUpdated: 'শেষ আপডেট',
      
      loadingWeather: 'আবহাওয়ার পূর্বাভাস লোড হচ্ছে...',
      locationNotFound: 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো স্থান পাওয়া যায়নি। দয়া করে ভিন্ন অনুসন্ধান চেষ্টা করুন।',
      weatherDataError: 'আবহাওয়া তথ্য আনতে ব্যর্থ',
      farmingAdviceError: 'কৃষি পরামর্শ তৈরি করতে ব্যর্থ',
      
      clear: 'পরিষ্কার আকাশ',
      mainlyClear: 'প্রধানত পরিষ্কার',
      partlyCloudy: 'আংশিক মেঘলা',
      overcast: 'ঘন মেঘ',
      fog: 'কুয়াশা',
      drizzle: 'গুঁড়ি গুঁড়ি বৃষ্টি',
      rain: 'বৃষ্টি',
      snow: 'তুষার',
      thunderstorm: 'বজ্রঝড়'
    }
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    translations: {
      appTitle: 'వ్యవసాయ వాతావరణ సహాయకుడు',
      locationPlaceholder: 'నగర పేరు నమోదు చేయండి (ఉదా., హైదరాబాద్, విశాఖపట్నం, విజయవాడ)',
      currentLocation: 'ప్రస్తుత స్థానం',
      
      currentConditions: 'ప్రస్తుత వాతావరణం',
      today: 'ఈరోజు',
      humidity: 'తేమ',
      wind: 'గాలి',
      condition: 'స్థితి',
      
      weeklyForecast: '7-రోజుల అంచనా',
      showDetails: 'వివరాలు చూపించు',
      hideDetails: 'వివరాలు దాచు',
      
      mon: 'సోమ',
      tue: 'మంగళ',
      wed: 'బుధ',
      thu: 'గురు',
      fri: 'శుక్ర',
      sat: 'శని',
      sun: 'ఆది',
      
      farmingInsights: 'వ్యవసాయ సలహాలు',
      recommendedActions: 'సూచించిన చర్యలు:',
      weatherAlerts: 'వాతావరణ హెచ్చరికలు',
      noRecommendations: 'ప్రస్తుతం ఎటువంటి సలహాలు అందుబాటులో లేవు.',
      
      high: 'అధిక',
      medium: 'మధ్యమ',
      low: 'తక్కువ',
      
      weatherDataProvider: 'వాతావరణ డేటా Open-Meteo API ద్వారా అందించబడింది',
      aiPowered: 'వ్యవసాయ సలహాలు Gemini AI ద్వారా శక్తివంతం',
      lastUpdated: 'చివరిగా నవీకరించబడింది',
      
      loadingWeather: 'వాతావరణ అంచనా లోడ్ అవుతోంది...',
      locationNotFound: 'మీ అన్వేషణకు సరిపోలే స్థానాలు కనుగొనబడలేదు. దయచేసి వేరే అన్వేషణ ప్రయత్నించండి.',
      weatherDataError: 'వాతావరణ డేటా పొందడంలో విఫలమైంది',
      farmingAdviceError: 'వ్యవసాయ సలహాలు రూపొందించడంలో విఫలమైంది'
    }
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    translations: {
      appTitle: 'शेती हवामान सहाय्यक',
      locationPlaceholder: 'शहराचे नाव टाका (उदा., मुंबई, पुणे, नागपूर)',
      currentLocation: 'सध्याचे ठिकाण',
      
      currentConditions: 'सध्याचे हवामान',
      today: 'आज',
      humidity: 'ओलावा',
      wind: 'वारा',
      condition: 'स्थिती',
      
      weeklyForecast: '७-दिवसांचा अंदाज',
      showDetails: 'तपशील दाखवा',
      hideDetails: 'तपशील लपवा',
      
      mon: 'सोम',
      tue: 'मंगळ',
      wed: 'बुध',
      thu: 'गुरु',
      fri: 'शुक्र',
      sat: 'शनि',
      sun: 'रवि',
      
      farmingInsights: 'शेती सल्ले',
      recommendedActions: 'सुचविलेल्या कृती:',
      weatherAlerts: 'हवामान इशारे',
      noRecommendations: 'सध्या कोणतेही सल्ले उपलब्ध नाहीत.',
      
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कमी',
      
      weatherDataProvider: 'हवामान डेटा Open-Meteo API द्वारे प्रदान केला गेला',
      aiPowered: 'शेती सल्ले Gemini AI द्वारे चालविले',
      lastUpdated: 'शेवटचे अद्यतन'
    }
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    translations: {
      appTitle: 'விவசாய வானிலை உதவியாளர்',
      locationPlaceholder: 'நகர பெயரை உள்ளிடவும் (எ.கா., சென்னை, கோவை, மதுரை)',
      currentLocation: 'தற்போதைய இடம்',
      
      currentConditions: 'தற்போதைய வானிலை',
      today: 'இன்று',
      humidity: 'ஈரப்பதம்',
      wind: 'காற்று',
      condition: 'நிலை',
      
      weeklyForecast: '7-நாள் முன்னறிவிப்பு',
      showDetails: 'விவரங்களைக் காட்டு',
      hideDetails: 'விவரங்களை மறை',
      
      mon: 'திங்',
      tue: 'செவ்',
      wed: 'புத',
      thu: 'வியா',
      fri: 'வெள்',
      sat: 'சனி',
      sun: 'ஞாய்',
      
      farmingInsights: 'விவசாய ஆலோசனைகள்',
      recommendedActions: 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்:',
      weatherAlerts: 'வானிலை எச்சரிக்கைகள்',
      noRecommendations: 'தற்போது எந்த பரிந்துரைகளும் கிடைக்கவில்லை.',
      
      high: 'அதிக',
      medium: 'நடுத்தர',
      low: 'குறைவு',
      
      weatherDataProvider: 'வானிலை தரவு Open-Meteo API மூலம் வழங்கப்படுகிறது',
      aiPowered: 'விவசாய ஆலோசனைகள் Gemini AI மூலம் இயக்கப்படுகின்றன',
      lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது'
    }
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    translations: {
      appTitle: 'કૃષિ હવામાન સહાયક',
      locationPlaceholder: 'શહેરનું નામ દાખલ કરો (જેમ કે, અમદાવાદ, સુરત, વડોદરા)',
      currentLocation: 'વર્તમાન સ્થાન',
      
      currentConditions: 'વર્તમાન હવામાન',
      today: 'આજ',
      humidity: 'ભેજ',
      wind: 'પવન',
      condition: 'સ્થિતિ',
      
      weeklyForecast: '૭-દિવસની આગાહી',
      showDetails: 'વિગતો બતાવો',
      hideDetails: 'વિગતો છુપાવો',
      
      mon: 'સોમ',
      tue: 'મંગળ',
      wed: 'બુધ',
      thu: 'ગુરુ',
      fri: 'શુક્ર',
      sat: 'શનિ',
      sun: 'રવિ',
      
      farmingInsights: 'કૃષિ સલાહ',
      recommendedActions: 'સૂચવેલી ક્રિયાઓ:',
      weatherAlerts: 'હવામાન ચેતવણીઓ',
      noRecommendations: 'અત્યારે કોઈ સલાહ ઉપલબ્ધ નથી.',
      
      high: 'ઉચ્ચ',
      medium: 'મધ્યમ',
      low: 'નીચું',
      
      weatherDataProvider: 'હવામાન ડેટા Open-Meteo API દ્વારા પૂરો પાડવામાં આવ્યો',
      aiPowered: 'કૃષિ સલાહ Gemini AI દ્વારા સંચાલિત',
      lastUpdated: 'છેલ્લે અપડેટ કર્યું'
    }
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    translations: {
      appTitle: 'ಕೃಷಿ ಹವಾಮಾನ ಸಹಾಯಕ',
      locationPlaceholder: 'ನಗರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಉದಾ., ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಹುಬ್ಬಳ್ಳಿ)',
      currentLocation: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ',
      
      currentConditions: 'ಪ್ರಸ್ತುತ ಹವಾಮಾನ',
      today: 'ಇಂದು',
      humidity: 'ತೇವಾಂಶ',
      wind: 'ಗಾಳಿ',
      condition: 'ಸ್ಥಿತಿ',
      
      weeklyForecast: '೭-ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
      showDetails: 'ವಿವರಗಳನ್ನು ತೋರಿಸು',
      hideDetails: 'ವಿವರಗಳನ್ನು ಮರೆಮಾಡು',
      
      mon: 'ಸೋಮ',
      tue: 'ಮಂಗಳ',
      wed: 'ಬುಧ',
      thu: 'ಗುರು',
      fri: 'ಶುಕ್ರ',
      sat: 'ಶನಿ',
      sun: 'ರವಿ',
      
      farmingInsights: 'ಕೃಷಿ ಸಲಹೆಗಳು',
      recommendedActions: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಿಯೆಗಳು:',
      weatherAlerts: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
      noRecommendations: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಶಿಫಾರಸುಗಳು ಲಭ್ಯವಿಲ್ಲ.',
      
      high: 'ಹೆಚ್ಚು',
      medium: 'ಮಧ್ಯಮ',
      low: 'ಕಡಿಮೆ',
      
      weatherDataProvider: 'ಹವಾಮಾನ ಡೇಟಾ Open-Meteo API ನಿಂದ ಒದಗಿಸಲಾಗಿದೆ',
      aiPowered: 'ಕೃಷಿ ಸಲಹೆಗಳು Gemini AI ನಿಂದ ನಡೆಸಲಾಗುತ್ತದೆ',
      lastUpdated: 'ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ'
    }
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    translations: {
      appTitle: 'കർഷക കാലാവസ്ഥാ സഹായി',
      locationPlaceholder: 'നഗരത്തിന്റെ പേര് നൽകുക (ഉദാ., കൊച്ചി, തിരുവനന്തപുരം, കോഴിക്കോട്)',
      currentLocation: 'നിലവിലെ സ്ഥാനം',
      
      currentConditions: 'നിലവിലെ കാലാവസ്ഥ',
      today: 'ഇന്ന്',
      humidity: 'ആർദ്രത',
      wind: 'കാറ്റ്',
      condition: 'അവസ്ഥ',
      
      weeklyForecast: '7-ദിവസത്തെ പ്രവചനം',
      showDetails: 'വിശദാംശങ്ങൾ കാണിക്കുക',
      hideDetails: 'വിശദാംശങ്ങൾ മറയ്ക്കുക',
      
      mon: 'തിങ്കൾ',
      tue: 'ചൊവ്വ',
      wed: 'ബുധൻ',
      thu: 'വ്യാഴം',
      fri: 'വെള്ളി',
      sat: 'ശനി',
      sun: 'ഞായർ',
      
      farmingInsights: 'കർഷക ഉപദേശങ്ങൾ',
      recommendedActions: 'ശുപാർശ ചെയ്യുന്ന പ്രവർത്തനങ്ങൾ:',
      weatherAlerts: 'കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ',
      noRecommendations: 'നിലവിൽ ഒരു ശുപാർശകളും ലഭ്യമല്ല.',
      
      high: 'ഉയർന്ന',
      medium: 'ഇടത്തരം',
      low: 'കുറഞ്ഞ',
      
      weatherDataProvider: 'കാലാവസ്ഥാ ഡാറ്റ Open-Meteo API യിൽ നിന്ന് ലഭ്യമാക്കിയത്',
      aiPowered: 'കർഷക ഉപദേശങ്ങൾ Gemini AI യാൽ നിയന്ത്രിക്കപ്പെടുന്നു',
      lastUpdated: 'അവസാനം അപ്‌ഡേറ്റ് ചെയ്തത്'
    }
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    translations: {
      appTitle: 'ਖੇਤੀ ਮੌਸਮ ਸਹਾਇਕ',
      locationPlaceholder: 'ਸ਼ਹਿਰ ਦਾ ਨਾਮ ਦਾਖਲ ਕਰੋ (ਜਿਵੇਂ, ਚੰਡੀਗੜ੍ਹ, ਅੰਮ੍ਰਿਤਸਰ, ਲੁਧਿਆਣਾ)',
      currentLocation: 'ਮੌਜੂਦਾ ਸਥਿਤੀ',
      
      currentConditions: 'ਮੌਜੂਦਾ ਮੌਸਮ',
      today: 'ਅੱਜ',
      humidity: 'ਨਮੀ',
      wind: 'ਹਵਾ',
      condition: 'ਹਾਲਤ',
      
      weeklyForecast: '7-ਦਿਨਾਂ ਦਾ ਅੰਦਾਜ਼ਾ',
      showDetails: 'ਵੇਰਵੇ ਵਿਖਾਓ',
      hideDetails: 'ਵੇਰਵੇ ਲੁਕਾਓ',
      
      mon: 'ਸੋਮ',
      tue: 'ਮੰਗਲ',
      wed: 'ਬੁੱਧ',
      thu: 'ਵੀਰ',
      fri: 'ਸ਼ੁੱਕਰ',
      sat: 'ਸ਼ਨੀ',
      sun: 'ਐਤ',
      
      farmingInsights: 'ਖੇਤੀ ਸਲਾਹ',
      recommendedActions: 'ਸਿਫਾਰਸ਼ ਕੀਤੇ ਕਾਰਜ:',
      weatherAlerts: 'ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ',
      noRecommendations: 'ਫਿਲਹਾਲ ਕੋਈ ਸਿਫਾਰਸ਼ਾਂ ਉਪਲਬਧ ਨਹੀਂ ਹਨ।',
      
      high: 'ਉੱਚ',
      medium: 'ਮੱਧਮ',
      low: 'ਘੱਟ',
      
      weatherDataProvider: 'ਮੌਸਮ ਡੇਟਾ Open-Meteo API ਦੁਆਰਾ ਪ੍ਰਦਾਨ ਕੀਤਾ ਗਿਆ',
      aiPowered: 'ਖੇਤੀ ਸਲਾਹ Gemini AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ',
      lastUpdated: 'ਆਖਰੀ ਵਾਰ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ'
    }
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    translations: {
      appTitle: 'କୃଷି ପାଣିପାଗ ସହାଯକ',
      locationPlaceholder: 'ସହରର ନାମ ଲେଖନ୍ତୁ (ଯଥା, ଭୁବନେଶ୍ୱର, କଟକ, ବେରହାମ୍ପୁର)',
      currentLocation: 'ବର୍ତ୍ତମାନର ସ୍ଥାନ',
      
      currentConditions: 'ବର୍ତ୍ତମାନର ପାଣିପାଗ',
      today: 'ଆଜି',
      humidity: 'ଆର୍ଦ୍ରତା',
      wind: 'ପବନ',
      condition: 'ଅବସ୍ଥା',
      
      weeklyForecast: '୭-ଦିନର ପୂର୍ବାନୁମାନ',
      showDetails: 'ବିବରଣୀ ଦେଖାଅ',
      hideDetails: 'ବିବରଣୀ ଲୁଚାଅ',
      
      mon: 'ସୋମ',
      tue: 'ମଙ୍ଗଳ',
      wed: 'ବୁଧ',
      thu: 'ଗୁରୁ',
      fri: 'ଶୁକ୍ର',
      sat: 'ଶନି',
      sun: 'ରବି',
      
      farmingInsights: 'କୃଷି ପରାମର୍ଶ',
      recommendedActions: 'ପରାମର୍ଶିତ କାର୍ଯ୍ୟଗୁଡ଼ିକ:',
      weatherAlerts: 'ପାଣିପାଗ ସତର୍କତା',
      noRecommendations: 'ବର୍ତ୍ତମାନ କୌଣସି ପରାମର୍ଶ ଉପଲବ୍ଧ ନାହିଁ।',
      
      high: 'ଉଚ୍ଚ',
      medium: 'ମଧ୍ୟମ',
      low: 'କମ୍',
      
      weatherDataProvider: 'ପାଣିପାଗ ତଥ୍ୟ Open-Meteo API ଦ୍ୱାରା ପ୍ରଦାନ କରାଯାଇଛି',
      aiPowered: 'କୃଷି ପରାମର୍ଶ Gemini AI ଦ୍ୱାରା ଚାଳିତ',
      lastUpdated: 'ଶେଷରେ ଅପଡେଟ୍ ହୋଇଛି'
    }
  },
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    translations: {
      appTitle: 'কৃষি বতৰ সহায়ক',
      locationPlaceholder: 'চহৰৰ নাম লিখক (যেনে, গুৱাহাটী, ডিব্ৰুগড়, শিলচৰ)',
      currentLocation: 'বৰ্তমানৰ স্থান',
      
      currentConditions: 'বৰ্তমানৰ বতৰ',
      today: 'আজি',
      humidity: 'আৰ্দ্ৰতা',
      wind: 'বতাহ',
      condition: 'অৱস্থা',
      
      weeklyForecast: '৭-দিনৰ পূৰ্বানুমান',
      showDetails: 'বিৱৰণ দেখুৱাওক',
      hideDetails: 'বিৱৰণ লুকুৱাওক',
      
      mon: 'সোম',
      tue: 'মঙ্গল',
      wed: 'বুধ',
      thu: 'বৃহস্পতি',
      fri: 'শুক্ৰ',
      sat: 'শনি',
      sun: 'ৰবি',
      
      farmingInsights: 'কৃষি পৰামৰ্শ',
      recommendedActions: 'পৰামৰ্শিত কাৰ্য্যসমূহ:',
      weatherAlerts: 'বতৰ সতৰ্কবাণী',
      noRecommendations: 'বৰ্তমান কোনো পৰামৰ্শ উপলব্ধ নাই।',
      
      high: 'উচ্চ',
      medium: 'মধ্যম',
      low: 'কম',
      
      weatherDataProvider: 'বতৰ তথ্য Open-Meteo API দ্বাৰা প্ৰদান কৰা হৈছে',
      aiPowered: 'কৃষি পৰামৰ্শ Gemini AI দ্বাৰা চালিত',
      lastUpdated: 'শেষত আপডেট কৰা হৈছে'
    }
  }
};

// Default data for initial load and fallback
const defaultWeatherData = {
  current: {
    temp: 24,
    humidity: 65,
    wind_speed: 12,
    weather: [{ main: 'Clouds', description: 'scattered clouds' }],
    dt: new Date().getTime() / 1000
  },
  daily: Array(7).fill(null).map((_, i) => ({
    dt: new Date().getTime() / 1000 + 86400 * i,
    temp: { min: 18, max: 26 },
    weather: [{ main: 'Clouds', description: 'scattered clouds' }],
    humidity: 65,
    wind_speed: 10,
    pop: 0.1
  }))
};

const defaultFarmingAdvice = {
  summary: "Loading agricultural insights based on weather forecast...",
  recommendations: [],
  alerts: []
};

// Weather icon mapping
const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'Clear':
      return <Sun size={24} className="text-yellow-500" />;
    case 'Clouds':
      return <Cloud size={24} className="text-gray-500" />;
    case 'Rain':
    case 'Drizzle':
      return <CloudRain size={24} className="text-blue-500" />;
    case 'Thunderstorm':
      return <CloudRain size={24} className="text-purple-500" />;
    case 'Snow':
      return <Cloud size={24} className="text-blue-200" />;
    case 'Fog':
      return <Cloud size={24} className="text-gray-400" />;
    default:
      return <Cloud size={24} className="text-gray-500" />;
  }
};

// Format timestamp to day name
const formatDay = (timestamp, lang) => {
  const date = new Date(timestamp * 1000);
  const dayIndex = date.getDay();
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return languages[lang].translations[days[dayIndex]];
};

// Format month names
const formatMonth = (timestamp, lang) => {
  const date = new Date(timestamp * 1000);
  const monthIndex = date.getMonth();
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                  'july', 'august', 'september', 'october', 'november', 'december'];
  return languages[lang].translations[months[monthIndex]];
};

// Priority badge component
const PriorityBadge = ({ priority, lang }) => {
  const getColor = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getColor()}`}>
      {languages[lang].translations[priority] || priority}
    </span>
  );
};

// Language selector component
const LanguageSelector = ({ currentLang, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
      >
        <Globe size={18} className="mr-2" />
        <span className="font-medium">{languages[currentLang].nativeName}</span>
        <ChevronDown size={16} className="ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                currentLang === lang.code ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <div className="font-medium">{lang.nativeName}</div>
              <div className="text-sm text-gray-500">{lang.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Weather() {
  const [currentLang, setCurrentLang] = useState('en');
  const [expandedSection, setExpandedSection] = useState('all');
  const [weatherData, setWeatherData] = useState(defaultWeatherData);
  const [farmingAdvice, setFarmingAdvice] = useState(defaultFarmingAdvice);
  const [location, setLocation] = useState({ lat: 23.0225, lon: 72.5714, name: 'Ahmedabad, Gujarat, IN' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  
  // Get current translations
  const t = languages[currentLang].translations;
  
  // Fetch farming advice function with useCallback
  const fetchFarmingAdvice = useCallback(async (weatherData) => {
    try {
      const response = await fetch('/api/farming-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weatherData,
          language: languages[currentLang].nativeName,
          location: location.name
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate farming advice' }));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the JSON with better error handling
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing farming advice response:', parseError);
        console.log('Raw response:', text);
        throw new Error('Failed to parse farming advice data');
      }
      
      setFarmingAdvice(data);
    } catch (err) {
      console.error('Error fetching farming advice:', err);
      setError(`Failed to generate farming recommendations: ${err.message}`);
      // Use default farming advice instead of showing nothing
      setFarmingAdvice(defaultFarmingAdvice);
    }
  }, [currentLang, location.name]);
  
  // Load default weather data on mount
  useEffect(() => {
    if (location) {
      loadWeatherData(location.lat, location.lon);
    }
  }, []);
  
  // Refetch farming advice when language changes
  useEffect(() => {
    // Only refetch if we have weather data and the component is not in initial loading state
    if (weatherData && weatherData !== defaultWeatherData && !isLoading) {
      // Set loading state for farming advice only
      setFarmingAdvice(prev => ({
        ...prev,
        summary: t.loadingWeather
      }));
      
      // Refetch farming advice with new language
      fetchFarmingAdvice(weatherData);
    }
  }, [currentLang, weatherData, isLoading, fetchFarmingAdvice, t.loadingWeather]);
  
  // Fetch weather data using Open-Meteo API
  const loadWeatherData = async (lat, lon) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!weatherResponse.ok) {
        throw new Error(t.weatherDataError);
      }
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      await fetchFarmingAdvice(weatherData);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(t.weatherDataError);
      setWeatherData(defaultWeatherData);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search for location
  const searchLocation = async (e) => {
    if (e) e.preventDefault();
    
    if (!locationInput.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock location search - in real implementation, this would call your geocoding API
      const mockResults = [
        {
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lon: 77.2090 + (Math.random() - 0.5) * 0.1,
          name: locationInput,
          state: 'India',
          country: 'IN'
        }
      ];
      
      if (mockResults.length === 0) {
        setError(t.locationNotFound);
        setIsLoading(false);
        return;
      }
      
      const firstResult = mockResults[0];
      const newLocation = {
        lat: firstResult.lat,
        lon: firstResult.lon,
        name: firstResult.name + (firstResult.state ? `, ${firstResult.state}` : '') + (firstResult.country ? `, ${firstResult.country}` : '')
      };
      
      setLocation(newLocation);
      await loadWeatherData(newLocation.lat, newLocation.lon);
      
    } catch (err) {
      console.error('Error searching for location:', err);
      setError(`Failed to search for location: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection('all');
    } else {
      setExpandedSection(section);
    }
  };
  
  const styles = {
    primary: "#6faa61",
    primaryHover: "#0d6a4a",
    secondary: "#20B297",
  };

  return (
    <div className="max-w-4xl mx-auto p-6" style={{ fontFamily: "'Inter', sans-serif" }} dir={currentLang === 'ar' || currentLang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader size={48} className="animate-spin mx-auto mb-4" style={{ color: styles.primary }} />
            <p className="text-lg font-medium">{t.loadingWeather}</p>
          </div>
        </div>
      )}
      
      <header className="mb-8">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold" style={{ color: styles.primary }}>{t.appTitle}</h1>
            <LanguageSelector currentLang={currentLang} onLanguageChange={setCurrentLang} />
          </div>
          
          {/* Location Search */}
          <div className="w-full mb-4">
            <div className="flex">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchLocation(e);
                  }
                }}
              />
              <button 
                onClick={searchLocation}
                className="px-4 py-2 rounded-r-md text-white flex items-center justify-center"
                style={{ backgroundColor: styles.primary }}
                disabled={isLoading || !locationInput.trim()}
              >
                <Search size={20} />
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <AlertTriangle size={24} className="text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Current Location Display */}
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin size={18} className="mr-1" />
            <p className="font-medium">{location.name}</p>
          </div>
        </div>
      </header>
      
      {/* Current Weather */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: `4px solid ${styles.primary}` }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">{t.currentConditions}</h2>
            <p className="text-gray-500">{t.today}, {new Date().getDate()} {formatMonth(new Date().getTime() / 1000, currentLang)}</p>
          </div>
          <div className="flex items-center">
            {getWeatherIcon(weatherData.current.weather[0].main)}
            <span className="text-4xl font-bold ml-2">{Math.round(weatherData.current.temp)}°C</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <Droplets size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">{t.humidity}</p>
              <p className="font-medium">{weatherData.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center">
            <Wind size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">{t.wind}</p>
              <p className="font-medium">{weatherData.current.wind_speed} km/h</p>
            </div>
          </div>
          <div className="flex items-center">
            <CloudRain size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">{t.condition}</p>
              <p className="font-medium capitalize">{weatherData.current.weather[0].description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Forecast */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t.weeklyForecast}</h2>
          <button 
            onClick={() => toggleSection('forecast')}
            className="flex items-center text-sm font-medium"
            style={{ color: styles.primary }}
          >
            {expandedSection !== 'forecast' ? t.showDetails : t.hideDetails}
            {expandedSection !== 'forecast' ? <ChevronDown size={16} className="ml-1" /> : <ChevronUp size={16} className="ml-1" />}
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weatherData.daily.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium">{formatDay(day.dt, currentLang)}</p>
              <div className="my-2">
                {getWeatherIcon(day.weather[0].main)}
              </div>
              <div className="flex justify-center items-center space-x-1 text-sm">
                <span className="text-red-500 font-medium">{Math.round(day.temp.max)}°</span>
                <span className="text-gray-400">/</span>
                <span className="text-blue-500 font-medium">{Math.round(day.temp.min)}°</span>
              </div>
              {expandedSection === 'forecast' && (
                <div className="mt-2 text-xs">
                  <p className="text-gray-500 capitalize">{day.weather[0].description}</p>
                  <p className="mt-1">
                    <span className="inline-flex items-center text-blue-500">
                      <Droplets size={12} className="mr-1" />{day.humidity}%
                    </span>
                  </p>
                  <p className="mt-1">
                    <span className="inline-flex items-center text-blue-500">
                      <CloudRain size={12} className="mr-1" />{Math.round(day.pop * 100)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Farm Advice Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderLeft: `4px solid ${styles.secondary}` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t.farmingInsights}</h2>
          <button 
            onClick={() => toggleSection('insights')}
            className="flex items-center text-sm font-medium"
            style={{ color: styles.primary }}
          >
            {expandedSection !== 'insights' ? t.showDetails : t.hideDetails}
            {expandedSection !== 'insights' ? <ChevronDown size={16} className="ml-1" /> : <ChevronUp size={16} className="ml-1" />}
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="italic text-gray-700">{farmingAdvice.summary}</p>
        </div>
        
        {(expandedSection === 'insights' || expandedSection === 'all') && (
          <>
            <h3 className="font-medium mb-3 text-gray-700">{t.recommendedActions}</h3>
            {farmingAdvice.recommendations && farmingAdvice.recommendations.length > 0 ? (
              <div className="space-y-4">
                {farmingAdvice.recommendations.map((item, index) => (
                  <div key={index} className="flex items-start p-3 border-l-4 bg-gray-50 rounded-r-md" style={{ borderColor: styles.primary }}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{item.day}</h4>
                        <PriorityBadge priority={item.priority} lang={currentLang} />
                      </div>
                      <p className="text-gray-700 text-sm">{item.advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">{t.noRecommendations}</p>
            )}
          </>
        )}
      </div>
      
      {/* Alerts Section */}
      {farmingAdvice.alerts && farmingAdvice.alerts.length > 0 && (
        <div className="bg-red-50 rounded-lg shadow-md p-6 mb-6 border border-red-200">
          <div className="flex items-center mb-4">
            <AlertTriangle size={24} className="text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-red-700">{t.weatherAlerts}</h2>
          </div>
          
          <div className="space-y-4">
            {farmingAdvice.alerts.map((alert, index) => (
              <div key={index} className="p-4 bg-white rounded-md shadow-sm">
                <h3 className="font-medium text-red-600 mb-1">{alert.title}</h3>
                <p className="text-gray-700">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{t.weatherDataProvider}</p>
        <p>{t.aiPowered}</p>
        <p>{t.lastUpdated}: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}