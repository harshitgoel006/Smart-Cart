import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { CATEGORY_IMAGES } from '../../../constants'
import type { Category } from '../../../types'

const homeCategoryOrder = [
  { slugs: ['men'], slug: 'men', imageKey: 'men', label: 'Men' },
  { slugs: ['women'], slug: 'women', imageKey: 'women', label: 'Women' },
  { slugs: ['electronics'], slug: 'electronics', imageKey: 'electronics', label: 'Electronics' },
  { slugs: ['home-living', 'home-and-living', 'home-lifestyle'], slug: 'home-living', imageKey: 'home-living', label: 'Home & Living' },
  { slugs: ['beauty', 'beauty-grooming', 'beauty-and-grooming'], slug: 'beauty', imageKey: 'beauty', label: 'Beauty' },
  { slugs: ['groceries', 'grocery'], slug: 'groceries', imageKey: 'groceries', label: 'Groceries' },
  { slugs: ['sports', 'sports-gym', 'sports-and-gym'], slug: 'sports', imageKey: 'sports', label: 'Sports & Gym' },
  { slugs: ['gifts', 'gift'], slug: 'gifts', imageKey: 'gifts', label: 'Gifts' },
]

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const visibleCategories = homeCategoryOrder
    .map((wantedCategory) => {
      const category = categories.find((item) => wantedCategory.slugs.includes(item.slug))
      return category
        ? { ...category, name: wantedCategory.label }
        : {
            _id: `home-${wantedCategory.slug}`,
            name: wantedCategory.label,
            slug: wantedCategory.slug,
            image: { url: CATEGORY_IMAGES[wantedCategory.imageKey] },
          }
    })

  return (
    <section className="category-showcase section" id="categories">
      <div className="category-showcase__intro">
        <div className="category-showcase__heading">
          <span className="eyebrow">Shop by category</span>
          <h2>Curated finds for the way you live.</h2>
          <p>Explore thoughtful essentials, made for every mood and everyday moment.</p>
        </div>
        <Link className="section-link" to="/products">
          View all categories <ArrowRight size={16} strokeWidth={1.8} />
        </Link>
      </div>
      <div className="category-showcase__grid">
        {visibleCategories.map((category) => {
          // Once uploaded, the Cloudinary image stored in the category wins.
          // The theme mapping remains a safe fallback for older records.
          const image = category.image?.url || CATEGORY_IMAGES[category.slug]

          return (
            <Link className="category-tile" to={`/categories/${category.slug}`} key={category._id}>
              {image ? <img src={image} alt={category.name} loading="lazy" /> : <div className="category-tile__fallback" />}
              <span className="category-tile__shade" />
              <span className="category-tile__content">
                <span className="category-tile__eyebrow">Explore</span>
                <span className="category-tile__name">{category.name}</span>
                <span className="category-tile__arrow"><ArrowUpRight size={18} strokeWidth={1.8} /></span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
