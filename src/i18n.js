/**
 * Internationalization (i18n) dictionary and helper for English and Hindi.
 */

export const TRANSLATIONS = {
  en: {
    appTitle: 'UtsavPlan',
    appSubtitle: 'Smart Celebration & Event Planner',
    skipLink: 'Skip to main content',
    languageToggle: 'हिंदी में देखें',
    changeLanguageAria: 'Switch language to Hindi',

    // Form fields
    formHeading: 'Plan Your Celebration',
    eventTypeLabel: 'Event Type',
    dateLabel: 'Event Date',
    guestCountLabel: 'Guest Count',
    budgetLabel: 'Total Budget (₹ INR)',
    styleLabel: 'Celebration Style',
    themeLabel: 'Color Palette & Decor Theme',
    settingLabel: 'Venue Setting',
    dietaryLabel: 'Dietary Preferences',
    childrenCheckboxText: 'Yes, kids will attend (allocate fun zone & mild menu)',
    notesLabel: 'Special Notes / Specific Ceremonies (Haldi, Mehendi, Sangeet, Themes)',
    notesPlaceholder: 'e.g., Need Haldi marigold floral shower, DJ for Sangeet night, Jain live chaat counter...',
    submitBtn: 'Generate Celebration Plan',
    recalculateBtn: 'Recalculate Plan',
    resetBtn: 'Reset Form',

    // Themes
    theme_royal_rajwada: 'Royal Rajwada (Sindoor, Marigold & Antique Gold)',
    theme_udaipur_palace: 'Udaipur Palace (Pastel Rose, Mogra White & Sage)',
    theme_peacock_regalia: 'Peacock Regalia (Teal, Royal Blue & Burnished Brass)',
    theme_boho_sundowner: 'Boho Sundowner (Terracotta, Mustard & Champagne)',

    // Wedding Traditions
    lblWeddingTradition: 'Wedding Tradition (Optional)',
    weddingTraditionHelp: 'Customs vary by family and region. Please confirm details with your family and your priest, qazi, pastor or officiant.',
    tradition_none: 'None / Custom',
    tradition_general: 'General / Interfaith',
    tradition_hindu_north: 'Hindu (North Indian)',
    tradition_hindu_south: 'Hindu (South Indian)',
    tradition_bengali: 'Bengali',
    tradition_marwari: 'Marwari',
    tradition_gujarati: 'Gujarati',
    tradition_punjabi_sikh: 'Punjabi Sikh',
    tradition_muslim_nikah: 'Muslim (Nikah)',
    tradition_christian: 'Christian',
    tradition_jain: 'Jain',
    tradition_parsi: 'Parsi',

    // Event Types
    event_wedding: 'Wedding (Vivah)',
    event_birthday: 'Birthday Party',
    event_community: 'Community & Festival Event',

    // Styles
    style_traditional: 'Traditional & Cultural',
    style_modern: 'Modern & Elegant',
    style_royal: 'Royal & Grand (Shahi)',
    style_minimalist: 'Simple & Minimalist',
    style_festive: 'Festive & Colorful',
    style_ecoFriendly: 'Eco-Friendly & Sustainable',

    // Settings
    setting_indoor: 'Indoor (Banquet / Hall)',
    setting_outdoor: 'Outdoor (Lawn / Ground / Garden)',
    setting_hybrid: 'Hybrid (Indoor Hall + Lawn)',

    // Dietary Options
    dietary_jain: 'Jain (No Root Veg, Strict Pure Veg)',
    dietary_satvik: 'Satvik (No Onion, No Garlic, Pure Ghee)',
    dietary_vegetarian: 'Vegetarian',
    dietary_nonVegetarian: 'Non-Vegetarian',
    dietary_vegan: 'Vegan (Plant-based)',
    dietary_glutenFree: 'Gluten-Free Options',

    // Sections
    pathwaySectionTitle: 'Ceremony & Event Flow',
    pathwaySectionDesc: 'Sequential ritual guide with suggested timings, dress codes, and atmosphere.',
    budgetSection: 'Contextual Budget Breakdown',
    budgetNote: 'All amounts sum exactly to your budget. Rationale is adjusted for your guest count, setting, and dietary needs.',
    budgetVisualizerTitle: 'Proportional Budget Distribution',
    perGuestCostLabel: 'Per Guest Allocation',
    timelineSection: 'Countdown Timeline & Milestones',
    timelineNote: 'Real dates scheduled backward from event day. Urgent milestones are merged when lead time is compressed.',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    detailedSubtasks: 'Detailed Sub-tasks',
    checklistSection: 'Vendor & Task Checklists',
    checklistNote: 'Action items customized for outdoor logistics, dietary guidelines, and safety.',
    ideasSection: 'Personalized Celebration Ideas',
    sourceLabel: 'Ideas Source',
    spendTrackerSection: 'Actual Spend & Vendor Payment Tracker',
    spendTrackerNote: 'Record payments, advances, and vendor contacts to stay on budget.',
    exportIcsBtn: 'Download Calendar (.ics)',
    headerPrintBtn: 'Print / Save PDF',
    headerVoiceBtn: 'Voice Support',
    headerShareBtn: 'Share Plan',

    // Share & Collaboration
    shareModalTitle: 'Share Celebration Plan',
    shareModalDesc: 'Share your celebration details with family, friends, or co-planners.',
    lblShareLink: 'Shareable Web Link',
    shareLinkHelp: 'Anyone with this link can view and customize this celebration plan.',
    copyShareLinkBtn: 'Copy Link',
    linkCopied: 'Copied to clipboard!',
    lblExportJson: 'Export Plan as JSON',
    descExportJson: 'Save an offline copy of your celebration blueprint to share or backup.',
    downloadJsonBtn: 'Download JSON (.json)',
    lblImportJson: 'Load Shared Plan File',
    descImportJson: 'Upload a plan JSON file received from a family member or co-planner.',
    uploadJsonBtn: 'Choose Plan File',
    planLoadedSuccess: 'Shared plan loaded successfully!',
    invalidJsonFile: 'Invalid plan file. Please select a valid UtsavPlan JSON file.',
    sharePrivacyNote: 'Privacy guarantee: Vendor names, phone numbers, and payment advances are never shared in public links.',
    closeModal: 'Close',

    // Voice support
    cardVoiceBtn: 'Tap to Speak',
    voiceMicListening: 'Listening... Speak your celebration ceremonies or notes now.',
    voiceNotSupported: 'Speech recognition is not supported in this browser.',
    voiceStatusSupported: 'Web Speech API ready. Click Speak Notes or choose a sample below.',
    voiceStatusUnsupported: 'Web Speech recognition is available in Google Chrome, Microsoft Edge, and Safari (with mic enabled). You can also click the quick sample chips below or type directly.',
    voiceQuickPromptTitle: 'Quick celebration ceremony prompts (click to insert):',
    voiceReadoutBtn: 'Listen to Plan (Audio)',
    voiceReadoutStopBtn: 'Stop Audio Readout',
    welcomeGenerateBtn: 'Generate Sample Plan',

    // Spend tracker table
    colCategory: 'Category',
    colBudgeted: 'Allocated Budget',
    colActual: 'Actual Spend (₹)',
    colVariance: 'Variance',
    colStatus: 'Status',
    colVendor: 'Vendor Details',
    vendorNamePlaceholder: 'Vendor / Firm Name',
    vendorPhonePlaceholder: 'Phone Number',
    advancePaidLabel: 'Advance Paid',
    balanceDueLabel: 'Balance Due',
    totalAllocated: 'Total Allocated',
    totalSpent: 'Total Spent',
    totalRemaining: 'Net Remaining',
    statusUnder: 'Under Budget',
    statusOnTrack: 'On Track',
    statusOver: 'Over Budget',

    // Warnings
    warning_tight_budget: 'Budget alert: Per-guest allocation is tight. Prioritize primary catering and essential venue arrangements.',
    warning_short_lead: 'Short lead time alert: Event date is very close. Early milestones have been collapsed into an urgent "Start now" phase.',
    warning_outdoor_weather: 'Outdoor weather alert: Ensure waterproof shamiana, silent generator backup, and floor leveling are arranged.',
    warning_large_crowd: 'Crowd management alert: Large guest list requires dedicated ushering, multi-lane buffet counters, and parking coordination.',

    // Fallback ideas source names
    source_gemini: 'Google Gemini AI',
    source_groq: 'Groq AI',
    source_openrouter: 'OpenRouter AI',
    source_rules: 'Celebration Planning Expert Rules',

    // Drafts
    saveDraftBtn: 'Save Draft',
    headerDraftsBtn: 'My Drafts',
    draftsModalTitle: 'My Saved Drafts',
    draftsModalDesc: 'Drafts are saved only in this browser. To keep a permanent backup or share with co-planners, use Export JSON in the Share Plan menu.',
    draftsStorageWarning: 'Draft limit reached (maximum 10). Please delete an old draft before saving a new one.',
    storageUnavailableWarning: 'Browser local storage is unavailable or disabled. Drafts cannot be saved.',
    noDraftsMessage: 'No saved drafts yet. Click Save Draft to save your current plan.',
    draftSavedStatus: 'Draft saved successfully.',
    draftDeletedStatus: 'Draft deleted.',
    draftRenamedStatus: 'Draft renamed.',
    draftLoadedStatus: 'Draft loaded into planner.',
    draftLoadBtn: 'Load',
    draftRenameBtn: 'Rename',
    draftDeleteBtn: 'Delete',
    saveDraftModalTitle: 'Save Plan Draft',
    lblDraftName: 'Draft Name (Optional):',
    saveDraftConfirmBtn: 'Save Draft',
    cancelBtn: 'Cancel',
    renameDraftModalTitle: 'Rename Draft',
    lblRenameDraft: 'New Draft Name:',
    confirmRenameBtn: 'Rename',
    deleteDraftModalTitle: 'Delete Draft?',
    confirmDeleteDraftText: 'Are you sure you want to delete this draft? This action cannot be undone.',
    confirmDeleteBtn: 'Delete Draft',

    // Live update notice
    changeNotice: 'Plan updated: {changes}',

    // Common
    daysLeft: '{days} days to event',
    startNowLabel: 'Start Now (Urgent)',
    completed: 'completed',
    validationErrorTitle: 'Please check your inputs:',
  },
  hi: {
    appTitle: 'उत्सव प्लान (UtsavPlan)',
    appSubtitle: 'स्मार्ट उत्सव एवं कार्यक्रम योजना सहायक',
    skipLink: 'मुख्य सामग्री पर जाएं',
    languageToggle: 'View in English',
    changeLanguageAria: 'भाषा बदलकर अंग्रेजी करें',

    // Form fields
    formHeading: 'अपने उत्सव की योजना बनाएं',
    eventTypeLabel: 'कार्यक्रम का प्रकार',
    dateLabel: 'कार्यक्रम की तिथि',
    guestCountLabel: 'अतिथियों की संख्या',
    budgetLabel: 'कुल बजट (₹ भारतीय रुपया)',
    styleLabel: 'उत्सव की शैली',
    themeLabel: 'रंग पैलेट एवं सज्जा थीम',
    settingLabel: 'स्थान व्यवस्था (वेन्यू)',
    dietaryLabel: 'खान-पान आवश्यकताएं (आहार)',
    childrenCheckboxText: 'हाँ, बच्चे भी शामिल होंगे (मनोरंजन व हल्का भोजन व्यवस्था)',
    notesLabel: 'विशेष विवरण / रस्में (हल्दी, मेहंदी, संगीत, थीम आदि)',
    notesPlaceholder: 'उदा. हल्दी के लिए गेंदे के फूलों की वर्षा, संगीत नाइट हेतु डीजे, जैन लाइव चाट स्टॉल...',
    submitBtn: 'उत्सव योजना तैयार करें',
    recalculateBtn: 'योजना पुनः परिकलित करें',
    resetBtn: 'फ़ॉर्म रीसेट करें',

    // Themes
    theme_royal_rajwada: 'शाही राजवाड़ा (सिंदूरी, गेंदा पीला व प्राचीन स्वर्ण)',
    theme_udaipur_palace: 'उदयपुर पैलेस (गुलाबी, मोगरा श्वेत व सेज हरा)',
    theme_peacock_regalia: 'मयूर रीगलिया (मयूर कंठी, नीला व पीतल)',
    theme_boho_sundowner: 'बोहो सनडाउनर (गेरुआ, सरसों पीला व शैम्पेन)',

    // Wedding Traditions
    lblWeddingTradition: 'विवाह परंपरा (वैकल्पिक)',
    weddingTraditionHelp: 'रीति-रिवाज परिवार व क्षेत्र के अनुसार भिन्न हो सकते हैं। कृपया अपने परिवार और पुरोहित, काज़ी, पादरी या धर्मगुरु से विवरण की पुष्टि करें।',
    tradition_none: 'कोई नहीं / सामान्य',
    tradition_general: 'सामान्य / सर्वधर्म (इंटरफेथ)',
    tradition_hindu_north: 'हिन्दू (उत्तर भारतीय)',
    tradition_hindu_south: 'हिन्दू (दक्षिण भारतीय)',
    tradition_bengali: 'बंगाली',
    tradition_marwari: 'मारवाड़ी',
    tradition_gujarati: 'गुजराती',
    tradition_punjabi_sikh: 'पंजाबी सिख (आनंद कारज)',
    tradition_muslim_nikah: 'मुस्लिम (निकाह)',
    tradition_christian: 'ईसाई (क्रिश्चियन)',
    tradition_jain: 'जैन',
    tradition_parsi: 'पारसी (लगन)',

    // Event Types
    event_wedding: 'विवाह समारोह (शादी)',
    event_birthday: 'जन्मदिन पार्टी',
    event_community: 'सामुदायिक / उत्सव आयोजन (मेला, गरबा, दीवाली मिलन)',

    // Styles
    style_traditional: 'पारंपरिक एवं सांस्कृतिक',
    style_modern: 'आधुनिक एवं भव्य',
    style_royal: 'शाही व राजसी ठाठ',
    style_minimalist: 'सादगीपूर्ण एवं सुरुचिपूर्ण',
    style_festive: 'उत्सवमय एवं रंगारंग',
    style_ecoFriendly: 'पर्यावरण-अनुकूल (जीरो वेस्ट)',

    // Settings
    setting_indoor: 'इंडोर (बैंक्वेट हॉल / सभागार)',
    setting_outdoor: 'आउटडोर (खुला लॉन / मैदान / वाटिका)',
    setting_hybrid: 'हाइब्रिड (हॉल + खुला लॉन)',

    // Dietary Options
    dietary_jain: 'जैन (कंदमूल रहित, शुद्ध सात्विक)',
    dietary_satvik: 'सात्विक (बिना प्याज-लहसुन, शुद्ध घी)',
    dietary_vegetarian: 'शुद्ध शाकाहारी',
    dietary_nonVegetarian: 'मांसाहारी (नॉन-वेज)',
    dietary_vegan: 'वीगन (पादप-आधारित)',
    dietary_glutenFree: 'ग्लूटेन-मुक्त विकल्प',

    // Sections
    pathwaySectionTitle: 'शुभ रस्म एवं कार्यक्रम प्रवाह',
    pathwaySectionDesc: 'पोशाक और मुख्य रस्मों के साथ कार्यक्रमों का क्रमवार विवरण।',
    budgetSection: 'संदर्भ आधारित बजट आवंटन',
    budgetNote: 'सभी राशियाँ आपके कुल बजट से 100% मेल खाती हैं। कारण आपके मेहमानों, स्थान और आहार के अनुसार तय हैं।',
    budgetVisualizerTitle: 'अनुपातिक बजट आवंटन पट्टी',
    perGuestCostLabel: 'प्रति अतिथि अनुमानित खर्च',
    timelineSection: 'तैयारी की समय-सीमा (टाइमलाइन)',
    timelineNote: 'कार्यक्रम के दिन से उल्टी गिनती। समय कम होने पर शुरुआती काम तुरंत शुरू करने के लिए जोड़ दिए जाते हैं।',
    expandAll: 'सभी विस्तार करें',
    collapseAll: 'सभी संक्षेप करें',
    detailedSubtasks: 'विस्तृत उप-कार्य',
    checklistSection: 'विक्रेता व कार्य चेकलिस्ट',
    checklistNote: 'मौसम, सुरक्षा, और आहार प्राथमिकताओं के अनुसार तैयार चेकलिस्ट।',
    ideasSection: 'विशेष वैयक्तिकृत विचार व सुझाव',
    sourceLabel: 'सुझाव स्रोत',
    spendTrackerSection: 'वास्तविक खर्च एवं विक्रेता भुगतान ट्रैकर',
    spendTrackerNote: 'बजट के मुकाबले वास्तविक खर्च व अग्रिम भुगतान दर्ज करें।',
    exportIcsBtn: 'कैलेंडर टाइमलाइन डाउनलोड करें (.ics)',
    headerPrintBtn: 'प्रिंट / PDF सेव करें',
    headerVoiceBtn: 'आवाज़ सहायता',
    headerShareBtn: 'योजना साझा करें',

    // Share & Collaboration
    shareModalTitle: 'उत्सव योजना साझा करें',
    shareModalDesc: 'अपने परिवार, मित्रों या सह-योजकों के साथ उत्सव विवरण साझा करें।',
    lblShareLink: 'साझा करने योग्य वेब लिंक',
    shareLinkHelp: 'इस लिंक के माध्यम से कोई भी इस उत्सव योजना को देख और अनुकूलित कर सकता है।',
    copyShareLinkBtn: 'लिंक कॉपी करें',
    linkCopied: 'क्लिपबोर्ड पर कॉपी हो गया!',
    lblExportJson: 'योजना JSON में डाउनलोड करें',
    descExportJson: 'ऑफ़लाइन बैकअप या सह-योजकों को भेजने के लिए योजना फ़ाइल सहेजें।',
    downloadJsonBtn: 'डाउनलोड JSON (.json)',
    lblImportJson: 'साझा की गई योजना फ़ाइल लोड करें',
    descImportJson: 'परिवार या सह-योजक से प्राप्त योजना JSON फ़ाइल अपलोड करें।',
    uploadJsonBtn: 'फ़ाइल चुनें',
    planLoadedSuccess: 'साझा की गई योजना सफलतापूर्वक लोड हो गई!',
    invalidJsonFile: 'अमान्य फ़ाइल। कृपया मान्य UtsavPlan JSON फ़ाइल चुनें।',
    sharePrivacyNote: 'गोपनीयता सुरक्षा: विक्रेता के नाम, फ़ोन नंबर और अग्रिम भुगतान कभी भी सार्वजनिक लिंक में साझा नहीं किए जाते हैं।',
    closeModal: 'बंद करें',

    // Voice support
    cardVoiceBtn: 'बोलकर लिखें',
    voiceMicListening: 'सुन रहे हैं... कृपया अपने उत्सव के नोट्स या रस्में बोलें।',
    voiceNotSupported: 'इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।',
    voiceStatusSupported: 'वेब स्पीच सक्रिय (हिंदी एवं अंग्रेजी)। माइक दबाएं या नीचे से चुनें।',
    voiceStatusUnsupported: 'वेब स्पीच क्रोम, एज या सफारी में माइक्रोफोन अनुमति के साथ उपलब्ध है। आप नीचे दिए गए उदाहरणों पर क्लिक करके या सीधे टाइप करके लिख सकते हैं।',
    voiceQuickPromptTitle: 'त्वरित उत्सव आवाज़ नोट्स (जोड़ने हेतु क्लिक करें):',
    voiceReadoutBtn: 'योजना का सारांश सुनें (ऑडियो)',
    voiceReadoutStopBtn: 'ऑडियो रोकें',
    welcomeGenerateBtn: 'नमूना योजना तैयार करें',

    // Spend tracker table
    colCategory: 'मद (श्रेणी)',
    colBudgeted: 'आवंटित बजट',
    colActual: 'वास्तविक खर्च (₹)',
    colVariance: 'अंतर (बचत / कमी)',
    colStatus: 'स्थिति',
    colVendor: 'विक्रेता विवरण',
    vendorNamePlaceholder: 'विक्रेता / एजेंसी का नाम',
    vendorPhonePlaceholder: 'फ़ोन नंबर',
    advancePaidLabel: 'अग्रिम भुगतान',
    balanceDueLabel: 'बकाया राशि',
    totalAllocated: 'कुल आवंटित',
    totalSpent: 'कुल खर्च',
    totalRemaining: 'शुद्ध शेष',
    statusUnder: 'बजट के भीतर',
    statusOnTrack: 'सटीक',
    statusOver: 'बजट से अधिक',

    // Warnings
    warning_tight_budget: 'बजट चेतावनी: प्रति अतिथि बजट सीमित है। प्राथमिक खानपान और आवश्यक वेन्यू को प्राथमिकता दें।',
    warning_short_lead: 'अल्प समय चेतावनी: कार्यक्रम की तारीख बहुत निकट है। प्रारंभिक कार्यों को "तुरंत शुरू करें" में बदला गया है।',
    warning_outdoor_weather: 'मौसम चेतावनी: खुले मैदान के लिए वाटरप्रूफ शामियाना, जनरेटर बैकअप और फर्श समतलन अनिवार्य है।',
    warning_large_crowd: 'भीड़ प्रबंधन: बड़ी संख्या में अतिथियों के लिए मल्टी-लेन बुफे और पार्किंग व्यवस्था सुनिश्चित करें।',

    // Fallback ideas source names
    source_gemini: 'गूगल जेमिनी एआई (Gemini AI)',
    source_groq: 'ग्रॉक एआई (Groq AI)',
    source_openrouter: 'ओपनराउटर एआई (OpenRouter AI)',
    source_rules: 'उत्सव योजना विशेषज्ञ नियम',

    // Drafts
    saveDraftBtn: 'ड्राफ्ट सहेजें',
    headerDraftsBtn: 'मेरे ड्राफ्ट',
    draftsModalTitle: 'मेरे सहेजे गए ड्राफ्ट',
    draftsModalDesc: 'ड्राफ्ट केवल इसी ब्राउज़र में सुरक्षित रहते हैं। स्थायी बैकअप के लिए योजना साझा करें मेनू में JSON एक्सपोर्ट का उपयोग करें।',
    draftsStorageWarning: 'ड्राफ्ट की अधिकतम सीमा (10) समाप्त हो गई है। नया ड्राफ्ट सहेजने से पहले कृपया पुराना ड्राफ्ट हटाएं।',
    storageUnavailableWarning: 'ब्राउज़र लोकल स्टोरेज अनुपलब्ध या बंद है। ड्राफ्ट सहेजे नहीं जा सकते।',
    noDraftsMessage: 'अभी कोई ड्राफ्ट सहेजा नहीं गया है। अपनी योजना सहेजने हेतु ड्राफ्ट सहेजें पर क्लिक करें।',
    draftSavedStatus: 'ड्राफ्ट सफलतापूर्वक सहेजा गया।',
    draftDeletedStatus: 'ड्राफ्ट हटा दिया गया।',
    draftRenamedStatus: 'ड्राफ्ट का नाम बदल दिया गया।',
    draftLoadedStatus: 'ड्राफ्ट लोड कर दिया गया।',
    draftLoadBtn: 'लोड करें',
    draftRenameBtn: 'नाम बदलें',
    draftDeleteBtn: 'हटाएं',
    saveDraftModalTitle: 'योजना ड्राफ्ट सहेजें',
    lblDraftName: 'ड्राफ्ट का नाम (वैकल्पिक):',
    saveDraftConfirmBtn: 'ड्राफ्ट सहेजें',
    cancelBtn: 'रद्द करें',
    renameDraftModalTitle: 'ड्राफ्ट का नाम बदलें',
    lblRenameDraft: 'नया ड्राफ्ट नाम:',
    confirmRenameBtn: 'नाम बदलें',
    deleteDraftModalTitle: 'ड्राफ्ट हटाएं?',
    confirmDeleteDraftText: 'क्या आप निश्चित रूप से इस ड्राफ्ट को हटाना चाहते हैं? इसे वापस नहीं लाया जा सकता।',
    confirmDeleteBtn: 'ड्राफ्ट हटाएं',

    // Live update notice
    changeNotice: 'योजना अद्यतन हुई: {changes}',

    // Common
    daysLeft: 'कार्यक्रम में {days} दिन शेष',
    startNowLabel: 'तुरंत शुरू करें (अति आवश्यक)',
    completed: 'पूर्ण',
    validationErrorTitle: 'कृपया फ़ॉर्म की त्रुटियाँ सुधारें:',
  },
};

/**
 * Returns translated string or fallback key.
 * @param {string} lang 'en' | 'hi'
 * @param {string} key
 * @param {object} [params]
 * @returns {string}
 */
export function t(lang, key, params = {}) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = dict[key] || TRANSLATIONS.en[key] || key;
  if (params && typeof params === 'object') {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}
