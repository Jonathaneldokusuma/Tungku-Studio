import React from 'react';
import { createRoot } from 'react-dom/client';
import { MoreVertical } from 'lucide-react';
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
    quotation: [801, 386],
    sliders: [689, 509],
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
              return <a className={`nav-item ${activeKey === item.key ? 'active' : ''}`} href={item.key === 'packages' ? '/manager/packages' : '#'} key={item.key}><FigmaIcon name={item.icon} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</a>;
            })}
          </section>
        ))}
      </nav>
      <div className="account"><div className="avatar" /><div><strong>Hervin C.</strong><span>Manager</span></div><FigmaIcon name="logout" className="account-logout" /></div>
    </aside>
  );
}

function Header({ crumb = 'Utama / Dashboard', title = 'Dashboard' }) {
  const [query, setQuery] = React.useState('');
  const [createdCount, setCreatedCount] = React.useState(0);

  return (
    <header className="topbar">
      <div className="crumb"><span>{crumb}</span><strong>{title}</strong></div>
      <div className="top-actions">
        <button type="button" onClick={() => setCreatedCount((count) => count + 1)}>{createdCount ? `Draft ${createdCount}` : 'Buat Project'}</button>
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

function packageDuration(meta) {
  const [duration = '', songs = ''] = meta.split('|').map((part) => part.trim());
  return { duration: duration || 'Tidak rekaman', songs: songs || '1 Lagu' };
}

function PackageTable({ items, total, onDuplicate, onDelete }) {
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
              <button className="action-add" type="button" aria-label={`Tambah ${item.title}`} onClick={() => onDuplicate(item)}><FigmaIcon name="circle-add" /></button>
              <button className="action-delete" type="button" aria-label={`Hapus ${item.title}`} onClick={() => onDelete(item.title)}><FigmaIcon name="delete" /></button>
            </div>
          </div>
        );
      })}
      <div className="package-table-foot"><div className="pager"><button type="button">&lt;</button><span>1</span><button type="button">&gt;</button></div><span>{items.length} dari {total} paket</span></div>
    </section>
  );
}

function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function CreatePackageModal({ onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedStages, setSelectedStages] = React.useState(['Recording', 'Editing', 'Mixing', 'Mastering']);
  const [recordingHours, setRecordingHours] = React.useState(3);
  const [songCount, setSongCount] = React.useState(1);
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
    onCreate({
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
        <h2>Buat Paket Baru</h2>
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
        <footer className="modal-actions"><button type="button" onClick={onClose}>Batal</button><button type="button" onClick={submitPackage}>Buat Paket</button></footer>
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
  const filteredPackages = packageItems.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Semua Paket' || item.tags.includes(filter);
    return matchesQuery && matchesFilter;
  });
  const addPackage = () => {
    setShowCreateModal(true);
  };
  const createPackage = (item) => setPackageItems((items) => [...items, item]);
  const duplicatePackage = (item) => {
    setPackageItems((items) => [...items, { ...item, title: `${item.title} Copy` }]);
  };
  const deletePackage = (title) => {
    setPackageItems((items) => items.filter((item) => item.title !== title));
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
        {viewMode === 'Tabel' ? <PackageTable items={filteredPackages} total={packageItems.length} onDuplicate={duplicatePackage} onDelete={deletePackage} /> : <section className="package-grid">{filteredPackages.map((item) => <PackageCard item={item} key={item.title} />)}</section>}
        <div className="page-bottom-line" />
      </main>
      {showCreateModal && <CreatePackageModal onClose={() => setShowCreateModal(false)} onCreate={createPackage} />}
    </div>
  );
}

function App() {
  return window.location.pathname.includes('/manager/packages') ? <PackageManagement /> : <Dashboard />;
}

createRoot(document.getElementById('root')).render(<App />);
