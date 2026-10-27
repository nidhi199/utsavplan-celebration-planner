/**
 * Rule-based fallback celebration ideas generator.
 * Provides high-impact, culturally rich, context-specific ideas when AI providers are unavailable.
 */

export function generateRuleBasedIdeas({ eventType, style, setting, dietary = [], children = false, notes = '', tradition }) {
  const ideas = [];
  const lowerNotes = (notes || '').toLowerCase();

  if (eventType === 'wedding') {
    if (tradition === 'bengali') {
      ideas.push('Bengali Cultural Touch: Traditional Boron welcoming with conch shell (Shankha) blowing and Gaye Holud sweets.');
    } else if (tradition === 'punjabi-sikh') {
      ideas.push('Jaago & Laavan Seva: Evening Jaago march with decorated lit pots followed by Gurdwara Laavan hymn booklet.');
    } else if (tradition === 'muslim-nikah') {
      ideas.push('Royal Nikah Atmosphere: Calligraphed Nikahnama certificate keepsake and traditional attar (ittar) welcome favors.');
    } else if (tradition === 'christian') {
      ideas.push('Church & Reception Elegance: Personalized bilingual hymn sheets, tiered wedding cake, and sparkling couple toast.');
    } else if (tradition === 'jain') {
      ideas.push('Auspicious Jain Shubh Muhurat: Navkar Mantra opening ceremony, daylight Chauvihar feast, and pure satvik dining.');
    } else if (tradition === 'parsi') {
      ideas.push('Heritage Parsi Lagan: White chalk toran floral stage, Achu Michu welcoming, and celebratory banana-leaf Patra feast.');
    } else if (tradition === 'gujarati') {
      ideas.push('Garba & Dandiya Raas: High-energy live folk singers, mirrored chaniya-choli dress code, and midnight Fafda-Jalebi.');
    } else if (tradition === 'marwari') {
      ideas.push('Royal Mayra & Safa Heritage: Maternal uncle Mayra presentation, colorful Jodhpuri safas, and rich Dal Baati feast.');
    } else if (tradition === 'hindu-south') {
      ideas.push('Carnatic Melody & Oonjal: Decorated floral swing (Oonjal) ceremony accompanied by auspicious live Nadaswaram.');
    } else if (tradition === 'hindu-north') {
      ideas.push('Grand Baraat & Varmala: Live dhol procession, cold-pyro flower shower Varmala stage, and multi-cuisine royal buffet.');
    } else if (lowerNotes.includes('haldi') || style === 'traditional' || style === 'festive') {
      ideas.push('Haldi Sunshine Corner: Setup marigold photobooth backdrop with brass urlis and flower petal showers.');
    } else {
      ideas.push('Welcome Experience: Traditional floral entryway with live shehnai/nadaswaram and fragrant mogra wristbands.');
    }

    if (dietary.includes('jain') || dietary.includes('satvik') || tradition === 'jain') {
      ideas.push('Pure Satvik & Jain Live Counter: Fresh hot jalebis with rabri and customized root-free chaat bar.');
    } else {
      ideas.push('Regional Specialty Feast: Live regional delicacy stations with authentic clay-pot matka chai and seasonal sweets.');
    }

    if (lowerNotes.includes('sangeet') || style === 'royal' || style === 'modern') {
      ideas.push('Sangeet Face-Off: Choreographed bride vs groom family flash mob with personalized LED entry props.');
    } else {
      ideas.push('Musical Evening: Acoustic folk fusion singers accompanied by unplugged sufi beats for an intimate vibe.');
    }

    if (setting === 'outdoor' || setting === 'hybrid') {
      ideas.push('Fairy Light Canopy: Open-air dinner under twinkling warm fairy-light tunnels with lantern pathway markers.');
    } else {
      ideas.push('Mandap Grandeur: Regal mandap with pastel drapery, cascading tuberose garlands, and ambient warm spotlights.');
    }

    if (style === 'eco-friendly') {
      ideas.push('Eco Shubh Shuruat: Seed paper wedding favors with potted holy tulsi or succulent plants in terracotta pots.');
    } else if (children) {
      ideas.push('Young Royals Corner: Supervised kids craft & caricature table with child-friendly sweet cones.');
    } else {
      ideas.push('Memory Wall: Vintage string-and-pin polaroid photo gallery capturing the couple’s childhood memories.');
    }
  } else if (eventType === 'birthday') {
    if (children) {
      ideas.push('Interactive Game Arena: Professional magician and balloon sculptor with musical statue & treasure hunt.');
      ideas.push('Kid-Friendly Treat Cart: Mini sliders, popcorn station, non-messy fruit skewers, and vibrant mocktail shots.');
    } else {
      ideas.push('Retro Nostalgia Playlist: Curated hits from the guest of honor’s growing-up years with trivia quiz game.');
      ideas.push('Gourmet Grazing Table: Artisanal dips, spiced nuts, finger foods, and refreshing fruit infusion drinks.');
    }

    if (setting === 'outdoor') {
      ideas.push('Garden Picnic Setup: Boho floor cushions, low pallet tables, macrame hangings, and festoon string lights.');
    } else {
      ideas.push('Customized Photo Booth: Foil shimmer curtain backdrop, neon name sign, and fun celebratory props.');
    }

    if (style === 'eco-friendly') {
      ideas.push('Zero-Waste Goodies: Plantable seed pencils and fabric pouch gift packs instead of plastic party bags.');
    } else {
      ideas.push('Showstopper Centerpiece Cake: Multi-layer customized theme cake with sparkling cold-pyro candles.');
    }

    ideas.push('Memory Guestbook: Instant polaroid camera station where guests glue their candid picture with a handwritten wish.');
  } else {
    // Community & Festival Event
    ideas.push('Cultural Showcase: Open-stage platform for colony children and senior citizens traditional dance performances.');

    if (dietary.includes('jain') || dietary.includes('satvik')) {
      ideas.push('Prasadam & Community Bhog: Pure satvik community feast served on eco-friendly dried sal leaf pattals.');
    } else {
      ideas.push('Diverse Food Bazaar: Resident-run stalls showcasing regional delicacies from across India.');
    }

    if (setting === 'outdoor') {
      ideas.push('Festival Light & Rangoli Walkway: Multi-colored organic flower rangoli contest and solar-powered garden lanterns.');
    } else {
      ideas.push('Exhibition & Stalls: Display desks for community artisans, eco-crafts, and commemorative photo displays.');
    }

    if (children) {
      ideas.push('Community Kid Carnival: Traditional games zone (gilli danda, lagori, tug-of-war) with prize medals.');
    } else {
      ideas.push('Green Drive: Community sapling plantation drive and dry/wet waste segregation awareness booth.');
    }

    ideas.push('Digital Community Wall: Live screen displaying community member wishes and real-time social photo uploads.');
  }

  // Ensure up to 5 items, max 120 chars each
  return ideas.slice(0, 5).map(str => (str.length > 120 ? str.slice(0, 117) + '...' : str));
}
