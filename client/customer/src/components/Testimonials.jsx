import { motion } from "framer-motion";
import { FiStar, FiCheckCircle } from "react-icons/fi";
// Quote ke liye alag import
import { FaQuoteLeft } from "react-icons/fa"; 
import { useEffect, useState } from "react";
import { getApprovedTestimonials } from "../features/testimonials/testimonialService";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await getApprovedTestimonials(6);
      setTestimonials(data);
    };
    loadTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="relative py-20 overflow-hidden bg-[#ffffff]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] bg-purple-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] bg-pink-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-28 gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-900 text-white mb-8 shadow-xl">
              <FiCheckCircle className="text-purple-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Verified Global Community</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-[-0.05em] leading-[0.85]">
              LOVED BY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 italic font-serif lowercase tracking-normal px-1">thousands.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-xs border-l-2 border-zinc-900 pl-8 py-2">
            <p className="text-zinc-500 font-bold text-lg leading-tight tracking-tight uppercase">
              Join <span className="text-zinc-900">50,000+ shoppers</span> who redefined their lifestyle standards.
            </p>
          </motion.div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }} className="break-inside-avoid relative group">
              <div className="relative bg-zinc-50/50 backdrop-blur-sm rounded-[3rem] border border-zinc-100 p-10 transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                
                {/* Fixed Quote Icon */}
                <FaQuoteLeft className="absolute top-8 right-10 text-zinc-100 text-5xl group-hover:text-purple-50 transition-colors duration-700" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-1.5 bg-white rounded-full border border-zinc-100">#{t.tag}</span>
                    <div className="flex gap-1 text-orange-400">
                      {[...Array(t.rating)].map((_, idx) => <FiStar key={idx} className="fill-current w-3 h-3" />)}
                    </div>
                  </div>
                  <p className="text-zinc-800 text-xl font-medium leading-[1.6] mb-12 tracking-tight">"{t.review}"</p>
                  <div className="flex items-center gap-5 pt-8 border-t border-zinc-100">
                    <img src={t.image} alt={t.name} className="h-14 w-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-white shadow-lg" />
                    <div>
                      <h4 className="font-black text-zinc-900 tracking-tight uppercase text-sm group-hover:text-purple-600 transition-colors">{t.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-black tracking-widest uppercase mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;