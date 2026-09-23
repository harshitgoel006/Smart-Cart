import { Link } from 'react-router-dom'
import type { Category } from '../../../types'

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div><span className="eyebrow">Browse by mood</span><h2>Make room for better finds.</h2></div>
      </div>
      <div className="category-grid">
        {categories.map((category) => <Link className="category-card" to={`/categories/${category.slug}`} key={category._id}><h3>{category.name}</h3></Link>)}
      </div>
    </section>
  )
}
