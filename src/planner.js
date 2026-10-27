import { getTradition, TRADITION_DISCLAIMER } from './traditions.js';

/**
 * Pure celebration planning logic: budget allocations, timeline scheduling,
 * vendor checklists, warnings, and spend calculations.
 */

/**
 * Calculates contextual budget allocation where categories sum EXACTLY to total budget.
 * Each category includes a one-line rationale reflecting event style, setting, and dietary needs.
 */
export function calculateBudget({ eventType, budget, guestCount, style, setting, dietary = [], children = false, tradition }) {
  const isOutdoor = setting === 'outdoor' || setting === 'hybrid';
  const hasJainOrSatvik = dietary.includes('jain') || dietary.includes('satvik') || tradition === 'jain';
  const isRoyal = style === 'royal';
  const isEco = style === 'eco-friendly';

  let categoriesConfig = [];

  if (eventType === 'wedding') {
    const traditionData = getTradition(tradition);
    let decorWeight = traditionData ? traditionData.budgetAdjustments.venue_decor : (isRoyal ? 34 : (isOutdoor ? 33 : 30));
    let cateringWeight = traditionData ? traditionData.budgetAdjustments.catering_food : (hasJainOrSatvik ? 33 : 30);
    let photoWeight = traditionData ? traditionData.budgetAdjustments.photography_video : 12;
    let attireWeight = traditionData ? traditionData.budgetAdjustments.attire_rituals : (isRoyal ? 10 : 8);
    let entertainmentWeight = traditionData ? traditionData.budgetAdjustments.entertainment_music : (children ? 10 : 8);
    let logisticsWeight = traditionData ? traditionData.budgetAdjustments.logistics_favors : (isEco ? 7 : 5);
    let contingencyWeight = traditionData ? traditionData.budgetAdjustments.contingency : 5;

    let cateringReasonEn = traditionData && traditionData.foodNotes
      ? traditionData.foodNotes.en
      : (hasJainOrSatvik
        ? 'Enhanced for specialized Jain & Satvik separate live counters, pure ghee sweets, and distinct preparation zones.'
        : 'Covers welcome appetizers, multi-cuisine dinner buffet, live chaat stalls, and celebratory desserts.');
    let cateringReasonHi = traditionData && traditionData.foodNotes
      ? traditionData.foodNotes.hi
      : (hasJainOrSatvik
        ? 'जैन व सात्विक अतिथियों हेतु पृथक लाइव काउंटर, शुद्ध घी की मिठाइयों एवं विशेष रसोई के लिए।'
        : 'स्वागत पेय, बहु-व्यंजन डिनर बुफे, लाइव चाट स्टॉल और पारंपरिक मिठाइयों हेतु।');

    let attireReasonEn = traditionData && traditionData.dressNotes
      ? traditionData.dressNotes.en
      : 'Covers ceremonial outfits, beauty/makeup artists, and essential Vedic puja samagri.';
    let attireReasonHi = traditionData && traditionData.dressNotes
      ? traditionData.dressNotes.hi
      : 'विवाह वेशभूषा, ब्राइडल मेकअप एवं वैदिक पूजा-हवन सामग्री के लिए।';

    categoriesConfig = [
      {
        id: 'venue_decor',
        nameEn: 'Venue, Mandap & Floral Decor',
        nameHi: 'वेन्यू, मंडप एवं पुष्प सज्जा',
        weight: decorWeight,
        reasonEn: isOutdoor
          ? 'Includes weather-proof shamiana canopy, floral mandap, and waterproof lighting.'
          : (isRoyal ? 'Allocated for grand royal palace backdrop, majestic entryway, and heritage floral styling.' : 'Covers banquet hall rental, central stage, and auspicious mandap setup.'),
        reasonHi: isOutdoor
          ? 'खुले लॉन के लिए वाटरप्रूफ शामियाना, पुष्प मंडप और सुरक्षित प्रकाश व्यवस्था शामिल है।'
          : (isRoyal ? 'भव्य राजसी स्वागत द्वार, शाही मंच सज्जा और पारंपरिक पुष्प व्यवस्था हेतु।' : 'बैंक्वेट हॉल किराया, मुख्य स्टेज और पावन विवाह मंडप सज्जा के लिए।'),
      },
      {
        id: 'catering_food',
        nameEn: 'Catering, Multi-Course Feasts & Sweets',
        nameHi: 'खान-पान, बहु-व्यंजन दावत एवं मिष्ठान',
        weight: cateringWeight,
        reasonEn: cateringReasonEn,
        reasonHi: cateringReasonHi,
      },
      {
        id: 'photography_video',
        nameEn: 'Photography, Cinematic Video & Drones',
        nameHi: 'फोटोग्राफी, सिनेमाई वीडियोग्राफी एवं ड्रोन',
        weight: photoWeight,
        reasonEn: 'Covers candid ceremony coverage, traditional family portraits, and edited highlight reel.',
        reasonHi: 'सभी रस्मों की कैंडिड फोटोग्राफी, पारिवारिक पोर्ट्रेट एवं सिनेमाई वीडियो हेतु।',
      },
      {
        id: 'attire_rituals',
        nameEn: 'Attire, Styling & Puja Samagri',
        nameHi: 'पारंपरिक परिधान, शृंगार एवं पूजा सामग्री',
        weight: attireWeight,
        reasonEn: attireReasonEn,
        reasonHi: attireReasonHi,
      },
      {
        id: 'entertainment_music',
        nameEn: 'Sangeet DJ, Dhol & Performances',
        nameHi: 'संगीत डीजे, ढोल एवं सांस्कृतिक प्रस्तुतियां',
        weight: entertainmentWeight,
        reasonEn: children
          ? 'Covers DJ sound setup, live baraat dhol players, and interactive family dance choreography.'
          : 'Covers professional sound system, Baraat brass band / dhol, and Sangeet playlist curation.',
        reasonHi: 'बरात के लिए लाइव ढोल, संगीत नाइट डीजे और पारिवारिक नृत्य प्रस्तुति व्यवस्था।',
      },
      {
        id: 'logistics_favors',
        nameEn: 'Guest Logistics, Invites & Return Gifts',
        nameHi: 'अतिथि परिवहन, निमंत्रण पत्र एवं रिटर्न गिफ्ट',
        weight: logisticsWeight,
        reasonEn: isEco
          ? 'Allocated for plantable seed-paper invitations and artisan handcrafted eco-friendly return gifts.'
          : 'Covers digital & physical invitation cards, welcome hampers, and memorable return gifts.',
        reasonHi: isEco
          ? 'पर्यावरण-अनुकूल बीज निमंत्रण पत्र एवं हस्तनिर्मित उपहारों के लिए।'
          : 'निमंत्रण पत्र, स्वागत किट एवं अतिथियों के लिए स्मृति उपहार।',
      },
      {
        id: 'contingency',
        nameEn: 'Emergency Contingency Fund',
        nameHi: 'आकस्मिक आरक्षित निधि',
        weight: contingencyWeight,
        reasonEn: 'Buffer reserved for last-minute guest additions, ritual items, and overtime vendor charges.',
        reasonHi: 'अंतिम समय के अतिरिक्त मेहमानों, अतिरिक्त रस्मों व आपातकालीन खर्चों हेतु सुरक्षित निधि।',
      },
    ];
  } else if (eventType === 'birthday') {
    let decorWeight = isOutdoor ? 28 : 25;
    let cateringWeight = hasJainOrSatvik ? 38 : 35;
    let entertainmentWeight = children ? 18 : 15;
    let photoWeight = 10;
    let favorsWeight = isEco ? 12 : 10;
    let contingencyWeight = 5;

    categoriesConfig = [
      {
        id: 'venue_decor',
        nameEn: 'Theme Decor, Balloons & Stage',
        nameHi: 'थीम डेकोर, गुब्बारे एवं मंच सज्जा',
        weight: decorWeight,
        reasonEn: isOutdoor
          ? 'Covers garden party canopy, balloon arches, and themed photobooth backdrop.'
          : 'Covers custom theme cutout displays, entrance arch, and table centerpieces.',
        reasonHi: 'पार्टी थीम सज्जा, गुब्बारा मेहराब और फोटोबूथ बैकड्रॉप के लिए।',
      },
      {
        id: 'catering_cake',
        nameEn: 'Gourmet Food, Mocktails & Centerpiece Cake',
        nameHi: 'स्वादिष्ट भोजन, मॉकटेल एवं मुख्य केक',
        weight: cateringWeight,
        reasonEn: hasJainOrSatvik
          ? 'Includes eggless customized designer cake, finger food buffet, and separate Jain snack options.'
          : 'Covers designer theme cake, welcome mocktails, hot appetizers, and party dinner buffet.',
        reasonHi: 'विशेष थीम केक, स्टार्टर्स, लाइव स्नैक्स और स्वादिष्ट पार्टी डिनर के लिए।',
      },
      {
        id: 'entertainment_host',
        nameEn: 'Emcee Host, Magic Show & Party Games',
        nameHi: 'एंकर/होस्ट, मैजिक शो एवं पार्टी खेल',
        weight: entertainmentWeight,
        reasonEn: children
          ? 'Includes dedicated game host, magician, balloon artist, and lively music system.'
          : 'Covers party host, trivia quiz game, and dance floor music sound system.',
        reasonHi: children
          ? 'बच्चों के लिए जादू का खेल, गुब्बारा कलाकार, गेम होस्ट और संगीत व्यवस्था।'
          : 'पार्टी एंकर, गेम्स और डांस फ्लोर म्यूजिक सिस्टम हेतु।',
      },
      {
        id: 'photography_memories',
        nameEn: 'Photography & Candid Reel Coverage',
        nameHi: 'फोटोग्राफी एवं यादगार वीडियो रील्स',
        weight: photoWeight,
        reasonEn: 'Captures cake cutting moments, guest reactions, and instant social reel highlights.',
        reasonHi: 'केक कटिंग, अतिथियों के भाव और यादगार पलों की फोटोग्राफी हेतु।',
      },
      {
        id: 'favors_gifts',
        nameEn: 'Return Goodie Bags & Prizes',
        nameHi: 'रिटर्न गिफ्ट्स एवं गेम प्रतियोगिता पुरस्कार',
        weight: favorsWeight,
        reasonEn: isEco
          ? 'Thoughtful eco-friendly art kits and plantable seed favors for every attendee.'
          : 'Personalized theme-based return gift bags and winning prizes for party games.',
        reasonHi: 'अतिथियों के लिए आकर्षक रिटर्न गिफ्ट्स और खेल प्रतियोगिताओं के पुरस्कार।',
      },
      {
        id: 'contingency',
        nameEn: 'Emergency Contingency Fund',
        nameHi: 'आकस्मिक आरक्षित निधि',
        weight: contingencyWeight,
        reasonEn: 'Reserved for unexpected extra party guests, additional snacks, or extended venue time.',
        reasonHi: 'अचानक बढ़े मेहमानों, अतिरिक्त स्नैक्स व आपातकालीन खर्चों हेतु आरक्षित निधि।',
      },
    ];
  } else {
    // Community & Festival Event
    let stagingWeight = isOutdoor ? 35 : 30;
    let foodWeight = hasJainOrSatvik ? 28 : 25;
    let permitsWeight = 15;
    let culturalWeight = children ? 15 : 15;
    let publicityWeight = 10;
    let contingencyWeight = 5;

    categoriesConfig = [
      {
        id: 'venue_staging',
        nameEn: 'Stage, Truss, Sound & High-Power Generator',
        nameHi: 'मंच, साउंड सिस्टम एवं जनरेटर बैकअप',
        weight: stagingWeight,
        reasonEn: isOutdoor
          ? 'Covers open-ground stage erection, weather-safe sound truss, and silent diesel generator.'
          : 'Covers auditorium hall rental, PA sound system, stage lighting, and microphones.',
        reasonHi: 'सामुदायिक मैदान, मंच निर्माण, साउंड सिस्टम और जनरेटर बैकअप हेतु।',
      },
      {
        id: 'food_refreshments',
        nameEn: 'Community Feast / Mahaprasad & Water',
        nameHi: 'सामुदायिक महाप्रसाद, जल सेवा एवं स्वल्पाहार',
        weight: foodWeight,
        reasonEn: hasJainOrSatvik
          ? 'Covers pure satvik community bhog / langar preparation and mineral water dispensers.'
          : 'Covers bulk meal preparation, disposable eco-cutlery, and continuous drinking water points.',
        reasonHi: 'शुद्ध सामुदायिक महाप्रसाद भोजन, शीतल पेयजल और पत्तल-दोने व्यवस्था हेतु।',
      },
      {
        id: 'permits_security',
        nameEn: 'Civic Permits, Security, Fire & Cleanliness',
        nameHi: 'सरकारी अनुमतियां, सुरक्षा, प्राथमिक उपचार एवं स्वच्छता',
        weight: permitsWeight,
        reasonEn: 'Covers police/sound permits, fire safety extinguishers, security guards, and waste disposal.',
        reasonHi: 'ध्वनि व पुलिस अनुमति, अग्निशामक सुरक्षा, गार्ड और कचरा प्रबंधन व्यवस्था।',
      },
      {
        id: 'cultural_program',
        nameEn: 'Performers, Competitions, Trophies & Gifts',
        nameHi: 'कलाकार, प्रतियोगिताएं, ट्रॉफी व उपहार',
        weight: culturalWeight,
        reasonEn: 'Covers sound tracks, guest artist honorarium, competition awards, and participant certificates.',
        reasonHi: 'सांस्कृतिक प्रस्तुतियां, मंच संचालन, प्रतियोगिता पुरस्कार और स्मृति चिह्न।',
      },
      {
        id: 'publicity_signage',
        nameEn: 'Publicity Banners, Badges & Entry Management',
        nameHi: 'प्रचार बैनर, स्वयंसेवक बैज एवं स्वागत द्वार',
        weight: publicityWeight,
        reasonEn: 'Covers community entrance arches, route direction signage, and volunteer identification kits.',
        reasonHi: 'प्रवेश द्वार बैनर, सूचना बोर्ड और स्वयंसेवक पहचान पत्र हेतु।',
      },
      {
        id: 'contingency',
        nameEn: 'Emergency Contingency Fund',
        nameHi: 'आकस्मिक आरक्षित निधि',
        weight: contingencyWeight,
        reasonEn: 'Reserved for unexpected weather protection, crowd overflow, or last-minute supplies.',
        reasonHi: 'अचानक मौसम बदलाव या भीड़ नियंत्रण संबंधित आपातकालीन खर्च हेतु।',
      },
    ];
  }

  // Exact math: Normalize weights and calculate integer allocations
  const totalWeight = categoriesConfig.reduce((acc, cat) => acc + cat.weight, 0);

  let allocatedSum = 0;
  const categories = categoriesConfig.map(cat => {
    const rawShare = (cat.weight / totalWeight);
    const amount = Math.floor(budget * rawShare);
    allocatedSum += amount;
    return {
      ...cat,
      percentage: Math.round(rawShare * 100),
      amount,
    };
  });

  // Distribute remainder so the sum equals total budget exactly down to 1 rupee!
  const remainder = budget - allocatedSum;
  if (remainder !== 0) {
    // Add remainder to the contingency category (or the first category)
    const contingencyCat = categories.find(c => c.id === 'contingency') || categories[0];
    contingencyCat.amount += remainder;
  }

  return {
    totalBudget: budget,
    currency: 'INR',
    categories,
  };
}

/**
 * Calculates countdown timeline backwards from event date.
 * If lead time is short, compresses early/past tasks into "Start now".
 */
export function calculateTimeline({ eventType, eventDate, today = new Date(), tradition }) {
  const targetDate = new Date(`${eventDate}T00:00:00Z`);
  const referenceDate = new Date(today);
  referenceDate.setUTCHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - referenceDate.getTime();
  const leadTimeDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  let rawMilestones = [];

  if (eventType === 'wedding') {
    rawMilestones = [
      { daysBefore: 180, titleEn: 'Fix auspicious muhurat & lock primary venue (Banquet/Mandap)', titleHi: 'शुभ मुहूर्त तय करें एवं विवाह वेन्यू/मंडप बुक करें', phase: 'long-term' },
      { daysBefore: 120, titleEn: 'Finalize catering menu (verify Jain/Satvik counters) & book photographer', titleHi: 'खानपान मेनू (जैन/सात्विक काउंटर सहित) तय करें व फोटोग्राफर बुक करें', phase: 'long-term' },
      { daysBefore: 90, titleEn: 'Engage Mehendi artist, Sangeet DJ & finalize print/digital invitation cards', titleHi: 'मेहंदी कलाकार, संगीत डीजे व निमंत्रण पत्र फाइनल करें', phase: 'mid-term' },
      { daysBefore: 60, titleEn: 'Dispatch wedding invites, schedule bridal attire trials & coordinate Haldi decor', titleHi: 'विवाह निमंत्रण भेजें, वेशभूषा ट्रायल व हल्दी डेकोर तय करें', phase: 'mid-term' },
      { daysBefore: 30, titleEn: 'Confirm final RSVP guest count, outstation hotel stays & arrange Vedic puja samagri', titleHi: 'अतिथि संख्या की पुष्टि, ठहरने की व्यवस्था व पूजा सामग्री सूची बनाएं', phase: 'short-term' },
      { daysBefore: 14, titleEn: 'Conduct dry run with caterer & decorator; secure sound/fire permits', titleHi: 'कैटरर व डेकोरेटर संग समन्वय बैठक; ध्वनि व सुरक्षा अनुमति जांचें', phase: 'short-term' },
      { daysBefore: 7, titleEn: 'Assemble emergency styling kits & assign family point-of-contacts for each ceremony', titleHi: 'इमरजेंसी किट तैयार करें व पारिवारिक जिम्मेदारियां बांटें', phase: 'final-week' },
      { daysBefore: 2, titleEn: 'Haldi & Mehendi setup run-through, sound check & guest welcome reception', titleHi: 'हल्दी-मेहंदी स्थल तैयारी, साउंड चेक व अतिथियों का स्वागत', phase: 'final-days' },
      { daysBefore: 0, titleEn: 'Celebration Day: Auspicious Vivah ceremony, grand feast & blessings!', titleHi: 'उत्सव का दिन: पावन विवाह संस्कार, महाभोज एवं मंगल आशीर्वाद!', phase: 'event-day' },
    ];

    const traditionData = getTradition(tradition);
    if (traditionData && Array.isArray(traditionData.timelineAdditions)) {
      rawMilestones.push(...traditionData.timelineAdditions);
      rawMilestones.sort((a, b) => b.daysBefore - a.daysBefore);
    }
  } else if (eventType === 'birthday') {
    rawMilestones = [
      { daysBefore: 45, titleEn: 'Select party theme, reserve party hall/lawn & prepare guest list', titleHi: 'पार्टी थीम चुनें, वेन्यू आरक्षित करें एवं अतिथि सूची तैयार करें', phase: 'long-term' },
      { daysBefore: 30, titleEn: 'Order customized centerpiece cake, book emcee host & game entertainer', titleHi: 'कस्टमाइज्ड केक ऑर्डर करें, एंकर व मैजिशियन/गेम होस्ट बुक करें', phase: 'mid-term' },
      { daysBefore: 15, titleEn: 'Send digital invitations, track RSVPs & order theme decor props', titleHi: 'डिजिटल निमंत्रण भेजें व थीम डेकोरेशन सामग्री ऑर्डर करें', phase: 'short-term' },
      { daysBefore: 7, titleEn: 'Purchase return gift bags, party favors & confirm kid-friendly menu items', titleHi: 'रिटर्न गिफ्ट्स खरीदें एवं बच्चों के अनुकूल भोजन मेनू पक्का करें', phase: 'final-week' },
      { daysBefore: 2, titleEn: 'Confirm cake delivery schedule, verify sound system & balloon setup timing', titleHi: 'केक डिलीवरी समय एवं साउंड-बैलून सज्जा समय की पुष्टि करें', phase: 'final-days' },
      { daysBefore: 0, titleEn: 'Celebration Day: Welcome guests, cut cake, play party games & rejoice!', titleHi: 'जन्मदिन का दिन: मेहमानों का स्वागत, केक कटिंग व मौज-मस्ती!', phase: 'event-day' },
    ];
  } else {
    // Community & Festival Event
    rawMilestones = [
      { daysBefore: 60, titleEn: 'Form organizing committee, select venue grounds & submit civic/police permits', titleHi: 'आयोजन समिति बनाएं, मैदान तय करें व सरकारी/पुलिस अनुमति आवेदन करें', phase: 'long-term' },
      { daysBefore: 40, titleEn: 'Invite community performers, announce competition rules & secure event sponsors', titleHi: 'स्थानीय कलाकारों को आमंत्रित करें, प्रतियोगिता नियम व स्पॉन्सरशिप तय करें', phase: 'mid-term' },
      { daysBefore: 25, titleEn: 'Book stage truss, PA sound system, backup diesel generator & eco-friendly meal vendor', titleHi: 'स्टेज, साउंड सिस्टम, जनरेटर बैकअप व महाप्रसाद कैटरर बुक करें', phase: 'short-term' },
      { daysBefore: 10, titleEn: 'Review fire safety, parking logistics, volunteer badges & first-aid counter', titleHi: 'अग्निशमन सुरक्षा, पार्किंग, स्वयंसेवक बैज व प्राथमिक उपचार केंद्र की समीक्षा करें', phase: 'final-week' },
      { daysBefore: 2, titleEn: 'Stage erection, lighting & sound trial, rangoli layout & volunteer briefing', titleHi: 'मंच निर्माण, साउंड टेस्टिंग, रंगोली तैयारी व स्वयंसेवकों को निर्देश', phase: 'final-days' },
      { daysBefore: 0, titleEn: 'Event Day: Grand inauguration, cultural performances, community feast & harmony!', titleHi: 'उत्सव का दिन: भव्य शुभारंभ, सांस्कृतिक कार्यक्रम, महाप्रसाद एवं सौहार्द!', phase: 'event-day' },
    ];
  }

  // Calculate real dates and apply compression for short lead times
  const compressedStartNowTasks = [];
  const milestones = [];

  for (const m of rawMilestones) {
    if (m.daysBefore > leadTimeDays && m.daysBefore > 0) {
      // Time is compressed! Milestone was meant for earlier days.
      compressedStartNowTasks.push(m);
    } else {
      const milestoneDate = new Date(targetDate.getTime() - m.daysBefore * 86400000);
      const dateStr = milestoneDate.toISOString().slice(0, 10);
      milestones.push({
        daysBefore: m.daysBefore,
        date: dateStr,
        isUrgent: m.daysBefore === leadTimeDays,
        titleEn: m.titleEn,
        titleHi: m.titleHi,
        phase: m.phase,
      });
    }
  }

  // If there are compressed past tasks, create or prepend a "Start now" step!
  if (compressedStartNowTasks.length > 0) {
    const todayStr = referenceDate.toISOString().slice(0, 10);
    const combinedEn = `Start now (Compressed): ${compressedStartNowTasks.map(t => t.titleEn).join(' • ')}`;
    const combinedHi = `तुरंत शुरू करें (संक्षिप्त): ${compressedStartNowTasks.map(t => t.titleHi).join(' • ')}`;

    milestones.unshift({
      daysBefore: leadTimeDays,
      date: todayStr,
      isStartNow: true,
      isUrgent: true,
      titleEn: combinedEn,
      titleHi: combinedHi,
      phase: 'urgent-immediate',
    });
  }

  return {
    leadTimeDays,
    eventDate,
    milestones,
  };
}

/**
 * Generates tailored vendor checklists matching specific constraints.
 */
export function generateChecklists({ eventType, setting, dietary = [], children = false, tradition }) {
  const isOutdoor = setting === 'outdoor' || setting === 'hybrid';
  const hasJain = dietary.includes('jain') || tradition === 'jain';
  const hasSatvik = dietary.includes('satvik');
  const hasVegan = dietary.includes('vegan');

  const checklists = [
    {
      category: 'Venue & Infrastructure',
      categoryHi: 'वेन्यू एवं बुनियादी ढांचा',
      items: [
        { id: 'v1', textEn: 'Review venue hall capacity, entry-exit gates, and dedicated parking layout', textHi: 'वेन्यू क्षमता, निकास द्वार और पार्किंग व्यवस्था की समीक्षा' },
        { id: 'v2', textEn: 'Confirm air-conditioning or ambient ventilation performance during peak hours', textHi: 'वातानुकूलन (AC) या हवादार व्यवस्था की जांच' },
        ...(isOutdoor
          ? [
              { id: 'v_out1', textEn: 'Waterproof Shamiana: Ensure tarpaulin canopy covering all guest dining and stage areas', textHi: 'वाटरप्रूफ शामियाना: भोजन व मंच स्थल पर तिरपाल व वर्षा सुरक्षा' },
              { id: 'v_out2', textEn: 'Silent Generator: Confirm backup diesel generator with automated UPS for sound and lighting', textHi: 'मूक जनरेटर: लाइट व साउंड के लिए ऑटो-कट डीजल जनरेटर बैकअप' },
              { id: 'v_out3', textEn: 'Ground Leveling: Check wooden platforming or turf carpeting over wet/uneven soil', textHi: 'फर्श समतलन: लॉन में गीली/ऊबड़-खाबड़ मिट्टी पर कार्पेट व लकड़ी का प्लेटफॉर्म' },
            ]
          : []),
      ],
    },
    {
      category: 'Catering & Dining Logistics',
      categoryHi: 'खानपान एवं भोजन व्यवस्था',
      items: [
        { id: 'c1', textEn: 'Finalize welcome drinks, appetizers, main course buffet, and sweet variety', textHi: 'स्वागत पेय, स्टार्टर्स, मुख्य भोजन और मिठाइयों की अंतिम सूची' },
        { id: 'c2', textEn: 'Confirm server uniforms, hygiene gloves, and adequate trash disposal bins', textHi: 'कैटरिंग स्टाफ की पोशाक, स्वच्छता और कूड़ेदान व्यवस्था' },
        ...(hasJain
          ? [
              { id: 'c_jain', textEn: 'Jain Food Isolation: Ensure dedicated preparation counter, root-vegetable free oils, and separate cutlery', textHi: 'जैन भोजन शुद्धि: अलग रसोई काउंटर, कंदमूल-रहित तेल और अलग बर्तन' },
            ]
          : []),
        ...(hasSatvik
          ? [
              { id: 'c_satvik', textEn: 'Satvik Verification: Zero onion, zero garlic, rock salt option, and pure desi ghee preparation', textHi: 'सात्विक भोजन नियम: प्याज-लहसुन रहित, सेंधा नमक और शुद्ध देसी घी में निर्माण' },
            ]
          : []),
        ...(hasVegan
          ? [
              { id: 'c_vegan', textEn: 'Vegan Items: Dairy-free sweets and plant-based milk tea/coffee station clearly labeled', textHi: 'वीगन विकल्प: दुग्ध-रहित मिठाइयां और चाय/कॉफी के स्पष्ट लेबल' },
            ]
          : []),
        ...(children
          ? [
              { id: 'c_kids', textEn: 'Kids Menu: Non-spicy finger food buffet (mini pizzas, mild noodles, potato wedges, fresh fruit cups)', textHi: 'बच्चों का मेनू: कम तीखे स्नैक्स (मिनी पिज्जा, नूडल्स, आलू वेजेस और फ्रूट कप)' },
            ]
          : []),
      ],
    },
    {
      category: 'Photography & Media',
      categoryHi: 'फोटोग्राफी एवं मीडिया',
      items: [
        { id: 'p1', textEn: 'Provide mandatory shot list (family elders, core rituals, candid emotions)', textHi: 'अनिवार्य फोटो सूची (वरिष्ठ परिजन, मुख्य रस्में, भावुक क्षण) प्रदान करें' },
        { id: 'p2', textEn: 'Confirm delivery timeline for raw previews, album selection, and 4K video teaser', textHi: 'रॉ फोटो, एल्बम चयन और 4K टीजर वीडियो देने की समय-सीमा तय करें' },
      ],
    },
    {
      category: 'Entertainment, Audio & Guest Safety',
      categoryHi: 'मनोरंजन, साउंड व अतिथि सुरक्षा',
      items: [
        { id: 'e1', textEn: 'Check sound decibel compliance and local government cutoff timing permissions', textHi: 'ध्वनि तीव्रता और स्थानीय प्रशासन की समय-सीमा अनुमति सुनिश्चित करें' },
        ...(eventType === 'wedding'
          ? [
              { id: 'w_mandap', textEn: 'Mandap Fire Safety: Keep sand buckets and dry chemical extinguisher near Havan Kund', textHi: 'मंडप अग्नि सुरक्षा: हवन कुंड के पास रेत की बाल्टी व अग्निशामक यंत्र रखें' },
              { id: 'w_haldi', textEn: 'Haldi Care: Non-slip plastic flooring under seating to prevent slipping during water/turmeric play', textHi: 'हल्दी रस्म: पानी व हल्दी से फिसलन रोकने हेतु रबर/प्लास्टिक मैट' },
            ]
          : []),
        ...(children
          ? [
              { id: 'k_safety', textEn: 'Kids Play Zone: Soft-corner play area with dedicated supervisor and first-aid kit', textHi: 'बच्चों का सुरक्षित कोना: सुरक्षित खिलौने, देखभालकर्ता और प्राथमिक चिकित्सा किट' },
              { id: 'k_fun', textEn: 'Book certified balloon artist / face painter with child-safe hypoallergenic colors', textHi: 'बच्चों के लिए सुरक्षित गुब्बारा कलाकार या टैटू आर्टिस्ट' },
            ]
          : []),
      ],
    },
  ];

  if (eventType === 'wedding' && tradition) {
    const traditionData = getTradition(tradition);
    if (traditionData && Array.isArray(traditionData.vendorAdditions) && traditionData.vendorAdditions.length > 0) {
      checklists.push({
        category: `Tradition Specifics: ${traditionData.nameEn}`,
        categoryHi: `परंपरा विवरण: ${traditionData.nameHi}`,
        items: traditionData.vendorAdditions,
      });
    }
  }

  return checklists;
}

/**
 * Generates proactive planning warnings based on guest count, budget per head, lead time, and venue setting.
 */
export function generateWarnings({ eventType, budget, guestCount, leadTimeDays, setting, tradition }) {
  const warnings = [];
  const perGuest = Math.round(budget / (guestCount || 1));

  // 1. Budget per guest warning
  if (eventType === 'wedding' && perGuest < 800) {
    warnings.push({
      type: 'budget',
      level: 'high',
      textEn: `Budget allocation is ₹${perGuest.toLocaleString('en-IN')} per guest. For a wedding covering venue, multi-course feast, and decor, this is tight. Prioritize catering and simplify stage decor.`,
      textHi: `प्रति अतिथि बजट ₹${perGuest.toLocaleString('hi-IN')} है। विवाह में वेन्यू, भोजन और मंडप के लिए यह सीमित है। भोजन को प्राथमिकता दें व सादा डेकोरेशन चुनें।`,
    });
  } else if (eventType === 'birthday' && perGuest < 300) {
    warnings.push({
      type: 'budget',
      level: 'medium',
      textEn: `Budget allocation is ₹${perGuest.toLocaleString('en-IN')} per guest. Consider a society clubhouse or home venue with DIY balloon styling to save on rental costs.`,
      textHi: `प्रति अतिथि बजट ₹${perGuest.toLocaleString('hi-IN')} है। वेन्यू किराया बचाने के लिए घर या क्लब हाउस में आयोजन की सलाह दी जाती है।`,
    });
  } else if (eventType === 'community' && perGuest < 200) {
    warnings.push({
      type: 'budget',
      level: 'medium',
      textEn: `Per-attendee budget is ₹${perGuest.toLocaleString('en-IN')}. Involve community volunteers for food distribution and stage management to optimize costs.`,
      textHi: `प्रति व्यक्ति बजट ₹${perGuest.toLocaleString('hi-IN')} है। खर्च नियंत्रित रखने के लिए स्वयंसेवकों की मदद से भोजन वितरण और व्यवस्था करें।`,
    });
  }

  // 2. Lead time warnings
  if (eventType === 'wedding' && leadTimeDays < 30) {
    warnings.push({
      type: 'leadTime',
      level: 'high',
      textEn: `Wedding date is only ${leadTimeDays} days away! Premium venues and top caterers may be booked. Early tasks have been merged into "Start now".`,
      textHi: `विवाह में केवल ${leadTimeDays} दिन शेष हैं! लोकप्रिय वेन्यू व कैटरर व्यस्त हो सकते हैं। शुरुआती कार्यों को 'तुरंत शुरू करें' में जोड़ दिया गया है।`,
    });
  } else if (eventType === 'birthday' && leadTimeDays < 7) {
    warnings.push({
      type: 'leadTime',
      level: 'high',
      textEn: `Only ${leadTimeDays} days remaining! Order customized centerpiece cake and confirm entertainer immediately today.`,
      textHi: `केवल ${leadTimeDays} दिन बचे हैं! आज ही स्पेशल केक का ऑर्डर दें और कलाकार/एंकर बुक करें।`,
    });
  } else if (eventType === 'community' && leadTimeDays < 15) {
    warnings.push({
      type: 'leadTime',
      level: 'high',
      textEn: `Only ${leadTimeDays} days remaining! Fast-track municipal sound and police permissions immediately.`,
      textHi: `केवल ${leadTimeDays} दिन शेष हैं! पुलिस व ध्वनि अनुमति के लिए तुरंत आवेदन करें।`,
    });
  }

  // 3. Outdoor weather warning
  if (setting === 'outdoor' || setting === 'hybrid') {
    warnings.push({
      type: 'weather',
      level: 'medium',
      textEn: 'Outdoor celebration chosen: Weather-proof canopy, power generator backup, and floor leveling are strongly recommended.',
      textHi: 'आउटडोर उत्सव चुना गया है: वाटरप्रूफ शामियाना, जनरेटर बैकअप और फर्श समतलन की तैयारी अवश्य रखें।',
    });
  }

  // 4. Large crowd warning
  if (guestCount > 400) {
    warnings.push({
      type: 'crowd',
      level: 'info',
      textEn: `Hosting ${guestCount} guests: Setup at least 3 separate buffet lines and assign parking volunteers to prevent bottlenecks.`,
      textHi: `${guestCount} मेहमानों के लिए: कम से कम 3 अलग भोजन काउंटर बनाएं और पार्किंग व्यवस्था हेतु स्वयंसेवक तैनात करें।`,
    });
  }

  // 5. Wedding tradition notice and dietary guidance
  if (eventType === 'wedding' && tradition) {
    const traditionData = getTradition(tradition);
    if (traditionData) {
      warnings.push({
        type: 'tradition',
        level: 'info',
        textEn: TRADITION_DISCLAIMER.en,
        textHi: TRADITION_DISCLAIMER.hi,
      });
      if (tradition === 'jain') {
        warnings.push({
          type: 'dietary',
          level: 'info',
          textEn: `Jain Wedding Tradition: ${traditionData.foodNotes.en}`,
          textHi: `जैन विवाह परंपरा: ${traditionData.foodNotes.hi}`,
        });
      }
    }
  }

  return warnings;
}

/**
 * Calculates actual spend variance against budgeted amounts.
 */
export function calculateSpendTracker(categories, actualSpendMap = {}) {
  let totalBudgeted = 0;
  let totalActual = 0;

  const trackedCategories = categories.map(cat => {
    const budgeted = cat.amount;
    const actual = Number(actualSpendMap[cat.id] || 0);
    const variance = budgeted - actual;
    totalBudgeted += budgeted;
    totalActual += actual;

    let status = 'on-track';
    if (actual > budgeted * 1.05) {
      status = 'over';
    } else if (actual < budgeted * 0.95 && actual > 0) {
      status = 'under';
    }

    return {
      id: cat.id,
      nameEn: cat.nameEn,
      nameHi: cat.nameHi,
      budgeted,
      actual,
      variance,
      status,
    };
  });

  return {
    totalBudgeted,
    totalActual,
    totalRemaining: totalBudgeted - totalActual,
    categories: trackedCategories,
  };
}

/**
 * Generates an interactive ceremony & event pathway with timings, dress codes, and ceremonial highlights.
 */
export function generateCeremonyPathway(optsOrEventType, traditionArg) {
  const isObj = typeof optsOrEventType === 'object' && optsOrEventType !== null;
  const eventType = isObj ? optsOrEventType.eventType : optsOrEventType;
  const tradition = isObj ? optsOrEventType.tradition : traditionArg;
  const style = isObj ? optsOrEventType.style : undefined;
  const notes = isObj ? (optsOrEventType.notes || '') : '';

  if (eventType === 'wedding') {
    const traditionData = getTradition(tradition);
    if (traditionData && Array.isArray(traditionData.pathway) && traditionData.pathway.length > 0) {
      return traditionData.pathway;
    }

    return [
      {
        id: 'haldi',
        icon: '☀️',
        nameEn: 'Haldi Utsav',
        nameHi: 'हल्दी उत्सव',
        timingEn: 'Morning (10:00 AM - 1:00 PM)',
        timingHi: 'प्रातः (10:00 पूर्वाह्न - 1:00 अपराह्न)',
        dressCodeEn: 'Auspicious Yellow / Mustard Kurta & Sarees',
        dressCodeHi: 'पीताम्बरी पीला / सरसों रंग के कुर्ते व साड़ियां',
        highlightEn: 'Marigold petal shower, brass urli seating, splash-proof flooring, hot jalebi & kachori counter.',
        highlightHi: 'गेंदे की पंखुड़ियों की वर्षा, पीतल की उरली, वाटरप्रूफ मैटिंग, गरम जलेबी-कचौड़ी काउंटर।',
      },
      {
        id: 'mehendi',
        icon: '🌿',
        nameEn: 'Mehendi Ceremony',
        nameHi: 'मेहंदी रस्म',
        timingEn: 'Afternoon (3:00 PM - 7:00 PM)',
        timingHi: 'दोपहर (3:00 अपराह्न - 7:00 सायं)',
        dressCodeEn: 'Pastel Green / Floral Lehengas & Kurtas',
        dressCodeHi: 'धानी हरा / फ्लोरल लहंगे व कुर्ते',
        highlightEn: 'Live henna artists, folk dholak circle, bangles & floral jewelry gifting, live chaat bazaar.',
        highlightHi: 'कुशल मेहंदी आर्टिस्ट, पारंपरिक ढोलक गीत, चूड़ी व गजरा कॉर्नर, चटपटा चाट बाजार।',
      },
      {
        id: 'sangeet',
        icon: '🎶',
        nameEn: 'Sangeet & Dance Night',
        nameHi: 'संगीत एवं नृत्य निशा',
        timingEn: 'Evening (7:30 PM - Midnight)',
        timingHi: 'सायं (7:30 सायं - मध्यरात्रि)',
        dressCodeEn: 'Glamorous Royal Velvet / Indo-Western',
        dressCodeHi: 'भव्य वेलवेट, शिमर शेरवानी व इंडो-वेस्टर्न',
        highlightEn: 'Choreographed bride vs groom family flash mob, LED DJ stage, mocktail bar, midnight dessert spread.',
        highlightHi: 'पारिवारिक डांस मुकाबला, आधुनिक डीजे लाइट मंच, मॉकसेल बार व स्वादिष्ट मिठाइयां।',
      },
      {
        id: 'vivah',
        icon: '🪔',
        nameEn: 'Auspicious Vivah & Mandap Pheras',
        nameHi: 'पावन विवाह संस्कार एवं सात फेरे',
        timingEn: 'Auspicious Muhurat / Evening',
        timingHi: 'शुभ लग्न मुहूर्त / सायं',
        dressCodeEn: 'Traditional Banarasi Silk, Kanjeevaram & Achkan',
        dressCodeHi: 'पारंपरिक बनारसी सिल्क, कांजीवरम व अचकन',
        highlightEn: 'Vedic Havan with fire safety, fragrant mogra mandap, classical shehnai, pure satvik feast.',
        highlightHi: 'वैदिक मंत्रोच्चार, सुगंधित मोगरा मंडप, मंगल शहनाई वादन, शुद्ध सात्विक महाभोज।',
      },
      {
        id: 'reception',
        icon: '🥂',
        nameEn: 'Grand Reception & Blessings',
        nameHi: 'भव्य आशीर्वाद समारोह (रिसेप्शन)',
        timingEn: 'Post-Vivah Evening (7:30 PM Onward)',
        timingHi: 'विवाह उपरांत सायं (7:30 बजे से)',
        dressCodeEn: 'Regal Formal Black-tie or Heritage Traditional',
        dressCodeHi: 'शाही फॉर्मल परिधान या पारंपरिक वेशभूषा',
        highlightEn: 'Grand couple entry, candid photo stage, multi-cuisine gourmet dinner, personalized return gifts.',
        highlightHi: 'भव्य युगल प्रवेश, स्टेज फोटोग्राफी, बहु-व्यंजन दावत एवं स्मृति उपहार भेंट।',
      },
    ];
  } else if (eventType === 'birthday') {
    return [
      {
        id: 'welcome',
        icon: '📸',
        nameEn: 'Welcome & Polaroid Photo Wall',
        nameHi: 'स्वागत एवं फोटो वॉल',
        timingEn: 'First Hour (5:00 PM - 6:00 PM)',
        timingHi: 'प्रथम चरण (5:00 सायं - 6:00 सायं)',
        dressCodeEn: 'Vibrant Party Casuals / Theme Costumes',
        dressCodeHi: 'रंग-बिरंगे पार्टी वस्त्र / थीम पोशाक',
        highlightEn: 'Custom neon backdrop, signature mocktails, instant photo souvenir guestbook.',
        highlightHi: 'नियॉन फोटोबूथ, स्वागत पेय और पोलरॉइड फोटो विशेस बुक।',
      },
      {
        id: 'games',
        icon: '🎩',
        nameEn: 'Magic Show & Interactive Arena',
        nameHi: 'मैजिक शो एवं पार्टी गेम्स',
        timingEn: 'Evening (6:00 PM - 7:15 PM)',
        timingHi: 'सायं (6:00 सायं - 7:15 सायं)',
        dressCodeEn: 'Comfortable Party Wear',
        dressCodeHi: 'आरामदायक पार्टी वस्त्र',
        highlightEn: 'Professional magician, balloon sculpting, musical statues, and exciting competition prizes.',
        highlightHi: 'जादूगर, गुब्बारा कला, म्यूजिकल चेयर व बच्चों के खेल पुरस्कार।',
      },
      {
        id: 'cake',
        icon: '🎂',
        nameEn: 'Centerpiece Cake Cutting',
        nameHi: 'थीम केक कटिंग सेरेमनी',
        timingEn: 'Highlight (7:15 PM - 7:45 PM)',
        timingHi: 'मुख्य समय (7:15 सायं - 7:45 सायं)',
        dressCodeEn: 'Party Best',
        dressCodeHi: 'शानदार पार्टी परिधान',
        highlightEn: 'Customized designer cake, cold pyro sparklers, confetti shower, happy birthday chorus.',
        highlightHi: 'विशेष थीम केक, कोल्ड स्पार्कलर्स, कंफेटी बौछार व सामूहिक बधाई गान।',
      },
      {
        id: 'dinner',
        icon: '🎁',
        nameEn: 'Celebratory Feast & Goodie Bags',
        nameHi: 'पार्टी दावत एवं रिटर्न गिफ्ट्स',
        timingEn: 'Dinner (7:45 PM Onward)',
        timingHi: 'डिनर (7:45 सायं से)',
        dressCodeEn: 'Party Best',
        dressCodeHi: 'पार्टी वस्त्र',
        highlightEn: 'Hot appetizers, kid-friendly buffet counters, handcrafted theme favor bags for all guests.',
        highlightHi: 'गरमा-गरम स्टार्टर्स, बच्चों का मनपसंद भोजन व रिटर्न गिफ्ट बैग्स।',
      },
    ];
  } else {
    // Community
    return [
      {
        id: 'inauguration',
        icon: '🪔',
        nameEn: 'Inauguration & Deep Prajjwalan',
        nameHi: 'शुभारंभ एवं दीप प्रज्वलन',
        timingEn: 'Morning (9:00 AM - 10:30 AM)',
        timingHi: 'प्रातः (9:00 पूर्वाह्न - 10:30 पूर्वाह्न)',
        dressCodeEn: 'Traditional Indian Ethnic',
        dressCodeHi: 'पारंपरिक भारतीय परिधान',
        highlightEn: 'Auspicious lamp lighting by elders, Ganesh Vandana, community banner unveiling.',
        highlightHi: 'वरिष्ठ नागरिकों द्वारा दीप प्रज्वलन, गणेश वंदना व स्वागत उद्बोधन।',
      },
      {
        id: 'cultural',
        icon: '🎭',
        nameEn: 'Cultural Stage & Competitions',
        nameHi: 'सांस्कृतिक मंच एवं प्रतियोगिताएं',
        timingEn: 'Midday (10:30 AM - 1:30 PM)',
        timingHi: 'दोपहर (10:30 पूर्वाह्न - 1:30 अपराह्न)',
        dressCodeEn: 'Festival Attire',
        dressCodeHi: 'उत्सव परिधान',
        highlightEn: 'Folk dance performances, colony youth talents, rangoli & lighting contest judging.',
        highlightHi: 'लोक नृत्य, बच्चों की प्रस्तुतियां, रंगोली व सजावट प्रतियोगिता।'
      },
      {
        id: 'bhog',
        icon: '🍲',
        nameEn: 'Community Mahaprasad Feast',
        nameHi: 'सामुदायिक महाप्रसाद / सहभोज',
        timingEn: 'Feast (1:30 PM - 3:30 PM)',
        timingHi: 'दोपहर भोज (1:30 अपराह्न - 3:30 अपराह्न)',
        dressCodeEn: 'Traditional Ethnic',
        dressCodeHi: 'पारंपरिक वस्त्र',
        highlightEn: 'Pure satvik langar / mahaprasad served on eco leaf plates by community volunteers.',
        highlightHi: 'पत्तल-दोने पर स्वयंसेवकों द्वारा परोसा गया शुद्ध सात्विक महाप्रसाद।',
      },
      {
        id: 'felicitation',
        icon: '🏆',
        nameEn: 'Awards & Community Harmony Aarti',
        nameHi: 'सम्मान समारोह एवं महाआरती',
        timingEn: 'Closing (4:00 PM - 5:30 PM)',
        timingHi: 'समापन (4:00 अपराह्न - 5:30 सायं)',
        dressCodeEn: 'Traditional Ethnic',
        dressCodeHi: 'पारंपरिक वस्त्र',
        highlightEn: 'Volunteer appreciation badges, contest prize distribution, unified community prayer.',
        highlightHi: 'स्वयंसेवक सम्मान, प्रतियोगिता पुरस्कार वितरण व सामूहिक मंगल आरती।',
      },
    ];
  }
}
