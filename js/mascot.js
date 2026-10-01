/**
 * TemanBelajar AI Mascot Component
 * Generates consistent vector SVG representations of the mascot with smooth state transitions.
 * Expressions: 'neutral' (default), 'thinking', 'explaining', 'encouraging', 'happy'
 */

const MascotRenderer = {
  getSvg(expression = 'neutral', options = {}) {
    const size = options.size || 120;
    const isMini = options.isMini || false;
    const idPrefix = options.idPrefix || 'tb_mascot_' + Math.random().toString(36).substr(2, 5);

    // Expressions details
    let eyeContent = '';
    let mouthContent = '';
    let accessoryContent = '';
    let glowContent = '';

    if (expression === 'thinking') {
      // Eyes looking up-right thoughtfully
      eyeContent = `
        <!-- Left Eye (Thinking) -->
        <ellipse cx="44" cy="50" rx="6.5" ry="8" fill="#1E2A4A" />
        <circle cx="46" cy="46" r="3.2" fill="#FFFFFF" />
        <circle cx="48" cy="50" r="1.4" fill="#6EE1FF" />
        <path d="M38 41 Q 44 38 49 42" stroke="#2E3A59" stroke-width="2" stroke-linecap="round" fill="none" />

        <!-- Right Eye (Thinking) -->
        <ellipse cx="68" cy="50" rx="6.5" ry="8" fill="#1E2A4A" />
        <circle cx="70" cy="46" r="3.2" fill="#FFFFFF" />
        <circle cx="72" cy="50" r="1.4" fill="#6EE1FF" />
        <path d="M62 42 Q 68 37 74 41" stroke="#2E3A59" stroke-width="2" stroke-linecap="round" fill="none" />
      `;
      // Small thoughtful mouth
      mouthContent = `
        <ellipse cx="56" cy="62" rx="2.5" ry="2" fill="#F59E0B" />
      `;
      // Thinking pulse rings around headphones
      glowContent = `
        <circle class="mascot-think-pulse-1" cx="21" cy="52" r="14" stroke="#6EE1FF" stroke-width="1.5" fill="none" opacity="0.6" />
        <circle class="mascot-think-pulse-2" cx="91" cy="52" r="14" stroke="#6EE1FF" stroke-width="1.5" fill="none" opacity="0.6" />
      `;
    } else if (expression === 'explaining') {
      // Alert, engaged eyes with wide happy catchlights
      eyeContent = `
        <!-- Left Eye (Explaining) -->
        <ellipse cx="44" cy="51" rx="7" ry="8.5" fill="#1E2A4A" />
        <circle cx="43" cy="48" r="3.6" fill="#FFFFFF" />
        <circle cx="46" cy="53" r="1.6" fill="#6EE1FF" />
        <path d="M38 41 Q 44 39 49 41" stroke="#2E3A59" stroke-width="1.8" stroke-linecap="round" fill="none" />

        <!-- Right Eye (Explaining) -->
        <ellipse cx="68" cy="51" rx="7" ry="8.5" fill="#1E2A4A" />
        <circle cx="67" cy="48" r="3.6" fill="#FFFFFF" />
        <circle cx="70" cy="53" r="1.6" fill="#6EE1FF" />
        <path d="M63 41 Q 68 39 74 41" stroke="#2E3A59" stroke-width="1.8" stroke-linecap="round" fill="none" />
      `;
      // Cheerful open beak/mouth
      mouthContent = `
        <path d="M51 60 Q 56 65 61 60 Z" fill="#F59E0B" />
        <path d="M52 61 Q 56 66 60 61" stroke="#D97706" stroke-width="1" fill="none" />
      `;
    } else if (expression === 'encouraging' || expression === 'happy') {
      // Crescent curved happy eyes
      eyeContent = `
        <!-- Left Eye (Happy Crescent) -->
        <path d="M38 52 C 38 44 49 44 50 52" stroke="#1E2A4A" stroke-width="3.6" stroke-linecap="round" fill="none" />
        <!-- Right Eye (Happy Crescent) -->
        <path d="M62 52 C 62 44 73 44 74 52" stroke="#1E2A4A" stroke-width="3.6" stroke-linecap="round" fill="none" />
      `;
      // Smiling mouth
      mouthContent = `
        <path d="M51 60 Q 56 67 61 60" fill="#F59E0B" />
        <path d="M52 60 Q 56 64 60 60" fill="#FEF3C7" />
      `;
      accessoryContent = `
        <!-- Tiny star sparkle above head -->
        <path d="M78 26 L80 30 L84 31 L80 32 L78 36 L76 32 L72 31 L76 30 Z" fill="#6EE1FF" opacity="0.9" />
      `;
    } else {
      // Neutral / Default Friendly Eyes
      eyeContent = `
        <!-- Left Eye -->
        <ellipse cx="44" cy="51" rx="6.5" ry="8" fill="#1E2A4A" />
        <circle cx="42.5" cy="48" r="3.2" fill="#FFFFFF" />
        <circle cx="46" cy="53" r="1.4" fill="#6EE1FF" />
        <path d="M39 42 Q 44 40 48 42" stroke="#2E3A59" stroke-width="1.6" stroke-linecap="round" fill="none" />

        <!-- Right Eye -->
        <ellipse cx="68" cy="51" rx="6.5" ry="8" fill="#1E2A4A" />
        <circle cx="66.5" cy="48" r="3.2" fill="#FFFFFF" />
        <circle cx="70" cy="53" r="1.4" fill="#6EE1FF" />
        <path d="M64 42 Q 68 40 73 42" stroke="#2E3A59" stroke-width="1.6" stroke-linecap="round" fill="none" />
      `;
      // Small cute beak
      mouthContent = `
        <path d="M52 60 Q 56 64 60 60" fill="#F59E0B" />
        <path d="M52 60 L 60 60" stroke="#D97706" stroke-width="1" stroke-linecap="round" />
      `;
    }

    return `
      <svg class="tb-mascot-svg ${options.extraClass || ''}" width="${size}" height="${size}" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Body gradient -->
          <linearGradient id="${idPrefix}_bodyGrad" x1="28" y1="20" x2="84" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#649FFF" />
            <stop offset="60%" stop-color="#4F8BFF" />
            <stop offset="100%" stop-color="#3A70DC" />
          </linearGradient>

          <!-- Headphone band gradient -->
          <linearGradient id="${idPrefix}_headbandGrad" x1="20" y1="22" x2="92" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#31487F" />
            <stop offset="50%" stop-color="#4B66B0" />
            <stop offset="100%" stop-color="#31487F" />
          </linearGradient>

          <!-- Headphone earcups glow -->
          <linearGradient id="${idPrefix}_earCupGrad" x1="10" y1="42" x2="30" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#6EE1FF" />
            <stop offset="100%" stop-color="#3A82EE" />
          </linearGradient>

          <!-- Scarf gradient -->
          <linearGradient id="${idPrefix}_scarfGrad" x1="34" y1="72" x2="78" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFD15C" />
            <stop offset="100%" stop-color="#F59E0B" />
          </linearGradient>

          <!-- Soft Shadow -->
          <filter id="${idPrefix}_blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <!-- Dynamic Glow / Pulse in Thinking Mode -->
        ${glowContent}

        <!-- Drop Shadow on Ground if not mini -->
        ${!isMini ? `<ellipse cx="56" cy="100" rx="30" ry="6" fill="#2E3A59" opacity="0.12" filter="url(#${idPrefix}_blur)" />` : ''}

        <!-- HEADPHONE BAND (Arc behind head) -->
        <path d="M22 52 C 22 28 35 18 56 18 C 77 18 90 28 90 52" 
              stroke="url(#${idPrefix}_headbandGrad)" stroke-width="7" stroke-linecap="round" fill="none" />
        <path d="M26 48 C 26 30 38 22 56 22 C 74 22 86 30 86 48" 
              stroke="#6EE1FF" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />

        <!-- MAIN BODY & HEAD (Plump friendly silhouette) -->
        <g id="${idPrefix}_main_body">
          <!-- Body Base -->
          <rect x="25" y="26" width="62" height="64" rx="31" fill="url(#${idPrefix}_bodyGrad)" />
          
          <!-- Glossy Head Highlight -->
          <path d="M35 34 C 42 28 66 28 73 34 C 70 30 50 28 35 34 Z" fill="#FFFFFF" opacity="0.45" />

          <!-- FACE MASK / BELLY PATCH (Soft cream white) -->
          <path d="M34 46 C 34 38 42 36 56 36 C 70 36 78 38 78 46 C 78 68 70 76 56 76 C 42 76 34 68 34 46 Z" 
                fill="#FFFFFF" />

          <!-- Soft Rosy Cheeks -->
          <ellipse cx="37" cy="58" rx="4.5" ry="3" fill="#FF8BA7" opacity="0.5" />
          <ellipse cx="75" cy="58" rx="4.5" ry="3" fill="#FF8BA7" opacity="0.5" />

          <!-- Eyes -->
          ${eyeContent}

          <!-- Mouth / Beak -->
          ${mouthContent}

          <!-- Little Stubby Wings (Left & Right) -->
          <path d="M24 64 C 18 68 18 78 25 80 C 27 75 27 68 24 64 Z" fill="#3D75E2" />
          <path d="M88 64 C 94 68 94 78 87 80 C 85 75 85 68 88 64 Z" fill="#3D75E2" />

          <!-- COZY SCARF / COLLAR -->
          <g>
            <!-- Scarf wrap -->
            <path d="M33 73 C 38 71 74 71 79 73 C 81 77 78 81 72 82 C 60 84 52 84 40 82 C 34 81 31 77 33 73 Z" 
                  fill="url(#${idPrefix}_scarfGrad)" />
            <!-- Scarf Tail (hanging down) -->
            <path d="M42 78 L 41 89 C 41 91 46 92 48 90 L 51 79 Z" fill="#F59E0B" />
            <!-- Scarf highlight line -->
            <path d="M36 74 Q 56 73 76 74" stroke="#FFF0A8" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.75" />
          </g>

          <!-- HEADPHONE EAR CUPS (Over ears on left and right) -->
          <!-- Left Ear Cup -->
          <g>
            <rect x="14" y="44" width="14" height="20" rx="7" fill="#243763" />
            <rect x="16" y="46" width="10" height="16" rx="5" fill="url(#${idPrefix}_earCupGrad)" />
            <circle cx="21" cy="54" r="3.2" fill="#FFFFFF" opacity="0.9" />
          </g>

          <!-- Right Ear Cup -->
          <g>
            <rect x="84" y="44" width="14" height="20" rx="7" fill="#243763" />
            <rect x="86" y="46" width="10" height="16" rx="5" fill="url(#${idPrefix}_earCupGrad)" />
            <circle cx="91" cy="54" r="3.2" fill="#FFFFFF" opacity="0.9" />
          </g>

          ${accessoryContent}
        </g>
      </svg>
    `;
  },

  updateMascotElement(elementId, expression, options = {}) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = this.getSvg(expression, options);
  }
};

window.MascotRenderer = MascotRenderer;
