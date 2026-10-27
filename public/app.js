/**
 * UtsavPlan Client Application
 * Pure JavaScript, zero framework, 100% textContent-based DOM rendering (no innerHTML).
 * Features:
 * - Theme switcher (Royal Rajwada, Udaipur Palace, Peacock Regalia, Boho Sundowner)
 * - Web Speech API Voice Input (Speech-to-Text in Hindi & English)
 * - Web Speech API Voice Readout (Text-to-Speech celebration summary)
 * - Interactive Ceremony & Event Pathway
 * - Proportional Stacked Budget Visualizer Strip & Per-guest metrics
 * - Vendor accountability with advance/due tracking in Spend Tracker
 * - One-click Print/PDF coordinator sheet
 * - Live recalculation with change summary banner
 * - Full bilingual (English / Hindi) support
 */

// Application state
const state = {
  lang: 'en',
  currentPlan: null,
  previousInputs: null,
  actualSpends: {},
  vendorDetails: {}, // { [catId]: { name, phone, advance } }
  checkedTasks: new Set(),
  translations: null,
  isListening: false,
  isSpeaking: false,
  speechRecognition: null,
  targetDraftIdForDelete: null,
  targetDraftIdForRename: null,
};

// Form element references
const form = document.getElementById('plannerForm');
const eventTypeEl = document.getElementById('eventType');
const weddingTraditionGroup = document.getElementById('weddingTraditionGroup');
const weddingTraditionEl = document.getElementById('weddingTradition');
const dateEl = document.getElementById('eventDate');
const guestCountEl = document.getElementById('guestCount');
const budgetEl = document.getElementById('budget');
const styleEl = document.getElementById('style');
const themeEl = document.getElementById('theme');
const settingEl = document.getElementById('setting');
const childrenEl = document.getElementById('children');
const notesEl = document.getElementById('notes');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const resetBtn = document.getElementById('resetBtn');
const formErrors = document.getElementById('formErrors');
const langToggleBtn = document.getElementById('langToggleBtn');

function updateWeddingTraditionVisibility() {
  if (weddingTraditionGroup) {
    const isWedding = eventTypeEl && eventTypeEl.value === 'wedding';
    weddingTraditionGroup.style.display = isWedding ? 'block' : 'none';
  }
}
const langToggleText = document.getElementById('langToggleText');
const exportIcsBtn = document.getElementById('exportIcsBtn');
const exportIcsBtnText = document.getElementById('exportIcsBtnText');
const headerPrintBtn = document.getElementById('headerPrintBtn');
const headerPrintBtnText = document.getElementById('headerPrintBtnText');
const headerVoiceBtn = document.getElementById('headerVoiceBtn');
const headerVoiceBtnText = document.getElementById('headerVoiceBtnText');
const cardVoiceBtn = document.getElementById('cardVoiceBtn');
const cardVoiceBtnText = document.getElementById('cardVoiceBtnText');
const voiceReadoutBtn = document.getElementById('voiceReadoutBtn');
const voiceReadoutBtnText = document.getElementById('voiceReadoutBtnText');
const headerShareBtn = document.getElementById('headerShareBtn');
const headerShareBtnText = document.getElementById('headerShareBtnText');
const shareModal = document.getElementById('shareModal');
const shareModalCloseBtn = document.getElementById('shareModalCloseBtn');
const modalDismissBtn = document.getElementById('modalDismissBtn');
const modalDismissBtnText = document.getElementById('modalDismissBtnText');
const shareLinkInput = document.getElementById('shareLinkInput');
const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
const copyShareLinkBtnText = document.getElementById('copyShareLinkBtnText');
const copyFeedback = document.getElementById('copyFeedback');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const downloadJsonBtnText = document.getElementById('downloadJsonBtnText');
const importJsonFileInput = document.getElementById('importJsonFileInput');
const uploadJsonBtnText = document.getElementById('uploadJsonBtnText');
const importFeedback = document.getElementById('importFeedback');
const sharedPlanBanner = document.getElementById('sharedPlanBanner');
const sharedPlanBannerText = document.getElementById('sharedPlanBannerText');
const welcomeGenerateBtn = document.getElementById('welcomeGenerateBtn');
const welcomeGenerateText = document.getElementById('welcomeGenerateText');
const expandAllBtn = document.getElementById('expandAllBtn');
const expandAllBtnText = document.getElementById('expandAllBtnText');
const collapseAllBtn = document.getElementById('collapseAllBtn');
const collapseAllBtnText = document.getElementById('collapseAllBtnText');
const voiceFeatureBox = document.getElementById('voiceFeatureBox');
const voiceCardSubtext = document.getElementById('voiceCardSubtext');
const voicePromptTitle = document.getElementById('voicePromptTitle');
const voiceStatus = document.getElementById('voiceStatus');
const changeBanner = document.getElementById('changeBanner');
const changeBannerText = document.getElementById('changeBannerText');

// Drafts elements
const headerDraftsBtn = document.getElementById('headerDraftsBtn');
const headerDraftsBtnText = document.getElementById('headerDraftsBtnText');
const draftsCountBadge = document.getElementById('draftsCountBadge');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const saveDraftBtnText = document.getElementById('saveDraftBtnText');
const draftStatusLive = document.getElementById('draftStatusLive');
const draftAlertBanner = document.getElementById('draftAlertBanner');
const draftAlertBannerText = document.getElementById('draftAlertBannerText');

const draftsModal = document.getElementById('draftsModal');
const draftsModalTitle = document.getElementById('draftsModalTitle');
const draftsModalCloseBtn = document.getElementById('draftsModalCloseBtn');
const draftsModalDesc = document.getElementById('draftsModalDesc');
const draftsStorageWarning = document.getElementById('draftsStorageWarning');
const draftsListContainer = document.getElementById('draftsListContainer');
const draftsModalDismissBtn = document.getElementById('draftsModalDismissBtn');
const draftsModalDismissBtnText = document.getElementById('draftsModalDismissBtnText');

const saveDraftModal = document.getElementById('saveDraftModal');
const saveDraftModalTitle = document.getElementById('saveDraftModalTitle');
const saveDraftModalCloseBtn = document.getElementById('saveDraftModalCloseBtn');
const lblDraftName = document.getElementById('lblDraftName');
const draftNameInput = document.getElementById('draftNameInput');
const saveDraftError = document.getElementById('saveDraftError');
const saveDraftCancelBtn = document.getElementById('saveDraftCancelBtn');
const saveDraftCancelBtnText = document.getElementById('saveDraftCancelBtnText');
const saveDraftConfirmBtn = document.getElementById('saveDraftConfirmBtn');
const saveDraftConfirmBtnText = document.getElementById('saveDraftConfirmBtnText');

const renameDraftModal = document.getElementById('renameDraftModal');
const renameDraftModalTitle = document.getElementById('renameDraftModalTitle');
const renameDraftModalCloseBtn = document.getElementById('renameDraftModalCloseBtn');
const lblRenameDraft = document.getElementById('lblRenameDraft');
const renameDraftInput = document.getElementById('renameDraftInput');
const renameDraftError = document.getElementById('renameDraftError');
const cancelRenameBtn = document.getElementById('cancelRenameBtn');
const cancelRenameBtnText = document.getElementById('cancelRenameBtnText');
const confirmRenameBtn = document.getElementById('confirmRenameBtn');
const confirmRenameBtnText = document.getElementById('confirmRenameBtnText');

const deleteDraftModal = document.getElementById('deleteDraftModal');
const deleteDraftModalTitle = document.getElementById('deleteDraftModalTitle');
const deleteDraftModalCloseBtn = document.getElementById('deleteDraftModalCloseBtn');
const confirmDeleteDraftText = document.getElementById('confirmDeleteDraftText');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const cancelDeleteBtnText = document.getElementById('cancelDeleteBtnText');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmDeleteBtnText = document.getElementById('confirmDeleteBtnText');

// Results container references
const welcomePlaceholder = document.getElementById('welcomePlaceholder');
const planContent = document.getElementById('planContent');
const planHeaderTitle = document.getElementById('planHeaderTitle');
const planHeaderSubtitle = document.getElementById('planHeaderSubtitle');
const warningsContainer = document.getElementById('warningsContainer');
const ideasSourceBadge = document.getElementById('ideasSourceBadge');
const ideasList = document.getElementById('ideasList');
const pathwayContainer = document.getElementById('pathwayContainer');
const budgetVisualizerStrip = document.getElementById('budgetVisualizerStrip');
const valPerGuest = document.getElementById('valPerGuest');
const budgetGrid = document.getElementById('budgetGrid');
const totalBudgetValue = document.getElementById('totalBudgetValue');
const trackerTableBody = document.getElementById('trackerTableBody');
const valTotalSpent = document.getElementById('valTotalSpent');
const valTotalAdvance = document.getElementById('valTotalAdvance');
const valTotalDue = document.getElementById('valTotalDue');
const valTotalRemaining = document.getElementById('valTotalRemaining');
const pillRemaining = document.getElementById('pillRemaining');
const timelineContainer = document.getElementById('timelineContainer');
const leadTimeBadge = document.getElementById('leadTimeBadge');
const checklistsContainer = document.getElementById('checklistsContainer');
const checklistProgressBadge = document.getElementById('checklistProgressBadge');

// Fetch translations from server
async function loadTranslations() {
  try {
    const res = await fetch('/api/i18n');
    if (res.ok) {
      const data = await res.json();
      state.translations = data.translations;
    }
  } catch (e) {
    console.warn('Could not load server translations, using client defaults.', e);
  }
}

function t(key, params = {}) {
  const dict = (state.translations && state.translations[state.lang]) || {};
  let text = dict[key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return text;
}

// Format numbers in Indian numbering system
function formatINR(num) {
  const n = Math.round(Number(num) || 0);
  return '₹' + n.toLocaleString(state.lang === 'hi' ? 'hi-IN' : 'en-IN');
}

// Set default event date to 90 days from today
function setDefaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  dateEl.value = `${yyyy}-${mm}-${dd}`;
  dateEl.min = new Date().toISOString().slice(0, 10);
}

// Client-side sanitization ensuring identical rules for typed and voice notes
function sanitizeClientNotes(input) {
  if (typeof input !== 'string') return '';
  let cleaned = input
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim();
  if (cleaned.length > 1000) {
    cleaned = cleaned.slice(0, 1000);
  }
  return cleaned;
}

// LocalStorage persistence for vendor data and actual spends (never sent to server)
function saveStoredSpendAndVendors() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('utsavplan_spends', JSON.stringify(state.actualSpends));
      localStorage.setItem('utsavplan_vendors', JSON.stringify(state.vendorDetails));
    }
  } catch (e) {
    console.warn('Could not save vendor/spend data to localStorage', e);
  }
}

function loadStoredSpendAndVendors() {
  try {
    if (typeof localStorage !== 'undefined') {
      const savedSpends = localStorage.getItem('utsavplan_spends');
      if (savedSpends) {
        state.actualSpends = JSON.parse(savedSpends) || {};
      }
      const savedVendors = localStorage.getItem('utsavplan_vendors');
      if (savedVendors) {
        state.vendorDetails = JSON.parse(savedVendors) || {};
      }
    }
  } catch (e) {
    console.warn('Could not load vendor/spend data from localStorage', e);
  }
}

// Collect form input data (strictly excludes client-side vendor details and actual payments)
function getFormData() {
  const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]:checked');
  const dietary = Array.from(dietaryCheckboxes).map(cb => cb.value);
  const isWedding = eventTypeEl && eventTypeEl.value === 'wedding';
  const tradition = (isWedding && weddingTraditionEl && weddingTraditionEl.value) ? weddingTraditionEl.value : null;

  return {
    eventType: eventTypeEl.value,
    tradition,
    date: dateEl.value,
    guestCount: parseInt(guestCountEl.value, 10) || 0,
    budget: parseInt(budgetEl.value, 10) || 0,
    style: styleEl.value,
    theme: themeEl.value,
    setting: settingEl.value,
    dietary,
    children: childrenEl.checked,
    notes: sanitizeClientNotes(notesEl.value),
  };
}

// Apply selected theme to document body
function applyTheme(themeName) {
  document.body.setAttribute('data-theme', themeName || 'royal-rajwada');
}

// Client-side form validation
function validateClientForm(data) {
  const errors = [];
  if (!data.eventType) errors.push(state.lang === 'hi' ? 'कृपया कार्यक्रम का प्रकार चुनें।' : 'Please select an event type.');
  if (!data.date) {
    errors.push(state.lang === 'hi' ? 'कृपया कार्यक्रम की तिथि चुनें।' : 'Please choose an event date.');
  } else {
    const selected = new Date(data.date + 'T00:00:00Z');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (selected < today) {
      errors.push(state.lang === 'hi' ? 'कार्यक्रम की तारीख आज या भविष्य की होनी चाहिए।' : 'Event date must be today or in the future.');
    }
  }
  if (!data.guestCount || data.guestCount < 1) {
    errors.push(state.lang === 'hi' ? 'अतिथियों की संख्या कम से कम 1 होनी चाहिए।' : 'Guest count must be at least 1.');
  }
  if (!data.budget || data.budget < 1000) {
    errors.push(state.lang === 'hi' ? 'कुल बजट कम से कम ₹1,000 होना चाहिए।' : 'Budget must be at least ₹1,000.');
  }
  return errors;
}

// Show/hide error messages
function displayErrors(errors) {
  while (formErrors.firstChild) {
    formErrors.removeChild(formErrors.firstChild);
  }

  if (errors.length === 0) {
    formErrors.style.display = 'none';
    return;
  }

  formErrors.style.display = 'block';
  const heading = document.createElement('strong');
  heading.textContent = t('validationErrorTitle');
  formErrors.appendChild(heading);

  const list = document.createElement('ul');
  list.style.marginTop = '0.4rem';
  list.style.paddingLeft = '1.2rem';

  errors.forEach(err => {
    const li = document.createElement('li');
    li.textContent = err;
    list.appendChild(li);
  });

  formErrors.appendChild(list);
  formErrors.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Detect and describe changes for live recalculation summary
function computeChangeSummary(oldInputs, newInputs) {
  if (!oldInputs) return '';
  const changes = [];

  if (oldInputs.guestCount !== newInputs.guestCount) {
    const diff = newInputs.guestCount - oldInputs.guestCount;
    const sign = diff > 0 ? `+${diff}` : `${diff}`;
    changes.push(state.lang === 'hi' 
      ? `मेहमान ${oldInputs.guestCount} से बदलकर ${newInputs.guestCount} (${sign})` 
      : `Guests updated to ${newInputs.guestCount} (${sign})`);
  }

  if (oldInputs.budget !== newInputs.budget) {
    changes.push(state.lang === 'hi'
      ? `बजट ${formatINR(newInputs.budget)}`
      : `Budget updated to ${formatINR(newInputs.budget)}`);
  }

  if (oldInputs.date !== newInputs.date) {
    changes.push(state.lang === 'hi'
      ? `तारीख ${newInputs.date}`
      : `Date shifted to ${newInputs.date}`);
  }

  if (oldInputs.setting !== newInputs.setting) {
    changes.push(state.lang === 'hi'
      ? `स्थान ${newInputs.setting}`
      : `Setting changed to ${newInputs.setting}`);
  }

  if (oldInputs.theme !== newInputs.theme) {
    changes.push(state.lang === 'hi'
      ? `थीम ${newInputs.theme}`
      : `Theme updated`);
  }

  if (oldInputs.tradition !== newInputs.tradition) {
    changes.push(state.lang === 'hi'
      ? `विवाह परंपरा अपडेट की गई`
      : `Wedding tradition updated`);
  }

  return changes.join(' • ');
}

// Generate or recalculate plan from API
async function generatePlan(isLiveRecalculate = false) {
  const currentInputs = getFormData();
  applyTheme(currentInputs.theme);

  const errors = validateClientForm(currentInputs);
  if (errors.length > 0) {
    displayErrors(errors);
    return;
  }

  displayErrors([]);

  let changeSummaryText = '';
  if (isLiveRecalculate && state.previousInputs) {
    changeSummaryText = computeChangeSummary(state.previousInputs, currentInputs);
  }

  submitBtn.disabled = true;
  submitBtnText.textContent = state.lang === 'hi' ? 'योजना तैयार की जा रही है...' : 'Generating Plan...';

  try {
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentInputs),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errList = result.errors || [result.error || 'Failed to generate plan'];
      displayErrors(errList);
      return;
    }

    state.currentPlan = result;
    state.previousInputs = { ...currentInputs };

    renderPlan();

    if (changeSummaryText) {
      changeBannerText.textContent = t('changeNotice', { changes: changeSummaryText });
      changeBanner.style.display = 'flex';
    } else {
      changeBanner.style.display = 'none';
    }

  } catch (err) {
    console.error('Plan generation failed', err);
    displayErrors([err.message || 'Network error while contacting planner server']);
  } finally {
    submitBtn.disabled = false;
    submitBtnText.textContent = state.currentPlan ? t('recalculateBtn') : t('submitBtn');
  }
}

// Main render function for plan
function renderPlan() {
  if (!state.currentPlan) return;

  if (welcomePlaceholder) welcomePlaceholder.style.display = 'none';
  if (planContent) planContent.style.display = 'block';

  const { plan, ideas, ideasSource } = state.currentPlan;
  const { input, budget, timeline, checklists, warnings, pathway } = plan;

  // 1. Header info
  const eventName = t(`event_${input.eventType}`);
  if (planHeaderTitle) planHeaderTitle.textContent = `${eventName} (${input.date})`;
  if (planHeaderSubtitle) {
    planHeaderSubtitle.textContent = state.lang === 'hi'
      ? `${input.guestCount} अतिथि • कुल बजट ${formatINR(input.budget)} • ${input.setting} वेन्यू`
      : `${input.guestCount} Guests • Total Budget ${formatINR(input.budget)} • ${input.setting} Setting`;
  }

  // 2. Warnings
  renderWarnings(warnings);

  // 3. Ideas and Source badge
  renderIdeas(ideas, ideasSource);

  // 4. Ceremony Pathway Flow
  renderPathway(pathway);

  // 5. Budget Grid & Visualizer Strip
  renderBudget(budget, input.guestCount);

  // 6. Spend Tracker & Vendor Accountability
  renderSpendTracker(budget.categories);

  // 7. Timeline
  renderTimeline(timeline);

  // 8. Checklists
  renderChecklists(checklists);
}

// Render warnings
function renderWarnings(warnings = []) {
  if (!warningsContainer) return;

  while (warningsContainer.firstChild) {
    warningsContainer.removeChild(warningsContainer.firstChild);
  }

  if (warnings.length === 0) {
    warningsContainer.style.display = 'none';
    return;
  }

  warningsContainer.style.display = 'flex';

  warnings.forEach(w => {
    const item = document.createElement('div');
    item.className = `warning-item warning-${w.level || 'medium'}`;

    const icon = document.createElement('span');
    icon.className = 'warning-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = w.level === 'high' ? '⚠️' : (w.level === 'info' ? 'ℹ️' : '🔔');
    item.appendChild(icon);

    const text = document.createElement('div');
    text.textContent = state.lang === 'hi' && w.textHi ? w.textHi : w.textEn;
    item.appendChild(text);

    warningsContainer.appendChild(item);
  });
}

// Render personalized ideas
function renderIdeas(ideas = [], source = 'rules') {
  if (ideasList) {
    while (ideasList.firstChild) {
      ideasList.removeChild(ideasList.firstChild);
    }
  }

  if (ideasSourceBadge) {
    ideasSourceBadge.textContent = t(`source_${source}`) || source;
    ideasSourceBadge.className = `source-badge source-${source}`;
  }

  ideas.forEach(idea => {
    const li = document.createElement('li');
    li.className = 'idea-item';

    const bullet = document.createElement('span');
    bullet.className = 'idea-bullet';
    bullet.setAttribute('aria-hidden', 'true');
    bullet.textContent = '✦';
    li.appendChild(bullet);

    const span = document.createElement('span');
    span.textContent = idea;
    li.appendChild(span);

    ideasList.appendChild(li);
  });
}

// Render Ceremony & Event Pathway Flow
function renderPathway(pathway = []) {
  while (pathwayContainer.firstChild) {
    pathwayContainer.removeChild(pathwayContainer.firstChild);
  }

  if (!Array.isArray(pathway) || pathway.length === 0) return;

  pathway.forEach(step => {
    const card = document.createElement('div');
    card.className = 'pathway-card-item';

    const header = document.createElement('div');
    header.className = 'pathway-card-header';

    const icon = document.createElement('span');
    icon.className = 'pathway-icon';
    icon.textContent = step.icon || '🪔';
    header.appendChild(icon);

    const title = document.createElement('h4');
    title.className = 'pathway-title';
    title.textContent = state.lang === 'hi' && step.nameHi ? step.nameHi : step.nameEn;
    header.appendChild(title);

    card.appendChild(header);

    const timing = document.createElement('div');
    timing.className = 'pathway-timing';
    timing.textContent = state.lang === 'hi' && step.timingHi ? step.timingHi : step.timingEn;
    card.appendChild(timing);

    const dress = document.createElement('div');
    dress.className = 'pathway-dresscode';
    dress.textContent = state.lang === 'hi' && step.dressCodeHi
      ? `पोशाक: ${step.dressCodeHi}`
      : `Dress code: ${step.dressCodeEn}`;
    card.appendChild(dress);

    const highlight = document.createElement('div');
    highlight.className = 'pathway-highlight';
    highlight.textContent = state.lang === 'hi' && step.highlightHi ? step.highlightHi : step.highlightEn;
    card.appendChild(highlight);

    pathwayContainer.appendChild(card);
  });
}

// Render budget grid and stacked proportional strip
function renderBudget(budget, guestCount) {
  while (budgetGrid.firstChild) {
    budgetGrid.removeChild(budgetGrid.firstChild);
  }
  while (budgetVisualizerStrip.firstChild) {
    budgetVisualizerStrip.removeChild(budgetVisualizerStrip.firstChild);
  }

  totalBudgetValue.textContent = formatINR(budget.totalBudget);

  const perGuest = Math.round(budget.totalBudget / (guestCount || 1));
  valPerGuest.textContent = formatINR(perGuest);

  const colorPalette = [
    '#b45309', '#991b1b', '#0f766e', '#1e3a8a', '#c2410c', '#854d0e', '#64748b',
  ];

  budget.categories.forEach((cat, index) => {
    // 1. Stacked Visualizer Segment
    const segment = document.createElement('div');
    segment.className = 'strip-segment';
    segment.style.width = `${Math.max(2, cat.percentage)}%`;
    segment.style.backgroundColor = colorPalette[index % colorPalette.length];
    const catName = state.lang === 'hi' && cat.nameHi ? cat.nameHi : cat.nameEn;
    segment.title = `${catName}: ${cat.percentage}% (${formatINR(cat.amount)})`;
    budgetVisualizerStrip.appendChild(segment);

    // 2. Budget Card Item
    const card = document.createElement('div');
    card.className = 'budget-card-item';
    card.style.borderTopColor = colorPalette[index % colorPalette.length];

    const header = document.createElement('div');
    header.className = 'b-card-header';

    const title = document.createElement('h4');
    title.className = 'b-card-title';
    title.textContent = catName;
    header.appendChild(title);

    const percent = document.createElement('span');
    percent.className = 'b-card-percent';
    percent.textContent = `${cat.percentage}%`;
    header.appendChild(percent);

    card.appendChild(header);

    const amount = document.createElement('div');
    amount.className = 'b-card-amount';
    amount.textContent = formatINR(cat.amount);
    card.appendChild(amount);

    const reason = document.createElement('div');
    reason.className = 'b-card-reason';
    reason.textContent = state.lang === 'hi' && cat.reasonHi ? cat.reasonHi : cat.reasonEn;
    card.appendChild(reason);

    budgetGrid.appendChild(card);
  });
}

// Render Actual Spend Tracker with Vendor Accountability
function renderSpendTracker(categories = []) {
  while (trackerTableBody.firstChild) {
    trackerTableBody.removeChild(trackerTableBody.firstChild);
  }

  let totalAllocated = 0;
  let totalActual = 0;
  let totalAdvance = 0;
  let totalDue = 0;

  categories.forEach(cat => {
    totalAllocated += cat.amount;
    const currentActual = state.actualSpends[cat.id] !== undefined ? state.actualSpends[cat.id] : '';
    const numActual = Number(currentActual) || 0;
    totalActual += numActual;

    const vendor = state.vendorDetails[cat.id] || { name: '', phone: '', advance: '' };
    const numAdvance = Number(vendor.advance) || 0;
    totalAdvance += numAdvance;

    const balanceDue = Math.max(0, numActual - numAdvance);
    totalDue += balanceDue;

    const row = document.createElement('tr');

    // 1. Category Name
    const tdCat = document.createElement('td');
    tdCat.textContent = state.lang === 'hi' && cat.nameHi ? cat.nameHi : cat.nameEn;
    row.appendChild(tdCat);

    // 2. Budgeted Amount
    const tdBud = document.createElement('td');
    tdBud.textContent = formatINR(cat.amount);
    row.appendChild(tdBud);

    // 3. Actual Spend Input
    const tdAct = document.createElement('td');
    const inputActual = document.createElement('input');
    inputActual.type = 'number';
    inputActual.min = '0';
    inputActual.step = '1000';
    inputActual.placeholder = '0';
    inputActual.value = currentActual;
    inputActual.setAttribute('aria-label', `Actual spend for ${cat.nameEn}`);

    inputActual.addEventListener('input', e => {
      const val = e.target.value.trim();
      state.actualSpends[cat.id] = val === '' ? '' : Math.max(0, Number(val));
      saveStoredSpendAndVendors();
      updateSpendCalculations(categories);
    });
    tdAct.appendChild(inputActual);
    row.appendChild(tdAct);

    // 4. Advance Paid Input
    const tdAdv = document.createElement('td');
    const inputAdvance = document.createElement('input');
    inputAdvance.type = 'number';
    inputAdvance.min = '0';
    inputAdvance.step = '1000';
    inputAdvance.placeholder = '0';
    inputAdvance.value = vendor.advance !== undefined ? vendor.advance : '';
    inputAdvance.setAttribute('aria-label', `Advance paid for ${cat.nameEn}`);

    inputAdvance.addEventListener('input', e => {
      const val = e.target.value.trim();
      if (!state.vendorDetails[cat.id]) state.vendorDetails[cat.id] = {};
      state.vendorDetails[cat.id].advance = val === '' ? '' : Math.max(0, Number(val));
      saveStoredSpendAndVendors();
      updateSpendCalculations(categories);
    });
    tdAdv.appendChild(inputAdvance);
    row.appendChild(tdAdv);

    // 5. Balance Due
    const tdDue = document.createElement('td');
    tdDue.id = `due_${cat.id}`;
    tdDue.textContent = formatINR(balanceDue);
    row.appendChild(tdDue);

    // 6. Variance
    const tdVar = document.createElement('td');
    tdVar.id = `var_${cat.id}`;
    const diff = cat.amount - numActual;
    tdVar.textContent = formatINR(diff);
    row.appendChild(tdVar);

    // 7. Status Badge
    const tdStat = document.createElement('td');
    const badge = document.createElement('span');
    badge.id = `stat_${cat.id}`;
    applySpendBadge(badge, cat.amount, numActual);
    tdStat.appendChild(badge);
    row.appendChild(tdStat);

    // 8. Vendor Contact Inputs (Browser LocalStorage Only)
    const tdVendor = document.createElement('td');
    const vendorWrap = document.createElement('div');
    vendorWrap.className = 'vendor-inputs-cell';

    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'vendor-input-name';
    inputName.placeholder = t('vendorNamePlaceholder');
    inputName.value = vendor.name || '';
    inputName.setAttribute('aria-label', `${t('vendorNamePlaceholder')} for ${cat.nameEn}`);
    inputName.addEventListener('input', e => {
      if (!state.vendorDetails[cat.id]) state.vendorDetails[cat.id] = {};
      state.vendorDetails[cat.id].name = e.target.value;
      saveStoredSpendAndVendors();
    });
    vendorWrap.appendChild(inputName);

    const inputPhone = document.createElement('input');
    inputPhone.type = 'text';
    inputPhone.className = 'vendor-input-phone';
    inputPhone.placeholder = t('vendorPhonePlaceholder');
    inputPhone.value = vendor.phone || '';
    inputPhone.setAttribute('aria-label', `${t('vendorPhonePlaceholder')} for ${cat.nameEn}`);
    inputPhone.addEventListener('input', e => {
      if (!state.vendorDetails[cat.id]) state.vendorDetails[cat.id] = {};
      state.vendorDetails[cat.id].phone = e.target.value;
      saveStoredSpendAndVendors();
    });
    vendorWrap.appendChild(inputPhone);

    tdVendor.appendChild(vendorWrap);
    row.appendChild(tdVendor);

    trackerTableBody.appendChild(row);
  });

  updateSpendSummaryTotals(totalAllocated, totalActual, totalAdvance, totalDue);
}

function applySpendBadge(badgeElement, budgeted, actual) {
  if (actual > budgeted * 1.05) {
    badgeElement.className = 'status-badge over';
    badgeElement.textContent = t('statusOver');
  } else if (actual < budgeted * 0.95 && actual > 0) {
    badgeElement.className = 'status-badge under';
    badgeElement.textContent = t('statusUnder');
  } else {
    badgeElement.className = 'status-badge on-track';
    badgeElement.textContent = t('statusOnTrack');
  }
}

function updateSpendCalculations(categories) {
  let totalAllocated = 0;
  let totalActual = 0;
  let totalAdvance = 0;
  let totalDue = 0;

  categories.forEach(cat => {
    totalAllocated += cat.amount;
    const actualVal = state.actualSpends[cat.id];
    const numActual = Number(actualVal) || 0;
    totalActual += numActual;

    const vendor = state.vendorDetails[cat.id] || {};
    const numAdvance = Number(vendor.advance) || 0;
    totalAdvance += numAdvance;

    const balanceDue = Math.max(0, numActual - numAdvance);
    totalDue += balanceDue;

    const tdDue = document.getElementById(`due_${cat.id}`);
    if (tdDue) {
      tdDue.textContent = formatINR(balanceDue);
    }

    const diff = cat.amount - numActual;
    const tdVar = document.getElementById(`var_${cat.id}`);
    if (tdVar) {
      tdVar.textContent = formatINR(diff);
    }

    const badge = document.getElementById(`stat_${cat.id}`);
    if (badge) {
      applySpendBadge(badge, cat.amount, numActual);
    }
  });

  updateSpendSummaryTotals(totalAllocated, totalActual, totalAdvance, totalDue);
}

function updateSpendSummaryTotals(totalAllocated, totalActual, totalAdvance, totalDue) {
  if (valTotalSpent) valTotalSpent.textContent = formatINR(totalActual);
  if (valTotalAdvance) valTotalAdvance.textContent = formatINR(totalAdvance);
  if (valTotalDue) valTotalDue.textContent = formatINR(totalDue);

  const remaining = totalAllocated - totalActual;
  if (valTotalRemaining) valTotalRemaining.textContent = formatINR(remaining);

  if (pillRemaining) {
    if (remaining < 0) {
      pillRemaining.classList.add('over');
    } else {
      pillRemaining.classList.remove('over');
    }
  }
}

// Get detailed sub-tasks for milestone
function getMilestoneSubtasks(milestone, eventType = 'wedding') {
  if (!milestone) return [];

  if (Array.isArray(milestone.subtasks) && milestone.subtasks.length > 0) {
    return milestone.subtasks;
  }

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

  // Community & Festival Event
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

// Render Timeline with interactive click-to-expand sub-tasks and controls
function renderTimeline(timeline) {
  if (timelineContainer) {
    while (timelineContainer.firstChild) {
      timelineContainer.removeChild(timelineContainer.firstChild);
    }
  }

  if (leadTimeBadge) {
    leadTimeBadge.textContent = t('daysLeft', { days: timeline.leadTimeDays });
  }

  const eventType = (state.currentPlan && state.currentPlan.plan && state.currentPlan.plan.input && state.currentPlan.plan.input.eventType) || eventTypeEl.value || 'wedding';

  // Setup Expand All and Collapse All buttons
  if (expandAllBtn) {
    expandAllBtn.onclick = () => {
      const items = timelineContainer.querySelectorAll('.milestone-item');
      items.forEach(item => {
        const btn = item.querySelector('.milestone-toggle-btn');
        const subtasks = item.querySelector('.milestone-subtasks');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (subtasks) subtasks.classList.remove('collapsed');
      });
    };
  }

  if (collapseAllBtn) {
    collapseAllBtn.onclick = () => {
      const items = timelineContainer.querySelectorAll('.milestone-item');
      items.forEach(item => {
        const btn = item.querySelector('.milestone-toggle-btn');
        const subtasks = item.querySelector('.milestone-subtasks');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (subtasks) subtasks.classList.add('collapsed');
      });
    };
  }

  timeline.milestones.forEach((m, index) => {
    const item = document.createElement('div');
    item.className = 'milestone-item' + (m.isUrgent ? ' urgent' : '');

    const dot = document.createElement('div');
    dot.className = 'milestone-dot';
    dot.setAttribute('aria-hidden', 'true');
    item.appendChild(dot);

    const subtasksId = `milestone-subtasks-${index}`;
    const btnId = `milestone-btn-${index}`;
    const milestoneTitle = state.lang === 'hi' && m.titleHi ? m.titleHi : m.titleEn;

    // Real button for milestone header
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'milestone-toggle-btn';
    toggleBtn.id = btnId;
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', subtasksId);
    toggleBtn.setAttribute('aria-label', `${milestoneTitle} - ${t('expandAll')}`);

    // Chevron icon
    const chevron = document.createElement('span');
    chevron.className = 'milestone-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '▶';
    toggleBtn.appendChild(chevron);

    // Content wrap
    const contentWrap = document.createElement('div');
    contentWrap.className = 'milestone-content-wrap';

    const header = document.createElement('div');
    header.className = 'milestone-header';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'milestone-date';
    dateSpan.textContent = m.date;
    header.appendChild(dateSpan);

    const daysSpan = document.createElement('span');
    daysSpan.className = 'milestone-days';
    daysSpan.textContent = m.daysBefore === 0
      ? (state.lang === 'hi' ? 'उत्सव दिवस' : 'Event Day')
      : (state.lang === 'hi' ? `${m.daysBefore} दिन पूर्व` : `T-${m.daysBefore} days`);
    header.appendChild(daysSpan);

    if (m.isStartNow) {
      const tag = document.createElement('span');
      tag.className = 'milestone-tag';
      tag.textContent = t('startNowLabel');
      header.appendChild(tag);
    }

    contentWrap.appendChild(header);

    const titleEl = document.createElement('div');
    titleEl.className = 'milestone-title';
    titleEl.textContent = milestoneTitle;
    contentWrap.appendChild(titleEl);

    toggleBtn.appendChild(contentWrap);
    item.appendChild(toggleBtn);

    // Sub-tasks container (collapsed by default)
    const subtasksContainer = document.createElement('div');
    subtasksContainer.className = 'milestone-subtasks collapsed';
    subtasksContainer.id = subtasksId;
    subtasksContainer.setAttribute('role', 'region');
    subtasksContainer.setAttribute('aria-labelledby', btnId);

    const subtasksTitle = document.createElement('span');
    subtasksTitle.className = 'subtasks-title';
    subtasksTitle.textContent = t('detailedSubtasks');
    subtasksContainer.appendChild(subtasksTitle);

    const subtaskList = document.createElement('ul');
    subtaskList.className = 'subtasks-list';

    const subtasks = getMilestoneSubtasks(m, eventType);
    subtasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'subtask-item';

      const bullet = document.createElement('span');
      bullet.className = 'subtask-bullet';
      bullet.setAttribute('aria-hidden', 'true');
      bullet.textContent = '•';
      taskItem.appendChild(bullet);

      const textSpan = document.createElement('span');
      textSpan.className = 'subtask-text';
      textSpan.textContent = state.lang === 'hi' && task.textHi ? task.textHi : task.textEn;
      taskItem.appendChild(textSpan);

      subtaskList.appendChild(taskItem);
    });

    subtasksContainer.appendChild(subtaskList);
    item.appendChild(subtasksContainer);

    // Toggle handler
    const toggleMilestone = () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;
      toggleBtn.setAttribute('aria-expanded', String(nextExpanded));
      if (nextExpanded) {
        subtasksContainer.classList.remove('collapsed');
      } else {
        subtasksContainer.classList.add('collapsed');
      }
    };

    toggleBtn.addEventListener('click', toggleMilestone);
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMilestone();
      }
    });

    timelineContainer.appendChild(item);
  });
}

// Render Checklists
function renderChecklists(checklists = []) {
  while (checklistsContainer.firstChild) {
    checklistsContainer.removeChild(checklistsContainer.firstChild);
  }

  let totalItems = 0;
  let doneItems = 0;

  checklists.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'checklist-group';

    const title = document.createElement('h4');
    title.className = 'checklist-group-title';
    title.textContent = state.lang === 'hi' && group.categoryHi ? group.categoryHi : group.category;
    groupDiv.appendChild(title);

    group.items.forEach(item => {
      totalItems += 1;
      const isChecked = state.checkedTasks.has(item.id);
      if (isChecked) doneItems += 1;

      const label = document.createElement('label');
      label.className = 'check-item' + (isChecked ? ' done' : '');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = isChecked;

      cb.addEventListener('change', () => {
        if (cb.checked) {
          state.checkedTasks.add(item.id);
          label.classList.add('done');
        } else {
          state.checkedTasks.delete(item.id);
          label.classList.remove('done');
        }
        updateChecklistCounter(totalItems);
      });

      label.appendChild(cb);

      const span = document.createElement('span');
      span.textContent = state.lang === 'hi' && item.textHi ? item.textHi : item.textEn;
      label.appendChild(span);

      groupDiv.appendChild(label);
    });

    checklistsContainer.appendChild(groupDiv);
  });

  updateChecklistCounter(totalItems);
}

function updateChecklistCounter(totalItems) {
  const count = state.checkedTasks.size;
  if (checklistProgressBadge) {
    checklistProgressBadge.textContent = state.lang === 'hi'
      ? `${count} / ${totalItems} कार्य पूर्ण`
      : `${count} of ${totalItems} ${t('completed')}`;
  }
}

// Download calendar .ics file
async function downloadIcs() {
  if (!state.currentPlan) return;

  const { plan } = state.currentPlan;
  const eventName = t(`event_${plan.input.eventType}`);

  try {
    const res = await fetch('/api/export-ics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        milestones: plan.timeline.milestones,
        lang: state.lang,
      }),
    });

    if (!res.ok) throw new Error('Failed to generate .ics file');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utsavplan-${plan.input.eventType}-${plan.input.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('ICS download failed', err);
    displayErrors([err.message || 'Could not download calendar file']);
  }
}

// ==========================================
// Voice Input (Speech-to-Text)
// ==========================================
function setupVoiceInput() {
  // Wire up quick ceremony voice chips regardless of SpeechRecognition support
  setupPromptChips();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (headerVoiceBtn) {
      headerVoiceBtn.classList.add('unsupported');
      headerVoiceBtn.setAttribute('title', t('voiceNotSupported'));
      headerVoiceBtn.addEventListener('click', () => {
        scrollToVoice();
        if (voiceStatus) {
          voiceStatus.textContent = t('voiceStatusUnsupported');
          voiceStatus.classList.add('unsupported');
        }
      });
    }
    if (cardVoiceBtn) {
      cardVoiceBtn.classList.add('unsupported');
      cardVoiceBtn.setAttribute('title', t('voiceNotSupported'));
      cardVoiceBtn.addEventListener('click', () => {
        if (voiceStatus) {
          voiceStatus.textContent = t('voiceStatusUnsupported');
          voiceStatus.classList.add('unsupported');
        }
      });
    }
    if (voiceStatus) {
      voiceStatus.textContent = t('voiceStatusUnsupported');
      voiceStatus.classList.add('unsupported');
    }
    return;
  }

  const toggleVoice = () => {
    if (state.isListening) {
      if (state.speechRecognition) {
        try {
          state.speechRecognition.stop();
        } catch {}
      }
      updateVoiceUIState(false);
      if (voiceStatus) {
        voiceStatus.textContent = t('voiceStatusSupported');
        voiceStatus.classList.remove('listening');
      }
    } else {
      scrollToVoice();
      try {
        if (!state.speechRecognition) {
          initSpeechRecognition();
        }
        if (state.speechRecognition) {
          state.speechRecognition.lang = state.lang === 'hi' ? 'hi-IN' : 'en-IN';
          state.speechRecognition.start();
        }
      } catch (err) {
        console.warn('Speech recognition start failed', err);
        updateVoiceUIState(false);
        if (voiceStatus) {
          voiceStatus.textContent = state.lang === 'hi'
            ? 'माइक्रोफ़ोन प्रारंभ नहीं हो सका। कृपया ब्राउज़र अनुमति जांचें।'
            : 'Could not access microphone. Please check browser permissions.';
        }
      }
    }
  };

  if (headerVoiceBtn) {
    headerVoiceBtn.addEventListener('click', toggleVoice);
  }

  if (cardVoiceBtn) {
    cardVoiceBtn.addEventListener('click', toggleVoice);
  }

  initSpeechRecognition();

  if (voiceStatus) {
    voiceStatus.textContent = t('voiceStatusSupported');
  }
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      state.isListening = true;
      updateVoiceUIState(true);
      if (voiceStatus) {
        voiceStatus.textContent = t('voiceMicListening');
        voiceStatus.classList.add('listening');
      }
    };

    recognition.onresult = event => {
      try {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          const sanitizedVoice = sanitizeClientNotes(transcript);
          const existing = sanitizeClientNotes(notesEl ? notesEl.value : '');
          const combined = existing ? `${existing}, ${sanitizedVoice}` : sanitizedVoice;
          if (notesEl) {
            notesEl.value = sanitizeClientNotes(combined);
            notesEl.focus();
          }
          if (voiceStatus) {
            voiceStatus.textContent = state.lang === 'hi' 
              ? `नोट्स जोड़े गए: "${sanitizedVoice}"` 
              : `Voice notes added: "${sanitizedVoice}"`;
          }
          handleInputChange();
        }
      } catch (err) {
        console.warn('Voice transcript parsing error', err);
      }
    };

    recognition.onerror = event => {
      console.warn('Speech recognition error', event?.error);
      const errCode = event?.error;
      let msg = '';
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        msg = state.lang === 'hi'
          ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक्रोफ़ोन चालू करें।'
          : 'Microphone permission blocked. Please allow microphone access in your browser settings.';
      } else if (errCode === 'no-speech') {
        msg = state.lang === 'hi'
          ? 'कोई आवाज़ नहीं सुनी गई। कृपया पुनः प्रयास करें।'
          : 'No speech was detected. Please try speaking again.';
      } else if (errCode === 'network') {
        msg = state.lang === 'hi'
          ? 'नेटवर्क त्रुटि: आवाज़ सेवा से संपर्क नहीं हो सका।'
          : 'Network error connecting to speech recognition service.';
      } else {
        msg = state.lang === 'hi'
          ? `आवाज़ पहचान त्रुटि (${errCode || 'अज्ञात'})। नीचे दिए गए विकल्पों से चुनें या टाइप करें।`
          : `Voice recognition notice (${errCode || 'unknown'}). Use prompt chips below or type directly.`;
      }
      updateVoiceUIState(false);
      if (voiceStatus) {
        voiceStatus.textContent = msg;
        voiceStatus.classList.remove('listening');
      }
    };

    recognition.onend = () => {
      updateVoiceUIState(false);
    };

    state.speechRecognition = recognition;
    return recognition;
  } catch (e) {
    console.warn('Speech recognition constructor failed', e);
    return null;
  }
}

function updateVoiceUIState(isListening) {
  state.isListening = isListening;

  if (headerVoiceBtn) {
    if (isListening) {
      headerVoiceBtn.classList.add('active');
      headerVoiceBtn.setAttribute('aria-pressed', 'true');
    } else {
      headerVoiceBtn.classList.remove('active');
      headerVoiceBtn.setAttribute('aria-pressed', 'false');
    }
  }
  if (headerVoiceBtnText) {
    headerVoiceBtnText.textContent = isListening
      ? (state.lang === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
      : t('headerVoiceBtn');
  }

  if (cardVoiceBtn) {
    if (isListening) {
      cardVoiceBtn.classList.add('listening');
      cardVoiceBtn.setAttribute('aria-pressed', 'true');
    } else {
      cardVoiceBtn.classList.remove('listening');
      cardVoiceBtn.setAttribute('aria-pressed', 'false');
    }
  }
  if (cardVoiceBtnText) {
    cardVoiceBtnText.textContent = isListening
      ? (state.lang === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
      : t('cardVoiceBtn');
  }

  if (voiceStatus) {
    if (isListening) {
      voiceStatus.classList.add('listening');
    } else {
      voiceStatus.classList.remove('listening');
    }
  }
}

function resetVoiceInputUI() {
  updateVoiceUIState(false);
  if (voiceStatus) {
    voiceStatus.textContent = t('voiceStatusSupported');
    voiceStatus.classList.remove('listening');
  }
}

// Quick ceremony voice chips allow testing and inserting curated ceremony details
function setupPromptChips() {
  const chips = document.querySelectorAll('.prompt-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-text');
      if (promptText) {
        const sanitized = sanitizeClientNotes(promptText);
        const existing = sanitizeClientNotes(notesEl ? notesEl.value : '');
        if (notesEl) {
          notesEl.value = existing ? `${existing}, ${sanitized}` : sanitized;
        }
        chip.classList.add('chip-active');
        setTimeout(() => chip.classList.remove('chip-active'), 500);
        if (voiceStatus) {
          voiceStatus.textContent = state.lang === 'hi'
            ? `जोड़ा गया: "${sanitized}"`
            : `Note added: "${sanitized}"`;
        }
        handleInputChange();
      }
    });
  });
}

// ==========================================
// Voice Readout (Text-to-Speech)
// ==========================================
function setupVoiceReadout() {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    if (voiceReadoutBtn) voiceReadoutBtn.style.display = 'none';
    return;
  }

  if (voiceReadoutBtn) {
    voiceReadoutBtn.addEventListener('click', async () => {
      try {
        if (state.isSpeaking) {
          window.speechSynthesis.cancel();
          stopVoiceReadoutUI();
          return;
        }

        if (!state.currentPlan) {
          if (voiceReadoutBtnText) {
            voiceReadoutBtnText.textContent = state.lang === 'hi' ? 'तैयार कर रहे हैं...' : 'Generating Plan...';
          }
          await generatePlan(false);
          if (!state.currentPlan) {
            stopVoiceReadoutUI();
            return;
          }
        }

        const { plan, ideas } = state.currentPlan;
        const { input, timeline } = plan;

        let speechText = '';
        if (state.lang === 'hi') {
          speechText = `नमस्ते! यह आपकी ${t(`event_${input.eventType}`)} की योजना है। कुल ${input.guestCount} अतिथियों के लिए कुल बजट ${formatINR(input.budget)} है। कार्यक्रम में ${timeline.leadTimeDays} दिन शेष हैं। प्रमुख विचार: ${ideas.slice(0, 2).join('। ')}`;
        } else {
          speechText = `Welcome to UtsavPlan. Here is your celebration plan for ${t(`event_${input.eventType}`)} on ${input.date}. Total budget is ${formatINR(input.budget)} for ${input.guestCount} guests, with ${timeline.leadTimeDays} days remaining. Key ideas: ${ideas.slice(0, 2).join('. ')}`;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = state.lang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.95;

        const voices = window.speechSynthesis.getVoices();
        const langCode = state.lang === 'hi' ? 'hi' : 'en';
        const preferredVoice = voices.find(v => v.lang && v.lang.startsWith(langCode));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          state.isSpeaking = true;
          if (voiceReadoutBtn) {
            voiceReadoutBtn.classList.add('active');
            voiceReadoutBtn.setAttribute('aria-pressed', 'true');
          }
          if (voiceReadoutBtnText) {
            voiceReadoutBtnText.textContent = t('voiceReadoutStopBtn');
          }
          if (voiceStatus) {
            voiceStatus.textContent = state.lang === 'hi'
              ? 'योजना का ऑडियो सारांश सुनाया जा रहा है...'
              : 'Reading celebration plan summary aloud...';
          }
        };

        utterance.onend = () => {
          stopVoiceReadoutUI();
          if (voiceStatus) {
            voiceStatus.textContent = t('voiceStatusSupported');
          }
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error', e);
          stopVoiceReadoutUI();
        };

        window.speechSynthesis.speak(utterance);
      } catch (speechErr) {
        console.warn('Text-to-speech error', speechErr);
        stopVoiceReadoutUI();
      }
    });
  }
}

function stopVoiceReadoutUI() {
  state.isSpeaking = false;
  if (voiceReadoutBtn) {
    voiceReadoutBtn.classList.remove('active');
    voiceReadoutBtn.setAttribute('aria-pressed', 'false');
  }
  if (voiceReadoutBtnText) {
    voiceReadoutBtnText.textContent = t('voiceReadoutBtn');
  }
}

// Update all UI labels when language changes
function updateLanguageUI() {
  document.documentElement.lang = state.lang;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  if (langToggleText) langToggleText.textContent = t('languageToggle');
  if (langToggleBtn) langToggleBtn.setAttribute('aria-label', t('changeLanguageAria'));

  // Header
  setText('appTitle', t('appTitle'));
  setText('appSubtitle', t('appSubtitle'));
  setText('skipLink', t('skipLink'));

  // Form labels
  setText('formHeading', t('formHeading'));
  setText('lblEventType', t('eventTypeLabel'));
  setText('lblDate', t('dateLabel'));
  setText('lblGuestCount', t('guestCountLabel'));
  setText('lblBudget', t('budgetLabel'));
  setText('lblStyle', t('styleLabel'));
  setText('lblTheme', t('themeLabel'));
  setText('lblSetting', t('settingLabel'));
  setText('lblDietary', t('dietaryLabel'));
  setText('lblChildren', t('childrenCheckboxText'));
  setText('lblNotes', t('notesLabel'));
  if (notesEl) notesEl.placeholder = t('notesPlaceholder');
  setText('resetBtnText', t('resetBtn'));

  // Themes in select
  if (themeEl && themeEl.options) {
    if (themeEl.options[0]) themeEl.options[0].text = t('theme_royal_rajwada');
    if (themeEl.options[1]) themeEl.options[1].text = t('theme_udaipur_palace');
    if (themeEl.options[2]) themeEl.options[2].text = t('theme_peacock_regalia');
    if (themeEl.options[3]) themeEl.options[3].text = t('theme_boho_sundowner');
  }

  // Event types in select
  if (eventTypeEl && eventTypeEl.options) {
    if (eventTypeEl.options[0]) eventTypeEl.options[0].text = t('event_wedding');
    if (eventTypeEl.options[1]) eventTypeEl.options[1].text = t('event_birthday');
    if (eventTypeEl.options[2]) eventTypeEl.options[2].text = t('event_community');
  }

  // Wedding tradition
  setText('lblWeddingTradition', t('lblWeddingTradition'));
  setText('weddingTraditionHelp', t('weddingTraditionHelp'));
  if (weddingTraditionEl && weddingTraditionEl.options) {
    if (weddingTraditionEl.options[0]) weddingTraditionEl.options[0].text = t('tradition_none');
    if (weddingTraditionEl.options[1]) weddingTraditionEl.options[1].text = t('tradition_general');
    if (weddingTraditionEl.options[2]) weddingTraditionEl.options[2].text = t('tradition_hindu_north');
    if (weddingTraditionEl.options[3]) weddingTraditionEl.options[3].text = t('tradition_hindu_south');
    if (weddingTraditionEl.options[4]) weddingTraditionEl.options[4].text = t('tradition_bengali');
    if (weddingTraditionEl.options[5]) weddingTraditionEl.options[5].text = t('tradition_marwari');
    if (weddingTraditionEl.options[6]) weddingTraditionEl.options[6].text = t('tradition_gujarati');
    if (weddingTraditionEl.options[7]) weddingTraditionEl.options[7].text = t('tradition_punjabi_sikh');
    if (weddingTraditionEl.options[8]) weddingTraditionEl.options[8].text = t('tradition_muslim_nikah');
    if (weddingTraditionEl.options[9]) weddingTraditionEl.options[9].text = t('tradition_christian');
    if (weddingTraditionEl.options[10]) weddingTraditionEl.options[10].text = t('tradition_jain');
    if (weddingTraditionEl.options[11]) weddingTraditionEl.options[11].text = t('tradition_parsi');
  }

  // Styles in select
  if (styleEl && styleEl.options) {
    if (styleEl.options[0]) styleEl.options[0].text = t('style_traditional');
    if (styleEl.options[1]) styleEl.options[1].text = t('style_royal');
    if (styleEl.options[2]) styleEl.options[2].text = t('style_modern');
    if (styleEl.options[3]) styleEl.options[3].text = t('style_festive');
    if (styleEl.options[4]) styleEl.options[4].text = t('style_minimalist');
    if (styleEl.options[5]) styleEl.options[5].text = t('style_ecoFriendly');
  }

  // Settings in select
  if (settingEl && settingEl.options) {
    if (settingEl.options[0]) settingEl.options[0].text = t('setting_indoor');
    if (settingEl.options[1]) settingEl.options[1].text = t('setting_outdoor');
    if (settingEl.options[2]) settingEl.options[2].text = t('setting_hybrid');
  }

  // Dietary options
  setText('optJain', t('dietary_jain'));
  setText('optSatvik', t('dietary_satvik'));
  setText('optVeg', t('dietary_vegetarian'));
  setText('optNonVeg', t('dietary_nonVegetarian'));
  setText('optVegan', t('dietary_vegan'));
  setText('optGlutenFree', t('dietary_glutenFree'));

  // Header actions & voice buttons
  setText('headerPrintBtnText', t('headerPrintBtn'));
  if (headerPrintBtnText) headerPrintBtnText.textContent = t('headerPrintBtn');

  const voiceBtnLabel = state.isListening
    ? (state.lang === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
    : t('headerVoiceBtn');
  setText('headerVoiceBtnText', voiceBtnLabel);
  if (headerVoiceBtnText) headerVoiceBtnText.textContent = voiceBtnLabel;

  const cardVoiceLabel = state.isListening
    ? (state.lang === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
    : t('cardVoiceBtn');
  setText('cardVoiceBtnText', cardVoiceLabel);
  if (cardVoiceBtnText) cardVoiceBtnText.textContent = cardVoiceLabel;

  const readoutBtnLabel = state.isSpeaking ? t('voiceReadoutStopBtn') : t('voiceReadoutBtn');
  setText('voiceReadoutBtnText', readoutBtnLabel);
  if (voiceReadoutBtnText) voiceReadoutBtnText.textContent = readoutBtnLabel;

  setText('headerShareBtnText', t('headerShareBtn'));
  if (headerShareBtnText) headerShareBtnText.textContent = t('headerShareBtn');

  setText('shareModalTitle', t('shareModalTitle'));
  setText('shareModalDesc', t('shareModalDesc'));
  setText('lblShareLink', t('lblShareLink'));
  setText('shareLinkHelp', t('shareLinkHelp'));
  setText('copyShareLinkBtnText', t('copyShareLinkBtn'));
  if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = t('copyShareLinkBtn');

  setText('lblExportJson', t('lblExportJson'));
  setText('descExportJson', t('descExportJson'));
  setText('downloadJsonBtnText', t('downloadJsonBtn'));
  if (downloadJsonBtnText) downloadJsonBtnText.textContent = t('downloadJsonBtn');

  setText('lblImportJson', t('lblImportJson'));
  setText('descImportJson', t('descImportJson'));
  setText('uploadJsonBtnText', t('uploadJsonBtn'));
  if (uploadJsonBtnText) uploadJsonBtnText.textContent = t('uploadJsonBtn');

  setText('sharePrivacyNote', t('sharePrivacyNote'));
  setText('modalDismissBtnText', t('closeModal'));
  if (modalDismissBtnText) modalDismissBtnText.textContent = t('closeModal');

  // Drafts UI
  setText('saveDraftBtnText', t('saveDraftBtn'));
  setText('headerDraftsBtnText', t('headerDraftsBtn'));
  setText('draftsModalTitle', t('draftsModalTitle'));
  setText('draftsModalDesc', t('draftsModalDesc'));
  setText('draftsModalDismissBtnText', t('closeModal'));
  setText('saveDraftModalTitle', t('saveDraftModalTitle'));
  setText('lblDraftName', t('lblDraftName'));
  setText('saveDraftConfirmBtnText', t('saveDraftConfirmBtn'));
  setText('saveDraftCancelBtnText', t('cancelBtn'));
  setText('renameDraftModalTitle', t('renameDraftModalTitle'));
  setText('lblRenameDraft', t('lblRenameDraft'));
  setText('confirmRenameBtnText', t('confirmRenameBtn'));
  setText('cancelRenameBtnText', t('cancelBtn'));
  setText('deleteDraftModalTitle', t('deleteDraftModalTitle'));
  setText('confirmDeleteDraftText', t('confirmDeleteDraftText'));
  setText('confirmDeleteBtnText', t('confirmDeleteBtn'));
  setText('cancelDeleteBtnText', t('cancelBtn'));
  if (typeof renderDraftsList === 'function' && draftsModal && draftsModal.style.display !== 'none') {
    renderDraftsList();
  }
  if (typeof updateDraftsBadge === 'function') {
    updateDraftsBadge();
  }

  setText('welcomeGenerateText', t('welcomeGenerateBtn'));
  if (welcomeGenerateText) welcomeGenerateText.textContent = t('welcomeGenerateBtn');

  const subtextStr = state.lang === 'hi' ? 'द्विभाषी (हिंदी एवं अंग्रेजी)' : 'Bilingual (English & Hindi)';
  setText('voiceCardSubtext', subtextStr);
  if (voiceCardSubtext) voiceCardSubtext.textContent = subtextStr;

  setText('voicePromptTitle', t('voiceQuickPromptTitle'));
  if (voicePromptTitle) voicePromptTitle.textContent = t('voiceQuickPromptTitle');

  // Timeline expand/collapse buttons
  setText('expandAllBtnText', t('expandAll'));
  if (expandAllBtnText) expandAllBtnText.textContent = t('expandAll');

  setText('collapseAllBtnText', t('collapseAll'));
  if (collapseAllBtnText) collapseAllBtnText.textContent = t('collapseAll');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (voiceStatus) {
    if (!SpeechRecognition) {
      voiceStatus.textContent = t('voiceStatusUnsupported');
    } else if (!state.isListening) {
      voiceStatus.textContent = t('voiceStatusSupported');
    }
  }

  // Toolbar
  setText('exportIcsBtnText', t('exportIcsBtn'));
  if (exportIcsBtnText) exportIcsBtnText.textContent = t('exportIcsBtn');

  const submitLabel = state.currentPlan ? t('recalculateBtn') : t('submitBtn');
  setText('submitBtnText', submitLabel);
  if (submitBtnText) submitBtnText.textContent = submitLabel;

  // Section titles
  setText('ideasSectionTitle', t('ideasSection'));
  setText('lblSource', t('sourceLabel'));
  setText('pathwaySectionTitle', t('pathwaySectionTitle'));
  setText('pathwaySectionDesc', t('pathwaySectionDesc'));
  setText('budgetSectionTitle', t('budgetSection'));
  setText('budgetSectionDesc', t('budgetNote'));
  setText('lblBudgetStrip', t('budgetVisualizerTitle'));
  setText('lblPerGuest', t('perGuestCostLabel') + ':');
  setText('trackerSectionTitle', t('spendTrackerSection'));
  setText('trackerSectionDesc', t('spendTrackerNote'));
  setText('timelineSectionTitle', t('timelineSection'));
  setText('timelineSectionDesc', t('timelineNote'));
  setText('checklistSectionTitle', t('checklistSection'));
  setText('checklistSectionDesc', t('checklistNote'));

  // Tracker table headers
  setText('thCategory', t('colCategory'));
  setText('thBudgeted', t('colBudgeted'));
  setText('thActual', t('colActual'));
  setText('thAdvance', t('advancePaidLabel') + ' (₹)');
  setText('thDue', t('balanceDueLabel') + ' (₹)');
  setText('thVariance', t('colVariance'));
  setText('thStatus', t('colStatus'));
  setText('thVendor', t('colVendor'));

  // Summary labels
  setText('lblTotalSpent', t('totalSpent') + ':');
  setText('lblTotalAdvance', t('advancePaidLabel') + ':');
  setText('lblTotalDue', t('balanceDueLabel') + ':');
  setText('lblTotalRemaining', t('totalRemaining') + ':');

  if (state.currentPlan) {
    renderPlan();
  }
}

// Unified Print handler: ensures plan is built so complete formatted document prints
async function handlePrint() {
  if (headerPrintBtn) {
    headerPrintBtn.disabled = true;
  }

  try {
    if (!state.currentPlan) {
      if (headerPrintBtnText) {
        headerPrintBtnText.textContent = state.lang === 'hi'
          ? 'योजना तैयार की जा रही है...'
          : 'Preparing Print Document...';
      }
      await generatePlan(false);
    }

    if (!state.currentPlan) {
      return;
    }

    // Expand all milestones so printout contains complete detailed checklists
    if (timelineContainer) {
      const items = timelineContainer.querySelectorAll('.milestone-item');
      items.forEach(item => {
        const btn = item.querySelector('.milestone-toggle-btn');
        const subtasks = item.querySelector('.milestone-subtasks');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (subtasks) subtasks.classList.remove('collapsed');
      });
    }

    if (headerPrintBtnText) {
      headerPrintBtnText.textContent = state.lang === 'hi'
        ? 'प्रिंट दृश्य खुल रहा है...'
        : 'Opening Print View...';
    }

    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      window.print();
    } catch (printErr) {
      console.warn('Native window.print() exception', printErr);
    }
  } catch (err) {
    console.error('Print handler failed', err);
  } finally {
    if (headerPrintBtn) {
      headerPrintBtn.disabled = false;
    }
    if (headerPrintBtnText) {
      headerPrintBtnText.textContent = t('headerPrintBtn');
    }
  }
}

// Scroll to Voice Dictation section and focus
function scrollToVoice() {
  if (voiceFeatureBox) {
    voiceFeatureBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (notesEl) {
      notesEl.focus();
    }
  }
}

// --- Share & Collaboration Functions ---
function getFormValues() {
  const dietary = Array.from(document.querySelectorAll('input[name="dietary"]:checked')).map(el => el.value);
  const isWedding = eventTypeEl && eventTypeEl.value === 'wedding';
  const tradition = (isWedding && weddingTraditionEl && weddingTraditionEl.value) ? weddingTraditionEl.value : '';
  return {
    eventType: eventTypeEl ? eventTypeEl.value : 'wedding',
    tradition,
    date: dateEl ? dateEl.value : '',
    guestCount: guestCountEl ? parseInt(guestCountEl.value, 10) || 100 : 100,
    budget: budgetEl ? parseInt(budgetEl.value, 10) || 100000 : 100000,
    style: styleEl ? styleEl.value : 'traditional',
    theme: themeEl ? themeEl.value : 'royal-rajwada',
    setting: settingEl ? settingEl.value : 'indoor',
    dietary,
    children: childrenEl ? childrenEl.checked : false,
    notes: notesEl ? notesEl.value.trim() : '',
  };
}

function setFormValues(evt) {
  if (!evt || typeof evt !== 'object') return;
  if (evt.eventType && eventTypeEl) eventTypeEl.value = evt.eventType;
  if (weddingTraditionEl) weddingTraditionEl.value = evt.tradition || '';
  updateWeddingTraditionVisibility();
  if (evt.date && dateEl) dateEl.value = evt.date;
  if (evt.guestCount && guestCountEl) guestCountEl.value = evt.guestCount;
  if (evt.budget && budgetEl) budgetEl.value = evt.budget;
  if (evt.style && styleEl) styleEl.value = evt.style;
  if (evt.theme && themeEl) {
    themeEl.value = evt.theme;
    applyTheme(evt.theme);
  }
  if (evt.setting && settingEl) settingEl.value = evt.setting;
  if (childrenEl) childrenEl.checked = Boolean(evt.children);
  if (notesEl && typeof evt.notes === 'string') notesEl.value = sanitizeClientNotes(evt.notes);

  if (Array.isArray(evt.dietary)) {
    document.querySelectorAll('input[name="dietary"]').forEach(cb => {
      cb.checked = evt.dietary.includes(cb.value);
    });
  }
}

function serializePlanForUrlClient(formValues, checkedTasks = []) {
  const tasksArray = Array.from(checkedTasks || []);
  const compact = {
    v: 1,
    e: formValues.eventType || 'wedding',
    tr: formValues.tradition || '',
    d: formValues.date || '',
    g: formValues.guestCount || 100,
    b: formValues.budget || 100000,
    s: formValues.style || 'traditional',
    th: formValues.theme || 'royal-rajwada',
    st: formValues.setting || 'indoor',
    dt: formValues.dietary || [],
    ch: formValues.children ? 1 : 0,
    n: sanitizeClientNotes(formValues.notes || ''),
    ct: tasksArray,
  };
  const jsonStr = JSON.stringify(compact);
  return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  )).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deserializePlanFromUrlClient(encoded) {
  if (!encoded || typeof encoded !== 'string') return null;
  try {
    let clean = encoded.trim();
    if (clean.includes('plan=')) {
      clean = clean.split('plan=')[1].split('&')[0];
    } else if (clean.startsWith('#')) {
      clean = clean.slice(1);
    }
    let b64 = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(atob(b64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    const compact = JSON.parse(jsonStr);
    if (!compact || typeof compact !== 'object') return null;
    return {
      eventType: compact.e || 'wedding',
      tradition: compact.tr || '',
      date: compact.d || '',
      guestCount: parseInt(compact.g, 10) || 100,
      budget: parseInt(compact.b, 10) || 100000,
      style: compact.s || 'traditional',
      theme: compact.th || 'royal-rajwada',
      setting: compact.st || 'indoor',
      dietary: Array.isArray(compact.dt) ? compact.dt : [],
      children: Boolean(compact.ch),
      notes: sanitizeClientNotes(compact.n || ''),
      checkedTasks: Array.isArray(compact.ct) ? compact.ct : [],
    };
  } catch (e) {
    return null;
  }
}

function openShareModal() {
  if (!shareModal) return;
  const values = getFormValues();
  const encoded = serializePlanForUrlClient(values, state.checkedTasks);
  const shareUrl = `${window.location.origin}${window.location.pathname}#plan=${encoded}`;
  if (shareLinkInput) {
    shareLinkInput.value = shareUrl;
  }
  if (copyFeedback) {
    copyFeedback.style.display = 'none';
    copyFeedback.textContent = '';
  }
  if (importFeedback) {
    importFeedback.style.display = 'none';
    importFeedback.textContent = '';
  }
  shareModal.style.display = 'flex';
  if (headerShareBtn) headerShareBtn.setAttribute('aria-expanded', 'true');
  if (shareLinkInput) {
    shareLinkInput.focus();
    shareLinkInput.select();
  }
}

function closeShareModal() {
  if (!shareModal) return;
  shareModal.style.display = 'none';
  if (headerShareBtn) {
    headerShareBtn.setAttribute('aria-expanded', 'false');
    headerShareBtn.focus();
  }
}

async function copyShareLink() {
  if (!shareLinkInput) return;
  const url = shareLinkInput.value;
  let copied = false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = false;
    }
  }
  if (!copied) {
    shareLinkInput.select();
    try {
      document.execCommand('copy');
      copied = true;
    } catch (e) {
      copied = false;
    }
  }
  if (copyFeedback) {
    copyFeedback.textContent = t('linkCopied');
    copyFeedback.className = 'share-feedback success';
    copyFeedback.style.display = 'block';
    setTimeout(() => {
      if (copyFeedback) copyFeedback.style.display = 'none';
    }, 3500);
  }
}

function downloadPlanJson() {
  const values = getFormValues();
  const payload = {
    app: 'UtsavPlan',
    schemaVersion: '1.0',
    exportedAt: new Date().toISOString(),
    event: values,
    checkedTasks: Array.from(state.checkedTasks),
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = values.date || 'plan';
  a.href = url;
  a.download = `utsavplan-${values.eventType}-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const evt = parsed.event || parsed;
      if (!evt || typeof evt !== 'object' || !evt.eventType || !evt.budget) {
        throw new Error('Invalid format');
      }
      setFormValues(evt);
      if (Array.isArray(parsed.checkedTasks)) {
        state.checkedTasks = new Set(parsed.checkedTasks);
      }
      closeShareModal();
      if (sharedPlanBanner && sharedPlanBannerText) {
        sharedPlanBannerText.textContent = t('planLoadedSuccess');
        sharedPlanBanner.style.display = 'flex';
        setTimeout(() => {
          if (sharedPlanBanner) sharedPlanBanner.style.display = 'none';
        }, 5000);
      }
      await generatePlan(false);
    } catch (err) {
      if (importFeedback) {
        importFeedback.textContent = t('invalidJsonFile');
        importFeedback.className = 'share-feedback error';
        importFeedback.style.display = 'block';
      }
    }
  };
  reader.readAsText(file);
}

async function checkUrlHashForSharedPlan() {
  const hash = window.location.hash;
  if (!hash || !hash.includes('plan=')) return;
  const decoded = deserializePlanFromUrlClient(hash);
  if (decoded) {
    setFormValues(decoded);
    if (Array.isArray(decoded.checkedTasks)) {
      state.checkedTasks = new Set(decoded.checkedTasks);
    }
    if (sharedPlanBanner && sharedPlanBannerText) {
      sharedPlanBannerText.textContent = t('planLoadedSuccess');
      sharedPlanBanner.style.display = 'flex';
      setTimeout(() => {
        if (sharedPlanBanner) sharedPlanBanner.style.display = 'none';
      }, 5000);
    }
    await generatePlan(false);
  }
}

// --- Drafts Management Functions (localStorage only) ---
const MAX_DRAFTS = 10;
const MAX_DRAFT_NAME_LENGTH = 60;
const MAX_DRAFTS_STORAGE_BYTES = 500 * 1024;
const DRAFTS_STORAGE_KEY = 'utsavplan_drafts';

function isLocalStorageAvailable() {
  try {
    if (typeof localStorage === 'undefined' || !localStorage) return false;
    const testKey = '__utsavplan_storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

function validateClientDraft(draft) {
  if (!draft || typeof draft !== 'object') return false;
  if (typeof draft.id !== 'string' || !draft.id.trim()) return false;
  if (typeof draft.name !== 'string' || !draft.name.trim() || draft.name.length > MAX_DRAFT_NAME_LENGTH) return false;
  if (typeof draft.savedAt !== 'string') return false;
  if (isNaN(new Date(draft.savedAt).getTime())) return false;
  if (!draft.formValues || typeof draft.formValues !== 'object') return false;
  return true;
}

function getStoredDrafts() {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(item => validateClientDraft(item));
    valid.sort((a, b) => (new Date(b.savedAt).getTime() || 0) - (new Date(a.savedAt).getTime() || 0));
    return valid;
  } catch (e) {
    console.warn('Could not read drafts from localStorage', e);
    return [];
  }
}

function formatClientDraftTimestamp(isoString, lang = 'en') {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const locale = (lang === 'hi' || lang === 'hi-IN') ? 'hi-IN' : 'en-IN';
  try {
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return date.toISOString();
  }
}

function updateDraftsBadge() {
  const drafts = getStoredDrafts();
  if (draftsCountBadge) {
    if (drafts.length > 0) {
      draftsCountBadge.textContent = String(drafts.length);
      draftsCountBadge.style.display = 'inline-block';
    } else {
      draftsCountBadge.style.display = 'none';
    }
  }
}

function showDraftAnnouncement(message) {
  if (draftStatusLive) {
    draftStatusLive.textContent = message;
  }
  if (draftAlertBanner && draftAlertBannerText) {
    draftAlertBannerText.textContent = message;
    draftAlertBanner.style.display = 'flex';
    setTimeout(() => {
      if (draftAlertBanner) draftAlertBanner.style.display = 'none';
    }, 4000);
  }
}

function openSaveDraftDialog() {
  if (!isLocalStorageAvailable()) {
    showDraftAnnouncement(t('storageUnavailableWarning'));
    return;
  }
  const drafts = getStoredDrafts();
  if (drafts.length >= MAX_DRAFTS) {
    showDraftAnnouncement(t('draftsStorageWarning'));
    openDraftsModal();
    return;
  }
  const formValues = getFormValues();
  const defaultName = `${formValues.eventType || 'Event'} - ${formValues.date || 'Undated'}`.slice(0, MAX_DRAFT_NAME_LENGTH);
  if (draftNameInput) {
    draftNameInput.value = defaultName;
  }
  if (saveDraftError) {
    saveDraftError.style.display = 'none';
    saveDraftError.textContent = '';
  }
  if (saveDraftModal) {
    saveDraftModal.style.display = 'flex';
    if (draftNameInput) draftNameInput.focus();
  }
}

function closeSaveDraftDialog() {
  if (saveDraftModal) saveDraftModal.style.display = 'none';
}

function handleSaveDraftConfirm() {
  if (!isLocalStorageAvailable()) {
    if (saveDraftError) {
      saveDraftError.textContent = t('storageUnavailableWarning');
      saveDraftError.style.display = 'block';
    }
    return;
  }
  const drafts = getStoredDrafts();
  if (drafts.length >= MAX_DRAFTS) {
    if (saveDraftError) {
      saveDraftError.textContent = t('draftsStorageWarning');
      saveDraftError.style.display = 'block';
    }
    return;
  }

  const formValues = getFormValues();
  let draftName = draftNameInput ? draftNameInput.value.trim() : '';
  if (!draftName) {
    draftName = `${formValues.eventType || 'Event'} - ${formValues.date || 'Undated'}`;
  }
  draftName = draftName.slice(0, MAX_DRAFT_NAME_LENGTH);

  const draft = {
    id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: draftName,
    formValues,
    theme: themeEl ? themeEl.value : 'royal-rajwada',
    lang: state.lang,
    actualSpends: { ...state.actualSpends },
    vendorDetails: { ...state.vendorDetails },
    checkedTasks: Array.from(state.checkedTasks),
    savedAt: new Date().toISOString(),
  };

  const updatedDrafts = [draft, ...drafts];
  try {
    const serialized = JSON.stringify(updatedDrafts);
    if (serialized.length > MAX_DRAFTS_STORAGE_BYTES) {
      if (saveDraftError) {
        saveDraftError.textContent = 'Storage limit exceeded. Please delete an older draft.';
        saveDraftError.style.display = 'block';
      }
      return;
    }
    localStorage.setItem(DRAFTS_STORAGE_KEY, serialized);
    closeSaveDraftDialog();
    updateDraftsBadge();
    showDraftAnnouncement(t('draftSavedStatus'));
  } catch (e) {
    if (saveDraftError) {
      saveDraftError.textContent = t('storageUnavailableWarning');
      saveDraftError.style.display = 'block';
    }
  }
}

function openDraftsModal() {
  if (draftsModal) {
    draftsModal.style.display = 'flex';
    renderDraftsList();
  }
}

function closeDraftsModal() {
  if (draftsModal) draftsModal.style.display = 'none';
}

function renderDraftsList() {
  if (!draftsListContainer) return;
  while (draftsListContainer.firstChild) {
    draftsListContainer.removeChild(draftsListContainer.firstChild);
  }

  if (!isLocalStorageAvailable()) {
    if (draftsStorageWarning) {
      draftsStorageWarning.textContent = t('storageUnavailableWarning');
      draftsStorageWarning.style.display = 'block';
    }
    return;
  }

  const drafts = getStoredDrafts();
  updateDraftsBadge();

  if (draftsStorageWarning) {
    if (drafts.length >= MAX_DRAFTS) {
      draftsStorageWarning.textContent = t('draftsStorageWarning');
      draftsStorageWarning.style.display = 'block';
    } else {
      draftsStorageWarning.style.display = 'none';
    }
  }

  if (drafts.length === 0) {
    const emptyNotice = document.createElement('div');
    emptyNotice.className = 'drafts-empty-notice';
    emptyNotice.textContent = t('noDraftsMessage');
    draftsListContainer.appendChild(emptyNotice);
    return;
  }

  drafts.forEach(draft => {
    const item = document.createElement('div');
    item.className = 'draft-item';

    // Info
    const info = document.createElement('div');
    info.className = 'draft-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'draft-name';
    nameEl.textContent = draft.name;
    info.appendChild(nameEl);

    const meta = document.createElement('div');
    meta.className = 'draft-meta';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = formatClientDraftTimestamp(draft.savedAt, state.lang);
    meta.appendChild(timeSpan);

    if (draft.formValues && draft.formValues.eventType) {
      const tag = document.createElement('span');
      tag.className = 'draft-tag';
      tag.textContent = t(`event_${draft.formValues.eventType}`) || draft.formValues.eventType;
      meta.appendChild(tag);
    }

    if (draft.formValues && draft.formValues.budget) {
      const budgetSpan = document.createElement('span');
      budgetSpan.textContent = formatINR(draft.formValues.budget);
      meta.appendChild(budgetSpan);
    }

    info.appendChild(meta);
    item.appendChild(info);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'draft-actions';

    // Load button
    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.className = 'draft-action-btn draft-btn-load';
    loadBtn.textContent = t('draftLoadBtn');
    loadBtn.setAttribute('aria-label', `${t('draftLoadBtn')} ${draft.name}`);
    loadBtn.addEventListener('click', () => handleLoadDraft(draft.id));
    actions.appendChild(loadBtn);

    // Rename button
    const renameBtn = document.createElement('button');
    renameBtn.type = 'button';
    renameBtn.className = 'draft-action-btn';
    renameBtn.textContent = t('draftRenameBtn');
    renameBtn.setAttribute('aria-label', `${t('draftRenameBtn')} ${draft.name}`);
    renameBtn.addEventListener('click', () => openRenameDraftDialog(draft.id, draft.name));
    actions.appendChild(renameBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'draft-action-btn draft-btn-delete';
    deleteBtn.textContent = t('draftDeleteBtn');
    deleteBtn.setAttribute('aria-label', `${t('draftDeleteBtn')} ${draft.name}`);
    deleteBtn.addEventListener('click', () => openDeleteDraftDialog(draft.id, draft.name));
    actions.appendChild(deleteBtn);

    item.appendChild(actions);
    draftsListContainer.appendChild(item);
  });
}

async function handleLoadDraft(id) {
  const drafts = getStoredDrafts();
  const draft = drafts.find(d => d.id === id);
  if (!draft) return;

  if (draft.formValues) {
    setFormValues(draft.formValues);
  }
  if (draft.theme && themeEl) {
    themeEl.value = draft.theme;
    applyTheme(draft.theme);
  }
  if (draft.lang && draft.lang !== state.lang) {
    state.lang = draft.lang;
    updateLanguageUI();
  }
  if (draft.actualSpends) {
    state.actualSpends = { ...draft.actualSpends };
    saveStoredSpendAndVendors();
  }
  if (draft.vendorDetails) {
    state.vendorDetails = { ...draft.vendorDetails };
    saveStoredSpendAndVendors();
  }
  if (Array.isArray(draft.checkedTasks)) {
    state.checkedTasks = new Set(draft.checkedTasks);
  }

  closeDraftsModal();
  await generatePlan(false);
  showDraftAnnouncement(t('draftLoadedStatus'));
}

function openRenameDraftDialog(id, currentName) {
  state.targetDraftIdForRename = id;
  if (renameDraftInput) {
    renameDraftInput.value = currentName || '';
  }
  if (renameDraftError) {
    renameDraftError.style.display = 'none';
    renameDraftError.textContent = '';
  }
  if (renameDraftModal) {
    renameDraftModal.style.display = 'flex';
    if (renameDraftInput) renameDraftInput.focus();
  }
}

function closeRenameDraftDialog() {
  state.targetDraftIdForRename = null;
  if (renameDraftModal) renameDraftModal.style.display = 'none';
}

function handleConfirmRename() {
  const id = state.targetDraftIdForRename;
  if (!id) return;
  const newName = renameDraftInput ? renameDraftInput.value.trim() : '';
  if (!newName) {
    if (renameDraftError) {
      renameDraftError.textContent = state.lang === 'hi' ? 'कृपया ड्राफ्ट का नाम दर्ज करें।' : 'Please enter a draft name.';
      renameDraftError.style.display = 'block';
    }
    return;
  }

  const drafts = getStoredDrafts();
  const targetIndex = drafts.findIndex(d => d.id === id);
  if (targetIndex >= 0) {
    drafts[targetIndex].name = newName.slice(0, MAX_DRAFT_NAME_LENGTH);
    drafts[targetIndex].savedAt = new Date().toISOString();
    drafts.sort((a, b) => (new Date(b.savedAt).getTime() || 0) - (new Date(a.savedAt).getTime() || 0));
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      closeRenameDraftDialog();
      renderDraftsList();
      showDraftAnnouncement(t('draftRenamedStatus'));
    } catch (e) {
      if (renameDraftError) {
        renameDraftError.textContent = t('storageUnavailableWarning');
        renameDraftError.style.display = 'block';
      }
    }
  }
}

function openDeleteDraftDialog(id, draftName) {
  state.targetDraftIdForDelete = id;
  if (confirmDeleteDraftText) {
    confirmDeleteDraftText.textContent = state.lang === 'hi'
      ? `क्या आप निश्चित रूप से "${draftName || 'ड्राफ्ट'}" को हटाना चाहते हैं? इसे वापस नहीं लाया जा सकता।`
      : `Are you sure you want to delete draft "${draftName || 'Draft'}"? This action cannot be undone.`;
  }
  if (deleteDraftModal) {
    deleteDraftModal.style.display = 'flex';
    if (confirmDeleteBtn) confirmDeleteBtn.focus();
  }
}

function closeDeleteDraftDialog() {
  state.targetDraftIdForDelete = null;
  if (deleteDraftModal) deleteDraftModal.style.display = 'none';
}

function handleConfirmDelete() {
  const id = state.targetDraftIdForDelete;
  if (!id) return;
  const drafts = getStoredDrafts();
  const filtered = drafts.filter(d => d.id !== id);
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
    closeDeleteDraftDialog();
    renderDraftsList();
    updateDraftsBadge();
    showDraftAnnouncement(t('draftDeletedStatus'));
  } catch (e) {
    console.warn('Could not delete draft', e);
  }
}

// Live recalculation listener: triggers plan update on input change with debounce
let debounceTimer = null;
function handleInputChange() {
  if (!state.currentPlan) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    generatePlan(true);
  }, 450);
}

// Wire up events
function setupEventListeners() {
  // Form submission
  form.addEventListener('submit', e => {
    e.preventDefault();
    generatePlan(Boolean(state.currentPlan));
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    form.reset();
    setDefaultDate();
    applyTheme('royal-rajwada');
    state.currentPlan = null;
    state.previousInputs = null;
    state.actualSpends = {};
    state.vendorDetails = {};
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('utsavplan_spends');
        localStorage.removeItem('utsavplan_vendors');
      }
    } catch (e) {
      console.warn('Could not clear localStorage on reset', e);
    }
    if (weddingTraditionEl) {
      weddingTraditionEl.value = '';
    }
    updateWeddingTraditionVisibility();
    state.checkedTasks.clear();
    welcomePlaceholder.style.display = 'block';
    planContent.style.display = 'none';
    changeBanner.style.display = 'none';
    displayErrors([]);
    submitBtnText.textContent = t('submitBtn');
  });

  // Language toggle
  langToggleBtn.addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'hi' : 'en';
    updateLanguageUI();
  });

  // Theme change
  themeEl.addEventListener('change', () => {
    applyTheme(themeEl.value);
    handleInputChange();
  });

  // Export ICS
  exportIcsBtn.addEventListener('click', downloadIcs);

  // Single Print / Save PDF button in header
  if (headerPrintBtn) headerPrintBtn.addEventListener('click', handlePrint);

  // Welcome card Generate button
  if (welcomeGenerateBtn) {
    welcomeGenerateBtn.addEventListener('click', () => {
      generatePlan(false);
    });
  }

  // Live recalculation listeners
  guestCountEl.addEventListener('input', handleInputChange);
  budgetEl.addEventListener('input', handleInputChange);
  dateEl.addEventListener('change', handleInputChange);
  settingEl.addEventListener('change', handleInputChange);
  eventTypeEl.addEventListener('change', () => {
    updateWeddingTraditionVisibility();
    handleInputChange();
  });
  if (weddingTraditionEl) {
    weddingTraditionEl.addEventListener('change', handleInputChange);
  }
  styleEl.addEventListener('change', handleInputChange);
  childrenEl.addEventListener('change', handleInputChange);
  notesEl.addEventListener('input', () => {
    if (notesEl.value.length > 1000) {
      notesEl.value = sanitizeClientNotes(notesEl.value);
    }
    handleInputChange();
  });

  // Setup Voice features
  setupVoiceInput();
  setupVoiceReadout();

  // Share & Collaboration listeners
  if (headerShareBtn) headerShareBtn.addEventListener('click', openShareModal);
  if (shareModalCloseBtn) shareModalCloseBtn.addEventListener('click', closeShareModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeShareModal);
  if (copyShareLinkBtn) copyShareLinkBtn.addEventListener('click', copyShareLink);
  if (downloadJsonBtn) downloadJsonBtn.addEventListener('click', downloadPlanJson);

  // Draft listeners (drafts are stored only in this browser's localStorage)
  const on = (el, evt, fn) => { if (el) el.addEventListener(evt, fn); };
  on(saveDraftBtn, 'click', openSaveDraftDialog);
  on(saveDraftConfirmBtn, 'click', handleSaveDraftConfirm);
  on(saveDraftCancelBtn, 'click', closeSaveDraftDialog);
  on(saveDraftModalCloseBtn, 'click', closeSaveDraftDialog);
  on(draftNameInput, 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSaveDraftConfirm(); }
  });
  on(headerDraftsBtn, 'click', openDraftsModal);
  on(draftsModalCloseBtn, 'click', closeDraftsModal);
  on(draftsModalDismissBtn, 'click', closeDraftsModal);
  on(confirmRenameBtn, 'click', handleConfirmRename);
  on(cancelRenameBtn, 'click', closeRenameDraftDialog);
  on(renameDraftModalCloseBtn, 'click', closeRenameDraftDialog);
  on(renameDraftInput, 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleConfirmRename(); }
  });
  on(confirmDeleteBtn, 'click', handleConfirmDelete);
  on(cancelDeleteBtn, 'click', closeDeleteDraftDialog);
  on(deleteDraftModalCloseBtn, 'click', closeDeleteDraftDialog);
  [
    [saveDraftModal, closeSaveDraftDialog],
    [draftsModal, closeDraftsModal],
    [renameDraftModal, closeRenameDraftDialog],
    [deleteDraftModal, closeDeleteDraftDialog],
  ].forEach(([modal, close]) => on(modal, 'click', (e) => { if (e.target === modal) close(); }));
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    [
      [deleteDraftModal, closeDeleteDraftDialog],
      [renameDraftModal, closeRenameDraftDialog],
      [saveDraftModal, closeSaveDraftDialog],
      [draftsModal, closeDraftsModal],
    ].some(([modal, close]) => {
      if (modal && modal.style.display !== 'none') { close(); return true; }
      return false;
    });
  });

  if (importJsonFileInput) {
    importJsonFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImportFile(file);
      importJsonFileInput.value = '';
    });
  }

  // Backdrop click and escape key to close modal
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        closeShareModal();
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareModal && shareModal.style.display !== 'none') {
      closeShareModal();
    }
  });
}

// Initial bootstrap
async function init() {
  try {
    setDefaultDate();
  } catch (e) {
    console.warn('setDefaultDate failed', e);
  }

  try {
    if (themeEl) applyTheme(themeEl.value);
  } catch (e) {
    console.warn('applyTheme failed', e);
  }

  try {
    updateWeddingTraditionVisibility();
  } catch (e) {
    console.warn('updateWeddingTraditionVisibility failed', e);
  }

  try {
    loadStoredSpendAndVendors();
  } catch (e) {
    console.warn('loadStoredSpendAndVendors failed', e);
  }

  try {
    updateDraftsBadge();
  } catch (e) {
    console.warn('updateDraftsBadge failed', e);
  }

  // Setup listeners early so interactive buttons (Print, Voice, Submit, Share, Language) respond immediately
  try {
    setupEventListeners();
  } catch (e) {
    console.error('setupEventListeners failed', e);
  }

  try {
    await loadTranslations();
  } catch (e) {
    console.warn('loadTranslations failed', e);
  }

  try {
    updateLanguageUI();
  } catch (e) {
    console.warn('updateLanguageUI failed', e);
  }

  try {
    await checkUrlHashForSharedPlan();
  } catch (e) {
    console.warn('checkUrlHashForSharedPlan failed', e);
  }
}

init();


