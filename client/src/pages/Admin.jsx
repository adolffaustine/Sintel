import { useEffect, useRef, useState } from 'react';
import { content as staticContent } from '../data/content.js';

const API = 'api';

const SECTIONS = [
  { key: 'hero', label: 'Hero (homepage top)', type: 'fields', fields: ['eyebrow', 'headline', 'subheadline', 'ctaPrimary', 'ctaSecondary'], long: ['subheadline'] },
  { key: 'vision', label: 'Vision', type: 'fields', fields: ['title', 'statement'], long: ['statement'] },
  { key: 'mission', label: 'Mission', type: 'fields', fields: ['title', 'statement'], long: ['statement'] },
  { key: 'values', label: 'Values', type: 'items', itemFields: ['title', 'image', 'description'], long: ['description'] },
  { key: 'focusAreas', label: 'Focus Areas', type: 'items', itemFields: ['title', 'icon', 'image', 'description'], long: ['description'] },
  { key: 'projects', label: 'Projects', type: 'projects' },
  { key: 'traction', label: 'Traction (stat cards)', type: 'items', itemFields: ['stat', 'label'], long: ['label'] },
  { key: 'whyInvest', label: 'Why Invest', type: 'items', itemFields: ['title', 'image', 'description'], long: ['description'] },
  { key: 'team', label: 'Team', type: 'team' },
  { key: 'sdgSection', label: 'SDG section', type: 'sdg' },
  { key: 'contact', label: 'Contact section', type: 'fields', fields: ['title', 'subtitle', 'image', 'investorNote'], long: ['subtitle', 'image', 'investorNote'] },
  { key: 'services', label: 'Services', type: 'services' },
  { key: 'contactInfo', label: 'Contact info (email & phones)', type: 'contact' },
  { key: 'footer', label: 'Footer', type: 'fields', fields: ['tagline'] },
  { key: 'submissions', label: '📬 Contact Submissions', type: 'submissions' },
];

const clone = (v) => JSON.parse(JSON.stringify(v));

function Field({ label, value, onChange, long }) {
  return (
    <label className="af">
      <span>{label}</span>
      {long ? (
        <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ItemsEditor({ def, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const add = () => onChange([...items, Object.fromEntries(def.itemFields.map((f) => [f, '']))]);
  return (
    <div>
      {items.map((item, i) => (
        <div className="arow" key={i}>
          {def.itemFields.map((f) => (
            <Field key={f} label={f} long={def.long?.includes(f)} value={item[f]}
              onChange={(v) => { const n = clone(items); n[i][f] = v; onChange(n); }} />
          ))}
          <button className="arem" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button className="aadd" onClick={add}>+ Add item</button>
    </div>
  );
}

function TeamEditor({ value, onChange }) {
  const v = { title: '', subtitle: '', members: [], ...clone(value || {}) };
  return (
    <div>
      <Field label="title" value={v.title} onChange={(x) => onChange({ ...v, title: x })} />
      <Field label="subtitle" long value={v.subtitle} onChange={(x) => onChange({ ...v, subtitle: x })} />
      {v.members.map((m, i) => (
        <div className="arow" key={i}>
          <Field label="name" value={m.name} onChange={(x) => { const n = clone(v.members); n[i].name = x; onChange({ ...v, members: n }); }} />
          <Field label="role" value={m.role} onChange={(x) => { const n = clone(v.members); n[i].role = x; onChange({ ...v, members: n }); }} />
          <Field label="photo URL" value={m.photo || ''} onChange={(x) => { const n = clone(v.members); n[i].photo = x; onChange({ ...v, members: n }); }} />
          {m.photo && (
            <img
              src={m.photo}
              alt={m.name}
              style={{ marginTop: '6px', borderRadius: '50%', border: '2px solid #D5D9E2', width: '48px', height: '48px', objectFit: 'cover', display: 'block' }}
            />
          )}
          <button className="arem" onClick={() => onChange({ ...v, members: v.members.filter((_, j) => j !== i) })}>Remove</button>
        </div>
      ))}
      <button className="aadd" onClick={() => onChange({ ...v, members: [...v.members, { name: '', role: '', photo: '' }] })}>+ Add member</button>
    </div>
  );
}

function SdgEditor({ value, onChange }) {
  const v = { title: '', subtitle: '', sdgs: [], ...clone(value || {}) };
  return (
    <div>
      <Field label="title" value={v.title} onChange={(x) => onChange({ ...v, title: x })} />
      <Field label="subtitle" long value={v.subtitle} onChange={(x) => onChange({ ...v, subtitle: x })} />
      {v.sdgs.map((s, i) => (
        <div className="arow" key={i}>
          <Field label="number" value={s.number} onChange={(x) => { const n = clone(v.sdgs); n[i].number = Number(x) || 0; onChange({ ...v, sdgs: n }); }} />
          <Field label="name" value={s.name} onChange={(x) => { const n = clone(v.sdgs); n[i].name = x; onChange({ ...v, sdgs: n }); }} />
          <button className="arem" onClick={() => onChange({ ...v, sdgs: v.sdgs.filter((_, j) => j !== i) })}>Remove</button>
        </div>
      ))}
      <button className="aadd" onClick={() => onChange({ ...v, sdgs: [...v.sdgs, { number: v.sdgs.length + 1, name: '' }] })}>+ Add SDG</button>
    </div>
  );
}

function ServicesEditor({ value, onChange }) {
  const v = { title: '', subtitle: '', items: [], ...clone(value || {}) };
  return (
    <div>
      <Field label="title" value={v.title} onChange={(x) => onChange({ ...v, title: x })} />
      <Field label="subtitle" long value={v.subtitle} onChange={(x) => onChange({ ...v, subtitle: x })} />
      {v.items.map((s, i) => (
        <div className="arow" key={i}>
          <Field label="icon" value={s.icon} onChange={(x) => { const n = clone(v.items); n[i].icon = x; onChange({ ...v, items: n }); }} />
          <Field label="title" value={s.title} onChange={(x) => { const n = clone(v.items); n[i].title = x; onChange({ ...v, items: n }); }} />
          <Field label="image URL (optional)" value={s.image || ''} onChange={(x) => { const n = clone(v.items); n[i].image = x; onChange({ ...v, items: n }); }} />
          {s.image && (
            <img
              src={s.image}
              alt={s.title}
              style={{ marginTop: '6px', borderRadius: '6px', border: '1px solid #D5D9E2', maxWidth: '180px', height: 'auto', display: 'block' }}
            />
          )}
          <Field label="tags (comma separated)" value={(s.tags || []).join(', ')}
            onChange={(x) => { const n = clone(v.items); n[i].tags = x.split(',').map((t) => t.trim()).filter(Boolean); onChange({ ...v, items: n }); }} />
          <Field label="description" long value={s.description} onChange={(x) => { const n = clone(v.items); n[i].description = x; onChange({ ...v, items: n }); }} />
          <button className="arem" onClick={() => onChange({ ...v, items: v.items.filter((_, j) => j !== i) })}>Remove</button>
        </div>
      ))}
      <button className="aadd" onClick={() => onChange({ ...v, items: [...v.items, { icon: 'server', title: '', image: '', description: '', tags: [] }] })}>+ Add service</button>
    </div>
  );
}

function ProjectsEditor({ value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const add = () => onChange([...items, {
    id: `project-${Date.now()}`, name: '', tagline: '', description: '', imageUrl: '', features: [],
    impact: '', sdgs: [], status: 'In development',
  }]);
  return (
    <div>
      {items.map((p, i) => (
        <div className="arow aproj" key={i}>
          <Field label="id (url slug, lowercase-with-dashes)" value={p.id} onChange={(v) => { const n = clone(items); n[i].id = v; onChange(n); }} />
          <Field label="name" value={p.name} onChange={(v) => { const n = clone(items); n[i].name = v; onChange(n); }} />
          <Field label="tagline" value={p.tagline} onChange={(v) => { const n = clone(items); n[i].tagline = v; onChange(n); }} />
          <Field label="image URL (optional)" value={p.imageUrl || ''} onChange={(v) => { const n = clone(items); n[i].imageUrl = v; onChange(n); }} />
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt={p.name}
              style={{ marginTop: '8px', borderRadius: '6px', border: '1px solid #D5D9E2', maxWidth: '260px', height: 'auto', display: 'block' }}
            />
          )}
          <Field label="status (Prototype / In Development / Deployed)" value={p.status || ''} onChange={(v) => { const n = clone(items); n[i].status = v; onChange(n); }} />
          <Field label="category (AI / IoT / Web / Embedded / Multi)" value={p.category || ''} onChange={(v) => { const n = clone(items); n[i].category = v; onChange(n); }} />
          <Field label="description" long value={p.description} onChange={(v) => { const n = clone(items); n[i].description = v; onChange(n); }} />
          <Field label="features (one per line)" long value={(p.features || []).join('\n')}
            onChange={(v) => { const n = clone(items); n[i].features = v.split('\n').map((s) => s.trim()).filter(Boolean); onChange(n); }} />
          <Field label="impact" long value={p.impact} onChange={(v) => { const n = clone(items); n[i].impact = v; onChange(n); }} />
          <Field label="sdgs (comma separated numbers)" value={(p.sdgs || []).join(', ')}
            onChange={(v) => { const n = clone(items); n[i].sdgs = v.split(',').map((s) => Number(s.trim())).filter((x) => !Number.isNaN(x)); onChange(n); }} />
          <button className="arem" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button className="aadd" onClick={add}>+ Add project</button>
    </div>
  );
}

function ContactInfoEditor({ value, onChange }) {
  const v = { email: '', phones: [], ...clone(value || {}) };
  return (
    <div>
      <Field label="email" value={v.email} onChange={(x) => onChange({ ...v, email: x })} />
      <Field label="phones (comma separated)" value={(v.phones || []).join(', ')}
        onChange={(x) => onChange({ ...v, phones: x.split(',').map((s) => s.trim()).filter(Boolean) })} />
    </div>
  );
}

function SubmissionsViewer({ token }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const LIMIT = 15;

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`api/admin/submissions?page=${p}&limit=${LIMIT}`, {
        headers: { 'x-admin-token': token }
      });
      const body = await res.json();
      if (body.ok) { setSubs(body.submissions); setTotal(body.total || body.submissions.length); }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const filtered = filter ? subs.filter(s =>
    s.name?.toLowerCase().includes(filter.toLowerCase()) ||
    s.email?.toLowerCase().includes(filter.toLowerCase()) ||
    s.inquiry_type?.toLowerCase().includes(filter.toLowerCase())
  ) : subs;

  const pages = Math.ceil(total / LIMIT) || 1;

  return (
    <div>
      <input
        placeholder="Filter by name, email or type..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ padding: '8px 12px', border: '1px solid #D5D9E2', borderRadius: '8px', marginBottom: '16px', width: '100%', maxWidth: '360px', fontFamily: 'inherit' }}
      />
      {loading && <p style={{color:'#6b7280'}}>Loading…</p>}
      {!loading && filtered.length === 0 && <p style={{color:'#6b7280'}}>No submissions yet.</p>}
      {filtered.map((s, i) => (
        <div key={i} style={{ background:'#FAFBFD', border:'1px solid #D5D9E2', borderRadius:'10px', padding:'14px 16px', marginBottom:'10px' }}>
          <div style={{ display:'flex', gap:'12px', alignItems:'baseline', flexWrap:'wrap', marginBottom:'6px' }}>
            <strong style={{color:'#12141b'}}>{s.name}</strong>
            <a href={`mailto:${s.email}`} style={{color:'#0a8d70', fontSize:'13px'}}>{s.email}</a>
            {s.organization && <span style={{fontSize:'13px',color:'#6b7280'}}>{s.organization}</span>}
            <span style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', background:'#001D58', color:'#fff', padding:'2px 8px', borderRadius:'4px' }}>{s.inquiry_type}</span>
            <span style={{fontSize:'12px',color:'#9ca3af',marginLeft:'auto'}}>{new Date(s.created_at).toLocaleString()}</span>
          </div>
          <p style={{margin:0,color:'#454b58',fontSize:'14px',lineHeight:'1.6'}}>{s.message}</p>
        </div>
      ))}
      {pages > 1 && (
        <div style={{display:'flex',gap:'8px',marginTop:'16px',alignItems:'center'}}>
          <button className="abtn" disabled={page<=1} onClick={() => setPage(p=>p-1)}>← Prev</button>
          <span style={{fontSize:'13px',color:'#6b7280'}}>Page {page} of {pages} ({total} total)</span>
          <button className="abtn" disabled={page>=pages} onClick={() => setPage(p=>p+1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

function ImageUploader({ token }) {
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      });
      const body = await res.json();
      if (body.ok) { setUrl(body.url); }
    } catch {}
    setUploading(false);
  };
  return (
    <div style={{ background:'#f0f9f6', border:'1px solid #b7ecd8', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
      <span style={{fontSize:'13px',fontWeight:600,color:'#0a8d70'}}>📎 Upload Image</span>
      <input type="file" accept="image/*" onChange={upload} disabled={uploading} style={{fontSize:'13px'}} />
      {uploading && <span style={{fontSize:'13px',color:'#6b7280'}}>Uploading…</span>}
      {url && (
        <span style={{fontSize:'12px',color:'#454b58'}}>
          URL: <code style={{background:'#e8f5ef',padding:'2px 6px',borderRadius:'4px',cursor:'pointer'}} onClick={() => { navigator.clipboard.writeText(url); }}>{url}</code>
          <span style={{fontSize:'11px',color:'#9ca3af',marginLeft:'6px'}}>(click to copy)</span>
        </span>
      )}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [draft, setDraft] = useState(null);
  const [openKey, setOpenKey] = useState('projects');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCur, setPwCur] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConf, setPwConf] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const timer = useRef(null);
  const tokenRef = useRef(null);

  const flash = (m) => { setMsg(m); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setMsg(''), 3500); };

  const loadContent = async () => {
    try {
      const res = await fetch(`${API}/content`);
      const body = await res.json();
      const sections = body?.sections || {};
      setDraft({ ...staticContent, ...sections });
    } catch {
      setDraft(clone(staticContent));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem('sintel_admin_token');
        if (saved) tokenRef.current = saved;
        const res = await fetch(`${API}/admin/me`, { headers: { 'x-admin-token': saved || '' } });
        const body = await res.json();
        if (body?.ok || body?.authed) { setAuthed(true); await loadContent(); }
      } catch { /* not logged in */ }
      setChecking(false);
    })();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (res.ok && body.ok && body.token) {
        localStorage.setItem('sintel_admin_token', body.token);
        tokenRef.current = body.token;
        setAuthed(true); await loadContent();
      }
      else setLoginError(body?.error || 'Login failed');
    } catch { setLoginError('Login failed — try again'); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': tokenRef.current || '' },
        body: JSON.stringify({ content: draft }),
      });
      const body = await res.json();
      if (res.ok && body.ok) flash('Saved — your site is updated.');
      else flash(body?.error || 'Save failed');
    } catch { flash('Save failed — check your connection'); }
    setSaving(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (pwNew.length < 8) { setPwMsg('New password must be at least 8 characters.'); return; }
    if (pwNew !== pwConf) { setPwMsg('New passwords do not match.'); return; }
    try {
      const res = await fetch(`${API}/admin/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': tokenRef.current || '' },
        body: JSON.stringify({ current: pwCur, next: pwNew }),
      });
      const body = await res.json();
      if (res.ok && body.ok) {
        setPwMsg('Password changed.');
        setPwCur(''); setPwNew(''); setPwConf('');
        setTimeout(() => setPwOpen(false), 1200);
      } else setPwMsg(body?.error || 'Change failed');
    } catch { setPwMsg('Change failed — check your connection'); }
  };

  const logout = async () => {
    try {
      await fetch(`${API}/admin/logout`, {
        method: 'POST',
        headers: { 'x-admin-token': tokenRef.current || '' },
      });
    } catch { /* ignore */ }
    localStorage.removeItem('sintel_admin_token');
    tokenRef.current = null;
    setAuthed(false); setDraft(null);
  };

  if (checking) return <div className="admin-wrap"><p>Loading…</p></div>;

  if (!authed) {
    return (
      <div className="admin-wrap">
        <h1>Admin</h1>
        <p className="admin-sub">Sign in to edit site content.</p>
        <form onSubmit={login} className="admin-login">
          <input type="password" placeholder="Admin password" value={password}
            onChange={(e) => setPassword(e.target.value)} autoFocus />
          <button type="submit">Sign in</button>
        </form>
        {loginError && <p className="admin-err">{loginError}</p>}
      </div>
    );
  }

  const setSection = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <h1>Content Admin</h1>
        <div className="admin-actions">
          <button className="abtn" onClick={() => setPwOpen((o) => !o)}>Change password</button>
          <button className="abtn" onClick={logout}>Sign out</button>
          <button className="asave" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save all changes'}</button>
        </div>
      </div>
      {msg && <p className="admin-msg">{msg}</p>}
      {pwOpen && (
        <form className="apw" onSubmit={changePassword}>
          <h2>Change admin password</h2>
          <label className="af"><span>Current password</span>
            <input type="password" value={pwCur} onChange={(e) => setPwCur(e.target.value)} autoFocus />
          </label>
          <label className="af"><span>New password (min 8 characters)</span>
            <input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
          </label>
          <label className="af"><span>Confirm new password</span>
            <input type="password" value={pwConf} onChange={(e) => setPwConf(e.target.value)} />
          </label>
          {pwMsg && <p className={pwMsg.startsWith('Password changed') ? 'admin-msg' : 'admin-err'}>{pwMsg}</p>}
          <div className="admin-actions">
            <button type="submit" className="asave">Update password</button>
            <button type="button" className="abtn" onClick={() => { setPwOpen(false); setPwMsg(''); }}>Cancel</button>
          </div>
        </form>
      )}
      <ImageUploader token={tokenRef.current || ''} />
      <div className="admin-cols">
        <div className="admin-nav">
          {SECTIONS.map((s) => (
            <button key={s.key} className={openKey === s.key ? 'on' : ''}
              onClick={() => setOpenKey(s.key)}>{s.label}</button>
          ))}
        </div>
        <div className="admin-body">
          {SECTIONS.filter((s) => s.key === openKey).map((s) => (
            <div key={s.key}>
              <h2>{s.label}</h2>
              {s.type === 'fields' && (
                <div>
                  {s.fields.map((f) => (
                    <Field key={f} label={f} long={s.long?.includes(f)} value={draft?.[s.key]?.[f]}
                      onChange={(v) => setSection(s.key, { ...draft[s.key], [f]: v })} />
                  ))}
                </div>
              )}
              {s.type === 'items' && <ItemsEditor def={s} value={draft?.[s.key]} onChange={(v) => setSection(s.key, v)} />}
              {s.type === 'projects' && <ProjectsEditor value={draft?.[s.key]} onChange={(v) => setSection(s.key, v)} />}
              {s.type === 'team' && <TeamEditor value={draft?.[s.key]} onChange={(v) => setSection(s.key, v)} />}
              {s.type === 'sdg' && <SdgEditor value={draft?.[s.key]} onChange={(v) => setSection(s.key, v)} />}
              {s.type === 'services' && <ServicesEditor value={draft?.[s.key]} onChange={(v) => setSection(s.key, v)} />}
              {s.type === 'contact' && <ContactInfoEditor value={draft?.[s.key]} onChange={(v) => setSection(s.key, v)} />}
              {s.type === 'submissions' && <SubmissionsViewer token={tokenRef.current || ''} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
