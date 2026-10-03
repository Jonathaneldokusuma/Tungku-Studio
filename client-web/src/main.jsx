import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import logo from './assets/logo.svg';
import logoMark from './assets/logo-mark-cropped.png';
import figmaIcons from './assets/figma-icons.svg';
import heroImage from './assets/rectangle-1.png';
import userProfile from './assets/image-user-profile.png';
import iconMore from './assets/icon-more.svg';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

function FigmaIcon({ name }) {
  const positions = {
    mic: [689, 263],
    cut: [801, 263],
    mix: [913, 263],
    master: [1025, 263],
    booking: [353, 17],
    quotation: [801, 386],
    project: [577, 17],
    'thumb-up': [353, 509],
    invoice: [465, 509],
  };
  const [x, y] = positions[name] || positions.project;
  return <svg className="figma-icon" viewBox="0 0 96 96" aria-hidden="true"><image href={figmaIcons} x={-x} y={-y} width="1139" height="868" /></svg>;
}

function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const [rememberMe, setRememberMe] = React.useState(true);
  const [form, setForm] = React.useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateField = (field) => (event) => {
    setForm((value) => ({ ...value, [field]: event.target.value }));
  };

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
        await setDoc(doc(db, 'users', credential.user.uid), {
          name: form.name,
          email: form.email,
          role: 'client',
        }, { merge: true });
      } else {
        const credential = await signInWithEmailAndPassword(auth, form.email, form.password);
        const userProfile = await getDoc(doc(db, 'users', credential.user.uid));

        if (userProfile.exists() && userProfile.data().role !== 'client') {
          await signOut(auth);
          setError('Akun ini bukan akun client.');
          return;
        }
      }

      window.location.href = '/dashboard';
    } catch (authError) {
      const messages = {
        'auth/email-already-in-use': 'Email sudah terdaftar.',
        'auth/invalid-credential': 'Email atau password salah.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/weak-password': 'Password minimal 6 karakter.',
      };
      setError(messages[authError.code] || 'Login gagal. Cek email, password, dan Firebase Authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-logo-panel">
        <img src={logoMark} alt="Tungku Studio" />
      </section>
      <section className="auth-card">
        <div className="auth-card-head">
          <h1>{isRegister ? 'Sign Up' : 'Sign In'}</h1>
        </div>
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
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
      setStatus('Kode/verifikasi reset sudah dikirim ke email. Cek inbox atau spam Gmail.');
    } catch (resetError) {
      setError(resetError.code === 'auth/user-not-found' ? 'Email belum terdaftar.' : 'Gagal mengirim email verifikasi. Cek email dan konfigurasi Firebase.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-logo-panel">
        <img src={logoMark} alt="Tungku Studio" />
      </section>
      <section className="auth-card">
        <div className="auth-card-head">
          <h1>Reset Password</h1>
        </div>
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

function ClientDashboard() {
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [stats, setStats] = React.useState({ bookings: 0, projects: 0, offers: 0, done: 0 });
  const [projects, setProjects] = React.useState([]);
  const [packages, setPackages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

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
          setStats((value) => ({
            ...value,
            projects: snapshot.docs.filter((item) => !['done', 'completed', 'selesai'].includes(String(item.data().status || item.data().stage || '').toLowerCase())).length,
            done: snapshot.docs.filter((item) => ['done', 'completed', 'selesai'].includes(String(item.data().status || item.data().stage || '').toLowerCase())).length,
          }));
        }),
        onSnapshot(query(collection(db, 'custom_offers'), where('clientId', '==', currentUser.uid)), (snapshot) => {
          setStats((value) => ({ ...value, offers: snapshot.size }));
        }),
        onSnapshot(query(collection(db, 'projects'), where('clientId', '==', currentUser.uid)), (snapshot) => {
          setProjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        }),
        onSnapshot(collection(db, 'packages'), (snapshot) => {
          setPackages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        }),
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

  if (isLoading) {
    return <main className="client-dashboard"><ClientNav user={user} onLogout={handleLogout} /></main>;
  }

  const displayName = profile?.name || user?.displayName || 'Singha';
  const activeProjects = projects.length ? projects : demoProjects;
  const packageItems = packages.length ? packages : demoPackages;
  const featuredProject = activeProjects[0] || demoProjects[0];
  const sideProjects = activeProjects.slice(1, 3);

  return (
    <main className="client-dashboard">
      <ClientNav user={user} onLogout={handleLogout} />

      <section className="client-shell">
        <div className="client-greeting">
          <h1>Halo {displayName}!</h1>
          <p>Selamat Datang di <strong>Tungku Studio</strong></p>
        </div>

        <div className="client-stats">
          <StatCard title="Total Project Anda" value={Math.max(stats.projects + stats.done, activeProjects.length)} icon="project" tone="red" />
          <StatCard title="Project Dalam Pengerjaan" value={stats.projects || activeProjects.filter((item) => !isDoneProject(item)).length} icon="mix" tone="green" />
          <StatCard title="Project Selesai" value={stats.done || activeProjects.filter(isDoneProject).length} icon="booking" tone="gold" />
          <StatCard title="Total Pembayaran Belum Lunas" value="Rp 1.500.000" icon="invoice" tone="pink" />
        </div>

        <div className="project-showcase">
          <ProjectHero project={featuredProject} large />
          <div className="project-side-list">
            {sideProjects.map((project) => <ProjectHero key={project.id || project.name} project={project} />)}
          </div>
        </div>

        <div className="package-head">
          <h2>Paket Tersedia</h2>
          <a href="/packages">Lihat lainnya</a>
        </div>
        <div className="package-grid">
          {packageItems.slice(0, 4).map((item) => <PackageCard key={item.id || item.name} item={item} />)}
        </div>

        <footer>© 2026 Studio Recording Tungku. All Rights Reserved</footer>
      </section>
    </main>
  );
}

function ClientNav({ user, onLogout }) {
  return (
    <header className="client-nav">
      <a className="client-nav-brand" href="/dashboard"><img src={logo} alt="" /><span>Tungku Studio</span></a>
      <nav>
        <a className="active" href="/dashboard">Dashboard</a>
        <a href="/booking">Jadwal Booking</a>
        <a href="/projects">Project <b>2</b></a>
        <a href="/transactions">Transaksi</a>
      </nav>
      <div className="client-nav-actions">
        <a className="create-project" href="/projects/new">Buat Proyek</a>
        <label><FigmaIcon name="project" /><input placeholder="Cari project..." /></label>
        <FigmaIcon name="quotation" />
        <img src={userProfile} alt={user?.email || 'User'} />
        <a className="logout-link" href="/login" onClick={onLogout}>Keluar</a>
      </div>
    </header>
  );
}

function StatCard({ title, value, icon, tone }) {
  return (
    <article className={`client-stat ${tone}`}>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
      <FigmaIcon name={icon} />
    </article>
  );
}

function ProjectHero({ project, large = false }) {
  const progress = clampPercent(project.progress ?? 68);
  const tracks = project.tracks || ['Track 1', 'Track 2', 'Track 3', '+2'];
  return (
    <article className={`project-hero ${large ? 'large' : ''}`}>
      <img src={heroImage} alt="" />
      <div className="project-hero-overlay">
        <div className="project-hero-top">
          <div><h2>{project.name || project.title}</h2><span>{project.date || '26 September 2026'}</span></div>
          <mark><FigmaIcon name={project.stage === 'Mixing' ? 'mix' : 'booking'} />{project.stage || 'Selesai'}</mark>
        </div>
        <div className="project-progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="project-tracks">
          {tracks.map((track, index) => <span key={`${track}-${index}`}>{index < 3 ? `Track ${index + 1}` : track}<b>{index < 3 ? track : ''}</b></span>)}
          <a href={`/projects/${project.id || 'detail'}`}>Lihat Progress</a>
        </div>
      </div>
    </article>
  );
}

function PackageCard({ item }) {
  const stages = item.stages || ['Recording', 'Editing', 'Mixing', 'Mastering'];
  return (
    <article className="client-package">
      <button type="button" aria-label="Menu paket"><img src={iconMore} alt="" /></button>
      <h3>{item.name || item.title}</h3>
      <p>{item.description || 'Paket lengkap untuk satu lagu, dari rekaman sampai siap dirilis.'}</p>
      <div className="package-tags">
        {stages.map((stage) => <span key={stage}><FigmaIcon name={stageIcon(stage)} />{stage}</span>)}
      </div>
      <div className="package-price">
        <strong>{formatRupiah(item.price || item.total || 970000)}</strong>
        <small>{item.duration || '6 Jam Rekaman'} | {item.songs || '1 Lagu'}</small>
      </div>
    </article>
  );
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

const demoProjects = [
  { id: 'demo-a', name: 'Bintang Kehidupan', date: '26 September 2026', stage: 'Mixing', progress: 28, tracks: ['Bintang Kehidupan', 'Khayal', 'Kesal', '+2'] },
  { id: 'demo-b', name: 'Project A', date: '17 September 2026', stage: 'Selesai', progress: 100, tracks: ['Nama Track', '+2'] },
  { id: 'demo-c', name: 'Project B', date: '16 September 2026', stage: 'Selesai', progress: 100, tracks: ['Nama Track', '+2'] },
];

const demoPackages = [
  { name: 'Paket Lengkap A', price: 970000, duration: '6 Jam Rekaman', songs: '1 Lagu', stages: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { name: 'Paket Lengkap B', price: 1600000, duration: '12 Jam Rekaman', songs: '2 Lagu', stages: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { name: 'Rekaman Suara', price: 360000, duration: '2 Jam Rekaman', songs: '1 Lagu', stages: ['Recording'] },
  { name: 'Rekaman Alat Musik', price: 450000, duration: '2 Jam Rekaman', songs: '1 Lagu', stages: ['Recording'] },
];

function App() {
  const path = window.location.pathname;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  if (path.includes('/register')) return <AuthPage mode="register" />;
  if (path.includes('/dashboard')) return <ClientDashboard />;
  return <AuthPage mode="login" />;
}

createRoot(document.getElementById('root')).render(<App />);
