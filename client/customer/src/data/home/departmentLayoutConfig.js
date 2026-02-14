

export const departmentLayoutConfig = {
  // Line 1: 3 + 2 = 5 Columns
  women: { 
    gridSize: "md:col-span-2 md:row-span-2", 
    accent: "from-pink-600" 
  },
  men: { 
    gridSize: "md:col-span-3 md:row-span-2", 
    accent: "from-blue-600" 
  },
  kids: { 
    gridSize: "md:col-span-1 md:row-span-1", 
    accent: "from-purple-600" 
  },

  // Line 2: 2 + 3 = 5 Columns
  "beauty-grooming": { 
    gridSize: "md:col-span-2 md:row-span-1", 
    accent: "from-rose-600" 
  },
  electronics: { 
    gridSize: "md:col-span-2 md:row-span-1", 
    accent: "from-cyan-600" 
  },
   gifts: { 
    gridSize: "md:col-span-1 md:row-span-1", 
    accent: "from-red-600" 
  },

  // Line 3: Mixing smaller boxes
  accessories: { 
    gridSize: "md:col-span-2 md:row-span-1", 
    accent: "from-amber-600" 
  },
  "home-living": { 
    gridSize: "md:col-span-2 md:row-span-1", 
    accent: "from-orange-600" 
  },
 
};