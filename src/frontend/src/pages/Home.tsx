import { useEffect, useState } from "react";
import AIChatbot from "../components/AIChatbot";

const WHATSAPP_NUMBER = "919799341917";
const PHONE_NUMBER = "+91 97993 41917";
const PHONE_TEL = "tel:+919799341917";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Kartik%20Furniture%20%F0%9F%91%8B%20%0AMujhe%20custom%20furniture%20banwana%20hai.%0ADetails%3A%0A-%20Type%3A%0A-%20Size%3A%0A-%20Location%3A%0A%0APhoto%20bhej%20raha%20hoon.`;
const ADDRESS = "C4G2+CRQ, Muriya Road, Jatav Mohalla, Nagar, Rajasthan 321205";
const MAPS_LINK = "https://maps.app.goo.gl/GkRSqipfmUvBBMsi6";
const EMAIL = "rajumundiya5@gmail.com";
const EMAIL_LINK = "mailto:rajumundiya5@gmail.com";
const MAPS_LINK_BUTTON = "https://maps.app.goo.gl/GkRSqipfmUvBBMsi6";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Custom Design", href: "#design" },
  { label: "Gallery", href: "#gallery" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Royal Sheesham King Bed",
    image: "/assets/generated/product-sheesham-bed.dim_800x600.jpg",
    tag: "BESTSELLER",
    tagColor: "bg-amber-500",
    material: "100% Solid Sheesham Wood",
    dimensions: '78" × 72" (King) | Available in Queen & Single',
    price: "₹28,000 – ₹55,000",
    urgency: "🔥 Limited Stock",
    urgencyColor: "bg-red-500",
  },
  {
    id: 2,
    name: "Elite Wooden Sofa Set (3+1+1)",
    image: "/assets/generated/product-wooden-sofa.dim_800x600.jpg",
    tag: "POPULAR",
    tagColor: "bg-blue-600",
    material: "Sheesham Wood Frame, Premium Fabric Cushions",
    dimensions: '3-Seater: 84"L | 1-Seater: 36"L',
    price: "₹32,000 – ₹65,000",
    urgency: "⚡ Today 10% OFF",
    urgencyColor: "bg-orange-500",
  },
  {
    id: 3,
    name: "Heritage Teak Dining Table Set",
    image: "/assets/generated/product-dining-table.dim_800x600.jpg",
    tag: "PREMIUM",
    tagColor: "bg-purple-600",
    material: "Solid Teak Wood + Engineered Wood Options",
    dimensions: '72"×36" (6-Seater) | 60"×30" (4-Seater)',
    price: "₹22,000 – ₹45,000",
    urgency: null,
    urgencyColor: "",
  },
  {
    id: 4,
    name: "Executive Solid Wood Office Table",
    image: "/assets/generated/product-office-table.dim_800x600.jpg",
    tag: "OFFICE",
    tagColor: "bg-teal-600",
    material: "Sheesham / Engineered Wood with Laminate",
    dimensions: '60"×30"×30" | Custom sizes available',
    price: "₹12,000 – ₹28,000",
    urgency: "⚡ Today 10% OFF",
    urgencyColor: "bg-orange-500",
  },
  {
    id: 5,
    name: "Carved Sheesham Wood Main Door",
    image: "/assets/generated/product-wooden-door.dim_800x600.jpg",
    tag: "CRAFTED",
    tagColor: "bg-green-700",
    material: "Solid Sheesham Wood with Brass Hardware",
    dimensions: '84"×36" Standard | Custom sizes available',
    price: "₹18,000 – ₹40,000",
    urgency: null,
    urgencyColor: "",
  },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Sharma",
    city: "Bharatpur",
    photo: "/assets/generated/testimonial-ramesh.dim_200x200.jpg",
    stars: 5,
    review:
      "Bahut acchi quality aur finishing hai. Sheesham ka bed order kiya tha, ekdum solid bana. Poora parivar khush hai!",
  },
  {
    name: "Imran Khan",
    city: "Deeg",
    photo: "/assets/generated/testimonial-imran.dim_200x200.jpg",
    stars: 5,
    review:
      "Custom sofa bilkul perfect bana. Size bhi exact tha aur fabric bhi meri pasand ka lagaya. Bahut shukriya!",
  },
  {
    name: "Sunita Devi",
    city: "Nagar",
    photo: "/assets/generated/testimonial-sunita.dim_200x200.jpg",
    stars: 5,
    review:
      "Dining table set bahut sundar aaya. Wood ki quality ekdum zabardast hai. Sab log taareef karte hain.",
  },
  {
    name: "Vijay Agarwal",
    city: "Delhi NCR",
    photo: "/assets/generated/testimonial-vijay.dim_200x200.jpg",
    stars: 5,
    review:
      "Delhi se custom order diya tha. On-time delivery aur packing bhi acchi thi. Price bhi market se kam tha.",
  },
  {
    name: "Priya Meena",
    city: "Bharatpur",
    photo: "/assets/generated/testimonial-priya.dim_200x200.jpg",
    stars: 5,
    review:
      "Office table aur bookshelf dono banwaye. Kaam mein koi kami nahi. Aage bhi inhi se furniture lunga.",
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

const BLOG_ARTICLES = [
  {
    id: 1,
    title: "Best Furniture for Small Homes",
    excerpt:
      "Living in a compact space? Here's how to choose the right furniture size, material, and configuration to maximize comfort without clutter.",
    tag: "Interior Tips",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    title: "Wood vs Plywood Furniture – What's Better?",
    excerpt:
      "Solid wood or engineered plywood? We break down the pros, cons, and price difference so you can make the right choice for your home.",
    tag: "Buyer's Guide",
    tagColor: "bg-green-100 text-green-700",
  },
];

// ── Gallery constants ────────────────────────────────────────────────────────

const GALLERY_CATEGORIES = [
  "All",
  "Bed",
  "Sofa",
  "Table",
  "Chair",
  "Door",
  "Custom Work",
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: "Door",
    customerName: "Rakesh Kumar",
    location: "Bharatpur",
    image:
      "/assets/img-20260331-wa0012-019d4c11-e38d-77dc-b952-ffbf7637e6d6.jpg",
    imageAfter:
      "/assets/img-20260331-wa0009-019d4c11-e378-758d-8183-f4baaed2b09e.jpg",
  },
  {
    id: 2,
    category: "Door",
    customerName: "Kavita Sharma",
    location: "Nagar",
    image:
      "/assets/img-20260331-wa0016-019d4c11-e3cb-730f-b86c-0cb898e02067.jpg",
  },
  {
    id: 3,
    category: "Door",
    customerName: "Mohan Lal",
    location: "Deeg",
    image:
      "/assets/img-20260331-wa0004-019d4c11-e3fe-74a9-bea3-2405c06e9dcd.jpg",
    imageAfter:
      "/assets/img-20260331-wa0003-019d4c11-e4ad-7328-bd0f-ff3eb22764bf.jpg",
  },
  {
    id: 4,
    category: "Door",
    customerName: "Sunita Devi",
    location: "Bharatpur",
    image:
      "/assets/img-20260331-wa0008-019d4c11-e616-725b-9aa4-980531ef9c7a.jpg",
  },
  {
    id: 5,
    category: "Custom Work",
    customerName: "Suresh Yadav",
    location: "Delhi NCR",
    image:
      "/assets/img-20260331-wa0015-019d4c11-e67f-73cc-b8fc-77f19b73bb5e.jpg",
    imageAfter:
      "/assets/img-20260330-wa0004-019d4c11-e611-70b9-a070-b526a499be75.jpg",
  },
  {
    id: 6,
    category: "Custom Work",
    customerName: "Geeta Bai",
    location: "Bharatpur",
    image:
      "/assets/img-20260331-wa0011-019d4c11-e68c-7140-be2f-18b54fa00537.jpg",
  },
  {
    id: 7,
    category: "Custom Work",
    customerName: "Arjun Singh",
    location: "Nagar",
    image:
      "/assets/img-20260330-wa0007-019d4c11-e62c-7300-8853-2d3416f49bbb.jpg",
    imageAfter:
      "/assets/img-20260331-wa0006-019d4c11-e70a-75ec-b32c-b970d360ef09.jpg",
  },
  {
    id: 8,
    category: "Custom Work",
    customerName: "Vijay Agarwal",
    location: "Delhi NCR",
    image:
      "/assets/img-20260331-wa0010-019d4c11-e70a-73da-b057-4510faa636d0.jpg",
  },
  {
    id: 9,
    category: "Bed",
    customerName: "Ramesh Sharma",
    location: "Bharatpur",
    image:
      "/assets/img-20260331-wa0005-019d4c11-e808-7658-8e06-4f9f8db8d94f.jpg",
    imageAfter:
      "/assets/img-20260331-wa0007-019d4c11-e885-740f-a0d5-34dcdb04a718.jpg",
  },
];
// ── How It Works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const scrollToDesign = () => {
    document.getElementById("design")?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      num: "01",
      icon: "🎨",
      title: "Choose Design",
      desc: "Browse our catalog or describe your dream furniture to our expert team",
    },
    {
      num: "02",
      icon: "📝",
      title: "Submit Request",
      desc: "Fill the design form with dimensions, material & budget — takes just 2 minutes",
    },
    {
      num: "03",
      icon: "🚚",
      title: "We Build & Deliver",
      desc: "We craft your furniture with premium wood and deliver right to your doorstep",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-beige"
      data-ocid="how_it_works.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Simple Process
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-4">
            How It Works
          </h2>
          <p className="text-brown-mid max-w-xl mx-auto">
            From your idea to your home — we make custom furniture ordering easy
            and transparent
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"
            >
              <div className="bg-white rounded-2xl shadow-md p-8 text-center flex-1 md:max-w-xs hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading font-bold text-brown-deep text-lg">
                    {step.num}
                  </span>
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-heading font-bold text-brown-deep text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-brown-mid text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <span className="text-gold text-3xl font-bold hidden md:block rotate-0">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={scrollToDesign}
            className="bg-gold text-brown-deep font-bold px-8 py-4 rounded-full text-lg hover:bg-gold-dark transition-colors shadow-lg hover:shadow-xl"
            data-ocid="how_it_works.primary_button"
          >
            Start Your Custom Furniture Design Now →
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: number;
  category: string;
  customerName: string;
  location: string;
  image: string;
  imageAfter?: string;
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-amber-100 overflow-hidden">
        <img
          src={showAfter && item.imageAfter ? item.imageAfter : item.image}
          alt={`${item.category} by ${item.customerName}`}
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
          loading="lazy"
        />
        {/* Real Work Done badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
          <span>✓</span>
          <span>Real Work Done</span>
        </div>
        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-gold text-brown-deep text-xs font-bold px-2.5 py-1 rounded-full z-10">
          {item.category}
        </div>
        {/* Before/After toggle */}
        {item.imageAfter && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            <button
              type="button"
              onClick={() => setShowAfter(false)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${!showAfter ? "bg-brown-deep text-cream" : "bg-white/80 text-brown-mid"}`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setShowAfter(true)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${showAfter ? "bg-brown-deep text-cream" : "bg-white/80 text-brown-mid"}`}
            >
              After
            </button>
          </div>
        )}
      </div>
      {/* Customer info */}
      <div className="p-4">
        <p className="font-bold text-brown-deep">{item.customerName}</p>
        <p className="text-sm text-brown-mid flex items-center gap-1 mt-0.5">
          <span>📍</span>
          <span>{item.location}</span>
        </p>
      </div>
    </div>
  );
}

function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section
      id="gallery"
      className="py-20 bg-white"
      data-ocid="gallery.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Our Portfolio
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-4">
            Our Real Work
          </h2>
          <p className="text-brown-mid max-w-2xl mx-auto">
            Every piece crafted at our Nagar workshop — real projects for real
            customers
          </p>
        </div>

        {/* Category tabs */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-10"
          data-ocid="gallery.tab"
        >
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-gold text-brown-deep"
                  : "bg-beige text-brown-mid hover:bg-gold/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div key={item.id} data-ocid={`gallery.item.${i + 1}`}>
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16 text-brown-mid"
            data-ocid="gallery.empty_state"
          >
            <div className="text-5xl mb-4">📷</div>
            <p className="text-lg">
              Real photos coming soon — we&apos;re documenting our work!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Star Rating ──────────────────────────────────────────────────────────────

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
    <>
      {/* Top info bar */}
      <div className="hidden md:flex bg-brown-deep border-b border-white/10 py-1.5 px-4 justify-center gap-8 text-xs fixed top-0 left-0 right-0 z-[60]">
        <a
          href={EMAIL_LINK}
          className="text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
        >
          <span>📧</span>
          <span>{EMAIL}</span>
        </a>
        <span className="text-white/20">|</span>
        <a
          href={PHONE_TEL}
          className="text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
        >
          <span>📞</span>
          <span>{PHONE_NUMBER}</span>
        </a>
      </div>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 top-0 md:top-8 ${
          scrolled ? "bg-brown-deep shadow-lg" : "bg-brown-deep"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#home"
              className="flex items-center gap-2"
              data-ocid="nav.home.link"
            >
              <img
                src="/assets/generated/kartik-logo-premium.dim_600x300.png"
                alt="Kartik Furniture House"
                className="h-12 w-auto"
                loading="eager"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-cream/80 hover:text-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-gold after:transition-all"
                  data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-cream"
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
            <nav className="md:hidden pb-4 border-t border-white/10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-3 px-2 text-cream/80 hover:text-gold hover:bg-brown-mid/30 transition-colors text-base font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-workshop.dim_1400x700.jpg')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.55)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24 pb-16 animate-fade-in">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
          ✦ Premium Furniture Manufacturer ✦
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
          Kartik Furniture House
        </h1>
        <p className="text-gold text-lg sm:text-xl md:text-2xl font-semibold mb-6 tracking-wide">
          Custom Furniture Manufacturer | Quality Wood | Direct Factory Price
        </p>
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Handcrafted with solid Sheesham & Teak wood — trusted by 500+ families
          across Rajasthan and Delhi NCR.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-12">
          <a
            href="#contact"
            data-ocid="hero.get_quote.button"
            className="inline-flex items-center justify-center gap-2 bg-gold text-brown-deep font-bold text-lg px-8 py-4 rounded-full hover:bg-gold-dark hover:scale-105 transition-all shadow-xl"
          >
            📋 Get Custom Quote
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.whatsapp.button"
            className="inline-flex items-center justify-center gap-2 font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-xl text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            💬 Order on WhatsApp
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: "😊", text: "500+ Happy Customers" },
            { icon: "⭐", text: "5+ Years Experience" },
            { icon: "🏭", text: "Direct Manufacturer" },
            { icon: "💰", text: "Best Price Guarantee" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full"
            >
              <span aria-hidden="true">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Geo Tagline Banner ───────────────────────────────────────────────────────

function GeoTaglineBanner() {
  return (
    <div className="bg-gold py-3 px-4 text-center">
      <p className="text-brown-deep font-bold text-sm sm:text-base">
        📦 Serving Rajasthan &amp; Delhi NCR with Custom Furniture Orders
        &nbsp;|&nbsp;
        <a
          href={PHONE_TEL}
          className="underline hover:opacity-80 transition-opacity"
        >
          Call: 9799341917
        </a>
      </p>
    </div>
  );
}

// ── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
              Our Story
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-6 leading-snug">
              Built on Trust &amp; Craftsmanship
            </h2>
            <p className="text-brown-mid text-base leading-relaxed mb-4">
              Kartik Furniture House was founded with one mission: bring
              factory-quality solid wood furniture directly to homes across
              Rajasthan and Delhi NCR — without the middleman markup.
            </p>
            <p className="text-brown-mid text-base leading-relaxed mb-4">
              With over{" "}
              <strong className="text-brown-deep">
                5 years of craftsmanship experience
              </strong>
              , our skilled artisans hand-build every piece using premium
              Sheesham, Teak, and engineered wood.
            </p>
            <p className="text-brown-mid text-base leading-relaxed mb-8">
              We serve{" "}
              <strong className="text-brown-deep">
                Nagar, Deeg, Bharatpur
              </strong>
              , and accept custom orders from{" "}
              <strong className="text-brown-deep">Delhi NCR</strong>.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: "⏳", label: "5+ Years Experience" },
                { icon: "😊", label: "500+ Happy Customers" },
                { icon: "🏭", label: "Direct Factory Price" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-brown-deep text-sm font-semibold px-4 py-2 rounded-full"
                >
                  <span aria-hidden="true">{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Founder Card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/generated/hero-workshop.dim_1400x700.jpg"
                alt="Kartik Furniture House workshop – craftsmen at work"
                className="w-full h-80 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gold text-brown-deep font-heading font-bold text-center px-6 py-4 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold">5+</div>
              <div className="text-xs uppercase tracking-wider">
                Years of Trust
              </div>
            </div>
            {/* Founder Badge */}
            <div className="absolute -bottom-4 right-0 bg-white border border-gold/30 shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3 min-w-[220px]">
              <img
                src="/assets/generated/founder-raju.dim_400x400.jpg"
                alt="Raju – Founder, Kartik Furniture House"
                className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-md flex-shrink-0"
              />
              <div>
                <div className="text-brown-deep font-heading font-bold text-base leading-tight">
                  Raju (Mundia Wale)
                </div>
                <div className="text-brown-mid text-xs mt-1 font-medium">
                  20+ saal ka experience
                </div>
                <div className="text-brown-mid text-xs mt-0.5 italic">
                  Master craftsman, Nagar ke jaane-maane furniture maker
                </div>
                <div className="text-gold text-xs font-semibold mt-1">
                  Founder &amp; Master Craftsman
                </div>
                <div className="text-brown-mid text-xs mt-0.5">
                  Nagar, Bharatpur
                </div>
              </div>
            </div>
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
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {service.icon}
              </div>
              <h3 className="font-heading font-bold text-brown-deep text-lg mb-2">
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

// ── Products Section ─────────────────────────────────────────────────────────

function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Handcrafted Collection
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-3">
            Our Premium Products
          </h2>
          <p className="text-brown-mid text-base max-w-xl mx-auto">
            Handcrafted with Solid Wood – Built to Last Generations
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, idx) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              data-ocid={`products.item.${idx + 1}`}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Category tag */}
                <span
                  className={`absolute top-3 left-3 ${product.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                >
                  {product.tag}
                </span>
                {/* Urgency badge */}
                {product.urgency && (
                  <span
                    className={`absolute top-3 right-3 ${product.urgencyColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {product.urgency}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-brown-deep text-lg mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-beige text-brown-mid px-2 py-1 rounded-full font-medium">
                    🪵 {product.material}
                  </span>
                </div>
                <p className="text-xs text-brown-mid mb-3">
                  📐 {product.dimensions}
                </p>
                <p className="text-gold font-bold text-xl mb-3">
                  {product.price}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
                    ✅ Customization Available
                  </span>
                </div>
                <a
                  href={`https://wa.me/919799341917?text=${encodeURIComponent(`Hello, I am interested in ${product.name}. Please share price and details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-bold text-sm py-3 rounded-full text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#25D366" }}
                  data-ocid={`products.whatsapp.button.${idx + 1}`}
                >
                  💬 Order on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-brown-deep text-cream font-bold px-8 py-4 rounded-full hover:bg-brown-mid transition-colors shadow-lg"
            data-ocid="products.get_quote.button"
          >
            📋 Get Custom Quote for Any Product
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ──────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Customer Reviews
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep">
            What Our Customers Say
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`testimonials.item.${idx + 1}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold/30"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-brown-deep">{t.name}</p>
                  <p className="text-brown-mid text-xs">{t.city}</p>
                  <StarRating count={t.stars} />
                </div>
              </div>
              <p className="text-brown-mid text-sm leading-relaxed italic">
                &ldquo;{t.review}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Blog Section ─────────────────────────────────────────────────────────────

function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Knowledge Base
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep">
            Furniture Tips &amp; Ideas
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {BLOG_ARTICLES.map((article, idx) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`blog.item.${idx + 1}`}
            >
              <div className="h-3 bg-gold" />
              <div className="p-6">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${article.tagColor} mb-3 inline-block`}
                >
                  {article.tag}
                </span>
                <h3 className="font-heading font-bold text-brown-deep text-lg mb-3">
                  {article.title}
                </h3>
                <p className="text-brown-mid text-sm leading-relaxed mb-5">
                  {article.excerpt}
                </p>
                <button
                  type="button"
                  disabled
                  title="Coming soon!"
                  className="text-brown-mid text-sm font-semibold border border-brown-mid/30 px-5 py-2 rounded-full cursor-not-allowed opacity-60"
                  data-ocid={`blog.read_more.button.${idx + 1}`}
                >
                  Read More →
                </button>
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
  const whatsappMsg = encodeURIComponent(
    "Hi Kartik Furniture 👋\nMujhe custom furniture banwana hai.\n\nDetails:\n- Type: \n- Size: \n- Location: \n\nPhoto bhej raha hoon.",
  );
  const whatsappUrl = `https://wa.me/919799341917?text=${whatsappMsg}`;

  return (
    <section id="design" className="py-20 bg-beige" data-ocid="design.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Custom Order
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-deep mb-4">
            Get Your Custom Furniture Quote
          </h2>
          <p className="text-brown-mid text-base sm:text-lg max-w-xl mx-auto">
            Direct from manufacturer &bull; Best price &bull; Free consultation
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">💬</div>
          <h3 className="font-heading text-2xl font-bold text-brown-deep mb-3">
            Chat with us on WhatsApp
          </h3>
          <p className="text-brown-mid text-base mb-8 max-w-md mx-auto">
            Send photos, discuss your design, get an instant price quote — all
            on WhatsApp. No forms, no delays.
          </p>

          {/* Quick reply buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Bed", "Sofa", "Table", "Chair", "Door", "Custom Work"].map(
              (type) => {
                const msg = encodeURIComponent(
                  `Hi Kartik Furniture 👋\nMujhe custom furniture banwana hai.\n\nDetails:\n- Type: ${type}\n- Size: \n- Location: \n\nPhoto bhej raha hoon.`,
                );
                return (
                  <a
                    key={type}
                    href={`https://wa.me/919799341917?text=${msg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gold text-brown-deep rounded-full text-sm font-semibold hover:bg-gold hover:text-white transition-colors"
                  >
                    {type}
                  </a>
                );
              },
            )}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg hover:bg-[#1ebe5a] transition-colors w-full sm:w-auto"
            data-ocid="design.whatsapp.button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
              aria-label="WhatsApp"
              role="img"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Get Free Quote on WhatsApp
          </a>

          <p className="text-sm text-brown-mid mt-4">
            ⚡ Response within 15 minutes
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-beige">
            {[
              { icon: "🏆", text: "500+ Happy Customers" },
              { icon: "⭐", text: "5+ Years Experience" },
              { icon: "🏭", text: "Direct Factory Pricing" },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 text-sm font-semibold text-brown-deep"
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-red-600 font-semibold mt-4">
            🔥 Limited bookings today – Contact now
          </p>
        </div>
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
              className="flex items-start gap-4 p-5 rounded-2xl hover:shadow-md transition-shadow group"
              style={{ backgroundColor: "rgba(37,211,102,0.1)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(37,211,102,0.2)" }}
              >
                <span className="text-2xl" aria-hidden="true">
                  💬
                </span>
              </div>
              <div>
                <p className="text-brown-mid text-sm mb-1">WhatsApp</p>
                <p className="font-bold text-brown-deep text-lg transition-colors">
                  Chat on WhatsApp
                </p>
                <p className="text-brown-mid text-sm">
                  Quick response guaranteed
                </p>
              </div>
            </a>

            <a
              href={EMAIL_LINK}
              className="flex items-start gap-4 p-5 bg-beige rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  📧
                </span>
              </div>
              <div>
                <p className="text-brown-mid text-sm mb-1">Email Us</p>
                <p className="font-bold text-brown-deep text-sm group-hover:text-gold transition-colors break-all">
                  {EMAIL}
                </p>
                <p className="text-brown-mid text-sm">
                  We reply within 24 hours
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
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brown-deep hover:text-gold underline transition-colors"
                >
                  {ADDRESS}
                </a>
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
              src="https://maps.google.com/maps?q=C4G2%2BCRQ,+Muriya+Road,+Jatav+Mohalla,+Nagar,+Rajasthan+321205&output=embed&iwloc=near"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-4 text-center bg-beige">
              <a
                href={MAPS_LINK_BUTTON}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold text-brown-deep font-bold px-6 py-2.5 rounded-full hover:bg-gold-dark transition-colors text-sm"
                data-ocid="contact.map.button"
              >
                📍 View on Google Maps →
              </a>
            </div>
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
            <div className="mb-4">
              <img
                src="/assets/generated/kartik-logo-premium.dim_600x300.png"
                alt="Kartik Furniture House"
                className="h-14 w-auto"
                loading="lazy"
              />
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-3">
              Crafting quality furniture with love and expertise. Your dream
              home deserves the finest woodwork.
            </p>
            <p className="text-gold text-xs font-semibold">
              Serving Rajasthan &amp; Delhi NCR
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
                  href={EMAIL_LINK}
                  className="hover:text-gold transition-colors break-all"
                >
                  📧 {EMAIL}
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
              <li>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold underline transition-colors"
                >
                  {ADDRESS}
                </a>
              </li>
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

// ── Floating Buttons ─────────────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform animate-pulse"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
      data-ocid="floating.whatsapp.button"
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

function FloatingCallButton() {
  return (
    <a
      href={PHONE_TEL}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:bg-gold-dark transition-all animate-pulse-gentle"
      aria-label="Call us now"
      data-ocid="floating.call.button"
    >
      <span className="sr-only">Call us now</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-6 h-6 fill-brown-deep"
      >
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
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
        <GeoTaglineBanner />
        <HowItWorksSection />
        <AboutSection />
        <ServicesSection />
        <ProductsSection />
        <GallerySection />
        <TestimonialsSection />
        <BlogSection />
        <DesignWizardSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingCallButton />
      <AIChatbot />
    </div>
  );
}
