import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import logo from './assets/logo.svg';
import logoMark from './assets/logo-mark-cropped.png';
import figmaIcons from './assets/figma-icons.svg';
import heroImage from './assets/studio-dashboard-hero.png';
import userProfile from './assets/image-user-profile.png';
import iconMore from './assets/icon-more.svg';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

function FigmaIcon({ name }) {
  const positions = { mic: [689, 263], cut: [801, 263], mix: [913, 263], master: [1025, 263], booking: [353, 17], quotation: [801, 386], project: [577, 17], 'thumb-up': [353, 509], invoice: [465, 509] };
  const [x, y] = positions[name] || positions.project;
  return <svg className="figma-icon" viewBox="0 0 96 96" aria-hidden="true"><image href={figmaIcons} x={-x} y={-y} width="1139" height="868" /></svg>;
}

function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const [rememberMe, setRememberMe] = React.useState(true);
  const [form, setForm] = React.useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const updateField = (field) => (event) => setForm((value) => ({ ...value, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isRegister) {
        if (form.password !== form.confirmPassword) {
          setError('Password dan confirm password tidak sama.');
          return;
        }
        const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await setDoc(doc(db, 'users', credential.user.uid), { name: form.name, email: form.email, role: 'client' }, { merge: true });
      } else {
        const credential = await signInWithEmailAndPassword(auth, form.email, form.password);
        const profile = await getDoc(doc(db, 'users', credential.user.uid));
        if (profile.exists() && profile.data().role !== 'client') {
          await signOut(auth);
          setError('Akun ini bukan akun client.');
          return;
        }
      }
      window.location.href = '/dashboard';
    } catch (authError) {
      const messages = { 'auth/email-already-in-use': 'Email sudah terdaftar.', 'auth/invalid-credential': 'Email atau password salah.', 'auth/invalid-email': 'Format email tidak valid.', 'auth/weak-password': 'Password minimal 6 karakter.' };
      setError(messages[authError.code] || 'Login gagal. Cek email, password, dan Firebase Authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-logo-panel"><img src={logoMark} alt="Tungku Studio" /></section>
      <section className="auth-card">
        <div className="auth-card-head"><h1>{isRegister ? 'Sign Up' : 'Sign In'}</h1></div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && <label>Full Name<input type="text" placeholder="Nama lengkap" value={form.name} onChange={updateField('name')} required /></label>}
          <label>Email<input type="email" placeholder="client@tungkustudio.com" value={form.email} onChange={updateField('email')} required /></label>
          <label>Password<input type="password" placeholder="Password" value={form.password} onChange={updateField('password')} required /></label>
          {isRegister && <label>Confirm Password<input type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={updateField('confirmPassword')} required /></label>}
          {!isRegister && <div className="auth-row"><button className={`remember ${rememberMe ? 'active' : ''}`} type="button" aria-pressed={rememberMe} onClick={() => setRememberMe((value) => !value)}><span />Remember me</button><a href="/forgot-password">Forgot Password?</a></div>}
          {error && <p className="auth-message error">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Loading...' : isRegister ? 'Sign Up' : 'Login'}</button>
        </form>
        <p className="auth-switch">{isRegister ? 'Already Have Account?' : "Don't Have Account?"} <a href={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign In' : 'Sign Up'}</a></p>
      </section>
    </main>
  );
}

function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    setIsSending(true);
    try {
      await sendPasswordResetEmail(auth, email, { url: `${window.location.origin}/login`, handleCodeInApp: false });
      setStatus('Kode/verifikasi reset sudah dikirim ke email. Cek inbox atau spam Gmail.');
    } catch (resetError) {
      setError(resetError.code === 'auth/user-not-found' ? 'Email belum terdaftar.' : 'Gagal mengirim email verifikasi. Cek email dan konfigurasi Firebase.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-logo-panel"><img src={logoMark} alt="Tungku Studio" /></section>
      <section className="auth-card">
        <div className="auth-card-head"><h1>Reset Password</h1></div>
        <form className="auth-form" onSubmit={handleReset}>
          <label>Email<input type="email" placeholder="contoh@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          {status && <p className="auth-message success">{status}</p>}
          {error && <p className="auth-message error">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send Verification'}</button>
        </form>
        <p className="auth-switch">Remember password? <a href="/login">Sign In</a></p>
      </section>
    </main>
  );
}

function ClientPortal() {
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [stats, setStats] = React.useState({ bookings: 0, projects: 0, offers: 0, done: 0 });
  const [projects, setProjects] = React.useState([]);
  const [packages, setPackages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const currentPath = window.location.pathname;

  React.useEffect(() => {
    let unsubscribers = [];
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribers = [];
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      const profileSnapshot = await getDoc(doc(db, 'users', currentUser.uid));
      const profileData = profileSnapshot.exists() ? profileSnapshot.data() : null;
      if (profileData?.role && profileData.role !== 'client') {
        await signOut(auth);
        window.location.href = '/login';
        return;
      }

      setUser(currentUser);
      setProfile(profileData);
      setIsLoading(false);
      unsubscribers = [
        onSnapshot(query(collection(db, 'bookings'), where('clientId', '==', currentUser.uid)), (snapshot) => {
          setStats((value) => ({ ...value, bookings: snapshot.docs.filter((item) => !['cancelled', 'done', 'completed'].includes(String(item.data().status || '').toLowerCase())).length }));
        }),
        onSnapshot(query(collection(db, 'projects'), where('clientId', '==', currentUser.uid)), (snapshot) => {
          const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
          setProjects(rows);
          setStats((value) => ({ ...value, projects: rows.filter((item) => !isDoneProject(item)).length, done: rows.filter(isDoneProject).length }));
        }),
        onSnapshot(query(collection(db, 'custom_offers'), where('clientId', '==', currentUser.uid)), (snapshot) => {
          setStats((value) => ({ ...value, offers: snapshot.size }));
        }),
        onSnapshot(collection(db, 'packages'), (snapshot) => setPackages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
      ];
    });
    return () => {
      unsubscribeAuth();
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    await signOut(auth);
    window.location.href = '/login';
  };

  const activeProjects = projects.length ? projects : demoProjects;
  const packageItems = packages.length ? packages : demoPackages;
  const displayName = profile?.name || user?.displayName || 'Singha';

  return (
    <main className="client-dashboard">
      <ClientNav user={user} onLogout={handleLogout} currentPath={currentPath} />
      <section className="client-shell">
        {isLoading ? <PageTitle title="Loading..." subtitle="Mengambil data akun client." /> : <ClientRouteContent path={currentPath} displayName={displayName} stats={stats} projects={activeProjects} packages={packageItems} />}
        <footer>(c) 2026 Studio Recording Tungku. All Rights Reserved</footer>
      </section>
    </main>
  );
}

function ClientNav({ user, onLogout, currentPath = '/dashboard' }) {
  const [search, setSearch] = React.useState('');
  const handleSearch = (event) => {
    event.preventDefault();
    window.location.href = `/projects${search ? `?search=${encodeURIComponent(search)}` : ''}`;
  };

  return (
    <header className="client-nav">
      <a className="client-nav-brand" href="/dashboard"><img src={logo} alt="" /><span>Tungku Studio</span></a>
      <nav>
        <a className={isActivePath(currentPath, '/dashboard') ? 'active' : ''} href="/dashboard">Dashboard</a>
        <a className={isActivePath(currentPath, '/booking') ? 'active' : ''} href="/booking">Jadwal Booking</a>
        <a className={isActivePath(currentPath, '/projects') ? 'active' : ''} href="/projects">Project <b>2</b></a>
        <a className={isActivePath(currentPath, '/transactions') ? 'active' : ''} href="/transactions">Transaksi</a>
      </nav>
      <div className="client-nav-actions">
        <a className="create-project" href="/projects/new">Buat Proyek</a>
        <form className="client-search" onSubmit={handleSearch}><FigmaIcon name="project" /><input placeholder="Cari project..." value={search} onChange={(event) => setSearch(event.target.value)} /></form>
        <a className="nav-icon-link" href="/transactions" aria-label="Transaksi"><FigmaIcon name="quotation" /></a>
        <img src={userProfile} alt={user?.email || 'User'} />
        <a className="logout-link" href="/login" onClick={onLogout}>Keluar</a>
      </div>
    </header>
  );
}

function ClientRouteContent({ path, displayName, stats, projects, packages }) {
  if (path.includes('/booking')) return <BookingPage />;
  if (path.includes('/transactions')) return <TransactionsPage />;
  if (path.includes('/projects/new')) return <CreateProjectPage packages={packages} />;
  if (path.includes('/packages')) return <PackagesPage packages={packages} />;
  if (path.includes('/projects/')) return <ProjectDetailPage project={projects.find((item) => path.includes(item.id)) || projects[0]} />;
  if (path.includes('/projects')) return <ProjectsPage projects={projects} />;
  return <DashboardHome displayName={displayName} stats={stats} projects={projects} packages={packages} />;
}

function DashboardHome({ displayName, stats, projects, packages }) {
  const featuredProject = projects[0] || demoProjects[0];
  const sideProjects = projects.slice(1, 3);
  return (
    <>
      <div className="client-greeting"><h1>Halo {displayName}!</h1><p>Selamat Datang di <strong>Tungku Studio</strong></p></div>
      <div className="client-stats">
        <StatCard title="Total Project Anda" value={Math.max(stats.projects + stats.done, projects.length)} icon="project" tone="red" />
        <StatCard title="Project Dalam Pengerjaan" value={stats.projects || projects.filter((item) => !isDoneProject(item)).length} icon="mix" tone="green" />
        <StatCard title="Project Selesai" value={stats.done || projects.filter(isDoneProject).length} icon="booking" tone="gold" />
        <StatCard title="Total Pembayaran Belum Lunas" value="Rp 1.500.000" icon="invoice" tone="pink" />
      </div>
      <div className="project-showcase"><ProjectHero project={featuredProject} large /><div className="project-side-list">{sideProjects.map((project) => <ProjectHero key={project.id || project.name} project={project} />)}</div></div>
      <div className="package-head"><h2>Paket Tersedia</h2><a href="/packages">Lihat lainnya</a></div>
      <div className="package-grid">{packages.slice(0, 4).map((item) => <PackageCard key={item.id || item.name} item={item} />)}</div>
    </>
  );
}

function StatCard({ title, value, icon, tone }) {
  return <article className={`client-stat ${tone}`}><div><span>{title}</span><strong>{value}</strong></div><span className="stat-icon"><FigmaIcon name={icon} /></span></article>;
}

function ProjectHero({ project, large = false }) {
  const progress = clampPercent(project.progress ?? 68);
  const tracks = project.tracks || ['Vokal Utama', 'Gitar', 'Drum', 'Bass', 'Backing Vocal'];
  return (
    <article className={`project-hero ${large ? 'large' : ''}`}>
      <img src={heroImage} alt="" />
      <div className="project-hero-overlay">
        <div className="project-hero-top"><div><h2>{project.name || project.title}</h2><span>{project.date || '26 September 2026'}</span></div><mark><FigmaIcon name={project.stage === 'Mixing' ? 'mix' : 'booking'} />{project.stage || 'Selesai'}</mark></div>
        <div className="project-progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="project-tracks">{tracks.map((track, index) => <span key={`${track}-${index}`}>Track {index + 1}<b>{track}</b></span>)}<a href={`/projects/${project.id || 'detail'}`}>Lihat Progress</a></div>
      </div>
    </article>
  );
}

function BookingPage() {
  const calendarDays = [
    '30', '31', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26',
    '27', '28', '29', '30', '1', '2', '3',
  ];
  return (
    <section className="booking-extension-page">
      <aside className="selected-project-card">
        <div className="selected-head"><span>Project Terpilih</span><mark><FigmaIcon name="cut" />Eligible</mark></div>
        <h2>Nama Project A</h2>
        <p>Satria Putra Kurniawan</p>
        <BookingInfo icon="booking" title="Jadwal Rekaman" text="Kamis, 24 September 2026 • 13:00 - 16:00 WIB" />
        <BookingInfo icon="mix" title="Status Booking" text="Sudah terjadwal dan siap diperpanjang jika slot tersedia" />
        <BookingInfo icon="quotation" title="Perpanjangan" text="Pilih slot tambahan di bawah untuk melihat biaya tambahan sebelum konfirmasi." />
        <BookingInfo icon="invoice" title="Biaya Tambahan" text="Biaya perpanjangan akan muncul setelah slot dipilih dan transaksi." />
      </aside>

      <main className="extension-main">
        <div className="extension-title">
          <div><h1>Kalender Perpanjangan</h1><p>Pilih slot tambahan untuk melihat ketersediaan dan biaya perpanjangan.</p></div>
          <div className="slot-legend"><span>Slot Tersedia</span><span>Slot Terisi</span><span>Hari Ini</span></div>
        </div>

        <article className="extension-calendar">
          <div className="calendar-toolbar"><button type="button"><FigmaIcon name="booking" />September 2026</button><button type="button">2026</button></div>
          <div className="calendar-week">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="extension-date-grid">
            {calendarDays.map((day, index) => <button type="button" key={`${day}-${index}`} className={day === '21' ? 'dark' : ['24', '25'].includes(day) ? 'picked' : ['30', '31', '1', '2', '3'].includes(day) && index > 27 ? 'muted' : ''}>{day}</button>)}
          </div>
        </article>

        <article className="extension-detail">
          <h2>Detail Perpanjangan</h2>
          <p>Slot yang dipilih: Kamis, 24 September 2026 • 16:00 - 18:00 WIB</p>
          <ExtensionRow icon="booking" title="Slot Tersedia" text="Slot ini dapat dipilih untuk perpanjangan dan tidak bentrok dengan jadwal lain." />
          <ExtensionRow icon="invoice" title="Biaya Tambahan" text="Rp 480.000 untuk 2 jam tambahan, terhitung dari slot yang dipilih." />
          <ExtensionRow icon="quotation" title="Konsekuensi Pembayaran" text="Pembayaran perpanjangan harus diselesaikan sebelum slot ditambahkan ke jadwal project." />
          <div className="extension-summary"><strong>Ringkasan Sebelum Konfirmasi</strong><span>• Slot tersedia dan tidak bentrok dengan jadwal lain.</span><span>• Biaya tambahan Rp 480.000 sudah terhitung untuk 2 jam perpanjangan.</span><span>• Pembayaran harus diselesaikan sebelum perubahan disimpan.</span></div>
          <div className="extension-actions"><button type="button">Batal</button><button type="button">Konfirmasi Perpanjangan</button></div>
          <div className="extension-warning"><strong>Tidak Ada Slot Tersedia</strong><span>Jika tidak ada slot yang tersedia, klien dapat memilih hari lain atau membatalkan permintaan perpanjangan.</span></div>
        </article>
      </main>
    </section>
  );
}

function BookingInfo({ icon, title, text }) {
  return <div className="booking-info"><FigmaIcon name={icon} /><div><strong>{title}</strong><span>{text}</span></div></div>;
}

function ExtensionRow({ icon, title, text }) {
  return <div className="extension-row"><FigmaIcon name={icon} /><div><strong>{title}</strong><span>{text}</span></div></div>;
}

function ProjectsPage({ projects }) {
  return <section className="client-panel-page"><PageTitle title="Project" subtitle="Semua progress lagu yang sedang dikerjakan Tungku Studio." /><div className="project-list">{projects.map((project) => <ProjectHero key={project.id || project.name} project={project} />)}</div></section>;
}

function ProjectDetailPage({ project = demoProjects[0] }) {
  return <section className="client-panel-page"><PageTitle title={project.name || project.title} subtitle="Detail progress dan link file project." /><ProjectHero project={project} large /><div className="detail-grid"><InfoTile label="Tahap" value={project.stage || 'Mixing'} /><InfoTile label="Progress" value={`${clampPercent(project.progress ?? 68)}%`} /><InfoTile label="Folder Google Drive" value={project.driveFolderUrl || 'Link belum tersedia'} /><InfoTile label="Deadline" value={project.deadline || '26 September 2026'} /></div></section>;
}

function TransactionsPage() {
  return <section className="client-panel-page"><PageTitle title="Transaksi" subtitle="Status invoice, tagihan, dan bukti pembayaran." /><div className="transaction-list">{demoTransactions.map((item) => <article key={item.invoice}><div><strong>{item.invoice}</strong><span>{item.package}</span></div><b>{item.amount}</b><mark className={item.status === 'Lunas' ? 'paid' : ''}>{item.status}</mark></article>)}</div></section>;
}

function CreateProjectPage({ packages }) {
  const [selected, setSelected] = React.useState(packages[0]?.name || demoPackages[0].name);
  return (
    <section className="client-panel-page">
      <PageTitle title="Buat Proyek" subtitle="Pilih paket, isi brief, lalu manager Tungku akan follow up." />
      <div className="create-project-layout">
        <div className="package-grid compact">{packages.slice(0, 4).map((item) => <button className={`select-package ${selected === (item.name || item.title) ? 'selected' : ''}`} type="button" onClick={() => setSelected(item.name || item.title)} key={item.id || item.name}><PackageCard item={item} /></button>)}</div>
        <form className="project-form" onSubmit={(event) => { event.preventDefault(); window.location.href = '/projects'; }}>
          <label>Nama Project<input placeholder="Contoh: Single Pertama" required /></label>
          <label>Link Referensi Google Drive<input placeholder="https://drive.google.com/..." /></label>
          <label>Catatan<textarea placeholder="Tulis kebutuhan recording/editing/mixing..." /></label>
          <button type="submit">Kirim Project</button>
        </form>
      </div>
    </section>
  );
}

function PackagesPage({ packages }) {
  return <section className="client-panel-page"><PageTitle title="Paket Tersedia" subtitle="Pilih paket studio sesuai kebutuhan produksi musikmu." /><div className="package-grid">{packages.map((item) => <PackageCard key={item.id || item.name} item={item} />)}</div></section>;
}

function PackageCard({ item }) {
  const stages = item.stages || ['Recording', 'Editing', 'Mixing', 'Mastering'];
  return <article className="client-package"><button type="button" aria-label="Menu paket" onClick={() => { window.location.href = '/packages'; }}><img src={iconMore} alt="" /></button><h3>{item.name || item.title}</h3><p>{item.description || 'Paket lengkap untuk satu lagu, dari rekaman sampai siap dirilis.'}</p><div className="package-tags">{stages.map((stage) => <span key={stage}><FigmaIcon name={stageIcon(stage)} />{stage}</span>)}</div><div className="package-price"><strong>{formatRupiah(item.price || item.total || 970000)}</strong><small>{item.duration || '6 Jam Rekaman'} | {item.songs || '1 Lagu'}</small></div></article>;
}

function PageTitle({ title, subtitle }) {
  return <div className="page-title"><h1>{title}</h1><p>{subtitle}</p></div>;
}

function InfoTile({ label, value }) {
  return <article className="info-tile"><span>{label}</span><strong>{value}</strong></article>;
}

function stageIcon(stage) {
  const value = String(stage).toLowerCase();
  if (value.includes('edit')) return 'cut';
  if (value.includes('mix')) return 'mix';
  if (value.includes('master')) return 'master';
  return 'mic';
}

function isDoneProject(project) {
  return ['done', 'completed', 'selesai'].includes(String(project.status || project.stage || '').toLowerCase());
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function formatRupiah(value) {
  if (typeof value === 'string' && value.includes('Rp')) return value;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function isActivePath(currentPath, targetPath) {
  if (targetPath === '/dashboard') return currentPath === '/' || currentPath.includes('/dashboard');
  return currentPath.includes(targetPath);
}

const demoProjects = [
  { id: 'demo-a', name: 'Bintang Kehidupan', date: '26 September 2026', stage: 'Mixing', progress: 28, tracks: ['Bintang Kehidupan', 'Khayal', 'Kesal', 'Putih', 'Terserah'] },
  { id: 'demo-b', name: 'Project A', date: '17 September 2026', stage: 'Selesai', progress: 100, tracks: ['Nama Track', 'Vokal', 'Gitar', 'Bass', 'Drum'] },
  { id: 'demo-c', name: 'Project B', date: '16 September 2026', stage: 'Selesai', progress: 100, tracks: ['Nama Track', 'Vokal', 'Gitar', 'Bass', 'Drum'] },
];

const demoPackages = [
  { name: 'Paket Lengkap A', price: 970000, duration: '6 Jam Rekaman', songs: '1 Lagu', stages: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { name: 'Paket Lengkap B', price: 1600000, duration: '12 Jam Rekaman', songs: '2 Lagu', stages: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { name: 'Rekaman Suara', price: 360000, duration: '2 Jam Rekaman', songs: '1 Lagu', stages: ['Recording'] },
  { name: 'Rekaman Alat Musik', price: 450000, duration: '2 Jam Rekaman', songs: '1 Lagu', stages: ['Recording'] },
];

const demoTransactions = [
  { invoice: 'INV-001', package: 'Paket Lengkap A', amount: 'Rp 970.000', status: 'Belum Lunas' },
  { invoice: 'INV-002', package: 'Rekaman Suara', amount: 'Rp 360.000', status: 'Lunas' },
];

function App() {
  const path = window.location.pathname;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  if (path.includes('/register')) return <AuthPage mode="register" />;
  if (['/dashboard', '/booking', '/projects', '/transactions', '/packages'].some((route) => path.includes(route))) return <ClientPortal />;
  return <AuthPage mode="login" />;
}

createRoot(document.getElementById('root')).render(<App />);
