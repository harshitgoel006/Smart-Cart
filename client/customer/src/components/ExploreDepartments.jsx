


// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FiArrowUpRight } from "react-icons/fi";

// const departments = [
//   {
//     name: "Men",
//     slug: "men",
//     image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-blue-500",
//   },
//   {
//     name: "Women",
//     slug: "women",
//     image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-pink-500",
//   },
//   {
//     name: "Beauty & Grooming",
//     slug: "beauty",
//     image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-teal-500",
//   },
//   {
//     name: "Kids",
//     slug: "kids",
//     image: "https://images.unsplash.com/photo-1607082349566-1870e31f7d1c?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-yellow-500",
//   },
//   {
//     name: "Accessories",
//     slug: "accessories",
//     image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-orange-500",
//   },
//   {
//     name: "Home & Living",
//     slug: "home-living",
//     image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-stone-500",
//   },
//   {
//     name: "Electronics",
//     slug: "electronics",
//     image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-indigo-500",
//   },
//   {
//     name: "Gifts",
//     slug: "gifts",
//     image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-red-500",
//   },
// ];


// const ExploreDepartments = () => {
//   return (
//     <section className="relative py-32 overflow-hidden bg-[#fdfdfd]">
      
//       {/* Dynamic Background Glows */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-100/40 blur-[150px]" />
//         <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-blue-100/30 blur-[150px]" />
//       </div>

//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* Header with Luxury Typography */}
//         <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="max-w-xl"
//           >
//             <span className="text-xs font-black tracking-[0.4em] text-purple-600 uppercase mb-4 block">
//               The Collection 2026
//             </span>
//             <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
//               SHOP BY <br />
//               <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 DEPARTMENTS
//               </span>
//             </h2>
//           </motion.div>

//           <Link
//             to="/categories"
//             className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-purple-600 transition-all duration-500"
//           >
//             EXPLORE ALL
//             <FiArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
//           </Link>
//         </div>

//         {/* Bento Grid with Image Emphasis */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 auto-rows-[320px]">
//           {departments.map((item, i) => (
//             <motion.div
//               key={item.slug}
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ delay: i * 0.05, duration: 0.5 }}
//               viewport={{ once: true }}
//               className={`${item.gridSize} group relative`}
//             >
//               <Link
//                 to={`/categories/${item.slug}`}
//                 className="block h-full w-full overflow-hidden rounded-[3rem] bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]"
//               >
//                 {/* Background Accent Blur (Hidden initially) */}
//                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${item.accent} rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

//                 {/* Main Content */}
//                 <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">
//                       {item.name}
//                     </h3>
//                     <div className="h-1 w-0 bg-gray-900 group-hover:w-12 transition-all duration-500" />
//                   </div>

//                   {/* Glassmorphism Badge */}
//                   <div className="self-start px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 text-[10px] font-black tracking-widest uppercase text-gray-800 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
//                     Discover Now
//                   </div>
//                 </div>

//                 {/* Refined Image Styling */}
//                 <div className="absolute inset-0 z-10 p-4">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="h-full w-full object-cover rounded-[2.5rem] grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
//                     />
//                 </div>

//                 {/* Subtle Overlay to make text pop */}
//                 <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-transparent to-black/10" />

//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ExploreDepartments;




// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FiArrowUpRight } from "react-icons/fi";

// const departments = [
//   {
//     name: "Men",
//     slug: "men",
//     image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-blue-500",
//   },
//   {
//     name: "Women",
//     slug: "women",
//     image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-pink-500",
//   },
//   {
//     name: "Beauty & Grooming",
//     slug: "beauty",
//     image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-teal-500",
//   },
//   {
//     name: "Kids",
//     slug: "kids",
//     image: "https://images.unsplash.com/photo-1607082349566-1870e31f7d1c?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-yellow-500",
//   },
//   {
//     name: "Accessories",
//     slug: "accessories",
//     image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-orange-500",
//   },
//   {
//     name: "Home & Living",
//     slug: "home-living",
//     image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-stone-500",
//   },
//   {
//     name: "Electronics",
//     slug: "electronics",
//     image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-2",
//     accent: "bg-indigo-500",
//   },
//   {
//     name: "Gifts",
//     slug: "gifts",
//     image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
//     gridSize: "md:col-span-1",
//     accent: "bg-red-500",
//   },
// ];


// const ExploreDepartments = () => {
//   return (
//     <section className="relative py-32 overflow-hidden bg-[#fdfdfd]">
      
//       {/* Dynamic Background Glows */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-100/40 blur-[150px]" />
//         <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-blue-100/30 blur-[150px]" />
//       </div>

//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* Header with Luxury Typography */}
//         <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="max-w-xl"
//           >
//             <span className="text-xs font-black tracking-[0.4em] text-purple-600 uppercase mb-4 block">
//               The Collection 2026
//             </span>
//             <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
//               SHOP BY <br />
//               <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 DEPARTMENTS
//               </span>
//             </h2>
//           </motion.div>

//           <Link
//             to="/categories"
//             className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-purple-600 transition-all duration-500"
//           >
//             EXPLORE ALL
//             <FiArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
//           </Link>
//         </div>

//         {/* Bento Grid with Image Emphasis */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 auto-rows-[320px]">
//           {departments.map((item, i) => (
//             <motion.div
//               key={item.slug}
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ delay: i * 0.05, duration: 0.5 }}
//               viewport={{ once: true }}
//               className={`${item.gridSize} group relative`}
//             >
//               <Link
//                 to={`/categories/${item.slug}`}
//                 className="block h-full w-full overflow-hidden rounded-[3rem] bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]"
//               >
//                 {/* Background Accent Blur (Hidden initially) */}
//                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${item.accent} rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

//                 {/* Main Content */}
//                 <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">
//                       {item.name}
//                     </h3>
//                     <div className="h-1 w-0 bg-gray-900 group-hover:w-12 transition-all duration-500" />
//                   </div>

//                   {/* Glassmorphism Badge */}
//                   <div className="self-start px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 text-[10px] font-black tracking-widest uppercase text-gray-800 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
//                     Discover Now
//                   </div>
//                 </div>

//                 {/* Refined Image Styling */}
//                 <div className="absolute inset-0 z-10 p-4">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="h-full w-full object-cover rounded-[2.5rem] grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
//                     />
//                 </div>

//                 {/* Subtle Overlay to make text pop */}
//                 <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-transparent to-black/10" />

//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ExploreDepartments;



import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";

const departments = [
  {
    name: "Men",
    slug: "men",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-1",
    accent: "bg-blue-400",
  },
  {
    name: "Women",
    slug: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-2",
    accent: "bg-pink-400",
  },
  {
    name: "Beauty & Grooming",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-2",
    accent: "bg-teal-400",
  },
  {
    name: "Kids",
    slug: "kids",
    // New working Kids image link
    image: "https://images.unsplash.com/photo-1537655780520-1e392ead81f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gridSize: "md:col-span-1",
    accent: "bg-yellow-400",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-1",
    accent: "bg-orange-400",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-2",
    accent: "bg-stone-400",
  },
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-2",
    accent: "bg-indigo-400",
  },
  {
    name: "Gifts",
    slug: "gifts",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    gridSize: "md:col-span-1",
    accent: "bg-red-400",
  },
];

const ExploreDepartments = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-[#fafafa]">
      
      {/* 🌈 Dynamic Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 h-[600px] w-[600px] rounded-full bg-purple-500/30 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-pink-500/25 blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* NEW ENHANCED HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                <FiSearch className="text-purple-600" />
                <span className="text-xs font-black tracking-[0.5em] text-purple-600 uppercase">
                    Browse Universe
                </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.9]">
              SHOP BY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                LIFESTYLE.
              </span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center md:items-end"
          >
             <p className="text-gray-500 font-medium mb-6 text-lg md:text-right max-w-xs">
                Premium collections tailored for every chapter of your daily life.
             </p>
             <Link
                to="/categories"
                className="group flex items-center gap-3 px-12 py-5 rounded-full bg-gray-900 text-white font-black hover:bg-purple-600 transition-all duration-700 shadow-2xl hover:shadow-purple-500/40"
              >
                DISCOVER ALL
                <FiArrowUpRight className="text-xl group-hover:rotate-45 transition-transform duration-500" />
              </Link>
          </motion.div>
        </div>

        {/* BENTO GRID WITH ROUNDED CORNERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 auto-rows-[340px]">
          {departments.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className={`${item.gridSize} group relative`}
            >
              <Link
                to={`/categories/${item.slug}`}
                // rounded-[3.5rem] ensures extreme roundness top to bottom
                className="relative block h-full w-full overflow-hidden rounded-[3.5rem] bg-white border border-gray-100 hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.2)] transition-all duration-700"
              >
                {/* Visual Depth Accent */}
                <div className={`absolute -inset-2 w-full h-full ${item.accent} rounded-full blur-[100px] opacity-0 group-hover:opacity-15 transition-opacity duration-700`} />

                {/* Main Product/Category Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover rounded-[3.5rem] grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                />

                {/* Refined Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Content Overlay */}
                <div className="relative z-10 p-12 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-4xl font-black text-black tracking-tighter drop-shadow-2xl">
                      {item.name}
                    </h3>
                    <div className="mt-3 h-1.5 w-0 bg-black group-hover:w-16 transition-all duration-700 rounded-full" />
                  </div>

                  <span className="self-start px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-xs font-black tracking-widest uppercase text-white opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                    Explore Store
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreDepartments;