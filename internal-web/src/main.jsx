import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import brandLogo from './assets/brand/logo.svg';
import figmaIcons from './assets/icons/figma-icons.svg';

const menuSections = [
  { title: 'UTAMA', items: [{ key: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
  {
    title: 'OPERASIONAL',
    items: [
      { key: 'booking', label: 'Booking', icon: 'booking' },
      { key: 'quotation', label: 'Quotation', icon: 'quotation', badge: '2' },
      { key: 'project', label: 'Project', icon: 'project', badge: '2' },
      { key: 'inventaris', label: 'Inventaris', icon: 'inventaris' },
    ],
  },
  { title: 'PENJUALAN', items: [{ key: 'packages', label: 'Manajemen Paket', icon: 'packages' }, { key: 'crm', label: 'CRM', icon: 'crm' }] },
  { title: 'KEUANGAN', items: [{ key: 'invoice', label: 'Invoice', icon: 'invoice' }, { key: 'reports', label: 'Laporan', icon: 'reports' }, { key: 'expenses', label: 'Pengeluaran', icon: 'expenses' }] },
  { title: 'ADMINISTRASI', items: [{ key: 'operator', label: 'Operator', icon: 'operator' }, { key: 'settings', label: 'Pengaturan', icon: 'settings' }] },
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

const quotations = [
  { title: 'Nama Klien A', status: 'Klien Menawarkan Harga', price: 'Rp 970.000', meta: '6 Jam Rekaman | 1 Lagu', tags: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { title: 'Nama Klien B', status: 'Tungku Menawarkan Harga', price: 'Rp 1.600.000', meta: '12 Jam Rekaman | 2 Lagu', tags: ['Recording', 'Editing', 'Mixing', 'Mastering'] },
  { title: 'Nama Klien C', status: 'Ditolak', price: 'Rp 360.000', meta: '2 Jam Rekaman | 1 Lagu', tags: ['Recording'], tone: 'rejected' },
  { title: 'Nama Klien D', status: 'Diterima', price: 'Rp 450.000', meta: '2 Jam Rekaman | 1 Lagu', tags: ['Recording'], tone: 'accepted' },
];

const quotationStats = [
  { title: 'Semua Penawaran', value: '6', shape: 'quotation' },
  { title: 'Klien Menawarkan Harga', value: '4', shape: 'mic-box' },
  { title: 'Tungku Menawarkan Harga', value: '3', shape: 'cut-box' },
  { title: 'Diterima', value: '3', shape: 'circle-add' },
  { title: 'Ditolak', value: '2', shape: 'delete' },
];

const quotationFilters = ['Semua Penawaran (6)', 'Klien Menawarkan Harga (4)', 'Tungku Menawarkan Harga (3)', 'Diterima (3)', 'Ditolak (2)'];

const projectStats = [
  { title: 'Semua Project', value: '6', shape: 'package-box' },
  { title: 'Recording', value: '4', shape: 'mic-box' },
  { title: 'Editing', value: '3', shape: 'cut-box' },
  { title: 'Mixing', value: '3', shape: 'mix-box' },
  { title: 'Mastering', value: '2', shape: 'master-box' },
];

const projectFilters = ['Semua Project (6)', 'Recording (4)', 'Editing (3)', 'Mixing (3)', 'Mastering (2)'];

const projectItems = [
  { name: 'Project Name', client: 'Client Name', stage: 'Recording', date: '26 Sep 2026', progress: 15, note: 'Recording l...', tags: ['Recording'] },
  { name: 'Project Name', client: 'Client Name', stage: 'Editing', date: '26 Sep 2026', progress: 30, note: 'Editing oleh...', tags: ['Editing'] },
  { name: 'Project Name', client: 'Client Name', stage: 'Mixing', date: '26 Sep 2026', progress: 69, note: 'Mixing oleh...', tags: ['Mixing'] },
  { name: 'Project Name', client: 'Client Name', stage: 'Mastering', date: '26 Sep 2026', progress: 87, note: 'Mastering o...', tags: ['Mastering'] },
  { name: 'Project Name', client: 'Client Name', stage: 'Selesai', date: '26 Sep 2026', progress: 100, note: 'Menunggu...', tags: ['Recording'] },
  { name: 'Project Name', client: 'Client Name', stage: 'Revisi', date: '26 Sep 2026', progress: 99, note: 'Sedang Rev...', tags: ['Recording'] },
];

const productionStages = [
  { name: 'Recording', icon: 'mic', unit: 'Jam', price: 150000 },
  { name: 'Editing', icon: 'cut', unit: 'Lagu', price: 200000 },
  { name: 'Mixing', icon: 'mix', unit: 'Lagu', price: 350000 },
  { name: 'Mastering', icon: 'master', unit: 'Lagu', price: 250000 },
];

const schedule = [['Nama Project A', 'John Doe', '13:00 - 16:00'], ['Nama Project B', 'Jane Doe', '13:00 - 16:00'], ['Nama Project C', 'John Doe', '13:00 - 16:00']];
const progress = [['Nama Project D', 'Jane Doe', 'Mastering', 'purple'], ['Nama Project E', 'John Doe', 'Editing', 'green'], ['Nama Project F', 'Jane Doe', 'Mixing', 'yellow']];
const offers = [['Penawaran A', 'Klien X', 'Klien Menawarkan Harga', 'orange'], ['Penawaran B', 'Klien Y', 'Ditolak', 'red'], ['Penawaran C', 'Klien Z', 'Diterima', 'green']];
const activities = [['Klien A meminta revisi lagu Example A pada Projec...', '2 jam lalu'], ['Operator A mengunggah hasil editing lagu Exampl...', '5 hari lalu'], ['Operator C mengunggah hasil recording lagu Exam...', '1 minggu lalu']];

function FigmaIcon({ name, className = '' }) {
  const positions = {
    dashboard: [17, 17],
    crm: [129, 17],
    packages: [241, 17],
    booking: [353, 17],
    inventaris: [465, 17],
    project: [577, 17],
    invoice: [689, 17],
    expenses: [801, 17],
    reports: [913, 17],
    logout: [129, 140],
    'chart-up': [241, 140],
    'chart-down': [353, 140],
    bell: [577, 140],
    delete: [689, 140],
    'circle-add': [801, 140],
    'chevron-down': [129, 263],
    settings: [241, 263],
    operator: [353, 263],
    add: [465, 263],
    search: [577, 263],
    mic: [689, 263],
    cut: [801, 263],
    mix: [913, 263],
    master: [1025, 263],
    grid: [241, 386],
    table: [129, 386],
    edit: [465, 386],
    quotation: [801, 386],
    sliders: [689, 509],
    'thumb-up': [353, 509],
    'thumb-down': [465, 509],
  };
  const [x, y] = positions[name] || positions.packages;
  return (
    <svg className={`figma-icon ${className}`} viewBox="0 0 96 96" aria-hidden="true">
      <image href={figmaIcons} x={-x} y={-y} width="1139" height="868" />
    </svg>
  );
}

function Sidebar({ activeKey = 'dashboard' }) {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><img src={brandLogo} alt="" /></div><div><h1>Tungku Studio</h1><p>Enterprise Resource Planning</p></div></div>
      <nav className="nav">
        {menuSections.map((section) => (
          <section className="nav-section" key={section.title}>
            <div className="nav-heading"><span>{section.title}</span><FigmaIcon name="chevron-down" className="nav-chevron" /></div>
            {section.items.map((item) => {
              const href = item.key === 'packages' ? '/manager/packages' : item.key === 'booking' ? '/manager/booking' : item.key === 'quotation' ? '/manager/quotation' : item.key === 'project' ? '/manager/project' : '#';
              return <a className={`nav-item ${activeKey === item.key ? 'active' : ''}`} href={href} key={item.key}><FigmaIcon name={item.icon} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</a>;
            })}
          </section>
        ))}
      </nav>
      <div className="account"><div className="avatar" /><div><strong>Hervin C.</strong><span>Manager</span></div><FigmaIcon name="logout" className="account-logout" /></div>
    </aside>
  );
}

function Header({ crumb = 'Utama / Dashboard', title = 'Dashboard', showProjectButton = true }) {
  const [query, setQuery] = React.useState('');
  const [createdCount, setCreatedCount] = React.useState(0);

  return (
    <header className="topbar">
      <div className="crumb"><span>{crumb}</span><strong>{title}</strong></div>
      <div className="top-actions">
        {showProjectButton && <button type="button" onClick={() => setCreatedCount((count) => count + 1)}>{createdCount ? `Draft ${createdCount}` : 'Buat Project'}</button>}
        <label className="search"><FigmaIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari project, klien, operator..." /></label>
        <button className="icon-button" type="button" aria-label="Filter"><FigmaIcon name="sliders" className="top-icon" /></button>
        <button className="icon-button" type="button" aria-label="Notifikasi"><FigmaIcon name="bell" className="top-icon" /></button>
      </div>
    </header>
  );
}

function MiniIcon({ type }) {
  const iconByType = {
    'chart-up': 'chart-up',
    'chart-down': 'chart-down',
    invoice: 'invoice',
    folder: 'project',
    offer: 'quotation',
    'package-box': 'packages',
    'mic-box': 'mic',
    'cut-box': 'cut',
    'mix-box': 'mix',
    'master-box': 'master',
  };

  if (iconByType[type]) {
    return <span className={`mini-icon ${type}`} aria-hidden="true"><FigmaIcon name={iconByType[type]} /></span>;
  }

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
  const [selected, setSelected] = React.useState(false);
  const isDonut = kind === 'donut';
  const labels = isDonut ? [['Maintenance', '57%', 'red'], ['Pembelian Alat', '32%', 'dark'], ['Operasional', '11%', 'gold']] : [['Paket A', '57%', 'red'], ['Paket B', '32%', 'dark'], ['Paket C', '11%', 'gold']];
  return <section className={`panel pie-panel ${selected ? 'is-selected' : ''}`}><div className="panel-title"><h2>{isDonut ? 'Pengeluaran Bulan Ini' : 'Paket Terlaris Bulanan'}</h2><button className="panel-action" type="button" onClick={() => setSelected((value) => !value)}>-&gt;</button></div><div className={`pie ${isDonut ? 'donut' : ''}`} /><div className="pie-labels">{labels.map(([name, pct, color]) => <div key={name}><span className={color} /><p>{name}</p><strong>{pct}</strong></div>)}</div></section>;
}

function SmallPanel({ title, children }) {
  const [expanded, setExpanded] = React.useState(false);
  return <section className={`panel small-panel ${expanded ? 'is-expanded' : ''}`}><div className="panel-title"><h2>{title}</h2><button className="panel-action" type="button" onClick={() => setExpanded((value) => !value)}>-&gt;</button></div>{children}</section>;
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

const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const bookingEvents = [
  { date: '2026-10-03', start: 0, span: 2, color: 'red', time: '10:00 - 12:00', title: 'Nama Project A', client: 'Satria Putra Kurniawan' },
  { date: '2026-10-05', start: 1, span: 3, color: 'yellow', time: '11:00 - 15:00', title: 'Nama Project C', client: 'Jane Doe', avatar: true },
  { date: '2026-10-09', start: 3, span: 2, color: 'red', time: '13:00 - 16:00', title: 'Nama Project A', client: 'Satria Putra Kurniawan' },
  { date: '2026-10-10', start: 0, span: 4, color: 'blue', time: '10:00 - 14:00', title: 'Nama Project B', client: 'Budi Spageti', avatar: true },
  { date: '2026-10-10', start: 5, span: 1, color: 'green', time: '16:00 - 22:00', title: 'Nama Project C', client: 'Jane Doe' },
  { date: '2026-10-17', start: 2, span: 2, color: 'yellow', time: '12:00 - 15:00', title: 'Nama Project D', client: 'John Doe' },
];
const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];

function monthName(date) {
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

function fullDate(date) {
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function parseEventDate(event) {
  const [year, month, day] = event.date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function sameMonth(date, monthDate) {
  return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
}

function buildCalendarDays(viewDate, realToday, bookedDays) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = first.getDay() + daysInMonth > 35 ? 42 : 35;
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const state = date.getMonth() !== month ? 'muted' : date.toDateString() === realToday.toDateString() ? 'today' : bookedDays.has(date.getDate()) ? 'booked' : '';
    return { day: date.getDate(), date, state };
  });
}

function currentWeek(viewDate) {
  const start = new Date(viewDate);
  start.setDate(viewDate.getDate() - viewDate.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function parseMonthInput(value, fallback) {
  const normalized = value.trim().toLowerCase();
  if (/^\d{4}$/.test(normalized)) return new Date(Number(normalized), fallback.getMonth(), Math.min(fallback.getDate(), 28));
  const match = normalized.match(/^([a-z]+|\d{1,2})(?:\s+|[-/])?(\d{4})?$/i);
  if (!match) return fallback;
  const monthText = match[1];
  const parsedMonth = Number(monthText);
  const monthIndex = Number.isNaN(parsedMonth) ? monthNames.indexOf(monthText) : parsedMonth - 1;
  if (monthIndex < 0 || monthIndex > 11) return fallback;
  const year = match[2] ? Number(match[2]) : fallback.getFullYear();
  return new Date(year, monthIndex, Math.min(fallback.getDate(), 28));
}

function MiniCalendar({ viewDate, realToday, events, onMonthChange, onDatePick }) {
  const [monthDraft, setMonthDraft] = React.useState(monthName(viewDate));
  React.useEffect(() => setMonthDraft(monthName(viewDate)), [viewDate]);
  const monthEvents = events.filter((event) => sameMonth(parseEventDate(event), viewDate));
  const bookedDays = new Set(monthEvents.map((event) => parseEventDate(event).getDate()));
  const days = buildCalendarDays(viewDate, realToday, bookedDays);
  const weeklyGroups = Object.values(events.reduce((groups, event) => {
    const date = parseEventDate(event);
    if (!sameMonth(date, viewDate)) return groups;
    const key = fullDate(date);
    groups[key] ||= { date: key, items: [] };
    groups[key].items.push([event.title, event.client, event.time]);
    return groups;
  }, {})).slice(0, 3);

  return (
    <aside className="booking-side panel">
      <div className="mini-calendar-head">
        <input
          aria-label="Ubah bulan"
          value={monthDraft}
          onChange={(event) => setMonthDraft(event.target.value)}
          onBlur={() => onMonthChange(parseMonthInput(monthDraft, viewDate))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onMonthChange(parseMonthInput(monthDraft, viewDate));
              event.currentTarget.blur();
            }
          }}
        />
        <button type="button" onClick={() => onMonthChange(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>&lt;</button>
        <button type="button" onClick={() => onMonthChange(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>&gt;</button>
      </div>
      <div className="mini-weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="mini-days">{days.map((date, index) => <button className={date.state} type="button" onClick={() => onDatePick(date.date)} key={`${date.day}-${index}`}>{date.day}</button>)}</div>
      <div className="booking-list">
        <h2>Jadwal Minggu Ini</h2>
        {weeklyGroups.map((group) => <section key={group.date}><p>{group.date}</p>{group.items.map(([title, client, time]) => <article className="booking-list-card" key={`${title}-${time}`}><strong>{title}</strong><span>{client}</span><mark><FigmaIcon name="booking" />{time}</mark></article>)}</section>)}
      </div>
    </aside>
  );
}

function WeekSchedule({ viewDate, events, onWeekChange }) {
  const week = currentWeek(viewDate);
  const weekEvents = events.filter((event) => week.some((date) => parseEventDate(event).toDateString() === date.toDateString()));
  const weekNumber = Math.ceil(viewDate.getDate() / 7);

  return (
    <section className="booking-board panel">
      <div className="booking-board-title"><h1>{viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h1><div><button type="button" onClick={() => onWeekChange(-7)}>&lt;</button><strong>Minggu {weekNumber}</strong><button type="button" onClick={() => onWeekChange(7)}>&gt;</button></div></div>
      <div className="week-grid">
        <div className="timezone">UTC+7</div>
        {week.map((date) => <div className="week-day-head" key={date.toDateString()}>{date.getDate()} {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>)}
        <div className="time-axis">{timeSlots.map((time) => <span key={time}>{time}</span>)}</div>
        {week.map((date) => <div className="day-column" key={date.toDateString()}>{timeSlots.map((slot) => <div className="empty-slot" key={slot}>Kosong</div>)}{weekEvents.filter((booking) => parseEventDate(booking).toDateString() === date.toDateString()).map((booking) => <article className={`booking-event ${booking.color}`} style={{ '--start': booking.start, '--span': booking.span }} key={`${booking.title}-${booking.time}`}><span>{booking.time}</span><strong>{booking.title}</strong>{booking.avatar && <i />}</article>)}</div>)}
      </div>
    </section>
  );
}

function BookingPage() {
  const realToday = new Date();
  const [viewDate, setViewDate] = React.useState(realToday);
  const changeWeek = (offset) => setViewDate((current) => {
    const next = new Date(current);
    next.setDate(current.getDate() + offset);
    return next;
  });

  return (
    <div className="dashboard-frame booking-page">
      <Sidebar activeKey="booking" />
      <main className="content">
        <Header crumb="Operasional / Booking" title="Booking" />
        <section className="booking-layout"><MiniCalendar viewDate={viewDate} realToday={realToday} events={bookingEvents} onMonthChange={setViewDate} onDatePick={setViewDate} /><WeekSchedule viewDate={viewDate} events={bookingEvents} onWeekChange={changeWeek} /></section>
      </main>
    </div>
  );
}

function Tag({ name }) {
  const iconByTag = {
    Recording: 'mic',
    Editing: 'cut',
    Mixing: 'mix',
    Mastering: 'master',
  };
  return <span className={`package-tag ${name.toLowerCase()}`}><FigmaIcon name={iconByTag[name]} />{name}</span>;
}

function PackageCard({ item, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <article className="package-card">
      <div className="package-card-head">
        <h2>{item.title}</h2>
        <div className="card-menu-wrap">
          <button className="card-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={`Menu ${item.title}`}>⋮</button>
          {menuOpen && <div className="card-menu"><button type="button" onClick={() => onEdit(item)}>Edit</button><button type="button" onClick={() => onDelete(item.title)}>Hapus</button></div>}
        </div>
      </div>
      <p>{item.desc}</p>
      <div className="package-tags">{item.tags.map((tag) => <Tag name={tag} key={tag} />)}</div>
      <div className="package-card-foot"><strong>{item.price}</strong><span>{item.meta}</span></div>
    </article>
  );
}

function packageDuration(meta) {
  const [duration = '', songs = ''] = meta.split('|').map((part) => part.trim());
  return { duration: duration || 'Tidak rekaman', songs: songs || '1 Lagu' };
}

function PackageTable({ items, total, onEdit, onDelete }) {
  return (
    <section className="package-table panel">
      <div className="package-table-head">
        <span>Nama Project</span>
        <span>Deskripsi</span>
        <span>Tahapan</span>
        <span>Durasi Rekaman</span>
        <span>Banyak Lagu</span>
        <span>Harga</span>
        <span>Aksi</span>
      </div>
      {items.map((item) => {
        const { duration, songs } = packageDuration(item.meta);
        return (
          <div className="package-table-row" key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
            <div className="package-tags">{item.tags.map((tag) => <Tag name={tag} key={tag} />)}</div>
            <span>{duration.replace('0 Jam Rekaman', 'Tidak rekaman')}</span>
            <span>{songs}</span>
            <b>{item.price}</b>
            <div className="table-actions">
              <button className="action-add" type="button" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}><FigmaIcon name="edit" /></button>
              <button className="action-delete" type="button" aria-label={`Hapus ${item.title}`} onClick={() => onDelete(item.title)}><FigmaIcon name="delete" /></button>
            </div>
          </div>
        );
      })}
      <div className="package-table-foot"><div className="pager"><button type="button">&lt;</button><span>1</span><button type="button">&gt;</button></div><span>{items.length} dari {total} paket</span></div>
    </section>
  );
}

function QuotationActions({ item, onOffer, onStatusChange, onDelete }) {
  const canClientRespond = item.status === 'Klien Menawarkan Harga';
  return (
    <div className="table-actions quotation-actions">
      <button className="action-offer" type="button" aria-label={`Tawarkan harga ${item.title}`} onClick={() => onOffer(item)}><FigmaIcon name="edit" /></button>
      {canClientRespond && <button className="action-accept" type="button" aria-label={`Setujui ${item.title}`} onClick={() => onStatusChange(item.title, 'Diterima')}><FigmaIcon name="thumb-up" /></button>}
      {canClientRespond && <button className="action-reject" type="button" aria-label={`Tolak ${item.title}`} onClick={() => onStatusChange(item.title, 'Ditolak')}><FigmaIcon name="thumb-down" /></button>}
      {item.status !== 'Klien Menawarkan Harga' && <button className="action-delete" type="button" aria-label={`Hapus ${item.title}`} onClick={() => onDelete(item.title)}><FigmaIcon name="delete" /></button>}
    </div>
  );
}

function QuotationCard({ item, onOffer, onStatusChange, onDelete }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const canClientRespond = item.status === 'Klien Menawarkan Harga';
  return (
    <article className={`quotation-card ${item.tone || ''}`}>
      <div className="package-card-head">
        <h2>{item.title}</h2>
        <div className="card-menu-wrap">
          <button className="card-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={`Menu ${item.title}`}>...</button>
          {menuOpen && <div className="card-menu"><button type="button">Detail</button><button type="button" onClick={() => onOffer(item)}>Tawarkan Harga</button>{canClientRespond && <button type="button" onClick={() => onStatusChange(item.title, 'Diterima')}>Setuju</button>}{canClientRespond && <button type="button" onClick={() => onStatusChange(item.title, 'Ditolak')}>Tolak</button>}<button type="button" onClick={() => onDelete(item.title)}>Hapus</button></div>}
        </div>
      </div>
      <p className="quotation-status">{item.status}</p>
      <div className="package-tags">{item.tags.map((tag) => <Tag name={tag} key={tag} />)}</div>
      <div className="package-card-foot"><strong>{item.price}</strong><span>{item.meta}</span></div>
    </article>
  );
}

function QuotationTable({ items, onOffer, onStatusChange, onDelete }) {
  return (
    <section className="package-table quotation-table panel">
      <div className="package-table-head">
        <span>Nama Klien</span>
        <span>Tahapan</span>
        <span>Durasi Rekaman</span>
        <span>Banyak Lagu</span>
        <span>Harga</span>
        <span>Status</span>
        <span>Aksi</span>
      </div>
      {items.map((item) => {
        const { duration, songs } = packageDuration(item.meta);
        return (
          <div className="package-table-row" key={item.title}>
            <strong>{item.title}</strong>
            <div className="package-tags">{item.tags.map((tag) => <Tag name={tag} key={tag} />)}</div>
            <span>{duration}</span>
            <span>{songs}</span>
            <b>{item.price}</b>
            <span className={`status-pill ${item.tone || 'pending'}`}><FigmaIcon name={item.status === 'Diterima' ? 'thumb-up' : item.status === 'Ditolak' ? 'thumb-down' : 'quotation'} />{item.status}</span>
            <QuotationActions item={item} onOffer={onOffer} onStatusChange={onStatusChange} onDelete={onDelete} />
          </div>
        );
      })}
      <div className="package-table-foot"><div className="pager"><button type="button">&lt;</button><span>1</span><button type="button">&gt;</button></div><span>{items.length} dari {quotations.length} penawaran</span></div>
    </section>
  );
}

function QuotationPage() {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState(quotationFilters[0]);
  const [viewMode, setViewMode] = React.useState('Kartu');
  const [sortMode, setSortMode] = React.useState('A-Z');
  const [quotationToOffer, setQuotationToOffer] = React.useState(null);
  const [quotationToDelete, setQuotationToDelete] = React.useState(null);
  const [quotationItems, setQuotationItems] = React.useState(quotations);
  const updateQuotationStatus = (title, status) => {
    setQuotationItems((items) => items.map((item) => item.title === title ? { ...item, status, tone: status === 'Diterima' ? 'accepted' : 'rejected' } : item));
  };
  const deleteQuotation = (title) => {
    setQuotationItems((items) => items.filter((item) => item.title !== title));
    setQuotationToDelete(null);
  };
  const submitQuotationOffer = (packageOffer) => {
    setQuotationItems((items) => items.map((item) => item.title === packageOffer.originalTitle ? {
      ...item,
      status: 'Tungku Menawarkan Harga',
      price: packageOffer.price,
      meta: packageOffer.meta,
      tags: packageOffer.tags,
      tone: undefined,
    } : item));
    setQuotationToOffer(null);
  };
  const filteredItems = quotationItems
    .filter((item) => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.status.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === quotationFilters[0] || filter.includes(item.status);
      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => (sortMode === 'A-Z' ? a.title.localeCompare(b.title) : quotationItems.indexOf(a) - quotationItems.indexOf(b)));

  return (
    <div className="dashboard-frame package-page quotation-page">
      <Sidebar activeKey="quotation" />
      <main className="content">
        <Header crumb="Operasional / Quotation" title="Quotation" />
        <section className="package-stats">{quotationStats.map((item) => <PackageStatCard item={item} key={item.title} />)}</section>
        <section className="package-toolbar quotation-toolbar panel">
          <label className="package-search"><FigmaIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari penawaran..." /></label>
          <div className="view-mode"><span>Mode Lihat:</span>{['Kartu', 'Tabel'].map((mode) => <button className={viewMode === mode ? 'active' : ''} type="button" onClick={() => setViewMode(mode)} key={mode}><FigmaIcon name={mode === 'Kartu' ? 'grid' : 'table'} />{mode}</button>)}</div>
          <div className="view-mode sort-mode">
            <button className={sortMode === 'A-Z' ? 'active' : ''} type="button" onClick={() => setSortMode('A-Z')}><FigmaIcon name="sliders" />A-Z</button>
            <button className={sortMode === 'Terbaru' ? 'active' : ''} type="button" onClick={() => setSortMode('Terbaru')}><FigmaIcon name="sliders" />Terbaru</button>
          </div>
        </section>
        <div className="package-filter-row quotation-filters">{quotationFilters.map((name) => <button className={filter === name ? 'active' : ''} type="button" onClick={() => setFilter(name)} key={name}>{name}</button>)}</div>
        {viewMode === 'Kartu' ? <section className="quotation-grid">{filteredItems.map((item) => <QuotationCard item={item} onOffer={setQuotationToOffer} onStatusChange={updateQuotationStatus} onDelete={(title) => setQuotationToDelete(quotationItems.find((quote) => quote.title === title))} key={item.title} />)}</section> : <QuotationTable items={filteredItems} onOffer={setQuotationToOffer} onStatusChange={updateQuotationStatus} onDelete={(title) => setQuotationToDelete(quotationItems.find((quote) => quote.title === title))} />}
        <div className="page-bottom-line" />
      </main>
      {quotationToOffer && <CreatePackageModal initialPackage={{ ...quotationToOffer, desc: quotationToOffer.status }} title="Sunting Paket" submitLabel="Buat Paket" onClose={() => setQuotationToOffer(null)} onSubmit={submitQuotationOffer} />}
      {quotationToDelete && <DeletePackageModal item={quotationToDelete} title="Hapus Penawaran?" message={`Penawaran "${quotationToDelete.title}" akan dihapus dari daftar quotation.`} confirmLabel="Hapus Penawaran" onClose={() => setQuotationToDelete(null)} onConfirm={deleteQuotation} />}
    </div>
  );
}

function ProjectAvatar({ tone = 0 }) {
  return <span className={`project-avatar tone-${tone}`} aria-hidden="true" />;
}

function ProjectCard({ item, index, onDetail }) {
  const statusTag = item.stage === 'Selesai' || item.stage === 'Revisi' ? item.stage : item.stage;
  const iconByStatus = { Selesai: 'mic', Revisi: 'mic' };
  return (
    <article className="project-card">
      <header>
        <ProjectAvatar tone={index % 4} />
        <div><h2>{item.name}</h2><p>{item.client}</p></div>
        <span className={`project-stage ${statusTag.toLowerCase()}`}>
          <FigmaIcon name={iconByStatus[statusTag] || { Recording: 'mic', Editing: 'cut', Mixing: 'mix', Mastering: 'master' }[statusTag]} />
          {statusTag}
        </span>
      </header>
      <div className="project-date">{item.date}</div>
      <div className="project-progress-head"><strong>{item.progress}%</strong><span>{item.note}</span></div>
      <div className="project-progress"><span style={{ width: `${item.progress}%` }} /></div>
      <footer>
        <div><span>Operator:</span><div className="operator-stack">{[0, 1, 2, 3].map((tone) => <ProjectAvatar tone={tone} key={tone} />)}</div></div>
        <button type="button" onClick={() => onDetail(item)}>Lihat Detail <span>-&gt;</span></button>
      </footer>
    </article>
  );
}

function ProjectTable({ items, onDetail }) {
  return (
    <section className="project-table panel">
      <div className="project-table-head">
        <span>Nama Project</span>
        <span>Nama Klien</span>
        <span>Tahapan</span>
        <span>Progress</span>
        <span>Operator</span>
        <span>Tanggal</span>
        <span>Aksi</span>
      </div>
      {items.map((item, index) => (
        <div className="project-table-row" key={`${item.stage}-${index}`}>
          <strong>{item.name}</strong>
          <span>{item.client}</span>
          <span className={`project-stage ${item.stage.toLowerCase()}`}><FigmaIcon name={{ Recording: 'mic', Editing: 'cut', Mixing: 'mix', Mastering: 'master', Selesai: 'mic', Revisi: 'mic' }[item.stage]} />{item.stage}</span>
          <div className="table-progress"><b>{item.progress}%</b><mark><i style={{ width: `${item.progress}%` }} /></mark></div>
          <div className="operator-stack">{[0, 1, 2, 3].map((tone) => <ProjectAvatar tone={tone} key={tone} />)}</div>
          <span>{item.date}</span>
          <button className="project-detail-button" type="button" onClick={() => onDetail(item)}>Lihat Detail <span>-&gt;</span></button>
        </div>
      ))}
      <div className="package-table-foot"><div className="pager"><button type="button">&lt;</button><span>1</span><button type="button">&gt;</button></div><span>{items.length} dari {projectItems.length} project</span></div>
    </section>
  );
}

function ProjectDetailModal({ item, onClose }) {
  return (
    <div className="modal-backdrop">
      <section className="project-detail-modal" role="dialog" aria-modal="true" aria-label="Detail Project">
        <button className="modal-close" type="button" onClick={onClose}>x</button>
        <header>
          <ProjectAvatar />
          <div><span>Detail Project</span><h2>{item.name}</h2><p>{item.client}</p></div>
          <span className={`project-stage ${item.stage.toLowerCase()}`}><FigmaIcon name={{ Recording: 'mic', Editing: 'cut', Mixing: 'mix', Mastering: 'master', Selesai: 'mic', Revisi: 'mic' }[item.stage]} />{item.stage}</span>
        </header>
        <div className="detail-progress"><div><strong>{item.progress}%</strong><span>{item.note}</span></div><mark><i style={{ width: `${item.progress}%` }} /></mark></div>
        <div className="detail-grid">
          <article><span>Tanggal</span><strong>{item.date}</strong></article>
          <article><span>Operator</span><div className="operator-stack">{[0, 1, 2, 3].map((tone) => <ProjectAvatar tone={tone} key={tone} />)}</div></article>
          <article><span>Client</span><strong>{item.client}</strong></article>
          <article><span>Status</span><strong>{item.stage}</strong></article>
        </div>
        <footer><button type="button" onClick={onClose}>Tutup</button></footer>
      </section>
    </div>
  );
}

function ProjectPage() {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState(projectFilters[0]);
  const [viewMode, setViewMode] = React.useState('Kartu');
  const [sortMode, setSortMode] = React.useState('A-Z');
  const [selectedProject, setSelectedProject] = React.useState(null);
  const filteredProjects = projectItems
    .filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || item.client.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === projectFilters[0] || item.stage === filter.split(' ')[0];
      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => (sortMode === 'A-Z' ? a.name.localeCompare(b.name) : projectItems.indexOf(a) - projectItems.indexOf(b)));

  return (
    <div className="dashboard-frame package-page project-page">
      <Sidebar activeKey="project" />
      <main className="content">
        <Header crumb="Operasional / Project" title="Project" />
        <section className="package-stats">{projectStats.map((item) => <PackageStatCard item={item} key={item.title} />)}</section>
        <section className="package-toolbar project-toolbar panel">
          <label className="package-search"><FigmaIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari penawaran..." /></label>
          <div className="view-mode"><span>Mode Lihat:</span>{['Kartu', 'Tabel'].map((mode) => <button className={viewMode === mode ? 'active' : ''} type="button" onClick={() => setViewMode(mode)} key={mode}><FigmaIcon name={mode === 'Kartu' ? 'grid' : 'table'} />{mode}</button>)}</div>
          <div className="view-mode sort-mode">
            <button className={sortMode === 'A-Z' ? 'active' : ''} type="button" onClick={() => setSortMode('A-Z')}><FigmaIcon name="sliders" />A-Z</button>
            <button className={sortMode === 'Terbaru' ? 'active' : ''} type="button" onClick={() => setSortMode('Terbaru')}><FigmaIcon name="sliders" />Terbaru</button>
          </div>
        </section>
        <div className="package-filter-row project-filters">{projectFilters.map((name) => <button className={filter === name ? 'active' : ''} type="button" onClick={() => setFilter(name)} key={name}>{name}</button>)}</div>
        {viewMode === 'Kartu' ? <section className="project-grid">{filteredProjects.map((item, index) => <ProjectCard item={item} index={index} onDetail={setSelectedProject} key={`${item.stage}-${index}`} />)}</section> : <ProjectTable items={filteredProjects} onDetail={setSelectedProject} />}
        <div className="page-bottom-line" />
      </main>
      {selectedProject && <ProjectDetailModal item={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}

function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function CreatePackageModal({ initialPackage, onClose, onSubmit, title, submitLabel }) {
  const initialDuration = initialPackage ? packageDuration(initialPackage.meta) : null;
  const [name, setName] = React.useState(initialPackage?.title || '');
  const [description, setDescription] = React.useState(initialPackage?.desc || '');
  const [selectedStages, setSelectedStages] = React.useState(initialPackage?.tags || ['Recording', 'Editing', 'Mixing', 'Mastering']);
  const [recordingHours, setRecordingHours] = React.useState(initialDuration ? Number.parseInt(initialDuration.duration, 10) || 0 : 3);
  const [songCount, setSongCount] = React.useState(initialDuration ? Number.parseInt(initialDuration.songs, 10) || 1 : 1);
  const [manualPrice, setManualPrice] = React.useState(false);
  const [manualPriceValue, setManualPriceValue] = React.useState('');

  const totalPrice = productionStages.reduce((total, stage) => {
    if (!selectedStages.includes(stage.name)) return total;
    const qty = stage.name === 'Recording' ? recordingHours : songCount;
    return total + (stage.price * qty);
  }, 0);
  const finalPrice = manualPrice && Number(manualPriceValue) > 0 ? Number(manualPriceValue) : totalPrice;

  const toggleStage = (stage) => {
    setSelectedStages((stages) => stages.includes(stage) ? stages.filter((item) => item !== stage) : [...stages, stage]);
  };

  const submitPackage = () => {
    const title = name.trim() || `Paket Baru`;
    onSubmit({
      originalTitle: initialPackage?.title,
      title,
      desc: description.trim() || 'Paket baru untuk kebutuhan produksi musik.',
      price: formatRupiah(finalPrice),
      meta: `${selectedStages.includes('Recording') ? `${recordingHours} Jam Rekaman` : '0 Jam Rekaman'} | ${songCount} Lagu`,
      tags: selectedStages.length ? selectedStages : ['Recording'],
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <section className="package-modal" role="dialog" aria-modal="true" aria-label="Buat Paket Baru">
        <button className="modal-close" type="button" onClick={onClose}>x</button>
        <h2>{title || (initialPackage ? 'Edit Paket' : 'Buat Paket Baru')}</h2>
        <div className="modal-grid">
          <div className="modal-left">
            <label>Nama Paket<sup>*</sup><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Example text" /></label>
            <label>Deskripsi Paket <span>(Opsional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Example text" /></label>
            <div className="modal-divider" />
            <p className="field-title">Tahap Produksi<sup>*</sup></p>
            <div className="stage-picker">
              {productionStages.map((stage) => (
                <button className={selectedStages.includes(stage.name) ? 'active' : ''} type="button" onClick={() => toggleStage(stage.name)} key={stage.name}>
                  <FigmaIcon name={stage.icon} />
                  <strong>{stage.name}</strong>
                  <span>{formatRupiah(stage.price)} / {stage.unit}</span>
                </button>
              ))}
            </div>
            <div className="modal-divider" />
            <div className="stepper-grid">
              <label>Durasi Recording / Lagu<sup>*</sup><div className="stepper"><button type="button" onClick={() => setRecordingHours((value) => Math.max(0, value - 1))}>-</button><span>{recordingHours}</span><button type="button" onClick={() => setRecordingHours((value) => value + 1)}>+</button></div></label>
              <label>Jumlah Lagu<sup>*</sup><div className="stepper"><button type="button" onClick={() => setSongCount((value) => Math.max(1, value - 1))}>-</button><span>{songCount}</span><button type="button" onClick={() => setSongCount((value) => value + 1)}>+</button></div></label>
            </div>
          </div>
          <div className="modal-right">
            <p className="field-title">Rincian Harga</p>
            <div className="price-box">
              {productionStages.filter((stage) => selectedStages.includes(stage.name)).map((stage) => {
                const qty = stage.name === 'Recording' ? recordingHours : songCount;
                return <div className="price-row" key={stage.name}><div><strong>{stage.name}</strong><span>{qty} {stage.unit} x {formatRupiah(stage.price)}</span></div><b>{formatRupiah(qty * stage.price)}</b></div>;
              })}
              <div className="price-total"><span>Harga Paket</span><strong>{formatRupiah(finalPrice)}</strong></div>
            </div>
            <div className="manual-row"><span>Atur Harga Manual</span><button className={manualPrice ? 'active' : ''} type="button" onClick={() => setManualPrice((value) => !value)} aria-label="Atur Harga Manual" /></div>
            {manualPrice && <label className="manual-price-input">Harga Manual<input type="number" min="0" value={manualPriceValue} onChange={(event) => setManualPriceValue(event.target.value)} placeholder="1250000" /></label>}
          </div>
        </div>
        <footer className="modal-actions"><button type="button" onClick={onClose}>Batal</button><button type="button" onClick={submitPackage}>{submitLabel || (initialPackage ? 'Simpan Paket' : 'Buat Paket')}</button></footer>
      </section>
    </div>
  );
}

function DeletePackageModal({ item, onClose, onConfirm, title = 'Hapus Paket?', message, confirmLabel = 'Hapus Paket' }) {
  return (
    <div className="modal-backdrop">
      <section className="delete-modal" role="dialog" aria-modal="true" aria-label="Hapus Paket">
        <h2>{title}</h2>
        <p>{message || `Paket "${item.title}" akan dihapus dari daftar. Project yang sudah berjalan tidak terpengaruh.`}</p>
        <footer>
          <button type="button" onClick={onClose}>Batal</button>
          <button type="button" onClick={() => onConfirm(item.title)}>{confirmLabel}</button>
        </footer>
      </section>
    </div>
  );
}

function PackageManagement() {
  const [filter, setFilter] = React.useState('Semua Paket');
  const [viewMode, setViewMode] = React.useState('Tabel');
  const [query, setQuery] = React.useState('');
  const [packageItems, setPackageItems] = React.useState(packages);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [packageToEdit, setPackageToEdit] = React.useState(null);
  const [packageToDelete, setPackageToDelete] = React.useState(null);
  const filteredPackages = packageItems.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Semua Paket' || item.tags.includes(filter);
    return matchesQuery && matchesFilter;
  });
  const addPackage = () => {
    setShowCreateModal(true);
  };
  const savePackage = (item) => {
    setPackageItems((items) => item.originalTitle ? items.map((pkg) => pkg.title === item.originalTitle ? { title: item.title, desc: item.desc, price: item.price, meta: item.meta, tags: item.tags } : pkg) : [...items, { title: item.title, desc: item.desc, price: item.price, meta: item.meta, tags: item.tags }]);
    setPackageToEdit(null);
  };
  const duplicatePackage = (item) => {
    setPackageItems((items) => [...items, { ...item, title: `${item.title} Copy` }]);
  };
  const deletePackage = (title) => {
    setPackageItems((items) => items.filter((item) => item.title !== title));
    setPackageToDelete(null);
  };

  return (
    <div className="dashboard-frame package-page">
      <Sidebar activeKey="packages" />
      <main className="content">
        <Header crumb="Penjualan / Manajemen Paket" title="Manajemen Paket" />
        <section className="package-stats">{packageStats.map((item) => <PackageStatCard item={item} key={item.title} />)}</section>
        <section className="package-toolbar panel">
          <label className="package-search"><FigmaIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama paket..." /></label>
          <div className="view-mode"><span>Mode Lihat:</span>{['Kartu', 'Tabel'].map((mode) => <button className={viewMode === mode ? 'active' : ''} type="button" onClick={() => setViewMode(mode)} key={mode}><FigmaIcon name={mode === 'Kartu' ? 'grid' : 'table'} />{mode}</button>)}</div>
          <button className="add-package" type="button" onClick={addPackage}><FigmaIcon name="add" />Buat Paket</button>
        </section>
        <div className="package-filter-row">
          {['Semua Paket', 'Recording', 'Editing', 'Mixing', 'Mastering'].map((item) => <button className={filter === item ? 'active' : ''} type="button" onClick={() => setFilter(item)} key={item}>{item} ({item === 'Semua Paket' ? packageItems.length : packageItems.filter((pkg) => pkg.tags.includes(item)).length})</button>)}
        </div>
        {viewMode === 'Tabel' ? <PackageTable items={filteredPackages} total={packageItems.length} onEdit={setPackageToEdit} onDelete={(title) => setPackageToDelete(packageItems.find((item) => item.title === title))} /> : <section className="package-grid">{filteredPackages.map((item) => <PackageCard item={item} onEdit={setPackageToEdit} onDelete={(title) => setPackageToDelete(packageItems.find((pkg) => pkg.title === title))} key={item.title} />)}</section>}
        <div className="page-bottom-line" />
      </main>
      {showCreateModal && <CreatePackageModal onClose={() => setShowCreateModal(false)} onSubmit={(item) => { savePackage(item); setShowCreateModal(false); }} />}
      {packageToEdit && <CreatePackageModal initialPackage={packageToEdit} onClose={() => setPackageToEdit(null)} onSubmit={savePackage} />}
      {packageToDelete && <DeletePackageModal item={packageToDelete} onClose={() => setPackageToDelete(null)} onConfirm={deletePackage} />}
    </div>
  );
}

function App() {
  if (window.location.pathname.includes('/manager/packages')) return <PackageManagement />;
  if (window.location.pathname.includes('/manager/booking')) return <BookingPage />;
  if (window.location.pathname.includes('/manager/quotation')) return <QuotationPage />;
  if (window.location.pathname.includes('/manager/project')) return <ProjectPage />;
  return <Dashboard />;
}

createRoot(document.getElementById('root')).render(<App />);
