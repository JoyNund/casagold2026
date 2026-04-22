import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Phone,
  Building,
  Briefcase,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Star,
  Quote,
  Menu,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Sun,
  Moon
} from 'lucide-react';

// --- Constants ---
const WHATSAPP_URL = "https://wa.me/51999999999?text=Hola,%20deseo%20solicitar%20una%20tasaci%C3%B3n%20gratuita";

// --- Helpers ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- Components ---

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-white shadow-[0_4px_20px_rgba(191,158,119,0.15)] border border-brand-beige-light py-3' : 'bg-brand-white/90 backdrop-blur-md border border-brand-beige-light/50 py-4'} rounded-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={isDark ? "/logod.svg" : "/logon.svg"} 
            alt="CasaGold" 
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-6 rounded-full bg-brand-beige-light border border-brand-beige-medium flex items-center px-1 cursor-pointer transition-colors"
            aria-label="Toggle Dark Mode"
          >
            <motion.div 
              layout
              className="w-4 h-4 rounded-full bg-brand-navy flex items-center justify-center shadow-sm"
              initial={false}
              animate={{ x: isDark ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
{isDark ? <Moon size={10} className="text-brand-white" /> : <Sun size={10} className="text-brand-white" />}
          </motion.div>
        </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <a href="#servicios" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors text-brand-navy">Servicios</a>
          <a href="#propiedades" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors text-brand-navy">Propiedades</a>
          <a href="#clientes" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors text-brand-navy">Nuestros Clientes</a>
          
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-brand-gold text-[var(--theme-cream)] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
            <Phone size={16} />
            Tasación Gratis
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-brand-navy hover:text-brand-gold transition-colors">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-white border-t border-brand-beige-light absolute top-full mt-3 left-0 right-0 overflow-hidden rounded-b-xl"
          >
            <div className="px-4 py-6 flex flex-col gap-6">
              <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="text-brand-navy font-medium text-lg uppercase tracking-wide">Servicios</a>
              <a href="#propiedades" onClick={() => setMobileMenuOpen(false)} className="text-brand-navy font-medium text-lg uppercase tracking-wide">Propiedades</a>
              <a href="#clientes" onClick={() => setMobileMenuOpen(false)} className="text-brand-navy font-medium text-lg uppercase tracking-wide">Nuestros Clientes</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-brand-gold text-brand-white px-6 py-4 rounded-full font-bold uppercase tracking-wider text-center">
                <Phone size={18} />
                Pedir Tasación Gratis
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const [tab, setTab] = useState<'vender' | 'comprar'>('vender');

  return (
    <section className="relative min-h-screen flex items-center pt-32 lg:pt-0 overflow-hidden bg-brand-cream">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
          alt="Edificios modernos en Lima" 
          className="w-full h-full object-cover opacity-[0.25] grayscale mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-cream via-brand-cream/90 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Copy */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-brand-navy max-w-2xl"
        >
          <motion.div variants={fadeUp} className="inline-block px-3 py-1 bg-brand-white border border-brand-beige-light/50 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded shadow-sm mb-6">
            Exclusividad en Lima Moderna
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl xl:text-7xl font-serif font-light tracking-tight leading-[1.1] mb-6">
            Cerramos tratos, <br/>
            <span className="text-brand-gold italic">
              abrimos puertas.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg max-sm:text-sm lg:text-xl text-brand-grey-blue font-light mb-10 max-w-lg leading-relaxed">
            Especialistas en terrenos, departamentos de lujo y locales comerciales. Tu patrimonio merece una gestión extraordinaria.
          </motion.p>
        </motion.div>

        {/* Right Column: Lead Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-brand-white p-4 lg:p-6 rounded-xl border border-brand-beige-light shadow-[0_4px_20px_rgba(191,158,119,0.05)] w-full max-w-md relative"
        >
          <h3 className="text-xl font-bold font-serif text-brand-navy mb-4 tracking-tight">¿Cuál es tu objetivo?</h3>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-brand-beige-light/50 p-1 rounded-lg">
            <button 
              onClick={() => setTab('vender')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-300 ${tab === 'vender' ? 'bg-brand-white text-brand-navy shadow-sm' : 'text-brand-grey-blue hover:text-brand-navy'}`}
            >
              Vender
            </button>
            <button 
              onClick={() => setTab('comprar')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-300 ${tab === 'comprar' ? 'bg-brand-white text-brand-navy shadow-sm' : 'text-brand-grey-blue hover:text-brand-navy'}`}
            >
              Comprar / Alquilar
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.open(WHATSAPP_URL, '_blank'); }}>
            <div>
              <input type="text" required className="max-w-md bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy shadow-sm" placeholder="Tu nombre completo" />
            </div>
            <div className="flex gap-3 flex-wrap">
              <input type="tel" required className="flex-1 min-w-0 bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy shadow-sm" placeholder="Teléfono" />
              <select className="flex-1 min-w-0 bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy appearance-none shadow-sm">
                <option>Departamento</option>
                <option>Casa</option>
                <option>Terreno</option>
                <option>Local / Oficina</option>
              </select>
            </div>

            <div className="flex gap-3">
              <input type="text" className="flex-1 min-w-0 bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy shadow-sm" placeholder="Distrito de Interés" />
              <button type="submit" className="bg-brand-gold text-brand-white px-6 rounded-md text-sm font-bold tracking-widest hover:bg-opacity-90 transition-colors uppercase">
                Empezar
              </button>
            </div>
            <p className="text-[10px] text-brand-grey-blue uppercase tracking-wider text-center pt-2">
              Sus datos están protegidos. Sin compromisos.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function AuthorityStats() {
  return (
    <section className="bg-brand-cream py-16 border-b border-brand-beige-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-brand-beige-light">
          
          <div className="text-center px-4">
            <p className="text-4xl lg:text-5xl font-serif font-light text-brand-gold mb-2 tracking-tighter">+$50M</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey-blue">Volumen de Ventas</p>
          </div>
          
          <div className="text-center px-4">
            <p className="text-4xl lg:text-5xl font-serif font-light text-brand-gold mb-2 tracking-tighter">15 Días</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey-blue">Cierre Promedio</p>
          </div>
          
          <div className="text-center px-4">
            <div className="flex justify-center items-center gap-2 mb-2">
              <p className="text-4xl lg:text-5xl font-serif font-light text-brand-gold tracking-tighter">4.9</p>
              <Star className="text-brand-gold fill-brand-gold" size={24} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey-blue">Satisfacción</p>
          </div>
          
          <div className="text-center px-4">
            <p className="text-4xl lg:text-5xl font-serif font-light text-brand-gold mb-2 tracking-tighter">300+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey-blue">Familias Felices</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [isVendedorModalOpen, setIsVendedorModalOpen] = useState(false);

  const servicios = [
    {
      icon: <Home className="w-8 h-8 text-brand-gold" />,
      title: "Para Vendedores",
      desc: "Tasación precisa, marketing premium y negociación implacable. Vendemos tu propiedad al mejor precio del mercado sin demoras.",
      action: "Quiero vender rápido",
      isModal: true
    },
    {
      icon: <MapPin className="w-8 h-8 text-brand-gold" />,
      title: "Para Compradores",
      desc: "Acceso a la cartera más exclusiva de Lima Moderna. Encontramos el departamento o casa que encaja perfectamente con tu estilo de vida.",
      action: "Buscar mi hogar",
      isModal: false
    },
    {
      icon: <Briefcase className="w-8 h-8 text-brand-gold" />,
      title: "Locales & Oficinas",
      desc: "Espacios comerciales estratégicos. Maximizamos la rentabilidad de tu negocio encontrando la ubicación prime ideal.",
      action: "Ver opciones comerciales",
      isModal: false
    },
    {
      icon: <Building className="w-8 h-8 text-brand-gold" />,
      title: "Inversión en Terrenos",
      desc: "Oportunidades de alto ROI. Asesoría experta para desarrolladores e inversionistas buscando terrenos en zonas de alta plusvalía.",
      action: "Analizar rentabilidad",
      isModal: false
    }
  ];

  const handleCardClick = (isModal: boolean) => {
    if (isModal) {
      setIsVendedorModalOpen(true);
    } else {
      window.location.href = "https://casagoldinmobiliaria.com/propiedades";
    }
  };

  return (
    <section id="servicios" className="py-24 lg:py-32 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 max-w-3xl">
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-4"
          >
            Nuestra Oferta de Valor
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-serif text-brand-heading"
          >
            Un servicio integral para cada etapa de tu vida.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {servicios.map((s, i) => (
            <motion.div 
              key={i}
              onClick={() => handleCardClick(s.isModal || false)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-white border border-brand-beige-light p-8 rounded-xl hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(191,158,119,0.08)] transition-all duration-300 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-0 h-1 bg-brand-gold transition-all duration-500 group-hover:w-full"></div>
              
              <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-full bg-brand-cream text-brand-gold">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold font-serif text-brand-navy mb-3">{s.title}</h3>
              <p className="text-sm text-brand-grey-blue font-light leading-relaxed mb-6">
                {s.desc}
              </p>
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-gold group-hover:text-brand-navy transition-colors">
                {s.action} <ArrowUpRight className="ml-1 w-4 h-4" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal para Vendedores */}
      <AnimatePresence>
        {isVendedorModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsVendedorModalOpen(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-white w-full max-w-4xl relative z-10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setIsVendedorModalOpen(false)} 
                className="absolute top-4 right-4 text-brand-grey-blue hover:text-brand-navy z-20 bg-brand-white/80 rounded-full p-2 hover:bg-brand-beige-light transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>

              {/* Left Side: Value Add */}
              <div className="bg-brand-cream p-8 md:p-12 md:w-5/12 flex flex-col justify-center border-r border-brand-beige-light">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-brand-white border border-brand-beige-light/50 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded shadow-sm mb-4">
                    Servicios Exclusivos
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-brand-navy mb-4">Vende con CasaGold</h3>
                  <p className="text-sm text-brand-grey-blue leading-relaxed font-light">
                    Maximizamos el valor real de tu inmueble en Lima Moderna con un enfoque estratégico y garantizado.
                  </p>
                </div>
                
                <ul className="space-y-4">
                  {[
                    "Análisis comercial del mercado",
                    "Publicidad en redes",
                    "Publicación en portales especializados",
                    "Asesoría personalizada",
                    "Reportes quincenales"
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle className="text-brand-gold w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-sm text-brand-navy font-medium leading-tight">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Side: Form */}
              <div className="p-8 md:p-12 md:w-7/12 bg-white flex flex-col justify-center">
                <h4 className="text-2xl font-bold font-serif text-brand-navy mb-6 tracking-tight">Solicita tu tasación</h4>
                
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.open(WHATSAPP_URL, '_blank'); setIsVendedorModalOpen(false); }}>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-grey-blue uppercase tracking-wider mb-2">Nombre Completo</label>
                    <input type="text" required className="w-full bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy shadow-sm" placeholder="Ej. Juan Pérez" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-brand-grey-blue uppercase tracking-wider mb-2">Teléfono</label>
                      <input type="tel" required className="w-full bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy shadow-sm" placeholder="+51 999 999 999" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-brand-grey-blue uppercase tracking-wider mb-2">Tipo de Propiedad</label>
                      <select className="w-full bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy appearance-none shadow-sm">
                        <option>Departamento</option>
                        <option>Casa</option>
                        <option>Terreno</option>
                        <option>Local / Oficina</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-grey-blue uppercase tracking-wider mb-2">Distrito de la Propiedad</label>
                    <input type="text" className="w-full bg-brand-white border border-brand-beige-medium rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-brand-navy shadow-sm" placeholder="Miraflores, San Isidro, Surco..." />
                  </div>

                  <button type="submit" className="w-full mt-4 bg-brand-gold text-brand-white py-4 rounded-md text-sm font-bold tracking-widest hover:bg-brand-gold/90 transition-colors uppercase flex justify-center items-center gap-2 group shadow-[0_4px_20px_rgba(191,158,119,0.2)]">
                    Quiero Vender Ahora
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-[10px] text-brand-grey-blue uppercase tracking-wider mt-4">
                    Tus datos están protegidos. Sin compromisos.
                  </p>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Gallery() {
  return (
    <section id="propiedades" className="py-24 bg-brand-cream text-brand-navy">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-4">Cartera Exclusiva</p>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-heading">Propiedades Destacadas</h2>
        </div>
        <a href={WHATSAPP_URL} className="inline-block border border-brand-beige-light text-brand-navy px-8 py-3 text-xs rounded-full font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-white transition-colors bg-brand-white shadow-sm">
          Ver Todas Las Propiedades
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-dense max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prop 1 */}
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative aspect-[4/5] group overflow-hidden cursor-pointer rounded-xl lg:col-span-2 lg:row-span-2 border border-brand-beige-light"
        >
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Casa en San Isidro" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="bg-brand-white text-brand-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4 inline-block rounded-sm">Venta</span>
            <h3 className="text-2xl font-serif font-bold mb-2">Residencia Los Olivos</h3>
            <p className="flex items-center text-white/80 font-light text-sm"><MapPin size={14} className="mr-1"/> San Isidro, Lima</p>
          </div>
        </motion.div>

        {/* Prop 2 */}
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative aspect-square group overflow-hidden cursor-pointer rounded-xl border border-brand-beige-light"
        >
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2053" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Depa en Miraflores" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="bg-brand-white text-brand-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-3 inline-block rounded-sm">Alquiler</span>
            <h3 className="text-xl font-serif font-bold mb-1">Penthouse Malecón</h3>
            <p className="flex items-center text-white/80 font-light text-xs"><MapPin size={12} className="mr-1"/> Miraflores</p>
          </div>
        </motion.div>

        {/* Prop 3 */}
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative aspect-square group overflow-hidden cursor-pointer rounded-xl border border-brand-beige-light"
        >
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Casa en Surco" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="bg-brand-white text-brand-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-3 inline-block rounded-sm">Venta</span>
            <h3 className="text-xl font-serif font-bold mb-1">Villa El Golf</h3>
            <p className="flex items-center text-white/80 font-light text-xs"><MapPin size={12} className="mr-1"/> Santiago de Surco</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function SoldCarousel() {
  const soldProperties = [
    { image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800", type: "Casa", district: "La Molina", area: "450m²", time: "Vendida en 2 meses" },
    { image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800", type: "Departamento", district: "San Isidro", area: "120m²", time: "Vendido en 3 semanas" },
    { image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", type: "Penthouse", district: "Barranco", area: "290m²", time: "Vendido en 1 mes" },
    { image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800", type: "Casa", district: "Surco", area: "320m²", time: "Vendida en 2.5 meses" },
    { image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&q=80&w=800", type: "Oficina", district: "Miraflores", area: "150m²", time: "Vendida en 4 semanas" },
    { image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800", type: "Departamento", district: "San Borja", area: "180m²", time: "Vendido en 1.5 meses" },
  ];

  // Duplicate items to ensure seamless infinite looping inside motion wrapper
  const items = [...soldProperties, ...soldProperties];

  return (
    <section className="py-24 bg-brand-white border-y border-brand-beige-light/30 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-4">Historial de Éxito</p>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-heading">Últimas propiedades vendidas</h2>
        </div>
      </motion.div>

      <div className="relative w-full flex">
        {/* Gradient fade masks at both ends */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-brand-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-brand-white to-transparent z-10 pointer-events-none"></div>

        <motion.div 
          className="flex gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 45, repeat: Infinity }}
          style={{ width: "max-content" }}
        >
          {items.map((prop, idx) => (
            <div key={idx} className="w-[280px] md:w-[380px] shrink-0 group cursor-default">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-beige-light mb-5">
                <img src={prop.image} alt={`${prop.type} en ${prop.district}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:opacity-0"></div>
                <div className="absolute top-4 left-4 bg-brand-white/95 backdrop-blur-md px-3 py-1.5 rounded-sm shadow-sm border border-brand-white/20">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-navy flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                    {prop.time}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-serif font-bold text-brand-navy mb-1">{prop.type}</h4>
              <p className="text-xs text-brand-grey-blue font-medium uppercase tracking-wider">{prop.type} - {prop.district} - {prop.area}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="clientes" className="py-24 lg:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-4">El Factor Humano</p>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-heading max-w-2xl mx-auto">
            Detrás de cada firma, hay una historia de éxito.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-brand-white p-10 border border-brand-beige-light rounded-xl relative"
          >
            <Quote className="absolute top-8 right-8 text-brand-gold/20 w-16 h-16" />
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="text-brand-gold fill-brand-gold w-4 h-4" />)}
            </div>
            <p className="text-brand-grey-blue font-light leading-relaxed mb-8 relative z-10 italic">
              "CasaGold entendió perfectamente el valor sentimental que tenía nuestra casa. No solo consiguieron el precio que esperábamos, sino que nos conectaron con una familia que apreciará el hogar tanto como nosotros."
            </p>
            <div>
              <p className="font-bold text-brand-navy uppercase tracking-widest text-[11px] mb-1">Familia Álvarez</p>
              <p className="text-[10px] text-brand-grey-blue font-medium">Vendedores • San Borja</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-brand-white p-10 border border-brand-beige-light rounded-xl relative"
          >
            <Quote className="absolute top-8 right-8 text-brand-gold/20 w-16 h-16" />
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="text-brand-gold fill-brand-gold w-4 h-4" />)}
            </div>
            <p className="text-brand-grey-blue font-light leading-relaxed mb-8 relative z-10 italic">
              "Como inversionista, busco partners que entiendan de rentabilidad. El equipo de CasaGold me asesoró para adquirir un local en Miraflores que se alquiló en menos de un mes. Impecable nivel de profesionalismo."
            </p>
            <div>
              <p className="font-bold text-brand-navy uppercase tracking-widest text-[11px] mb-1">Roberto C.</p>
              <p className="text-[10px] text-brand-grey-blue font-medium">Inversionista • Miraflores</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="bg-brand-white p-10 border border-brand-beige-light rounded-xl relative md:col-span-2 lg:col-span-1"
          >
            <Quote className="absolute top-8 right-8 text-brand-gold/20 w-16 h-16" />
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="text-brand-gold fill-brand-gold w-4 h-4" />)}
            </div>
            <p className="text-brand-grey-blue font-light leading-relaxed mb-8 relative z-10 italic">
              "Buscábamos nuestro primer depa y estábamos abrumados. Nos filtraron opciones basura y nos llevaron directo a 3 joyas ocultas. Compramos la segunda opción. El proceso notarial fue un trámite sin estrés."
            </p>
            <div>
              <p className="font-bold text-brand-navy uppercase tracking-widest text-[11px] mb-1">Valeria & Diego</p>
              <p className="text-[10px] text-brand-grey-blue font-medium">Compradores • Surco</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-brand-cream border-t border-brand-beige-light">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-[0.03] mix-blend-multiply" alt="Background Texture" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 relative z-10 text-center"
      >
        <div className="w-20 h-[2px] bg-brand-gold mx-auto mb-8"></div>
        <h2 className="text-4xl lg:text-6xl font-serif text-brand-heading mb-8 tracking-tighter">
          Conoce el verdadero valor de tu propiedad en el mercado de hoy.
        </h2>
        <p className="text-xl text-brand-grey-blue font-light mb-12 max-w-2xl mx-auto">
          Nuestros expertos en Lima Moderna realizarán un análisis comparativo de mercado sin costo ni compromiso.
        </p>
        <a 
          href={WHATSAPP_URL} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-white px-10 py-5 text-sm rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-all duration-300 shadow-[0_4px_20px_rgba(191,158,119,0.2)]"
        >
          <Phone size={20} />
          Pedir Tasación Gratis
        </a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <div className="px-4 pb-4 bg-brand-cream">
      <footer className="bg-[#1A1A1A] text-white rounded-2xl py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-8">
            
            <div className="md:col-span-1">
               <div className="flex flex-col mb-6">
                  <span className="text-2xl font-bold tracking-tighter font-serif flex items-center">Casa<span className="text-brand-gold">Gold</span></span>
                </div>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-6">
                  Redefiniendo el estándar inmobiliario en Lima Moderna. Lujo, precisión y exclusividad.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-white transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-white transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-white transition-colors">
                    <Facebook size={18} />
                  </a>
                </div>
            </div>

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-widest text-brand-gold mb-6">Explorar</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><a href="#propiedades" className="hover:text-brand-gold transition-colors">Propiedades</a></li>
                <li><a href="#servicios" className="hover:text-brand-gold transition-colors">Para Vendedores</a></li>
                <li><a href="#servicios" className="hover:text-brand-gold transition-colors">Para Compradores</a></li>
                <li><a href="#clientes" className="hover:text-brand-gold transition-colors">Casos de Éxito</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-widest text-brand-gold mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li className="flex gap-3"><MapPin size={18} className="text-brand-gold shrink-0" /> Centro Empresarial Real, San Isidro, Lima.</li>
                <li className="flex gap-3"><Phone size={18} className="text-brand-gold shrink-0" /> +51 999 999 999</li>
              </ul>
            </div>

          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500">
            <p>© {new Date().getFullYear()} CasaGold. Boutique Inmobiliaria.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Políticas de Privacidad</a>
              <a href="#" className="hover:text-white">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen font-sans bg-brand-cream text-brand-navy selection:bg-brand-gold selection:text-brand-cream">
      <Navbar />
      <Hero />
      <AuthorityStats />
      <Services />
      <Gallery />
      <SoldCarousel />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

