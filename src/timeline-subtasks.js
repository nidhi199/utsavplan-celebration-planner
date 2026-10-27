/**
 * Timeline Sub-tasks Module
 * Provides detailed, structured sub-tasks for each milestone across Weddings, Birthdays,
 * and Community Celebrations in both English and Hindi.
 */

export function getMilestoneSubtasks(milestone, eventType = 'wedding') {
  if (!milestone) return [];

  // If milestone already provides subtasks, return them
  if (Array.isArray(milestone.subtasks) && milestone.subtasks.length > 0) {
    return milestone.subtasks;
  }

  // 1. Compressed / Urgent Start Now milestone
  if (milestone.isStartNow) {
    return [
      {
        id: 'sn_venue',
        textEn: 'Fast-track venue inquiries: Call top 3 venue choices immediately to lock date and deposit.',
        textHi: 'वेन्यू बुकिंग तुरंत पक्की करें: शीर्ष 3 वेन्यू को कॉल कर तारीख व अग्रिम राशि तय करें।',
      },
      {
        id: 'sn_catering',
        textEn: 'Confirm key caterer with ready menu packages and reserve kitchen team.',
        textHi: 'विश्वसनीय कैटरर से संपर्क कर तैयार भोजन पैकेज व रसोई दल तुरंत बुक करें।',
      },
      {
        id: 'sn_invites',
        textEn: 'Dispatch instant digital invitations via WhatsApp with RSVP reply links.',
        textHi: 'स्थान विवरण व RSVP लिंक सहित तुरंत डिजिटल निमंत्रण व्हाट्सएप पर भेजें।',
      },
      {
        id: 'sn_roles',
        textEn: 'Delegate ceremony responsibilities to immediate family members via shared action list.',
        textHi: 'पारिवारिक सदस्यों को तुरंत मुख्य जिम्मेदारियां व कार्य सूची सौंपें।',
      },
    ];
  }

  const days = typeof milestone.daysBefore === 'number' ? milestone.daysBefore : 0;

  // 2. Wedding Milestones
  if (eventType === 'wedding') {
    if (days >= 150) {
      return [
        {
          id: 'w180_muhurat',
          textEn: 'Consult Vedic astrologer / Pandit to finalize auspicious Lagna Muhurat date and timing.',
          textHi: 'शुभ विवाह लग्न मुहूर्त एवं समय निर्धारण हेतु ज्योतिषी/पंडित जी से परामर्श करें।',
        },
        {
          id: 'w180_shortlist',
          textEn: 'Shortlist and tour 3-4 banquet halls or heritage mandap venues with suitable capacity.',
          textHi: 'पर्याप्त क्षमता वाले 3-4 बैंक्वेट हॉल अथवा हेरिटेज मंडप स्थलों का दौरा करें।',
        },
        {
          id: 'w180_rules',
          textEn: 'Verify venue parking capacity, generator backup, and municipal sound restrictions.',
          textHi: 'पार्किंग क्षमता, जनरेटर बैकअप एवं ध्वनि संबंधी स्थानीय नियमों की जांच करें।',
        },
        {
          id: 'w180_contract',
          textEn: 'Review rental contract terms, pay advance booking deposit, and secure receipt.',
          textHi: 'अनुबंध की शर्तों की समीक्षा कर अग्रिम बुकिंग राशि जमा करें व रसीद लें।',
        },
      ];
    }
    if (days >= 100) {
      return [
        {
          id: 'w120_tasting',
          textEn: 'Conduct catering tasting sessions to finalize multi-cuisine buffet and live counters.',
          textHi: 'विभिन्न व्यंजनों व लाइव काउंटरों के चयन हेतु कैटरिंग टेस्टिंग सत्र रखें।',
        },
        {
          id: 'w120_diet',
          textEn: 'Establish separate cooking areas and dedicated cutlery for Jain / Satvik food.',
          textHi: 'जैन व सात्विक भोजन हेतु पृथक रसोई काउंटर और अलग बर्तनों की व्यवस्था सुनिश्चित करें।',
        },
        {
          id: 'w120_photo',
          textEn: 'Review wedding photographer and videographer portfolios for candid & drone shots.',
          textHi: 'कैंडिड और ड्रोन फोटोग्राफी/वीडियोग्राफी के पोर्टफोलियो की समीक्षा करें।',
        },
        {
          id: 'w120_contract',
          textEn: 'Lock photographer contract detailing deliverable milestones and advance payments.',
          textHi: 'फोटो एल्बम एवं 4K वीडियो डिलीवरी की शर्तों संग अनुबंध फाइनल करें।',
        },
      ];
    }
    if (days >= 75) {
      return [
        {
          id: 'w90_mehendi',
          textEn: 'Book bridal Mehendi artist team using certified organic herbal henna.',
          textHi: 'ऑर्गेनिक हर्बल मेहंदी वाले प्रमाणित कलाकारों की टीम बुक करें।',
        },
        {
          id: 'w90_dj',
          textEn: 'Audition and hire Sangeet DJ or live band with concert sound truss and stage lighting.',
          textHi: 'संगीत नाइट के लिए डीजे/बैंड, हाई-पावर साउंड एवं स्टेज लाइटिंग फाइनल करें।',
        },
        {
          id: 'w90_cards',
          textEn: 'Finalize invitation card wording, print proofs, and animated digital e-invites.',
          textHi: 'विवाह निमंत्रण पत्र की भाषा, प्रिंट प्रूफ और डिजिटल ई-कार्ड तैयार करें।',
        },
        {
          id: 'w90_dance',
          textEn: 'Choreograph family dance performances and curate ceremony song playlists.',
          textHi: 'पारिवारिक नृत्य रिहर्सल शुरू करें एवं रस्मों के अनुसार गीतों की प्लेलिस्ट बनाएं।',
        },
      ];
    }
    if (days >= 45) {
      return [
        {
          id: 'w60_dispatch',
          textEn: 'Dispatch physical wedding cards to outstation relatives and elders with sweets.',
          textHi: 'दूर रहने वाले रिश्तेदारों व बड़ों को मिठाई संग पारंपरिक निमंत्रण पत्र भेजें।',
        },
        {
          id: 'w60_attire',
          textEn: 'Schedule fitting sessions for bridal lehenga, groom sherwani, and matching jewelry.',
          textHi: 'दुल्हन का लहंगा, दूल्हे की शेरवानी व आभूषणों की फिटिंग और मिलान करें।',
        },
        {
          id: 'w60_haldi',
          textEn: 'Design Haldi decor setup with marigold floral canopies, yellow drapes, and urlis.',
          textHi: 'हल्दी रस्म हेतु गेंदे के फूलों, पीले पर्दों और सजावटी उरली की रूपरेखा तय करें।',
        },
        {
          id: 'w60_maps',
          textEn: 'Send digital calendar reminders and location Google Map links to all guests.',
          textHi: 'सभी अतिथियों को डिजिटल कैलेंडर रिमाइंडर व वेन्यू लोकेशन लिंक प्रेषित करें।',
        },
      ];
    }
    if (days >= 20) {
      return [
        {
          id: 'w30_rsvp',
          textEn: 'Consolidate RSVP confirmations and update final headcount for caterer and decorator.',
          textHi: 'अतिथियों की पुष्टि (RSVP) संकलित कर कैटरर को अंतिम संख्या साझा करें।',
        },
        {
          id: 'w30_rooms',
          textEn: 'Book hotel room blocks and reserve airport/station pickup vehicles for travelers.',
          textHi: 'बाहर से आने वाले मेहमानों हेतु होटल कमरे व स्टेशन/एयरपोर्ट पिकअप गाड़ियां बुक करें।',
        },
        {
          id: 'w30_samagri',
          textEn: 'Procure authentic Vedic puja samagri (Gangajal, havan ingredients, dhoop, dry fruits).',
          textHi: 'पवित्र वैदिक पूजा सामग्री (गंगाजल, हवन सामग्री, धूप, पंचमेवा) एकत्रित करें।',
        },
        {
          id: 'w30_makeup',
          textEn: 'Confirm bridal makeup artist arrival time and schedule trial session.',
          textHi: 'ब्राइडल मेकअप आर्टिस्ट का आगमन समय तय करें और ट्रायल सेशन पूरा करें।',
        },
      ];
    }
    if (days >= 10) {
      return [
        {
          id: 'w14_walk',
          textEn: 'Walkthrough venue layout with decorator, head chef, and sound/light operators.',
          textHi: 'डेकोरेटर, मुख्य बावर्ची और साउंड टीम संग वेन्यू का संयुक्त मुआयना करें।',
        },
        {
          id: 'w14_permits',
          textEn: 'Verify municipal sound permissions, police clearance, and fire safety equipment.',
          textHi: 'ध्वनि प्रसारण अनुमति, स्थानीय पुलिस एनओसी और अग्निशामक सुरक्षा जांचें।',
        },
        {
          id: 'w14_generator',
          textEn: 'Test backup generator fuel level and automatic changeover switches.',
          textHi: 'जनरेटर में पर्याप्त डीजल व ऑटोमैटिक पॉवर बैकअप स्विच की जांच करें।',
        },
        {
          id: 'w14_vendors',
          textEn: 'Reconfirm delivery schedules with florist, fruit supplier, and dessert makers.',
          textHi: 'फूल विक्रेता, फल आपूर्तिकर्ता और मिष्ठान निर्माताओं से आपूर्ति समय पक्का करें।',
        },
      ];
    }
    if (days >= 5) {
      return [
        {
          id: 'w7_kit',
          textEn: 'Assemble bride/groom emergency styling kit (safety pins, sewing kit, stain remover).',
          textHi: 'इमरजेंसी किट तैयार करें (सेफ्टी पिन, सुई-धागा, दाग हटाने वाला स्प्रे, प्राथमिक दवाएं)।',
        },
        {
          id: 'w7_pocs',
          textEn: 'Assign specific family point-of-contacts for Baraat reception, dining, and logistics.',
          textHi: 'बारात स्वागत, भोजन व्यवस्था और वाहन प्रबंधन हेतु पारिवारिक जिम्मेदारियां सौंपें।',
        },
        {
          id: 'w7_envelopes',
          textEn: 'Prepare cash honorarium envelopes for Pandit ji, dhol players, and service tips.',
          textHi: 'पंडित जी की दक्षिणा, ढोल वादकों और सेवादारों के टिप हेतु लिफाफे तैयार रखें।',
        },
        {
          id: 'w7_pack',
          textEn: 'Pack ceremonial attire, footwear, and jewelry in clearly labeled travel bags.',
          textHi: 'प्रत्येक रस्म के वस्त्र, जूते व आभूषण लेबल वाले बैगों में सुरक्षित रखें।',
        },
      ];
    }
    if (days >= 1) {
      return [
        {
          id: 'w2_haldi',
          textEn: 'Supervise Haldi setup: lay anti-slip mats, floral flower shower baskets, and seating.',
          textHi: 'हल्दी स्थल निरीक्षण: फिसलन-रोधी मैट, फूलों की टोकरियां और बैठने की व्यवस्था जांचें।',
        },
        {
          id: 'w2_sound',
          textEn: 'Perform live audio test for Sangeet dance tracks and speech wireless microphones.',
          textHi: 'संगीत गीतों व वायरलेस माइक्रोफोन का लाइव साउंड टेस्ट पूरा करें।',
        },
        {
          id: 'w2_welcome',
          textEn: 'Set up welcome drink station and traditional Aarti/tilak greeting at venue entrance.',
          textHi: 'प्रवेश द्वार पर स्वागत पेय, आरती व पारंपरिक तिलक का प्रबंध करें।',
        },
        {
          id: 'w2_favors',
          textEn: 'Distribute Mehendi favor gifts and dry snacks to participating guests.',
          textHi: 'मेहंदी में उपस्थित अतिथियों को रिटर्न गिफ्ट्स और हल्के स्नैक्स वितरित करें।',
        },
      ];
    }
    // Event Day
    return [
      {
        id: 'w0_baraat',
        textEn: 'Coordinate morning Puja, Sehra Bandi, and grand Baraat procession assembly.',
        textHi: 'प्रातः कालीन पूजा, सेहरा बंदी और भव्य बारात प्रस्थान का समन्वय करें।',
      },
      {
        id: 'w0_varmala',
        textEn: 'Check Varmala stage readiness, pyrotechnic cold fire cues, and rose petal supplies.',
        textHi: 'वरमाला मंच, कोल्ड-पायरो स्पार्कल्स और गुलाब की पंखुड़ियों की तैयारी जांचें।',
      },
      {
        id: 'w0_pheras',
        textEn: 'Facilitate sacred Mandap Pheras, Kanyadaan rituals, and Sindoor ceremony with Pandit ji.',
        textHi: 'पवित्र मंडप फेरे, कन्यादान और सिंदूर दान रस्म पंडित जी के निर्देशानुसार पूर्ण कराएं।',
      },
      {
        id: 'w0_vidai',
        textEn: 'Coordinate emotional Vidai ceremony, gift loading, and final vendor reconciliations.',
        textHi: 'भावपूर्ण विदाई, उपहारों की सुरक्षित लोडिंग और अंतिम वेंडर भुगतान पूर्ण करें।',
      },
    ];
  }

  // 3. Birthday Milestones
  if (eventType === 'birthday') {
    if (days >= 35) {
      return [
        {
          id: 'b45_theme',
          textEn: 'Choose birthday theme, color palette, and party attire concept with the birthday star.',
          textHi: 'जन्मदिन की थीम, रंग संयोजन और ड्रेस कोड तय करें।',
        },
        {
          id: 'b45_venue',
          textEn: 'Book party hall, club clubhouse, or child-friendly garden lawn with safety fencing.',
          textHi: 'सुरक्षित परिसर वाला पार्टी हॉल, क्लब हाउस या गार्डन लॉन बुक करें।',
        },
        {
          id: 'b45_guests',
          textEn: 'Compile guest list of classmates, neighborhood friends, and family relatives.',
          textHi: 'सहपाठियों, मित्रों और पारिवारिक अतिथियों की सूची बनाएं।',
        },
      ];
    }
    if (days >= 20) {
      return [
        {
          id: 'b30_cake',
          textEn: 'Commission customized designer centerpiece birthday cake in requested flavor.',
          textHi: 'मनपसंद स्वाद व थीम में कस्टमाइज्ड डिजाइनर केक का ऑर्डर दें।',
        },
        {
          id: 'b30_emcee',
          textEn: 'Hire energetic anchor emcee, magician, or children game coordinator.',
          textHi: 'उत्साही एंकर, जादूगर अथवा बच्चों के खेल संचालक को बुक करें।',
        },
        {
          id: 'b30_music',
          textEn: 'Curate upbeat dance playlist and reserve portable sound amplifier with mic.',
          textHi: 'डांस म्यूजिक प्लेलिस्ट बनाएं और साउंड सिस्टम व माइक की व्यवस्था करें।',
        },
      ];
    }
    if (days >= 10) {
      return [
        {
          id: 'b15_invites',
          textEn: 'Send animated digital invitations with RSVP deadlines and theme instructions.',
          textHi: 'थीम विवरण व RSVP के साथ डिजिटल निमंत्रण भेजें।',
        },
        {
          id: 'b15_props',
          textEn: 'Order theme-based party props, photo booth frame, caps, and tableware.',
          textHi: 'थीम आधारित फोटो बूथ प्रॉप्स, पार्टी कैप्स और डिस्पोजेबल कटलरी ऑर्डर करें।',
        },
        {
          id: 'b15_games',
          textEn: 'Plan fun interactive games (musical chairs, freeze dance, pin the tail, trivia).',
          textHi: 'रोमांचक पार्टी गेम्स (म्यूजिकल चेयर, फ्रीज डांस, क्विज) की तैयारी करें।',
        },
      ];
    }
    if (days >= 5) {
      return [
        {
          id: 'b7_favors',
          textEn: 'Assemble themed return gift bags and winning prize hampers for games.',
          textHi: 'गेम विजेताओं के पुरस्कार और सभी बच्चों के लिए रिटर्न गिफ्ट्स पैक करें।',
        },
        {
          id: 'b7_menu',
          textEn: 'Confirm child-friendly menu (mild pasta, mini sliders, french fries, fruit cups).',
          textHi: 'बच्चों के अनुकूल हल्का भोजन मेनू (पास्ता, मिनी बर्गर, फ्रेंच फ्राइज) फाइनल करें।',
        },
        {
          id: 'b7_allergies',
          textEn: 'Check for food allergies or special dietary restrictions among attending kids.',
          textHi: 'बच्चों की किसी भी खाद्य एलर्जी अथवा विशेष जरूरतों की पुष्टि करें।',
        },
      ];
    }
    if (days >= 1) {
      return [
        {
          id: 'b2_delivery',
          textEn: 'Reconfirm cake delivery time and venue kitchen refrigeration storage space.',
          textHi: 'केक डिलीवरी का समय और वेन्यू पर फ्रिज स्टोरेज की पुष्टि करें।',
        },
        {
          id: 'b2_balloons',
          textEn: 'Schedule balloon arch decorator and background banner installation time.',
          textHi: 'बैलून आर्च और बैकड्रॉप बैनर लगाने वाले कारीगर का समय तय करें।',
        },
        {
          id: 'b2_camera',
          textEn: 'Charge camera batteries, clear mobile storage, and designate a family photographer.',
          textHi: 'कैमरा बैटरी चार्ज करें और फोटो खींचने हेतु पारिवारिक सदस्य को जिम्मेदारी दें।',
        },
      ];
    }
    // Event Day
    return [
      {
        id: 'b0_welcome',
        textEn: 'Set up welcome registration table with name badges and gift collecting bin.',
        textHi: 'प्रवेश द्वार पर नाम बैज व उपहार रखने की मेज तैयार करें।',
      },
      {
        id: 'b0_games',
        textEn: 'Facilitate party games, magician performance, and dance session.',
        textHi: 'पार्टी गेम्स, जादू के खेल और डांस गतिविधियों का संचालन करें।',
      },
      {
        id: 'b0_cake',
        textEn: 'Gather everyone around the cake table for candle blowing and birthday song.',
        textHi: 'मोमबत्ती बुझाने, केक कटिंग और जन्मदिन गीत हेतु सभी को एकत्रित करें।',
      },
      {
        id: 'b0_wrap',
        textEn: 'Serve snacks and cake, hand out return gift goodie bags, and thank attendees.',
        textHi: 'स्नैक्स परोसें, रिटर्न गिफ्ट्स बांटें और सभी का धन्यवाद करें।',
      },
    ];
  }

  // 4. Community & Festival Event
  if (days >= 45) {
    return [
      {
        id: 'c60_committee',
        textEn: 'Form festival organizing committee and appoint heads for stage, food, and safety.',
        textHi: 'उत्सव आयोजन समिति गठित करें और मंच, भोजन व सुरक्षा प्रभारियों की नियुक्ति करें।',
      },
      {
        id: 'c60_permits',
        textEn: 'Secure venue grounds approval and apply for local municipal and police permits.',
        textHi: 'सामुदायिक मैदान की अनुमति लें एवं पुलिस व नगर निगम में आवेदन करें।',
      },
      {
        id: 'c60_sponsors',
        textEn: 'Prepare event budget estimates and reach out to community sponsors and patrons.',
        textHi: 'आयोजन बजट तैयार करें और स्थानीय प्रायोजकों से संपर्क करें।',
      },
    ];
  }
  if (days >= 30) {
    return [
      {
        id: 'c40_artists',
        textEn: 'Invite cultural performers, folk dance groups, and keynote community speakers.',
        textHi: 'सांस्कृतिक दलों, लोक कलाकारों और मुख्य वक्ताओं को आमंत्रित करें।',
      },
      {
        id: 'c40_contest',
        textEn: 'Announce community competitions (rangoli, painting, devotional singing, sports).',
        textHi: 'प्रतियोगिताओं (रंगोली, चित्रकला, भजन, खेल) की घोषणा कर प्रविष्टियां आमंत्रित करें।',
      },
      {
        id: 'c40_awards',
        textEn: 'Order participant certificates, trophies, mementos, and volunteer badges.',
        textHi: 'सहभागी प्रमाण पत्र, स्मृति चिन्ह, ट्रॉफी और स्वयंसेवक बैज तैयार करवाएं।',
      },
    ];
  }
  if (days >= 15) {
    return [
      {
        id: 'c25_stage',
        textEn: 'Contract weather-safe stage truss, high-fidelity sound system, and floodlights.',
        textHi: 'वाटरप्रूफ स्टेज, साउंड सिस्टम और तेज लाइटों का अनुबंध करें।',
      },
      {
        id: 'c25_power',
        textEn: 'Reserve heavy-duty silent diesel generator with automatic UPS backup.',
        textHi: 'निर्बाध बिजली आपूर्ति हेतु मूक डीजल जनरेटर बैकअप बुक करें।',
      },
      {
        id: 'c25_feast',
        textEn: 'Finalize community Mahaprasad / Langar menu and eco-friendly leaf plates.',
        textHi: 'सामुदायिक महाप्रसाद/लंगर मेनू और पर्यावरण-अनुकूल पत्तल-दोने बुक करें।',
      },
    ];
  }
  if (days >= 5) {
    return [
      {
        id: 'c10_safety',
        textEn: 'Inspect venue fire extinguishers, medical first-aid booth, and emergency exit routes.',
        textHi: 'अग्निशामक यंत्रों, प्राथमिक उपचार केंद्र और आपातकालीन निकास मार्गों की जांच करें।',
      },
      {
        id: 'c10_banners',
        textEn: 'Put up community banners, road direction signage, and digital announcement flyers.',
        textHi: 'प्रचार बैनर, मार्गदर्शक बोर्ड और डिजिटल सूचना पत्रक लगाएं।',
      },
      {
        id: 'c10_parking',
        textEn: 'Organize volunteer traffic wardens and designate distinct parking zones.',
        textHi: 'स्वयंसेवक ट्रैफिक दल बनाएं और व्यवस्थित पार्किंग क्षेत्र चिह्नित करें।',
      },
    ];
  }
  if (days >= 1) {
    return [
      {
        id: 'c2_trial',
        textEn: 'Erect stage scaffolding, test line-array sound speakers, and tune stage monitors.',
        textHi: 'मंच निर्माण पूरा करें, साउंड स्पीकरों की टेस्टिंग और ऑडियो ट्यूनिंग करें।',
      },
      {
        id: 'c2_rangoli',
        textEn: 'Lay out traditional floral rangoli, welcome torans, and barricaded queue lanes.',
        textHi: 'पारंपरिक रंगोली, स्वागत तोरण और व्यवस्थित कतार बैरिकेड्स लगाएं।',
      },
      {
        id: 'c2_briefing',
        textEn: 'Conduct final volunteer briefing and emergency contingency protocol walkthrough.',
        textHi: 'स्वयंसेवकों की अंतिम बैठक लें और आपातकालीन दिशानिर्देश समझाएं।',
      },
    ];
  }

  // Community Event Day
  return [
    {
      id: 'c0_opening',
      textEn: 'Conduct ceremonial lamp lighting (Deep Prajwalan) and welcome address.',
      textHi: 'पारंपरिक दीप प्रज्वलन एवं स्वागत भाषण के साथ कार्यक्रम का उद्घाटन करें।',
    },
    {
      id: 'c0_events',
      textEn: 'Coordinate scheduled cultural performances, musical recitals, and prize ceremony.',
      textHi: 'सांस्कृतिक प्रस्तुतियां, संगीत कार्यक्रम और पुरस्कार वितरण संचालित करें।',
    },
    {
      id: 'c0_prasad',
      textEn: 'Oversee community Mahaprasad meal distribution with zero food wastage.',
      textHi: 'अन्न की बर्बादी रोके बिना सुव्यवस्थित महाप्रसाद वितरण का संचालन करें।',
    },
    {
      id: 'c0_cleanup',
      textEn: 'Execute organized post-event cleanup drive and express gratitude to volunteers.',
      textHi: 'सफाई अभियान चलाएं, अस्थायी ढांचे हटाएं और सभी कार्यकर्ताओं का आभार व्यक्त करें।',
    },
  ];
}
