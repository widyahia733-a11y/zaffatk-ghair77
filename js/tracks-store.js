/**
 * زفتك غير — مستودع ومخزن الزفات والمكتبات الصوتية (Tracks & Audio Libraries Data Store)
 * ZaffatakGhair Tracks & Music Libraries Store
 * يدير جميع المكتبات الفنية والزفات ديناميكياً مع دعم الإضافة والتعديل والحذف والتصدير
 */

'use strict';

const TracksStore = (() => {
  const STORAGE_KEY = 'zg_tracks_custom_v2';
  const DELETED_BUILTIN_KEY = 'zg_tracks_deleted_builtin_v2';

  // ══════════════════════════════════════════════════════════
  // التصنيفات والمكتبات الثقافية والفنية الرسمية
  // ══════════════════════════════════════════════════════════
  const CATEGORIES = [
    { id: 'كل', label: 'الكل', icon: '✨' },
    { id: 'saudi', label: '🇸🇦 زفات سعودية', icon: '🇸🇦' },
    { id: 'kuwait', label: '🇰🇼 زفات وطرب كويتي', icon: '🇰🇼' },
    { id: 'uae', label: '🇦🇪 إماراتية وخليجية', icon: '🇦🇪' },
    { id: 'classic', label: '🎻 كلاسيك وفخامة', icon: '🎻' },
    { id: 'duff', label: '🥁 دفوف بدون موسيقى', icon: '🥁' },
    { id: 'poetry', label: '📜 قصائد وشلات', icon: '📜' },
    { id: 'bride', label: '👰 دخلة العروس', icon: '👰' },
    { id: 'groom', label: '🤵 موكب العريس', icon: '🤵' },
  ];

  // ══════════════════════════════════════════════════════════
  // قاعدة البيانات الأساسية للمكتبات الصوتية الرسمية المطابقة ثقافياً وفنياً
  // ══════════════════════════════════════════════════════════
  const DEFAULT_TRACKS = [
    // ── 1. المكتبة السعودية (🇸🇦 زفات سعودية أصيلة) ──
    {
      id: 'tr-001',
      title: 'زفة الملوك الخليجية',
      artist: 'أسلوب ملكي سعودي أصيل',
      category: 'saudi',
      region: 'saudi',
      regionLabel: 'سعودية',
      duration: '4:32',
      price: 249,
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
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
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
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
      youtubeId: 'M3sxUE4eIac',
      fallbackYoutubeId: '7PVUkGWcprU',
      audioUrl: '',
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
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #2e1808, #522d10)',
      coverEmoji: '🌟',
      tags: ['عود', 'بياتي', 'رواق'],
    },

    // ── 2. المكتبة الكويتية (🇰🇼 زفات وطرب كويتي) ──
    {
      id: 'tr-011',
      title: 'نسيم الكويت والأفراح',
      artist: 'لحن وطرب كويتي رايق',
      category: 'kuwait',
      region: 'kuwait',
      regionLabel: 'كويتية',
      duration: '3:50',
      price: 229,
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #062024, #0d383e)',
      coverEmoji: '🌊',
      tags: ['كويتية', 'طرب', 'أصيل'],
    },
    {
      id: 'tr-003',
      title: 'قصيدة الاستقبال الكويتية',
      artist: 'شعر ومقام كويتي فخم',
      category: 'kuwait',
      region: 'kuwait',
      regionLabel: 'كويتية',
      duration: '5:45',
      price: 299,
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #001a0a, #002a15)',
      coverEmoji: '🎤',
      tags: ['قصيدة', 'استقبال', 'شعر'],
    },

    // ── 3. المكتبة الإماراتية والخليجية (🇦🇪 إماراتية وخليجية) ──
    {
      id: 'tr-002',
      title: 'دخلة العروس الذهبية',
      artist: 'لحن إماراتي فاخر',
      category: 'uae',
      region: 'uae',
      regionLabel: 'إماراتية',
      duration: '3:18',
      price: 199,
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: 'AX8QOuy7YJs',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #0a0a1a, #1a0a2a)',
      coverEmoji: '💍',
      tags: ['رومانسية', 'ناعمة', 'عروس'],
    },
    {
      id: 'tr-010',
      title: 'زفة دانات الخليج',
      artist: 'إيقاع عيالة إماراتي حماسي',
      category: 'uae',
      region: 'uae',
      regionLabel: 'إماراتية',
      duration: '4:20',
      price: 239,
      youtubeId: 'M3sxUE4eIac',
      fallbackYoutubeId: '7PVUkGWcprU',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #081525, #122b4a)',
      coverEmoji: '💎',
      tags: ['عيالة', 'دانات', 'حماس'],
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
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #150f29, #2b1f52)',
      coverEmoji: '🏙️',
      tags: ['أوركسترا', 'مودرن', 'فخامة'],
    },

    // ── 4. كلاسيك وفخامة (🎻 كلاسيك وأوركسترا) ──
    {
      id: 'tr-025',
      title: 'أوتار المجد الكلاسيكية',
      artist: 'أوركسترا كلاسيك شرقي ملكي',
      category: 'classic',
      region: 'gulf',
      regionLabel: 'كلاسيك',
      duration: '4:35',
      price: 329,
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'AX8QOuy7YJs',
      audioUrl: '',
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
      youtubeId: 'AX8QOuy7YJs',
      fallbackYoutubeId: '7PVUkGWcprU',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #101c24, #1d3342)',
      coverEmoji: '🎼',
      tags: ['سيمفونية', 'بيانو', 'عود'],
    },

    // ── 5. دفوف بدون موسيقى (🥁 دفوف إسلامية خالصة) ──
    {
      id: 'tr-004',
      title: 'زفة الدفوف التراثية',
      artist: 'دفوف تراثية خالصة (إسلامية)',
      category: 'duff',
      region: 'saudi',
      regionLabel: 'دفوف',
      duration: '3:55',
      price: 149,
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: '7PVUkGWcprU',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #1a0f00, #2a1800)',
      coverEmoji: '🥁',
      tags: ['دفوف', 'بدون موسيقى', 'إسلامي'],
    },
    {
      id: 'tr-013',
      title: 'زفة طاب السهر والمسرات',
      artist: 'دفوف حجازية نقية وطار',
      category: 'duff',
      region: 'saudi',
      regionLabel: 'دفوف',
      duration: '4:10',
      price: 169,
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #261605, #42280d)',
      coverEmoji: '🌙',
      tags: ['حجازي', 'بدون موسيقى', 'طار'],
    },
    {
      id: 'tr-014',
      title: 'زفة بهجة القلوب الطاهرة',
      artist: 'إيقاع إسلامي هادئ ونقاء',
      category: 'duff',
      region: 'gulf',
      regionLabel: 'دفوف',
      duration: '3:35',
      price: 159,
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #1c1808, #362f12)',
      coverEmoji: '🤍',
      tags: ['إسلامي', 'هادئ', 'نقاء'],
    },
    {
      id: 'tr-015',
      title: 'ليلة الفرح الحلال',
      artist: 'مؤثرات بشرية وأكابيلا مع دفوف',
      category: 'duff',
      region: 'saudi',
      regionLabel: 'دفوف',
      duration: '4:25',
      price: 179,
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: '7PVUkGWcprU',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #241407, #3d230e)',
      coverEmoji: '🕊️',
      tags: ['أكابيلا', 'دفوف', 'مؤثرات'],
    },

    // ── 6. قصائد وشلات (📜 قصائد وشلات ترحيبية) ──
    {
      id: 'tr-005',
      title: 'شلة الفرحة الخليجية',
      artist: 'شلات ومدائح ترحيبية',
      category: 'poetry',
      region: 'gulf',
      regionLabel: 'خليجية',
      duration: '4:10',
      price: 279,
      youtubeId: '_Fwf45pIAtM',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #1a001a, #2a002a)',
      coverEmoji: '🌹',
      tags: ['شلة', 'فرح', 'مدائح'],
    },
    {
      id: 'tr-016',
      title: 'شلة يا مرحباً بضيوفنا الكرام',
      artist: 'أداء شعبي ترحيبي أصيل',
      category: 'poetry',
      region: 'saudi',
      regionLabel: 'سعودية',
      duration: '4:50',
      price: 259,
      youtubeId: 'M3sxUE4eIac',
      fallbackYoutubeId: '_Fwf45pIAtM',
      audioUrl: '',
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
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'AX8QOuy7YJs',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #12001c, #260538)',
      coverEmoji: '✒️',
      tags: ['نبطي', 'وصف', 'مدح'],
    },

    // ── 7. دخلة العروس (👰 دخلة العروس) ──
    {
      id: 'tr-018',
      title: 'أقبلت بنت الأصايل',
      artist: 'دخلة ملكية بطيئة مع ناي وعود',
      category: 'bride',
      region: 'saudi',
      regionLabel: 'عروس',
      duration: '4:48',
      price: 289,
      youtubeId: 'AX8QOuy7YJs',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #240a1d, #421637)',
      coverEmoji: '👰',
      tags: ['دخلة', 'ملكية', 'هدوء'],
    },
    {
      id: 'tr-019',
      title: 'نور الليالي وسيدة الحفل',
      artist: 'لحن رومانسي حالم فخم',
      category: 'bride',
      region: 'uae',
      regionLabel: 'عروس',
      duration: '3:58',
      price: 269,
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: 'AX8QOuy7YJs',
      audioUrl: '',
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
      youtubeId: 'AX8QOuy7YJs',
      fallbackYoutubeId: '7PVUkGWcprU',
      audioUrl: '',
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
      youtubeId: 'Rh9M8EBs6bw',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #331027, #592046)',
      coverEmoji: '👑',
      tags: ['أوركسترا', 'فخامة', 'زغاريد'],
    },

    // ── 8. موكب العريس (🤵 موكب العريس) ──
    {
      id: 'tr-006',
      title: 'موكب العريس الملكي',
      artist: 'أوركسترا خليجي حماسي للدخول',
      category: 'groom',
      region: 'saudi',
      regionLabel: 'عريس',
      duration: '3:30',
      price: 349,
      youtubeId: 'M3sxUE4eIac',
      fallbackYoutubeId: '_Fwf45pIAtM',
      audioUrl: '',
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
      youtubeId: '7PVUkGWcprU',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #121004, #26220a)',
      coverEmoji: '🗡️',
      tags: ['حماسي', 'شموخ', 'رجال'],
    },
    {
      id: 'tr-023',
      title: 'زفة الفخر والجاه والقبيلة',
      artist: 'عرضة ومسيرة دخول العريس',
      category: 'groom',
      region: 'gulf',
      regionLabel: 'عريس',
      duration: '4:00',
      price: 299,
      youtubeId: '_Fwf45pIAtM',
      fallbackYoutubeId: 'M3sxUE4eIac',
      audioUrl: '',
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
      youtubeId: 'M3sxUE4eIac',
      fallbackYoutubeId: 'Rh9M8EBs6bw',
      audioUrl: '',
      coverGradient: 'linear-gradient(135deg, #1c1808, #383112)',
      coverEmoji: '🎉',
      tags: ['بهجة', 'فرح', 'شباب'],
    },
  ];

  /**
   * استخراج معرّف يوتيوب النقي من أي رابط
   */
  function cleanYoutubeId(input) {
    if (!input || typeof input !== 'string') return '';
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const match = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  }

  /**
   * جلب جميع المسارات المتاحة (الأساسية + المضافة من المدير)
   */
  function getAllTracks() {
    try {
      const storedCustom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const deletedBuiltins = JSON.parse(localStorage.getItem(DELETED_BUILTIN_KEY) || '[]');

      // استبعاد المسارات الأساسية المحذوفة
      const activeBuiltins = DEFAULT_TRACKS.filter(t => !deletedBuiltins.includes(t.id));

      // دمج المسارات المخصصة
      // إذا كان المسار المخصص يعدل مساراً أساسياً
      const mergedMap = new Map();
      activeBuiltins.forEach(t => mergedMap.set(t.id, { ...t }));
      storedCustom.forEach(t => mergedMap.set(t.id, { ...t, isCustom: true }));

      return Array.from(mergedMap.values());
    } catch (e) {
      console.warn('TracksStore: Error reading localStorage, returning default tracks', e);
      return [...DEFAULT_TRACKS];
    }
  }

  /**
   * جلب مسار بواسطة المعرف
   */
  function getTrackById(id) {
    const tracks = getAllTracks();
    return tracks.find(t => t.id === id) || null;
  }

  /**
   * جلب المسارات حسب الفئة
   */
  function getTracksByCategory(categoryId) {
    const tracks = getAllTracks();
    if (!categoryId || categoryId === 'كل') return tracks;
    return tracks.filter(t => t.category === categoryId || t.region === categoryId);
  }

  /**
   * إضافة أو تحديث مسار في المكتبة
   */
  function saveTrack(trackInput) {
    if (!trackInput || !trackInput.title) {
      throw new Error('عنوان الزفة مطلوب');
    }

    const storedCustom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const isEdit = !!trackInput.id;
    const trackId = isEdit ? trackInput.id : `tr-custom-${Date.now()}`;

    // معالجة الروابط
    let ytId = cleanYoutubeId(trackInput.youtubeId || '');
    let audioUrl = (trackInput.audioUrl || '').trim();
    let fallbackYt = cleanYoutubeId(trackInput.fallbackYoutubeId || '') || 'Rh9M8EBs6bw';

    // إذا تم تمرير رابط صوتي في حقل اليوتيوب أو العكس
    if (!ytId && /^https?:\/\//i.test(trackInput.youtubeId || '')) {
      if (/\.(mp3|aac|m4a|wav|ogg)(\?.*)?$/i.test(trackInput.youtubeId)) {
        audioUrl = trackInput.youtubeId.trim();
      }
    }

    if (!ytId && !audioUrl) {
      ytId = 'Rh9M8EBs6bw'; // Default fallback
    }

    // تجهيز التدرج اللوني والأيقونة
    const emoji = trackInput.coverEmoji || getCategoryEmoji(trackInput.category);
    const gradient = trackInput.coverGradient || getCategoryGradient(trackInput.category);

    const regionLabelMap = {
      saudi: 'سعودية',
      kuwait: 'كويتية',
      uae: 'إماراتية',
      classic: 'كلاسيك',
      duff: 'دفوف',
      poetry: 'قصائد',
      bride: 'عروس',
      groom: 'عريس',
    };

    const newTrack = {
      id: trackId,
      title: trackInput.title.trim(),
      artist: (trackInput.artist || 'أسلوب خليجي أصيل').trim(),
      category: trackInput.category || 'saudi',
      region: trackInput.region || trackInput.category || 'saudi',
      regionLabel: trackInput.regionLabel || regionLabelMap[trackInput.category] || 'خليجية',
      duration: trackInput.duration || '4:15',
      price: Number(trackInput.price) || 249,
      youtubeId: ytId,
      fallbackYoutubeId: fallbackYt,
      audioUrl: audioUrl,
      coverGradient: gradient,
      coverEmoji: emoji,
      tags: Array.isArray(trackInput.tags) ? trackInput.tags : (typeof trackInput.tags === 'string' ? trackInput.tags.split(',').map(s => s.trim()).filter(Boolean) : ['زفة', 'خليجية']),
      isCustom: true,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = storedCustom.findIndex(t => t.id === trackId);
    if (existingIndex >= 0) {
      storedCustom[existingIndex] = newTrack;
    } else {
      storedCustom.unshift(newTrack);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCustom));
    notifyChange();
    return newTrack;
  }

  /**
   * حذف مسار من المكتبة
   */
  function deleteTrack(id) {
    let storedCustom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const isCustom = storedCustom.some(t => t.id === id);

    if (isCustom) {
      storedCustom = storedCustom.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCustom));
    } else {
      // إذا كان مساراً أساسياً نضعه في قائمة المحذوفات
      const deletedBuiltins = JSON.parse(localStorage.getItem(DELETED_BUILTIN_KEY) || '[]');
      if (!deletedBuiltins.includes(id)) {
        deletedBuiltins.push(id);
        localStorage.setItem(DELETED_BUILTIN_KEY, JSON.stringify(deletedBuiltins));
      }
    }
    notifyChange();
    return true;
  }

  /**
   * استعادة المكتبة الافتراضية
   */
  function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DELETED_BUILTIN_KEY);
    notifyChange();
    return getAllTracks();
  }

  /**
   * تصدير جميع المسارات كملف JSON
   */
  function exportJSON() {
    const all = getAllTracks();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(all, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `zaffatak-tracks-library-${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /**
   * استيراد مسارات من ملف JSON
   */
  function importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('الملف لا يحتوي على مصفوفة مسارات صالحة');
      
      parsed.forEach(t => {
        if (t && t.title) {
          saveTrack(t);
        }
      });
      return true;
    } catch (e) {
      console.error('Error importing JSON tracks:', e);
      throw e;
    }
  }

  function getCategoryEmoji(cat) {
    const map = {
      saudi: '🇸🇦',
      kuwait: '🇰🇼',
      uae: '🇦🇪',
      classic: '🎻',
      duff: '🥁',
      poetry: '📜',
      bride: '👰',
      groom: '🤵',
    };
    return map[cat] || '🎵';
  }

  function getCategoryGradient(cat) {
    const map = {
      saudi: 'linear-gradient(135deg, #1a0a00, #3d1a00)',
      kuwait: 'linear-gradient(135deg, #062024, #0d383e)',
      uae: 'linear-gradient(135deg, #081525, #122b4a)',
      classic: 'linear-gradient(135deg, #1a1202, #3b2a05)',
      duff: 'linear-gradient(135deg, #1a0f00, #2a1800)',
      poetry: 'linear-gradient(135deg, #1a001a, #2a002a)',
      bride: 'linear-gradient(135deg, #240a1d, #421637)',
      groom: 'linear-gradient(135deg, #0a0a00, #1a1a00)',
    };
    return map[cat] || 'linear-gradient(135deg, #161a29, #232a3e)';
  }

  function notifyChange() {
    window.dispatchEvent(new CustomEvent('zg_tracks_updated', { detail: { tracks: getAllTracks() } }));
  }

  return {
    CATEGORIES,
    DEFAULT_TRACKS,
    getAllTracks,
    getTrackById,
    getTracksByCategory,
    saveTrack,
    deleteTrack,
    resetToDefaults,
    exportJSON,
    importJSON,
    cleanYoutubeId,
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TracksStore;
}
