import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import logo from './assets/logo.svg';
import logoMark from './assets/logo-mark-cropped.png';
import figmaIcons from './assets/figma-icons.svg';

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
          {!isRegister && <div className="auth-row"><label className="remember"><input type="checkbox" defaultChecked />Remember me</label><a href="/register">Forgot Password?</a></div>}
          <button className="auth-submit" type="submit">{isRegister ? 'Sign Up' : 'Login'}</button>
        </form>
        <p className="auth-switch">{isRegister ? 'Already Have Account?' : "Don't Have Account?"} <a href={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign In' : 'Sign Up'}</a></p>
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
  if (path.includes('/register')) return <AuthPage mode="register" />;
  if (path.includes('/dashboard')) return <ClientDashboard />;
  return <AuthPage mode="login" />;
}

createRoot(document.getElementById('root')).render(<App />);
