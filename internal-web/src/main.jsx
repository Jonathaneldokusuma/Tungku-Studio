import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  Box,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Folder,
  HandCoins,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
  WalletCards,
} from 'lucide-react';
import './styles.css';

const menuSections = [
  {
    title: 'UTAMA',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, active: true }],
  },
  {
    title: 'OPERASIONAL',
    items: [
      { label: 'Booking', icon: CalendarDays },
      { label: 'Quotation', icon: HandCoins, badge: '2' },
      { label: 'Project', icon: Folder, badge: '2' },
      { label: 'Inventaris', icon: Box },
    ],
  },
  {
    title: 'PENJUALAN',
    items: [
      { label: 'Manajemen Paket', icon: Package },
      { label: 'CRM', icon: Users },
    ],
  },
  {
    title: 'KEUANGAN',
    items: [
      { label: 'Invoice', icon: ReceiptText },
      { label: 'Laporan', icon: FileText },
      { label: 'Pengeluaran', icon: CircleDollarSign },
    ],
  },
  {
    title: 'ADMINISTRASI',
    items: [
      { label: 'Operator', icon: BriefcaseBusiness },
      { label: 'Pengaturan', icon: Settings },
    ],
  },
];

const stats = [
  { trend: '7%', trendClass: 'bad', title: 'Pendapatan Bulan Ini', value: 'Rp 1.243.000', iconClass: 'green', shape: 'chart-up' },
  { trend: '5%', trendClass: 'good', title: 'Pengeluaran Bulan Ini', value: 'Rp 321.000', iconClass: 'red', shape: 'chart-down' },
  { trend: '1 Proyek', trendClass: 'neutral', title: 'Pembayaran Belum Lunas', value: 'Rp 649.000', iconClass: 'blue', shape: 'invoice' },
  { trend: '4 Lagu', trendClass: 'neutral', title: 'Project Aktif', value: '3', iconClass: 'purple', shape: 'folder' },
  { trend: '1 Menunggu Persetujuan Klien', trendClass: 'warning', title: 'Dalam Penawaran', value: '2', iconClass: 'orange', shape: 'offer' },
];

const schedule = [
  ['Nama Project A', 'John Doe', '13:00 - 16:00'],
  ['Nama Project B', 'Jane Doe', '13:00 - 16:00'],
  ['Nama Project C', 'John Doe', '13:00 - 16:00'],
];

const progress = [
  ['Nama Project D', 'Jane Doe', 'Mastering', 'purple'],
  ['Nama Project E', 'John Doe', 'Editing', 'green'],
  ['Nama Project F', 'Jane Doe', 'Mixing', 'yellow'],
];

const offers = [
  ['Penawaran A', 'Klien X', 'Klien Menawarkan Harga', 'orange'],
  ['Penawaran B', 'Klien Y', 'Ditolak', 'red'],
  ['Penawaran C', 'Klien Z', 'Diterima', 'green'],
];

const activities = [
  ['Klien A meminta revisi lagu Example A pada Projec...', '2 jam lalu'],
  ['Operator A mengunggah hasil editing lagu Exampl...', '5 hari lalu'],
  ['Operator C mengunggah hasil recording lagu Exam...', '1 minggu lalu'],
];

function MiniIcon({ type }) {
  return <span className={`mini-icon ${type}`} aria-hidden="true" />;
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">▰</div>
        <div>
          <h1>Tungku Studio</h1>
          <p>Enterprise Resource Planning</p>
        </div>
      </div>
      <nav className="nav">
        {menuSections.map((section) => (
          <section className="nav-section" key={section.title}>
            <div className="nav-heading">
              <span>{section.title}</span>
              <ChevronDown size={11} strokeWidth={2} />
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <a className={`nav-item ${item.active ? 'active' : ''}`} href="#" key={item.label}>
                  <Icon size={15} strokeWidth={1.9} />
                  <span>{item.label}</span>
                  {item.badge && <em>{item.badge}</em>}
                </a>
              );
            })}
          </section>
        ))}
      </nav>
      <div className="account">
        <div className="avatar" />
        <div>
          <strong>Hervin C.</strong>
          <span>Manager</span>
        </div>
        <LogOut size={17} strokeWidth={1.8} />
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="crumb">
        <span>Utama / Dashboard</span>
        <strong>Dashboard</strong>
      </div>
      <div className="top-actions">
        <button>Buat Project</button>
        <label className="search">
          <Search size={16} strokeWidth={1.7} />
          <input placeholder="Cari project, klien, operator..." />
        </label>
        <SlidersHorizontal size={20} strokeWidth={1.7} />
        <Bell size={20} strokeWidth={1.7} />
      </div>
    </header>
  );
}

function StatCard({ item }) {
  return (
    <article className="stat-card">
      <div className={`pill ${item.trendClass}`}>{item.trend}</div>
      <span className="stat-arrow">➜</span>
      <p>{item.title}</p>
      <strong>{item.value}</strong>
      <MiniIcon type={item.shape} />
    </article>
  );
}

function FinanceChart() {
  return (
    <section className="panel finance">
      <div className="panel-title">
        <h2>Laporan Keuangan</h2>
        <div className="legend">
          <span className="income">Pendapatan</span>
          <span className="expense">Pengeluaran</span>
          <span className="month">September 2026</span>
        </div>
      </div>
      <div className="chart">
        <div className="y-axis">
          {[160, 140, 120, 100, 80, 60, 40, 20].map((n) => <span key={n}>{n}</span>)}
        </div>
        <svg viewBox="0 0 760 230" preserveAspectRatio="none">
          <path className="grid" d="M0 20H760 M0 49H760 M0 78H760 M0 107H760 M0 136H760 M0 165H760 M0 194H760 M0 223H760" />
          <polyline className="line income-line" points="0,190 85,184 160,222 235,70 315,155 395,35 475,110 560,48 650,42 760,38" />
          <polyline className="line expense-line" points="0,178 85,174 160,188 235,145 315,198 395,118 475,132 560,28 650,4 760,14" />
        </svg>
        <div className="months">
          {['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OCT', 'NOV', 'DEC'].map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    </section>
  );
}

function PiePanel({ kind }) {
  const isDonut = kind === 'donut';
  const labels = isDonut
    ? [['Maintenance', '57%', 'red'], ['Pembelian Alat', '32%', 'dark'], ['Operasional', '11%', 'gold']]
    : [['Paket A', '57%', 'red'], ['Paket B', '32%', 'dark'], ['Paket C', '11%', 'gold']];
  return (
    <section className="panel pie-panel">
      <div className="panel-title">
        <h2>{isDonut ? 'Pengeluaran Bulan Ini' : 'Paket Terlaris Bulanan'}</h2>
        <span>➜</span>
      </div>
      <div className={`pie ${isDonut ? 'donut' : ''}`} />
      <div className="pie-labels">
        {labels.map(([name, pct, color]) => (
          <div key={name}>
            <span className={color} />
            <p>{name}</p>
            <strong>{pct}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function SmallPanel({ title, children }) {
  return (
    <section className="panel small-panel">
      <div className="panel-title">
        <h2>{title}</h2>
        <span>➜</span>
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  return (
    <div className="dashboard-frame">
      <Sidebar />
      <main className="content">
        <Header />
        <section className="stats">
          {stats.map((item) => <StatCard item={item} key={item.title} />)}
        </section>
        <section className="middle-grid">
          <FinanceChart />
          <PiePanel />
          <PiePanel kind="donut" />
        </section>
        <section className="bottom-grid">
          <SmallPanel title="Jadwal Rekaman Hari Ini">
            {schedule.map(([name, client, time]) => (
              <div className="record-row" key={name}>
                <div><strong>{name}</strong><span>{client}</span></div>
                <time>{time}</time>
              </div>
            ))}
          </SmallPanel>
          <SmallPanel title="Progress Proyek">
            {progress.map(([name, client, tag, color]) => (
              <div className="record-row" key={name}>
                <div><strong>{name}</strong><span>{client}</span></div>
                <mark className={color}>{tag}</mark>
              </div>
            ))}
          </SmallPanel>
          <SmallPanel title="Progress Penawaran">
            {offers.map(([name, client, tag, color]) => (
              <div className="record-row" key={name}>
                <div><strong>{name}</strong><span>{client}</span></div>
                <mark className={color}>{tag}</mark>
              </div>
            ))}
          </SmallPanel>
          <SmallPanel title="Aktivitas Operator">
            {activities.map(([text, time]) => (
              <div className="activity" key={text}>
                <strong>{text}</strong>
                <span>{time}</span>
              </div>
            ))}
          </SmallPanel>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Dashboard />);

