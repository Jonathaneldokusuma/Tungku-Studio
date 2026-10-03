import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import logo from './assets/logo.svg';
import logoMark from './assets/logo-mark-cropped.png';
import figmaIcons from './assets/figma-icons.svg';
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
  const [stats, setStats] = React.useState({ bookings: 0, projects: 0, offers: 0, done: 0 });
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

      const profile = await getDoc(doc(db, 'users', currentUser.uid));
      if (profile.exists() && profile.data().role !== 'client') {
        await signOut(auth);
        window.location.href = '/login';
        return;
      }

      setUser(currentUser);
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
    return <main className="client-dashboard"><header><div className="auth-brand"><img src={logo} alt="" /><div><strong>Tungku Studio</strong><span>Client Portal</span></div></div></header></main>;
  }

  return (
    <main className="client-dashboard">
      <header><div className="auth-brand"><img src={logo} alt="" /><div><strong>Tungku Studio</strong><span>{user?.email || 'Client Portal'}</span></div></div><a href="/login" onClick={handleLogout}>Keluar</a></header>
      <section>
        <article><FigmaIcon name="booking" /><span>Booking Aktif</span><strong>{stats.bookings}</strong></article>
        <article><FigmaIcon name="project" /><span>Project Berjalan</span><strong>{stats.projects}</strong></article>
        <article><FigmaIcon name="quotation" /><span>Penawaran</span><strong>{stats.offers}</strong></article>
        <article><FigmaIcon name="thumb-up" /><span>Selesai</span><strong>{stats.done}</strong></article>
      </section>
    </main>
  );
}

function App() {
  const path = window.location.pathname;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  if (path.includes('/register')) return <AuthPage mode="register" />;
  if (path.includes('/dashboard')) return <ClientDashboard />;
  return <AuthPage mode="login" />;
}

createRoot(document.getElementById('root')).render(<App />);
