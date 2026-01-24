import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const brands = [
  { name: "Zara", slug: "zara", logo: "https://cdn.simpleicons.org/zara/000000" },
  { name: "Mango", slug: "mango", logo: "https://i.pinimg.com/736x/e8/47/e4/e847e41ac9713cf26034ce6c40a31aed.jpg" },
  { name: "Levi's", slug: "levis", logo: "https://i.pinimg.com/1200x/3a/2a/97/3a2a979ee06c68907450795bbe66d32c.jpg" },
  { name: "Biba", slug: "biba", logo: "https://i.pinimg.com/1200x/c3/26/76/c32676ba1de23943928f13f3358996e2.jpg" },
  { name: "H&M", slug: "hm", logo: "https://i.pinimg.com/736x/ea/a1/a7/eaa1a763be87cbe460b29d40cefdb722.jpg" },
  { name: "Chanel", slug: "chanel", logo: "https://i.pinimg.com/736x/92/de/46/92de46f55a67ad97a1f1facdafa3c967.jpg" },
  { name: "Gucci", slug: "gucci", logo: "https://i.pinimg.com/736x/1e/86/e3/1e86e3bc7cbfe84d730a36235c7a7f4b.jpg" },
  { name: "Prada", slug: "prada", logo: "https://i.pinimg.com/1200x/55/80/97/558097bf430af078a10fde2b3caf0806.jpg" },
];

const WomenTopBrands = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      
      {/* SOFT PINK GLOWS */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-rose-100/40 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[420px] w-[420px] rounded-full bg-pink-200/30 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER WITH PDF TAGLINE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-black tracking-[0.4em] text-rose-500 uppercase mb-4">
               Premium Collaborations
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
              Get Upto <span className="italic font-light text-gray-400">70% Off</span> <br />
              <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                On Latest Brands
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right text-sm leading-relaxed"
          >
            Curated selection of global icons and designer houses, specifically chosen for your unique style.
          </motion.p>
        </div>

        {/* BRAND GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <Link
                to={`/brands/${brand.slug}`}
                className="
                  group relative flex items-center justify-center
                  h-36 rounded-[2.5rem]
                  bg-white border border-gray-100
                  transition-all duration-500
                  hover:shadow-[0_25px_50px_rgba(225,29,72,0.12)]
                "
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-12 w-auto object-contain
                    grayscale opacity-60
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-110
                    transition-all duration-500
                  "
                />

                {/* Hover text */}
                <span className="absolute bottom-5 text-[9px] font-black tracking-widest text-rose-500 uppercase opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Shop Collection
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden rounded-[3.5rem] bg-gray-950 p-12 shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h3 className="text-3xl font-black text-white mb-3">
                Love Luxury? 
              </h3>
              <p className="text-gray-400 font-light tracking-wide max-w-md">
                Discover over 100+ global brands. From ethnic luxury to western chic, your next favorite brand is here.
              </p>
            </div>

            <Link
              to="/brands"
              className="
                px-12 py-5 rounded-2xl
                text-rose-600 font-black text-[11px] tracking-widest bg-white
                hover:bg-rose-600 hover:text-white
                transition-all duration-500 shadow-xl uppercase
              "
            >
              Explore All Brands
            </Link>
          </div>

          {/* Background Decor */}
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 bg-pink-500/10 rounded-full blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default WomenTopBrands;