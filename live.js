  const agentStatuses = {
    en: { rejected: 'rejected', abstained: 'abstained' },
    te: { rejected: 'తిరస్కరించబడింది', abstained: 'నిర్ణయం నిలిపివేసింది' },
    hi: { rejected: 'अस्वीकार', abstained: 'निर्णय रोका' },
    ta: { rejected: 'நிராகரிக்கப்பட்டது', abstained: 'முடிவு தவிர்க்கப்பட்டது' },
    kn: { rejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ', abstained: 'ತೀರ್ಮಾನ ತಡೆಹಿಡಿಯಲಾಗಿದೆ' },
    ml: { rejected: 'നിരസിച്ചു', abstained: 'തീരുമാനം ഒഴിവാക്കി' }
  };
(() => {
  const input = document.getElementById('taskInput');
  const button = document.getElementById('verifyBtn');
  const output = document.getElementById('output');
  const empty = document.getElementById('empty');
  const stages = [...document.querySelectorAll('#pipeline .stage')];
  const menu = document.querySelector('.lang');
  if (!input || !button || !output || !menu) return;

  const localeCopy = {
    en: { live: 'LIVE EVIDENCE', side: 'SOURCE CHECKS · ONLINE', result: 'VERIFICATION RESULT', reason: 'WHY THIS DECISION', claims: 'CLAIM CHECKS', sources: 'RETRIEVED SOURCES', agents: 'AGENT TRACE', checks: 'CHECKS PERFORMED', confidence: 'EVIDENCE OVERLAP', sourceCount: 'sources', noSources: 'No sources were retrieved.', loading: 'Retrieving sources and verifying claims…', offline: 'Verification server is unavailable. Start it with python server.py.', localTool: 'Local arithmetic verifier', sourcePrefix: 'Evidence summary from', liveProvider: '● LIVE RETRIEVAL', modelProvider: '● LIVE RETRIEVAL + MODEL', sourceOnline: 'SOURCE RETRIEVAL · ONLINE', modelOnline: 'MODEL + SOURCE RETRIEVAL · ONLINE', sourceOffline: 'API SERVER · OFFLINE', supported: 'SUPPORTED', partial: 'PARTIALLY SUPPORTED', corrected: 'CORRECTED', verified: 'VERIFIED', unsafe: 'UNSAFE · BLOCKED', insufficient: 'INSUFFICIENT EVIDENCE', unsupported: 'UNSUPPORTED', conflict: 'CONFLICT', high: 'HIGH', medium: 'MEDIUM', low: 'LOW', toolAnswer: 'Independent calculation: {expression} = {expected}.', correctedAnswer: 'The submitted result is incorrect. Independent calculation gives {expression} = {expected}, not {claimed}.', toolReason: 'The expression was evaluated independently using exact Decimal arithmetic.', correctedReason: 'The execution verifier independently calculated the expression and found a mismatch.', blockedAnswer: 'Blocked by the safety gate. The input matched an unsafe instruction or credential-exposure pattern.', blockedReason: 'The input was treated as untrusted data. It was not sent to source retrieval or a model.', abstainAnswer: 'No reliable source evidence was retrieved, so the claim was not accepted.', abstainReason: 'The system abstains when evidence is unavailable or does not support the claim.', agentDone: 'complete', agentBlocked: 'blocked', agentUnavailable: 'unavailable', agentNotRun: 'not run', agentRejected: 'rejected', agentAbstained: 'abstained', sourceSupport: 'Lexical support', calculation: 'Exact calculation: {expression} = {expected}.', revision: 'Revision' },
    te: { live: 'ప్రత్యక్ష ఆధారాలు', side: 'మూల తనిఖీలు · ఆన్‌లైన్', result: 'ధృవీకరణ ఫలితం', reason: 'ఈ నిర్ణయానికి కారణం', claims: 'వాదన తనిఖీలు', sources: 'సేకరించిన ఆధారాలు', agents: 'ఏజెంట్ దశలు', checks: 'చేసిన తనిఖీలు', confidence: 'ఆధార పద సరిపోలిక', sourceCount: 'ఆధారాలు', noSources: 'ఆధారాలు సేకరించలేదు.', loading: 'ఆధారాలను సేకరించి వాదనలను తనిఖీ చేస్తోంది…', offline: 'ధృవీకరణ సర్వర్ అందుబాటులో లేదు. python server.py తో ప్రారంభించండి.', localTool: 'స్థానిక గణన తనిఖీ', sourcePrefix: 'ఆధార సారాంశం:', liveProvider: '● ప్రత్యక్ష ఆధార తనిఖీ', modelProvider: '● ప్రత్యక్ష ఆధారాలు + మోడల్', sourceOnline: 'ఆధార సేకరణ · ఆన్‌లైన్', modelOnline: 'మోడల్ + ఆధార సేకరణ · ఆన్‌లైన్', sourceOffline: 'API సర్వర్ · ఆఫ్‌లైన్', supported: 'ఆధారంతో మద్దతు ఉంది', partial: 'పాక్షిక మద్దతు', corrected: 'సరిచేయబడింది', verified: 'ధృవీకరించబడింది', unsafe: 'అసురక్షితం · నిరోధించబడింది', insufficient: 'తగిన ఆధారాలు లేవు', unsupported: 'ఆధారం లేదు', conflict: 'విరుద్ధత', high: 'అధికం', medium: 'మధ్యస్థం', low: 'తక్కువ', toolAnswer: 'స్వతంత్ర లెక్కింపు: {expression} = {expected}.', correctedAnswer: 'ఇచ్చిన ఫలితం తప్పు. స్వతంత్ర లెక్కింపు {expression} = {expected}; {claimed} కాదు.', toolReason: 'ఖచ్చితమైన Decimal గణనతో సమీకరణాన్ని స్వతంత్రంగా తనిఖీ చేశాం.', correctedReason: 'లెక్కింపు తనిఖీ ఇచ్చిన విలువకు స్వతంత్ర ఫలితం సరిపోలలేదని గుర్తించింది.', blockedAnswer: 'భద్రతా నియంత్రణ ఈ అభ్యర్థనను నిరోధించింది.', blockedReason: 'ఇన్‌పుట్‌ను నమ్మదగని డేటాగా పరిగణించి మూల శోధనకూ మోడల్‌కూ పంపలేదు.', abstainAnswer: 'నమ్మదగిన ఆధారాలు లభించలేదు; అందువల్ల వాదనను అంగీకరించలేదు.', abstainReason: 'ఆధారాలు లేనప్పుడు లేదా మద్దతివ్వనప్పుడు ఈ వ్యవస్థ నిర్ణయాన్ని నిలిపివేస్తుంది.', agentDone: 'పూర్తి', agentBlocked: 'నిరోధం', agentUnavailable: 'లభ్యం కాదు', agentNotRun: 'నడపలేదు', agentRejected: 'తిరస్కరించబడింది', agentAbstained: 'నిర్ణయం నిలిపివేసింది', sourceSupport: 'పద సరిపోలిక', calculation: 'ఖచ్చితమైన లెక్కింపు: {expression} = {expected}.', revision: 'సవరణ' },
    hi: { live: 'लाइव साक्ष्य', side: 'स्रोत जाँच · ऑनलाइन', result: 'सत्यापन परिणाम', reason: 'इस निर्णय का कारण', claims: 'दावा जाँच', sources: 'प्राप्त स्रोत', agents: 'एजेंट चरण', checks: 'की गई जाँच', confidence: 'साक्ष्य शब्द-मेल', sourceCount: 'स्रोत', noSources: 'कोई स्रोत नहीं मिला।', loading: 'स्रोत प्राप्त करके दावों की जाँच हो रही है…', offline: 'सत्यापन सर्वर उपलब्ध नहीं है। python server.py से शुरू करें।', localTool: 'स्थानीय गणना सत्यापक', sourcePrefix: 'साक्ष्य सारांश:', liveProvider: '● लाइव साक्ष्य जाँच', modelProvider: '● लाइव साक्ष्य + मॉडल', sourceOnline: 'स्रोत प्राप्ति · ऑनलाइन', modelOnline: 'मॉडल + स्रोत प्राप्ति · ऑनलाइन', sourceOffline: 'API सर्वर · ऑफ़लाइन', supported: 'समर्थित', partial: 'आंशिक समर्थन', corrected: 'सुधारा गया', verified: 'सत्यापित', unsafe: 'असुरक्षित · रोका गया', insufficient: 'अपर्याप्त साक्ष्य', unsupported: 'असमर्थित', conflict: 'विरोधाभास', high: 'उच्च', medium: 'मध्यम', low: 'कम', toolAnswer: 'स्वतंत्र गणना: {expression} = {expected}।', correctedAnswer: 'दिया गया परिणाम गलत है। स्वतंत्र गणना {expression} = {expected} देती है, {claimed} नहीं।', toolReason: 'सटीक Decimal गणना से समीकरण की स्वतंत्र जाँच की गई।', correctedReason: 'निष्पादन सत्यापक ने दिए गए मान और स्वतंत्र परिणाम में अंतर पाया।', blockedAnswer: 'सुरक्षा द्वार ने अनुरोध रोक दिया।', blockedReason: 'इनपुट को अविश्वसनीय डेटा मानकर स्रोत खोज या मॉडल को नहीं भेजा गया।', abstainAnswer: 'विश्वसनीय स्रोत साक्ष्य नहीं मिला, इसलिए दावा स्वीकार नहीं किया गया।', abstainReason: 'साक्ष्य उपलब्ध न होने या दावे का समर्थन न करने पर प्रणाली निर्णय रोकती है।', agentDone: 'पूरा', agentBlocked: 'रोका गया', agentUnavailable: 'अनुपलब्ध', agentNotRun: 'नहीं चला', agentRejected: 'अस्वीकार', agentAbstained: 'निर्णय रोका', sourceSupport: 'शब्द समर्थन', calculation: 'सटीक गणना: {expression} = {expected}।', revision: 'संशोधन' },
    ta: { live: 'நேரடி ஆதாரம்', side: 'மூலச் சரிபார்ப்பு · இணையத்தில்', result: 'சரிபார்ப்பு முடிவு', reason: 'இந்த முடிவுக்கான காரணம்', claims: 'கூற்றுச் சோதனைகள்', sources: 'பெறப்பட்ட ஆதாரங்கள்', agents: 'ஏஜென்ட் தடம்', checks: 'செய்த சோதனைகள்', confidence: 'ஆதாரச் சொல் பொருத்தம்', sourceCount: 'ஆதாரங்கள்', noSources: 'ஆதாரங்கள் கிடைக்கவில்லை.', loading: 'ஆதாரங்களைப் பெற்று கூற்றுகளைச் சரிபார்க்கிறது…', offline: 'சரிபார்ப்புச் சேவையகம் கிடைக்கவில்லை. python server.py மூலம் தொடங்கவும்.', localTool: 'உள்ளூர் கணக்கீட்டுச் சரிபார்ப்பாளர்', sourcePrefix: 'ஆதாரச் சுருக்கம்:', liveProvider: '● நேரடி ஆதாரச் சரிபார்ப்பு', modelProvider: '● நேரடி ஆதாரம் + மாதிரி', sourceOnline: 'ஆதாரப் பெறுதல் · இணையத்தில்', modelOnline: 'மாதிரி + ஆதாரப் பெறுதல் · இணையத்தில்', sourceOffline: 'API சேவையகம் · இணையமில்லை', supported: 'ஆதரிக்கப்படுகிறது', partial: 'பகுதி ஆதரவு', corrected: 'திருத்தப்பட்டது', verified: 'சரிபார்க்கப்பட்டது', unsafe: 'பாதுகாப்பற்றது · தடுக்கப்பட்டது', insufficient: 'போதிய ஆதாரம் இல்லை', unsupported: 'ஆதரிக்கப்படவில்லை', conflict: 'முரண்பாடு', high: 'அதிகம்', medium: 'நடுத்தரம்', low: 'குறைவு', toolAnswer: 'தனித்த கணக்கீடு: {expression} = {expected}.', correctedAnswer: 'சமர்ப்பித்த முடிவு தவறு. தனித்த கணக்கீடு {expression} = {expected}; {claimed} அல்ல.', toolReason: 'துல்லிய Decimal கணக்கீட்டால் சமன்பாடு தனியாகச் சரிபார்க்கப்பட்டது.', correctedReason: 'கணக்கீட்டுச் சரிபார்ப்பாளர் சமர்ப்பித்த மதிப்புக்கும் தனித்த முடிவுக்கும் முரண்பாட்டைக் கண்டது.', blockedAnswer: 'பாதுகாப்பு வாயில் கோரிக்கையைத் தடுத்தது.', blockedReason: 'உள்ளீடு நம்பகமற்ற தரவாகக் கருதப்பட்டது; மூலத் தேடலுக்கோ மாதிரிக்கோ அனுப்பப்படவில்லை.', abstainAnswer: 'நம்பகமான ஆதாரம் கிடைக்காததால் கூற்று ஏற்கப்படவில்லை.', abstainReason: 'ஆதாரம் இல்லாதபோது அல்லது கூற்றை ஆதரிக்காதபோது அமைப்பு முடிவைத் தவிர்க்கிறது.', agentDone: 'முடிந்தது', agentBlocked: 'தடுக்கப்பட்டது', agentUnavailable: 'கிடைக்கவில்லை', agentNotRun: 'இயக்கப்படவில்லை', sourceSupport: 'சொல் ஆதரவு', calculation: 'துல்லியக் கணக்கீடு: {expression} = {expected}.', revision: 'திருத்தம்' },
    kn: { live: 'ನೇರ ಸಾಕ್ಷ್ಯ', side: 'ಮೂಲ ಪರಿಶೀಲನೆ · ಆನ್‌ಲೈನ್', result: 'ಪರಿಶೀಲನಾ ಫಲಿತಾಂಶ', reason: 'ಈ ತೀರ್ಮಾನಕ್ಕೆ ಕಾರಣ', claims: 'ಹೇಳಿಕೆ ಪರಿಶೀಲನೆ', sources: 'ಪಡೆದ ಮೂಲಗಳು', agents: 'ಏಜೆಂಟ್ ಹಾದಿ', checks: 'ಮಾಡಿದ ಪರಿಶೀಲನೆಗಳು', confidence: 'ಸಾಕ್ಷ್ಯ ಪದ ಹೊಂದಾಣಿಕೆ', sourceCount: 'ಮೂಲಗಳು', noSources: 'ಯಾವುದೇ ಮೂಲಗಳು ಸಿಗಲಿಲ್ಲ.', loading: 'ಮೂಲಗಳನ್ನು ಪಡೆದು ಹೇಳಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…', offline: 'ಪರಿಶೀಲನಾ ಸರ್ವರ್ ಲಭ್ಯವಿಲ್ಲ. python server.py ಮೂಲಕ ಪ್ರಾರಂಭಿಸಿ.', localTool: 'ಸ್ಥಳೀಯ ಗಣಿತ ಪರಿಶೀಲಕ', sourcePrefix: 'ಸಾಕ್ಷ್ಯ ಸಾರಾಂಶ:', liveProvider: '● ನೇರ ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲನೆ', modelProvider: '● ನೇರ ಸಾಕ್ಷ್ಯ + ಮಾದರಿ', sourceOnline: 'ಮೂಲ ಪಡೆಯುವಿಕೆ · ಆನ್‌ಲೈನ್', modelOnline: 'ಮಾದರಿ + ಮೂಲ ಪಡೆಯುವಿಕೆ · ಆನ್‌ಲೈನ್', sourceOffline: 'API ಸರ್ವರ್ · ಆಫ್‌ಲೈನ್', supported: 'ಬೆಂಬಲಿತ', partial: 'ಭಾಗಶಃ ಬೆಂಬಲಿತ', corrected: 'ತಿದ್ದಲಾಗಿದೆ', verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ', unsafe: 'ಅಸುರಕ್ಷಿತ · ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ', insufficient: 'ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯವಿಲ್ಲ', unsupported: 'ಬೆಂಬಲವಿಲ್ಲ', conflict: 'ವಿರೋಧಾಭಾಸ', high: 'ಹೆಚ್ಚು', medium: 'ಮಧ್ಯಮ', low: 'ಕಡಿಮೆ', toolAnswer: 'ಸ್ವತಂತ್ರ ಲೆಕ್ಕಾಚಾರ: {expression} = {expected}.', correctedAnswer: 'ಸಲ್ಲಿಸಿದ ಫಲಿತಾಂಶ ತಪ್ಪಾಗಿದೆ. ಸ್ವತಂತ್ರ ಲೆಕ್ಕಾಚಾರ {expression} = {expected}; {claimed} ಅಲ್ಲ.', toolReason: 'ನಿಖರ Decimal ಲೆಕ್ಕಾಚಾರದಿಂದ ಸಮೀಕರಣವನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.', correctedReason: 'ಲೆಕ್ಕ ಪರಿಶೀಲಕವು ಸಲ್ಲಿಸಿದ ಮೌಲ್ಯ ಮತ್ತು ಸ್ವತಂತ್ರ ಫಲಿತಾಂಶದ ವ್ಯತ್ಯಾಸವನ್ನು ಕಂಡಿದೆ.', blockedAnswer: 'ಸುರಕ್ಷತಾ ದ್ವಾರವು ವಿನಂತಿಯನ್ನು ತಡೆದಿದೆ.', blockedReason: 'ಇನ್‌ಪುಟ್ ಅನ್ನು ನಂಬಲಾಗದ ಡೇಟಾ ಎಂದು ಪರಿಗಣಿಸಿ ಮೂಲ ಹುಡುಕಾಟ ಅಥವಾ ಮಾದರಿಗೆ ಕಳುಹಿಸಲಿಲ್ಲ.', abstainAnswer: 'ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲ ಸಾಕ್ಷ್ಯ ಸಿಗದ ಕಾರಣ ಹೇಳಿಕೆಯನ್ನು ಸ್ವೀಕರಿಸಲಿಲ್ಲ.', abstainReason: 'ಸಾಕ್ಷ್ಯವಿಲ್ಲದಾಗ ಅಥವಾ ಹೇಳಿಕೆಗೆ ಬೆಂಬಲವಿಲ್ಲದಾಗ ವ್ಯವಸ್ಥೆ ನಿರ್ಧಾರವನ್ನು ತಡೆಹಿಡಿಯುತ್ತದೆ.', agentDone: 'ಪೂರ್ಣ', agentBlocked: 'ತಡೆಹಿಡಿಯಲಾಗಿದೆ', agentUnavailable: 'ಲಭ್ಯವಿಲ್ಲ', agentNotRun: 'ಚಲಾಯಿಸಿಲ್ಲ', sourceSupport: 'ಸಾಕ್ಷ್ಯ ಪದ ಹೊಂದಾಣಿಕೆ', calculation: 'ನಿಖರ ಲೆಕ್ಕಾಚಾರ: {expression} = {expected}.', revision: 'ತಿದ್ದುಪಡಿ' },
    ml: { live: 'തത്സമയ തെളിവ്', side: 'ഉറവിട പരിശോധന · ഓൺലൈൻ', result: 'പരിശോധനാ ഫലം', reason: 'ഈ തീരുമാനത്തിന്റെ കാരണം', claims: 'അവകാശവാദ പരിശോധനകൾ', sources: 'ലഭിച്ച ഉറവിടങ്ങൾ', agents: 'ഏജന്റ് ഘട്ടങ്ങൾ', checks: 'നടത്തിയ പരിശോധനകൾ', confidence: 'തെളിവ് പദ പൊരുത്തം', sourceCount: 'ഉറവിടങ്ങൾ', noSources: 'ഉറവിടങ്ങൾ ലഭിച്ചില്ല.', loading: 'ഉറവിടങ്ങൾ ശേഖരിച്ച് അവകാശവാദങ്ങൾ പരിശോധിക്കുന്നു…', offline: 'പരിശോധനാ സെർവർ ലഭ്യമല്ല. python server.py ഉപയോഗിച്ച് ആരംഭിക്കുക.', localTool: 'പ്രാദേശിക കണക്കുകൂട്ടൽ പരിശോധന', sourcePrefix: 'തെളിവ് സംഗ്രഹം:', liveProvider: '● തത്സമയ തെളിവ് പരിശോധന', modelProvider: '● തത്സമയ തെളിവ് + മോഡൽ', sourceOnline: 'ഉറവിട ശേഖരണം · ഓൺലൈൻ', modelOnline: 'മോഡൽ + ഉറവിട ശേഖരണം · ഓൺലൈൻ', sourceOffline: 'API സെർവർ · ഓഫ്‌ലൈൻ', supported: 'പിന്തുണയ്ക്കുന്നു', partial: 'ഭാഗിക പിന്തുണ', corrected: 'തിരുത്തി', verified: 'പരിശോധിച്ചു', unsafe: 'സുരക്ഷിതമല്ല · തടഞ്ഞു', insufficient: 'മതിയായ തെളിവില്ല', unsupported: 'പിന്തുണയില്ല', conflict: 'വൈരുധ്യം', high: 'ഉയർന്നത്', medium: 'ഇടത്തരം', low: 'കുറവ്', toolAnswer: 'സ്വതന്ത്ര കണക്കുകൂട്ടൽ: {expression} = {expected}.', correctedAnswer: 'നൽകിയ ഫലം തെറ്റാണ്. സ്വതന്ത്ര കണക്കുകൂട്ടൽ {expression} = {expected}; {claimed} അല്ല.', toolReason: 'കൃത്യമായ Decimal കണക്കുകൂട്ടൽ ഉപയോഗിച്ച് സമവാക്യം സ്വതന്ത്രമായി പരിശോധിച്ചു.', correctedReason: 'കണക്കു പരിശോധന നൽകിയ മൂല്യവും സ്വതന്ത്ര ഫലവും തമ്മിലുള്ള പൊരുത്തക്കേട് കണ്ടെത്തി.', blockedAnswer: 'സുരക്ഷാ കവാടം അഭ്യർത്ഥന തടഞ്ഞു.', blockedReason: 'ഇൻപുട്ട് വിശ്വസനീയമല്ലാത്ത ഡാറ്റയായി കണക്കാക്കി ഉറവിട തിരച്ചിലിലേക്കോ മോഡലിലേക്കോ അയച്ചില്ല.', abstainAnswer: 'വിശ്വസനീയമായ ഉറവിട തെളിവ് ലഭിക്കാത്തതിനാൽ അവകാശവാദം അംഗീകരിച്ചില്ല.', abstainReason: 'തെളിവില്ലാത്തപ്പോഴോ അവകാശവാദത്തെ പിന്തുണയ്ക്കാത്തപ്പോഴോ സംവിധാനം തീരുമാനം ഒഴിവാക്കുന്നു.', agentDone: 'പൂർത്തിയായി', agentBlocked: 'തടഞ്ഞു', agentUnavailable: 'ലഭ്യമല്ല', agentNotRun: 'പ്രവർത്തിപ്പിച്ചില്ല', sourceSupport: 'തെളിവ് പദ പൊരുത്തം', calculation: 'കൃത്യമായ കണക്കുകൂട്ടൽ: {expression} = {expected}.', revision: 'തിരുത്തൽ' }
  };
  const roles = {
    en: ['Planner', 'Researcher', 'Reasoner', 'Claim Extractor', 'Execution Verifier', 'Independent Verifier', 'Adversarial Critic', 'Safety Gate', 'Decision Gate'],
    te: ['ప్రణాళికకర్త', 'పరిశోధకుడు', 'తార్కిక విశ్లేషకుడు', 'వాదనల విభజకుడు', 'లెక్కింపు ధృవీకర్త', 'స్వతంత్ర ధృవీకర్త', 'విమర్శకుడు', 'భద్రతా నియంత్రణ', 'నిర్ణయ నియంత్రణ'],
    hi: ['योजनाकार', 'शोधकर्ता', 'तर्ककर्ता', 'दावा निकालने वाला', 'निष्पादन सत्यापक', 'स्वतंत्र सत्यापक', 'आलोचक', 'सुरक्षा द्वार', 'निर्णय द्वार'],
    ta: ['திட்டமிடுபவர்', 'ஆய்வாளர்', 'காரணமறிபவர்', 'கூற்று பிரிப்பவர்', 'கணக்கீட்டுச் சரிபார்ப்பாளர்', 'தனிச் சரிபார்ப்பாளர்', 'விமர்சகர்', 'பாதுகாப்பு வாயில்', 'முடிவு வாயில்'],
    kn: ['ಯೋಜಕ', 'ಸಂಶೋಧಕ', 'ತಾರ್ಕಿಕ ವಿಶ್ಲೇಷಕ', 'ಹೇಳಿಕೆ ವಿಭಜಕ', 'ಕಾರ್ಯಗತಗೊಳಿಸುವಿಕೆ ಪರಿಶೀಲಕ', 'ಸ್ವತಂತ್ರ ಪರಿಶೀಲಕ', 'ವಿಮರ್ಶಕ', 'ಸುರಕ್ಷತಾ ದ್ವಾರ', 'ತೀರ್ಮಾನ ದ್ವಾರ'],
    ml: ['ആസൂത്രകൻ', 'ഗവേഷകൻ', 'യുക്തിവാദി', 'അവകാശവാദ വേർതിരിക്കൽ', 'നടപ്പാക്കൽ പരിശോധന', 'സ്വതന്ത്ര പരിശോധന', 'നിരൂപകൻ', 'സുരക്ഷാ കവാടം', 'തീരുമാന കവാടം']
  };
  const decisionKey = { 'SUPPORTED': 'supported', 'PARTIALLY SUPPORTED': 'partial', 'CORRECTED': 'corrected', 'VERIFIED': 'verified', 'UNSAFE': 'unsafe', 'INSUFFICIENT EVIDENCE': 'insufficient' };
  const actionLabels = {
    en: { ACCEPT: 'ACCEPT', CORRECT: 'CORRECT', REQUEST_MORE_EVIDENCE: 'REQUEST MORE EVIDENCE', REJECT: 'REJECT', ABSTAIN: 'ABSTAIN', gate: 'FINAL DECISION', failed: 'FAILED CHECKS', affected: 'AFFECTED CLAIMS', none: 'None' },
    te: { ACCEPT: 'అంగీకరించు', CORRECT: 'సరిచేయి', REQUEST_MORE_EVIDENCE: 'మరిన్ని ఆధారాలు కోరండి', REJECT: 'తిరస్కరించు', ABSTAIN: 'నిర్ణయం నిలిపివేయి', gate: 'తుది నిర్ణయం', failed: 'విఫలమైన తనిఖీలు', affected: 'ప్రభావిత వాదనలు', none: 'ఏవీ లేవు' },
    hi: { ACCEPT: 'स्वीकार', CORRECT: 'सुधारें', REQUEST_MORE_EVIDENCE: 'अधिक साक्ष्य माँगें', REJECT: 'अस्वीकार', ABSTAIN: 'निर्णय रोकें', gate: 'अंतिम निर्णय', failed: 'विफल जाँच', affected: 'प्रभावित दावे', none: 'कोई नहीं' },
    ta: { ACCEPT: 'ஏற்கவும்', CORRECT: 'திருத்தவும்', REQUEST_MORE_EVIDENCE: 'மேலும் ஆதாரம் கேட்கவும்', REJECT: 'நிராகரிக்கவும்', ABSTAIN: 'முடிவைத் தவிர்க்கவும்', gate: 'இறுதி முடிவு', failed: 'தோல்வியடைந்த சோதனைகள்', affected: 'பாதிக்கப்பட்ட கூற்றுகள்', none: 'எதுவுமில்லை' },
    kn: { ACCEPT: 'ಸ್ವೀಕರಿಸಿ', CORRECT: 'ತಿದ್ದಿ', REQUEST_MORE_EVIDENCE: 'ಹೆಚ್ಚಿನ ಸಾಕ್ಷ್ಯ ಕೇಳಿ', REJECT: 'ತಿರಸ್ಕರಿಸಿ', ABSTAIN: 'ತೀರ್ಮಾನ ತಡೆಹಿಡಿಯಿರಿ', gate: 'ಅಂತಿಮ ತೀರ್ಮಾನ', failed: 'ವಿಫಲ ಪರಿಶೀಲನೆಗಳು', affected: 'ಪರಿಣಾಮಿತ ಹೇಳಿಕೆಗಳು', none: 'ಯಾವುದೂ ಇಲ್ಲ' },
    ml: { ACCEPT: 'അംഗീകരിക്കുക', CORRECT: 'തിരുത്തുക', REQUEST_MORE_EVIDENCE: 'കൂടുതൽ തെളിവ് ചോദിക്കുക', REJECT: 'നിരസിക്കുക', ABSTAIN: 'തീരുമാനം ഒഴിവാക്കുക', gate: 'അന്തിമ തീരുമാനം', failed: 'പരാജയപ്പെട്ട പരിശോധനകൾ', affected: 'ബാധിച്ച അവകാശവാദങ്ങൾ', none: 'ഒന്നുമില്ല' }
  };
  const sessionLabel = { en: 'RUNS THIS SESSION', te: 'ఈ సెషన్‌లో తనిఖీలు', hi: 'इस सत्र में जाँच', ta: 'இந்த அமர்வில் சோதனைகள்', kn: 'ಈ ಅವಧಿಯ ಪರಿಶೀಲನೆಗಳು', ml: 'ഈ സെഷനിലെ പരിശോധനകൾ' };
  const averageLabel = { en: 'SESSION AVERAGE', te: 'సెషన్ సగటు', hi: 'सत्र का औसत', ta: 'அமர்வு சராசரி', kn: 'ಅವಧಿಯ ಸರಾಸರಿ', ml: 'സെഷൻ ശരാശരി' };
  const overviewStatus = {
    en: ['STATUS: OPERATIONAL', 'PROVIDER: LIVE WIKIPEDIA RETRIEVAL', 'TRUST BOUNDARY: ENFORCED'],
    te: ['స్థితి: పనిచేస్తోంది', 'సేవ: ప్రత్యక్ష వికీపీడియా మూలాలు', 'నమ్మక పరిమితి: అమలులో ఉంది'],
    hi: ['स्थिति: चालू', 'प्रदाता: लाइव विकिपीडिया स्रोत', 'विश्वास सीमा: लागू'],
    ta: ['நிலை: செயல்பாட்டில்', 'வழங்குநர்: நேரடி விக்கிப்பீடியா ஆதாரம்', 'நம்பிக்கை எல்லை: அமலில் உள்ளது'],
    kn: ['ಸ್ಥಿತಿ: ಕಾರ್ಯನಿರತ', 'ಪೂರೈಕೆದಾರ: ನೇರ ವಿಕಿಪೀಡಿಯಾ ಮೂಲಗಳು', 'ವಿಶ್ವಾಸ ಗಡಿ: ಜಾರಿಯಲ್ಲಿದೆ'],
    ml: ['നില: പ്രവർത്തനക്ഷമം', 'ദാതാവ്: തത്സമയ വിക്കിപീഡിയ ഉറവിടങ്ങൾ', 'വിശ്വാസ പരിധി: നടപ്പിലാക്കി']
  };
  const extraLabels = {
    en: { sourceTag: 'SOURCE', retrieval: 'Live Wikipedia retrieval', claims: 'Claim extraction', overlap: 'Independent lexical evidence-overlap check', failClosed: 'Fail-closed if no evidence', arithmetic: 'Exact Decimal arithmetic', compare: 'Submitted value compared with computed value', injection: 'Prompt-injection pattern check', noAction: 'No external actions performed', plannerArithmetic: 'Classified the task as arithmetic.', researcherArithmetic: 'The expression is checked with a deterministic local tool.', criticArithmetic: 'Compared the submitted value against the independent result.', noLlm: 'Summarized retrieved evidence; no language model is configured.', fallback: 'Generated a cited response from retrieved evidence.', unsupportedWording: 'Checked for unsupported wording and low evidence overlap.', retrieved: count => `Retrieved ${count} source(s) from Wikipedia.`, unavailable: 'No source results were available.', decisionStatuses: { corrected: 'CORRECTED', verified: 'VERIFIED', supported: 'SUPPORTED', 'partially supported': 'PARTIALLY SUPPORTED', 'insufficient evidence': 'INSUFFICIENT EVIDENCE', unsafe: 'UNSAFE', rejected: 'REJECTED', abstained: 'ABSTAINED' } },
    te: { sourceTag: 'ఆధారం', retrieval: 'వికీపీడియా నుంచి ప్రత్యక్ష ఆధార సేకరణ', claims: 'వాదనల విభజన', overlap: 'స్వతంత్ర పద-ఆధార సరిపోలిక తనిఖీ', failClosed: 'ఆధారం లేకుంటే అంగీకరించవద్దు', arithmetic: 'ఖచ్చితమైన Decimal గణితం', compare: 'ఇచ్చిన విలువను లెక్కించిన విలువతో పోల్చడం', injection: 'ప్రాంప్ట్ ఇన్‌జెక్షన్ నమూనా తనిఖీ', noAction: 'బాహ్య చర్యలు చేయలేదు', plannerArithmetic: 'పనిని గణనగా గుర్తించింది.', researcherArithmetic: 'సమీకరణాన్ని స్థానిక ఖచ్చిత గణనతో తనిఖీ చేస్తుంది.', criticArithmetic: 'ఇచ్చిన ఫలితాన్ని స్వతంత్ర ఫలితంతో పోల్చింది.', noLlm: 'సేకరించిన ఆధారాన్ని సారాంశం చేసింది; భాషా మోడల్ అమర్చలేదు.', fallback: 'సేకరించిన ఆధారాల నుంచి మూలాన్ని సూచించే సమాధానం రూపొందించింది.', unsupportedWording: 'ఆధారం లేని పదజాలం, తక్కువ సరిపోలిక కోసం తనిఖీ చేసింది.', retrieved: count => `వికీపీడియా నుంచి ${count} ఆధారాలు సేకరించింది.`, unavailable: 'మూలాలు లభించలేదు.', decisionStatuses: { corrected: 'సరిచేయబడింది', verified: 'ధృవీకరించబడింది', supported: 'మద్దతు ఉంది', 'partially supported': 'పాక్షిక మద్దతు', 'insufficient evidence': 'తగిన ఆధారాలు లేవు', unsafe: 'అసురక్షితం' } },
    hi: { sourceTag: 'स्रोत', retrieval: 'विकिपीडिया से लाइव साक्ष्य', claims: 'दावा निष्कर्षण', overlap: 'स्वतंत्र शब्द-साक्ष्य मिलान जाँच', failClosed: 'साक्ष्य न हो तो स्वीकार न करें', arithmetic: 'सटीक Decimal गणना', compare: 'दिए गए मान की गणना से तुलना', injection: 'प्रॉम्प्ट इंजेक्शन पैटर्न जाँच', noAction: 'कोई बाहरी कार्रवाई नहीं की गई', plannerArithmetic: 'कार्य को गणना के रूप में वर्गीकृत किया।', researcherArithmetic: 'समीकरण की स्थानीय नियतात्मक जाँच होती है।', criticArithmetic: 'दिए गए परिणाम की स्वतंत्र परिणाम से तुलना की।', noLlm: 'प्राप्त साक्ष्य का सारांश बनाया; कोई भाषा मॉडल कॉन्फ़िगर नहीं है।', fallback: 'प्राप्त साक्ष्य से उद्धृत उत्तर बनाया।', unsupportedWording: 'असमर्थित भाषा और कम साक्ष्य-मेल की जाँच की।', retrieved: count => `विकिपीडिया से ${count} स्रोत मिले।`, unavailable: 'कोई स्रोत परिणाम उपलब्ध नहीं था।', decisionStatuses: { corrected: 'सुधारा गया', verified: 'सत्यापित', supported: 'समर्थित', 'partially supported': 'आंशिक समर्थन', 'insufficient evidence': 'अपर्याप्त साक्ष्य', unsafe: 'असुरक्षित' } },
    ta: { sourceTag: 'ஆதாரம்', retrieval: 'விக்கிப்பீடியா நேரடி ஆதாரப் பெறுதல்', claims: 'கூற்று பிரித்தல்', overlap: 'தனித்த சொல்-ஆதாரப் பொருத்தச் சோதனை', failClosed: 'ஆதாரம் இல்லையெனில் ஏற்க வேண்டாம்', arithmetic: 'துல்லிய Decimal கணக்கீடு', compare: 'சமர்ப்பித்த மதிப்பை கணக்கீட்டுடன் ஒப்பிடுதல்', injection: 'வழிமுறை ஊடுருவல் வடிவச் சோதனை', noAction: 'வெளிப்புறச் செயல்கள் எதுவும் செய்யப்படவில்லை', plannerArithmetic: 'பணியைக் கணக்கீடாக வகைப்படுத்தியது.', researcherArithmetic: 'சமன்பாடு உள்ளூர் துல்லியக் கருவியால் சரிபார்க்கப்பட்டது.', criticArithmetic: 'சமர்ப்பித்த முடிவைத் தனித்த முடிவுடன் ஒப்பிட்டது.', noLlm: 'பெறப்பட்ட ஆதாரத்தைச் சுருக்கியது; மொழி மாதிரி அமைக்கப்படவில்லை.', fallback: 'பெறப்பட்ட ஆதாரத்திலிருந்து மேற்கோளிட்ட பதிலை உருவாக்கியது.', unsupportedWording: 'ஆதாரமற்ற சொற்கள் மற்றும் குறைந்த பொருத்தத்தைச் சரிபார்த்தது.', retrieved: count => `விக்கிப்பீடியாவிலிருந்து ${count} ஆதாரங்கள் பெறப்பட்டன.`, unavailable: 'மூல முடிவுகள் கிடைக்கவில்லை.', decisionStatuses: { corrected: 'திருத்தப்பட்டது', verified: 'சரிபார்க்கப்பட்டது', supported: 'ஆதரிக்கப்படுகிறது', 'partially supported': 'பகுதி ஆதரவு', 'insufficient evidence': 'போதிய ஆதாரம் இல்லை', unsafe: 'பாதுகாப்பற்றது' } },
    kn: { sourceTag: 'ಮೂಲ', retrieval: 'ವಿಕಿಪೀಡಿಯಾದಿಂದ ನೇರ ಸಾಕ್ಷ್ಯ', claims: 'ಹೇಳಿಕೆ ವಿಭಜನೆ', overlap: 'ಸ್ವತಂತ್ರ ಪದ-ಸಾಕ್ಷ್ಯ ಹೊಂದಾಣಿಕೆ ಪರಿಶೀಲನೆ', failClosed: 'ಸಾಕ್ಷ್ಯವಿಲ್ಲದಿದ್ದರೆ ಸ್ವೀಕರಿಸಬೇಡಿ', arithmetic: 'ನಿಖರ Decimal ಲೆಕ್ಕಾಚಾರ', compare: 'ಸಲ್ಲಿಸಿದ ಮೌಲ್ಯವನ್ನು ಲೆಕ್ಕಿಸಿದ ಮೌಲ್ಯದೊಂದಿಗೆ ಹೋಲಿಕೆ', injection: 'ಪ್ರಾಂಪ್ಟ್ ಇಂಜೆಕ್ಷನ್ ಮಾದರಿ ಪರಿಶೀಲನೆ', noAction: 'ಬಾಹ್ಯ ಕ್ರಿಯೆಗಳನ್ನು ಮಾಡಿಲ್ಲ', plannerArithmetic: 'ಕಾರ್ಯವನ್ನು ಲೆಕ್ಕಾಚಾರವೆಂದು ವರ್ಗೀಕರಿಸಿದೆ.', researcherArithmetic: 'ಸಮೀಕರಣವನ್ನು ಸ್ಥಳೀಯ ನಿರ್ಧಿಷ್ಟ ಸಾಧನದಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.', criticArithmetic: 'ಸಲ್ಲಿಸಿದ ಫಲಿತಾಂಶವನ್ನು ಸ್ವತಂತ್ರ ಫಲಿತಾಂಶದೊಂದಿಗೆ ಹೋಲಿಸಿದೆ.', noLlm: 'ಪಡೆದ ಸಾಕ್ಷ್ಯವನ್ನು ಸಾರಾಂಶಗೊಳಿಸಿದೆ; ಭಾಷಾ ಮಾದರಿ ಸಂರಚಿಸಿಲ್ಲ.', fallback: 'ಪಡೆದ ಸಾಕ್ಷ್ಯದಿಂದ ಮೂಲ ಉಲ್ಲೇಖದ ಉತ್ತರ ರಚಿಸಿದೆ.', unsupportedWording: 'ಆಧಾರವಿಲ್ಲದ ಪದಬಳಕೆ ಮತ್ತು ಕಡಿಮೆ ಹೊಂದಾಣಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿದೆ.', retrieved: count => `ವಿಕಿಪೀಡಿಯಾದಿಂದ ${count} ಮೂಲಗಳನ್ನು ಪಡೆಯಲಾಗಿದೆ.`, unavailable: 'ಮೂಲ ಫಲಿತಾಂಶಗಳು ಲಭ್ಯವಿಲ್ಲ.', decisionStatuses: { corrected: 'ತಿದ್ದಲಾಗಿದೆ', verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ', supported: 'ಬೆಂಬಲಿತ', 'partially supported': 'ಭಾಗಶಃ ಬೆಂಬಲಿತ', 'insufficient evidence': 'ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯವಿಲ್ಲ', unsafe: 'ಅಸುರಕ್ಷಿತ' } },
    ml: { sourceTag: 'ഉറവിടം', retrieval: 'വിക്കിപീഡിയയിൽ നിന്നുള്ള തത്സമയ തെളിവ്', claims: 'അവകാശവാദ വേർതിരിക്കൽ', overlap: 'സ്വതന്ത്ര പദ-തെളിവ് പൊരുത്ത പരിശോധന', failClosed: 'തെളിവില്ലെങ്കിൽ അംഗീകരിക്കരുത്', arithmetic: 'കൃത്യമായ Decimal കണക്കുകൂട്ടൽ', compare: 'നൽകിയ മൂല്യവും കണക്കാക്കിയ മൂല്യവും താരതമ്യം ചെയ്തു', injection: 'പ്രോംപ്റ്റ് ഇൻജക്ഷൻ മാതൃക പരിശോധന', noAction: 'ബാഹ്യ പ്രവർത്തനങ്ങളൊന്നും നടത്തിയില്ല', plannerArithmetic: 'ടാസ്‌ക് കണക്കുകൂട്ടലായി വർഗ്ഗീകരിച്ചു.', researcherArithmetic: 'സമവാക്യം പ്രാദേശിക നിർണിത ഉപകരണം ഉപയോഗിച്ച് പരിശോധിക്കുന്നു.', criticArithmetic: 'നൽകിയ ഫലം സ്വതന്ത്ര ഫലവുമായി താരതമ്യം ചെയ്തു.', noLlm: 'ലഭിച്ച തെളിവ് സംഗ്രഹിച്ചു; ഭാഷാ മോഡൽ ക്രമീകരിച്ചിട്ടില്ല.', fallback: 'ലഭിച്ച തെളിവിൽ നിന്ന് ഉറവിടം ചേർത്ത ഉത്തരം തയ്യാറാക്കി.', unsupportedWording: 'പിന്തുണയില്ലാത്ത വാചകവും കുറഞ്ഞ പൊരുത്തവും പരിശോധിച്ചു.', retrieved: count => `വിക്കിപീഡിയയിൽ നിന്ന് ${count} ഉറവിടങ്ങൾ ലഭിച്ചു.`, unavailable: 'ഉറവിട ഫലങ്ങൾ ലഭ്യമല്ല.', decisionStatuses: { corrected: 'തിരുത്തി', verified: 'പരിശോധിച്ചു', supported: 'പിന്തുണയ്ക്കുന്നു', 'partially supported': 'ഭാഗിക പിന്തുണ', 'insufficient evidence': 'മതിയായ തെളിവില്ല', unsafe: 'സുരക്ഷിതമല്ല' } }
  };
  const checkKeys = { 'Live Wikipedia retrieval': 'retrieval', 'Claim extraction': 'claims', 'Independent lexical evidence-overlap check': 'overlap', 'Fail-closed if no evidence': 'failClosed', 'Exact Decimal arithmetic': 'arithmetic', 'Submitted value compared with computed value': 'compare', 'Prompt-injection pattern check': 'injection', 'No external actions performed': 'noAction' };
  let currentResult = null;
  let currentTask = '';
  let health = null;
  let attackCases = [];
  let evaluationReport = null;
  const runLabels = { en: 'RUN', te: 'అమలు చేయి', hi: 'चलाएँ', ta: 'இயக்கு', kn: 'ಚಲಾಯಿಸಿ', ml: 'പ്രവർത്തിപ്പിക്കുക' };
  const caseTitles = {
    en: { 'AX-07': 'Unsupported claim', 'AX-08': 'Ambiguous input', 'AX-09': 'Insufficient evidence', 'AX-10': 'Misleading evidence', 'AX-11': 'Calculation correction', 'AX-12': 'Invalid JSON parameter', 'AX-13': 'Invalid API/tool', 'AX-14': 'Correct calculation', 'AX-15': 'Supported claim' },
    te: { 'AX-07': 'ఆధారం లేని వాదన', 'AX-08': 'అస్పష్టమైన ఇన్‌పుట్', 'AX-09': 'తగిన ఆధారాలు లేవు', 'AX-10': 'తప్పుదారి పట్టించే ఆధారం', 'AX-11': 'లెక్కింపు దిద్దుబాటు', 'AX-12': 'చెల్లని JSON పరామితి', 'AX-13': 'చెల్లని API/టూల్', 'AX-14': 'సరైన లెక్కింపు', 'AX-15': 'ఆధారమున్న వాదన' },
    hi: { 'AX-07': 'असमर्थित दावा', 'AX-08': 'अस्पष्ट इनपुट', 'AX-09': 'अपर्याप्त साक्ष्य', 'AX-10': 'भ्रामक साक्ष्य', 'AX-11': 'गणना सुधार', 'AX-12': 'अमान्य JSON पैरामीटर', 'AX-13': 'अमान्य API/टूल', 'AX-14': 'सही गणना', 'AX-15': 'समर्थित दावा' },
    ta: { 'AX-07': 'ஆதரிக்கப்படாத கூற்று', 'AX-08': 'தெளிவற்ற உள்ளீடு', 'AX-09': 'போதிய ஆதாரம் இல்லை', 'AX-10': 'தவறாக வழிநடத்தும் ஆதாரம்', 'AX-11': 'கணக்கீட்டுத் திருத்தம்', 'AX-12': 'தவறான JSON அளவுரு', 'AX-13': 'தவறான API/கருவி', 'AX-14': 'சரியான கணக்கீடு', 'AX-15': 'ஆதரிக்கப்படும் கூற்று' },
    kn: { 'AX-07': 'ಆಧಾರವಿಲ್ಲದ ಹೇಳಿಕೆ', 'AX-08': 'ಅಸ್ಪಷ್ಟ ಇನ್‌ಪುಟ್', 'AX-09': 'ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯವಿಲ್ಲ', 'AX-10': 'ತಪ್ಪುದಾರಿಗೆಳೆಯುವ ಸಾಕ್ಷ್ಯ', 'AX-11': 'ಲೆಕ್ಕಾಚಾರ ತಿದ್ದುಪಡಿ', 'AX-12': 'ಅಮಾನ್ಯ JSON ನಿಯತಾಂಕ', 'AX-13': 'ಅಮಾನ್ಯ API/ಸಾಧನ', 'AX-14': 'ಸರಿಯಾದ ಲೆಕ್ಕಾಚಾರ', 'AX-15': 'ಬೆಂಬಲಿತ ಹೇಳಿಕೆ' },
    ml: { 'AX-07': 'പിന്തുണയില്ലാത്ത അവകാശവാദം', 'AX-08': 'അവ്യക്തമായ ഇൻപുട്ട്', 'AX-09': 'മതിയായ തെളിവില്ല', 'AX-10': 'തെറ്റിദ്ധരിപ്പിക്കുന്ന തെളിവ്', 'AX-11': 'കണക്കുകൂട്ടൽ തിരുത്തൽ', 'AX-12': 'അസാധുവായ JSON പരാമീറ്റർ', 'AX-13': 'അസാധുവായ API/ടൂൾ', 'AX-14': 'ശരിയായ കണക്കുകൂട്ടൽ', 'AX-15': 'പിന്തുണയുള്ള അവകാശവാദം' }
  };
  const metricTitles = {
    en: ['Verification Detection Rate', 'False Acceptance Rate', 'False Rejection Rate', 'Abstention Accuracy', 'Contradiction Detection Rate', 'Unsupported Claim Detection Rate', 'Prompt Injection Detection Rate', 'Unsafe Request Detection Rate', 'Execution Verification Accuracy', 'Self-Correction Success Rate', 'Verification Latency'],
    te: ['ధృవీకరణ గుర్తింపు రేటు', 'తప్పుడు అంగీకార రేటు', 'తప్పుడు తిరస్కరణ రేటు', 'నిర్ణయ నిలుపుదల ఖచ్చితత్వం', 'విరుద్ధత గుర్తింపు రేటు', 'ఆధారం లేని వాదన గుర్తింపు', 'ప్రాంప్ట్ ఇన్‌జెక్షన్ గుర్తింపు', 'ప్రమాదకర అభ్యర్థన గుర్తింపు', 'లెక్కింపు ధృవీకరణ ఖచ్చితత్వం', 'స్వీయ దిద్దుబాటు విజయం', 'ధృవీకరణ సమయం'],
    hi: ['सत्यापन पहचान दर', 'गलत स्वीकृति दर', 'गलत अस्वीकृति दर', 'निर्णय रोकने की सटीकता', 'विरोधाभास पहचान दर', 'असमर्थित दावा पहचान', 'प्रॉम्प्ट इंजेक्शन पहचान', 'असुरक्षित अनुरोध पहचान', 'निष्पादन सत्यापन सटीकता', 'स्व-सुधार सफलता दर', 'सत्यापन समय'],
    ta: ['சரிபார்ப்பு கண்டறிதல் விகிதம்', 'தவறான ஏற்றுக்கொள்ளல் விகிதம்', 'தவறான நிராகரிப்பு விகிதம்', 'முடிவைத் தவிர்த்தல் துல்லியம்', 'முரண்பாடு கண்டறிதல் விகிதம்', 'ஆதரிக்கப்படாத கூற்று கண்டறிதல்', 'வழிமுறை ஊடுருவல் கண்டறிதல்', 'பாதுகாப்பற்ற கோரிக்கை கண்டறிதல்', 'கணக்கீட்டுச் சரிபார்ப்பு துல்லியம்', 'சுயத்திருத்த வெற்றி விகிதம்', 'சரிபார்ப்பு நேரம்'],
    kn: ['ಪರಿಶೀಲನೆ ಪತ್ತೆ ಪ್ರಮಾಣ', 'ತಪ್ಪು ಸ್ವೀಕಾರ ಪ್ರಮಾಣ', 'ತಪ್ಪು ನಿರಾಕರಣೆ ಪ್ರಮಾಣ', 'ತೀರ್ಮಾನ ತಡೆ ನಿಖರತೆ', 'ವಿರೋಧಾಭಾಸ ಪತ್ತೆ ಪ್ರಮಾಣ', 'ಆಧಾರವಿಲ್ಲದ ಹೇಳಿಕೆ ಪತ್ತೆ', 'ಪ್ರಾಂಪ್ಟ್ ಇಂಜೆಕ್ಷನ್ ಪತ್ತೆ', 'ಅಸುರಕ್ಷಿತ ವಿನಂತಿ ಪತ್ತೆ', 'ಕಾರ್ಯಗತಗೊಳಿಸುವಿಕೆ ಪರಿಶೀಲನಾ ನಿಖರತೆ', 'ಸ್ವಯಂ ತಿದ್ದುಪಡಿ ಯಶಸ್ಸು', 'ಪರಿಶೀಲನಾ ಸಮಯ'],
    ml: ['പരിശോധന കണ്ടെത്തൽ നിരക്ക്', 'തെറ്റായ അംഗീകാര നിരക്ക്', 'തെറ്റായ നിരാകരണ നിരക്ക്', 'തീരുമാനം ഒഴിവാക്കൽ കൃത്യത', 'വൈരുധ്യ കണ്ടെത്തൽ നിരക്ക്', 'പിന്തുണയില്ലാത്ത അവകാശവാദ കണ്ടെത്തൽ', 'പ്രോംപ്റ്റ് ഇൻജക്ഷൻ കണ്ടെത്തൽ', 'സുരക്ഷിതമല്ലാത്ത അഭ്യർത്ഥന കണ്ടെത്തൽ', 'നടപ്പാക്കൽ പരിശോധനാ കൃത്യത', 'സ്വയം തിരുത്തൽ വിജയനിരക്ക്', 'പരിശോധന സമയം']
  };
  const proofLabels = {
    en: ['CLAIM', 'EVIDENCE', 'VERIFICATION', 'DECISION', 'LIVE PROOF INSPECTOR', 'No source evidence'],
    te: ['వాదన', 'ఆధారం', 'ధృవీకరణ', 'నిర్ణయం', 'ప్రత్యక్ష రుజువు పరిశీలన', 'మూల ఆధారం లేదు'],
    hi: ['दावा', 'साक्ष्य', 'सत्यापन', 'निर्णय', 'लाइव प्रमाण निरीक्षक', 'स्रोत साक्ष्य नहीं'],
    ta: ['கூற்று', 'ஆதாரம்', 'சரிபார்ப்பு', 'முடிவு', 'நேரடி சான்று ஆய்வாளர்', 'மூல ஆதாரம் இல்லை'],
    kn: ['ಹೇಳಿಕೆ', 'ಸಾಕ್ಷ್ಯ', 'ಪರಿಶೀಲನೆ', 'ತೀರ್ಮಾನ', 'ನೇರ ಪುರಾವೆ ಪರಿಶೀಲಕ', 'ಮೂಲ ಸಾಕ್ಷ್ಯವಿಲ್ಲ'],
    ml: ['അവകാശവാദം', 'തെളിവ്', 'പരിശോധന', 'തീരുമാനം', 'തത്സമയ തെളിവ് പരിശോധന', 'ഉറവിട തെളിവില്ല']
  };
  const auditLabels = {
    en: ['CLAIM', 'EVIDENCE', 'VERIFICATION'],
    te: ['వాదన', 'ఆధారం', 'ధృవీకరణ'],
    hi: ['दावा', 'साक्ष्य', 'सत्यापन'],
    ta: ['கூற்று', 'ஆதாரம்', 'சரிபார்ப்பு'],
    kn: ['ಹೇಳಿಕೆ', 'ಸಾಕ್ಷ್ಯ', 'ಪರಿಶೀಲನೆ'],
    ml: ['അവകാശവാദം', 'തെളിവ്', 'പരിശോധന']
  };

  function currentLanguage() {
    return localeCopy[menu.value] ? menu.value : 'en';
  }

  function textNode(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text ?? '';
    return node;
  }

  function format(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
  }

  function localizeResult(result, language) {
    const labels = localeCopy[language];
    if (result.mode === 'deterministic_tool' && result.calculation) {
      const values = result.calculation;
      result.answer = values.claimed !== null
        ? format(labels.correctedAnswer, values)
        : format(labels.toolAnswer, values);
      result.reason = values.claimed !== null ? labels.correctedReason : labels.toolReason;
      if (result.sources[0]) {
        result.sources[0].title = labels.localTool;
        result.sources[0].snippet = format(labels.calculation, values);
      }
    } else if (result.decision === 'UNSAFE') {
      result.answer = labels.blockedAnswer;
      result.reason = labels.blockedReason;
    } else if (result.decision === 'INSUFFICIENT EVIDENCE') {
      result.answer = labels.abstainAnswer;
      result.reason = labels.abstainReason;
    } else if (result.mode === 'live_retrieval' && !health?.model_configured && result.sources.length) {
      result.answer = `${labels.sourcePrefix} ${result.sources[0].title}: ${result.sources[0].snippet}`;
    }
    return result;
  }

  function renderResult(result, language) {
    const labels = localeCopy[language];
    const localized = localizeResult(structuredClone(result), language);
    const decisionClass = localized.decision === 'UNSAFE' ? 'conflict'
      : localized.decision === 'INSUFFICIENT EVIDENCE' || localized.decision === 'PARTIALLY SUPPORTED' ? 'warning'
      : 'verified';
    output.replaceChildren();
    output.append(textNode('div', 'card-head', ''));
    const header = output.lastElementChild;
    header.append(textNode('h3', '', labels.result));
    const finalAction = localized.gate?.action || localized.decision;
    header.append(textNode('span', `status ${decisionClass}`, actionLabels[language][finalAction] || labels[decisionKey[localized.decision]] || localized.decision));
    output.append(textNode('div', 'answer', localized.answer));

    const meta = textNode('div', 'statusline', '');
    const confidence = Math.round((localized.confidence || 0) * 100);
    meta.append(textNode('span', 'status', `${labels.confidence}: ${confidence}%`));
    meta.append(textNode('span', 'muted', `${localized.sources.length} ${labels.sourceCount}`));
    const mode = localized.mode === 'deterministic_tool' ? labels.localTool : localized.mode === 'model_plus_live_retrieval' ? labels.modelProvider : localized.mode === 'live_retrieval' ? labels.live : localized.mode;
    meta.append(textNode('span', 'muted', mode));
    output.append(meta);

    if (localized.claims.length) {
      output.append(textNode('h3', 'kicker live-heading', labels.claims));
      for (const claim of localized.claims) {
        const row = textNode('div', 'claim live-row', '');
        const content = textNode('div', '', '');
        content.append(textNode('b', '', claim.status === 'SUPPORTED' ? labels.supported : claim.status === 'PARTIAL' ? labels.partial : claim.status === 'CONFLICT' ? labels.conflict : claim.status === 'MISLEADING' ? labels.partial : labels.unsupported));
        content.append(textNode('span', '', ` — ${claim.text}`));
        content.append(textNode('small', '', `${labels.sourceSupport}: ${Math.round((claim.support || 0) * 100)}%`));
        row.append(content);
        row.append(textNode('span', `status ${claim.status === 'SUPPORTED' ? 'verified' : claim.status === 'CONFLICT' || claim.status === 'UNSUPPORTED' ? 'conflict' : 'warning'}`, `${Math.round((claim.support || 0) * 100)}%`));
        output.append(row);
      }
    }

    output.append(textNode('h3', 'kicker live-heading', labels.reason));
    output.append(textNode('div', 'live-copy', localized.reason));

    output.append(textNode('h3', 'kicker live-heading', labels.sources));
    if (!localized.sources.length) output.append(textNode('p', 'muted live-copy', labels.noSources));
    for (const source of localized.sources) {
      const row = textNode('div', 'claim live-row', '');
      const content = textNode('div', '', '');
      if (/^https?:\/\//i.test(source.url)) {
        const link = textNode('a', '', source.title);
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        content.append(link);
      } else {
        content.append(textNode('b', '', source.title));
      }
      content.append(textNode('small', '', source.snippet));
      row.append(content);
      if (source.kind === 'web') row.append(textNode('span', 'status verified', extraLabels[language].sourceTag));
      output.append(row);
    }

    output.append(textNode('h3', 'kicker live-heading', labels.agents));
    for (const agent of localized.agents) {
      const row = textNode('div', 'claim live-row', '');
      const content = textNode('div', '', '');
      const roleIndex = ['Planner', 'Researcher', 'Reasoner', 'Claim Extractor', 'Execution Verifier', 'Independent Verifier', 'Adversarial Critic', 'Safety Gate', 'Decision Gate'].indexOf(agent.name === 'Critic' ? 'Adversarial Critic' : agent.name);
      const role = roleIndex >= 0 ? roles[language][roleIndex] : agent.name;
      content.append(textNode('b', '', role));
      const diagnostic = extraLabels[language];
      let detail = agent.detail;
      if (agent.name === 'Decision Gate') detail = localized.reason;
      else if (agent.name === 'Planner' && result.mode === 'deterministic_tool') detail = diagnostic.plannerArithmetic;
      else if (agent.name === 'Researcher' && result.mode === 'deterministic_tool') detail = diagnostic.researcherArithmetic;
      else if (agent.name === 'Critic' || agent.name === 'Adversarial Critic') detail = result.mode === 'deterministic_tool' ? diagnostic.criticArithmetic : diagnostic.unsupportedWording;
      else if (agent.name === 'Execution Verifier' && localized.mode === 'deterministic_tool') detail = localized.sources[0]?.snippet || detail;
      else if (agent.name === 'Researcher' && agent.status === 'complete') detail = diagnostic.retrieved(localized.sources.length);
      else if (agent.name === 'Researcher' && agent.status === 'unavailable') detail = diagnostic.unavailable;
      else if (agent.name === 'Reasoner' && agent.detail.includes('no language model is configured')) detail = diagnostic.noLlm;
      else if (agent.name === 'Reasoner' && agent.status === 'complete') detail = diagnostic.fallback;
      else if (agent.name === 'Independent Verifier') detail = diagnostic.overlap;
      else if (agent.name === 'Claim Extractor') detail = `${diagnostic.claims}: ${localized.claims.length}`;
      else if (agent.name === 'Planner' && result.mode === 'live_retrieval') detail = `${diagnostic.retrieval}: ${currentTask}`;
      content.append(textNode('small', '', detail));
      row.append(content);
      const state = agent.status === 'complete' || agent.status === 'evidence summary' ? labels.agentDone
        : agent.status === 'blocked' ? labels.agentBlocked
        : agent.status === 'unavailable' ? labels.agentUnavailable
        : agent.status === 'not run' || agent.status === 'not needed' ? labels.agentNotRun
        : extraLabels[language].decisionStatuses[agent.status] || agentStatuses[language][agent.status] || agent.status;
      row.append(textNode('span', 'status', state));
      output.append(row);
    }

    output.append(textNode('h3', 'kicker live-heading', labels.checks));
    const checkList = textNode('ul', 'live-checks', '');
    for (const check of localized.checks) checkList.append(textNode('li', '', extraLabels[language][checkKeys[check]] || check));
    output.append(checkList);
    if (localized.gate) renderDecisionGate(localized.gate, language);
    output.classList.add('show');
    currentResult = result;
    renderProofGraph(localized, language);
    renderAudit(localized, language);
  }

  function renderDecisionGate(gate, language) {
    const labels = actionLabels[language];
    const panel = textNode('section', 'live-gate', '');
    const heading = textNode('h3', 'kicker live-heading', labels.gate);
    panel.append(heading);
    panel.append(textNode('strong', `status ${gate.action === 'REJECT' ? 'conflict' : gate.action === 'ABSTAIN' || gate.action === 'REQUEST_MORE_EVIDENCE' ? 'warning' : 'verified'}`, labels[gate.action] || gate.action));
    panel.append(textNode('p', 'live-copy', gate.reason));
    panel.append(textNode('small', 'muted', `${localeCopy[language].confidence}: ${Math.round((gate.confidence || 0) * 100)}%`));
    if (gate.clarification?.questions?.length) {
      panel.append(textNode('h4', '', 'CLARIFICATION NEEDED'));
      const questions = textNode('ul', 'live-checks', '');
      gate.clarification.questions.forEach(question => questions.append(textNode('li', '', question)));
      panel.append(questions);
    }
    panel.append(textNode('h4', '', labels.failed));
    const failures = textNode('ul', 'live-checks', '');
    (gate.failed_checks || []).forEach(check => failures.append(textNode('li', '', check)));
    if (!gate.failed_checks?.length) failures.append(textNode('li', '', labels.none));
    panel.append(failures);
    panel.append(textNode('h4', '', labels.affected));
    const affected = textNode('ul', 'live-checks', '');
    (gate.affected_claims || []).forEach(claim => affected.append(textNode('li', '', claim)));
    if (!gate.affected_claims?.length) affected.append(textNode('li', '', labels.none));
    panel.append(affected);
    output.append(panel);
  }

  function renderProofGraph(result, language) {
    const graph = document.querySelector('#proof .graph');
    if (!graph) return;
    const claims = result.claims || [];
    const source = result.sources?.[0];
    const firstClaim = claims[0] || (result.attack_case ? { text: result.attack_case.task || result.attack_case.title, reason: result.reason } : null);
    if (!firstClaim && !source) return;
    graph.replaceChildren();

    const steps = [
      { title: proofLabels[language][0], detail: firstClaim?.text || currentTask, className: 'cyan' },
      { title: proofLabels[language][1], detail: source?.title || proofLabels[language][5], className: '' },
      { title: proofLabels[language][2], detail: firstClaim?.reason || localeCopy[language].noSources, className: firstClaim?.status === 'SUPPORTED' ? 'green' : '' },
      { title: proofLabels[language][3], detail: actionLabels[language][result.gate?.action] || result.gate?.action || result.decision, className: result.gate?.action === 'ACCEPT' || result.gate?.action === 'CORRECT' ? 'green' : '' }
    ];
    const lefts = [28, 250, 490, 735];
    for (const [index, step] of steps.entries()) {
      if (index) {
        const line = textNode('div', 'line', '');
        line.style.left = `${lefts[index - 1] + 150}px`;
        line.style.top = '220px';
        line.style.width = `${lefts[index] - lefts[index - 1] - 150}px`;
        line.style.transform = 'none';
        graph.append(line);
      }
      const node = textNode('div', `node ${step.className}`, '');
      node.style.left = `${lefts[index]}px`;
      node.style.top = '190px';
      const title = textNode('span', '', step.title);
      const detail = textNode('b', '', step.detail);
      node.append(title, document.createElement('br'), detail);
      graph.append(node);
    }

    const inspector = document.querySelector('#proof .proof-grid > .card');
    if (inspector) {
      inspector.replaceChildren(textNode('h3', '', proofLabels[language][4]));

      claims.forEach((claim, index) => {
        const row = textNode('div', 'claim', '');
        row.append(textNode('b', '', `CLAIM ${index + 1} · ${claim.status || 'UNKNOWN'}`));
        row.append(textNode('small', '', claim.text || ''));
        const path = claim.verification_path || {};
        const feature = path.features || {};
        row.append(textNode('small', '', `Verification: ${claim.verification_method || 'unknown'} · term ${Math.round((feature.term_overlap || claim.support || 0) * 100)}% · predicate ${Math.round((feature.predicate_overlap || claim.predicate_support || 0) * 100)}% · anchors ${Math.round((feature.anchor_overlap || claim.anchor_support || 0) * 100)}%`));
        inspector.append(row);

        (claim.evidence || []).forEach((ref, evidenceIndex) => {
          const sourceItem = result.sources?.[ref.source_index];
          const evidenceRow = textNode('div', 'claim', '');
          evidenceRow.append(textNode('b', '', `EVIDENCE ${index + 1}.${evidenceIndex + 1}`));
          evidenceRow.append(textNode('small', '', sourceItem?.title || `Source ${Number(ref.source_index || 0) + 1}`));
          evidenceRow.append(textNode('small', '', ref.excerpt || sourceItem?.snippet || ''));
          inspector.append(evidenceRow);
        });
      });

      const verificationRow = textNode('div', 'claim', '');
      verificationRow.append(textNode('b', '', 'VERIFICATION'));
      verificationRow.append(textNode('small', '', `${result.claims?.length || 0} claim(s) independently checked against ${result.sources?.length || 0} evidence source/tool result(s).`));
      inspector.append(verificationRow);

      const decisionRow = textNode('div', 'claim', '');
      decisionRow.append(textNode('b', '', `DECISION · ${result.gate?.action || result.decision}`));
      decisionRow.append(textNode('small', '', result.gate?.reason || result.reason || ''));
      decisionRow.append(textNode('small', '', `Confidence: ${Math.round((result.gate?.confidence || result.confidence || 0) * 100)}%`));
      inspector.append(decisionRow);

      for (const [index, source] of (result.sources || []).entries()) {
        const row = textNode('div', 'claim', '');
        const label = textNode('a', '', source.title || `${proofLabels[language][1]} ${index + 1}`);
        if (/^https?:\/\//i.test(source.url || '')) {
          label.href = source.url;
          label.target = '_blank';
          label.rel = 'noopener noreferrer';
        }
        row.append(label);
        row.append(textNode('small', '', source.snippet || ''));
        inspector.append(row);
      }

      for (const contradiction of result.contradictions || []) {
        const conflict = textNode('div', 'claim', '');
        conflict.append(textNode('strong', 'status conflict', contradiction.type));
        conflict.append(textNode('small', '', contradiction.reason));
        (contradiction.evidence || []).forEach(excerpt => conflict.append(textNode('small', '', excerpt)));
        inspector.append(conflict);
      }
    }
  }

  function renderAudit(result, language) {
    const audit = document.querySelector('#audit .audit');
    if (!audit) return;
    const labels = actionLabels[language];
    const events = [
      { title: auditLabels[language][0], detail: currentTask },
      ...((result.revision_history || []).map(item => ({ title: item.step, detail: item.answer || item.passed === undefined ? item.answer || item.step : `${item.step}: ${item.passed ? 'PASSED' : 'FAILED'}` }))),
      { title: auditLabels[language][1], detail: `${result.sources?.length || 0} source/tool result(s) attached.` },
      { title: auditLabels[language][2], detail: `${result.claims?.length || 0} claim(s); ${result.contradictions?.length || 0} contradiction(s).` },
      { title: `DECISION: ${labels[result.gate?.action] || result.gate?.action}`, detail: result.gate?.reason || result.reason }
    ];
    audit.replaceChildren();
    events.forEach((event, index) => {
      const row = textNode('div', 'event', '');
      row.append(textNode('div', 'time', String(index + 1).padStart(2, '0')));
      const marker = textNode('div', 'dotline', '');
      marker.append(textNode('i', '', ''));
      row.append(marker);
      const content = textNode('div', '', '');
      content.append(textNode('h4', '', event.title));
      content.append(textNode('p', '', event.detail || ''));
      row.append(content);
      audit.append(row);
    });
  }

  button.onclick = async () => {
    const language = currentLanguage();
    const labels = localeCopy[language];
    currentTask = input.value.trim();
    if (!currentTask) {
      input.focus();
      return;
    }
    empty.style.display = 'none';
    output.classList.remove('show');
    output.replaceChildren(textNode('div', 'empty', labels.loading));
    button.disabled = true;
    stages.forEach(stage => { stage.className = 'stage'; });
    const progress = (async () => {
      for (const stage of stages) {
        stage.classList.add('current');
        await new Promise(resolve => setTimeout(resolve, 90));
        stage.classList.remove('current');
        stage.classList.add('done');
      }
    })();
    try {
      const responsePromise = fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: currentTask, language })
      });
      const [response] = await Promise.all([responsePromise, progress]);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed');
      renderResult(result, language);
    } catch (error) {
      output.replaceChildren(textNode('div', 'answer', `${labels.offline} ${error.message || ''}`));
      output.classList.add('show');
    } finally {
      button.disabled = false;
    }
  };

  menu.addEventListener('change', () => {
    const labels = localeCopy[currentLanguage()];
    updateProviderLabel();
    localizeAddedAttackCards();
    if (evaluationReport) renderEvaluation(evaluationReport);
    if (currentResult) renderResult(currentResult, currentLanguage());
    if (!currentResult && empty.style.display === 'none' && !output.classList.contains('show')) {
      output.replaceChildren(textNode('div', 'empty', labels.loading));
    }
  });

  function labelAction(action, language) {
    return actionLabels[language][action] || action;
  }

  function updateAttackCard(button, result) {
    const card = button.closest('.case');
    if (!card) return;
    button.disabled = false;
    const state = card.querySelector('.bottom .status');
    if (state) {
      const passed = result.attack_case?.passed;
      state.textContent = `${passed ? 'PASS' : 'FAIL'} · ${labelAction(result.gate.action, currentLanguage())}`;
      state.className = `status ${passed ? 'verified' : 'conflict'}`;
    }
    currentTask = result.attack_case?.task || result.attack_case?.title || currentTask;
    renderProofGraph(result, currentLanguage());
    renderAudit(result, currentLanguage());
    writeConsole(`${result.attack_case?.id || ''} · ${labelAction(result.gate.action, currentLanguage())}: ${result.gate.reason}`);
    (result.sources || []).forEach(source => writeConsole(`${source.title}: ${source.snippet}`));
  }

  function writeConsole(text) {
    const consolePanel = document.getElementById('console');
    if (!consolePanel) return;
    const line = textNode('p', 'console-entry', text);
    consolePanel.append(line);
    consolePanel.scrollTop = consolePanel.scrollHeight;
  }

  async function runAttack(button, caseId) {
    button.disabled = true;
    try {
      const response = await fetch('/api/attack/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Attack case failed');
      updateAttackCard(button, result);
    } catch (error) {
      button.disabled = false;
      writeConsole(`${caseId}: ${error.message}`);
    }
  }

  function addAttackCard(testCase) {
    const grid = document.getElementById('attackGrid');
    if (!grid || grid.querySelector(`[data-case-id="${testCase.id}"]`)) return;
    const language = currentLanguage();
    const card = textNode('div', 'card case', '');
    card.dataset.caseId = testCase.id;
    card.append(textNode('div', 'case-id', `${testCase.id} · ${testCase.category.toUpperCase()}`));
    card.append(textNode('h4', '', caseTitles[language][testCase.id] || testCase.title));
    card.append(textNode('p', '', testCase.title));
    const bottom = textNode('div', 'bottom', '');
    bottom.append(textNode('span', 'status warning', labelAction(testCase.expected_action, language)));
    const button = textNode('button', 'smallbtn runCase', runLabels[language]);
    button.type = 'button';
    button.addEventListener('click', () => runAttack(button, testCase.id));
    bottom.append(button);
    card.append(bottom);
    grid.append(card);
  }

  function localizeAddedAttackCards() {
    for (const card of document.querySelectorAll('#attackGrid .case[data-case-id]')) {
      const id = card.dataset.caseId;
      const title = caseTitles[currentLanguage()][id];
      if (title) card.querySelector('h4').textContent = title;
      const button = card.querySelector('.runCase');
      if (button) button.textContent = runLabels[currentLanguage()];
    }
  }

  function renderEvaluation(report) {
    const container = document.getElementById('evalResult');
    if (!container) return;
    evaluationReport = report;
    container.replaceChildren();
    container.style.display = 'block';
    document.getElementById('notRun').style.display = 'none';
    const metrics = report.verification_metrics;
    container.append(textNode('p', 'muted', `Synthetic fixture corpus · ${report.corpus_size} cases · rates apply to these cases only.`));
    const metricNames = ['verification_detection_rate', 'false_acceptance_rate', 'false_rejection_rate', 'abstention_accuracy', 'contradiction_detection_rate', 'unsupported_claim_detection_rate', 'prompt_injection_detection_rate', 'unsafe_request_detection_rate', 'execution_verification_accuracy', 'self_correction_success_rate', 'verification_latency_ms_per_case'];
    const section = textNode('div', 'eval-metrics', '');
    for (const [index, key] of metricNames.entries()) {
      const metric = metrics[key];
      const item = textNode('div', 'metric', '');
      item.append(textNode('div', 'label', metricTitles[currentLanguage()][index]));
      const value = metric.value === null ? 'N/A' : key === 'verification_latency_ms_per_case' ? `${metric.value} ms` : `${Math.round(metric.value * 100)}%`;
      item.append(textNode('div', 'num', value));
      if (metric.numerator !== undefined) item.append(textNode('div', 'delta', `${metric.numerator} / ${metric.denominator}`));
      else item.append(textNode('div', 'delta', 'MEASURED RUN'));
      section.append(item);
    }
    container.append(section);
    const generation = textNode('p', 'subtitle', `${report.generation_metrics.status}: ${report.generation_metrics.reason}`);
    container.append(generation);
    container.append(textNode('h3', '', `Verification cases · ${report.corpus_size}`));
    const table = textNode('table', 'table', '');
    const head = textNode('thead', '', '');
    const headerRow = textNode('tr', '', '');
    ['CASE', 'CATEGORY', 'EXPECTED', 'ACTUAL', 'RESULT'].forEach(value => headerRow.append(textNode('th', '', value)));
    head.append(headerRow);
    table.append(head);
    const body = textNode('tbody', '', '');
    for (const result of report.cases) {
      const row = textNode('tr', '', '');
      [result.attack_case.id, result.attack_case.category, result.attack_case.expected_action, result.gate.action, result.attack_case.passed ? 'PASS' : 'FAIL'].forEach(value => row.append(textNode('td', '', value)));
      body.append(row);
    }
    table.append(body);
    container.append(table);
  }

  const grid = document.getElementById('attackGrid');
  const runAll = document.getElementById('runAll');
  const evalRun = document.getElementById('evalRun');
  if (grid) {
    const existingButtons = [...grid.querySelectorAll('.runCase')];
    existingButtons.forEach((button, index) => {
      const caseId = `AX-${String(index + 1).padStart(2, '0')}`;
      button.dataset.caseId = caseId;
      button.closest('.case')?.setAttribute('data-case-id', caseId);
      button.onclick = () => runAttack(button, caseId);
    });
    fetch('/api/attack/cases').then(response => response.ok ? response.json() : null).then(payload => {
      attackCases = payload?.cases || [];
      attackCases.filter(testCase => Number(testCase.id.slice(3)) > 6).forEach(addAttackCard);
    }).catch(() => {});
  }
  if (runAll) runAll.onclick = async () => {
    runAll.disabled = true;
    try {
      const response = await fetch('/api/evaluation/run', { method: 'POST' });
      const report = await response.json();
      if (!response.ok) throw new Error(report.error || 'Evaluation failed');
      document.getElementById('console').replaceChildren();
      report.cases.forEach(result => {
        const caseButton = grid?.querySelector(`[data-case-id="${result.attack_case.id}"] .runCase`);
        if (caseButton) updateAttackCard(caseButton, result);
        else writeConsole(`${result.attack_case.id} · ${result.attack_case.passed ? 'PASS' : 'FAIL'} · ${result.gate.action}`);
      });
    } catch (error) {
      writeConsole(error.message);
    } finally {
      runAll.disabled = false;
    }
  };
  if (evalRun) evalRun.onclick = async () => {
    evalRun.disabled = true;
    try {
      const response = await fetch('/api/evaluation/run', { method: 'POST' });
      const report = await response.json();
      if (!response.ok) throw new Error(report.error || 'Evaluation failed');
      renderEvaluation(report);
    } catch (error) {
      const container = document.getElementById('evalResult');
      container.style.display = 'block';
      container.replaceChildren(textNode('p', 'answer', error.message));
    } finally {
      evalRun.disabled = false;
    }
  };

  function updateProviderLabel() {
    const labels = localeCopy[currentLanguage()];
    const chip = document.querySelector('.top-actions .pill');
    if (chip) chip.textContent = health?.model_configured ? labels.modelProvider : labels.liveProvider;
    const system = document.querySelector('.system');
    if (system) {
      system.replaceChildren();
      system.append(textNode('span', 'status-dot', ''));
      system.append(document.createTextNode(health ? (health.model_configured ? labels.modelOnline : labels.sourceOnline) : labels.sourceOffline));
    }
    const rule = document.querySelector('#overview .hero .rule');
    if (rule) {
      rule.replaceChildren();
      overviewStatus[currentLanguage()].forEach((line, index) => {
        if (index) rule.append(document.createElement('br'));
        rule.append(document.createTextNode(line));
      });
    }
    const metrics = health?.metrics;
    const values = document.querySelectorAll('#overview .metrics .metric .num');
    if (metrics && values.length === 5) {
      values[0].textContent = metrics.claims_verified;
      values[1].textContent = metrics.sources;
      values[2].textContent = metrics.contradictions;
      values[3].textContent = metrics.runs ? `${Math.round(metrics.mean_confidence * 100)}%` : '—';
      values[4].textContent = metrics.abstentions;
      const session = document.querySelector('#overview .metrics .metric:first-child .demo');
      if (session) session.textContent = sessionLabel[currentLanguage()];
      const average = document.querySelector('#overview .metrics .metric:nth-child(4) .demo');
      if (average) average.textContent = averageLabel[currentLanguage()];
    }
  }

  fetch('/api/health').then(response => response.ok ? response.json() : null).then(value => {
    health = value;
    updateProviderLabel();
  }).catch(() => updateProviderLabel());
})();
