import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { StorageClient } from "../utils/StorageClient";

const WHATSAPP_NUMBER = "919799341917";
const PHONE_NUMBER = "+91 97993 41917";
const PHONE_TEL = "tel:+919799341917";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const ADDRESS = "C4G2+CRQ, Muriya Road, Jatav Mohalla, Nagar, Rajasthan 321205";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Custom Design", href: "#design" },
  { label: "Contact", href: "#contact" },
];

const GALLERY_ITEMS = [
  {
    src: "/assets/generated/gallery-bed.dim_600x450.jpg",
    category: "Beds",
    alt: "Wooden double bed",
  },
  {
    src: "/assets/generated/gallery-bed2.dim_600x450.jpg",
    category: "Beds",
    alt: "King-size bed with storage",
  },
  {
    src: "/assets/generated/gallery-chair.dim_600x450.jpg",
    category: "Chairs",
    alt: "Handcrafted dining chair",
  },
  {
    src: "/assets/generated/gallery-chair2.dim_600x450.jpg",
    category: "Chairs",
    alt: "Wooden rocking chair",
  },
  {
    src: "/assets/generated/gallery-table.dim_600x450.jpg",
    category: "Tables",
    alt: "Solid wood dining table",
  },
  {
    src: "/assets/generated/gallery-cupboard.dim_600x450.jpg",
    category: "Cupboards",
    alt: "Carved wooden wardrobe",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    location: "Deeg, Rajasthan",
    rating: 5,
    review:
      "Excellent quality furniture! Kartik ji made our bedroom set exactly as we imagined. Very professional and on-time delivery.",
  },
  {
    name: "Priya Sharma",
    location: "Bharatpur, Rajasthan",
    rating: 5,
    review:
      "Got our complete kitchen cabinets done. The plywood work is outstanding and the finishing is superb. Highly recommend!",
  },
  {
    name: "Amit Patel",
    location: "Brajnagar, Rajasthan",
    rating: 5,
    review:
      "Best wooden doors in the area. Strong, beautiful, and reasonably priced. Will definitely order again.",
  },
  {
    name: "Sunita Devi",
    location: "Deeg, Rajasthan",
    rating: 5,
    review:
      "They repaired our old dining table and it looks brand new. Honest pricing and great craftsmanship.",
  },
  {
    name: "Vikas Sharma",
    location: "Mathura, UP",
    rating: 5,
    review:
      "Custom sofa set made to our exact specifications. The quality of wood and fabric is top notch. Very satisfied!",
  },
];

const SERVICES = [
  {
    icon: "🪑",
    title: "Custom Furniture",
    desc: "Bespoke furniture tailored to your exact measurements, style, and budget — made to last generations.",
  },
  {
    icon: "🚪",
    title: "Wooden Doors",
    desc: "Solid wood and engineered doors in custom sizes and finishes, crafted to enhance every entrance.",
  },
  {
    icon: "🪵",
    title: "Plywood Work",
    desc: "Modular cabinets, wardrobes, and interior woodwork using premium quality plywood and laminates.",
  },
  {
    icon: "🔧",
    title: "Furniture Repair",
    desc: "Expert restoration and repair services to breathe new life into your cherished old furniture.",
  },
];

// ── Design Wizard constants ──────────────────────────────────────────────────

interface WizardImageItem {
  file: File;
  preview: string;
  url: string | null;
  loading: boolean;
  error: boolean;
}

const FURNITURE_TYPES = [
  {
    label: "Bed",
    icon: "🛏️",
    preview: "/assets/generated/preview-bed.dim_600x400.jpg",
  },
  {
    label: "Chair",
    icon: "🪑",
    preview: "/assets/generated/preview-chair.dim_600x400.jpg",
  },
  {
    label: "Table",
    icon: "🪵",
    preview: "/assets/generated/preview-table.dim_600x400.jpg",
  },
  {
    label: "Cupboard",
    icon: "🗄️",
    preview: "/assets/generated/preview-cupboard.dim_600x400.jpg",
  },
  {
    label: "Door",
    icon: "🚪",
    preview: "/assets/generated/preview-door.dim_600x400.jpg",
  },
];

const WIZARD_MATERIALS = [
  "Sheesham Wood",
  "Teak Wood",
  "Plywood",
  "MDF",
  "Pine Wood",
  "Other",
];

const WIZARD_BUDGETS = [
  "Under ₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "₹50,000–₹1,00,000",
  "Above ₹1,00,000",
];

const WIZARD_STEPS = [
  "Furniture Type",
  "Dimensions",
  "Your Details",
  "Upload Images",
  "Review & Submit",
];

// Bridge type for design request API (backend.ts is regenerated separately)
interface DesignRequestSubmission {
  name: string;
  phone: string;
  city: string;
  furnitureType: string;
  dimensionLength: string;
  dimensionWidth: string;
  dimensionHeight: string;
  material: string;
  color: string;
  budget: string;
  description: string;
  imageURLs: string[];
}

interface DesignActorBridge {
  submitDesignRequest(s: DesignRequestSubmission): Promise<bigint>;
}

async function uploadImageToStorage(file: File): Promise<string> {
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { hash } = await storageClient.putFile(bytes);
  return await storageClient.getDirectURL(hash);
}

// ── Reusable star rating ─────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static star list
        <span key={i} className="text-gold text-lg">
          ★
        </span>
      ))}
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-cream/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <span className="text-2xl">🪑</span>
            <div>
              <span className="font-heading text-lg md:text-xl font-bold text-brown-deep block leading-tight">
                Kartik Furniture House
              </span>
              <span className="text-xs text-brown-mid hidden sm:block">
                Since Years, Crafting Excellence
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brown-mid hover:text-brown-deep transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-gold after:transition-all"
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#enquiry"
              className="bg-gold text-brown-deep text-sm font-bold px-5 py-2 rounded-full hover:bg-gold-dark transition-colors"
              data-ocid="nav.get_quote.button"
            >
              Get Quote
            </a>
          </nav>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-brown-deep"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-beige">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block py-3 px-2 text-brown-mid hover:text-brown-deep hover:bg-beige transition-colors text-base font-medium"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                document
                  .getElementById("enquiry")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="block mt-2 w-full bg-gold text-brown-deep text-center font-bold px-5 py-3 rounded-full"
            >
              Get Free Quote
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-brown-deep"
      style={{
        backgroundImage:
          "url('/assets/generated/hero-banner.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-brown-deep/60" aria-hidden="true" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
          ✦ Welcome to Kartik Furniture House ✦
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Strong &amp; Custom Furniture
          <span className="block text-gold">Made with Trust</span>
        </h1>
        <p className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Quality craftsmanship, handcrafted with care — trusted by families
          across Deeg &amp; nearby cities for custom furniture, wooden doors,
          plywood work &amp; more.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <a
            href={PHONE_TEL}
            data-ocid="hero.call_button"
            className="inline-flex items-center justify-center gap-2 bg-gold text-brown-deep font-bold text-lg px-8 py-4 rounded-full hover:bg-gold-dark hover:scale-105 transition-all shadow-lg"
          >
            <span aria-hidden="true">📞</span> Call Now: 9799341917
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.whatsapp_button"
            className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-lg"
          >
            <span aria-hidden="true">💬</span> WhatsApp Us
          </a>
          <a
            href="#design"
            data-ocid="hero.design_button"
            className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold font-bold text-lg px-8 py-4 rounded-full hover:bg-gold hover:text-brown-deep hover:scale-105 transition-all"
          >
            <span aria-hidden="true">✏️</span> Design Your Furniture
          </a>
        </div>
        <div className="mt-16 animate-bounce">
          <a
            href="#about"
            className="text-white/60 hover:text-gold transition-colors"
            aria-label="Scroll to About section"
          >
            <span className="sr-only">Scroll to About section</span>
            <svg
              aria-hidden="true"
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
              Our Story
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-6">
              About Kartik Furniture House
            </h2>
            <p className="text-brown-mid leading-relaxed mb-5 text-base sm:text-lg">
              At Kartik Furniture House, we are a family-run business based in
              Brajnagar, Deeg with a rich tradition of woodworking spanning over
              a decade. Every piece of furniture we craft tells a story of
              dedication, passion, and mastery of the craft.
            </p>
            <p className="text-brown-mid leading-relaxed mb-8 text-base sm:text-lg">
              We believe great furniture is more than just wood and nails — it
              is an expression of your personal style. Our skilled craftsmen use
              only the finest quality materials to create pieces that stand the
              test of time, tailored exactly to your needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#enquiry"
                className="bg-brown-deep text-cream font-bold px-7 py-3 rounded-full hover:bg-brown-mid transition-colors"
              >
                Get Free Quote
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-brown-deep text-brown-deep font-bold px-7 py-3 rounded-full hover:bg-brown-deep hover:text-cream transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { num: "10+", label: "Years of Experience" },
              { num: "500+", label: "Happy Customers" },
              { num: "100%", label: "Custom Made" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-beige rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gold/20"
              >
                <div className="font-heading text-4xl font-bold text-gold mb-2">
                  {stat.num}
                </div>
                <div className="text-brown-mid font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services Section ─────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            What We Do
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep">
            Our Services
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group border border-transparent hover:border-gold/20"
            >
              <div className="w-16 h-16 bg-gold/10 group-hover:bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-5 transition-colors">
                <span className="text-3xl" aria-hidden="true">
                  {service.icon}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-brown-deep mb-3">
                {service.title}
              </h3>
              <p className="text-brown-mid text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Gallery Section ──────────────────────────────────────────────────────────

function GallerySection() {
  const categories = ["All", "Beds", "Chairs", "Tables", "Cupboards"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Portfolio
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep">
            Our Work
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-gold text-brown-deep shadow-md"
                  : "bg-beige text-brown-mid hover:bg-gold/20 hover:text-brown-deep"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.src}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-sm hover:shadow-xl transition-shadow"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brown-deep/0 group-hover:bg-brown-deep/30 transition-all duration-300 flex items-end">
                <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full p-4">
                  <span className="text-white text-sm font-medium">
                    {item.alt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ─────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep">
            What Our Customers Say
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-beige"
            >
              <div
                className="text-5xl text-gold/20 font-heading leading-none mb-4"
                aria-hidden="true"
              >
                &#8220;
              </div>
              <p className="font-heading italic text-brown-mid text-base leading-relaxed mb-6">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-brown-deep">{t.name}</p>
                  <p className="text-sm text-brown-mid">{t.location}</p>
                </div>
                <StarRating count={t.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Design Wizard Section ────────────────────────────────────────────────────

function DesignWizardSection() {
  const { actor } = useActor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<WizardImageItem[]>([]);

  const [step, setStep] = useState(1);
  const [furnitureType, setFurnitureType] = useState("");
  const [dimensionLength, setDimensionLength] = useState("");
  const [dimensionWidth, setDimensionWidth] = useState("");
  const [dimensionHeight, setDimensionHeight] = useState("");
  const [material, setMaterial] = useState(WIZARD_MATERIALS[0]);
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState(WIZARD_BUDGETS[0]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<WizardImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Keep ref in sync for cleanup on unmount
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      for (const img of imagesRef.current) URL.revokeObjectURL(img.preview);
    };
  }, []);

  const inputClass =
    "w-full border border-beige bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold text-brown-deep placeholder-brown-mid/50 transition-colors";
  const selectClass = `${inputClass} cursor-pointer`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems: WizardImageItem[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: null,
      loading: false,
      error: false,
    }));
    setImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleUploadImages = async () => {
    const hasPending = images.some((img) => !img.url && !img.loading);
    if (!hasPending) return;

    setImages((prev) =>
      prev.map((img) =>
        !img.url && !img.loading ? { ...img, loading: true } : img,
      ),
    );

    await Promise.all(
      images.map(async (img, idx) => {
        if (img.url || img.loading) return;
        try {
          const url = await uploadImageToStorage(img.file);
          setImages((prev) =>
            prev.map((item, i) =>
              i === idx ? { ...item, url, loading: false } : item,
            ),
          );
        } catch {
          setImages((prev) =>
            prev.map((item, i) =>
              i === idx ? { ...item, loading: false, error: true } : item,
            ),
          );
        }
      }),
    );
  };

  const handleSubmit = async () => {
    if (!actor) {
      toast.error("Connection not ready. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      const uploadedURLs = await Promise.all(
        images.map(async (img) => {
          if (img.url) return img.url;
          try {
            return await uploadImageToStorage(img.file);
          } catch {
            return null;
          }
        }),
      );

      await (actor as unknown as DesignActorBridge).submitDesignRequest({
        name,
        phone,
        city,
        furnitureType,
        dimensionLength,
        dimensionWidth,
        dimensionHeight,
        material,
        color,
        budget,
        description,
        imageURLs: uploadedURLs.filter((u): u is string => u !== null),
      });

      setSubmitted(true);
      toast.success("Design request submitted! We\u2019ll contact you soon.");

      setTimeout(() => {
        for (const img of images) URL.revokeObjectURL(img.preview);
        setImages([]);
        setStep(1);
        setFurnitureType("");
        setDimensionLength("");
        setDimensionWidth("");
        setDimensionHeight("");
        setMaterial(WIZARD_MATERIALS[0]);
        setColor("");
        setName("");
        setPhone("");
        setCity("");
        setBudget(WIZARD_BUDGETS[0]);
        setDescription("");
        setSubmitted(false);
      }, 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hi, I want to design a custom ${furnitureType}. Dimensions: ${
      dimensionLength || "—"
    }\u00d7${dimensionWidth || "—"}\u00d7${dimensionHeight || "—"} cm. Material: ${material}. Color/Finish: ${
      color || "—"
    }. Budget: ${budget}. Name: ${name}, Phone: ${phone}, City: ${city}. Description: ${
      description || "—"
    }`;
    window.open(
      `https://wa.me/919799341917?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const validateStep3 = () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    return true;
  };

  // ── Step renderers ───────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div>
      <h3 className="font-heading text-xl font-bold text-brown-deep mb-2">
        Choose Furniture Type
      </h3>
      <p className="text-brown-mid text-sm mb-6">
        Tap a furniture type to get started
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {FURNITURE_TYPES.map((type) => (
          <button
            key={type.label}
            type="button"
            data-ocid="design.furniture_type.tab"
            onClick={() => {
              setFurnitureType(type.label);
              setStep(2);
            }}
            className={`group flex flex-col rounded-2xl overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
              furnitureType === type.label
                ? "border-gold shadow-md"
                : "border-beige hover:border-gold/50"
            }`}
          >
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={type.preview}
                alt={type.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div
              className={`py-2 text-center text-sm font-semibold transition-colors ${
                furnitureType === type.label
                  ? "bg-gold text-brown-deep"
                  : "bg-beige text-brown-mid group-hover:bg-gold/20 group-hover:text-brown-deep"
              }`}
            >
              <span aria-hidden="true">{type.icon}</span> {type.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 className="font-heading text-xl font-bold text-brown-deep mb-2">
        Dimensions &amp; Material
      </h3>
      <p className="text-brown-mid text-sm mb-6">
        Tell us the size and material for your{" "}
        <span className="font-semibold text-brown-deep">{furnitureType}</span>
      </p>
      <div className="space-y-5">
        <fieldset>
          <legend className="block text-sm font-semibold text-brown-deep mb-2">
            Dimensions (in cm)
          </legend>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <input
                type="number"
                value={dimensionLength}
                onChange={(e) => setDimensionLength(e.target.value)}
                placeholder="Length"
                min="0"
                className={inputClass}
                aria-label="Length in cm"
                data-ocid="design.dimension_length.input"
              />
              <p className="text-xs text-brown-mid mt-1 text-center">Length</p>
            </div>
            <div>
              <input
                type="number"
                value={dimensionWidth}
                onChange={(e) => setDimensionWidth(e.target.value)}
                placeholder="Width"
                min="0"
                className={inputClass}
                aria-label="Width in cm"
                data-ocid="design.dimension_width.input"
              />
              <p className="text-xs text-brown-mid mt-1 text-center">Width</p>
            </div>
            <div>
              <input
                type="number"
                value={dimensionHeight}
                onChange={(e) => setDimensionHeight(e.target.value)}
                placeholder="Height"
                min="0"
                className={inputClass}
                aria-label="Height in cm"
                data-ocid="design.dimension_height.input"
              />
              <p className="text-xs text-brown-mid mt-1 text-center">Height</p>
            </div>
          </div>
        </fieldset>
        <div>
          <label
            htmlFor="wizard-material"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            Material
          </label>
          <select
            id="wizard-material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className={selectClass}
            data-ocid="design.material.select"
          >
            {WIZARD_MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="wizard-color"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            Color / Finish{" "}
            <span className="font-normal text-brown-mid/70">(optional)</span>
          </label>
          <input
            id="wizard-color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Natural, Dark Walnut, White..."
            className={inputClass}
            data-ocid="design.color.input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 className="font-heading text-xl font-bold text-brown-deep mb-2">
        Your Details
      </h3>
      <p className="text-brown-mid text-sm mb-6">
        So we can reach out with a custom quote
      </p>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="wizard-name"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="wizard-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Full Name"
            required
            className={inputClass}
            data-ocid="design.name.input"
          />
        </div>
        <div>
          <label
            htmlFor="wizard-phone"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="wizard-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
            title="Please enter a 10-digit phone number"
            required
            className={inputClass}
            data-ocid="design.phone.input"
          />
        </div>
        <div>
          <label
            htmlFor="wizard-city"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="wizard-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Your City"
            required
            className={inputClass}
            data-ocid="design.city.input"
          />
        </div>
        <div>
          <label
            htmlFor="wizard-budget"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            Budget Range
          </label>
          <select
            id="wizard-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={selectClass}
            data-ocid="design.budget.select"
          >
            {WIZARD_BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="wizard-description"
            className="block text-sm font-semibold text-brown-deep mb-2"
          >
            Describe Your Idea{" "}
            <span className="font-normal text-brown-mid/70">(optional)</span>
          </label>
          <textarea
            id="wizard-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your custom idea, style preferences, special requirements..."
            rows={3}
            className={`${inputClass} resize-none`}
            data-ocid="design.description.textarea"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h3 className="font-heading text-xl font-bold text-brown-deep mb-2">
        Upload Reference Images
        <span className="font-normal text-base text-brown-mid ml-2">
          (Optional)
        </span>
      </h3>
      <p className="text-brown-mid text-sm mb-6">
        Add photos of styles you like — helps us understand your vision
      </p>

      {/* Hidden file input; label below triggers it */}
      <input
        ref={fileInputRef}
        id="wizard-file-input"
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleFileSelect}
        data-ocid="design.upload_button"
      />
      <label
        htmlFor="wizard-file-input"
        className="block border-2 border-dashed border-gold/40 rounded-2xl p-8 text-center hover:border-gold transition-colors cursor-pointer mb-5"
        data-ocid="design.dropzone"
      >
        <div className="text-4xl mb-3" aria-hidden="true">
          📸
        </div>
        <p className="text-brown-mid font-medium mb-1">
          Click to select images
        </p>
        <p className="text-brown-mid/60 text-sm">JPG, PNG, WEBP supported</p>
      </label>

      {images.length > 0 && (
        <div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {images.map((img, idx) => (
              <div key={img.preview} className="relative group">
                <img
                  src={img.preview}
                  alt={`Reference ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded-xl border-2 border-beige"
                />
                {img.loading && (
                  <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {img.url && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                )}
                {img.error && (
                  <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">❌</span>
                  </div>
                )}
                {!img.loading && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {images.some((img) => !img.url && !img.loading) && (
            <button
              type="button"
              onClick={handleUploadImages}
              className="w-full bg-brown-deep text-cream font-bold py-3 px-8 rounded-full hover:bg-brown-mid transition-colors mb-2"
            >
              ⬆️ Upload {images.filter((img) => !img.url && !img.loading).length}{" "}
              Image
              {images.filter((img) => !img.url && !img.loading).length !== 1
                ? "s"
                : ""}
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div>
      <h3 className="font-heading text-xl font-bold text-brown-deep mb-2">
        Review Your Request
      </h3>
      <p className="text-brown-mid text-sm mb-6">
        Check your details before submitting
      </p>

      <div className="bg-beige rounded-2xl p-5 space-y-4 mb-6">
        {/* Furniture type */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/60">
          <span className="text-3xl" aria-hidden="true">
            {FURNITURE_TYPES.find((t) => t.label === furnitureType)?.icon}
          </span>
          <div>
            <p className="text-xs text-brown-mid">Furniture Type</p>
            <p className="font-bold text-brown-deep text-lg">{furnitureType}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Dimensions</p>
            <p className="font-semibold text-brown-deep text-sm">
              {dimensionLength || "—"}&times;{dimensionWidth || "—"}&times;
              {dimensionHeight || "—"} cm
            </p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Material</p>
            <p className="font-semibold text-brown-deep text-sm">{material}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Color / Finish</p>
            <p className="font-semibold text-brown-deep text-sm">
              {color || "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Budget</p>
            <p className="font-semibold text-brown-deep text-sm">{budget}</p>
          </div>
        </div>

        {/* Customer details */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Name</p>
            <p className="font-semibold text-brown-deep text-sm">{name}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Phone</p>
            <p className="font-semibold text-brown-deep text-sm">{phone}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">City</p>
            <p className="font-semibold text-brown-deep text-sm">{city}</p>
          </div>
        </div>

        {description && (
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-brown-mid mb-0.5">Description</p>
            <p className="text-brown-deep text-sm">{description}</p>
          </div>
        )}

        {/* Image thumbnails */}
        {images.length > 0 && (
          <div>
            <p className="text-xs text-brown-mid mb-2">
              Reference Images ({images.length})
            </p>
            <div className="flex gap-2 flex-wrap">
              {images.slice(0, 6).map((img, idx) => (
                <img
                  key={img.preview}
                  src={img.preview}
                  alt={`Reference ${idx + 1}`}
                  className="w-14 h-14 object-cover rounded-lg border-2 border-beige"
                />
              ))}
              {images.length > 6 && (
                <div className="w-14 h-14 bg-white rounded-lg border-2 border-beige flex items-center justify-center text-brown-mid text-xs font-semibold">
                  +{images.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3" aria-hidden="true">
            🎉
          </div>
          <p className="font-heading text-xl font-bold text-brown-deep mb-2">
            Request Submitted!
          </p>
          <p className="text-brown-mid text-sm">
            We&apos;ll contact you shortly at {phone}.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-gold text-brown-deep font-bold py-4 px-8 rounded-full hover:bg-gold-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            data-ocid="design.submit_button"
          >
            {submitting ? "Submitting..." : "✅ Submit Request"}
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 bg-whatsapp text-white font-bold py-4 px-8 rounded-full hover:opacity-90 transition-opacity"
            data-ocid="design.whatsapp_button"
          >
            💬 Send via WhatsApp
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section id="design" className="py-20 bg-beige" data-ocid="design.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Custom Order
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-4">
            Design Your Furniture
          </h2>
          <p className="text-brown-mid text-base sm:text-lg max-w-xl mx-auto">
            Tell us your vision — we&apos;ll build it for you
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {WIZARD_STEPS.map((label, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static step list
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > idx + 1
                        ? "bg-gold text-brown-deep"
                        : step === idx + 1
                          ? "bg-brown-deep text-cream ring-2 ring-brown-deep ring-offset-2"
                          : "bg-beige text-brown-mid/50"
                    }`}
                  >
                    {step > idx + 1 ? "✓" : idx + 1}
                  </div>
                  <span className="text-xs mt-1 text-center text-brown-mid hidden sm:block leading-tight max-w-[60px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1.5 bg-beige rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-gold rounded-full transition-all duration-500"
                style={{
                  width: `${((step - 1) / (WIZARD_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>

          {/* Navigation */}
          {step > 1 && !submitted && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-beige">
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="border-2 border-brown-mid text-brown-mid px-8 py-3 rounded-full hover:border-brown-deep hover:text-brown-deep transition-colors"
                data-ocid="design.back_button"
              >
                ← Back
              </button>
              {step < 5 && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 3 && !validateStep3()) return;
                    setStep((s) => s + 1);
                  }}
                  className="bg-gold text-brown-deep font-bold py-3 px-8 rounded-full hover:bg-gold-dark transition-colors"
                  data-ocid="design.next_button"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Enquiry Section ──────────────────────────────────────────────────────────

function EnquirySection() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: "Custom Furniture",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connection not ready. Please try again.");
      return;
    }
    setLoading(true);
    try {
      await actor.submitEnquiry({
        name: form.name,
        phone: form.phone,
        city: form.city,
        service: form.service,
        message: form.message,
      });
      toast.success("Thank you! We\u2019ll contact you soon.");
      setForm({
        name: "",
        phone: "",
        city: "",
        service: "Custom Furniture",
        message: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";

  return (
    <section id="enquiry" className="py-20 bg-brown-deep">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Free Estimate
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-4">
            Get a Free Quote
          </h2>
          <p className="text-cream/70 text-base">
            Fill in your details and we&apos;ll get back to you within 24 hours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
              className={inputClass}
              data-ocid="enquiry.name.input"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number (10 digits)"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
              required
              className={inputClass}
              data-ocid="enquiry.phone.input"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Your City"
              required
              className={inputClass}
              data-ocid="enquiry.city.input"
            />
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              required
              className={`${inputClass} bg-brown-mid/80`}
              data-ocid="enquiry.service.select"
            >
              <option value="Custom Furniture">Custom Furniture</option>
              <option value="Wooden Doors">Wooden Doors</option>
              <option value="Plywood Work">Plywood Work</option>
              <option value="Furniture Repair">Furniture Repair</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your requirement (dimensions, style, etc.)"
            rows={4}
            className={`${inputClass} resize-none`}
            data-ocid="enquiry.message.textarea"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-brown-deep font-bold text-lg py-4 rounded-full hover:bg-gold-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-2"
            data-ocid="enquiry.submit_button"
          >
            {loading ? "Sending..." : "Send Enquiry \u2192"}
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Get In Touch
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep">
            Find Us
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <a
              href={PHONE_TEL}
              className="flex items-start gap-4 p-5 bg-beige rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  📞
                </span>
              </div>
              <div>
                <p className="text-brown-mid text-sm mb-1">Call Us</p>
                <p className="font-bold text-brown-deep text-lg group-hover:text-gold transition-colors">
                  {PHONE_NUMBER}
                </p>
                <p className="text-brown-mid text-sm">Tap to call directly</p>
              </div>
            </a>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 bg-whatsapp/10 rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-whatsapp/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  💬
                </span>
              </div>
              <div>
                <p className="text-brown-mid text-sm mb-1">WhatsApp</p>
                <p className="font-bold text-brown-deep text-lg group-hover:text-whatsapp transition-colors">
                  Chat on WhatsApp
                </p>
                <p className="text-brown-mid text-sm">
                  Quick response guaranteed
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 p-5 bg-beige rounded-2xl">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  📍
                </span>
              </div>
              <div>
                <p className="text-brown-mid text-sm mb-1">Address</p>
                <p className="font-bold text-brown-deep">{ADDRESS}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-beige rounded-2xl">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  🕒
                </span>
              </div>
              <div>
                <p className="text-brown-mid text-sm mb-1">Business Hours</p>
                <p className="font-bold text-brown-deep">
                  Mon &ndash; Sat: 9:00 AM – 8:00 PM
                  <br />
                  Sunday: 10:00 AM – 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-beige">
            <iframe
              title="Kartik Furniture House Location - Nagar, Rajasthan"
              src="https://maps.google.com/maps?q=C4G2%2BCRQ,+Nagar,+Rajasthan+321205&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-brown-deep text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">
                🪑
              </span>
              <span className="font-heading text-xl font-bold text-gold">
                Kartik Furniture House
              </span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Crafting quality furniture with love and expertise. Your dream
              home deserves the finest woodwork.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-gold mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <a
                    href="#services"
                    className="text-cream/70 hover:text-gold transition-colors text-sm"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>
                <a
                  href={PHONE_TEL}
                  className="hover:text-gold transition-colors"
                >
                  {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  WhatsApp Us
                </a>
              </li>
              <li>{ADDRESS}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
          <button
            type="button"
            onClick={() => {
              window.history.pushState({}, "", "/admin");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="text-cream/30 hover:text-cream/60 text-xs transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}

// ── Floating WhatsApp ────────────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform animate-pulse-gentle"
      aria-label="Chat on WhatsApp"
    >
      <span className="sr-only">Chat on WhatsApp</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-white"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}

// ── Page export ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <TestimonialsSection />
        <DesignWizardSection />
        <EnquirySection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
