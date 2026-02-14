import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiMaximize2, FiLayers } from "react-icons/fi";
import { getPromoProductsByCategory } from "../../features/products/productService";

const CategoryPromoSection = ({ subcategories, categoryName }) => {
  const [promoData, setPromoData] = useState([]);

  useEffect(() => {
    const loadPromo = async () => {
      if (!subcategories?.length) return;
      const selectedSubs = subcategories.slice(0, 3);
      const results = await Promise.all(
        selectedSubs.map(async (sub) => {
          const products = await getPromoProductsByCategory(sub.slug, 3);
          return { subcategory: sub, products };
        })
      );
      setPromoData(results);
    };
    loadPromo();
  }, [subcategories]);

  if (!promoData.length) return null;

  const themeStyles = [
    { bg: "bg-[#F9F9F9]", shadow: "group-hover:shadow-purple-200/40", accent: "text-purple-600" },
    { bg: "bg-[#FCF8F3]", shadow: "group-hover:shadow-orange-200/40", accent: "text-orange-500" },
    { bg: "bg-[#FDF2F8]", shadow: "group-hover:shadow-pink-200/40", accent: "text-pink-500" },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden transform-gpu">
      <div className="max-w-[1440px] mx-auto px-8">
        
        {/* ELITE HEADER SYNC */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 border-b border-zinc-100 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-8 bg-purple-600" />
              <p className="text-[9px] font-black tracking-[0.5em] text-zinc-400 uppercase">
                Premier Edit
              </p>
            </div>

            <h2 className="text-5xl md:text-6xl font-black leading-[0.85] tracking-tighter text-zinc-900 uppercase">
              Curated <span className="italic font-serif lowercase font-light text-zinc-300">for</span>
              <br />
              
              <span className=" italic font-serif lowercase text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                {categoryName || "Luxe Wear"}
              </span>
            </h2>
          </motion.div>

          <Link
            to="/products"
            className="group relative overflow-hidden flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.3em] bg-zinc-950 text-white px-10 py-5 rounded-full transition-all duration-500"
          >
            <span className="relative z-10">Explore All</span>
            <FiArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </div>

        {/* CATEGORY GRID: Height Adjusted to 680px */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-14">
          {promoData.map((block, idx) => {
            const style = themeStyles[idx % themeStyles.length];
            const mainProduct = block.products[0];
            const miniProducts = block.products.slice(1, 3);

            return (
              <motion.div
                key={block.subcategory._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative h-[680px] transform-gpu"
              >
                <div className={`relative h-full w-full rounded-[3.5rem] ${style.bg} p-9 flex flex-col transition-all duration-700 group-hover:shadow-[0_60px_100px_-30px] ${style.shadow} border border-white/60`}>
                  
                  {/* HEADER: Pattern Style Typography */}
                  <div className="z-20">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-[9px] font-black tracking-[0.4em] uppercase mb-2 ${style.accent}`}>
                          {block.subcategory.name}
                        </p>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                          {block.subcategory.name} <br />
                          <span className="font-serif italic lowercase font-light text-zinc-400 tracking-normal">Signature.</span>
                        </h3>
                      </div>

                      <motion.div 
                        whileHover={{ rotate: 90 }}
                        className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center bg-white/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm"
                      >
                        <FiMaximize2 className="text-zinc-900" />
                      </motion.div>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-zinc-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">
                        {mainProduct?.discount || "15"}% OFF
                      </span>
                    </div>
                  </div>

                  {/* MAIN IMAGE: Adjusted for smaller card height */}
                  <Link to={`/product/${mainProduct?.slug}`} className="relative flex-1 mt-8 rounded-[2.8rem] overflow-hidden border-[8px] border-white shadow-xl group-hover:border-white/80 transition-all duration-700">
                    <motion.img
                      src={mainProduct?.images?.[0]?.url}
                      alt={mainProduct?.name}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  {/* FLOATING MINIS: Adjusted spacing */}
                  <div className="absolute right-[-10px] top-[38%] flex flex-col gap-4 z-30">
                    {miniProducts.map((prod, i) => (
                      <motion.div
                        key={prod._id}
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        whileHover={{ scale: 1.15, x: -8 }}
                        className="w-24 h-32 rounded-[1.8rem] bg-white p-1 shadow-2xl border border-white"
                      >
                        <Link to={`/product/${prod.slug}`}>
                          <img src={prod.images?.[0]?.url} alt="mini" className="w-full h-full object-cover rounded-[1.5rem]" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA BUTTON: Elite Pattern Sync */}
                  <Link to={`/products?sub=${block.subcategory.slug}`} className="mt-8 relative overflow-hidden h-14 rounded-2xl bg-zinc-950 group/btn shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center translate-y-0 group-hover:translate-y-[-100%] transition-transform duration-500 ease-in-out">
                      <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">Tap to View</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-gradient-to-r from-purple-600 to-pink-500 gap-2">
                      <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">Shop Series</span>
                      <FiShoppingBag className="text-white" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryPromoSection;