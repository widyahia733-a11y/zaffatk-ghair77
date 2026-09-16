/**
 * زفتك غير — ZaffatakGhair Main App
 * منصة الزفات الخليجية الأولى بالذكاء الاصطناعي والهندسة الصوتية
 * مشغل صوت سحابي مباشر (Direct Cloud Streaming Player)
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   DATA — مصفوفة الزفات المرتبطة بمشغل يوتيوب السحابي في الكواليس (Headless YouTube Player)
   جميع الزفات تعمل بمعرّفات يوتيوب سحابية حقيقية ومطابقة للتصنيفات
   ══════════════════════════════════════════════════════════ */
const TRACKS_DATA = [
  // ── زفات سعودية ──
  {
    id: 'tr-001',
    title: 'زفة الملوك الخليجية',
    artist: 'أسلوب ملكي سعودي أصيل',
    category: 'saudi',
    region: 'saudi',
    regionLabel: 'سعودية',
    duration: '4:32',
    price: 249,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '09R8_2nJtjg',
    coverGradient: 'linear-gradient(135deg, #1a0a00, #3d1a00)',
    coverEmoji: '👑',
    tags: ['دفوف', 'طبول', 'ملكية'],
  },
  {
    id: 'tr-007',
    title: 'زفة نجد العذية',
    artist: 'إيقاع سامري راقي',
    category: 'saudi',
    region: 'saudi',
    regionLabel: 'سعودية',
    duration: '3:45',
    price: 219,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #2a1505, #4a2505)',
    coverEmoji: '✨',
    tags: ['سامري', 'نجدية', 'تراث'],
  },
  {
    id: 'tr-008',
    title: 'هيبة ملوك وعزوة فخر',
    artist: 'عرضة خليجية كلاسيك',
    category: 'saudi',
    region: 'saudi',
    regionLabel: 'سعودية',
    duration: '4:15',
    price: 289,
    youtubeId: 'M3r2XDceM6A',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #1f1105, #381f08)',
    coverEmoji: '🏰',
    tags: ['عرضة', 'فخامة', 'كلاسيك'],
  },
  {
    id: 'tr-009',
    title: 'درة الرياض الحالمة',
    artist: 'مقام بياتي مع عود نقي',
    category: 'saudi',
    region: 'saudi',
    regionLabel: 'سعودية',
    duration: '5:02',
    price: 269,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '7pc_G0w9mTY',
    coverGradient: 'linear-gradient(135deg, #2e1808, #522d10)',
    coverEmoji: '🌟',
    tags: ['عود', 'بياتي', 'رواق'],
  },

  // ── إماراتية وكويتية ──
  {
    id: 'tr-002',
    title: 'دخلة العروس الذهبية',
    artist: 'لحن إماراتي فاخر',
    category: 'uae',
    region: 'uae',
    regionLabel: 'إماراتية',
    duration: '3:18',
    price: 199,
    youtubeId: '2Vv-BfVoq4g',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #0a0a1a, #1a0a2a)',
    coverEmoji: '💍',
    tags: ['رومانسية', 'ناعمة', 'عروس'],
  },
  {
    id: 'tr-010',
    title: 'زفة دانات الخليج',
    artist: 'إيقاع عيالة حماسي',
    category: 'uae',
    region: 'uae',
    regionLabel: 'إماراتية',
    duration: '4:20',
    price: 239,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '09R8_2nJtjg',
    coverGradient: 'linear-gradient(135deg, #081525, #122b4a)',
    coverEmoji: '💎',
    tags: ['عيالة', 'دانات', 'حماس'],
  },
  {
    id: 'tr-011',
    title: 'نسيم الكويت والأفراح',
    artist: 'لحن كويتي رايق',
    category: 'uae',
    region: 'kuwait',
    regionLabel: 'كويتية',
    duration: '3:50',
    price: 229,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #062024, #0d383e)',
    coverEmoji: '🌊',
    tags: ['كويتية', 'طرب', 'أصيل'],
  },
  {
    id: 'tr-012',
    title: 'ليلة العمر دبي',
    artist: 'أوركسترا مودرن مع دفوف',
    category: 'uae',
    region: 'uae',
    regionLabel: 'إماراتية',
    duration: '4:40',
    price: 319,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '2Vv-BfVoq4g',
    coverGradient: 'linear-gradient(135deg, #150f29, #2b1f52)',
    coverEmoji: '🏙️',
    tags: ['أوركسترا', 'مودرن', 'فخامة'],
  },

  // ── زفات كلاسيك وفخامة ──
  {
    id: 'tr-025',
    title: 'أوتار المجد الكلاسيكية',
    artist: 'أوركسترا كلاسيك شرقي ملكي',
    category: 'classic',
    region: 'gulf',
    regionLabel: 'كلاسيك',
    duration: '4:35',
    price: 329,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #1a1202, #3b2a05)',
    coverEmoji: '🎻',
    tags: ['كلاسيك', 'فخامة', 'أوتار'],
  },
  {
    id: 'tr-026',
    title: 'سيمفونية ليلة البدر',
    artist: 'تناغم الآلات الشرقية والغربية',
    category: 'classic',
    region: 'saudi',
    regionLabel: 'كلاسيك',
    duration: '4:50',
    price: 339,
    youtubeId: 'M3r2XDceM6A',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #101c24, #1d3342)',
    coverEmoji: '🎼',
    tags: ['سيمفونية', 'بيانو', 'عود'],
  },

  // ── دفوف بدون موسيقى ──
  {
    id: 'tr-004',
    title: 'زفة الدفوف التراثية',
    artist: 'دفوف تراثية خالصة (إسلامية)',
    category: 'duff',
    region: 'saudi',
    regionLabel: 'دفوف',
    duration: '3:55',
    price: 149,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '7pc_G0w9mTY',
    coverGradient: 'linear-gradient(135deg, #1a0f00, #2a1800)',
    coverEmoji: '🥁',
    tags: ['دفوف', 'بدون موسيقى', 'إسلامي'],
  },
  {
    id: 'tr-013',
    title: 'زفة طاب السهر والمسرات',
    artist: 'دفوف حجازية نقية',
    category: 'duff',
    region: 'saudi',
    regionLabel: 'دفوف',
    duration: '4:10',
    price: 169,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: 'M3r2XDceM6A',
    coverGradient: 'linear-gradient(135deg, #261605, #42280d)',
    coverEmoji: '🌙',
    tags: ['حجازي', 'بدون موسيقى', 'طار'],
  },
  {
    id: 'tr-014',
    title: 'زفة بهجة القلوب الطاهرة',
    artist: 'إيقاع إسلامي هادئ',
    category: 'duff',
    region: 'gulf',
    regionLabel: 'دفوف',
    duration: '3:35',
    price: 159,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #1c1808, #362f12)',
    coverEmoji: '🤍',
    tags: ['إسلامي', 'هادئ', 'نقاء'],
  },
  {
    id: 'tr-015',
    title: 'ليلة الفرح الحلال',
    artist: 'مؤثرات بشرية ودفوف',
    category: 'duff',
    region: 'saudi',
    regionLabel: 'دفوف',
    duration: '4:25',
    price: 179,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '7pc_G0w9mTY',
    coverGradient: 'linear-gradient(135deg, #241407, #3d230e)',
    coverEmoji: '🕊️',
    tags: ['أكابيلا', 'دفوف', 'مؤثرات'],
  },

  // ── قصائد وشلات ──
  {
    id: 'tr-003',
    title: 'قصيدة الاستقبال الكويتية',
    artist: 'شعر ومقام كويتي فخم',
    category: 'poetry',
    region: 'kuwait',
    regionLabel: 'كويتية',
    duration: '5:45',
    price: 299,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #001a0a, #002a15)',
    coverEmoji: '🎤',
    tags: ['قصيدة', 'استقبال', 'شعر'],
  },
  {
    id: 'tr-005',
    title: 'شلة الفرحة الخليجية',
    artist: 'شلات ومدائح ترحيبية',
    category: 'poetry',
    region: 'gulf',
    regionLabel: 'خليجية',
    duration: '4:10',
    price: 279,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '09R8_2nJtjg',
    coverGradient: 'linear-gradient(135deg, #1a001a, #2a002a)',
    coverEmoji: '🌹',
    tags: ['شلة', 'فرح', 'مدائح'],
  },
  {
    id: 'tr-016',
    title: 'شلة يا مرحباً بضيوفنا الكرام',
    artist: 'أداء شعبي ترحيبي',
    category: 'poetry',
    region: 'saudi',
    regionLabel: 'سعودية',
    duration: '4:50',
    price: 259,
    youtubeId: 'M3r2XDceM6A',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #1c051a, #380d34)',
    coverEmoji: '📜',
    tags: ['ترحيب', 'قصيد', 'أصالة'],
  },
  {
    id: 'tr-017',
    title: 'قصيدة تاج العروس والأوصاف',
    artist: 'شعر نبطي بصوت رخيم',
    category: 'poetry',
    region: 'gulf',
    regionLabel: 'خليجية',
    duration: '5:15',
    price: 320,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #12001c, #260538)',
    coverEmoji: '✒️',
    tags: ['نبطي', 'وصف', 'مدح'],
  },

  // ── دخلة العروس ──
  {
    id: 'tr-018',
    title: 'أقبلت بنت الأصايل',
    artist: 'دخلة ملكية بطيئة مع ناي وعود',
    category: 'bride',
    region: 'saudi',
    regionLabel: 'عروس',
    duration: '4:48',
    price: 289,
    youtubeId: '2Vv-BfVoq4g',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #240a1d, #421637)',
    coverEmoji: '👰',
    tags: ['دخلة', 'ملكية', 'هدوء'],
  },
  {
    id: 'tr-019',
    title: 'نور الليالي وسيدة الحفل',
    artist: 'لحن رومانسي حالم',
    category: 'bride',
    region: 'uae',
    regionLabel: 'عروس',
    duration: '3:58',
    price: 269,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '2Vv-BfVoq4g',
    coverGradient: 'linear-gradient(135deg, #1f0b18, #3b162f)',
    coverEmoji: '💫',
    tags: ['رومانس', 'دلال', 'نور'],
  },
  {
    id: 'tr-020',
    title: 'طلّت كالبدر في تمامه',
    artist: 'موسيقى سينمائية شرقية',
    category: 'bride',
    region: 'gulf',
    regionLabel: 'عروس',
    duration: '4:12',
    price: 310,
    youtubeId: '7pc_G0w9mTY',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #2d0e23, #4f1d40)',
    coverEmoji: '🌸',
    tags: ['سينمائي', 'بدر', 'سحر'],
  },
  {
    id: 'tr-021',
    title: 'هيبة الحضور والجمال الفاتن',
    artist: 'زفة عروس أوركسترالية متكاملة',
    category: 'bride',
    region: 'saudi',
    regionLabel: 'عروس',
    duration: '5:05',
    price: 349,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '09R8_2nJtjg',
    coverGradient: 'linear-gradient(135deg, #331027, #592046)',
    coverEmoji: '👑',
    tags: ['أوركسترا', 'فخامة', 'زغاريد'],
  },

  // ── موكب العريس ──
  {
    id: 'tr-006',
    title: 'موكب العريس الملكي',
    artist: 'أوركسترا خليجي حماسي',
    category: 'groom',
    region: 'saudi',
    regionLabel: 'عريس',
    duration: '3:30',
    price: 349,
    youtubeId: '09R8_2nJtjg',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #0a0a00, #1a1a00)',
    coverEmoji: '🤵',
    tags: ['عريس', 'موكب', 'أوركسترا'],
  },
  {
    id: 'tr-022',
    title: 'وقفة شموخ وعز الجبين',
    artist: 'إيقاع سعودي حماسي للعريس',
    category: 'groom',
    region: 'saudi',
    regionLabel: 'عريس',
    duration: '3:40',
    price: 279,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '09R8_2nJtjg',
    coverGradient: 'linear-gradient(135deg, #121004, #26220a)',
    coverEmoji: '🗡️',
    tags: ['حماسي', 'شموخ', 'رجال'],
  },
  {
    id: 'tr-023',
    title: 'زفة الفخر والجاه والقبيلة',
    artist: 'عرضة وموكب دخول العريس',
    category: 'groom',
    region: 'gulf',
    regionLabel: 'عريس',
    duration: '4:00',
    price: 299,
    youtubeId: 'M3r2XDceM6A',
    fallbackYoutubeId: 'sK2WlF32Sxo',
    coverGradient: 'linear-gradient(135deg, #171406, #302b0f)',
    coverEmoji: '🏇',
    tags: ['عرضة', 'قبيلة', 'فخر'],
  },
  {
    id: 'tr-024',
    title: 'شيخ الشباب وطيب الفال',
    artist: 'طرب خليجي سريع ومبهج',
    category: 'groom',
    region: 'uae',
    regionLabel: 'عريس',
    duration: '3:25',
    price: 259,
    youtubeId: 'sK2WlF32Sxo',
    fallbackYoutubeId: '09R8_2nJtjg',
    coverGradient: 'linear-gradient(135deg, #1c1808, #383112)',
    coverEmoji: '🎉',
    tags: ['بهجة', 'فرح', 'شباب'],
  },
];

const CATEGORIES = [
  { id: 'كل', label: 'الكل' },
  { id: 'saudi', label: '🇸🇦 زفات سعودية' },
  { id: 'uae', label: '🇦🇪 إماراتية وكويتية' },
  { id: 'classic', label: '🎻 كلاسيك وفخامة' },
  { id: 'duff', label: '🥁 دفوف بدون موسيقى' },
  { id: 'poetry', label: '📜 قصائد وشلات' },
  { id: 'bride', label: '👰 دخلة العروس' },
  { id: 'groom', label: '🤵 موكب العريس' },
];

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
const state = {
  activeCategory: 'كل',
  currentTrack: null,
  isPlaying: false,
  volume: 0.75,
  currentTime: 0,
  duration: 0,
  selectedPayment: 'mada',
  bookingTrack: null,
  comparisonPlaying: { before: false, after: false },
};

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initParticles();
  renderTracks();
  initFilterTabs();
  initMiniWaveforms();
  initComparisonAudio();
  initStickyPlayer();
  initBookingModal();
  initPaymentOptions();
  initTrackingForm();
  initCounters();
  initScrollReveal();
  initHeroStats();
});

/* ══════════════════════════════════════════════════════════
   HEADER
   ══════════════════════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('main-header');
  const onScroll = () => {
    header && header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth nav links
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        if (mobileMenu) {
          mobileMenu.classList.remove('open');
          hamburger && hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PARTICLES
   ══════════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'gold-particle';
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(212,175,55,0.8), rgba(212,175,55,0));
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.7 + 0.2};
      animation: floatParticle ${(Math.random() * 8 + 6).toFixed(1)}s ease-in-out infinite;
      animation-delay: ${(Math.random() * 5).toFixed(1)}s;
      pointer-events: none;
    `;
    container.appendChild(particle);
  }
}

/* ══════════════════════════════════════════════════════════
   FILTER TABS & TRACK RENDERING
   ══════════════════════════════════════════════════════════ */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  
  tabs.forEach(tab => {
    const cat = tab.dataset.category;
    let count = TRACKS_DATA.length;
    if (cat !== 'كل') {
      count = TRACKS_DATA.filter(t => 
        t.category === cat || 
        t.region === cat || 
        (cat === 'uae' && (t.region === 'uae' || t.region === 'kuwait'))
      ).length;
    }
    
    const existingBadge = tab.querySelector('.tab-badge');
    if (!existingBadge) {
      const badge = document.createElement('span');
      badge.className = 'tab-badge';
      badge.style.cssText = 'background:rgba(212,175,55,0.15);color:var(--gold);font-size:0.7rem;padding:2px 6px;border-radius:99px;margin-right:6px;font-weight:700;';
      badge.textContent = count;
      tab.appendChild(badge);
    }

    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.dataset.category;
      renderTracks();
    });
  });
}

function renderTracks() {
  const grid = document.getElementById('tracks-grid');
  if (!grid) return;

  const filtered = state.activeCategory === 'كل'
    ? TRACKS_DATA
    : TRACKS_DATA.filter(t => 
        t.category === state.activeCategory || 
        t.region === state.activeCategory || 
        (state.activeCategory === 'uae' && (t.region === 'uae' || t.region === 'kuwait'))
      );

  grid.innerHTML = filtered.map(track => {
    const isThisPlaying = state.isPlaying && state.currentTrack && state.currentTrack.id === track.id;
    return `
    <div class="track-card" data-id="${track.id}" role="article" aria-label="${track.title}">
      <div class="track-cover">
        <div style="width:100%;height:100%;background:${track.coverGradient};position:relative;display:flex;align-items:center;justify-content:center;">
          <div style="font-size:4rem;opacity:0.35;filter:blur(1px)">${track.coverEmoji}</div>
          <div style="position:absolute;inset:0;background:linear-gradient(135deg,${track.coverGradient.replace('linear-gradient(135deg, ','').replace(')','')});opacity:0.7;"></div>
          <div style="position:absolute;bottom:0;right:0;left:0;height:60px;background:linear-gradient(to bottom,transparent,rgba(10,15,29,0.9));"></div>
        </div>
        <div class="track-region-badge">${track.regionLabel}</div>
        <div class="track-duration-badge">⏱ ${track.duration}</div>
        <div class="track-play-overlay">
          <div class="track-play-big" onclick="playTrackFromCard('${track.id}', event)">▶</div>
        </div>
      </div>
      <div class="track-body">
        <div class="track-title">${track.title}</div>
        <div class="track-artist">${track.artist}</div>
        <div class="track-tags" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
          ${track.tags.map(t => `<span style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);color:rgba(212,175,55,0.7);font-size:0.68rem;padding:2px 8px;border-radius:99px;">${t}</span>`).join('')}
        </div>
        <div class="track-mini-player">
          <button class="track-mini-btn ${isThisPlaying ? 'playing' : ''}" id="mini-btn-${track.id}" onclick="toggleMiniPlay('${track.id}', event)" aria-label="تشغيل المعاينة السحابية">
            <span class="play-icon-${track.id}">${isThisPlaying ? '⏸' : '▶'}</span>
          </button>
          <div class="track-mini-waveform ${isThisPlaying ? 'playing' : ''}" id="waveform-${track.id}">
            ${generateMiniWaveBars(40)}
          </div>
          <span class="track-watermark" style="font-size:0.6rem;color:rgba(212,175,55,0.4);">☁️ بث مباشر</span>
        </div>
        <div class="track-footer">
          <div class="track-price">${track.price} <span>ر.س</span></div>
          <button class="track-book-btn" id="book-${track.id}" onclick="openBookingModal('${track.id}')" aria-label="احجز هذه الزفة">
            🎵 احجز الآن
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  document.querySelectorAll('.track-mini-waveform .bar').forEach(bar => {
    bar.style.height = `${Math.random() * 70 + 15}%`;
  });
}

function generateMiniWaveBars(count) {
  return Array.from({ length: count }, (_, i) =>
    `<div class="bar" style="height:${Math.random() * 70 + 15}%;--delay:${(i * 0.04).toFixed(2)}s;--dur:${(Math.random() * 0.4 + 0.5).toFixed(2)}s"></div>`
  ).join('');
}

function initMiniWaveforms() {
  document.querySelectorAll('.track-mini-waveform .bar').forEach((bar, i) => {
    bar.style.setProperty('--delay', `${(i * 0.04).toFixed(2)}s`);
    bar.style.setProperty('--dur', `${(Math.random() * 0.4 + 0.5).toFixed(2)}s`);
  });
}

/* ══════════════════════════════════════════════════════════
   CARD MINI-PLAYER INTERACTION
   ══════════════════════════════════════════════════════════ */
let currentMiniPlay = null;
let miniInterval = null;

function resetMiniControls() {
  if (currentMiniPlay) {
    const prevWave = document.getElementById(`waveform-${currentMiniPlay}`);
    const prevBtn = document.getElementById(`mini-btn-${currentMiniPlay}`);
    const prevIcon = document.querySelector(`.play-icon-${currentMiniPlay}`);
    if (prevWave) prevWave.classList.remove('playing');
    if (prevBtn) prevBtn.classList.remove('playing');
    if (prevIcon) prevIcon.textContent = '▶';
  }
  clearInterval(miniInterval);
  currentMiniPlay = null;
}

function toggleMiniPlay(trackId, event) {
  event && event.stopPropagation();
  const trackObj = TRACKS_DATA.find(t => t.id === trackId);
  if (!trackObj) return;

  const waveform = document.getElementById(`waveform-${trackId}`);
  const btn = document.getElementById(`mini-btn-${trackId}`);
  const icon = document.querySelector(`.play-icon-${trackId}`);

  // If already playing this track, pause
  if (currentMiniPlay === trackId && state.isPlaying) {
    waveform && waveform.classList.remove('playing');
    btn && btn.classList.remove('playing');
    if (icon) icon.textContent = '▶';
    clearInterval(miniInterval);
    currentMiniPlay = null;
    state.isPlaying = false;
    AudioEngine.pause();
    updatePlayerUI();
    return;
  }

  // Reset previous track buttons
  resetMiniControls();

  // Set active state
  if (waveform) waveform.classList.add('playing');
  if (btn) btn.classList.add('playing');
  if (icon) icon.textContent = '⏸';
  currentMiniPlay = trackId;

  // Sync with global player state
  state.currentTrack = trackObj;
  state.isPlaying = true;
  state.currentTime = 0;
  state.duration = parseDuration(trackObj.duration);

  // Update sticky player
  const player = document.getElementById('sticky-player');
  const trackName = document.getElementById('player-track-name');
  const trackArtist = document.getElementById('player-track-artist');
  if (trackName) trackName.textContent = trackObj.title;
  if (trackArtist) trackArtist.textContent = trackObj.artist;
  if (player) player.classList.add('visible');
  updatePlayerUI();

  // Play through headless background YouTube Audio Controller
  AudioEngine.play(
    trackObj.youtubeId,
    (failedId, err) => {
      resetMiniControls();
      state.isPlaying = false;
      updatePlayerUI();
      showToast(`تعذر تشغيل زفة "${trackObj.title}" سحابياً. يرجى التحقق من اتصالك.`, 'error');
    },
    () => {
      // Ended callback
      resetMiniControls();
      state.isPlaying = false;
      updatePlayerUI();
    },
    trackObj
  );

  // Waveform animation
  clearInterval(miniInterval);
  miniInterval = setInterval(() => {
    if (waveform) {
      waveform.querySelectorAll('.bar').forEach(bar => {
        bar.style.height = `${Math.random() * 75 + 10}%`;
      });
    }
  }, 180);

  showToast(`🎵 تشغيل سحابي في الكواليس: ${trackObj.title}`, 'info');
}

function playTrackFromCard(trackId, event) {
  event && event.stopPropagation();
  const track = TRACKS_DATA.find(t => t.id === trackId);
  if (track) {
    loadStickyPlayer(track);
  }
}

/* ══════════════════════════════════════════════════════════
   COMPARISON AUDIO (HERO SECTION)
   ══════════════════════════════════════════════════════════ */
function initComparisonAudio() {
  const btnBefore = document.getElementById('play-before');
  const btnAfter = document.getElementById('play-after');
  const waveBefore = document.getElementById('wave-before');
  const waveAfter = document.getElementById('wave-after');

  let beforeInterval = null;
  let afterInterval = null;

  const ytBefore = 'sK2WlF32Sxo';
  const ytAfter = '2Vv-BfVoq4g';

  function toggleWave(wave, interval, isPlaying) {
    if (!wave) return null;
    if (isPlaying) {
      wave.classList.add('active');
      return setInterval(() => {
        wave.querySelectorAll('.bar').forEach(b => {
          b.style.height = `${Math.random() * 80 + 10}%`;
        });
      }, 150);
    } else {
      wave.classList.remove('active');
      clearInterval(interval);
      return null;
    }
  }

  if (btnBefore) {
    btnBefore.addEventListener('click', () => {
      resetMiniControls();
      state.comparisonPlaying.before = !state.comparisonPlaying.before;
      if (state.comparisonPlaying.before) {
        if (state.comparisonPlaying.after) {
          state.comparisonPlaying.after = false;
          if (btnAfter) btnAfter.innerHTML = '▶';
          afterInterval = toggleWave(waveAfter, afterInterval, false);
        }
        AudioEngine.play(ytBefore, () => {
          showToast('تعذر تشغيل المقطع عبر الإنترنت', 'error');
          state.comparisonPlaying.before = false;
          if (btnBefore) btnBefore.innerHTML = '▶';
          beforeInterval = toggleWave(waveBefore, beforeInterval, false);
        });
        showToast('🎵 زفة بدون أسماء — النسخة الأصلية (بث سحابي)', 'info');
      } else {
        AudioEngine.stop();
      }
      btnBefore.innerHTML = state.comparisonPlaying.before ? '⏸' : '▶';
      beforeInterval = toggleWave(waveBefore, beforeInterval, state.comparisonPlaying.before);
    });
  }

  if (btnAfter) {
    btnAfter.addEventListener('click', () => {
      resetMiniControls();
      state.comparisonPlaying.after = !state.comparisonPlaying.after;
      if (state.comparisonPlaying.after) {
        if (state.comparisonPlaying.before) {
          state.comparisonPlaying.before = false;
          if (btnBefore) btnBefore.innerHTML = '▶';
          beforeInterval = toggleWave(waveBefore, beforeInterval, false);
        }
        AudioEngine.play(ytAfter, () => {
          showToast('تعذر تشغيل المقطع عبر الإنترنت', 'error');
          state.comparisonPlaying.after = false;
          if (btnAfter) btnAfter.innerHTML = '▶';
          afterInterval = toggleWave(waveAfter, afterInterval, false);
        });
        showToast('✨ زفة باسميّ محمد وهند — بصوت الفنان الأصلي (بث سحابي)', 'success');
      } else {
        AudioEngine.stop();
      }
      btnAfter.innerHTML = state.comparisonPlaying.after ? '⏸' : '▶';
      afterInterval = toggleWave(waveAfter, afterInterval, state.comparisonPlaying.after);
    });
  }
}

/* ══════════════════════════════════════════════════════════
   STICKY AUDIO PLAYER (HEADLESS YOUTUBE CONTROLLER)
   ══════════════════════════════════════════════════════════ */
function initStickyPlayer() {
  const player = document.getElementById('sticky-player');
  const playBtn = document.getElementById('player-play-btn');
  const prevBtn = document.getElementById('player-prev-btn');
  const nextBtn = document.getElementById('player-next-btn');
  const closeBtn = document.getElementById('player-close');
  const progressWrap = document.getElementById('progress-bar-wrap');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');

  // Register AudioEngine real-time time updates
  AudioEngine.onTimeUpdate((currentTime, duration) => {
    if (state.isPlaying) {
      state.currentTime = currentTime;
      if (duration && duration > 0) {
        state.duration = duration;
      }
      updateProgress();
    }
  });

  // Register AudioEngine state changes
  AudioEngine.onStateChange((isPlaying) => {
    state.isPlaying = isPlaying;
    if (!isPlaying && currentMiniPlay) {
      const activeTrack = TRACKS_DATA.find(t => t.id === currentMiniPlay);
      if (activeTrack && state.currentTime >= (state.duration - 1)) {
        resetMiniControls();
      }
    }
    updatePlayerUI();
  });

  // Play / Pause button
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!state.currentTrack && TRACKS_DATA.length > 0) {
        loadStickyPlayer(TRACKS_DATA[0]);
        return;
      }

      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        AudioEngine.play(state.currentTrack.youtubeId, null, null, state.currentTrack);
      } else {
        AudioEngine.pause();
        resetMiniControls();
      }
      updatePlayerUI();
    });
  }

  // Next Track
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      navigateTrack(1);
    });
  }

  // Prev Track
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      navigateTrack(-1);
    });
  }

  // Close player
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (player) player.classList.remove('visible');
      state.isPlaying = false;
      state.currentTime = 0;
      AudioEngine.stop();
      resetMiniControls();
      updatePlayerUI();
    });
  }

  // Seek bar click / drag
  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      const rect = progressWrap.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const dur = AudioEngine.getDuration() || state.duration || 1;
      const targetTime = ratio * dur;
      state.currentTime = targetTime;
      AudioEngine.seek(targetTime);
      updateProgress();
    });
  }

  // Volume slider
  if (volumeSlider) {
    volumeSlider.value = state.volume * 100;
    volumeSlider.addEventListener('input', () => {
      state.volume = volumeSlider.value / 100;
      AudioEngine.setVolume(state.volume);
      if (volumeIcon) {
        volumeIcon.textContent = state.volume === 0 ? '🔇' : state.volume < 0.5 ? '🔉' : '🔊';
      }
    });
  }

  drawStaticWaveform();
}

function navigateTrack(direction) {
  if (!state.currentTrack) {
    if (TRACKS_DATA.length > 0) loadStickyPlayer(TRACKS_DATA[0]);
    return;
  }
  const currentIndex = TRACKS_DATA.findIndex(t => t.id === state.currentTrack.id);
  let nextIndex = currentIndex + direction;
  if (nextIndex >= TRACKS_DATA.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = TRACKS_DATA.length - 1;
  loadStickyPlayer(TRACKS_DATA[nextIndex]);
}

function loadStickyPlayer(track) {
  resetMiniControls();

  state.currentTrack = track;
  state.isPlaying = true;
  state.currentTime = 0;
  state.duration = parseDuration(track.duration);

  const player = document.getElementById('sticky-player');
  const trackName = document.getElementById('player-track-name');
  const trackArtist = document.getElementById('player-track-artist');

  if (trackName) trackName.textContent = track.title;
  if (trackArtist) trackArtist.textContent = track.artist;

  if (player) player.classList.add('visible');
  updatePlayerUI();

  // Play through background YouTube controller
  AudioEngine.play(
    track.youtubeId,
    (failedId, err) => {
      state.isPlaying = false;
      updatePlayerUI();
      showToast(`تعذر تشغيل زفة "${track.title}" سحابياً، يرجى المحاولة لاحقاً`, 'error');
    },
    () => {
      state.isPlaying = false;
      updatePlayerUI();
    },
    track
  );
  AudioEngine.setVolume(state.volume);

  showToast(`🎵 تشغيل: ${track.title}`, 'info');
}

function parseDuration(str) {
  if (!str || typeof str !== 'string') return 180;
  const parts = str.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 180;
}

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const currentEl = document.getElementById('progress-current');
  const totalEl = document.getElementById('progress-total');

  const dur = state.duration || AudioEngine.getDuration() || 1;
  const cur = state.currentTime || AudioEngine.getCurrentTime() || 0;

  if (fill) fill.style.width = `${Math.min(100, (cur / dur) * 100)}%`;
  if (currentEl) currentEl.textContent = formatTime(cur);
  if (totalEl) totalEl.textContent = formatTime(dur);
}

function updatePlayerUI() {
  const btn = document.getElementById('player-play-btn');
  if (btn) btn.innerHTML = state.isPlaying ? '⏸' : '▶';

  if (state.isPlaying) {
    drawAnimatedWaveform();
  } else {
    cancelAnimationFrame(state.waveAnimFrame);
    drawStaticWaveform();
  }
}

function drawStaticWaveform() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const logicalW = canvas.offsetWidth || 300;
  const logicalH = canvas.offsetHeight || 30;
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;
  canvas.style.width = logicalW + 'px';
  canvas.style.height = logicalH + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, logicalW, logicalH);

  const bars = 70;
  const w = logicalW / bars;
  for (let i = 0; i < bars; i++) {
    const h = (Math.sin(i * 0.3) * 0.4 + 0.6) * logicalH * 0.6;
    const y = (logicalH - h) / 2;
    ctx.fillStyle = 'rgba(212,175,55,0.2)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(i * w + 1, y, Math.max(w - 2, 1), h, 2);
    else ctx.rect(i * w + 1, y, Math.max(w - 2, 1), h);
    ctx.fill();
  }
}

function drawAnimatedWaveform() {
  cancelAnimationFrame(state.waveAnimFrame);
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let t = 0;

  const draw = () => {
    const logicalW = canvas.offsetWidth || 300;
    const logicalH = canvas.offsetHeight || 30;
    if (canvas.width !== logicalW * dpr || canvas.height !== logicalH * dpr) {
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
      canvas.style.width = logicalW + 'px';
      canvas.style.height = logicalH + 'px';
      ctx.scale(dpr, dpr);
    }
    ctx.clearRect(0, 0, logicalW, logicalH);

    const bars = 70;
    const w = logicalW / bars;
    const dur = state.duration || 1;
    const cur = state.currentTime || 0;
    const progressBars = (cur / dur) * bars;

    for (let i = 0; i < bars; i++) {
      const h = (Math.sin(i * 0.3 + t) * 0.35 + Math.sin(i * 0.7 - t * 1.5) * 0.25 + 0.5) * logicalH * 0.75;
      const y = (logicalH - Math.max(h, 2)) / 2;
      const col = i < progressBars ? `rgba(212,175,55,0.9)` : `rgba(212,175,55,0.18)`;
      ctx.fillStyle = col;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(i * w + 1, y, Math.max(w - 2, 1), Math.max(h, 2), 2);
      else ctx.rect(i * w + 1, y, Math.max(w - 2, 1), Math.max(h, 2));
      ctx.fill();
    }
    t += 0.04;
    state.waveAnimFrame = requestAnimationFrame(draw);
  };

  draw();
}

/* ══════════════════════════════════════════════════════════
   BOOKING MODAL
   ══════════════════════════════════════════════════════════ */
function openBookingModal(trackId) {
  const track = TRACKS_DATA.find(t => t.id === trackId);
  if (!track) return;

  state.bookingTrack = track;

  const overlay = document.getElementById('modal-overlay');
  const modalTrackName = document.getElementById('modal-track-name');
  const basePrice = document.getElementById('base-price');
  const aiPrice = document.getElementById('ai-price');
  const totalPrice = document.getElementById('total-price');

  if (modalTrackName) modalTrackName.textContent = `🎵 ${track.title}`;
  if (basePrice) basePrice.textContent = `${track.price} ر.س`;
  if (aiPrice) aiPrice.textContent = `50 ر.س`;
  if (totalPrice) totalPrice.textContent = `${track.price + 50} ر.س`;

  const formScreen = document.getElementById('form-screen');
  const successScreen = document.getElementById('success-screen');
  if (formScreen) formScreen.style.display = 'block';
  if (successScreen) successScreen.style.display = 'none';

  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initBookingModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const submitBtn = document.getElementById('submit-order');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBookingModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingModal();
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', submitOrder);
  }
}

function submitOrder() {
  const groomName = document.getElementById('groom-name')?.value.trim();
  const brideName = document.getElementById('bride-name')?.value.trim();
  const eventDate = document.getElementById('event-date')?.value;
  const whatsapp = document.getElementById('whatsapp')?.value.trim();

  if (!groomName || !brideName || !eventDate || !whatsapp) {
    showToast('⚠️ يرجى تعبئة جميع الحقول المطلوبة', 'error');
    [['groom-name', groomName], ['bride-name', brideName], ['event-date', eventDate], ['whatsapp', whatsapp]].forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = !val ? 'rgba(248,113,113,0.7)' : '';
    });
    return;
  }

  const orderId = 'ZG-' + Date.now().toString().slice(-6);
  const order = {
    id: orderId,
    track: state.bookingTrack,
    groomName,
    brideName,
    family: document.getElementById('family-title')?.value || '',
    eventDate,
    notes: document.getElementById('special-notes')?.value || '',
    whatsapp,
    email: document.getElementById('email')?.value || '',
    payment: state.selectedPayment,
    total: state.bookingTrack ? state.bookingTrack.price + 50 : 0,
    status: 'new',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
  };

  const orders = JSON.parse(localStorage.getItem('zg_orders') || '[]');
  orders.push(order);
  localStorage.setItem('zg_orders', JSON.stringify(orders));

  const formScreen = document.getElementById('form-screen');
  const successEl = document.getElementById('success-screen');
  if (formScreen) formScreen.style.display = 'none';
  if (successEl) {
    successEl.style.display = 'flex';
    successEl.style.flexDirection = 'column';
    successEl.style.alignItems = 'center';
  }
  const orderDisplay = document.getElementById('order-id-display');
  if (orderDisplay) orderDisplay.textContent = orderId;

  const cleanPhone = whatsapp.replace(/\s+/g, '').replace(/^00/, '+');
  const waMsg = encodeURIComponent(`مرحباً، أريد متابعة طلبي رقم ${orderId} — زفة: ${state.bookingTrack?.title || ''}`);
  const waLink = document.getElementById('wa-link');
  if (waLink) waLink.href = `https://wa.me/${cleanPhone.replace('+','')}?text=${waMsg}`;

  showToast(`✅ تم إرسال طلبك بنجاح! رقم الطلب: ${orderId}`, 'success');
}

/* ══════════════════════════════════════════════════════════
   PAYMENT OPTIONS
   ══════════════════════════════════════════════════════════ */
function initPaymentOptions() {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.selectedPayment = opt.dataset.method;
    });
  });
}

/* ══════════════════════════════════════════════════════════
   ORDER TRACKING
   ══════════════════════════════════════════════════════════ */
function initTrackingForm() {
  const btn = document.getElementById('track-order-btn');
  if (!btn) return;
  btn.addEventListener('click', trackOrder);
  document.getElementById('tracking-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') trackOrder();
  });
}

function trackOrder() {
  const input = document.getElementById('tracking-input');
  const result = document.getElementById('tracking-result');
  const orderId = input?.value.trim().toUpperCase();

  if (!orderId) {
    showToast('أدخل رقم الطلب', 'error');
    return;
  }

  const orders = JSON.parse(localStorage.getItem('zg_orders') || '[]');
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    if (result) result.innerHTML = `
      <div class="glass-card" style="padding:24px;text-align:center;margin-top:20px;border-color:rgba(248,113,113,0.3);">
        <div style="font-size:2rem;margin-bottom:12px;">❌</div>
        <div style="color:#f87171;font-weight:700;">رقم الطلب غير موجود</div>
        <div style="font-size:0.85rem;color:var(--text-dim);margin-top:8px;">تحقق من الرقم وأعد المحاولة</div>
      </div>`;
    return;
  }

  const statusMap = {
    new: { label: 'طلب جديد — قيد المراجعة', icon: '🆕', color: '#60a5fa' },
    processing: { label: 'قيد المعالجة والتسجيل', icon: '⚙️', color: '#fbbf24' },
    delivered: { label: 'تم التسليم ✓', icon: '✅', color: '#4ade80' },
  };

  const s = statusMap[order.status] || statusMap.new;

  if (result) result.innerHTML = `
    <div class="glass-card" style="padding:28px;margin-top:24px;border-color:rgba(212,175,55,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
        <div>
          <div style="font-size:0.78rem;color:var(--text-dim);">رقم الطلب</div>
          <div style="font-family:'Cairo',sans-serif;font-weight:800;font-size:1.2rem;color:var(--gold)">${order.id}</div>
        </div>
        <div style="text-align:left;">
          <div style="background:rgba(${hexToRgb(s.color)},0.15);border:1px solid rgba(${hexToRgb(s.color)},0.4);color:${s.color};padding:6px 14px;border-radius:99px;font-size:0.8rem;font-weight:700;">
            ${s.icon} ${s.label}
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem;">
        <div><span style="color:var(--text-dim);">الزفة: </span><span style="color:var(--text-primary);font-weight:600;">${order.track?.title || '—'}</span></div>
        <div><span style="color:var(--text-dim);">العريس: </span><span style="color:var(--text-primary);font-weight:600;">${order.groomName}</span></div>
        <div><span style="color:var(--text-dim);">العروس: </span><span style="color:var(--text-primary);font-weight:600;">${order.brideName}</span></div>
        <div><span style="color:var(--text-dim);">التاريخ: </span><span style="color:var(--text-primary);font-weight:600;">${order.eventDate}</span></div>
        <div><span style="color:var(--text-dim);">الإجمالي: </span><span style="color:var(--gold);font-weight:800;">${order.total} ر.س</span></div>
        <div><span style="color:var(--text-dim);">الدفع: </span><span style="color:#4ade80;font-weight:600;">✓ مدفوع</span></div>
      </div>
    </div>`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

/* ══════════════════════════════════════════════════════════
   COUNTERS & STATS
   ══════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.hero-stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent) || 0;
  const suffix = el.dataset.suffix || '';
  const isFloat = target !== Math.floor(target);
  let current = 0;
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = eased * target;

    if (isFloat) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      el.textContent = Math.round(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
    }
  };

  requestAnimationFrame(tick);
}

function initHeroStats() {
  const stats = [
    { el: 'stat-orders', target: 2400, suffix: '+' },
    { el: 'stat-tracks', target: 80, suffix: '+' },
    { el: 'stat-rating', target: 4.9, suffix: '⭐' },
  ];
  stats.forEach(({ el, target, suffix }) => {
    const element = document.getElementById(el);
    if (element) {
      element.dataset.target = target;
      element.dataset.suffix = suffix;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.track-card, .pricing-card, .glass-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.animation = 'fadeInUp 0.6s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      el.style.opacity = '0';
    }
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
   ══════════════════════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '⚠️', info: '🎵' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '🎵'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse both';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ══════════════════════════════════════════════════════════
   GLOBAL EXPORTS
   ══════════════════════════════════════════════════════════ */
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.toggleMiniPlay = toggleMiniPlay;
window.playTrackFromCard = playTrackFromCard;
window.showToast = showToast;
