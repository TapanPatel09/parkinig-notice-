/**
 * Spiritual Program Parking Notice Generator - Core Application Logic
 * Pure Vanilla JavaScript (Client-Side, Zero Frameworks, Zero Backend)
 * 16:9 Ultra-HD (1920 × 1080) Live Display & PNG Export Pipeline
 */

(function () {
  'use strict';

  /* ==========================================================================
     MANUALLY CHANGE THESE LOGO PATHS
     Set the relative or absolute paths to your event/organization logo files.
     ========================================================================== */
  const LEFT_LOGO_PATH = "assets/logo-left.png";
  const RIGHT_LOGO_PATH = "assets/logo-right.png";

  /* ==========================================================================
     BUILT-IN NOTICE TEMPLATES (GUJARATI NOTICES)
     ========================================================================== */
  const NOTICE_TEMPLATES = {
    wrong_parking: {
      id: 'wrong_parking',
      title: 'વાહન સૂચના',
      message: 'વાહન નંબર [VEHICLE NUMBER] યોગ્ય જગ્યાએ પાર્ક કરેલ નથી. કૃપા કરીને તેને યોગ્ય જગ્યાએ પાર્ક કરવા વિનંતી.'
    },
    light_on: {
      id: 'light_on',
      title: 'વાહન સૂચના',
      message: 'વાહન નંબર [VEHICLE NUMBER]ની લાઇટ ચાલુ છે. કૃપા કરીને તાત્કાલિક વાહનની લાઇટ બંધ કરવા વિનંતી છે.'
    },
    custom: {
      id: 'custom',
      title: 'વાહન સૂચના',
      message: 'વાહન નંબર [VEHICLE NUMBER] કૃપા કરીને પાર્કિંગ સ્થળ પરથી દૂર કરવા વિનંતી.'
    }
  };

  /* ==========================================================================
     RESTRAINED SPIRITUAL BROWN / NEUTRAL VECTOR ILLUSTRATIONS
     Inline crisp SVG graphics conforming to the formal spiritual notice design.
     ========================================================================== */
  const VEHICLE_SVGS = {
    car: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Sedan Roof & Windows -->
        <path d="M48 24C58 16 88 15 106 24L124 38H30L48 24Z" fill="#542810" opacity="0.3"/>
        <path d="M50 25L34 38H76V21C64 21 54 23 50 25Z" fill="#7A4B2A" opacity="0.85"/>
        <path d="M82 21V38H121L104 25C96 22 88 21 82 21Z" fill="#7A4B2A" opacity="0.85"/>
        <!-- Car Body Silhouette -->
        <path d="M14 44C14 44 26 26 46 20C64 15 96 15 112 22C124 28 138 38 142 45C147 47 152 50 152 54C152 58 147 60 142 60H130C128 50 118 42 106 42C94 42 84 50 82 60H56C54 50 44 42 32 42C20 42 10 50 8 60H4C2 60 0 57 0 53C0 49 4 44 14 44Z" fill="#6E381A"/>
        <!-- Headlight & Tail accent -->
        <path d="M140 45C144 47 148 48 150 48V45H140Z" fill="#d97706"/>
        <path d="M4 46H0V50H6L4 46Z" fill="#b45309"/>
        <!-- Wheels -->
        <circle cx="32" cy="58" r="12" fill="#3D1E0C" stroke="#F7F2E8" stroke-width="2.5"/>
        <circle cx="32" cy="58" r="5" fill="#d97706"/>
        <circle cx="106" cy="58" r="12" fill="#3D1E0C" stroke="#F7F2E8" stroke-width="2.5"/>
        <circle cx="106" cy="58" r="5" fill="#d97706"/>
      </svg>
    `,
    bike: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Wheels -->
        <circle cx="32" cy="52" r="16" stroke="#6E381A" stroke-width="5" fill="#F7F2E8"/>
        <circle cx="32" cy="52" r="5" fill="#542810"/>
        <circle cx="120" cy="52" r="16" stroke="#6E381A" stroke-width="5" fill="#F7F2E8"/>
        <circle cx="120" cy="52" r="5" fill="#542810"/>
        <!-- Frame & Chassis -->
        <path d="M32 52L58 38L78 52H98L118 32M120 52L112 26L98 16H88M112 26H94L74 38L52 26H66" stroke="#6E381A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Fuel Tank & Seat -->
        <path d="M70 24C70 24 78 18 92 18C100 18 104 24 102 28L80 29L70 24Z" fill="#542810"/>
        <path d="M52 26C58 26 70 24 74 30H50L52 26Z" fill="#7A4B2A"/>
        <!-- Handlebars -->
        <line x1="96" y1="13" x2="105" y2="18" stroke="#542810" stroke-width="4" stroke-linecap="round"/>
        <circle cx="116" cy="22" r="4" fill="#d97706"/>
      </svg>
    `,
    scooter: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Wheels -->
        <circle cx="36" cy="54" r="13" stroke="#6E381A" stroke-width="4.5" fill="#F7F2E8"/>
        <circle cx="36" cy="54" r="4.5" fill="#542810"/>
        <circle cx="118" cy="54" r="13" stroke="#6E381A" stroke-width="4.5" fill="#F7F2E8"/>
        <circle cx="118" cy="54" r="4.5" fill="#542810"/>
        <!-- Body Cowl & Floorboard -->
        <path d="M22 45C22 32 34 26 52 26C62 26 70 30 74 38L84 52H106L112 38L102 20H96" stroke="#6E381A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26 43C26 32 36 28 52 28C60 28 68 32 72 40L68 52H26V43Z" fill="#7A4B2A" opacity="0.85"/>
        <!-- Seat -->
        <path d="M38 24C42 20 60 20 70 24L68 28H40L38 24Z" fill="#542810"/>
        <!-- Steering Column -->
        <path d="M102 20L114 40L116 54M100 16H108" stroke="#6E381A" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="104" cy="16" r="3.5" fill="#d97706"/>
      </svg>
    `,
    auto: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Wheels -->
        <circle cx="40" cy="56" r="12" stroke="#6E381A" stroke-width="4" fill="#F7F2E8"/>
        <circle cx="40" cy="56" r="4" fill="#542810"/>
        <circle cx="116" cy="56" r="12" stroke="#6E381A" stroke-width="4" fill="#F7F2E8"/>
        <circle cx="116" cy="56" r="4" fill="#542810"/>
        <!-- Cabin Body -->
        <path d="M22 50H18V40C18 28 28 17 44 16H90C98 16 106 22 110 28L126 43V50C126 53 122 56 116 56H108M54 56H104M30 56H20" stroke="#6E381A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Canvas Roof / Hood -->
        <path d="M22 34C22 22 32 18 46 18H88C94 18 102 22 106 28L114 36H22V34Z" fill="#542810"/>
        <!-- Windshield -->
        <path d="M94 24H106L118 38H94V24Z" fill="#7A4B2A" opacity="0.6"/>
        <!-- Open Side Door Frame -->
        <rect x="42" y="30" width="38" height="20" rx="3" stroke="#6E381A" stroke-width="3" fill="#F7F2E8" opacity="0.7"/>
        <circle cx="128" cy="46" r="3.5" fill="#d97706"/>
      </svg>
    `,
    bus: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Bus Body -->
        <rect x="14" y="18" width="132" height="42" rx="7" fill="#6E381A"/>
        <!-- Passenger Windows Row -->
        <rect x="22" y="24" width="18" height="15" rx="2" fill="#F7F2E8" opacity="0.9"/>
        <rect x="44" y="24" width="18" height="15" rx="2" fill="#F7F2E8" opacity="0.9"/>
        <rect x="66" y="24" width="18" height="15" rx="2" fill="#F7F2E8" opacity="0.9"/>
        <rect x="88" y="24" width="18" height="15" rx="2" fill="#F7F2E8" opacity="0.9"/>
        <!-- Front Windshield -->
        <path d="M110 24H136C138 24 140 26 140 28V39H110V24Z" fill="#F7F2E8" opacity="0.9"/>
        <!-- Lights -->
        <circle cx="140" cy="50" r="3.5" fill="#d97706"/>
        <rect x="14" y="48" width="3.5" height="7" fill="#b45309"/>
        <!-- Wheels -->
        <circle cx="44" cy="60" r="11" stroke="#F7F2E8" stroke-width="2.5" fill="#3D1E0C"/>
        <circle cx="44" cy="60" r="4.5" fill="#d97706"/>
        <circle cx="118" cy="60" r="11" stroke="#F7F2E8" stroke-width="2.5" fill="#3D1E0C"/>
        <circle cx="118" cy="60" r="4.5" fill="#d97706"/>
      </svg>
    `,
    truck: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Cargo Bed -->
        <rect x="16" y="20" width="76" height="38" rx="4" fill="#6E381A"/>
        <line x1="40" y1="20" x2="40" y2="58" stroke="#542810" stroke-width="2.5"/>
        <line x1="66" y1="20" x2="66" y2="58" stroke="#542810" stroke-width="2.5"/>
        <!-- Driver Cabin -->
        <path d="M96 28H122C130 28 138 34 140 42L142 58H96V28Z" fill="#542810"/>
        <!-- Cabin Window -->
        <path d="M100 32H120C125 32 129 36 131 42H100V32Z" fill="#F7F2E8" opacity="0.85"/>
        <!-- Headlight -->
        <circle cx="140" cy="50" r="3.5" fill="#d97706"/>
        <!-- Wheels -->
        <circle cx="36" cy="60" r="10" stroke="#F7F2E8" stroke-width="2" fill="#3D1E0C"/>
        <circle cx="36" cy="60" r="4" fill="#d97706"/>
        <circle cx="58" cy="60" r="10" stroke="#F7F2E8" stroke-width="2" fill="#3D1E0C"/>
        <circle cx="58" cy="60" r="4" fill="#d97706"/>
        <circle cx="120" cy="60" r="10" stroke="#F7F2E8" stroke-width="2" fill="#3D1E0C"/>
        <circle cx="120" cy="60" r="4" fill="#d97706"/>
      </svg>
    `,
    other: `
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Generic Elegant Vehicle Silhouette -->
        <path d="M24 48C24 48 34 28 54 22C72 17 98 17 114 24C126 30 134 40 138 48C142 50 146 54 146 58C146 62 142 64 138 64H124C122 54 112 46 102 46C92 46 82 54 80 64H60C58 54 48 46 38 46C28 46 18 54 16 64H10C6 64 4 60 4 56C4 52 8 48 24 48Z" fill="#6E381A"/>
        <path d="M54 26H80V42H38C44 34 48 28 54 26Z" fill="#F7F2E8" opacity="0.85"/>
        <path d="M86 26H110C116 30 122 36 125 42H86V26Z" fill="#F7F2E8" opacity="0.85"/>
        <!-- Wheels -->
        <circle cx="38" cy="62" r="10" fill="#3D1E0C" stroke="#F7F2E8" stroke-width="2"/>
        <circle cx="38" cy="62" r="4" fill="#d97706"/>
        <circle cx="102" cy="62" r="10" fill="#3D1E0C" stroke="#F7F2E8" stroke-width="2"/>
        <circle cx="102" cy="62" r="4" fill="#d97706"/>
      </svg>
    `
  };

  /* ==========================================================================
     APPLICATION STATE STORE
     ========================================================================== */
  const state = {
    noticeType: 'wrong_parking',
    customMessage: 'વાહન નંબર [VEHICLE NUMBER] કૃપા કરીને પાર્કિંગ સ્થળ પરથી દૂર કરવા વિનંતી.',
    vehicleType: 'car',
    customVehicleName: '',
    vehicleNumber: 'GJ01AB1234',
    noticeTitle: 'વાહન સૂચના',
    programName: 'SPIRITUAL PROGRAM',
    location: 'MAIN PARKING AREA',
    messageFontSize: 2.7,
    isFullscreen: false
  };

  /* ==========================================================================
     CACHED DOM REFERENCES
     ========================================================================== */
  const dom = {
    // App & Layout
    appRoot: document.getElementById('appRoot'),
    controlPanel: document.getElementById('controlPanel'),
    previewStage: document.querySelector('.preview-stage'),
    canvasViewport: document.getElementById('canvasViewport'),
    canvasScaler: document.getElementById('canvasScaler'),
    noticeCanvas: document.getElementById('noticeCanvas'),
    resolutionTag: document.getElementById('resolutionTag'),
    zoomPercentText: document.getElementById('zoomPercentText'),
    toastContainer: document.getElementById('toastContainer'),

    // Logos
    leftLogo: document.getElementById('leftLogo'),
    rightLogo: document.getElementById('rightLogo'),

    // Left Controls
    noticeRadios: document.querySelectorAll('input[name="noticeType"]'),
    cardWrongParking: document.getElementById('cardWrongParking'),
    cardLightOn: document.getElementById('cardLightOn'),
    cardCustomNotice: document.getElementById('cardCustomNotice'),
    customNoticeSection: document.getElementById('customNoticeSection'),
    customNoticeText: document.getElementById('customNoticeText'),
    insertTokenBtn: document.getElementById('insertTokenBtn'),

    vehButtons: document.querySelectorAll('.veh-btn'),
    customVehicleWrapper: document.getElementById('customVehicleWrapper'),
    customVehicleInput: document.getElementById('customVehicleInput'),

    vehicleNumberInput: document.getElementById('vehicleNumberInput'),
    clearVehNumBtn: document.getElementById('clearVehNumBtn'),
    miniPlateDisplay: document.getElementById('miniPlateDisplay'),
    miniPlateNumber: document.getElementById('miniPlateNumber'),

    noticeTitleInput: document.getElementById('noticeTitleInput'),
    programNameInput: document.getElementById('programNameInput'),
    locationInput: document.getElementById('locationInput'),
    messageFontSizeInput: document.getElementById('messageFontSizeInput'),
    messageFontSizeValue: document.getElementById('messageFontSizeValue'),

    // Action buttons
    downloadBtn: document.getElementById('downloadBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    resetBtn: document.getElementById('resetBtn'),
    projectorPreviewBtn: document.getElementById('projectorPreviewBtn'),
    exitFullscreenBtn: document.getElementById('exitFullscreenBtn'),
    fullscreenExitBar: document.getElementById('fullscreenExitBar'),

    // Canvas Preview Elements
    canvasProgramBanner: document.getElementById('canvasProgramBanner'),
    canvasProgramName: document.getElementById('canvasProgramName'),
    canvasNoticeTitle: document.getElementById('canvasNoticeTitle'),
    canvasVehicleIconWrapper: document.getElementById('canvasVehicleIconWrapper'),
    canvasVehicleTypeBadge: document.getElementById('canvasVehicleTypeBadge'),
    canvasVehicleTypeText: document.getElementById('canvasVehicleTypeText'),
    canvasPlate: document.getElementById('canvasPlate'),
    canvasPlateNumber: document.getElementById('canvasPlateNumber'),
    canvasNoticeMessage: document.getElementById('canvasNoticeMessage'),
    canvasLocationBlock: document.getElementById('canvasLocationBlock'),
    canvasLocationName: document.getElementById('canvasLocationName')
  };

  /* ==========================================================================
     UPDATE FUNCTIONS (REACTIVE MODEL-VIEW SYNCHRONIZATION)
     ========================================================================== */

  /**
   * Initializes logo paths based on variables
   */
  function setupLogos() {
    if (dom.leftLogo && LEFT_LOGO_PATH) {
      dom.leftLogo.src = LEFT_LOGO_PATH;
    }
    if (dom.rightLogo && RIGHT_LOGO_PATH) {
      dom.rightLogo.src = RIGHT_LOGO_PATH;
    }
  }

  /**
   * Sanitizes and standardizes Indian vehicle registration numbers
   */
  function formatVehicleNumber(raw) {
    if (!raw) return '';
    // Strip leading/trailing whitespaces, convert to uppercase, condense multiple spaces
    return raw.toUpperCase().replace(/\s+/g, ' ').trim();
  }

  /**
   * Updates Vehicle Registration Number across all preview components
   */
  function updateVehicleNumber() {
    const rawVal = dom.vehicleNumberInput ? dom.vehicleNumberInput.value : state.vehicleNumber;
    const cleanNum = formatVehicleNumber(rawVal);

    // Keep state updated
    state.vehicleNumber = cleanNum;

    // Update input display to uppercase
    if (dom.vehicleNumberInput && dom.vehicleNumberInput.value !== cleanNum) {
      const start = dom.vehicleNumberInput.selectionStart;
      const end = dom.vehicleNumberInput.selectionEnd;
      dom.vehicleNumberInput.value = cleanNum;
      if (start !== null && end !== null) {
        dom.vehicleNumberInput.setSelectionRange(start, end);
      }
    }

    const displayPlate = cleanNum || 'GJ01AB1234';

    // 1. Center Indian Number Plate
    if (dom.canvasPlateNumber) {
      dom.canvasPlateNumber.textContent = displayPlate;
    }

    // 2. Sidebar Mini Plate
    if (dom.miniPlateNumber) {
      dom.miniPlateNumber.textContent = displayPlate;
    }

    // 3. Update text references inside the message
    updateNoticeText();
  }

  /**
   * Updates Vehicle Illustration & Vehicle Label
   */
  function updateVehicle() {
    const type = state.vehicleType || 'car';
    const svgContent = VEHICLE_SVGS[type] || VEHICLE_SVGS.other;

    if (dom.canvasVehicleIconWrapper) {
      dom.canvasVehicleIconWrapper.innerHTML = svgContent;
    }

    // Format Vehicle Label
    let label = type.toUpperCase();
    if (type === 'other') {
      label = (state.customVehicleName.trim() || 'VEHICLE').toUpperCase();
    } else if (type === 'auto') {
      label = 'AUTO RICKSHAW';
    }

    if (dom.canvasVehicleTypeText) {
      dom.canvasVehicleTypeText.textContent = label;
    }
  }

  /**
   * Updates Gujarati Notice Message and Notice Title with dynamic sizing
   */
  function updateNoticeText() {
    // 1. Notice Title
    if (dom.canvasNoticeTitle) {
      dom.canvasNoticeTitle.textContent = state.noticeTitle.trim() || 'વાહન સૂચના';
    }

    // 2. Message Body
    let rawMessage = '';
    if (state.noticeType === 'wrong_parking') {
      rawMessage = NOTICE_TEMPLATES.wrong_parking.message;
    } else if (state.noticeType === 'light_on') {
      rawMessage = NOTICE_TEMPLATES.light_on.message;
    } else if (state.noticeType === 'custom') {
      rawMessage = state.customMessage || NOTICE_TEMPLATES.custom.message;
    }

    const safeNumber = state.vehicleNumber.trim() || 'GJ01AB1234';

    if (dom.canvasNoticeMessage) {
      // Clear previous content
      dom.canvasNoticeMessage.innerHTML = '';

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
            plateSpan.className = 'plate-highlight-token';
            plateSpan.textContent = safeNumber;
            dom.canvasNoticeMessage.appendChild(plateSpan);
          }
        }
      } else {
        // Direct text without token
        dom.canvasNoticeMessage.textContent = rawMessage;
      }

      // Dynamic Font Sizing to ensure long text never clips or overflows
      const totalLen = rawMessage.length;
      if (totalLen > 140) {
        dom.canvasNoticeMessage.style.fontSize = '2.0rem';
        dom.canvasNoticeMessage.style.lineHeight = '1.35';
      } else if (totalLen > 100) {
        dom.canvasNoticeMessage.style.fontSize = '2.3rem';
        dom.canvasNoticeMessage.style.lineHeight = '1.45';
      } else {
        dom.canvasNoticeMessage.style.fontSize = '2.7rem';
        dom.canvasNoticeMessage.style.lineHeight = '1.5';
      }

      dom.canvasNoticeMessage.style.fontSize = `${state.messageFontSize}rem`;
      if (dom.messageFontSizeValue) {
        dom.messageFontSizeValue.textContent = `${state.messageFontSize.toFixed(1)}rem`;
      }
    }
  }

  /**
   * Updates Event/Program Details & Location
   */
  function updateEventDetails() {
    // 1. Program Name
    const progName = state.programName.trim();
    if (dom.canvasProgramBanner && dom.canvasProgramName) {
      if (progName) {
        dom.canvasProgramName.textContent = progName;
        dom.canvasProgramBanner.style.display = 'inline-flex';
      } else {
        dom.canvasProgramBanner.style.display = 'none';
      }
    }

    // 2. Parking Location
    const locName = state.location.trim();
    if (dom.canvasLocationBlock && dom.canvasLocationName) {
      if (locName) {
        dom.canvasLocationName.textContent = locName;
        dom.canvasLocationBlock.style.display = 'inline-flex';
      } else {
        dom.canvasLocationBlock.style.display = 'none';
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
    calculateScale();
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
    const paddingX = state.isFullscreen ? 0 : 36;
    const paddingY = state.isFullscreen ? 0 : 36;

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

      // 1. Ensure all Gujarati & Web Fonts are fully loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Small tick to ensure browser layout queue has settled
      await new Promise(resolve => setTimeout(resolve, 100));

      // 2. Clone noticeCanvas to an isolated offscreen container
      // This is crucial: html2canvas is isolated from parent CSS scale transforms,
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
        backgroundColor: '#F7F2E8',
        logging: false
      });

      // Remove temporary clone from DOM
      document.body.removeChild(renderContainer);

      // 4. Generate download file
      const plateNumber = (state.vehicleNumber.trim() || 'GJ01AB1234').replace(/\s+/g, '-');
      const filename = `parking-notice-${plateNumber}.png`;

      const dataUrl = canvas.toDataURL('image/png', 1.0);

      // Trigger standard browser download anchor
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`Successfully exported: ${filename} (1920×1080)`, 'success');

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
    state.noticeTitle = 'વાહન સૂચના';
    state.programName = 'SPIRITUAL PROGRAM';
    state.location = 'MAIN PARKING AREA';
    state.messageFontSize = 2.7;

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
    if (dom.noticeTitleInput) dom.noticeTitleInput.value = state.noticeTitle;
    if (dom.programNameInput) dom.programNameInput.value = state.programName;
    if (dom.locationInput) dom.locationInput.value = state.location;
    if (dom.messageFontSizeInput) dom.messageFontSizeInput.value = state.messageFontSize;

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

    // 4. Notice Title, Program & Location Inputs
    if (dom.noticeTitleInput) {
      dom.noticeTitleInput.addEventListener('input', e => {
        state.noticeTitle = e.target.value;
        updateNoticeText();
      });
    }

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

    if (dom.messageFontSizeInput) {
      dom.messageFontSizeInput.addEventListener('input', e => {
        state.messageFontSize = Number(e.target.value);
        updateNoticeText();
      });
    }

    // 5. Action buttons
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
    setupLogos();
    setupEventListeners();
    updatePreview();

    // Initial scale calculation after paint
    window.requestAnimationFrame(() => {
      calculateScale();
      setTimeout(calculateScale, 150);
    });

    console.log('Spiritual Program Parking Notice Generator initialized successfully.');
  }

  // DOM Content Ready bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
