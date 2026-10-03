import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import logo from './assets/logo.svg';
import logoMark from './assets/logo-mark-cropped.png';
import figmaIcons from './assets/figma-icons.svg';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './lib/firebase';

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
  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = '/dashboard';
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
          {isRegister && <label>Full Name<input type="text" placeholder="Example text" required /></label>}
          <label>Username<input type="text" placeholder="Example text" required /></label>
          {isRegister && <label>Email<input type="email" placeholder="Example text" required /></label>}
          <label>Password<input type="password" placeholder="Example text" required /></label>
          {isRegister && <label>Confirm Password<input type="password" placeholder="Example text" required /></label>}
          {!isRegister && <div className="auth-row"><button className={`remember ${rememberMe ? 'active' : ''}`} type="button" aria-pressed={rememberMe} onClick={() => setRememberMe((value) => !value)}><span />Remember me</button><a href="/forgot-password">Forgot Password?</a></div>}
          <button className="auth-submit" type="submit">{isRegister ? 'Sign Up' : 'Login'}</button>
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
  return (
    <main className="client-dashboard">
      <header><div className="auth-brand"><img src={logo} alt="" /><div><strong>Tungku Studio</strong><span>Client Portal</span></div></div><a href="/login">Keluar</a></header>
      <section>
        <article><FigmaIcon name="booking" /><span>Booking Aktif</span><strong>2</strong></article>
        <article><FigmaIcon name="project" /><span>Project Berjalan</span><strong>1</strong></article>
        <article><FigmaIcon name="quotation" /><span>Penawaran</span><strong>3</strong></article>
        <article><FigmaIcon name="thumb-up" /><span>Selesai</span><strong>4</strong></article>
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
