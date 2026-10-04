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
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
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
  const [payments, setPayments] = React.useState([]);
  const [paymentsError, setPaymentsError] = React.useState('');
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
        onSnapshot(query(collection(db, 'payments'), where('clientId', '==', currentUser.uid)), (snapshot) => {
          setPayments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
          setPaymentsError('');
        }, (error) => setPaymentsError(error.message)),
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
        {isLoading ? <PageTitle title="Loading..." subtitle="Mengambil data akun client." /> : <ClientRouteContent path={currentPath} displayName={displayName} profile={profile} user={user} stats={stats} projects={activeProjects} packages={packageItems} payments={payments} paymentsError={paymentsError} />}
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
        <a className={isActivePath(currentPath, '/packages') ? 'active' : ''} href="/packages">Paket</a>
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

function ClientRouteContent({ path, displayName, profile, user, stats, projects, packages, payments, paymentsError }) {
  if (path.includes('/booking')) return <BookingPage user={user} profile={profile} />;
  if (path.includes('/transactions')) return <TransactionsPage payments={payments} error={paymentsError} />;
  if (path.includes('/projects/new')) return <CreateProjectPage packages={packages} user={user} profile={profile} />;
  if (path.includes('/packages')) return <PackagesPage packages={packages} user={user} profile={profile} />;
  if (path.includes('/projects/')) return <ProjectDetailPage project={projects.find((item) => path.includes(item.id)) || projects[0]} />;
  if (path.includes('/projects')) return <ProjectsPage projects={projects} />;
  return <DashboardHome displayName={displayName} stats={stats} projects={projects} packages={packages} payments={payments} />;
}

function DashboardHome({ displayName, stats, projects, packages, payments }) {
  const featuredProject = projects[0] || demoProjects[0];
  const sideProjects = projects.slice(1, 3);
  const unpaidTotal = payments.filter((item) => !isPaidPayment(item)).reduce((total, item) => total + Number(item.amount || item.total || 0), 0);
  return (
    <>
      <div className="client-greeting"><h1>Halo {displayName}!</h1><p>Selamat Datang di <strong>Tungku Studio</strong></p></div>
      <div className="client-stats">
        <StatCard title="Total Project Anda" value={Math.max(stats.projects + stats.done, projects.length)} icon="project" tone="red" />
        <StatCard title="Project Dalam Pengerjaan" value={stats.projects || projects.filter((item) => !isDoneProject(item)).length} icon="mix" tone="green" />
        <StatCard title="Project Selesai" value={stats.done || projects.filter(isDoneProject).length} icon="booking" tone="gold" />
        <StatCard title="Total Pembayaran Belum Lunas" value={formatRupiah(unpaidTotal)} icon="invoice" tone="pink" />
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

function BookingPage({ user, profile }) {
  const [selectedDay, setSelectedDay] = React.useState('24');
  const [status, setStatus] = React.useState({ loading: false, message: '', error: '' });
  const calendarDays = [
    '30', '31', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26',
    '27', '28', '29', '30', '1', '2', '3',
  ];
  const selectedSlot = `Kamis, ${selectedDay} September 2026 - 16:00 - 18:00 WIB`;
  const handleConfirm = async () => {
    setStatus({ loading: true, message: '', error: '' });
    try {
      await addDoc(collection(db, 'custom_offers'), {
        clientId: user.uid,
        clientName: profile?.name || user.displayName || user.email || 'Client',
        clientEmail: user.email || '',
        packageName: 'Perpanjangan Jadwal',
        type: 'booking_extension',
        requestedSlot: selectedSlot,
        offeredPrice: 480000,
        status: 'pending',
        note: 'Permintaan perpanjangan jadwal dari client portal.',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStatus({ loading: false, message: 'Permintaan perpanjangan terkirim ke manager.', error: '' });
    } catch (error) {
      setStatus({ loading: false, message: '', error: `Gagal kirim perpanjangan: ${error.message}` });
    }
  };
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
            {calendarDays.map((day, index) => {
              const muted = ['30', '31', '1', '2', '3'].includes(day) && index > 27;
              return <button type="button" key={`${day}-${index}`} disabled={muted} onClick={() => setSelectedDay(day)} className={day === '21' ? 'dark' : day === selectedDay ? 'picked' : muted ? 'muted' : ''}>{day}</button>;
            })}
          </div>
        </article>

        <article className="extension-detail">
          <h2>Detail Perpanjangan</h2>
          <p>Slot yang dipilih: {selectedSlot}</p>
          <ExtensionRow icon="booking" title="Slot Tersedia" text="Slot ini dapat dipilih untuk perpanjangan dan tidak bentrok dengan jadwal lain." />
          <ExtensionRow icon="invoice" title="Biaya Tambahan" text="Rp 480.000 untuk 2 jam tambahan, terhitung dari slot yang dipilih." />
          <ExtensionRow icon="quotation" title="Konsekuensi Pembayaran" text="Pembayaran perpanjangan harus diselesaikan sebelum slot ditambahkan ke jadwal project." />
          <div className="extension-summary"><strong>Ringkasan Sebelum Konfirmasi</strong><span>• Slot tersedia dan tidak bentrok dengan jadwal lain.</span><span>• Biaya tambahan Rp 480.000 sudah terhitung untuk 2 jam perpanjangan.</span><span>• Pembayaran harus diselesaikan sebelum perubahan disimpan.</span></div>
          {status.message && <p className="offer-feedback success">{status.message}</p>}
          {status.error && <p className="offer-feedback error">{status.error}</p>}
          <div className="extension-actions"><button type="button" onClick={() => setSelectedDay('24')}>Batal</button><button type="button" disabled={status.loading} onClick={handleConfirm}>{status.loading ? 'Mengirim...' : 'Konfirmasi Perpanjangan'}</button></div>
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

function TransactionsPage({ payments, error }) {
  const [activePaymentId, setActivePaymentId] = React.useState('');
  const detailRef = React.useRef(null);
  const sortedPayments = [...payments].sort((first, second) => getPaymentTime(second) - getPaymentTime(first));
  const unpaidTotal = sortedPayments.filter((item) => !isPaidPayment(item)).reduce((total, item) => total + paymentAmount(item), 0);
  const activePayment = sortedPayments.find((item) => item.id === activePaymentId) || sortedPayments[0];
  const selectPayment = (id) => {
    setActivePaymentId(id);
    window.requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  return (
    <section className="client-panel-page">
      <PageTitle title="Transaksi" subtitle="Invoice dan pembayaran diambil realtime dari Firebase." />
      <div className="transaction-summary">
        <StatCard title="Total Invoice" value={sortedPayments.length} icon="invoice" tone="red" />
        <StatCard title="Belum Lunas" value={sortedPayments.filter((item) => !isPaidPayment(item)).length} icon="quotation" tone="pink" />
        <StatCard title="Nominal Belum Lunas" value={formatRupiah(unpaidTotal)} icon="invoice" tone="gold" />
      </div>
      {error && <p className="offer-feedback error">Gagal mengambil transaksi realtime: {error}</p>}
      {!error && !sortedPayments.length && <div className="empty-state"><FigmaIcon name="invoice" /><h3>Belum ada transaksi</h3><p>Invoice akan muncul otomatis setelah kamu beli paket atau manager membuat tagihan.</p><a href="/packages">Pilih Paket</a></div>}
      {!!sortedPayments.length && (
        <div className="transaction-layout">
          <div className="transaction-list">
            {sortedPayments.map((item, index) => <TransactionRow key={item.id || index} item={item} index={index} active={activePayment?.id === item.id} onSelect={() => selectPayment(item.id)} />)}
          </div>
          {activePayment && <PaymentDetail payment={activePayment} detailRef={detailRef} />}
        </div>
      )}
    </section>
  );
}

function TransactionRow({ item, index, active, onSelect }) {
  const paymentUrl = item.paymentUrl || item.checkoutUrl || item.invoiceUrl || '';
  return (
    <article className={active ? 'active' : ''}>
      <button type="button" onClick={onSelect}>
        <strong>{item.invoice || item.invoiceNumber || `INV-${String(index + 1).padStart(3, '0')}`}</strong>
        <span>{item.packageName || item.package || item.projectName || 'Paket Tungku Studio'}</span>
        <small>{formatDateTime(item.createdAt)}</small>
      </button>
      <b>{formatRupiah(paymentAmount(item))}</b>
      <mark className={isPaidPayment(item) ? 'paid' : paymentLabel(item) === 'Menunggu' ? 'pending' : ''}>{paymentLabel(item)}</mark>
      {paymentUrl ? <a href={paymentUrl} target="_blank" rel="noreferrer">{isPaidPayment(item) ? 'Detail' : 'Bayar'}</a> : <button className="transaction-action" type="button" onClick={onSelect}>{isPaidPayment(item) ? 'Detail' : 'Instruksi'}</button>}
    </article>
  );
}

function PaymentDetail({ payment, detailRef }) {
  const paymentUrl = payment.paymentUrl || payment.checkoutUrl || payment.invoiceUrl || '';
  return (
    <aside className="payment-detail" ref={detailRef} tabIndex="-1">
      <span>Detail Transaksi</span>
      <h3>{payment.invoice || payment.invoiceNumber || 'Invoice Pending'}</h3>
      <dl>
        <dt>Paket</dt><dd>{payment.packageName || payment.package || payment.projectName || 'Paket Tungku Studio'}</dd>
        <dt>Status</dt><dd>{paymentLabel(payment)}</dd>
        <dt>Total</dt><dd>{formatRupiah(paymentAmount(payment))}</dd>
        <dt>Dibuat</dt><dd>{formatDateTime(payment.createdAt)}</dd>
        <dt>Metode</dt><dd>{payment.method || 'Konfirmasi manual manager'}</dd>
      </dl>
      <p>{payment.note || 'Jika belum ada link pembayaran, invoice ini menunggu manager mengirim instruksi pembayaran resmi.'}</p>
      <div className="payment-detail-actions">
        {paymentUrl ? <a href={paymentUrl} target="_blank" rel="noreferrer">Buka Pembayaran</a> : <a href="/packages">Tambah Paket Lagi</a>}
        <button type="button" onClick={() => downloadInvoice(payment)}>Download Invoice</button>
      </div>
    </aside>
  );
}

function CreateProjectPage({ packages, user, profile }) {
  const [selected, setSelected] = React.useState(packages[0]?.name || demoPackages[0].name);
  const [form, setForm] = React.useState({ name: '', driveUrl: '', note: '' });
  const [state, setState] = React.useState({ loading: false, message: '', error: '' });
  const selectedPackage = packages.find((item) => (item.name || item.title) === selected) || demoPackages.find((item) => item.name === selected) || demoPackages[0];
  const updateField = (field) => (event) => setForm((value) => ({ ...value, [field]: event.target.value }));
  const handleCreateProject = async (event) => {
    event.preventDefault();
    setState({ loading: true, message: '', error: '' });
    try {
      await addDoc(collection(db, 'custom_offers'), {
        clientId: user.uid,
        clientName: profile?.name || user.displayName || user.email || 'Client',
        clientEmail: user.email || '',
        projectName: form.name,
        packageName: selected,
        packagePrice: Number(selectedPackage.price || selectedPackage.total || 0),
        driveFolderUrl: form.driveUrl,
        note: form.note,
        stages: selectedPackage.stages || ['Recording', 'Editing', 'Mixing', 'Mastering'],
        status: 'pending',
        type: 'project_request',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setState({ loading: false, message: 'Request project terkirim ke manager. Setelah disetujui akan muncul di halaman Project.', error: '' });
      setForm({ name: '', driveUrl: '', note: '' });
    } catch (error) {
      setState({ loading: false, message: '', error: `Gagal kirim project: ${error.message}` });
    }
  };
  return (
    <section className="client-panel-page">
      <PageTitle title="Buat Proyek" subtitle="Pilih paket, isi brief, lalu manager Tungku akan follow up." />
      <div className="create-project-layout">
        <div className="package-grid compact">{packages.slice(0, 4).map((item) => <button className={`select-package ${selected === (item.name || item.title) ? 'selected' : ''}`} type="button" onClick={() => setSelected(item.name || item.title)} key={item.id || item.name}><PackageCard item={item} showMenu={false} /></button>)}</div>
        <form className="project-form" onSubmit={handleCreateProject}>
          <label>Nama Project<input placeholder="Contoh: Single Pertama" value={form.name} onChange={updateField('name')} required /></label>
          <label>Link Referensi Google Drive<input placeholder="https://drive.google.com/..." value={form.driveUrl} onChange={updateField('driveUrl')} /></label>
          <label>Catatan<textarea placeholder="Tulis kebutuhan recording/editing/mixing..." value={form.note} onChange={updateField('note')} /></label>
          {state.message && <p className="offer-feedback success">{state.message}</p>}
          {state.error && <p className="offer-feedback error">{state.error}</p>}
          <button type="submit" disabled={state.loading}>{state.loading ? 'Mengirim...' : 'Kirim Project'}</button>
        </form>
      </div>
    </section>
  );
}

function PackagesPage({ packages, user, profile }) {
  const readyPackages = [
    { name: 'Paket Lengkap A', price: 970000, duration: '6 Jam Rekaman', songs: '1 Lagu', stages: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
    { name: 'Paket Lengkap B', price: 1840000, duration: '12 Jam Rekaman', songs: '2 Lagu', stages: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
    { name: 'Paket Lengkap C', price: 2710000, duration: '18 Jam Rekaman', songs: '3 Lagu', stages: ['Recording', 'Editing', 'Mixing'] },
  ];
  const packageItems = packages.length ? packages.slice(0, 3) : readyPackages;
  const stagePrices = { Recording: 150000, Editing: 200000, Mixing: 350000, Mastering: 250000 };
  const [selectedStages, setSelectedStages] = React.useState(['Recording', 'Editing', 'Mixing', 'Mastering']);
  const [duration, setDuration] = React.useState(3);
  const [songCount, setSongCount] = React.useState(1);
  const [manualPriceEnabled, setManualPriceEnabled] = React.useState(true);
  const [manualPrice, setManualPrice] = React.useState('Rp 1.250.000');
  const [selectedPackage, setSelectedPackage] = React.useState('');
  const [detailPackage, setDetailPackage] = React.useState(packageItems[0]);
  const [submitState, setSubmitState] = React.useState({ loading: false, message: '', error: '' });
  const [buyState, setBuyState] = React.useState({ loading: false, message: '', error: '' });
  const computedTotal = selectedStages.reduce((total, stage) => {
    const unit = stage === 'Recording' ? duration : songCount;
    return total + (stagePrices[stage] || 0) * Math.max(1, unit);
  }, 0);
  const offeredPrice = manualPriceEnabled ? parseCurrency(manualPrice) : computedTotal;
  const summaryTotal = offeredPrice || computedTotal;
  const toggleStage = (stage) => setSelectedStages((value) => value.includes(stage) ? value.filter((item) => item !== stage) : [...value, stage]);
  const updateNumber = (setter) => (event) => {
    const next = Number(event.target.value.replace(/\D/g, ''));
    setter(Number.isFinite(next) && next > 0 ? Math.min(next, 99) : 1);
  };
  const changeNumber = (setter, delta) => setter((value) => Math.max(1, Math.min(99, Number(value || 1) + delta)));
  const pickReadyPackage = (item) => {
    const name = item.name || item.title;
    const songs = Number.parseInt(String(item.songs || '1'), 10) || 1;
    const hours = Number.parseInt(String(item.duration || '3'), 10) || 3;
    setDetailPackage(item);
    setSelectedPackage(name);
    setSelectedStages(item.stages || ['Recording', 'Editing', 'Mixing', 'Mastering']);
    setSongCount(songs);
    setDuration(Math.max(1, Math.round(hours / songs)));
    setManualPriceEnabled(true);
    setManualPrice(formatRupiah(item.price || item.total || 0));
    setSubmitState({ loading: false, message: `${name} dipilih. Penawaran siap dikirim.`, error: '' });
    setBuyState({ loading: false, message: '', error: '' });
  };
  const handleBuyPackage = async () => {
    const item = detailPackage || packageItems[0];
    const name = item.name || item.title || 'Paket Tungku Studio';
    const price = Number(item.price || item.total || 0);
    setBuyState({ loading: true, message: '', error: '' });
    try {
      const orderRef = await addDoc(collection(db, 'custom_offers'), {
        clientId: user.uid,
        clientName: profile?.name || user.displayName || user.email || 'Client',
        clientEmail: user.email || '',
        projectName: name,
        packageName: name,
        packagePrice: price,
        stages: item.stages || ['Recording', 'Editing', 'Mixing', 'Mastering'],
        duration: item.duration || '6 Jam Rekaman',
        songs: item.songs || '1 Lagu',
        status: 'pending_payment',
        type: 'package_purchase',
        offeredPrice: price,
        note: 'Pembelian paket siap pakai dari client portal.',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'payments'), {
        clientId: user.uid,
        clientName: profile?.name || user.displayName || user.email || 'Client',
        clientEmail: user.email || '',
        orderId: orderRef.id,
        packageName: name,
        amount: price,
        status: 'unpaid',
        method: 'manual_confirmation',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedPackage(name);
      setBuyState({ loading: false, message: 'Order dibuat. Lanjut cek Transaksi untuk pembayaran dan statusnya.', error: '' });
    } catch (error) {
      setBuyState({ loading: false, message: '', error: `Gagal beli paket: ${error.message}` });
    }
  };
  const handleSubmitOffer = async () => {
    if (!selectedStages.length) {
      setSubmitState({ loading: false, message: '', error: 'Pilih minimal satu tahap produksi dulu.' });
      return;
    }
    setSubmitState({ loading: true, message: '', error: '' });
    try {
      await addDoc(collection(db, 'custom_offers'), {
        clientId: user.uid,
        clientName: profile?.name || user.displayName || user.email || 'Client',
        clientEmail: user.email || '',
        packageName: selectedPackage || 'Penawaran Kustom',
        stages: selectedStages,
        durationPerSong: Number(duration),
        songCount: Number(songCount),
        manualPriceEnabled,
        offeredPrice: summaryTotal,
        status: 'pending',
        note: 'Dikirim dari client portal.',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitState({ loading: false, message: 'Penawaran terkirim ke manager. Nanti statusnya bisa dicek di Transaksi/Project.', error: '' });
    } catch (error) {
      setSubmitState({ loading: false, message: '', error: `Gagal kirim penawaran: ${error.message}` });
    }
  };

  return (
    <section className="packages-quote-page">
      <div className="packages-hero">
        <h1>Paket yang Kami Sediakan</h1>
        <p>Pilih paket siap pakai atau buat penawaran kustom untuk project Anda. Setiap langkah sudah jelas agar tim dan manager bisa melanjutkan ke tahap berikutnya tanpa keraguan.</p>
      </div>

      <div className="package-section-title">
        <div><h2>Paket Siap Pakai</h2><p>Pilih paket yang sudah jadi, lalu lanjutkan ke pemilihan slot waktu, nama proyek, dan pembayaran pre-order.</p></div>
        <span>Siap Pakai</span>
      </div>
      <div className="quote-package-grid">{packageItems.map((item) => <button className={`quote-package-choice ${selectedPackage === (item.name || item.title) ? 'selected' : ''}`} type="button" onClick={() => pickReadyPackage(item)} key={item.id || item.name}><PackageCard item={item} showMenu={false} /></button>)}</div>

      <article className="package-detail-panel">
        <div>
          <span>Detail Paket</span>
          <h3>{detailPackage?.name || detailPackage?.title || 'Pilih Paket'}</h3>
          <p>{detailPackage?.description || 'Paket siap pakai untuk memulai project musik. Setelah dibeli, order masuk ke manager dan invoice dibuat otomatis.'}</p>
        </div>
        <dl>
          <dt>Tahap</dt><dd>{(detailPackage?.stages || ['Recording', 'Editing', 'Mixing', 'Mastering']).join(', ')}</dd>
          <dt>Durasi</dt><dd>{detailPackage?.duration || '6 Jam Rekaman'}</dd>
          <dt>Jumlah Lagu</dt><dd>{detailPackage?.songs || '1 Lagu'}</dd>
          <dt>Harga</dt><dd>{formatRupiah(detailPackage?.price || detailPackage?.total || 0)}</dd>
        </dl>
        {buyState.message && <p className="offer-feedback success">{buyState.message}</p>}
        {buyState.error && <p className="offer-feedback error">{buyState.error}</p>}
        <div className="package-detail-actions">
          <button type="button" onClick={() => pickReadyPackage(detailPackage || packageItems[0])}>Masukkan ke Penawaran</button>
          <button type="button" disabled={buyState.loading} onClick={handleBuyPackage}>{buyState.loading ? 'Memproses...' : 'Beli Paket'}</button>
        </div>
      </article>

      <div className="package-section-title custom">
        <div><h2>Penawaran Kustom</h2><p>Buat penawaran sesuai kebutuhan proyek Anda. Tim akan meninjau harga, mengirimkan penawaran, dan melanjutkan ke checkout jika disetujui.</p></div>
        <span>Kustom</span>
      </div>

      <div className="custom-offer-board">
        <article className="offer-builder">
          <h3>Buat Penawaran Kustom</h3>
          <p>Pilih tahap yang dibutuhkan, tentukan durasi rekaman dan jumlah lagu, lalu masukkan harga manual jika diperlukan. Penawaran akan dikirim ke manager untuk ditinjau.</p>
          <div className="offer-stage-grid">
            <OfferStage icon="mic" title="Recording" price="Rp 150.000 / Jam" selected={selectedStages.includes('Recording')} onClick={() => toggleStage('Recording')} />
            <OfferStage icon="cut" title="Editing" price="Rp 200.000 / Lagu" selected={selectedStages.includes('Editing')} onClick={() => toggleStage('Editing')} />
            <OfferStage icon="mix" title="Mixing" price="Rp 350.000 / Lagu" selected={selectedStages.includes('Mixing')} onClick={() => toggleStage('Mixing')} />
            <OfferStage icon="master" title="Mastering" price="Rp 250.000 / Lagu" selected={selectedStages.includes('Mastering')} onClick={() => toggleStage('Mastering')} />
          </div>
          <div className="offer-controls">
            <Stepper label="Durasi Rekaman / Lagu" value={duration} onChange={updateNumber(setDuration)} onDecrease={() => changeNumber(setDuration, -1)} onIncrease={() => changeNumber(setDuration, 1)} />
            <Stepper label="Jumlah Lagu" value={songCount} onChange={updateNumber(setSongCount)} onDecrease={() => changeNumber(setSongCount, -1)} onIncrease={() => changeNumber(setSongCount, 1)} />
          </div>
          <label className="manual-price">Input Harga Tawaran<input value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} disabled={!manualPriceEnabled} /></label>
          <div className="manual-toggle"><span>Atur Harga Manual</span><button className={manualPriceEnabled ? 'active' : ''} type="button" aria-pressed={manualPriceEnabled} onClick={() => setManualPriceEnabled((value) => !value)} /></div>
        </article>

        <article className="offer-summary">
          <h3>Ringkasan Penawaran</h3>
          <p>Total estimasi akan muncul setelah parameter rekaman dan tahap dipilih oleh manager.</p>
          <dl><dt>Tahap Produksi</dt><dd>{selectedStages.length} Tahap</dd><dt>Durasi Rekaman</dt><dd>{duration} Jam / Lagu</dd><dt>Jumlah Lagu</dt><dd>{songCount} Lagu</dd><dt>Status</dt><dd>Menunggu Tinjauan</dd></dl>
          <span>Estimasi Total</span>
          <strong>{formatRupiah(summaryTotal)}</strong>
          <p>Harga akhir akan dikonfirmasi setelah manager meninjau penawaran.</p>
          {submitState.message && <p className="offer-feedback success">{submitState.message}</p>}
          {submitState.error && <p className="offer-feedback error">{submitState.error}</p>}
          <button type="button" disabled={submitState.loading} onClick={handleSubmitOffer}>{submitState.loading ? 'Mengirim...' : 'Kirim Penawaran'}</button>
          <a href="/packages">Batal</a>
        </article>

        <article className="offer-history">
          <div className="history-head"><h3>Riwayat Revisi Penawaran</h3><div><button type="button" /><button type="button" /></div></div>
          {offerHistory.map((item) => <div className={`history-item ${item.active ? 'active' : ''}`} key={item.date}><div><strong>{item.date}</strong><span>{item.note}</span></div><b>{item.price}</b></div>)}
          <a href="/transactions">Lihat Semua Revisi</a>
        </article>
      </div>
    </section>
  );
}

function OfferStage({ icon, title, price, selected, onClick }) {
  return <button className={`offer-stage ${selected ? 'selected' : ''}`} type="button" aria-pressed={selected} onClick={onClick}><FigmaIcon name={icon} /><strong>{title}</strong><span>{price}</span></button>;
}

function Stepper({ label, value, onChange, onDecrease, onIncrease }) {
  return <label className="offer-stepper"><span>{label}</span><div><button type="button" onClick={onDecrease}>-</button><input value={value} onChange={onChange} inputMode="numeric" /><button type="button" onClick={onIncrease}>+</button></div></label>;
}

function PackageCard({ item, showMenu = true }) {
  const stages = item.stages || ['Recording', 'Editing', 'Mixing', 'Mastering'];
  return <article className="client-package">{showMenu && <button type="button" aria-label="Menu paket" onClick={() => { window.location.href = '/packages'; }}><img src={iconMore} alt="" /></button>}<h3>{item.name || item.title}</h3><p>{item.description || 'Paket lengkap untuk satu lagu, dari rekaman sampai siap dirilis.'}</p><div className="package-tags">{stages.map((stage) => <span key={stage}><FigmaIcon name={stageIcon(stage)} />{stage}</span>)}</div><div className="package-price"><strong>{formatRupiah(item.price || item.total || 970000)}</strong><small>{item.duration || '6 Jam Rekaman'} | {item.songs || '1 Lagu'}</small></div></article>;
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

function parseCurrency(value) {
  return Number(String(value).replace(/\D/g, '')) || 0;
}

function isPaidPayment(payment) {
  return ['paid', 'lunas', 'settled', 'success'].includes(String(payment.status || '').toLowerCase());
}

function paymentLabel(payment) {
  const status = String(payment.status || '').toLowerCase();
  if (isPaidPayment(payment)) return 'Lunas';
  if (['pending', 'pending_payment', 'waiting', 'review'].includes(status)) return 'Menunggu';
  if (status === 'failed') return 'Gagal';
  return 'Belum Lunas';
}

function paymentAmount(payment) {
  return Number(payment.amount || payment.total || payment.price || payment.packagePrice || payment.offeredPrice || 0);
}

function getPaymentTime(payment) {
  const value = payment.createdAt || payment.updatedAt || payment.paidAt;
  if (value?.toMillis) return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  return value ? new Date(value).getTime() || 0 : 0;
}

function formatDateTime(value) {
  const time = value?.toDate ? value.toDate() : value?.seconds ? new Date(value.seconds * 1000) : value ? new Date(value) : null;
  if (!time || Number.isNaN(time.getTime())) return 'Baru dibuat';
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(time);
}

function downloadInvoice(payment) {
  const invoiceNumber = payment.invoice || payment.invoiceNumber || `INV-${payment.id || Date.now()}`;
  const rows = [
    ['Invoice', invoiceNumber],
    ['Paket', payment.packageName || payment.package || payment.projectName || 'Paket Tungku Studio'],
    ['Status', paymentLabel(payment)],
    ['Total', formatRupiah(paymentAmount(payment))],
    ['Dibuat', formatDateTime(payment.createdAt)],
    ['Metode', payment.method || 'Konfirmasi manual manager'],
  ];
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(invoiceNumber)}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#231f20}h1{margin:0 0 4px}.brand{color:#df4438;font-weight:700}.meta{margin:0 0 28px;color:#665b58}table{border-collapse:collapse;width:100%;max-width:720px}td{border:1px solid #d6c7c3;padding:12px}td:first-child{width:180px;color:#665b58;background:#fbf8f7}.total{font-size:24px;color:#df4438;font-weight:700}.note{margin-top:24px;color:#665b58;line-height:1.5}@media print{button{display:none}}</style></head><body><p class="brand">Tungku Studio</p><h1>Invoice</h1><p class="meta">${escapeHtml(invoiceNumber)}</p><table>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td class="${label === 'Total' ? 'total' : ''}">${escapeHtml(value)}</td></tr>`).join('')}</table><p class="note">${escapeHtml(payment.note || 'Invoice ini dibuat otomatis dari client portal. Jika belum ada link pembayaran, tunggu instruksi resmi dari manager.')}</p><script>window.print()</script></body></html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${String(invoiceNumber).replace(/[^a-z0-9-]+/gi, '-')}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
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

const offerHistory = [
  { date: 'Hari ini, 14:20', note: 'Client menawar harga', price: 'Rp 1.250.000', active: true },
  { date: '20 Okt 2026', note: 'Client menawar harga - 1 lagu', price: 'Rp 1.400.000' },
  { date: '15 Okt 2026', note: 'Client menawar harga - Penyesuaian', price: 'Rp 1.000.000' },
  { date: '01 Okt 2026', note: 'Client menawar harga - Draft awal', price: 'Rp 970.000' },
];

function App() {
  const path = window.location.pathname;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  if (path.includes('/register')) return <AuthPage mode="register" />;
  if (['/dashboard', '/booking', '/projects', '/transactions', '/packages'].some((route) => path.includes(route))) return <ClientPortal />;
  return <AuthPage mode="login" />;
}

createRoot(document.getElementById('root')).render(<App />);
