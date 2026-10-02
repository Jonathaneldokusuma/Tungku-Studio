import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell, Box, BriefcaseBusiness, CalendarDays, ChevronDown, CircleDollarSign,
  FileText, Folder, Grid2X2, HandCoins, LayoutDashboard, LogOut, MoreVertical,
  Package, Plus, ReceiptText, Search, Settings, SlidersHorizontal, Table2, Users,
} from 'lucide-react';
import './styles.css';

const menuSections = [
  { title: 'UTAMA', items: [{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    title: 'OPERASIONAL',
    items: [
      { key: 'booking', label: 'Booking', icon: CalendarDays },
      { key: 'quotation', label: 'Quotation', icon: HandCoins, badge: '2' },
      { key: 'project', label: 'Project', icon: Folder, badge: '2' },
      { key: 'inventaris', label: 'Inventaris', icon: Box },
    ],
  },
  { title: 'PENJUALAN', items: [{ key: 'packages', label: 'Manajemen Paket', icon: Package }, { key: 'crm', label: 'CRM', icon: Users }] },
  { title: 'KEUANGAN', items: [{ key: 'invoice', label: 'Invoice', icon: ReceiptText }, { key: 'reports', label: 'Laporan', icon: FileText }, { key: 'expenses', label: 'Pengeluaran', icon: CircleDollarSign }] },
  { title: 'ADMINISTRASI', items: [{ key: 'operator', label: 'Operator', icon: BriefcaseBusiness }, { key: 'settings', label: 'Pengaturan', icon: Settings }] },
];

const dashboardStats = [
  { trend: '7%', trendClass: 'bad', title: 'Pendapatan Bulan Ini', value: 'Rp 1.243.000', shape: 'chart-up' },
  { trend: '5%', trendClass: 'good', title: 'Pengeluaran Bulan Ini', value: 'Rp 321.000', shape: 'chart-down' },
  { trend: '1 Proyek', trendClass: 'neutral', title: 'Pembayaran Belum Lunas', value: 'Rp 649.000', shape: 'invoice' },
  { trend: '4 Lagu', trendClass: 'neutral', title: 'Project Aktif', value: '3', shape: 'folder' },
  { trend: '1 Menunggu Persetujuan Klien', trendClass: 'warning', title: 'Dalam Penawaran', value: '2', shape: 'offer' },
];

const packageStats = [
  { title: 'Semua Paket', value: '6', shape: 'package-box' },
  { title: 'Recording', value: '4', shape: 'mic-box' },
  { title: 'Editing', value: '3', shape: 'cut-box' },
  { title: 'Mixing', value: '3', shape: 'mix-box' },
  { title: 'Mastering', value: '2', shape: 'master-box' },
];

const packages = [
  { title: 'Paket Lengkap A', desc: 'Paket lengkap untuk satu lagu, dari rekaman sampai siap dirilis.', price: 'Rp 970.000', meta: '6 Jam Rekaman | 1 Lagu', tags: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { title: 'Paket Lengkap B', desc: 'Paket lengkap untuk dua lagu, dari rekaman sampai siap dirilis.', price: 'Rp 1.600.000', meta: '12 Jam Rekaman | 2 Lagu', tags: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { title: 'Rekaman Suara', desc: 'Paket untuk rekaman suara saja, cocok ada proses selanjutnya.', price: 'Rp 360.000', meta: '2 Jam Rekaman | 1 Lagu', tags: ['Recording'] },
  { title: 'Rekaman Alat Musik', desc: 'Paket untuk rekaman alat musik saja, tidak ada proses selanjutnya.', price: 'Rp 450.000', meta: '2 Jam Rekaman | 1 Lagu', tags: ['Recording'] },
  { title: 'Hanya Editing', desc: 'Paket ini hanya berisi jasa editing saja.', price: 'Rp 200.000', meta: '0 Jam Rekaman | 1 Lagu', tags: ['Editing'] },
  { title: 'Hanya Mixing', desc: 'Paket ini hanya berisi jasa mixing saja.', price: 'Rp 150.000', meta: '0 Jam Rekaman | 1 Lagu', tags: ['Mixing'] },
];

const schedule = [['Nama Project A', 'John Doe', '13:00 - 16:00'], ['Nama Project B', 'Jane Doe', '13:00 - 16:00'], ['Nama Project C', 'John Doe', '13:00 - 16:00']];
const progress = [['Nama Project D', 'Jane Doe', 'Mastering', 'purple'], ['Nama Project E', 'John Doe', 'Editing', 'green'], ['Nama Project F', 'Jane Doe', 'Mixing', 'yellow']];
const offers = [['Penawaran A', 'Klien X', 'Klien Menawarkan Harga', 'orange'], ['Penawaran B', 'Klien Y', 'Ditolak', 'red'], ['Penawaran C', 'Klien Z', 'Diterima', 'green']];
const activities = [['Klien A meminta revisi lagu Example A pada Projec...', '2 jam lalu'], ['Operator A mengunggah hasil editing lagu Exampl...', '5 hari lalu'], ['Operator C mengunggah hasil recording lagu Exam...', '1 minggu lalu']];

function Sidebar({ activeKey = 'dashboard' }) {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark" /><div><h1>Tungku Studio</h1><p>Enterprise Resource Planning</p></div></div>
      <nav className="nav">
        {menuSections.map((section) => (
          <section className="nav-section" key={section.title}>
            <div className="nav-heading"><span>{section.title}</span><ChevronDown size={11} strokeWidth={2} /></div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return <a className={`nav-item ${activeKey === item.key ? 'active' : ''}`} href={item.key === 'packages' ? '/manager/packages' : '#'} key={item.key}><Icon size={15} strokeWidth={1.9} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</a>;
            })}
          </section>
        ))}
      </nav>
      <div className="account"><div className="avatar" /><div><strong>Hervin C.</strong><span>Manager</span></div><LogOut size={17} strokeWidth={1.8} /></div>
    </aside>
  );
}

function Header({ crumb = 'Utama / Dashboard', title = 'Dashboard' }) {
  return (
    <header className="topbar">
      <div className="crumb"><span>{crumb}</span><strong>{title}</strong></div>
      <div className="top-actions"><button>Buat Project</button><label className="search"><Search size={16} strokeWidth={1.7} /><input placeholder="Cari project, klien, operator..." /></label><SlidersHorizontal size={20} strokeWidth={1.7} /><Bell size={20} strokeWidth={1.7} /></div>
    </header>
  );
}

function MiniIcon({ type }) {
  return <span className={`mini-icon ${type}`} aria-hidden="true" />;
}

function StatCard({ item }) {
  return <article className="stat-card"><div className={`pill ${item.trendClass}`}>{item.trend}</div><span className="stat-arrow">-&gt;</span><p>{item.title}</p><strong>{item.value}</strong><MiniIcon type={item.shape} /></article>;
}

function PackageStatCard({ item }) {
  return <article className="package-stat-card"><p>{item.title}</p><strong>{item.value}</strong><MiniIcon type={item.shape} /></article>;
}

function FinanceChart() {
  return (
    <section className="panel finance">
      <div className="panel-title"><h2>Laporan Keuangan</h2><div className="legend"><span>Pendapatan</span><span className="expense">Pengeluaran</span><span className="month">September 2026</span></div></div>
      <div className="chart"><div className="y-axis">{[160, 140, 120, 100, 80, 60, 40, 20].map((n) => <span key={n}>{n}</span>)}</div><svg viewBox="0 0 760 230" preserveAspectRatio="none"><path className="grid" d="M0 20H760 M0 49H760 M0 78H760 M0 107H760 M0 136H760 M0 165H760 M0 194H760 M0 223H760" /><polyline className="line income-line" points="0,190 85,184 160,222 235,70 315,155 395,35 475,110 560,48 650,42 760,38" /><polyline className="line expense-line" points="0,178 85,174 160,188 235,145 315,198 395,118 475,132 560,28 650,4 760,14" /></svg><div className="months">{['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OCT', 'NOV', 'DEC'].map((m) => <span key={m}>{m}</span>)}</div></div>
    </section>
  );
}

function PiePanel({ kind }) {
  const isDonut = kind === 'donut';
  const labels = isDonut ? [['Maintenance', '57%', 'red'], ['Pembelian Alat', '32%', 'dark'], ['Operasional', '11%', 'gold']] : [['Paket A', '57%', 'red'], ['Paket B', '32%', 'dark'], ['Paket C', '11%', 'gold']];
  return <section className="panel pie-panel"><div className="panel-title"><h2>{isDonut ? 'Pengeluaran Bulan Ini' : 'Paket Terlaris Bulanan'}</h2><span>-&gt;</span></div><div className={`pie ${isDonut ? 'donut' : ''}`} /><div className="pie-labels">{labels.map(([name, pct, color]) => <div key={name}><span className={color} /><p>{name}</p><strong>{pct}</strong></div>)}</div></section>;
}

function SmallPanel({ title, children }) {
  return <section className="panel small-panel"><div className="panel-title"><h2>{title}</h2><span>-&gt;</span></div>{children}</section>;
}

function Dashboard() {
  return (
    <div className="dashboard-frame">
      <Sidebar activeKey="dashboard" />
      <main className="content">
        <Header />
        <section className="stats">{dashboardStats.map((item) => <StatCard item={item} key={item.title} />)}</section>
        <section className="middle-grid"><FinanceChart /><PiePanel /><PiePanel kind="donut" /></section>
        <section className="bottom-grid">
          <SmallPanel title="Jadwal Rekaman Hari Ini">{schedule.map(([name, client, time]) => <div className="record-row" key={name}><div><strong>{name}</strong><span>{client}</span></div><time>{time}</time></div>)}</SmallPanel>
          <SmallPanel title="Progress Proyek">{progress.map(([name, client, tag, color]) => <div className="record-row" key={name}><div><strong>{name}</strong><span>{client}</span></div><mark className={color}>{tag}</mark></div>)}</SmallPanel>
          <SmallPanel title="Progress Penawaran">{offers.map(([name, client, tag, color]) => <div className="record-row" key={name}><div><strong>{name}</strong><span>{client}</span></div><mark className={color}>{tag}</mark></div>)}</SmallPanel>
          <SmallPanel title="Aktivitas Operator">{activities.map(([text, time]) => <div className="activity" key={text}><strong>{text}</strong><span>{time}</span></div>)}</SmallPanel>
        </section>
      </main>
    </div>
  );
}

function Tag({ name }) {
  return <span className={`package-tag ${name.toLowerCase()}`}>{name}</span>;
}

function PackageCard({ item }) {
  return (
    <article className="package-card">
      <div className="package-card-head"><h2>{item.title}</h2><MoreVertical size={16} strokeWidth={1.8} /></div>
      <p>{item.desc}</p>
      <div className="package-tags">{item.tags.map((tag) => <Tag name={tag} key={tag} />)}</div>
      <div className="package-card-foot"><strong>{item.price}</strong><span>{item.meta}</span></div>
    </article>
  );
}

function PackageManagement() {
  return (
    <div className="dashboard-frame package-page">
      <Sidebar activeKey="packages" />
      <main className="content">
        <Header crumb="Penjualan / Manajemen Paket" title="Manajemen Paket" />
        <section className="package-stats">{packageStats.map((item) => <PackageStatCard item={item} key={item.title} />)}</section>
        <section className="package-toolbar">
          <label className="package-search"><Search size={14} strokeWidth={1.7} /><input placeholder="Cari nama paket..." /></label>
          <div className="view-mode"><span>Mode Lihat:</span><button className="active"><Grid2X2 size={13} /> Kartu</button><button><Table2 size={13} /> Tabel</button></div>
          <button className="add-package"><Plus size={13} /> Buat Paket</button>
        </section>
        <div className="package-filter-row">{['Semua Paket (6)', 'Recording (4)', 'Editing (3)', 'Mixing (3)', 'Mastering (2)'].map((filter, index) => <button className={index === 0 ? 'active' : ''} key={filter}>{filter}</button>)}</div>
        <section className="package-grid">{packages.map((item) => <PackageCard item={item} key={item.title} />)}</section>
        <div className="page-bottom-line" />
      </main>
    </div>
  );
}

function App() {
  return window.location.pathname.includes('/manager/packages') ? <PackageManagement /> : <Dashboard />;
}

createRoot(document.getElementById('root')).render(<App />);
