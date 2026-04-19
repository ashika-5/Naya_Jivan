import { useState } from "react";
import { HOSPITALS } from "../utils/data";
import { HospitalCard } from "../components/Cards";
import { Input, Select, Btn, Empty } from "../components/UI";

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const filtered = HOSPITALS.filter(
    (h) =>
      (!search || h.name.toLowerCase().includes(search.toLowerCase())) &&
      (!city || h.city === city),
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Search bar */}
      <div className="bg-white rounded-2xl p-7 shadow-card border border-[rgba(0,0,0,0.09)] mb-10 animate-fade-up">
        <h1 className="font-head font-bold text-2xl mb-6">Find a Hospital</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Hospital Name"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All Cities</option>
            <option>Kathmandu</option>
            <option>Lalitpur</option>
            <option>Bhaktapur</option>
          </Select>
          <Btn className="h-[46px] justify-center" onClick={() => {}}>
            Search
          </Btn>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon="🏥"
          title="No hospitals found"
          desc="Try a different search term or city."
          action={
            <Btn
              onClick={() => {
                setSearch("");
                setCity("");
              }}
            >
              Clear Filters
            </Btn>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {filtered.map((h) => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      )}
    </div>
  );
}
