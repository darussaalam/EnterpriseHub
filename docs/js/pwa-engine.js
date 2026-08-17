/**
 * EnterpriseHub Online PWA Engine for GitHub Pages & Web Client
 */

// Initial Seed Data if LocalStorage is empty
const INITIAL_DATA = {
  currentUser: {
    name: 'Budi Santoso',
    email: 'budi@enterprise.com',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    emp_code: 'EMP-2024-001',
    position: 'Senior Fullstack Engineer',
    department: 'Engineering & IT',
    phone: '081234567890',
    salary: 18500000,
    bank: 'Bank BCA - 8820194821',
    join_date: '2022-03-15'
  },
  locations: [
    { name: 'Head Office - Jakarta Pusat', address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan', lat: -6.225588, lng: 106.808560, radius: 250, active: true },
    { name: 'Branch Office - Surabaya Tech Hub', address: 'Jl. Pemuda No. 45, Genteng, Surabaya', lat: -7.262500, lng: 112.748300, radius: 200, active: true }
  ],
  attendances: [
    { date: new Date().toISOString().split('T')[0], checkIn: '08:45', checkOut: null, status: 'present', photo: null, lat: -6.225588, lng: 106.808560, duration: 0, empName: 'Budi Santoso', empCode: 'EMP-2024-001' },
    { date: '2026-08-16', checkIn: '08:50', checkOut: '17:35', status: 'present', photo: null, lat: -6.225588, lng: 106.808560, duration: 525, empName: 'Budi Santoso', empCode: 'EMP-2024-001' },
    { date: '2026-08-15', checkIn: '08:40', checkOut: '17:30', status: 'present', photo: null, lat: -6.225588, lng: 106.808560, duration: 530, empName: 'Budi Santoso', empCode: 'EMP-2024-001' }
  ],
  leaves: [
    { id: 1, empName: 'Budi Santoso', type: 'annual', start: '2026-08-25', end: '2026-08-28', reason: 'Liburan keluarga tahunan dan urusan keluarga.', status: 'pending', reviewerNote: '' },
    { id: 2, empName: 'Siti Rahmawati', type: 'sick', start: '2026-08-10', end: '2026-08-11', reason: 'Demam tinggi dan istirahat dokter.', status: 'approved', reviewerNote: 'Disetujui. Semoga lekas pulih.' }
  ],
  wfh: [
    { id: 1, empName: 'Budi Santoso', date: '2026-08-20', reason: 'Perbaikan instalasi fiber optic rumah, fokus sprint API backend.', status: 'pending', reviewerNote: '' }
  ],
  tasks: [
    { id: 1, project: 'Enterprise Nexus PWA Revamp', title: 'Implementasi Modul Mobile PWA Check-In GPS & Kamera', desc: 'Integrasi camera selfie dan geolocation geofencing di halaman mobile.', priority: 'urgent', deadline: '2026-08-20', progress: 85, status: 'in_progress', empName: 'Budi Santoso' },
    { id: 2, project: 'Enterprise Nexus PWA Revamp', title: 'Optimasi Service Worker & Offline Cache', desc: 'Pastikan aplikasi dapat dibuka secara instan saat offline.', priority: 'high', deadline: '2026-08-22', progress: 60, status: 'in_progress', empName: 'Budi Santoso' },
    { id: 3, project: 'Enterprise Nexus PWA Revamp', title: 'Redesain UI Dashboard Web Admin', desc: 'Layout responsive Bootstrap 5.', priority: 'medium', deadline: '2026-08-21', progress: 100, status: 'completed', empName: 'Siti Rahmawati' }
  ],
  projects: [
    { id: 1, name: 'Enterprise Nexus PWA Revamp', code: 'PRJ-2024-NX1', client: 'Internal Corporate', budget: 180000000, status: 'in_progress', pm: 'Hendro Pratama', start: '2026-07-01', end: '2026-09-30' },
    { id: 2, name: 'B2B Client Portal & Gateway', code: 'PRJ-2024-GW2', client: 'PT Nusantara Sentosa', budget: 250000000, status: 'in_progress', pm: 'Hendro Pratama', start: '2026-07-15', end: '2026-10-15' }
  ],
  payroll: [
    { id: 1, slipNumber: 'SLIP/2026/07/EMP-001', month: 7, year: 2026, basic: 18500000, allowance: 2775000, overtime: 1200000, deductions: 925000, net: 21550000, status: 'paid', empName: 'Budi Santoso', empCode: 'EMP-2024-001' },
    { id: 2, slipNumber: 'SLIP/2026/07/EMP-002', month: 7, year: 2026, basic: 15000000, allowance: 2250000, overtime: 600000, deductions: 750000, net: 17100000, status: 'paid', empName: 'Siti Rahmawati', empCode: 'EMP-2024-002' }
  ],
  assets: [
    { code: 'AST-MBP-01', name: 'MacBook Pro M2 Max 32GB', cat: 'IT Equipment', price: 38500000, holder: 'Budi Santoso', cond: 'good', loc: 'Desk Engineering A1' },
    { code: 'AST-MON-02', name: 'Dell UltraSharp 27" 4K', cat: 'IT Equipment', price: 8900000, holder: 'Budi Santoso', cond: 'good', loc: 'Desk Engineering A1' },
    { code: 'AST-VEH-01', name: 'Van Toyota HiAce Operasional', cat: 'Vehicles', price: 540000000, holder: 'Gudang / Driver', cond: 'good', loc: 'Basement Parking' }
  ],
  notifications: [
    { id: 1, title: 'Tugas Baru Diberikan', msg: 'Anda telah ditugaskan pada tugas: Implementasi Modul Mobile PWA Check-In GPS & Kamera', time: '10 menit lalu', type: 'task', read: false },
    { id: 2, title: 'Pengumuman Town Hall Perusahaan', msg: 'Town Hall Q3 diadakan Jumat pukul 14:00 WIB di Main Hall & Zoom.', time: '2 jam lalu', type: 'announcement', read: true },
    { id: 3, title: 'Slip Gaji Diterbitkan & Ditransfer', msg: 'Gaji periode Juli 2026 sebesar Rp 21.550.000 telah ditransfer ke rekening BCA Anda.', time: '1 hari lalu', type: 'approval', read: true }
  ]
};

// Load or Initialize Store
function getStore() {
  const local = localStorage.getItem('ENTERPRISE_HUB_DB');
  if (!local) {
    localStorage.setItem('ENTERPRISE_HUB_DB', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  try {
    return JSON.parse(local);
  } catch(e) {
    return INITIAL_DATA;
  }
}

function saveStore(store) {
  localStorage.setItem('ENTERPRISE_HUB_DB', JSON.stringify(store));
}

let store = getStore();
let currentView = 'mobile'; // 'mobile' or 'admin'
let activeMediaStream = null;
let deferredPrompt = null;

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[PWA] Service Worker registered'))
      .catch((err) => console.warn('[PWA] SW warning:', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.remove('d-none');
});

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((res) => {
      deferredPrompt = null;
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.classList.add('d-none');
    });
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Install EnterpriseHub PWA',
      text: 'Di HP Android: Buka menu titik 3 di Chrome lalu pilih "Tambahkan ke Layar Utama" / "Install App".',
      confirmButtonColor: '#2563eb'
    });
  }
}

// Live Clock
setInterval(() => {
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;
  }
}, 1000);

// Role Switching Demo
function switchRole(roleKey) {
  const users = {
    employee: { name: 'Budi Santoso', email: 'budi@enterprise.com', role: 'employee', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', position: 'Senior Fullstack Engineer', department: 'Engineering & IT' },
    admin: { name: 'Super Administrator', email: 'admin@enterprise.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', position: 'Chief Technology Officer', department: 'Executive Management' },
    hr: { name: 'Sarah Wijaya, S.Psi', email: 'hr@enterprise.com', role: 'hr', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', position: 'HR Manager', department: 'Human Resources' },
    manager: { name: 'Hendro Pratama, M.T', email: 'manager@enterprise.com', role: 'manager', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', position: 'Head of Engineering', department: 'Engineering & IT' },
    finance: { name: 'Dewi Anggraini, S.E', email: 'finance@enterprise.com', role: 'finance', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', position: 'Finance & Accounting Lead', department: 'Finance' }
  };

  if (users[roleKey]) {
    store.currentUser = Object.assign(store.currentUser, users[roleKey]);
    saveStore(store);
    
    if (roleKey === 'employee') {
      setView('mobile');
    } else {
      setView('admin');
    }

    Swal.fire({
      icon: 'success',
      title: 'Beralih Akun',
      text: `Masuk sebagai: ${users[roleKey].name} (${roleKey.toUpperCase()})`,
      timer: 1500,
      showConfirmButton: false
    });
  }
}

function setView(view) {
  currentView = view;
  const mobileContainer = document.getElementById('view-mobile-wrapper');
  const adminContainer = document.getElementById('view-admin-wrapper');
  
  if (view === 'mobile') {
    if (mobileContainer) mobileContainer.classList.remove('d-none');
    if (adminContainer) adminContainer.classList.add('d-none');
    renderMobileDashboard();
  } else {
    if (mobileContainer) mobileContainer.classList.add('d-none');
    if (adminContainer) adminContainer.classList.remove('d-none');
    renderAdminDashboard();
  }
}
