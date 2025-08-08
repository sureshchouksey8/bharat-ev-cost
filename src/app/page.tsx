// src/app/page.tsx
"use client";

import { useMemo, useState } from "react";
import Chip from "@/components/Chip";
import BreakEvenGauge from "@/components/BreakEvenGauge";
import { CITY_PRESETS } from "@/lib/cities";

type Model = {
  id: string;
  name: string;
  brand: string;
  type: "scooter" | "car";
  kwhPer100: number;
  petrolAltKmpl: number;
  evPremium: number;
  colorA: string;
  colorB: string;
};

const MODELS: Model[] = [
  { id: "ola-s1-air", name: "S1 Air", brand: "Ola", type: "scooter", kwhPer100: 3.5, petrolAltKmpl: 45, evPremium: 25_000, colorA: "#0D3B66", colorB: "#EF476F" },
  { id: "ather-450s", name: "450S", brand: "Ather", type: "scooter", kwhPer100: 3.2, petrolAltKmpl: 45, evPremium: 30_000, colorA: "#0D3B66", colorB: "#06D6A0" },
  { id: "tvs-iqube", name: "iQube", brand: "TVS", type: "scooter", kwhPer100: 3.4, petrolAltKmpl: 45, evPremium: 28_000, colorA: "#0D3B66", colorB: "#FFD166" },
  { id: "nexon-ev", name: "Nexon EV", brand: "Tata", type: "car", kwhPer100: 14, petrolAltKmpl: 14, evPremium: 200_000, colorA: "#0D3B66", colorB: "#06D6A0" },
  { id: "tiago-ev", name: "Tiago EV", brand: "Tata", type: "car", kwhPer100: 12, petrolAltKmpl: 16, evPremium: 150_000, colorA: "#0D3B66", colorB: "#EF476F" },
  { id: "xuv400", name: "XUV400", brand: "Mahindra", type: "car", kwhPer100: 16, petrolAltKmpl: 13, evPremium: 220_000, colorA: "#0D3B66", colorB: "#FFD166" }
];

const KM_CHIPS = [50, 80, 100, 150, 200, 250, 300] as const;

function rupees(n: number) {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.max(0, n));
}

export default function Home() {
  const [model, setModel] = useState<Model | null>(null);

  // cities are plain string keys (avoid symbol issues)
  const cityNames = Object.keys(CITY_PRESETS) as string[];
  const [city, setCity] = useState<string>("Gurugram");
  const [tariff, setTariff] = useState<number>(CITY_PRESETS["Gurugram"].tariff);
  const [petrol, setPetrol] = useState<number>(CITY_PRESETS["Gurugram"].petrol);

  const [kmChip, setKmChip] = useState<number | null>(null);
  const [customKm, setCustomKm] = useState<string>("");

  const [logoDataUrl, setLogoDataUrl] = useState<string>("");

  const km = kmChip ?? (customKm ? Number(customKm) || 0 : 0);

  function onCityChange(c: string) {
    setCity(c);
    setTariff(CITY_PRESETS[c].tariff);
    setPetrol(CITY_PRESETS[c].petrol);
  }

  const calc = useMemo(() => {
    if (!model || !km) return null;
    const evPerKm = (model.kwhPer100 / 100) * tariff;
    const day = evPerKm * km;
    const month = day * 30;
    const year = month * 12;

    const petrolPerKm = petrol / model.petrolAltKmpl;
    const dayPetrol = petrolPerKm * km;
    const monthlySave = Math.max(0, dayPetrol * 30 - month);
    const breakEvenMonths = monthlySave > 0 ? Math.ceil(model.evPremium / monthlySave) : Infinity;

    return { evPerKm, day, month, year, petrolPerKm, dayPetrol, monthlySave, breakEvenMonths };
  }, [model, km, tariff, petrol]);

  async function handleShare() {
    if (!model || !calc || !km) return;
    const W = 1200, H = 630;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0D3B66"); grad.addColorStop(1, "#EF476F");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(W * 0.58, 0, W * 0.42, H);

    ctx.fillStyle = "rgba(255,255,255,0.13)";
    ctx.font = "bold 300px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    const b0 = model.brand?.[0] || "E"; const n0 = model.name?.[0] || "V";
    ctx.fillText(b0 + n0, W * 0.63, H * 0.65);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 46px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("⚡ Bharat EV Cost", 48, 80);
    ctx.font = "20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("BharatEVCost.in • BEV", 52, 108);

    if (logoDataUrl) {
      try {
        const img = new Image();
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej();
          img.src = logoDataUrl;
        });
        const size = 72;
        ctx.save();
        ctx.beginPath();
        ctx.arc(48 + 26, 80 - 22, 26, 0, Math.PI * 2);
        ctx.closePath(); ctx.clip();
        ctx.drawImage(img, 48, 40, size, size);
        ctx.restore();
      } catch {}
    }

    ctx.font = "28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(`${model.brand} ${model.name}`, 48, 160);
    ctx.fillText(`City: ${city}`, 48, 196);
    ctx.fillText(`Daily: ${km} km  •  Tariff: ₹${tariff}/kWh  •  Petrol: ₹${petrol}/L`, 48, 230);

    ctx.font = "bold 88px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(`₹${rupees(calc.day)}`, 48, 320);
    ctx.font = "28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("per day", 48, 360);
    ctx.font = "bold 64px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(`₹${rupees(calc.month)} / month`, 48, 450);
    ctx.font = "28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(`Break-even: ${Number.isFinite(calc.breakEvenMonths) ? calc.breakEvenMonths + " months" : "—"}`, 48, 490);

    ctx.font = "20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("Made with ❤️ in India • BharatEVCost.in • BEV", 48, 600);

    await new Promise<void>((res) => setTimeout(res, 10));

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) {
      const file = new File([blob], `${model.id}-${km}km.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d?: any) => boolean; share?: (d: any) => Promise<void> };
      try {
        if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
          await nav.share({ files: [file], title: "Bharat EV Cost", text: "My EV running cost" });
          return;
        }
      } catch {}
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "ev-cost.png";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl; a.download = "ev-cost.png";
    document.body.appendChild(a); a.click(); a.remove();
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0B1B4A] via-[#0D3B66] to-[#0B1B4A] text-white pb-24">
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-10 select-none">
        <div className="-rotate-[18deg] text-7xl md:text-8xl font-black tracking-tight flex gap-[6vw]">
          <span>भारत</span><span>भारत</span><span>भारत</span><span>भारत</span>
        </div>
      </div>

      <header className="relative z-10 max-w-7xl mx-auto px-4 xl:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">BEV</div>
          <div className="text-xl font-semibold tracking-tight">Bharat EV Cost</div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () => setLogoDataUrl(String(r.result || ""));
                r.readAsDataURL(f);
              }}
            />
            Upload Logo
          </label>
          <span className="px-3 py-1 rounded-full bg-white/10">EN / HI</span>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-4 xl:px-6">
        {!model && (
          <>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">India’s EV cost, made simple.</h1>
            <p className="mt-2 text-white/80 md:text-lg max-w-3xl">
              Pick your model • शहर चुनें • और तुरंत देखें: ₹/day, ₹/month, ₹/year
            </p>

            <h2 className="mt-8 mb-3 font-semibold text-white/90">Scooters &amp; Bikes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {MODELS.filter(m => m.type === "scooter").map(m => (
                <button
                  key={m.id}
                  onClick={() => setModel(m)}
                  className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br shadow-lg hover:scale-[1.02] transition-transform"
                  style={{ backgroundImage: `linear-gradient(135deg, ${m.colorA}, ${m.colorB})` }}
                >
                  <div className="text-left">
                    <div className="text-sm uppercase tracking-wide opacity-90">{m.brand}</div>
                    <div className="text-2xl font-bold">{m.name}</div>
                    <div className="mt-2 text-white/90 text-sm">Est. {m.kwhPer100} kWh / 100 km</div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/20 blur-2xl"></div>
                </button>
              ))}
            </div>

            <h2 className="mt-8 mb-3 font-semibold text-white/90">Cars</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MODELS.filter(m => m.type === "car").map(m => (
                <button
                  key={m.id}
                  onClick={() => setModel(m)}
                  className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br shadow-lg hover:scale-[1.02] transition-transform"
                  style={{ backgroundImage: `linear-gradient(135deg, ${m.colorA}, ${m.colorB})` }}
                >
                  <div className="text-left">
                    <div className="text-sm uppercase tracking-wide opacity-90">{m.brand}</div>
                    <div className="text-2xl font-bold">{m.name}</div>
                    <div className="mt-2 text-white/90 text-sm">Est. {m.kwhPer100} kWh / 100 km</div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/20 blur-2xl"></div>
                </button>
              ))}
            </div>
          </>
        )}

        {model && (
          <section className="mt-2">
            <div
              className="relative rounded-3xl p-6 md:p-10 shadow-2xl bg-gradient-to-br"
              style={{ backgroundImage: `linear-gradient(135deg, ${model.colorA}, ${model.colorB})` }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-15 select-none flex items-center justify-center">
                <div className="text-[22vw] md:text-[12vw] font-black tracking-tight uppercase leading-none">
                  {(model.brand?.slice(0, 1) || "E")}{(model.name?.slice(0, 1) || "V")}
                </div>
              </div>

              <div className="relative flex items-start justify-between gap-8 flex-col md:flex-row">
                <div>
                  <div className="text-sm uppercase tracking-wide opacity-90">{model.brand}</div>
                  <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow">{model.name}</h1>
                  <p className="mt-2 text-white/90 inline-block px-2 rounded">
                    Consumption (est.): {model.kwhPer100} kWh / 100 km • Petrol alt: {model.petrolAltKmpl} km/L
                  </p>
                </div>
                <button
                  onClick={() => { setModel(null); setKmChip(null); setCustomKm(""); }}
                  className="self-start md:self-auto px-3 py-1 rounded-full bg-white/20 hover:bg-white/30"
                >
                  Change model
                </button>
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                  <span className="opacity-90">City</span>
                  <select
                    className="bg-transparent outline-none"
                    value={city}
                    onChange={(e) => onCityChange(e.target.value)}
                  >
                    {cityNames.map((c) => (
                      <option key={c} value={c} className="bg-[#0D3B66] text-white">{c}</option>
                    ))}
                  </select>
                </div>
                <Assumption label="Tariff (₹/kWh)" value={tariff} onChange={setTariff} />
                <Assumption label="Petrol (₹/L)" value={petrol} onChange={setPetrol} />
                <div className="px-3 py-1 rounded-full bg-white/10">*Estimates only</div>
              </div>

              <div className="relative mt-6">
                <div className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <span>How much do you drive?</span>
                  <span className="text-white/80">/ Kitna Chalaoge?</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {KM_CHIPS.map(v => (
                    <Chip key={v} label={v} active={kmChip === v} onClick={() => { setKmChip(v); setCustomKm(""); }} />
                  ))}
                  <div className={`flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 transition-all ${customKm ? "ring-2 ring-yellow-300" : ""}`}>
                    <input
                      className="bg-transparent outline-none w-24 text-center"
                      placeholder="Custom"
                      value={customKm}
                      onChange={(e) => { setCustomKm(e.target.value); setKmChip(null); }}
                      inputMode="numeric"
                    />
                    <span className="text-white/70 text-sm">km/day</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-8">
                <div className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <span>What will it cost?</span>
                  <span className="text-white/80">/ Kitna Kharchoge?</span>
                </div>

                {!km && <div className="mt-3 text-white/80">Select a daily distance first.</div>}

                {!!km && calc && (
                  <>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatCard title="₹/day"   value={`₹${rupees(calc.day)}`}   />
                      <StatCard title="₹/month" value={`₹${rupees(calc.month)}`} />
                      <StatCard title="₹/year"  value={`₹${rupees(calc.year)}`}  />
                      <StatCard title="Petrol / day" value={`₹${rupees(calc.dayPetrol)}`} subtle />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-6">
                      <BreakEvenGauge months={calc.breakEvenMonths as number} />
                      <div className="text-white/85 text-sm md:text-base leading-relaxed space-y-2">
                        <div className="font-semibold">Break-even estimate</div>
                        {calc.breakEvenMonths === Infinity ? (
                          <div>Not enough monthly savings at current inputs. Try higher daily km or adjust tariff/petrol.</div>
                        ) : (
                          <div>You recover the extra EV price in <b>{calc.breakEvenMonths} months</b>.</div>
                        )}
                        <div className="text-white/75">
                          <b>Formula (simple):</b> Break-even months = EV extra price ÷ (Monthly petrol cost − Monthly EV cost)
                        </div>
                        <div className="text-white/75">
                          <b>सरल सूत्र:</b> ब्रेक-ईवन महीने = EV की अतिरिक्त कीमत ÷ (मासिक पेट्रोल खर्च − मासिक EV खर्च)
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleShare}
                    disabled={!km || !calc}
                    className={`px-5 py-3 rounded-2xl font-semibold text-black shadow ${(!km || !calc) ? "opacity-60 cursor-not-allowed" : ""}`}
                    style={{ background: "#FFD166" }}
                  >
                    Share My Cost
                  </button>
                  <button
                    onClick={() => alert("Compare page coming next!")}
                    className="px-5 py-3 rounded-2xl font-semibold bg-white/10 hover:bg-white/20"
                  >
                    Compare vs Petrol
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-5">
              <Teaser title="Compare EV vs Petrol" desc="Nexon EV vs Nexon Petrol, Tiago EV vs Tiago Petrol…" />
              <Teaser title="City Pages" desc="EV running cost in Gurugram, Delhi, Bengaluru…" />
              <Teaser title="Guides" desc="Apartment charging, DISCOM tariffs, solar + EV savings." />
            </div>
          </section>
        )}
      </section>

      <footer className="relative z-10 max-w-7xl mx-auto px-4 xl:px-6 mt-20 text-white/70 text-sm">
        <div>© {new Date().getFullYear()} Bharat EV Cost • Estimates only • Privacy • Terms</div>
      </footer>
    </main>
  );
}

function StatCard({ title, value, subtle }: { title: string; value: string; subtle?: boolean }) {
  return (
    <div className={"rounded-2xl p-4 " + (subtle ? "bg-white/10" : "bg-white/10")}>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-2xl md:text-3xl font-extrabold">{value}</div>
    </div>
  );
}

function Assumption({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
      <span className="opacity-90">{label}</span>
      <input
        className="bg-transparent outline-none w-20 text-center"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        inputMode="decimal"
      />
    </div>
  );
}

function Teaser({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-5 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-white/80 text-sm mt-1">{desc}</div>
    </div>
  );
}
