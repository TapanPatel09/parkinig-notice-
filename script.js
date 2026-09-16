/**
 * Live Parking Notice Generator - Core Application Logic
 * Pure Vanilla JavaScript (Client-Side, No Frameworks, No Backend)
 */

(function () {
  'use strict';

  /* ==========================================================================
     CONSTANTS & SVG ASSET REPOSITORY
     ========================================================================== */

  // Built-in Notice Template Definitions (Gujarati & English)
  const NOTICE_TEMPLATES = {
    wrong_parking: {
      id: 'wrong_parking',
      titleGu: 'તાત્કાલિક પાર્કિંગ સૂચના',
      titleEn: 'URGENT PARKING NOTICE',
      defaultText: 'વાહન નંબર [VEHICLE NUMBER] યોગ્ય જગ્યાએ પાર્ક કરેલ નથી. કૃપા કરીને તેને યોગ્ય જગ્યાએ પાર્ક કરવા વિનંતી.'
    },
    light_on: {
      id: 'light_on',
      titleGu: 'વાહન લાઇટ ચાલુ સૂચના',
      titleEn: 'VEHICLE LIGHT ON NOTICE',
      defaultText: 'વાહન નંબર [VEHICLE NUMBER]ની લાઇટ ચાલુ છે. કૃપા કરીને તાત્કાલિક વાહનની લાઇટ બંધ કરવા વિનંતી છે.'
    },
    custom: {
      id: 'custom',
      titleGu: 'પાર્કિંગ જાહેરાત',
      titleEn: 'PARKING ANNOUNCEMENT',
      defaultText: 'વાહન નંબર [VEHICLE NUMBER] કૃપા કરીને પાર્કિંગ સ્થળ પરથી દૂર કરવા વિનંતી.'
    }
  };

  // High-Quality Crisp Inline Vector Illustrations for Vehicle Types
  const VEHICLE_SVGS = {
    car: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Modern Sedan Silhouette -->
        <path d="M12 44C12 44 24 22 42 16C58 10 90 10 104 18C116 25 126 36 128 44C132 45 136 48 136 52C136 56 132 58 128 58H118C116 50 108 44 98 44C88 44 80 50 78 58H54C52 50 44 44 34 44C24 44 16 50 14 58H8C4 58 2 55 2 51C2 47 6 44 12 44Z" fill="currentColor" opacity="0.95"/>
        <!-- Windows -->
        <path d="M44 20H68V38H26C31 29 37 23 44 20Z" fill="#0b0f19" opacity="0.85"/>
        <path d="M74 20H98C106 25 112 32 115 38H74V20Z" fill="#0b0f19" opacity="0.85"/>
        <!-- Headlight & Taillight -->
        <path d="M126 44C128 46 132 48 134 48V44H126Z" fill="#fef08a"/>
        <path d="M6 45H2V49H8L6 45Z" fill="#ef4444"/>
        <!-- Wheels -->
        <circle cx="34" cy="56" r="11" fill="#111827" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="34" cy="56" r="4.5" fill="currentColor"/>
        <circle cx="98" cy="56" r="11" fill="#111827" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="98" cy="56" r="4.5" fill="currentColor"/>
      </svg>
    `,
    bike: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Motorcycle Wheels -->
        <circle cx="30" cy="48" r="15" stroke="currentColor" stroke-width="4.5" fill="#111827"/>
        <circle cx="30" cy="48" r="5" fill="currentColor"/>
        <circle cx="110" cy="48" r="15" stroke="currentColor" stroke-width="4.5" fill="#111827"/>
        <circle cx="110" cy="48" r="5" fill="currentColor"/>
        <!-- Frame & Chassis -->
        <path d="M30 48L54 36L72 48H90L108 30M110 48L102 24L90 15H80M102 24H86L68 36L48 24H60" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Fuel Tank & Seat -->
        <path d="M64 22C64 22 72 16 86 16C94 16 98 22 96 26L74 27L64 22Z" fill="currentColor"/>
        <path d="M48 24C54 24 64 22 68 28H46L48 24Z" fill="#ffffff" opacity="0.9"/>
        <!-- Handlebar & Headlight -->
        <line x1="88" y1="12" x2="96" y2="17" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M106 20L114 22L108 26Z" fill="#fef08a"/>
      </svg>
    `,
    scooter: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Wheels -->
        <circle cx="32" cy="50" r="12" stroke="currentColor" stroke-width="4" fill="#111827"/>
        <circle cx="32" cy="50" r="4" fill="currentColor"/>
        <circle cx="106" cy="50" r="12" stroke="currentColor" stroke-width="4" fill="#111827"/>
        <circle cx="106" cy="50" r="4" fill="currentColor"/>
        <!-- Body Cowl & Floorboard -->
        <path d="M18 42C18 30 30 24 46 24C56 24 64 28 68 36L78 48H96L102 36L92 18H86" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 40C22 30 32 26 46 26C54 26 62 30 66 38L62 48H22V40Z" fill="currentColor" opacity="0.8"/>
        <!-- Seat -->
        <path d="M34 22C38 18 54 18 64 22L62 26H36L34 22Z" fill="#ffffff"/>
        <!-- Steering Column & Front Apron -->
        <path d="M92 18L104 38L106 50M90 14H98" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <circle cx="94" cy="14" r="3.5" fill="#fef08a"/>
      </svg>
    `,
    auto: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Wheels -->
        <circle cx="36" cy="52" r="11" stroke="currentColor" stroke-width="3.5" fill="#111827"/>
        <circle cx="36" cy="52" r="3.5" fill="currentColor"/>
        <circle cx="104" cy="52" r="11" stroke="currentColor" stroke-width="3.5" fill="#111827"/>
        <circle cx="104" cy="52" r="3.5" fill="currentColor"/>
        <!-- Cabin Silhouette (Iconic 3-Wheeler Auto) -->
        <path d="M20 46H16V36C16 26 24 16 38 15H80C86 15 94 20 98 26L112 40V46C112 49 108 52 102 52H96M48 52H92M26 52H18" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Canvas Roof / Hood -->
        <path d="M20 30C20 20 28 16 40 16H78C84 16 92 20 96 26L102 34H20V30Z" fill="currentColor" opacity="0.9"/>
        <!-- Windshield -->
        <path d="M84 22H96L106 36H84V22Z" fill="#0b0f19" opacity="0.85"/>
        <!-- Open Side Door Passenger Frame -->
        <rect x="36" y="28" width="34" height="18" rx="3" stroke="currentColor" stroke-width="3" fill="#0b0f19" opacity="0.6"/>
        <circle cx="114" cy="42" r="3" fill="#fef08a"/>
      </svg>
    `,
    bus: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Bus Coach Body -->
        <rect x="12" y="16" width="116" height="38" rx="6" fill="currentColor" opacity="0.95"/>
        <!-- Windows Row -->
        <rect x="18" y="22" width="16" height="14" rx="2" fill="#0b0f19"/>
        <rect x="38" y="22" width="16" height="14" rx="2" fill="#0b0f19"/>
        <rect x="58" y="22" width="16" height="14" rx="2" fill="#0b0f19"/>
        <rect x="78" y="22" width="16" height="14" rx="2" fill="#0b0f19"/>
        <!-- Front Windshield -->
        <path d="M98 22H120C122 22 124 24 124 26V36H98V22Z" fill="#0b0f19"/>
        <!-- Lights -->
        <circle cx="124" cy="46" r="3" fill="#fef08a"/>
        <rect x="12" y="44" width="3" height="6" fill="#ef4444"/>
        <!-- Wheels -->
        <circle cx="38" cy="54" r="10" stroke="#ffffff" stroke-width="2.5" fill="#111827"/>
        <circle cx="38" cy="54" r="4" fill="currentColor"/>
        <circle cx="102" cy="54" r="10" stroke="#ffffff" stroke-width="2.5" fill="#111827"/>
        <circle cx="102" cy="54" r="4" fill="currentColor"/>
      </svg>
    `,
    truck: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Cargo Body Bed -->
        <rect x="14" y="18" width="68" height="34" rx="3" fill="currentColor" opacity="0.9"/>
        <line x1="36" y1="18" x2="36" y2="52" stroke="#0b0f19" stroke-width="2"/>
        <line x1="58" y1="18" x2="58" y2="52" stroke="#0b0f19" stroke-width="2"/>
        <!-- Truck Driver Cabin -->
        <path d="M84 26H108C114 26 122 32 124 38L126 52H84V26Z" fill="currentColor"/>
        <!-- Cabin Window -->
        <path d="M88 30H106C110 30 114 34 116 38H88V30Z" fill="#0b0f19"/>
        <!-- Headlight -->
        <circle cx="124" cy="46" r="3" fill="#fef08a"/>
        <!-- Heavy Wheels -->
        <circle cx="32" cy="54" r="9" stroke="#ffffff" stroke-width="2" fill="#111827"/>
        <circle cx="32" cy="54" r="3" fill="currentColor"/>
        <circle cx="52" cy="54" r="9" stroke="#ffffff" stroke-width="2" fill="#111827"/>
        <circle cx="52" cy="54" r="3" fill="currentColor"/>
        <circle cx="106" cy="54" r="9" stroke="#ffffff" stroke-width="2" fill="#111827"/>
        <circle cx="106" cy="54" r="3" fill="currentColor"/>
      </svg>
    `,
    tractor: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Rear Fender Guard -->
        <path d="M16 46C16 33 26 23 39 23C47 23 54 27 58 34L53 37C50 32 45 28 39 28C29 28 21 36 21 46H16Z" fill="currentColor" opacity="0.9"/>
        <!-- Driver Seat & Backrest -->
        <path d="M30 26C30 24 32 22 34 22H39V35H32C30.9 35 30 34.1 30 33V26Z" fill="#ffffff" opacity="0.9"/>
        <!-- Steering Wheel & Column -->
        <line x1="58" y1="36" x2="52" y2="28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="50" cy="26" rx="5" ry="2.5" fill="none" stroke="#ffffff" stroke-width="2" transform="rotate(-30 50 26)"/>
        <!-- Tractor Hood / Engine Body -->
        <path d="M54 34H110C114 34 118 37 118 41V50H54V34Z" fill="currentColor" opacity="0.95"/>
        <!-- Engine Side Grille / Air Vents -->
        <line x1="68" y1="38" x2="68" y2="46" stroke="#0b0f19" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="74" y1="38" x2="74" y2="46" stroke="#0b0f19" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="80" y1="38" x2="80" y2="46" stroke="#0b0f19" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Front Grille Panel -->
        <path d="M112 37V48" stroke="#0b0f19" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Exhaust Stack / Chimney with Rain Cap -->
        <path d="M96 16V34" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M93 16C93 14 99 14 99 16H93Z" fill="#ffffff"/>
        <!-- Air Pre-cleaner Canister -->
        <rect x="85" y="22" width="6" height="12" rx="2" fill="#0b0f19" opacity="0.9"/>
        <!-- Front Headlight -->
        <circle cx="118" cy="40" r="3" fill="#fef08a"/>
        <!-- Chassis Base Bar -->
        <rect x="36" y="48" width="70" height="5" rx="2" fill="#111827"/>
        <!-- Heavy Lug Rear Wheel -->
        <circle cx="38" cy="46" r="18" fill="#111827" stroke="#ffffff" stroke-width="3"/>
        <circle cx="38" cy="46" r="11" fill="currentColor" opacity="0.3"/>
        <circle cx="38" cy="46" r="6" fill="currentColor"/>
        <!-- Front Steer Wheel -->
        <circle cx="106" cy="52" r="11" fill="#111827" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="106" cy="52" r="4.5" fill="currentColor"/>
      </svg>
    `,
    other: `
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Generic Transport / Vehicle Badge -->
        <rect x="25" y="16" width="90" height="38" rx="8" stroke="currentColor" stroke-width="4" fill="#0b0f19" opacity="0.8"/>
        <path d="M40 35L70 18L100 35L70 52L40 35Z" stroke="currentColor" stroke-width="3" fill="none"/>
        <circle cx="70" cy="35" r="8" fill="currentColor"/>
        <!-- Wheels -->
        <circle cx="45" cy="54" r="8" stroke="#ffffff" stroke-width="2" fill="#111827"/>
        <circle cx="95" cy="54" r="8" stroke="#ffffff" stroke-width="2" fill="#111827"/>
      </svg>
    `
  };

  // Vehicle Gujarati Labels for Badge Display
  const VEHICLE_LABELS = {
    car: 'CAR / કાર',
    bike: 'BIKE / મોટરસાયકલ',
    scooter: 'SCOOTER / સ્કૂટર',
    auto: 'AUTO / રિક્ષા',
    bus: 'BUS / બસ',
    truck: 'TRUCK / ટ્રક',
    tractor: 'TRACTOR / ટ્રેક્ટર',
    other: 'VEHICLE / વાહન'
  };

  /* ==========================================================================
     APPLICATION STATE
     ========================================================================== */
  const state = {
    noticeType: 'wrong_parking',   // 'wrong_parking' | 'light_on' | 'custom'
    customMessage: 'વાહન નંબર [VEHICLE NUMBER] કૃપા કરીને પાર્કિંગ સ્થળ પરથી દૂર કરવા વિનંતી.',
    vehicleType: 'car',            // 'car' | 'bike' | 'scooter' | 'auto' | 'bus' | 'truck' | 'tractor' | 'other'
    customVehicleName: '',
    vehicleNumber: 'GJ01AB1234',
    programName: 'RAVI SABHA',
    location: 'PARKING AREA',
    additionalInfo: '',
    theme: 'amber',                // 'amber' | 'crimson' | 'royal'
    isFullscreen: false
  };

  /* ==========================================================================
     DOM ELEMENT REFERENCES
     ========================================================================== */
  const dom = {
    // Buttons
    resetBtn: document.getElementById('resetBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    projectorPreviewBtn: document.getElementById('projectorPreviewBtn'),
    exitFullscreenBtn: document.getElementById('exitFullscreenBtn'),
    clearVehNumBtn: document.getElementById('clearVehNumBtn'),
    insertTokenBtn: document.getElementById('insertTokenBtn'),

    // Notice Type Radio Cards
    cardWrongParking: document.getElementById('cardWrongParking'),
    cardLightOn: document.getElementById('cardLightOn'),
    cardCustomNotice: document.getElementById('cardCustomNotice'),
    noticeRadios: document.querySelectorAll('input[name="noticeType"]'),
    customNoticeSection: document.getElementById('customNoticeSection'),
    customNoticeText: document.getElementById('customNoticeText'),

    // Vehicle Type
    vehButtons: document.querySelectorAll('.veh-btn'),
    customVehicleWrapper: document.getElementById('customVehicleWrapper'),
    customVehicleInput: document.getElementById('customVehicleInput'),

    // Vehicle Number
    vehicleNumberInput: document.getElementById('vehicleNumberInput'),
    miniPlateNumber: document.getElementById('miniPlateNumber'),

    // Program Details
    programNameInput: document.getElementById('programNameInput'),
    locationInput: document.getElementById('locationInput'),
    additionalInfoInput: document.getElementById('additionalInfoInput'),

    // Themes
    themeButtons: document.querySelectorAll('.theme-btn'),

    // Preview Stage & Native Canvas
    previewStage: document.querySelector('.preview-stage'),
    canvasViewport: document.getElementById('canvasViewport'),
    canvasScaler: document.getElementById('canvasScaler'),
    noticeCanvas: document.getElementById('noticeCanvas'),
    zoomPercentText: document.getElementById('zoomPercentText'),

    // Canvas Elements
    canvasProgramBanner: document.getElementById('canvasProgramBanner'),
    canvasProgramName: document.getElementById('canvasProgramName'),
    canvasNoticeTitleGu: document.getElementById('canvasNoticeTitleGu'),
    canvasNoticeTitleEn: document.getElementById('canvasNoticeTitleEn'),
    canvasVehicleIconWrapper: document.getElementById('canvasVehicleIconWrapper'),
    canvasVehicleTypeBadge: document.getElementById('canvasVehicleTypeBadge'),
    canvasVehicleTypeText: document.getElementById('canvasVehicleTypeText'),
    canvasPlateNumber: document.getElementById('canvasPlateNumber'),
    canvasNoticeMessage: document.getElementById('canvasNoticeMessage'),
    canvasLocationBlock: document.getElementById('canvasLocationBlock'),
    canvasLocationName: document.getElementById('canvasLocationName'),
    canvasExtraBlock: document.getElementById('canvasExtraBlock'),
    canvasExtraText: document.getElementById('canvasExtraText'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  /* ==========================================================================
     INPUT SANITIZATION & FORMATTING HELPERS
     ========================================================================== */

  /**
   * Sanitizes and formats Indian vehicle registration number
   * - Converts to UPPERCASE
   * - Removes special characters except alphanumeric & single space
   * - Trims leading/trailing whitespace
   */
  function formatVehicleNumber(raw) {
    if (!raw) return '';
    // Convert to upper case and strip unwanted symbols
    let cleaned = raw.toUpperCase().replace(/[^A-Z0-9\s]/g, '').trim();
    // Collapse multi-spaces to single space
    cleaned = cleaned.replace(/\s+/g, ' ');
    return cleaned;
  }

  /**
   * Returns a display-safe plate number (or placeholder if empty)
   */
  function getSafePlateNumber() {
    const num = state.vehicleNumber.trim();
    return num.length > 0 ? num : 'GJ 00 XX 0000';
  }

  /* ==========================================================================
     CORE UPDATE CONTROLLERS
     ========================================================================== */

  /**
   * Updates the Vehicle Registration Number across sidebar preview,
   * realistic plate display, and inside notice text
   */
  function updateVehicleNumber() {
    const rawVal = dom.vehicleNumberInput.value;
    const formatted = formatVehicleNumber(rawVal);

    // Update input if casing/cleaning changed it
    if (rawVal !== formatted && rawVal.toUpperCase() === formatted) {
      dom.vehicleNumberInput.value = formatted;
    }

    state.vehicleNumber = formatted;
    const safeNumber = getSafePlateNumber();

    // 1. Update Realistic Number Plate
    if (dom.canvasPlateNumber) {
      dom.canvasPlateNumber.textContent = safeNumber;
    }

    // 2. Update Sidebar Mini Plate Preview
    if (dom.miniPlateNumber) {
      dom.miniPlateNumber.textContent = safeNumber;
    }

    // 3. Re-render notice message to reflect updated plate in Gujarati text
    updateNoticeText();
  }

  /**
   * Updates the Vehicle Icon Illustration & Type Badge on the canvas
   */
  function updateVehicle() {
    const type = state.vehicleType;
    const svgCode = VEHICLE_SVGS[type] || VEHICLE_SVGS.car;

    // Inject crisp SVG illustration
    if (dom.canvasVehicleIconWrapper) {
      dom.canvasVehicleIconWrapper.innerHTML = svgCode;
    }

    // Determine label
    let labelText = VEHICLE_LABELS[type] || 'VEHICLE';
    if (type === 'other') {
      const customName = state.customVehicleName.trim();
      labelText = customName.length > 0 ? customName.toUpperCase() : 'VEHICLE / વાહન';
    }

    if (dom.canvasVehicleTypeText) {
      dom.canvasVehicleTypeText.textContent = labelText;
    }
  }

  /**
   * Formats and updates the Gujarati message text with vehicle number substitution
   */
  function updateNoticeText() {
    const template = NOTICE_TEMPLATES[state.noticeType] || NOTICE_TEMPLATES.wrong_parking;

    // Update Banner Titles
    if (dom.canvasNoticeTitleGu) dom.canvasNoticeTitleGu.textContent = template.titleGu;
    if (dom.canvasNoticeTitleEn) dom.canvasNoticeTitleEn.textContent = template.titleEn;

    // Determine raw template message
    let rawMessage = '';
    if (state.noticeType === 'custom') {
      rawMessage = state.customMessage || '';
      if (!rawMessage.trim()) {
        rawMessage = 'વાહન નંબર [VEHICLE NUMBER] કૃપા કરીને પાર્કિંગ સ્થળ પરથી દૂર કરવા વિનંતી.';
      }
    } else {
      rawMessage = template.defaultText;
    }

    const safeNumber = getSafePlateNumber();

    // Render message safely with highlighted vehicle number token
    if (dom.canvasNoticeMessage) {
      // Clear children safely
      dom.canvasNoticeMessage.textContent = '';

      // Check if message contains the token [VEHICLE NUMBER]
      const tokenRegex = /\[VEHICLE NUMBER\]/g;
      if (tokenRegex.test(rawMessage)) {
        const parts = rawMessage.split(/\[VEHICLE NUMBER\]/);
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) {
            dom.canvasNoticeMessage.appendChild(document.createTextNode(parts[i]));
          }
          // Insert highlighted plate span between split segments
          if (i < parts.length - 1) {
            const plateSpan = document.createElement('span');
            plateSpan.className = 'message-plate-highlight';
            plateSpan.textContent = safeNumber;
            dom.canvasNoticeMessage.appendChild(plateSpan);
          }
        }
      } else {
        // Direct text without token
        dom.canvasNoticeMessage.textContent = rawMessage;
      }
    }
  }

  /**
   * Updates Event/Program details & Location
   */
  function updateEventDetails() {
    const progName = state.programName.trim();
    if (dom.canvasProgramBanner && dom.canvasProgramName) {
      if (progName) {
        dom.canvasProgramName.textContent = progName;
        dom.canvasProgramBanner.style.display = 'inline-flex';
      } else {
        dom.canvasProgramBanner.style.display = 'none';
      }
    }

    const locName = state.location.trim();
    if (dom.canvasLocationBlock && dom.canvasLocationName) {
      if (locName) {
        dom.canvasLocationName.textContent = locName;
        dom.canvasLocationBlock.style.display = 'flex';
      } else {
        dom.canvasLocationBlock.style.display = 'none';
      }
    }

    const extra = state.additionalInfo.trim();
    if (dom.canvasExtraBlock && dom.canvasExtraText) {
      if (extra) {
        dom.canvasExtraText.textContent = extra;
        dom.canvasExtraBlock.style.display = 'flex';
      } else {
        dom.canvasExtraBlock.style.display = 'none';
      }
    }
  }

  /**
   * Master Update Function: Synchronizes the entire state to the preview
   */
  function updatePreview() {
    updateVehicleNumber();
    updateVehicle();
    updateNoticeText();
    updateEventDetails();
    updateTheme();
    calculateScale();
  }

  /**
   * Visual theme switcher (Amber, Crimson, Royal)
   */
  function updateTheme() {
    if (!dom.noticeCanvas) return;
    dom.noticeCanvas.classList.remove('theme-amber', 'theme-crimson', 'theme-royal');
    dom.noticeCanvas.classList.add('theme-' + state.theme);
    dom.noticeCanvas.setAttribute('data-theme', state.theme);

    // Sync theme buttons in sidebar
    dom.themeButtons.forEach(btn => {
      const active = btn.dataset.theme === state.theme;
      btn.classList.toggle('active', active);
    });
  }

  /* ==========================================================================
     16:9 RESPONSIVE VIEWPORT SCALING
     ========================================================================== */

  /**
   * Computes scale factor so the 1920x1080 canvas fits cleanly inside
   * the visible preview container while maintaining exact 16:9 aspect ratio
   */
  function calculateScale() {
    if (!dom.canvasViewport || !dom.canvasScaler) return;

    // Viewport dimensions
    const viewportRect = dom.canvasViewport.getBoundingClientRect();
    const paddingX = 40;
    const paddingY = 40;

    const availableWidth = Math.max(100, viewportRect.width - paddingX);
    const availableHeight = Math.max(100, viewportRect.height - paddingY);

    // Scale calculation against fixed 1920x1080 native resolution
    const scaleX = availableWidth / 1920;
    const scaleY = availableHeight / 1080;
    const scale = Math.min(scaleX, scaleY);

    // Apply smooth transform scale
    dom.canvasScaler.style.transform = `scale(${scale})`;

    // Update resolution zoom readout
    if (dom.zoomPercentText) {
      const pct = Math.round(scale * 100);
      dom.zoomPercentText.textContent = `Fit (${pct}%)`;
    }
  }

  /* ==========================================================================
     HIGH-RES 1920 × 1080 PNG DOWNLOAD PIPELINE
     ========================================================================== */

  /**
   * Downloads the notice canvas at strictly 1920 × 1080 resolution
   * Guarantees fonts are ready and no parent CSS transforms distort the output
   */
  async function downloadNotice() {
    const btn = dom.downloadBtn;
    const originalBtnText = btn ? btn.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/>
          </svg>
          <span>Rendering 1080p...</span>
        `;
      }

      showToast('Rendering high-resolution 1920×1080 image...', 'info');

      // 1. Ensure all Gujarati & Web Fonts are fully loaded and active
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Small tick to ensure browser layout queue has settled
      await new Promise(resolve => setTimeout(resolve, 100));

      // 2. Clone the noticeCanvas to an isolated offscreen container
      // This is crucial: html2canvas is completely isolated from parent CSS scale transforms,
      // guaranteeing an exact 1920x1080 bitmap output without offset or blurriness!
      const targetCanvas = dom.noticeCanvas;
      const clone = targetCanvas.cloneNode(true);

      // Wrapper container fixed offscreen
      const renderContainer = document.createElement('div');
      renderContainer.style.position = 'fixed';
      renderContainer.style.top = '0';
      renderContainer.style.left = '-99999px';
      renderContainer.style.width = '1920px';
      renderContainer.style.height = '1080px';
      renderContainer.style.margin = '0';
      renderContainer.style.padding = '0';
      renderContainer.style.overflow = 'hidden';
      renderContainer.style.zIndex = '-9999';

      // Ensure clone is strictly 1920x1080 with no transforms
      clone.style.width = '1920px';
      clone.style.height = '1080px';
      clone.style.transform = 'none';
      clone.style.margin = '0';

      renderContainer.appendChild(clone);
      document.body.appendChild(renderContainer);

      // 3. Execute html2canvas capture
      /* global html2canvas */
      if (typeof html2canvas !== 'function') {
        throw new Error('html2canvas library is not loaded. Check CDN connection.');
      }

      const canvas = await html2canvas(clone, {
        width: 1920,
        height: 1080,
        scale: 1, // 1:1 scale for exact 1920x1080 dimensions
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0b0f19',
        logging: false
      });

      // Remove temporary clone from DOM
      document.body.removeChild(renderContainer);

      // 4. Generate download file
      const plateNumber = (state.vehicleNumber.trim() || 'NOTICE').replace(/\s+/g, '-');
      const filename = `parking-notice-${plateNumber}.png`;

      const dataUrl = canvas.toDataURL('image/png', 1.0);

      // Trigger standard browser download anchor
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`Successfully downloaded: ${filename} (1920×1080)`, 'success');

    } catch (err) {
      console.error('Download notice failed:', err);
      showToast('Error exporting notice: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }
  }

  /* ==========================================================================
     FULLSCREEN PROJECTOR / LED BROADCAST MODE
     ========================================================================== */

  function enterFullscreen() {
    const stage = dom.previewStage;
    if (!stage) return;

    if (!document.fullscreenElement) {
      const docEl = document.documentElement;
      const requestFS = stage.requestFullscreen || stage.webkitRequestFullscreen || stage.msRequestFullscreen || docEl.requestFullscreen;
      if (requestFS) {
        requestFS.call(stage).catch(err => {
          console.warn('Fullscreen request denied or unpermitted:', err);
        });
      }
    }

    stage.classList.add('fullscreen-active');
    state.isFullscreen = true;
    calculateScale();
    showToast('Entered Fullscreen Mode (Press Esc to exit)', 'info');
  }

  function exitFullscreen() {
    const stage = dom.previewStage;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    if (stage) {
      stage.classList.remove('fullscreen-active');
    }
    state.isFullscreen = false;
    calculateScale();
  }

  function handleFullscreenChange() {
    const isFS = !!document.fullscreenElement;
    state.isFullscreen = isFS;
    if (dom.previewStage) {
      dom.previewStage.classList.toggle('fullscreen-active', isFS);
    }
    setTimeout(calculateScale, 60);
  }

  /* ==========================================================================
     RESET FORM CONTROLLER
     ========================================================================== */

  function resetForm() {
    // Restore default state
    state.noticeType = 'wrong_parking';
    state.customMessage = 'વાહન નંબર [VEHICLE NUMBER] કૃપા કરીને પાર્કિંગ સ્થળ પરથી દૂર કરવા વિનંતી.';
    state.vehicleType = 'car';
    state.customVehicleName = '';
    state.vehicleNumber = 'GJ01AB1234';
    state.programName = 'RAVI SABHA';
    state.location = 'PARKING AREA';
    state.additionalInfo = '';
    state.theme = 'amber';

    // Sync HTML inputs
    dom.noticeRadios.forEach(radio => {
      radio.checked = radio.value === 'wrong_parking';
    });
    syncNoticeCards();

    if (dom.customNoticeText) dom.customNoticeText.value = state.customMessage;
    if (dom.customNoticeSection) dom.customNoticeSection.style.display = 'none';

    // Sync vehicle buttons
    dom.vehButtons.forEach(btn => {
      const active = btn.dataset.type === 'car';
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (dom.customVehicleWrapper) dom.customVehicleWrapper.style.display = 'none';
    if (dom.customVehicleInput) dom.customVehicleInput.value = '';

    if (dom.vehicleNumberInput) dom.vehicleNumberInput.value = state.vehicleNumber;
    if (dom.programNameInput) dom.programNameInput.value = state.programName;
    if (dom.locationInput) dom.locationInput.value = state.location;
    if (dom.additionalInfoInput) dom.additionalInfoInput.value = '';

    updatePreview();
    showToast('Defaults restored successfully', 'success');
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */

  function showToast(message, type = 'info') {
    if (!dom.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3200);
  }

  /* ==========================================================================
     UI EVENT BINDINGS
     ========================================================================== */

  function syncNoticeCards() {
    dom.cardWrongParking.classList.toggle('active', state.noticeType === 'wrong_parking');
    dom.cardLightOn.classList.toggle('active', state.noticeType === 'light_on');
    dom.cardCustomNotice.classList.toggle('active', state.noticeType === 'custom');
    dom.customNoticeSection.style.display = state.noticeType === 'custom' ? 'block' : 'none';
  }

  function setupEventListeners() {
    // 1. Notice Type selection
    dom.noticeRadios.forEach(radio => {
      radio.addEventListener('change', e => {
        state.noticeType = e.target.value;
        syncNoticeCards();
        updateNoticeText();
        calculateScale();
      });
    });

    // Custom Notice textarea typing
    if (dom.customNoticeText) {
      dom.customNoticeText.addEventListener('input', e => {
        state.customMessage = e.target.value;
        if (state.noticeType === 'custom') {
          updateNoticeText();
        }
      });
    }

    // Insert [VEHICLE NUMBER] helper token
    if (dom.insertTokenBtn && dom.customNoticeText) {
      dom.insertTokenBtn.addEventListener('click', () => {
        const textarea = dom.customNoticeText;
        const token = '[VEHICLE NUMBER]';
        const start = textarea.selectionStart || textarea.value.length;
        const end = textarea.selectionEnd || textarea.value.length;
        const text = textarea.value;

        textarea.value = text.substring(0, start) + token + text.substring(end);
        state.customMessage = textarea.value;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + token.length;

        updateNoticeText();
      });
    }

    // 2. Vehicle Type Selection
    dom.vehButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.vehButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        state.vehicleType = btn.dataset.type;

        // Toggle custom input field when 'other' is chosen
        const isOther = state.vehicleType === 'other';
        dom.customVehicleWrapper.style.display = isOther ? 'flex' : 'none';

        updateVehicle();
      });
    });

    if (dom.customVehicleInput) {
      dom.customVehicleInput.addEventListener('input', e => {
        state.customVehicleName = e.target.value;
        if (state.vehicleType === 'other') {
          updateVehicle();
        }
      });
    }

    // 3. Vehicle Number Input
    if (dom.vehicleNumberInput) {
      dom.vehicleNumberInput.addEventListener('input', updateVehicleNumber);
      dom.vehicleNumberInput.addEventListener('change', updateVehicleNumber);
    }

    if (dom.clearVehNumBtn) {
      dom.clearVehNumBtn.addEventListener('click', () => {
        dom.vehicleNumberInput.value = '';
        updateVehicleNumber();
        dom.vehicleNumberInput.focus();
      });
    }

    // 4. Program & Location Inputs
    if (dom.programNameInput) {
      dom.programNameInput.addEventListener('input', e => {
        state.programName = e.target.value;
        updateEventDetails();
      });
    }

    if (dom.locationInput) {
      dom.locationInput.addEventListener('input', e => {
        state.location = e.target.value;
        updateEventDetails();
      });
    }

    if (dom.additionalInfoInput) {
      dom.additionalInfoInput.addEventListener('input', e => {
        state.additionalInfo = e.target.value;
        updateEventDetails();
      });
    }

    // 5. Theme selection
    dom.themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        state.theme = btn.dataset.theme;
        updateTheme();
      });
    });

    // 6. Action buttons
    if (dom.downloadBtn) {
      dom.downloadBtn.addEventListener('click', downloadNotice);
    }

    if (dom.resetBtn) {
      dom.resetBtn.addEventListener('click', resetForm);
    }

    if (dom.fullscreenBtn) {
      dom.fullscreenBtn.addEventListener('click', enterFullscreen);
    }

    if (dom.projectorPreviewBtn) {
      dom.projectorPreviewBtn.addEventListener('click', enterFullscreen);
    }

    if (dom.exitFullscreenBtn) {
      dom.exitFullscreenBtn.addEventListener('click', exitFullscreen);
    }

    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Escape key listener for fullscreen
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.isFullscreen) {
        exitFullscreen();
      }
    });

    // Window resize scaling listener
    window.addEventListener('resize', calculateScale);
  }

  /* ==========================================================================
     APPLICATION INITIALIZATION
     ========================================================================== */

  function initApp() {
    setupEventListeners();
    updatePreview();

    // Initial scale calculation after paint
    window.requestAnimationFrame(() => {
      calculateScale();
      setTimeout(calculateScale, 150);
    });

    console.log('Live Parking Notice Generator initialized successfully.');
  }

  // DOM Content Ready bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
