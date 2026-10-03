import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import logo from './assets/logo.svg';
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
  const [role, setRole] = React.useState('Client');
  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = '/dashboard';
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand"><img src={logo} alt="" /><div><strong>Tungku Studio</strong><span>Client Portal</span></div></div>
        <div className="auth-copy">
          <span>{isRegister ? 'Mulai Project' : 'Selamat Datang'}</span>
          <h1>{isRegister ? 'Buat akun untuk booking studio.' : 'Masuk untuk pantau project musikmu.'}</h1>
          <p>{isRegister ? 'Daftar sebagai client, pilih paket, booking jadwal, dan ikuti proses produksi dari recording sampai mastering.' : 'Cek jadwal booking, status penawaran, invoice, dan progress lagu dalam satu tempat.'}</p>
        </div>
        <div className="auth-preview">
          {[
            ['Recording', 'mic'],
            ['Editing', 'cut'],
            ['Mixing', 'mix'],
            ['Mastering', 'master'],
          ].map(([label, icon]) => <article key={label}><FigmaIcon name={icon} /><span>{label}</span></article>)}
        </div>
      </section>
      <section className="auth-card">
        <div className="auth-card-head">
          <span>{isRegister ? 'Register User' : 'Login User'}</span>
          <h2>{isRegister ? 'Daftar Akun' : 'Masuk Akun'}</h2>
          <p>{isRegister ? 'Lengkapi data untuk membuat akun client.' : 'Gunakan email dan password yang sudah terdaftar.'}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && <label>Nama Lengkap<input type="text" placeholder="Nama lengkap" required /></label>}
          <label>Email<input type="email" placeholder="contoh@gmail.com" required /></label>
          {isRegister && <label>No. Telepon<input type="tel" placeholder="+62" required /></label>}
          <label>Password<input type="password" placeholder="Password" required /></label>
          {isRegister && <label>Konfirmasi Password<input type="password" placeholder="Ulangi password" required /></label>}
          <div className="auth-role">{['Client', 'Manager'].map((item) => <button className={role === item ? 'active' : ''} type="button" onClick={() => setRole(item)} key={item}>{item}</button>)}</div>
          {!isRegister && <a className="auth-forgot" href="/register">Lupa password?</a>}
          <button className="auth-submit" type="submit">{isRegister ? 'Daftar' : 'Masuk'}</button>
        </form>
        <p className="auth-switch">{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} <a href={isRegister ? '/login' : '/register'}>{isRegister ? 'Masuk' : 'Daftar'}</a></p>
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
