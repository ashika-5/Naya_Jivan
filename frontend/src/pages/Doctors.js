import { useState } from 'react';
import { DOCTORS } from '../utils/data';
import { DoctorCard } from '../components/Cards';
import { Input, Select, Btn, Empty } from '../components/UI';

export default function Doctors() {
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('');

  const specializations = [...new Set(DOCTORS.map(d => d.specialization))];

  const filtered = DOCTORS.filter(d =>
    (!search || d.name.toLowerCase().includes(search.toLowerCase())) &&
    (!spec || d.specialization === spec)
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Search */}
      <div className="bg-white rounded-2xl p-7 shadow-card border border-[rgba(0,0,0,0.09)] mb-10 animate-fade-up">
        <h1 className="font-head font-bold text-2xl mb-6">Find a Doctor</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Doctor Name"
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select label="Specialization" value={spec} onChange={e => setSpec(e.target.value)}>
            <option value="">All Specializations</option>
            {specializations.map(s => <option key={s}>{s}</option>)}
          </Select>
          <Btn className="h-[46px] justify-center" onClick={() => {}}>Search</Btn>
        </div>
      </div>

      {/* Results count */}
      {(search || spec) && (
        <p className="text-sm text-[var(--muted)] mb-5">
          {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
          {spec ? ` in ${spec}` : ''}
          {search ? ` matching "${search}"` : ''}
          <button className="ml-3 text-green-500 underline" onClick={() => { setSearch(''); setSpec(''); }}>Clear</button>
        </p>
      )}

      {filtered.length === 0 ? (
        <Empty
          icon="👨‍⚕️"
          title="No doctors found"
          desc="Try a different name or specialization."
          action={<Btn onClick={() => { setSearch(''); setSpec(''); }}>Clear Filters</Btn>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger">
          {filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}
    </div>
  );
}
