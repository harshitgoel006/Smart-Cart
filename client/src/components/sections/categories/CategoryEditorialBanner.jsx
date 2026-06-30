import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryEditorialBanner = ({ editorial }) => {
  if (!editorial) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 shadow-sm"
      >
        <div className="grid min-h-[500px] items-center gap-14 lg:grid-cols-2">

          {/* ---------- Content ---------- */}

          <div className="px-12 py-14 lg:px-16">

            <div className="mb-4 flex items-center gap-3">
              <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-600">
                {editorial.tag}
              </span>
            </div>

            <h2
              className="mb-6 text-indigo-950"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.7rem,4vw,4.5rem)",
                lineHeight: 1,
              }}
            >
              {editorial.title}
            </h2>

            <p className="max-w-md text-base leading-8 text-slate-600">
              {editorial.description}
            </p>

            <Link
              to={editorial.buttonLink}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-violet-600 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-700"
            >
              {editorial.buttonText}

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* ---------- Image ---------- */}

          <div className="relative h-full">

            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10" />

            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.45 }}
              src={editorial.image}
              alt={editorial.title}
              className="h-full min-h-[500px] w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CategoryEditorialBanner;