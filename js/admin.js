/**
 * زفتك غير — Admin Dashboard JavaScript
 * ZaffatakGhair Admin Panel Logic
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   CONSTANTS & STATE
   ══════════════════════════════════════════════════════════ */

const ADMIN_PASS = 'zaffatak2025'; // Simple demo auth

const adminState = {
  activeTab: 'orders',
  orders: [],
  aiRunning: false,
  aiStep: 0,
};

const DEMO_ORDERS = [
  { id: 'ZG-001234', client: 'أحمد العتيبي', whatsapp: '+966501234567', track: 'زفة الملوك الخليجية', groomName: 'أَحْمَد', brideName: 'نُورَة', eventDate: '2025-12-15', total: 299, paymentStatus: 'paid', status: 'new', createdAt: '2025-09-10T18:30:00Z' },
  { id: 'ZG-001235', client: 'فهد الشمري', whatsapp: '+966509876543', track: 'دخلة العروس الذهبية', groomName: 'فَهْد', brideName: 'هِنْد', eventDate: '2025-11-20', total: 249, paymentStatus: 'paid', status: 'processing', createdAt: '2025-09-10T17:00:00Z' },
  { id: 'ZG-001236', client: 'محمد الدوسري', whatsapp: '+966505555111', track: 'زفة الدفوف البدون موسيقى', groomName: 'مُحَمَّد', brideName: 'سَارَة', eventDate: '2025-10-30', total: 199, paymentStatus: 'paid', status: 'delivered', createdAt: '2025-09-09T12:00:00Z' },
  { id: 'ZG-001237', client: 'سلطان الغامدي', whatsapp: '+966507777222', track: 'شلة الفرحة الخليجية', groomName: 'سُلْطَان', brideName: 'لَيْلَى', eventDate: '2026-01-05', total: 329, paymentStatus: 'pending', status: 'new', createdAt: '2025-09-10T20:15:00Z' },
  { id: 'ZG-001238', client: 'خالد المطيري', whatsapp: '+966503333888', track: 'قصيدة الاستقبال الكويتية', groomName: 'خَالِد', brideName: 'دَانَة', eventDate: '2025-12-28', total: 349, paymentStatus: 'paid', status: 'processing', createdAt: '2025-09-10T15:45:00Z' },
];

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadOrders();
  initNavigation();
  renderOrdersTable();
  renderStats();
  initAIWorkstation();
  initLibraryForm();
  initSearch();
  startLiveClock();
  animateStats();
});

/* ══════════════════════════════════════════════════════════
   AUTH
   ══════════════════════════════════════════════════════════ */

function checkAuth() {
  // Simple demo auth check - in production use proper JWT
  const auth = sessionStorage.getItem('zg_admin_auth');
  if (!auth) {
    // Auto-login for demo
    sessionStorage.setItem('zg_admin_auth', 'true');
  }
}

/* ══════════════════════════════════════════════════════════
   ORDERS
   ══════════════════════════════════════════════════════════ */

function loadOrders() {
  const stored = JSON.parse(localStorage.getItem('zg_orders') || '[]');
  // Merge demo orders with actual orders
  const allOrders = [...DEMO_ORDERS, ...stored];
  adminState.orders = allOrders;
  updateNavBadge(allOrders.filter(o => o.status === 'new').length);
}

function renderOrdersTable(filterStatus = 'all', searchQuery = '') {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  let orders = adminState.orders;

  if (filterStatus !== 'all') {
    orders = orders.filter(o => o.status === filterStatus || o.paymentStatus === filterStatus);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.client?.toLowerCase().includes(q) ||
      o.groomName?.toLowerCase().includes(q) ||
      o.brideName?.toLowerCase().includes(q)
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <span class="empty-icon">📭</span>
            <p>لا توجد طلبات تطابق البحث</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  const statusLabels = {
    new: { label: 'جديد', class: 'new', icon: '🆕' },
    processing: { label: 'معالجة', class: 'processing', icon: '⚙️' },
    delivered: { label: 'تم التسليم', class: 'delivered', icon: '✅' },
  };

  const paymentLabels = {
    paid: { label: 'مدفوع', class: 'paid', icon: '✓' },
    pending: { label: 'معلق', class: 'pending', icon: '⏳' },
  };

  tbody.innerHTML = orders.map(order => {
    const s = statusLabels[order.status] || statusLabels.new;
    const p = paymentLabels[order.paymentStatus] || paymentLabels.pending;
    const date = new Date(order.createdAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return `
      <tr data-order-id="${order.id}">
        <td><span class="order-id">${order.id}</span></td>
        <td><span class="client-name">${order.client || 'عميل'}</span></td>
        <td style="direction:ltr;text-align:left;font-size:0.78rem;">${order.whatsapp || '—'}</td>
        <td><span class="track-title-cell">${order.track || '—'}</span></td>
        <td>
          <div class="names-cell">
            <span class="groom-name">👰‍♂️ ${order.groomName || '—'}</span>
            <span class="bride-name">💍 ${order.brideName || '—'}</span>
          </div>
        </td>
        <td>${order.eventDate || '—'}</td>
        <td><span class="badge ${p.class}">${p.icon} ${p.label}</span></td>
        <td>
          <select class="select-admin" style="width:auto;padding:5px 10px;font-size:0.75rem;" onchange="updateOrderStatus('${order.id}', this.value)" aria-label="تغيير حالة الطلب">
            <option value="new" ${order.status === 'new' ? 'selected' : ''}>🆕 جديد</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>⚙️ معالجة</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ تسليم</option>
          </select>
        </td>
        <td>
          <div class="action-group">
            <button class="action-btn copy" title="نسخ تفاصيل الطلب" onclick="copyOrderDetails('${order.id}')" aria-label="نسخ التفاصيل">📋</button>
            <button class="action-btn wa" title="إرسال تحديث واتساب" onclick="sendWhatsAppUpdate('${order.id}')" aria-label="إرسال واتساب">💬</button>
            <button class="action-btn ai" title="فتح في استوديو AI" onclick="openInAIWorkstation('${order.id}')" aria-label="فتح في الاستوديو">🤖</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function renderStats() {
  const orders = adminState.orders;
  const newOrders = orders.filter(o => o.status === 'new').length;
  const processing = orders.filter(o => o.status === 'processing').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.total || 0), 0);

  setStatVal('stat-new-orders', newOrders);
  setStatVal('stat-processing', processing);
  setStatVal('stat-delivered', delivered);
  setStatVal('stat-revenue', totalRevenue.toLocaleString('ar-SA') + ' ر.س');
}

function setStatVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateNavBadge(count) {
  const badge = document.getElementById('orders-badge');
  if (badge) badge.textContent = count;
}

function updateOrderStatus(orderId, newStatus) {
  const order = adminState.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;

  // Persist to localStorage if it's a real order
  const stored = JSON.parse(localStorage.getItem('zg_orders') || '[]');
  const storedOrder = stored.find(o => o.id === orderId);
  if (storedOrder) {
    storedOrder.status = newStatus;
    localStorage.setItem('zg_orders', JSON.stringify(stored));
  }

  renderStats();
  showAdminToast(`✅ تم تحديث حالة الطلب ${orderId} إلى: ${newStatus}`, 'success');
}

function copyOrderDetails(orderId) {
  const order = adminState.orders.find(o => o.id === orderId);
  if (!order) return;

  const text = `📦 طلب رقم: ${order.id}
👰‍♂️ اسم العريس: ${order.groomName}
💍 اسم العروس: ${order.brideName}
🎵 الزفة: ${order.track}
📅 تاريخ المناسبة: ${order.eventDate}
📝 ملاحظات: ${order.notes || 'لا توجد'}
📱 الواتساب: ${order.whatsapp}`;

  navigator.clipboard.writeText(text).then(() => {
    showAdminToast('📋 تم نسخ تفاصيل الطلب للحافظة', 'success');
  }).catch(() => {
    showAdminToast('❌ فشل النسخ', 'error');
  });
}

function sendWhatsAppUpdate(orderId) {
  const order = adminState.orders.find(o => o.id === orderId);
  if (!order || !order.whatsapp) return;

  const message = encodeURIComponent(`🎵 مرحباً بك في زفتك غير!\n\nطلبك رقم *${order.id}* قيد التجهيز الآن ✨\nسيصلك ملفك خلال 24 ساعة أو أقل إن شاء الله.\n\nشكراً لثقتك بنا 👑`);
  window.open(`https://wa.me/${order.whatsapp.replace(/\s/g, '').replace('+', '')}?text=${message}`, '_blank');
  showAdminToast(`💬 فتح واتساب للعميل ${order.client}`, 'info');
}

function openInAIWorkstation(orderId) {
  const order = adminState.orders.find(o => o.id === orderId);
  if (!order) return;

  // Switch to AI tab and populate
  switchTab('ai-studio');
  setTimeout(() => {
    const groomEl = document.getElementById('ai-groom-name');
    const brideEl = document.getElementById('ai-bride-name');
    const trackEl = document.getElementById('ai-track-select');
    const orderEl = document.getElementById('ai-order-ref');

    if (groomEl) groomEl.value = order.groomName || '';
    if (brideEl) brideEl.value = order.brideName || '';
    if (orderEl) orderEl.value = order.id;
  }, 100);

  showAdminToast(`🎵 فتح استوديو الهندسة الصوتية للطلب ${orderId}`, 'info');
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════ */

function initNavigation() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  adminState.activeTab = tabId;

  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-page').forEach(page => {
    page.classList.toggle('active', page.id === `tab-${tabId}`);
  });

  const titles = {
    orders: '📦 إدارة الطلبات',
    library: '🎵 المكتبة الصوتية',
    'ai-studio': '🎵 استوديو الهندسة الصوتية',
    analytics: '📊 التحليلات',
    settings: '⚙️ الإعدادات',
  };

  const topbarTitle = document.getElementById('topbar-title');
  if (topbarTitle) topbarTitle.textContent = titles[tabId] || 'لوحة التحكم';
}

/* ══════════════════════════════════════════════════════════
   SEARCH & FILTER
   ══════════════════════════════════════════════════════════ */

function initSearch() {
  const searchInput = document.getElementById('admin-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      renderOrdersTable('all', searchInput.value);
    }, 300));
  }

  // Status filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const search = document.getElementById('admin-search')?.value || '';
      renderOrdersTable(btn.dataset.filter, search);
    });
  });
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/* ══════════════════════════════════════════════════════════
   AI WORKSTATION
   ══════════════════════════════════════════════════════════ */

function initAIWorkstation() {
  const generateBtn = document.getElementById('generate-ai-btn');
  const previewBtn = document.getElementById('preview-ai-btn');
  const exportBtn = document.getElementById('export-ai-btn');

  if (generateBtn) generateBtn.addEventListener('click', generateAIVoice);
  if (previewBtn) previewBtn.addEventListener('click', previewMergedAudio);
  if (exportBtn) exportBtn.addEventListener('click', exportAndDeliver);

  // Voice model selector visual feedback
  document.querySelectorAll('.voice-model-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.voice-model-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

const AI_STEPS = [
  { text: '🔍 تحليل الأسماء ونقل التشكيل...', progress: 15 },
  { text: '🎙️ تحميل نموذج الصوت الأصلي...', progress: 30 },
  { text: '⚙️ معالجة RVC — تحويل الصوت...', progress: 55 },
  { text: '🔊 دمج الأسماء مع الموسيقى الأصلية...', progress: 75 },
  { text: '🎚️ ضبط الطبقة الصوتية والتوازن...', progress: 88 },
  { text: '✅ إنهاء المعالجة وترميز الملف...', progress: 100 },
];

function generateAIVoice() {
  if (adminState.aiRunning) return;

  const groomName = document.getElementById('ai-groom-name')?.value.trim();
  const brideName = document.getElementById('ai-bride-name')?.value.trim();

  if (!groomName || !brideName) {
    showAdminToast('⚠️ أدخل أسماء العروسين أولاً', 'error');
    return;
  }

  adminState.aiRunning = true;
  adminState.aiStep = 0;

  const progressWrap = document.getElementById('ai-progress-wrap');
  const progressFill = document.getElementById('ai-progress-fill');
  const stepText = document.getElementById('ai-step-text');
  const generateBtn = document.getElementById('generate-ai-btn');

  progressWrap?.classList.add('visible');
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.innerHTML = '⏳ جاري التوليد...';
  }

  // Simulate AI steps
  let stepIndex = 0;
  const interval = setInterval(() => {
    if (stepIndex >= AI_STEPS.length) {
      clearInterval(interval);
      adminState.aiRunning = false;
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '🎵 توليد الصوت بالهندسة الصوتية';
      }
      document.getElementById('ai-result-section')?.classList.remove('hidden');
      showAdminToast(`✅ تم توليد صوت "${groomName} و${brideName}" بنجاح!`, 'success');

      // Animate waveform
      startResultWaveform();
      return;
    }

    const step = AI_STEPS[stepIndex];
    if (progressFill) progressFill.style.width = `${step.progress}%`;
    if (stepText) stepText.textContent = step.text;
    stepIndex++;
  }, 900);
}

let resultWaveInterval = null;

function startResultWaveform() {
  const wave = document.getElementById('result-waveform');
  if (!wave) return;

  wave.innerHTML = Array.from({ length: 60 }, (_, i) =>
    `<div style="width:3px;border-radius:99px;background:linear-gradient(to top,#A8861E,#F0D060);transition:height 0.25s ease;height:${Math.random() * 70 + 15}%;animation:waveAnim ${(Math.random() * 0.4 + 0.4).toFixed(2)}s ease-in-out infinite alternate;animation-delay:${(i * 0.03).toFixed(2)}s;"></div>`
  ).join('');

  clearInterval(resultWaveInterval);
  resultWaveInterval = setInterval(() => {
    wave.querySelectorAll('div').forEach(bar => {
      bar.style.height = `${Math.random() * 75 + 12}%`;
    });
  }, 350);
}

function previewMergedAudio() {
  if (window.AudioEngine) {
    if (window.AudioEngine.getState()) {
      window.AudioEngine.pause();
      showAdminToast('⏸ تم إيقاف المعاينة مؤقتاً', 'info');
      return;
    }
    showAdminToast('🎵 جاري تشغيل المعاينة المدمجة في الكواليس...', 'info');
    startResultWaveform();
    window.AudioEngine.play(
      'AX8QOuy7YJs',
      () => showAdminToast('تعذر تشغيل المعاينة سحابياً', 'error'),
      () => showAdminToast('انتهى تشغيل المعاينة', 'info'),
      { title: 'معاينة الزفة المدمجة بالذكاء الاصطناعي', artist: 'استوديو زفتك غير الهندسي' }
    );
  } else {
    showAdminToast('🎵 جاري تشغيل المعاينة المدمجة...', 'info');
    startResultWaveform();
  }
}

function exportAndDeliver() {
  const orderId = document.getElementById('ai-order-ref')?.value;
  const groomName = document.getElementById('ai-groom-name')?.value;
  const brideName = document.getElementById('ai-bride-name')?.value;

  // Simulate download
  showAdminToast('📦 جاري تحضير ملف MP3 320kbps...', 'info');

  setTimeout(() => {
    // Update order status
    if (orderId) updateOrderStatus(orderId, 'delivered');
    showAdminToast(`🎉 تم تصدير الملف وتحديث الطلب ${orderId || ''} إلى "تم التسليم"`, 'success');
  }, 2000);
}

/* ══════════════════════════════════════════════════════════
   LIBRARY MANAGEMENT (CRUD + LIVE PREVIEW + JSON SYNC)
   ══════════════════════════════════════════════════════════ */

let adminActiveLibFilter = 'كل';
let currentPlayingTrackId = null;

function initLibraryForm() {
  renderAdminLibrary();

  // Listen for external tracks updates
  window.addEventListener('zg_tracks_updated', () => {
    renderAdminLibrary(adminActiveLibFilter);
  });
}

function filterAdminLibrary(cat) {
  adminActiveLibFilter = cat;
  document.querySelectorAll('#library-category-filters [data-lib-filter]').forEach(btn => {
    const isTarget = btn.dataset.libFilter === cat;
    btn.classList.toggle('active', isTarget);
    btn.style.borderColor = isTarget ? 'var(--gold)' : '';
    btn.style.color = isTarget ? 'var(--gold)' : '';
  });
  renderAdminLibrary(cat);
}

function renderAdminLibrary(filterCategory = adminActiveLibFilter) {
  const container = document.getElementById('admin-tracks-list');
  const badge = document.getElementById('library-count-badge');
  if (!container || !window.TracksStore) return;

  const allTracks = TracksStore.getAllTracks();
  const filtered = (filterCategory === 'كل')
    ? allTracks
    : TracksStore.getTracksByCategory(filterCategory);

  if (badge) {
    badge.textContent = `${filtered.length} مسار`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:36px 20px;background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.08);border-radius:12px;">
        <span style="font-size:2rem;display:block;margin-bottom:8px;">🎵</span>
        <div style="color:var(--text-primary);font-weight:600;">لا توجد مسارات في هذا التصنيف حالياً</div>
        <p style="font-size:0.8rem;color:var(--text-dim);margin-top:4px;">يمكنك إضافة زفة جديدة الآن عبر النموذج الجانبي</p>
      </div>
    `;
    return;
  }

  const categoryLabels = {
    saudi: '🇸🇦 سعودية',
    kuwait: '🇰🇼 كويتية',
    uae: '🇦🇪 إماراتية',
    classic: '🎻 كلاسيك',
    duff: '🥁 دفوف',
    poetry: '📜 قصائد',
    bride: '👰 عروس',
    groom: '🤵 عريس',
  };

  container.innerHTML = filtered.map(track => {
    const isPlaying = currentPlayingTrackId === track.id && window.AudioEngine && window.AudioEngine.getState();
    const playIcon = isPlaying ? '⏸' : '▶';
    const activeBorder = isPlaying ? 'border-color:var(--gold);background:rgba(212,175,55,0.08);' : 'border-color:rgba(255,255,255,0.06);';

    return `
      <div class="admin-track-item" id="admin-track-${track.id}" style="display:flex;align-items:center;gap:14px;padding:14px;background:rgba(255,255,255,0.03);border:1px solid;${activeBorder}border-radius:12px;transition:var(--transition);">
        <!-- Play / Preview Button -->
        <button class="action-btn" onclick="previewTrack('${track.id}')" style="width:38px;height:38px;border-radius:50%;background:${isPlaying ? 'var(--gold)' : 'rgba(212,175,55,0.15)'};color:${isPlaying ? '#000' : 'var(--gold)'};display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;flex-shrink:0;border:1px solid var(--border-gold);" title="تشغيل / إيقاف المعاينة">
          ${playIcon}
        </button>

        <!-- Track Cover / Emoji -->
        <div style="width:42px;height:42px;border-radius:10px;background:${track.coverGradient || 'linear-gradient(135deg,rgba(212,175,55,0.2),rgba(201,121,106,0.1))'};display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;border:1px solid rgba(255,255,255,0.1);">
          ${track.coverEmoji || '🎵'}
        </div>

        <!-- Track Details -->
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:0.92rem;color:var(--text-primary);font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${track.title}
            </div>
            ${track.isCustom ? `<span style="font-size:0.65rem;padding:2px 6px;border-radius:4px;background:rgba(34,197,94,0.15);color:#4ade80;font-weight:600;">✨ مضاف مخصص</span>` : ''}
            <span style="font-size:0.68rem;padding:2px 8px;border-radius:4px;background:rgba(212,175,55,0.12);color:var(--gold);font-weight:600;">
              ${categoryLabels[track.category] || track.regionLabel || 'خليجية'}
            </span>
          </div>
          <div style="font-size:0.75rem;color:var(--text-dim);margin-top:3px;display:flex;gap:12px;flex-wrap:wrap;">
            <span>🎙️ ${track.artist || 'أسلوب أصيل'}</span>
            <span>⏱️ ${track.duration || '4:15'}</span>
            <span>💰 ${track.price} ر.س</span>
            ${track.youtubeId ? `<span style="color:var(--gold);opacity:0.8;">🔗 YT: ${track.youtubeId}</span>` : ''}
            ${track.audioUrl ? `<span style="color:#4ade80;opacity:0.8;">🔊 Stream Link</span>` : ''}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <button class="action-btn copy" onclick="editTrack('${track.id}')" title="تعديل الزفة">✏️</button>
          <button class="action-btn" onclick="deleteTrack('${track.id}')" style="color:#ef4444;" title="حذف الزفة">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function previewTrack(trackId) {
  if (!window.TracksStore || !window.AudioEngine) return;

  const track = TracksStore.getTrackById(trackId);
  if (!track) return;

  if (currentPlayingTrackId === trackId && AudioEngine.getState()) {
    AudioEngine.pause();
    currentPlayingTrackId = null;
    renderAdminLibrary(adminActiveLibFilter);
    showAdminToast('⏸ تم إيقاف المعاينة مؤقتاً', 'info');
    return;
  }

  currentPlayingTrackId = trackId;
  renderAdminLibrary(adminActiveLibFilter);
  showAdminToast(`🎵 تشغيل سحابي بالكواليس: ${track.title}`, 'info');

  AudioEngine.play(
    track,
    (failedId, err) => {
      currentPlayingTrackId = null;
      renderAdminLibrary(adminActiveLibFilter);
      showAdminToast(`تعذر تشغيل الزفة "${track.title}"`, 'error');
    },
    () => {
      currentPlayingTrackId = null;
      renderAdminLibrary(adminActiveLibFilter);
    },
    track
  );
}

function handleSaveTrackForm(e) {
  e.preventDefault();
  if (!window.TracksStore) return;

  const id = document.getElementById('track-edit-id')?.value.trim();
  const title = document.getElementById('track-title')?.value.trim();
  const category = document.getElementById('track-category')?.value;
  const price = document.getElementById('track-price')?.value;
  const artist = document.getElementById('track-artist')?.value.trim();
  const duration = document.getElementById('track-duration')?.value.trim();
  const youtube = document.getElementById('track-youtube')?.value.trim();
  const fallback = document.getElementById('track-fallback')?.value.trim();
  const tags = document.getElementById('track-tags')?.value.trim();
  const emoji = document.getElementById('track-emoji')?.value.trim();

  if (!title) {
    showAdminToast('⚠️ يرجى إدخال عنوان الزفة', 'error');
    return;
  }

  if (!youtube) {
    showAdminToast('⚠️ يرجى إدخال رابط البث الصوتي أو معرّف يوتيوب', 'error');
    return;
  }

  try {
    const saved = TracksStore.saveTrack({
      id: id || undefined,
      title,
      category,
      price,
      artist,
      duration,
      youtubeId: youtube,
      fallbackYoutubeId: fallback,
      tags,
      coverEmoji: emoji || undefined,
    });

    showAdminToast(`✨ تم ${id ? 'تحديث' : 'إضافة'} زفة "${saved.title}" بنجاح ونشرها للموقع!`, 'success');
    resetTrackForm();
    renderAdminLibrary(adminActiveLibFilter);
  } catch (err) {
    showAdminToast(`❌ خطأ: ${err.message}`, 'error');
  }
}

function editTrack(trackId) {
  if (!window.TracksStore) return;
  const track = TracksStore.getTrackById(trackId);
  if (!track) return;

  document.getElementById('track-edit-id').value = track.id;
  document.getElementById('track-title').value = track.title || '';
  document.getElementById('track-category').value = track.category || 'saudi';
  document.getElementById('track-price').value = track.price || 249;
  document.getElementById('track-artist').value = track.artist || '';
  document.getElementById('track-duration').value = track.duration || '4:15';
  document.getElementById('track-youtube').value = track.audioUrl || track.youtubeId || '';
  document.getElementById('track-fallback').value = track.fallbackYoutubeId || '';
  document.getElementById('track-tags').value = Array.isArray(track.tags) ? track.tags.join(', ') : (track.tags || '');
  document.getElementById('track-emoji').value = track.coverEmoji || '';

  const formTitle = document.getElementById('form-card-title');
  if (formTitle) formTitle.textContent = `✏️ تعديل: ${track.title}`;
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
  const submitBtn = document.getElementById('add-track-submit');
  if (submitBtn) submitBtn.textContent = '💾 حفظ التعديلات ونشرها';

  // Scroll to form smoothly
  document.getElementById('add-track-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showAdminToast(`📝 تم تحميل بيانات الزفة "${track.title}" في النموذج`, 'info');
}

function resetTrackForm() {
  document.getElementById('track-edit-id').value = '';
  document.getElementById('add-track-form')?.reset();
  document.getElementById('track-price').value = '249';
  document.getElementById('track-duration').value = '4:15';

  const formTitle = document.getElementById('form-card-title');
  if (formTitle) formTitle.textContent = '➕ إضافة زفة أو أغنية جديدة';
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const submitBtn = document.getElementById('add-track-submit');
  if (submitBtn) submitBtn.textContent = '✨ حفظ الزفة ونشرها فوراً';
}

function deleteTrack(trackId) {
  if (!window.TracksStore) return;
  const track = TracksStore.getTrackById(trackId);
  if (!track) return;

  if (confirm(`هل أنت متأكد من حذف زفة "${track.title}" من المكتبة؟`)) {
    if (currentPlayingTrackId === trackId && window.AudioEngine) {
      AudioEngine.stop();
      currentPlayingTrackId = null;
    }
    TracksStore.deleteTrack(trackId);
    renderAdminLibrary(adminActiveLibFilter);
    showAdminToast(`🗑️ تم حذف زفة "${track.title}" من المكتبة`, 'success');
  }
}

function handleResetLibrary() {
  if (confirm('هل تريد استعادة جميع المسارات الافتراضية الرسمية وحذف التعديلات المخصصة؟')) {
    if (window.AudioEngine) AudioEngine.stop();
    currentPlayingTrackId = null;
    TracksStore.resetToDefaults();
    renderAdminLibrary(adminActiveLibFilter);
    showAdminToast('🔄 تم استعادة المكتبة الافتراضية بنجاح', 'success');
  }
}

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      TracksStore.importJSON(e.target.result);
      renderAdminLibrary(adminActiveLibFilter);
      showAdminToast('📥 تم استيراد المكتبة بنجاح وتحديث المسارات!', 'success');
    } catch (err) {
      showAdminToast('❌ تعذر استيراد الملف: تأكد من صحة تنسيق JSON', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ══════════════════════════════════════════════════════════
   LIVE CLOCK
   ══════════════════════════════════════════════════════════ */

function startLiveClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;

  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  update();
  setInterval(update, 1000);
}

/* ══════════════════════════════════════════════════════════
   STATS ANIMATION
   ══════════════════════════════════════════════════════════ */

function animateStats() {
  const revenueEl = document.getElementById('stat-revenue');
  if (revenueEl) {
    const orders = adminState.orders;
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.total || 0), 0);
    const duration = 1000;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * totalRevenue);
      revenueEl.textContent = current.toLocaleString('ar-SA') + ' ر.س';
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* ══════════════════════════════════════════════════════════
   ADMIN TOAST
   ══════════════════════════════════════════════════════════ */

function showAdminToast(message, type = 'info') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: '💫' };
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = `${icons[type] || '💫'} ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease reverse both';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ══════════════════════════════════════════════════════════
   REFRESH ORDERS (Polling)
   ══════════════════════════════════════════════════════════ */

setInterval(() => {
  loadOrders();
  renderOrdersTable();
  renderStats();
}, 30000);

/* Expose for HTML */
window.updateOrderStatus = updateOrderStatus;
window.copyOrderDetails = copyOrderDetails;
window.sendWhatsAppUpdate = sendWhatsAppUpdate;
window.openInAIWorkstation = openInAIWorkstation;
window.switchTab = switchTab;
window.showAdminToast = showAdminToast;
window.filterAdminLibrary = filterAdminLibrary;
window.previewTrack = previewTrack;
window.editTrack = editTrack;
window.deleteTrack = deleteTrack;
window.handleSaveTrackForm = handleSaveTrackForm;
window.resetTrackForm = resetTrackForm;
window.handleResetLibrary = handleResetLibrary;
window.handleImportJSON = handleImportJSON;

