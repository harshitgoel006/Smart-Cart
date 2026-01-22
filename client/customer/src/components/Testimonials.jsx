
import { motion } from "framer-motion";
import { FiStar, FiCheckCircle } from "react-icons/fi";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Verified Buyer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review: "SmartCart feels premium. The AI recommendations are spookily accurate! I found my wedding outfit in 5 minutes.",
    tag: "Fashion"
  },
  {
    name: "Riya Verma",
    role: "Fashion Shopper",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    review: "Clean UI, fast delivery & amazing deals. Razorpay integration is super smooth. Got my cashback instantly!",
    tag: "Experience"
  },
  {
    name: "Kunal Mehta",
    role: "Tech Enthusiast",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    rating: 5,
    review: "Best place for electronics. Smooth checkout and the packaging of the tech products was world-class.",
    tag: "Tech"
  },
  {
    name: "Sneha Kapoor",
    role: "Premium Member",
    image: "https://i.pravatar.cc/150?u=sneha",
    review: "The user experience is unmatched. I love how the site adapts to my style every time I log in.",
    rating: 5,
    tag: "Premium"
  },
  {
    name: "Aman Verma",
    role: "Verified Buyer",
    image: "https://i.pravatar.cc/150?u=aman",
    review: "Delivery was faster than expected. It's rare to see an Indian e-commerce site this polished.",
    rating: 5,
    tag: "Service"
  },
  {
    name: "Rahul Mehta",
    role: "Daily Shopper",
    image: "https://i.pravatar.cc/150?u=rahul",
    review: "From accessories to home living, the quality is always consistent. Truly a smart way to shop.",
    rating: 4,
    tag: "Consistent"
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      
      {/* 🌈 Luxury Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-purple-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-pink-500/20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 mb-6">
              <FiCheckCircle className="text-sm" />
              <span className="text-xs font-black tracking-widest uppercase">Verified Customer Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.9]">
              REAL REVIEWS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                PURE LOVE.
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-500 font-medium text-lg max-w-xs md:text-right"
          >
            Join 50,000+ shoppers who upgraded their lifestyle with SmartCart.
          </motion.p>
        </div>

        {/* TESTIMONIAL GRID */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="break-inside-avoid relative bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Category Tag */}
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-black uppercase tracking-tighter text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
                  #{t.tag}
                </span>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <FiStar key={idx} className="fill-current w-3 h-3" />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-lg font-medium leading-relaxed mb-8">
                "{t.review}"
              </p>

              {/* User Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="relative">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-4 ring-purple-50 transition-transform group-hover:rotate-6 group-hover:scale-110"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{t.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{t.role}</p>
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