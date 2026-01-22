// import { Link } from "react-router-dom";
// import {
//   FiInstagram,
//   FiTwitter,
//   FiLinkedin,
//   FiGithub,
//   FiMail,
// } from "react-icons/fi";

// const Footer = () => {
//   return (
//     <footer className="relative overflow-hidden bg-gray-950 text-gray-300">

//       {/* 🌈 Soft Gradient Glow */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute top-0 left-1/3 h-[400px] w-[400px] bg-purple-600/20 rounded-full blur-[140px]" />
//         <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] bg-pink-600/10 rounded-full blur-[140px]" />
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-20">

//         {/* TOP GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

//           {/* BRAND */}
//           <div>
//             <h3 className="text-2xl font-black text-white tracking-tight mb-4">
//               SMART<span className="text-purple-500">CART</span>
//             </h3>
//             <p className="text-gray-400 leading-relaxed max-w-sm">
//               SmartCart is your AI-powered shopping destination — faster, smarter
//               and built for the future of commerce.
//             </p>
//           </div>

//           {/* QUICK LINKS */}
//           <div>
//             <h4 className="text-white font-bold mb-5 tracking-wide">
//               Quick Links
//             </h4>
//             <ul className="space-y-3 text-sm">
//               <li><Link to="/" className="hover:text-white transition">Home</Link></li>
//               <li><Link to="/categories" className="hover:text-white transition">Categories</Link></li>
//               <li><Link to="/try-ai" className="hover:text-white transition">Try AI</Link></li>
//               <li><Link to="/offers" className="hover:text-white transition">Deals</Link></li>
//             </ul>
//           </div>

//           {/* SUPPORT */}
//           <div>
//             <h4 className="text-white font-bold mb-5 tracking-wide">
//               Support
//             </h4>
//             <ul className="space-y-3 text-sm">
//               <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
//               <li><Link to="/returns" className="hover:text-white transition">Returns</Link></li>
//               <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
//               <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
//             </ul>
//           </div>

//           {/* NEWSLETTER */}
//           <div>
//             <h4 className="text-white font-bold mb-5 tracking-wide">
//               Stay Updated
//             </h4>
//             <p className="text-gray-400 text-sm mb-4">
//               Get exclusive deals & AI recommendations straight to your inbox.
//             </p>

//             <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
//               <FiMail className="text-purple-400 ml-2" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="bg-transparent text-sm outline-none text-white placeholder-gray-500 flex-1 px-2"
//               />
//               <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition">
//                 Join
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div className="h-[1px] bg-white/10 mb-10" />

//         {/* BOTTOM BAR */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">

//           <p className="text-gray-500">
//             © {new Date().getFullYear()} SmartCart. All rights reserved.
//           </p>

//           {/* SOCIAL ICONS */}
//           <div className="flex items-center gap-5 text-lg">
//             <a href="#" className="hover:text-white transition"><FiInstagram /></a>
//             <a href="#" className="hover:text-white transition"><FiTwitter /></a>
//             <a href="#" className="hover:text-white transition"><FiLinkedin /></a>
//             <a href="#" className="hover:text-white transition"><FiGithub /></a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiMail,
  FiArrowRight,
  FiGlobe,
} from "react-icons/fi";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative overflow-hidden bg-[#050505] text-gray-400 border-t border-white/5">
      
      {/* 🔮 Dynamic Background Aura */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 h-[400px] w-full bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
        
        {/* TOP GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20"
        >

          {/* BRAND BLOCK (4 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-6 italic">
                SMART<span className="text-purple-500">CART.</span>
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg font-medium">
                Engineered for the modern shopper. Experience the fusion of 
                <span className="text-white"> Generative AI</span> and premium commerce.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[FiInstagram, FiTwitter, FiLinkedin, FiGithub].map((Icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5, backgroundColor: "rgba(168, 85, 247, 0.15)" }}
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* QUICK LINKS (2 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-all flex items-center gap-2 group">
                Home <FiArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link></li>
              <li><Link to="/categories" className="hover:text-purple-400 transition-all">Categories</Link></li>
              <li><Link to="/try-ai" className="hover:text-purple-400 transition-all">AI Style Lab</Link></li>
              <li><Link to="/offers" className="hover:text-purple-400 transition-all">Vault Deals</Link></li>
            </ul>
          </motion.div>

          {/* SUPPORT (2 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Service</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/help" className="hover:text-purple-400 transition-all">Concierge</Link></li>
              <li><Link to="/returns" className="hover:text-purple-400 transition-all">Track Order</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-400 transition-all">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-all">Legal</Link></li>
            </ul>
          </motion.div>

          {/* NEWSLETTER (4 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6 font-medium">
              Join the elite circle. Get AI-curated drops directly in your inbox.
            </p>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 pl-4">
                <FiMail className="text-purple-400" />
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="bg-transparent text-sm outline-none text-white placeholder-gray-600 flex-1 px-4 font-bold"
                />
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-purple-600 text-white text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition shadow-lg shadow-purple-600/20"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <p className="text-gray-600 text-[11px] font-black uppercase tracking-widest">
              © 2026 SMARTCART INC.
            </p>
            <span className="h-1 w-1 bg-gray-800 rounded-full hidden md:block" />
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-600">
               <FiGlobe className="text-purple-500" /> Global Store — IN
            </div>
          </div>

          <div className="flex items-center gap-8">
             <Link to="/sitemap" className="text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition">Sitemap</Link>
             <Link to="/cookies" className="text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
