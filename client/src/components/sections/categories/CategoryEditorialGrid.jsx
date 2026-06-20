import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoriesGrid } from "../../../content/categories/categoriesGrid";

// Rebalanced heights to give text breathing room and avoid text-clipping
const cardStyles = {
  men: "lg:col-span-2 h-[340px]",
  women: "lg:col-span-2 h-[340px]",

  electronics: "lg:col-span-2 h-[280px]",
  "home-living": "lg:col-span-2 h-[280px]",

  "beauty-grooming": "h-[240px]",
  "sports-gym": "h-[240px]",
  gifts: "h-[240px]",
  accessories: "h-[240px]",

  groceries: "lg:col-span-2 h-[280px]",
  kids: "lg:col-span-2 h-[280px]",
};

const orderedCategories = [
  "men",
  "women",
  "electronics",
  "home-living",
  "beauty-grooming",
  "sports-gym",
  "gifts",
  "accessories",
  "groceries",
  "kids",
];

const CategoryEditorialGrid = () => {
  const categories = orderedCategories
    .map((slug) => categoriesGrid.find((category) => category.slug === slug))
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 gap-10">
      {/* ── Header (Untouched) ── */}
      <div className="mb-16 flex flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div
              className="h-[2px] w-12 rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              className="uppercase font-semibold"
              style={{
                fontSize: "9.5px",
                letterSpacing: "0.3em",
                color: "#7c3aed",
              }}
            >
              All Categories
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem,5vw,3.8rem)",
              lineHeight: 1,
              color: "#1e1b4b",
            }}
          >
            Explore Every{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg,#6d28d9,#c026d3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Department
            </em>
          </h2>
        </div>

        <div className="max-w-sm">
          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.9,
              borderLeft: "1px solid rgba(167,139,250,0.25)",
              paddingLeft: "1.25rem",
            }}
          >
            Curated collections across fashion, technology, beauty, home and
            more.
          </p>
        </div>
      </div>

      <br />
      <br />

      {/* ── Optimized Grid Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 will-change-transform">
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className={`group relative block overflow-hidden rounded-[28px] ${cardStyles[category.slug]}`}
              style={{
                boxShadow: "0 6px 24px rgba(0,0,0,.06)",
              }}
            >
              {/* Image */}

              <img
                src={category.image.url}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              {/* Overlay */}

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(8,8,20,.82),rgba(8,8,20,.18))",
                }}
              />

              {/* Content */}

              <div
                className="absolute inset-0 z-10 flex items-end"
                style={{
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                  }}
                >
                  {/* Tag */}

                  <div
                    style={{
                      color: "rgba(255,255,255,.72)",
                      fontSize: "11px",
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    — {category.tag}
                  </div>

                  {/* Title */}

                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(2rem,3vw,2.8rem)",
                      color: "#fff",
                      lineHeight: 0.95,
                      marginBottom: "14px",
                    }}
                  >
                    {category.name}
                  </h3>

                  {/* CTA */}

                  <div
                    className="flex items-center gap-2"
                    style={{
                      color: "rgba(255,255,255,.85)",
                      fontSize: "12px",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Explore
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryEditorialGrid;
