import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  SunDim,
  ArrowRight,
  Bolt,
  ShieldCheck,
  Calendar,
  ChevronRight,
  User,
  DollarSign,
  Award,
  Layers,
  CheckCircle,
  Home,
  Clock,
  Cpu,
  MapPin,
  Check,
  Plus,
  Minus,
  Zap,
  Battery,
  Phone,
  FileText,
  Mail,
  Info,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Sliders,
  BadgeAlert
} from "lucide-react";

// Types
interface PanelFinish {
  id: string;
  name: string;
  efficiency: number;
  multiplier: number;
  description: string;
  specs: {
    durability: string;
    tempCoeff: string;
    warranty: string;
    absorptionRate: string;
  };
  cellColor: string;
  gridColor: string;
  highlightGlow: string;
}

interface ProjectData {
  id: string;
  title: string;
  location: string;
  peakPower: string;
  efficiency: string;
  annualYield: string;
  co2Offset: string;
  batteryCapacity: string;
  description: string;
  image: string;
  highlightText: string;
}

export default function App() {
  // Navigation & General UI State
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Customizer Studio State
  const [selectedFinish, setSelectedFinish] = useState<string>("matte-black");
  const [installationArea, setInstallationArea] = useState<number>(85); // sq meters
  const [sunlightHours, setSunlightHours] = useState<number>(5.5); // hours per day average

  // ROI / Consultation Simulator State
  const [portalStep, setPortalStep] = useState<number>(1);
  const [clientProfile, setClientProfile] = useState<string>("villa");
  const [monthlyBill, setMonthlyBill] = useState<number>(240); // monthly dollars
  const [includeStorage, setIncludeStorage] = useState<boolean>(true);
  const [batteryUnits, setBatteryUnits] = useState<number>(1); // number of LFP batteries
  const [hasSmartInverter, setHasSmartInverter] = useState<boolean>(true);

  // CAD Walkthrough Appointment Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    timeSlot: "14:00",
    notes: ""
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingTicket, setBookingTicket] = useState<any>(null);

  // Feature Card expanded info
  const [activeFeatureTip, setActiveFeatureTip] = useState<number | null>(null);

  // Live calculation metrics for active project in showcase
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // List of high-tech premium panel finishes
  const panelFinishes: PanelFinish[] = [
    {
      id: "matte-black",
      name: "Matte Black Carbon",
      efficiency: 22.8,
      multiplier: 1.0,
      description: "Ultra-premium textured monocrystalline composite with standard non-reflective depth. Engineered for clean minimalist architectures.",
      specs: {
        durability: "Class A (Hurricane Grade)",
        tempCoeff: "-0.34% / °C (High resistance)",
        warranty: "30 Years Full Guarantee",
        absorptionRate: "97.8%"
      },
      cellColor: "from-zinc-900 to-stone-950",
      gridColor: "rgba(50, 50, 50, 0.4)",
      highlightGlow: "rgba(30, 41, 59, 0.5)"
    },
    {
      id: "tuscan-clay",
      name: "Tuscan Solar Clay",
      efficiency: 19.5,
      multiplier: 1.18,
      description: "Organic warm terracotta integrated photovoltaic clay. Merges seamlessly into historical tiles and classical Mediterranean roofs.",
      specs: {
        durability: "Architectural Reinforced Structural Glass",
        tempCoeff: "-0.38% / °C",
        warranty: "25 Years Guarantee",
        absorptionRate: "92.4%"
      },
      cellColor: "from-amber-800 to-amber-950",
      gridColor: "rgba(180, 83, 9, 0.35)",
      highlightGlow: "rgba(180, 83, 9, 0.4)"
    },
    {
      id: "emerald-slate",
      name: "Emerald Slate Natural",
      efficiency: 21.2,
      multiplier: 1.22,
      description: "Natural layered botanical deep green design. Adapts visually with forest surroundings, modern biophilic builds, and natural wood structures.",
      specs: {
        durability: "Marine-Level Anti-Corrosion (IP68)",
        tempCoeff: "-0.35% / °C",
        warranty: "30 Years Performance Guarantee",
        absorptionRate: "95.6%"
      },
      cellColor: "from-emerald-950 to-teal-950",
      gridColor: "rgba(16, 185, 129, 0.25)",
      highlightGlow: "rgba(16, 185, 129, 0.35)"
    },
    {
      id: "prismatic-glass",
      name: "Prismatic Angular Glass",
      efficiency: 24.5,
      multiplier: 1.35,
      description: "Double-sided crystalline micro-pyramidal diamond glass that traps sunlight from low angles. Peak high-fidelity energy harvesting technology.",
      specs: {
        durability: "Military Grade Diamond-Coat (Impact-Proof)",
        tempCoeff: "-0.28% / °C (Outstanding)",
        warranty: "40 Years Premier Warranty",
        absorptionRate: "99.4% (Multi-Angle Refraction)"
      },
      cellColor: "from-cyan-950 to-sky-950",
      gridColor: "rgba(14, 165, 233, 0.45)",
      highlightGlow: "rgba(14, 165, 233, 0.5)"
    }
  ];

  const currentFinishDetails = useMemo(() => {
    return panelFinishes.find(f => f.id === selectedFinish) || panelFinishes[0];
  }, [selectedFinish]);

  // Dynamically calculate estimated stats based on customizer choices
  const calculatedSpecs = useMemo(() => {
    const rawEfficiency = currentFinishDetails.efficiency / 100;
    // Calculation of annual kWh generated: Area * Solar Insolation * Efficiency * System losses (approx 0.82) * 365
    const annualGenerationKwh = Math.round(
      installationArea * sunlightHours * rawEfficiency * 0.82 * 365
    );
    // Average electricity rate in luxury architectural zones ($0.28 per kWh)
    const annualSavingsDollars = Math.round(annualGenerationKwh * 0.28);
    // Metric tons of CO2 offset annually (approx 0.4 kg of CO2 saved per kWh)
    const annualCo2OffsetTons = parseFloat(((annualGenerationKwh * 0.4) / 1000).toFixed(1));
    // Number of trees equivalent (approx 1 ton of CO2 is offset by 45 adult trees in a year)
    const equivalentTreesPlanted = Math.round(annualCo2OffsetTons * 45);

    return {
      generation: annualGenerationKwh,
      savings: annualSavingsDollars,
      co2: annualCo2OffsetTons,
      trees: equivalentTreesPlanted
    };
  }, [currentFinishDetails, installationArea, sunlightHours]);

  // List of Exclusive Projects Showcase
  const exclusiveProjects: ProjectData[] = [
    {
      id: "coastal-retreat",
      title: "Coastal Retreat Villa",
      location: "Malibu, California",
      peakPower: "16.8 kWp",
      efficiency: "24.2%",
      annualYield: "28,400 kWh",
      co2Offset: "11.4 Tons/Yr",
      batteryCapacity: "40 kWh (LFP Storage)",
      description: "A breathtaking waterfront architectural estate blending low-reflective Prismatic Angular Glass panels with premium weather-resistant composite. Survives high-salinity air with fully integrated active grid monitoring.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      highlightText: "Specially coated against marine salt-mist layer with zero maritime structural degradation."
    },
    {
      id: "urban-skyline",
      title: "Urban Skyline Penthouse",
      location: "San Francisco, California",
      peakPower: "12.4 kWp",
      efficiency: "22.8%",
      annualYield: "19,800 kWh",
      co2Offset: "7.9 Tons/Yr",
      batteryCapacity: "20 kWh (Sleek Modular)",
      description: "A masterpiece of urban integration featuring customized Matte Black Carbon structural panels deployed flush against architectural metal roofs. Delivers uninterrupted critical load supply during metropolitan outages.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      highlightText: "Ultra-sleek roof profile. Fully bypasses strict municipal visual zoning restrictions."
    },
    {
      id: "mountain-view",
      title: "Mountain View Lodge & Estate",
      location: "Aspen, Colorado",
      peakPower: "24.0 kWp",
      efficiency: "21.2%",
      annualYield: "36,200 kWh",
      co2Offset: "14.5 Tons/Yr",
      batteryCapacity: "60 kWh (Industrial Dual System)",
      description: "Embedded within biophilic surroundings, this heavy-duty alpine setup utilizes Emerald Slate integrated tiles combined with self-heating snow-shedding mount systems. Sustains 100% off-grid autonomy during rigid winter peaks.",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      highlightText: "Features automatic geothermal cell-backheating that quickly sheds 4-inch alpine snow cover."
    }
  ];

  // Simulator dynamic values
  const simulatedRoi = useMemo(() => {
    let baseAnnualConsumptionKwh = monthlyBill * 12 * 4.2; // approx kWh consumption mapping
    let solarGenerationKwh = calculatedSpecs.generation;
    
    // Factor in profile scaling
    let multiplier = 1;
    if (clientProfile === "estate") multiplier = 1.6;
    if (clientProfile === "penthouse") multiplier = 0.8;
    if (clientProfile === "lodge") multiplier = 2.1;

    baseAnnualConsumptionKwh = baseAnnualConsumptionKwh * multiplier;

    // Estimate project cost
    let baseSystemCost = Math.round((installationArea * 290) * currentFinishDetails.multiplier);
    let storageCost = includeStorage ? (batteryUnits * 8500) : 0;
    let smartAddons = hasSmartInverter ? 2200 : 0;
    let totalInvestment = Math.round(baseSystemCost + storageCost + smartAddons);

    // Annual financial savings (offset + potential net metering credits)
    const annualFinancialSaving = Math.round(
      Math.min(baseAnnualConsumptionKwh, solarGenerationKwh) * 0.31 +
      Math.max(0, solarGenerationKwh - baseAnnualConsumptionKwh) * 0.12
    );

    // Est payback period
    const paybackYears = parseFloat((totalInvestment / Math.max(1200, annualFinancialSaving)).toFixed(1));
    const independenceRate = Math.min(100, Math.round((solarGenerationKwh / baseAnnualConsumptionKwh) * 100));

    return {
      investment: totalInvestment,
      annualSavings: annualFinancialSaving,
      payback: paybackYears,
      independence: independenceRate,
      batteryReserved: includeStorage ? batteryUnits * 13.5 : 0 // Powerwall standard 13.5 kWh
    };
  }, [clientProfile, monthlyBill, includeStorage, batteryUnits, hasSmartInverter, calculatedSpecs, installationArea, currentFinishDetails]);

  // Handle CTA button scroll to Simulator
  const scrollToContact = () => {
    const el = document.getElementById("concierge-simulator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Clear booking state to let them re-simulate
      setBookingConfirmed(false);
      setBookingTicket(null);
    }
  };

  // Form handle changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form appointment handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date) {
      setSuccessBanner("⚠️ Please fill in all required fields (Name, Email, and Date) before submitting.");
      setTimeout(() => setSuccessBanner(null), 5000);
      return;
    }

    const ticketId = `CAD-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingTicket({
      id: ticketId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "Not Provided",
      date: formData.date,
      time: formData.timeSlot,
      profile: clientProfile,
      panelFinish: currentFinishDetails.name,
      estimatedRoi: simulatedRoi.payback,
      independence: simulatedRoi.independence,
      estimatedSavings: simulatedRoi.annualSavings,
      batteryCapacity: simulatedRoi.batteryReserved,
      notes: formData.notes || "No extra specification."
    });

    setBookingConfirmed(true);
    setSuccessBanner("✨ Premium Architectural CAD Appointment booked successfully!");
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="min-h-screen bg-solar-light text-slate-800 font-sans selection:bg-solar-accent selection:text-white relative overflow-x-hidden">
      
      {/* Top Banner & Alerts */}
      <AnimatePresence>
        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 max-w-xl mx-auto bg-solar-deep text-white shadow-2xl border border-solar-accent/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-md"
            id="notification-toast"
          >
            <div className="bg-solar-accent/20 p-2 rounded-lg text-solar-accent shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <span className="font-mono text-xs text-solar-accent uppercase tracking-wider block font-bold mb-1">System Status</span>
              <p className="text-sm font-sans text-slate-100">{successBanner}</p>
            </div>
            <button 
              onClick={() => setSuccessBanner(null)}
              className="text-slate-400 hover:text-white font-mono text-sm px-2 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top micro premium header */}
      <div className="bg-solar-dark text-slate-300 py-2 px-4 text-center text-xs font-mono tracking-wider border-b border-solar-forest/30 flex items-center justify-center gap-3">
        <span className="inline-flex h-2 w-2 rounded-full bg-solar-accent animate-ping" />
        <span>VIBRANT ACTIVE SOLAR THEME LAUNCHED • HIGH ACCENT GRAPHICS & REALTIME ENGINE</span>
        <button 
          onClick={scrollToContact}
          className="underline text-solar-gold hover:text-amber-350 cursor-pointer hidden md:inline ml-2"
        >
          Check CAD Simulator →
        </button>
      </div>

      {/* Main Premium Structural Navbar */}
      <header className="sticky top-0 z-40 bg-solar-dark/95 border-b border-solar-forest/30 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Custom Gold Glowing Solar icon logo */}
          <div className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-solar-deep border border-solar-gold/40 shadow-[0_0_15px_rgba(251,191,36,0.15)] group-hover:border-solar-accent/60 transition-all duration-300">
              <Sun className="w-6 h-6 text-solar-gold animate-[spin_24s_linear_infinite]" />
              <div className="absolute inset-0 rounded-xl bg-radial from-solar-gold/20 via-transparent opacity-70 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-white leading-none block">
                Solar<span className="text-solar-gold">Nova</span>
              </span>
              <span className="font-mono text-[9px] text-solar-accent uppercase tracking-widest block -mt-1 font-semibold">
                Bespeak Microgrids
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-mono tracking-wide text-slate-300">
            <a href="#customizer" className="hover:text-solar-accent transition-colors">Our Studio</a>
            <a href="#why-nova" className="hover:text-solar-accent transition-colors">Why Nova</a>
            <a href="#projects" className="hover:text-solar-accent transition-colors">Exclusives</a>
            <a href="#concierge-simulator" className="hover:text-solar-accent transition-colors">ROI Simulator</a>
          </nav>

          {/* Premium Contact button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={scrollToContact}
              className="px-5 py-2.5 rounded-full bg-linear-to-r from-solar-emerald to-solar-forest text-white font-mono text-xs tracking-wider border border-solar-accent/20 hover:border-solar-gold/50 shadow-md hover:shadow-solar-gold/10 hover-lift cursor-pointer flex items-center gap-2"
            >
              Get Live Estimate <ChevronRight className="w-3.5 h-3.5 text-solar-gold" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "w-0 opacity-0" : "w-4"}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "w-6 -rotate-45 -translate-y-2.5" : "w-5"}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-solar-dark border-b border-solar-forest/40"
            >
              <div className="px-5 py-6 space-y-4 flex flex-col">
                <a 
                  href="#customizer" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 font-mono text-sm hover:text-solar-gold py-1"
                >
                  Our Customizer Studio
                </a>
                <a 
                  href="#why-nova" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 font-mono text-sm hover:text-solar-gold py-1"
                >
                  Why Choose Nova
                </a>
                <a 
                  href="#projects" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 font-mono text-sm hover:text-solar-gold py-1"
                >
                  Exclusive Innovations
                </a>
                <a 
                  href="#concierge-simulator" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 font-mono text-sm hover:text-solar-gold py-1"
                >
                  ROI Simulator & CAD Slots
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToContact();
                  }}
                  className="w-full text-center py-3 bg-solar-emerald hover:bg-solar-accent text-white font-mono text-xs rounded-xl border border-solar-accent/20 cursor-pointer"
                >
                  Start Custom CAD Booking
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Majestic Split Hero Visual */}
      <section className="relative bg-solar-dark overflow-hidden min-h-[90vh] flex items-center py-12 lg:py-20">
        
        {/* Deep emerald-to-forest and sun-glow gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-solar-dark via-solar-deep to-[#07241f] z-0" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-radial from-solar-gold/15 to-transparent blur-3xl rounded-full z-0 pointer-events-none" />
        <div className="absolute -bottom-10 left-12 w-[500px] h-96 bg-radial from-solar-accent/10 to-transparent blur-3xl rounded-full z-0 pointer-events-none" />

        {/* Ambient energy graphic grids overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#145e4d_1px,transparent_1px),linear-gradient(to_bottom,#145e4d_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solar-emerald/30 border border-solar-accent/30 backdrop-blur-xs">
                <SunDim className="w-4 h-4 text-solar-gold animate-spin-slow" />
                <span className="font-mono text-[10px] text-solar-accent md:text-xs font-semibold uppercase tracking-wider">
                  The Vanguard of Luxury Photovoltaics
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05]">
                Powering Tomorrow With <span className="text-solar-gold underline decoration-solar-accent/40 decoration-wavy">Clean</span> Solar Energy
              </h1>

              <p className="font-sans text-base md:text-lg text-slate-300 max-w-xl leading-relaxed">
                Experience the absolute pinnacle of luxury off-grid autonomy. Solar Nova engineers high-efficiency glass custom panel tiles, custom-tuned cell textures, and smart microgrids that adapt cohesively with your architecture.
              </p>

              {/* Action buttons with beautiful golden glow pill */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 rounded-full bg-solar-gold text-solar-dark font-mono text-sm font-bold tracking-wider hover:bg-white hover:text-solar-dark shadow-2xl transition-all hover-lift flex items-center justify-center gap-3 cursor-pointer group"
                >
                  Get a Premium Consultation
                  <ArrowRight className="w-4 h-4 text-solar-emerald group-hover:translate-x-1.5 transition-transform" />
                </button>
                
                <a
                  href="#customizer"
                  className="px-6 py-4 rounded-full bg-solar-emerald/20 hover:bg-solar-emerald/40 text-solar-accent font-mono text-xs tracking-wider border border-solar-accent/30 hover:border-solar-gold/40 text-center transition-all cursor-pointer"
                >
                  Configure Panel Finishes
                </a>
              </div>

              {/* Minimalist highlights footer inside hero */}
              <div className="pt-8 border-t border-solar-emerald/20 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <span className="font-mono text-xs text-slate-400 block uppercase">Peak Ingress</span>
                  <span className="font-serif text-xl font-bold text-white block">400W+ per Tile</span>
                </div>
                <div>
                  <span className="font-mono text-xs text-slate-400 block uppercase">Visual Finish</span>
                  <span className="font-serif text-xl font-bold text-solar-gold block">Bespoke Glass</span>
                </div>
                <div>
                  <span className="font-mono text-xs text-slate-400 block uppercase">System Autonomy</span>
                  <span className="font-serif text-xl font-bold text-solar-accent block">24/7 Smart micro-grid</span>
                </div>
              </div>

            </div>

            {/* Right side majestic hero image split container */}
            <div className="lg:col-span-5 relative">
              <div className="relative group mx-auto max-w-[480px] lg:max-w-none">
                
                {/* Background glow effects */}
                <div className="absolute -inset-1.5 rounded-3xl bg-linear-to-r from-solar-accent via-solar-gold to-emerald-500 opacity-25 blur-xl group-hover:opacity-40 transition duration-1000" />
                
                {/* Image Frame */}
                <div className="relative overflow-hidden rounded-2xl border border-solar-accent/20 bg-solar-deep shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&h=800&q=80"
                    alt="Premium Architectural Solar Array"
                    className="w-full object-cover aspect-square opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Decorative High-Performance Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-solar-dark/90 backdrop-blur-md border border-solar-accent/20 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-solar-accent uppercase tracking-widest block font-medium">Active Cell Technology</span>
                      <h4 className="font-serif text-base font-semibold text-white">Solaris Prismatic v5</h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-solar-gold bg-solar-emerald px-2.5 py-1 rounded-sm">
                      24.5% Efficiency
                    </span>
                  </div>

                  {/* Aesthetic Sun Ray Flare graphic */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-solar-gold/40 to-transparent pointer-events-none" />
                </div>

                {/* Micro tech badge floating outside */}
                <div className="absolute top-6 -left-6 rounded-lg bg-solar-gold p-3.5 shadow-xl rotate-[-4deg] border border-stone-900 flex flex-col items-center justify-center text-center hidden sm:flex">
                  <Bolt className="w-6 h-6 text-solar-dark mb-1 fill-solar-dark animate-bounce" />
                  <span className="font-mono text-[9px] font-bold text-solar-dark uppercase tracking-wider">Zero Carbon Grid</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Layered Statistics Grid - Floating Hover-Active Blocks */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Stat Block 1 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-solar-border shadow-[0_10px_30px_rgba(14,59,49,0.04)] hover:border-solar-accent hover:shadow-[0_15px_35px_rgba(14,59,49,0.1)] transition-all duration-300 hover-lift group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-solar-light flex items-center justify-center text-solar-emerald group-hover:bg-solar-emerald group-hover:text-white transition-colors duration-300">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Global Reach</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-bold text-solar-dark mb-1 tracking-tight">
              10k+
            </h3>
            <p className="font-sans text-xs text-slate-500 leading-normal">
              Architectural luxury homes and massive private estates powered entirely off-grid.
            </p>
          </div>

          {/* Stat Block 2 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-solar-border shadow-[0_10px_30px_rgba(14,59,49,0.04)] hover:border-solar-accent hover:shadow-[0_15px_35px_rgba(14,59,49,0.1)] transition-all duration-300 hover-lift group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-solar-light flex items-center justify-center text-solar-emerald group-hover:bg-solar-emerald group-hover:text-white transition-colors duration-300">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Heritage</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-bold text-solar-dark mb-1 tracking-tight">
              20+
            </h3>
            <p className="font-sans text-xs text-slate-500 leading-normal">
              Years of specialized mechanical engineering and custom solar design expertise.
            </p>
          </div>

          {/* Stat Block 3 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-solar-border shadow-[0_10px_30px_rgba(14,59,49,0.04)] hover:border-solar-accent hover:shadow-[0_15px_35px_rgba(14,59,49,0.1)] transition-all duration-300 hover-lift group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-solar-light flex items-center justify-center text-solar-emerald group-hover:bg-solar-emerald group-hover:text-white transition-colors duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Fidelity</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-bold text-solar-dark mb-1 tracking-tight">
              99.9%
            </h3>
            <p className="font-sans text-xs text-slate-500 leading-normal">
              Uptime efficiency rating engineered into integrated solid-state microgrids.
            </p>
          </div>

          {/* Stat Block 4 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-solar-border shadow-[0_10px_30px_rgba(14,59,49,0.04)] hover:border-solar-accent hover:shadow-[0_15px_35px_rgba(14,59,49,0.1)] transition-all duration-300 hover-lift group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-solar-light flex items-center justify-center text-solar-emerald group-hover:bg-solar-emerald group-hover:text-white transition-colors duration-300">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Acolyte</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-bold text-solar-dark mb-1 tracking-tight">
              25+
            </h3>
            <p className="font-sans text-xs text-slate-500 leading-normal">
              Prestigious global architectural craft and green energy design awards won.
            </p>
          </div>

        </div>
      </section>

      {/* Solid-Capped Feature Cards ("Why Choose Solar Nova") */}
      <section id="why-nova" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-mt-10">
        
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-solar-emerald font-bold tracking-widest uppercase block">
            Premium Engineering Threshold
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-solar-dark">
            Why Choose Solar Nova
          </h2>
          <p className="font-sans text-base text-slate-500">
            Clemiaed glassmorphic solutions and solar solar home architecture. Each block has been optimized beyond traditional commercial metrics to fit private ecosystems.
          </p>
        </div>

        {/* Feature block items with modern dark-emerald header stripe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Premium Materials */}
          <div className="bg-white rounded-2xl border border-solar-border shadow-xs hover:shadow-xl transition-all duration-300 text-left overflow-hidden relative flex flex-col justify-between group">
            {/* The Solid Dark-Emerald Top Stripe */}
            <div className="h-4 bg-gradient-to-r from-solar-emerald to-solar-forest w-full" />
            
            <div className="p-8 space-y-4 flex-1">
              <span className="font-mono text-[11px] font-bold text-solar-accent uppercase block tracking-wider">Material Synthesis</span>
              <h3 className="font-serif text-2xl font-bold text-solar-dark">
                Premium Materials & Design
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                This for assigni-colec ceqsinats with the premium malirist-tacbruati, with dewrming and sotor-desige senotea heroc-nsrcutes and ltc-ceoslfeetnin ssheurs of premium materials an design. We harness space-grade protective polymer layered components.
              </p>

              {/* Dynamic Quick Tip Box if clicked */}
              {activeFeatureTip === 1 && (
                <div className="bg-solar-light p-3 rounded-lg border border-solar-border text-[11px] text-solar-forest italic font-serif">
                  *Our glass layers pass the 50mm Colorado Hail-impact Certification test under extreme wind limits.
                </div>
              )}
            </div>

            {/* Bottom-right interactive hover floating button */}
            <div className="p-6 pt-0 flex justify-between items-center bg-linear-to-t from-solar-light/40 to-transparent">
              <span className="font-mono text-[10px] text-slate-400 font-bold">SPEC: PV-400 v4</span>
              <button
                onClick={() => setActiveFeatureTip(activeFeatureTip === 1 ? null : 1)}
                className="w-10 h-10 rounded-full border border-solar-border text-solar-emerald bg-white hover:bg-solar-gold hover:text-solar-dark hover:border-solar-gold transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs"
                title="Get Details"
              >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${activeFeatureTip === 1 ? "rotate-45" : ""}`} />
              </button>
            </div>
          </div>

          {/* Card 2: Smart Home Integration */}
          <div className="bg-white rounded-2xl border border-solar-border shadow-xs hover:shadow-xl transition-all duration-300 text-left overflow-hidden relative flex flex-col justify-between group">
            {/* The Solid Dark-Emerald Top Stripe */}
            <div className="h-4 bg-gradient-to-r from-solar-emerald to-solar-forest w-full" />
            
            <div className="p-8 space-y-4 flex-1">
              <span className="font-mono text-[11px] font-bold text-solar-accent uppercase block tracking-wider">Grid Intelligence</span>
              <h3 className="font-serif text-2xl font-bold text-solar-dark">
                Smart Home Integration
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Solar Nova energy design integrated homes in a depleite oir-resits mesi Innegratond aeymastirsp-repmailics and keep oneitnoivg ama smart home technorlog and sontisare. Communicates through premium local protocols to dynamically adjust HVAC loads.
              </p>

              {/* Dynamic Quick Tip Box if clicked */}
              {activeFeatureTip === 2 && (
                <div className="bg-solar-light p-3 rounded-lg border border-solar-border text-[11px] text-solar-forest italic font-serif">
                  *Fully compatible with Home Assistant, Lutron custom loads, and smart EV charging prioritization cycles.
                </div>
              )}
            </div>

            {/* Bottom-right interactive hover floating button */}
            <div className="p-6 pt-0 flex justify-between items-center bg-linear-to-t from-solar-light/40 to-transparent">
              <span className="font-mono text-[10px] text-slate-400 font-bold">SYSTEM: NOVA CONNECT</span>
              <button
                onClick={() => setActiveFeatureTip(activeFeatureTip === 2 ? null : 2)}
                className="w-10 h-10 rounded-full border border-solar-border text-solar-emerald bg-white hover:bg-solar-gold hover:text-solar-dark hover:border-solar-gold transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs"
                title="Get Details"
              >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${activeFeatureTip === 2 ? "rotate-45" : ""}`} />
              </button>
            </div>
          </div>

          {/* Card 3: White-Glove Service */}
          <div className="bg-white rounded-2xl border border-solar-border shadow-xs hover:shadow-xl transition-all duration-300 text-left overflow-hidden relative flex flex-col justify-between group">
            {/* The Solid Dark-Emerald Top Stripe */}
            <div className="h-4 bg-gradient-to-r from-solar-emerald to-solar-forest w-full" />
            
            <div className="p-8 space-y-4 flex-1">
              <span className="font-mono text-[11px] font-bold text-solar-accent uppercase block tracking-wider">Premium Assistance</span>
              <h3 className="font-serif text-2xl font-bold text-solar-dark">
                White-Glove Service
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                We hears seas to produe partners carded services with oamnrriae custiomer bnroices for codoanted sminnte, customer: lo reliable, and.irmity, and port service. Full turnkey engineering from customized structural roof drafting to net-metering legal processing.
              </p>

              {/* Dynamic Quick Tip Box if clicked */}
              {activeFeatureTip === 3 && (
                <div className="bg-solar-light p-3 rounded-lg border border-solar-border text-[11px] text-solar-forest italic font-serif">
                  *Includes our complimentary 10-year bi-annual clean-check and micro-grid performance diagnostics.
                </div>
              )}
            </div>

            {/* Bottom-right interactive hover floating button */}
            <div className="p-6 pt-0 flex justify-between items-center bg-linear-to-t from-solar-light/40 to-transparent">
              <span className="font-mono text-[10px] text-slate-400 font-bold">FIDELITY: Bespoke Care</span>
              <button
                onClick={() => setActiveFeatureTip(activeFeatureTip === 3 ? null : 3)}
                className="w-10 h-10 rounded-full border border-solar-border text-solar-emerald bg-white hover:bg-solar-gold hover:text-solar-dark hover:border-solar-gold transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs"
                title="Get Details"
              >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${activeFeatureTip === 3 ? "rotate-45" : ""}`} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Solar Customizer Studio */}
      <section id="customizer" className="py-24 bg-solar-dark text-white relative overflow-hidden">
        
        {/* Glow rings in customizer */}
        <div className="absolute top-0 right-1/4 w-[600px] h-96 bg-radial from-solar-accent/15 via-transparent to-transparent blur-3xl rounded-full z-0 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-[500px] h-96 bg-radial from-solar-gold/10 via-transparent to-transparent blur-3xl rounded-full z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="font-mono text-xs text-solar-gold font-bold tracking-widest uppercase block animate-pulse">
              Live Custom Design Laboratory
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              Interactive Solar Customizer Studio
            </h2>
            <p className="font-sans text-sm text-slate-350 max-w-2xl mx-auto">
              Choose your architectural panel finish profile and dynamically witness direct solar absorption efficiency, warranty thresholds, and custom estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive Panel Renderer SVG */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="p-6 bg-solar-deep/90 rounded-3xl border border-solar-emerald/30 relative overflow-hidden flex flex-col justify-center">
                
                {/* Micro tech indicators */}
                <div className="flex justify-between items-center mb-4 border-b border-solar-emerald/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-solar-accent animate-ping" />
                    <span className="font-mono text-[9px] text-solar-accent tracking-widest uppercase font-semibold">Active Design Simulator</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">SYS: SPEC-X2</span>
                </div>

                {/* Highly interactive modular 2D layered SVG panel representing selectedFinish */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-solar-dark flex items-center justify-center p-4 shadow-2xl border border-white/5">
                  
                  {/* Absolute positioning background shine */}
                  <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-10 animate-pulse duration-5000" />
                  
                  {/* Detailed Solar Panel SVG representation */}
                  <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-2xl">
                    <defs>
                      {/* Gradient for Matte Black cell */}
                      <linearGradient id="cell-matte-black" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>

                      {/* Gradient for Tuscan Clay cell */}
                      <linearGradient id="cell-tuscan-clay" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c" />
                        <stop offset="50%" stopColor="#b45309" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>

                      {/* Gradient for Emerald Slate cell */}
                      <linearGradient id="cell-emerald-slate" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#047857" />
                        <stop offset="50%" stopColor="#065f46" />
                        <stop offset="100%" stopColor="#064e3b" />
                      </linearGradient>

                      {/* Gradient for Prismatic glass cell */}
                      <linearGradient id="cell-prismatic-glass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="40%" stopColor="#0369a1" />
                        <stop offset="80%" stopColor="#0c4a6e" />
                        <stop offset="100%" stopColor="#051c2c" />
                      </linearGradient>

                      {/* Cell reflections pattern overlay */}
                      <pattern id="prism-cells" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="10" x2="10" y2="0" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                        <line x1="10" y1="10" x2="0" y2="0" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
                      </pattern>
                    </defs>

                    {/* Outer Aluminum Frame */}
                    <rect x="10" y="10" width="380" height="220" rx="10" fill="#2d3748" stroke="#1a202c" strokeWidth="4" />
                    
                    {/* Dark Glass Silicium Base Backdrop */}
                    <rect x="16" y="16" width="368" height="208" rx="6" fill="#090d16" />

                    {/* Grid Cells matrix dynamically colored based on selection */}
                    <g fill={`url(#cell-${selectedFinish})`}>
                      {/* Row 1 */}
                      <rect x="22" y="22" width="54" height="46" rx="3" />
                      <rect x="82" y="22" width="54" height="46" rx="3" />
                      <rect x="142" y="22" width="54" height="46" rx="3" />
                      <rect x="202" y="22" width="54" height="46" rx="3" />
                      <rect x="262" y="22" width="54" height="46" rx="3" />
                      <rect x="322" y="22" width="54" height="46" rx="3" />

                      {/* Row 2 */}
                      <rect x="22" y="74" width="54" height="46" rx="3" />
                      <rect x="82" y="74" width="54" height="46" rx="3" />
                      <rect x="142" y="74" width="54" height="46" rx="3" />
                      <rect x="202" y="74" width="54" height="46" rx="3" />
                      <rect x="262" y="74" width="54" height="46" rx="3" />
                      <rect x="322" y="74" width="54" height="46" rx="3" />

                      {/* Row 3 */}
                      <rect x="22" y="126" width="54" height="46" rx="3" />
                      <rect x="82" y="126" width="54" height="46" rx="3" />
                      <rect x="142" y="126" width="54" height="46" rx="3" />
                      <rect x="202" y="126" width="54" height="46" rx="3" />
                      <rect x="262" y="126" width="54" height="46" rx="3" />
                      <rect x="322" y="126" width="54" height="46" rx="3" />

                      {/* Row 4 */}
                      <rect x="22" y="178" width="54" height="46" rx="3" />
                      <rect x="82" y="178" width="54" height="46" rx="3" />
                      <rect x="142" y="178" width="54" height="46" rx="3" />
                      <rect x="202" y="178" width="54" height="46" rx="3" />
                      <rect x="262" y="178" width="54" height="46" rx="3" />
                      <rect x="322" y="178" width="54" height="46" rx="3" />
                    </g>

                    {/* Highly precise structural grid overlay pattern */}
                    <rect x="20" y="20" width="360" height="200" fill="url(#prism-cells)" rx="5" pointerEvents="none" />

                    {/* Integrated Micro-Rib conductors (silver line connections mapping) */}
                    <path d="M78 20v200 M138 20v200 M198 20v200 M258 20v200 M318 20v200" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3,3" pointerEvents="none" />
                    <path d="M20 70h360 M20 122h360 M20 174h360" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" pointerEvents="none" />

                    {/* Specular high fidelity linear reflection lines */}
                    <polygon points="50,20 180,20 80,220 20,220" fill="rgba(255, 255, 255, 0.05)" pointerEvents="none" />
                    <polygon points="250,20 300,20 210,220 180,220" fill="rgba(255, 255, 255, 0.03)" pointerEvents="none" />

                    {/* Gold Solar charging status indicator dot */}
                    <circle cx="365" cy="35" r="4" fill="#fbbf24" className="animate-pulse" />
                  </svg>

                </div>

                {/* Dynamically switching finish tag and visual indicators */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block">Active Texture Layer</span>
                    <span className="font-serif text-lg font-bold text-solar-gold">
                      {currentFinishDetails.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-slate-400 block">Materials Premium</span>
                    <span className="font-mono text-sm text-solar-accent font-bold">
                      x{currentFinishDetails.multiplier.toFixed(2)} cost factor
                    </span>
                  </div>
                </div>

              </div>

              {/* Slider customizer inputs below panel */}
              <div className="p-6 bg-solar-deep/50 rounded-2xl border border-solar-emerald/20 space-y-6">
                
                {/* Installation Area Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-mono text-xs text-slate-300 uppercase flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-solar-accent" />
                      Target Panel Installation Area
                    </label>
                    <span className="font-mono text-sm font-bold text-solar-gold">
                      {installationArea} m²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="350"
                    step="5"
                    value={installationArea}
                    onChange={(e) => setInstallationArea(Number(e.target.value))}
                    className="w-full accent-solar-accent h-1.5 bg-solar-forest rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>30 m² (Townhouse)</span>
                    <span>150 m² (Suburban)</span>
                    <span>350 m² (Grand Estate)</span>
                  </div>
                </div>

                {/* Sunlight Average Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-mono text-xs text-slate-300 uppercase flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-solar-gold" />
                      Daily Average Peak Sun Hours
                    </label>
                    <span className="font-mono text-sm font-bold text-solar-gold">
                      {sunlightHours} Hrs/Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="8.0"
                    step="0.5"
                    value={sunlightHours}
                    onChange={(e) => setSunlightHours(Number(e.target.value))}
                    className="w-full accent-solar-gold h-1.5 bg-solar-forest rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>3.0 Hrs (Alpine Winter)</span>
                    <span>5.5 Hrs (Standard Sunny)</span>
                    <span>8.0 Hrs (Desert Autonomy)</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Customizer Selector & Yield Projection */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Finishes Selector List */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  SELECT INTEGRATED SURFACE FINISH
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {panelFinishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFinish(f.id);
                        setSuccessBanner(`Selected ${f.name} PV finish. Interactive engine updated estimated yield calculations dynamically.`);
                        setTimeout(() => setSuccessBanner(null), 3500);
                      }}
                      className={`p-4 rounded-xl text-left border cursor-pointer transition-all ${
                        selectedFinish === f.id
                          ? "bg-solar-emerald/30 border-solar-accent text-white shadow-md shadow-solar-accent/15"
                          : "bg-solar-deep/50 border-white/5 text-slate-300 hover:bg-solar-emerald/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif text-base font-bold">{f.name}</span>
                        {selectedFinish === f.id && <CheckCircle className="w-4 h-4 text-solar-accent" />}
                      </div>
                      <span className="font-mono text-xs text-solar-gold font-bold">{f.efficiency}% Eff.</span>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1.5 leading-normal">{f.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Specs Table in Customizer */}
              <div className="p-5 rounded-2xl bg-solar-deep/80 border border-solar-emerald/20">
                <h4 className="font-mono text-[10px] text-solar-accent uppercase tracking-widest font-semibold mb-3">
                  CELL-LEVEL MECHANICAL SPECIFICATIONS
                </h4>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div className="flex justify-between border-b border-solar-emerald/10 py-1">
                    <span className="text-slate-400">Wind/Hail Rating:</span>
                    <span className="font-mono text-white font-medium">{currentFinishDetails.specs.durability}</span>
                  </div>
                  <div className="flex justify-between border-b border-solar-emerald/10 py-1">
                    <span className="text-slate-400">Temperature Coeff:</span>
                    <span className="font-mono text-white font-medium">{currentFinishDetails.specs.tempCoeff}</span>
                  </div>
                  <div className="flex justify-between border-b border-solar-emerald/10 py-1">
                    <span className="text-slate-400">Silicon Warranty:</span>
                    <span className="font-mono text-white font-medium">{currentFinishDetails.specs.warranty}</span>
                  </div>
                  <div className="flex justify-between border-b border-solar-emerald/10 py-1">
                    <span className="text-slate-400">Absorption Capture:</span>
                    <span className="font-mono text-white font-medium">{currentFinishDetails.specs.absorptionRate}</span>
                  </div>
                </div>
              </div>

              {/* Computed Dynamic yield outputs */}
              <div className="p-6 rounded-2xl bg-linear-to-br from-solar-emerald to-[#011a14] border border-solar-accent/30 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-solar-accent/20">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-solar-gold animate-bounce" />
                    <span className="font-serif text-lg font-bold text-white">Dynamic Yield Estimator</span>
                  </div>
                  <span className="font-mono text-[10px] text-solar-gold bg-solar-dark py-1 px-2.5 rounded-sm">Est Value Output</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Generation kWh */}
                  <div className="bg-solar-dark/40 p-4 rounded-xl border border-white/5 text-left">
                    <span className="font-mono text-[9px] text-slate-400 block uppercase tracking-wider">Estimated Annual Yield</span>
                    <span className="font-serif text-2xl md:text-3xl font-extrabold text-white block mt-1 tracking-tight">
                      {calculatedSpecs.generation.toLocaleString()} <span className="text-solar-accent text-sm">kWh</span>
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">Based on area index and insolation.</p>
                  </div>

                  {/* Savings Cash */}
                  <div className="bg-solar-dark/40 p-4 rounded-xl border border-white/5 text-left">
                    <span className="font-mono text-[9px] text-slate-400 block uppercase tracking-wider">Est. Annual Value Added</span>
                    <span className="font-serif text-2xl md:text-3xl font-extrabold text-solar-gold block mt-1 tracking-tight">
                      ${calculatedSpecs.savings.toLocaleString()} <span className="text-white text-xs">/ Yr</span>
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">Saves from grid utility peak rates.</p>
                  </div>

                  {/* CO2 offset */}
                  <div className="bg-solar-dark/40 p-4 rounded-xl border border-white/5 text-left col-span-2 sm:col-span-1">
                    <span className="font-mono text-[9px] text-slate-400 block uppercase tracking-wider">CO2 Carbon Prevented</span>
                    <span className="font-serif text-2xl font-extrabold text-white block mt-1 tracking-tight">
                      {calculatedSpecs.co2} <span className="text-emerald-400 text-sm">CO2 Tons</span>
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">Prevents heavy power grid coal burning.</p>
                  </div>

                  {/* Carbon offset trees */}
                  <div className="bg-solar-dark/40 p-4 rounded-xl border border-white/5 text-left col-span-2 sm:col-span-1">
                    <span className="font-mono text-[9px] text-slate-400 block uppercase tracking-wider">Equivalent Trees Grown</span>
                    <span className="font-serif text-2xl font-extrabold text-solar-accent block mt-1 tracking-tight">
                      {calculatedSpecs.trees} <span className="text-white text-sm">Trees</span>
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">Yearly planetary oxygen contribution.</p>
                  </div>

                </div>

                {/* Final Interactive portal connector */}
                <div className="text-center pt-2">
                  <p className="font-sans text-[11px] text-slate-350 italic mb-3">
                    Want to combine these variables into an estimate tailored to your monthly energy bill?
                  </p>
                  <button
                    onClick={scrollToContact}
                    className="px-6 py-2.5 bg-solar-gold hover:bg-white text-solar-dark font-mono text-[10px] uppercase font-bold tracking-widest rounded-full transition-all hover-lift w-full sm:w-auto"
                  >
                    Go To Comprehensive ROI Portal →
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Exclusive Projects Showcase with detailed slides and performance factors */}
      <section id="projects" className="py-24 bg-white border-y border-solar-border relative scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="font-mono text-xs text-solar-emerald font-bold tracking-widest uppercase block animate-pulse">
              Architectural Autonomy Portfolios
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-solar-dark">
              Our Exclusive Projects
            </h2>
            <p className="font-sans text-xs text-slate-500 max-w-2xl mx-auto">
              Inspect customized residential microgrids implemented across elite coastal estates, mountain retreats, and prestigious penthouses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side column: interactive project gallery selectors */}
            <div className="lg:col-span-5 space-y-4">
              
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2">
                CHOOSE PROJECT ARCHIVE
              </span>

              {exclusiveProjects.map((p, index) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProjectIndex(index);
                    setSuccessBanner(`Switched showcase portfolio to the ${p.title}. Loaded localized project coefficients.`);
                    setTimeout(() => setSuccessBanner(null), 3000);
                  }}
                  className={`w-full p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                    activeProjectIndex === index
                      ? "bg-solar-light border-solar-accent shadow-md shadow-solar-accent/5 translate-x-1"
                      : "bg-white border-solar-border hover:border-slate-300"
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-16 h-16 object-cover rounded-xl border border-solar-border shrink-0" 
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-solar-dark">{p.title}</h4>
                      <p className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-solar-emerald" />
                        {p.location}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-solar-emerald transition-transform ${activeProjectIndex === index ? "translate-x-1" : ""}`} />
                </button>
              ))}

              {/* Dynamic decorative architectural advice banner */}
              <div className="p-5 rounded-2xl bg-solar-light/90 border border-solar-border space-y-3 mt-6">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-solar-emerald font-bold uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5" />
                  Visual Cohesion Axiom
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  We maintain zero visual clutter by routing all smart low-voltage telemetry wires inside architectural gaps.
                </p>
              </div>

            </div>

            {/* Right side column: active project detail panel */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProjectIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-solar-light/40 rounded-3xl border border-solar-border overflow-hidden shadow-2xl"
                >
                  {/* Rich zoomed image with transitions */}
                  <div className="relative h-72 md:h-96 w-full overflow-hidden bg-solar-dark border-b border-solar-border group">
                    <img
                      src={exclusiveProjects[activeProjectIndex].image}
                      alt={exclusiveProjects[activeProjectIndex].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                    />
                    
                    {/* Floating location tag */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-solar-dark/80 text-white border border-white/10 backdrop-blur-md font-mono text-[10px]">
                      <MapPin className="w-3 h-3 text-solar-gold" />
                      {exclusiveProjects[activeProjectIndex].location}
                    </div>

                    {/* Solar badge efficiency indicator */}
                    <div className="absolute bottom-4 right-4 bg-solar-gold text-solar-dark font-mono text-[10px] font-bold px-3 py-1.5 rounded-md shadow-lg border border-black/15">
                      System Peak: {exclusiveProjects[activeProjectIndex].peakPower}
                    </div>
                  </div>

                  {/* Active Slide Specs */}
                  <div className="p-8 space-y-6 text-left">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-solar-border pb-4 gap-2">
                      <div>
                        <span className="font-mono text-[9px] text-solar-emerald uppercase tracking-wider block font-bold">Premium Portfolio Slide</span>
                        <h3 className="font-serif text-3xl font-bold text-solar-dark">
                          {exclusiveProjects[activeProjectIndex].title}
                        </h3>
                      </div>
                      <span className="text-[11px] text-solar-emerald font-mono bg-white border border-solar-border px-3 py-1 rounded-sm shadow-xs inline-block">
                        Active Storage: {exclusiveProjects[activeProjectIndex].batteryCapacity}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-500 leading-relaxed">
                      {exclusiveProjects[activeProjectIndex].description}
                    </p>

                    {/* Highlight Spec parameters block */}
                    <div className="bg-white p-4 rounded-xl border border-solar-border shadow-xs border-l-4 border-l-solar-emerald">
                      <span className="font-mono text-[9px] text-solar-emerald uppercase tracking-widest block font-bold mb-1">
                        Environmental Cohesion Matrix
                      </span>
                      <p className="text-[11px] text-slate-500 italic">
                        "{exclusiveProjects[activeProjectIndex].highlightText}"
                      </p>
                    </div>

                    {/* Specs columns */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="bg-white p-3.5 rounded-xl border border-solar-border text-center">
                        <span className="font-mono text-[8px] text-slate-400 block uppercase">Conversion Eff.</span>
                        <span className="font-serif text-lg font-bold text-solar-dark block mt-1">
                          {exclusiveProjects[activeProjectIndex].efficiency}
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-solar-border text-center">
                        <span className="font-mono text-[8px] text-slate-400 block uppercase">Yearly Generation</span>
                        <span className="font-serif text-lg font-bold text-solar-emerald block mt-1 font-bold">
                          {exclusiveProjects[activeProjectIndex].annualYield}
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-solar-border text-center">
                        <span className="font-mono text-[8px] text-slate-400 block uppercase">Yearly Carbon Offset</span>
                        <span className="font-serif text-lg font-bold text-solar-gold block mt-1">
                          {exclusiveProjects[activeProjectIndex].co2Offset}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="font-sans text-[10px] text-slate-400 italic">
                        *All specifications audited and guaranteed by Solar Nova.
                      </span>
                      <button
                        onClick={scrollToContact}
                        className="py-2 px-4 rounded-full border border-solar-emerald hover:bg-solar-emerald hover:text-white text-solar-emerald transition-all font-mono text-[10px] cursor-pointer flex items-center gap-1"
                      >
                        Model Similar Microgrid <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* Concierge Consultation Portal - Sleek step-by-step ROI simulator & Private CAD Walkthrough Scheduler */}
      <section id="concierge-simulator" className="py-24 bg-solar-dark text-white relative scroll-mt-10">
        
        {/* Glow circles */}
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] bg-radial from-solar-accent/10 to-transparent blur-3xl rounded-full z-0 pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-96 bg-radial from-solar-gold/15 to-transparent blur-3xl rounded-full z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="font-mono text-xs text-solar-gold font-bold tracking-widest uppercase block">
              Direct Architectural CAD Concierge
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Concierge Consultation Portal
            </h2>
            <p className="font-sans text-sm text-slate-350 max-w-xl mx-auto">
              Simulate true off-grid autonomy investments, customize battery reserves, and book private slots for direct CAD blueprint walkthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (8 cols): Step-by-Step ROI Simulator and details */}
            <div className="lg:col-span-8 bg-solar-deep/90 border border-solar-emerald/30 rounded-3xl p-6 md:p-8 space-y-8 relative overflow-hidden backdrop-blur-md">
              
              {/* Steps Progress Indicator */}
              <div className="border-b border-solar-emerald/20 pb-6 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] text-solar-accent uppercase block tracking-widest font-bold">Portal Calibration</span>
                  <p className="font-serif text-lg font-bold">ROI Investment Simulator</p>
                </div>
                
                {/* Step Indicators */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setPortalStep(step)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        portalStep === step
                          ? "bg-solar-gold text-solar-dark font-bold scale-110"
                          : portalStep > step
                          ? "bg-solar-emerald text-white"
                          : "bg-solar-dark text-slate-400 border border-white/5"
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1: Profile Selection */}
              {portalStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-solar-gold" />
                    Configure Your Profile Target
                  </h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">
                    Identify your residence architectural category. Our simulator calibrates storage capacity multipliers and low-reflective guidelines dynamically based on physical zoning parameters.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Profile Option 1: Villa */}
                    <button
                      type="button"
                      onClick={() => setClientProfile("villa")}
                      className={`p-5 rounded-xl text-left border cursor-pointer transition-all ${
                        clientProfile === "villa"
                          ? "bg-solar-emerald/30 border-solar-accent text-white"
                          : "bg-solar-dark/50 border-white/5 text-slate-300 hover:bg-solar-emerald/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-base font-semibold">Residential Architectural Villa</span>
                        <Home className="w-4.5 h-4.5 text-solar-gold" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Optimized for modern town home designs and multi-story suburban mansions. Max efficiency roof matching.
                      </p>
                    </button>

                    {/* Profile Option 2: Coastal Estate */}
                    <button
                      type="button"
                      onClick={() => setClientProfile("estate")}
                      className={`p-5 rounded-xl text-left border cursor-pointer transition-all ${
                        clientProfile === "estate"
                          ? "bg-solar-emerald/30 border-solar-accent text-white"
                          : "bg-solar-dark/50 border-white/5 text-slate-300 hover:bg-solar-emerald/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-base font-semibold">Coastal Waterfront Estate</span>
                        <MapPin className="w-4.5 h-4.5 text-solar-accent" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Calibrated for intense salt-water vapor resistance and elevated marine low-reflective structural standards.
                      </p>
                    </button>

                    {/* Profile Option 3: Urban Penthouse */}
                    <button
                      type="button"
                      onClick={() => setClientProfile("penthouse")}
                      className={`p-5 rounded-xl text-left border cursor-pointer transition-all ${
                        clientProfile === "penthouse"
                          ? "bg-solar-emerald/30 border-solar-accent text-white"
                          : "bg-solar-dark/50 border-white/5 text-slate-300 hover:bg-solar-emerald/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-base font-semibold">Urban Off-Grid Penthouse</span>
                        <Zap className="w-4.5 h-4.5 text-solar-gold" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Optimizes localized limited roof layouts. Uses low-weight structural mounts bypass layouts.
                      </p>
                    </button>

                    {/* Profile Option 4: Mountain Lodge */}
                    <button
                      type="button"
                      onClick={() => setClientProfile("lodge")}
                      className={`p-5 rounded-xl text-left border cursor-pointer transition-all ${
                        clientProfile === "lodge"
                          ? "bg-solar-emerald/30 border-solar-accent text-white"
                          : "bg-solar-dark/50 border-white/5 text-slate-300 hover:bg-solar-emerald/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-base font-semibold">Mountain Retreat Lodge</span>
                        <Award className="w-4.5 h-4.5 text-solar-accent" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Heavy snow-shedding mount layout calibrated for sub-zero alpine conditions and critical heater load safety.
                      </p>
                    </button>

                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setPortalStep(2)}
                      className="px-6 py-3 bg-solar-gold text-solar-dark font-mono text-xs font-bold rounded-full hover:bg-white flex items-center gap-2 cursor-pointer transition-all hover-lift"
                    >
                      Next: Calibrate Utility Scales <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Bills and Consumption Scales */}
              {portalStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-solar-gold" />
                    Utility Scale & Storage Needs
                  </h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">
                    Set your approximate monthly municipal utility electrical expenditure. Off-grid systems are engineered to replace 100% of standard grid billing dynamically.
                  </p>

                  <div className="space-y-6 bg-solar-dark/50 p-6 rounded-xl border border-white/5">
                    
                    {/* Monthly Bill Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-mono text-xs text-slate-300 uppercase flex items-center gap-1.5">
                          Current Monthly Electricity Bill ($)
                        </label>
                        <span className="font-mono text-sm font-bold text-solar-gold">
                          ${monthlyBill} / month
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="1200"
                        step="25"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(Number(e.target.value))}
                        className="w-full accent-solar-gold h-1.5 bg-solar-emerald/40 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>$50 (Minimal)</span>
                        <span>$450 (Suburban standard)</span>
                        <span>$1200+ (Grand Manor)</span>
                      </div>
                    </div>

                    {/* Integrated Storage Battery Toggles */}
                    <div className="border-t border-solar-emerald/10 pt-6 space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Battery className="w-5 h-5 text-solar-accent" />
                          <div>
                            <span className="font-serif text-sm font-semibold text-white block">
                              Include Modular LFP Battery Storage?
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Critical for continuous off-grid autonomy and night-cycle power retention.
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIncludeStorage(!includeStorage)}
                          className={`w-14 h-8 rounded-full transition-all relative flex items-center p-1 cursor-pointer ${
                            includeStorage ? "bg-solar-accent" : "bg-solar-forest"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full bg-white block transition-all shadow-md ${
                            includeStorage ? "translate-x-6" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      {includeStorage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="pl-8 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"
                        >
                          <div>
                            <label className="font-mono text-[10px] text-slate-350 uppercase block mb-1">
                              Quantity of LFP Storage Blocks (13.5 kWh each):
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={batteryUnits <= 1}
                                onClick={() => setBatteryUnits(batteryUnits - 1)}
                                className="w-8 h-8 rounded-lg bg-solar-dark hover:bg-solar-emerald flex items-center justify-center border border-white/10 disabled:opacity-30 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-mono font-bold text-white text-base w-10 text-center">
                                {batteryUnits} Units
                              </span>
                              <button
                                type="button"
                                disabled={batteryUnits >= 6}
                                onClick={() => setBatteryUnits(batteryUnits + 1)}
                                className="w-8 h-8 rounded-lg bg-solar-dark hover:bg-solar-emerald flex items-center justify-center border border-white/10 disabled:opacity-30 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-[9px] text-slate-400 block uppercase">Total Usable Storage Capacity</span>
                            <span className="font-serif text-xl font-bold text-solar-gold">
                              {(batteryUnits * 13.5).toFixed(1)} kWh LFP Backup
                            </span>
                          </div>
                        </motion.div>
                      )}

                    </div>

                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setPortalStep(1)}
                      className="px-6 py-3 bg-solar-forest hover:bg-solar-emerald text-white font-mono text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setPortalStep(3)}
                      className="px-6 py-3 bg-solar-gold text-solar-dark font-mono text-xs font-bold rounded-full hover:bg-white flex items-center gap-2 cursor-pointer transition-all hover-lift"
                    >
                      Next: Inspect ROI Projections <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Complete Results & Calibration */}
              {portalStep === 3 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-solar-accent" />
                    System Analysis & Payback Projection
                  </h3>
                  <p className="font-sans text-xs text-slate-350 leading-relaxed text-left">
                    Your luxury solar customizer variables have been fully cross-referenced. Below are estimated system costs, payback periods, and architectural autonomy yields.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Return on Investment Period block */}
                    <div className="bg-solar-dark/60 p-4 rounded-xl border border-white/5 text-left">
                      <span className="font-mono text-[8px] text-slate-400 block uppercase">Payback Period</span>
                      <span className="font-serif text-2xl md:text-3xl font-extrabold text-solar-accent block mt-1">
                        {simulatedRoi.payback} <span className="text-white text-xs">Years</span>
                      </span>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1">Average 12%-15% yearly compounding return.</p>
                    </div>

                    {/* Autonomy Percentage */}
                    <div className="bg-solar-dark/60 p-4 rounded-xl border border-white/5 text-left">
                      <span className="font-mono text-[8px] text-slate-400 block uppercase">Power Autonomy Rate</span>
                      <span className="font-serif text-2xl md:text-3xl font-extrabold text-solar-gold block mt-1">
                        {simulatedRoi.independence}%
                      </span>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1">Percentage offset from municipal energy dependency.</p>
                    </div>

                    {/* Total Estimated Investment block */}
                    <div className="bg-solar-dark/60 p-4 rounded-xl border border-white/5 text-left">
                      <span className="font-mono text-[8px] text-slate-400 block uppercase">Est Total Investment</span>
                      <span className="font-serif text-2xl md:text-3xl font-extrabold text-white block mt-1 font-bold">
                        ${simulatedRoi.investment.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1">Includes all custom architectural drafting and mounting.</p>
                    </div>

                  </div>

                  {/* Dynamic checklist warning badge */}
                  <div className="p-4 rounded-xl bg-solar-emerald/20 border border-solar-accent/20 flex gap-3 text-left">
                    <Info className="w-5 h-5 text-solar-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[9px] text-solar-gold uppercase block font-bold leading-normal">White-Glove Federal Rebate Incentive Included</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        Prices are simulated before taking advantage of local federal photovoltaic tax credits (up to 30% reduction). Our concierge legal team processes this turnkey on your behalf!
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setPortalStep(2)}
                      className="px-6 py-3 bg-solar-forest hover:bg-solar-emerald text-white font-mono text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer transition-all"
                    >
                      ← Back
                    </button>
                    
                    <button
                      onClick={() => {
                        // Automatically focus/scroll the scheduler container
                        const target = document.getElementById("scheduler-box");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                          setSuccessBanner("🎉 Simulator variables loaded! Fill out your appointment detail on the right.");
                          setTimeout(() => setSuccessBanner(null), 3000);
                        }
                      }}
                      className="px-6 py-3 bg-solar-accent hover:bg-white hover:text-solar-dark text-white font-mono text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer transition-all hover-lift border border-solar-accent/30"
                    >
                      Submit To Advisor Appointment →
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (4 cols): Sleek Walkthrough Scheduler & Success Ticket */}
            <div id="scheduler-box" className="lg:col-span-4 bg-white border border-solar-border text-slate-800 rounded-3xl p-6 shadow-2xl relative">
              
              {/* Solid-Capped border aesthetic */}
              <div className="absolute top-0 inset-x-0 h-2 bg-solar-gold rounded-t-3xl" />
              
              {!bookingConfirmed ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                  <div className="border-b border-solar-border pb-3 mb-3">
                    <span className="font-mono text-[9px] text-solar-emerald uppercase block font-bold">Book Walkthrough Slot</span>
                    <h3 className="font-serif text-xl font-bold text-solar-dark">CAD Walkthrough</h3>
                    <p className="font-sans text-[10px] text-slate-500 mt-1">
                      Reserve a highly specialized digital CAD consultation session with our principal clean-energy home architects.
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Alexander Mercer"
                        required
                        className="w-full pl-9 pr-4 py-2 text-xs border border-solar-border rounded-lg bg-solar-light text-slate-800 focus:outline-none focus:border-solar-accent"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="alexander@mercerestates.com"
                        required
                        className="w-full pl-9 pr-4 py-2 text-xs border border-solar-border rounded-lg bg-solar-light text-slate-800 focus:outline-none focus:border-solar-accent"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (310) 902-3904"
                        className="w-full pl-9 pr-4 py-2 text-xs border border-solar-border rounded-lg bg-solar-light text-slate-800 focus:outline-none focus:border-solar-accent"
                      />
                    </div>
                  </div>

                  {/* Appointment Date */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-solar-border rounded-lg bg-solar-light text-slate-800 focus:outline-none focus:border-solar-accent"
                      />
                    </div>
                  </div>

                  {/* Preferred Time block choice */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Preferred Block TimeSlot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: "10:00", lbl: "Morning" },
                        { val: "14:00", lbl: "Afternoon" },
                        { val: "17:00", lbl: "Evening" }
                      ].map((t) => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, timeSlot: t.val }))}
                          className={`py-2 px-1 text-[10px] font-mono text-center rounded-lg border transition-all cursor-pointer ${
                            formData.timeSlot === t.val
                              ? "bg-solar-emerald text-white border-solar-emerald"
                              : "bg-solar-light text-slate-600 border-solar-border hover:bg-slate-200"
                          }`}
                        >
                          {t.val} ({t.lbl})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specific requirements */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                      Acreage/Mounting Requirements...
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Clay tile retrofitting required. Defer microinverter locations to crawlspace."
                      className="w-full p-2 text-xs border border-solar-border rounded-lg bg-solar-light text-slate-800 focus:outline-none focus:border-solar-accent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-solar-emerald hover:bg-solar-dark text-white font-mono text-xs uppercase font-extrabold tracking-widest rounded-xl hover-lift cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    Lock Premium Appointment <ArrowUpRight className="w-4 h-4 text-solar-gold" />
                  </button>

                  <span className="font-mono text-[9px] text-slate-400 block text-center mt-2 leading-none">
                    NO CREDITS CARD REQUIRED • Turnkey CAD drafting included.
                  </span>
                </form>
              ) : (
                /* Dynamic visual high touch Booking ticket */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5 text-left"
                >
                  <div className="border-b border-solar-border pb-4 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-solar-emerald/10 text-solar-emerald flex items-center justify-center mb-2">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="font-mono text-[9px] text-solar-accent uppercase tracking-widest font-bold">Autonomy Confirmed</span>
                    <h3 className="font-serif text-xl font-bold text-solar-dark">Your CAD Session Ticket</h3>
                  </div>

                  {/* Main Ticket Body Grid */}
                  <div className="p-4 rounded-xl bg-solar-light border border-solar-border text-[11px] font-mono space-y-2 relative overflow-hidden">
                    
                    {/* Background decor */}
                    <div className="absolute top-2 right-2 opacity-5">
                      <Sun className="w-16 h-16 ml-3 text-solar-emerald" />
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">SESSION ID:</span>
                      <span className="font-bold text-solar-emerald">{bookingTicket.id}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">PATRON:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{bookingTicket.name}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">DATE:</span>
                      <span className="font-bold text-slate-800">{bookingTicket.date}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">TIMESLOT:</span>
                      <span className="font-semibold text-slate-800">{bookingTicket.time} PST</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">FINISH SELECTED:</span>
                      <span className="font-bold text-solar-amber">{bookingTicket.panelFinish}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">EST PAYBACK:</span>
                      <span className="font-bold text-solar-accent">{bookingTicket.estimatedRoi} Years</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-300/60 pb-1.5">
                      <span className="text-slate-400">AUTONOMY TARGET:</span>
                      <span className="font-bold text-solar-accent">{bookingTicket.independence}%</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">BACKUP RESERVED:</span>
                      <span className="font-bold text-slate-800">{bookingTicket.batteryCapacity} kWh LFP</span>
                    </div>

                  </div>

                  {/* QR code simulation widget */}
                  <div className="flex items-center gap-3 bg-solar-light p-3.5 rounded-lg border border-solar-border">
                    {/* Simulated SVG QR */}
                    <svg viewBox="0 0 100 100" className="w-12 h-12 bg-white p-1 border border-solar-border shrink-0">
                      <path d="M0 0h30v10H10v20H0zm70 0h30v30H90V10H70zm0 70h20v20H70v-10h10V80H70zm-70 10v10h30V90H10V70H0zm20-50h20v10H20zm10 20h20v10H30zm30-20h10v10H60zm0 20h10v10H60z" fill="currentColor" />
                    </svg>
                    <div>
                      <span className="text-[10px] font-bold text-solar-dark uppercase block">Secure Verification Pass</span>
                      <p className="text-[9px] text-slate-400 leading-normal">
                        Show this barcode pass during your virtual CAD walk to load preconfigured microgrid parameters.
                      </p>
                    </div>
                  </div>

                  {/* Secondary buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="py-2.5 rounded-lg border border-solar-border text-center font-mono text-[10px] hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Print Confirmation
                    </button>
                    <button
                      onClick={() => setBookingConfirmed(false)}
                      className="py-2.5 rounded-lg bg-solar-emerald hover:bg-solar-dark text-white text-center font-mono text-[10px] uppercase font-bold cursor-pointer"
                    >
                      Configure New ROI
                    </button>
                  </div>

                </motion.div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Pristine Solar Design Footer */}
      <footer className="bg-solar-dark text-slate-300 pt-16 pb-8 border-t border-solar-forest/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Logo and branding statement */}
            <div className="md:col-span-4 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-solar-deep border border-solar-gold/40 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-solar-gold animate-spin-slow" />
                </div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight leading-none block">
                  Solar<span className="text-solar-gold">Nova</span>
                </span>
              </div>
              <p className="font-sans text-xs text-slate-400 leading-normal max-w-sm">
                Solar Nova designs bespoke architectural solar panel finishes, integrated microgrids, and off-grid high-touch storage autonomy layers across global estates and residences.
              </p>
            </div>

            {/* Quick Links Column 1 */}
            <div className="md:col-span-2 space-y-3 text-left">
              <span className="font-mono text-[10px] text-white uppercase tracking-wider block font-bold">Solutions</span>
              <ul className="space-y-1.5 font-sans text-xs text-slate-400">
                <li><a href="#customizer" className="hover:text-solar-accent transition-colors">Our Customizer Studio</a></li>
                <li><a href="#customizer" className="hover:text-solar-accent transition-colors">Surface Finishes</a></li>
                <li><a href="#why-nova" className="hover:text-solar-accent transition-colors">Photovoltaic Tiles</a></li>
                <li><a href="#concierge-simulator" className="hover:text-solar-accent transition-colors">Microgrids Integration</a></li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div className="md:col-span-2 space-y-3 text-left">
              <span className="font-mono text-[10px] text-white uppercase tracking-wider block font-bold">Why Nova</span>
              <ul className="space-y-1.5 font-sans text-xs text-slate-400">
                <li><a href="#why-nova" className="hover:text-solar-accent transition-colors">Premium Reliability</a></li>
                <li><a href="#why-nova" className="hover:text-solar-accent transition-colors">Integrated Materials</a></li>
                <li><a href="#projects" className="hover:text-solar-accent transition-colors">Exclusive Showcase</a></li>
                <li><a href="#why-nova" className="hover:text-solar-accent transition-colors">White-Glove Turnkey</a></li>
              </ul>
            </div>

            {/* Quick Links Column 3 */}
            <div className="md:col-span-2 space-y-3 text-left">
              <span className="font-mono text-[10px] text-white uppercase tracking-wider block font-bold">Autonomy</span>
              <ul className="space-y-1.5 font-sans text-xs text-slate-400">
                <li><a href="#concierge-simulator" className="hover:text-solar-accent transition-colors">Savings Simulator</a></li>
                <li><a href="#concierge-simulator" className="hover:text-solar-accent transition-colors">LFP Storage Config</a></li>
                <li><a href="#concierge-simulator" className="hover:text-solar-accent transition-colors">Blueprint walk-through</a></li>
                <li><a href="#concierge-simulator" className="hover:text-solar-accent transition-colors">Tax Incentives Process</a></li>
              </ul>
            </div>

            {/* Legal / Contact details */}
            <div className="md:col-span-2 space-y-3 text-left">
              <span className="font-mono text-[10px] text-white uppercase tracking-wider block font-bold">CAD Concierge</span>
              <p className="font-sans text-xs text-slate-400 leading-normal">
                Private office appointments matching structural microgrids coordinates.
              </p>
              <button 
                onClick={scrollToContact}
                className="font-mono text-xs text-solar-gold hover:text-white cursor-pointer underline flex items-center gap-1.5 pt-1"
              >
                Schedule CAD Slot <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          <div className="pt-8 border-t border-solar-emerald/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-550 gap-4">
            <p className="font-mono text-slate-400">
              © 2026 Solar Nova Inc. All rights reserved. • Hand-crafted premium ecological solar system.
            </p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-solar-accent transition-colors">Zoning Privacy SLA</a>
              <a href="#terms" className="hover:text-solar-accent transition-colors">Off-grid guarantee</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
