import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORY_IMAGES } from '../../../constants'

const slides = [
  {
    eyebrow: 'The smarter setup',
    title: 'Tech that',
    accent: 'keeps you moving.',
    description: 'Thoughtful devices and everyday tools that make your routines feel effortless.',
    href: '/categories/electronics',
    image: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790334527/SmartCart/editorial/image_k0esv1.png',
    alt: 'Laptop, tablet, headphones, camera and smart devices arranged on a wooden desk',
  },
  {
    eyebrow: 'The finishing touch',
    title: 'Details that',
    accent: 'make the look.',
    description: 'Signature accessories and everyday essentials chosen to add character to your style.',
    href: '/categories/men',
    image: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790334529/SmartCart/editorial/image2_wpkhcp.png',
    alt: 'Watches, fragrances, leather goods, sunglasses and accessories arranged in a warm editorial setting',
  },
  {
    eyebrow: 'For little ones',
    title: 'Gifts that',
    accent: 'spark bigger smiles.',
    description: 'Thoughtful finds for playtime, celebrations, and all the little moments worth remembering.',
    href: '/categories/gifts',
    image: CATEGORY_IMAGES.gifts,
    alt: 'Thoughtful gifts arranged in a warm editorial setting',
  },
]

export function EditorialFeature() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [])

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section className="editorial editorial--feature section" id="offers">
      <div className="editorial__copy" key={`${activeIndex}-copy`}>
        <span className="eyebrow">{activeSlide.eyebrow}</span>
        <h2>
          {activeSlide.title}
          <br />
          <em>{activeSlide.accent}</em>
        </h2>
        <p>{activeSlide.description}</p>
        <Link className="primary-button" to={activeSlide.href}>
          Explore the edit <ArrowRight size={19} strokeWidth={2} aria-hidden="true" />
        </Link>
        <div className="editorial__details">
          <span>Thoughtfully selected</span>
          <span>Everyday essentials</span>
        </div>
      </div>

      <div className="editorial__image" key={`${activeIndex}-image`}>
        <img src={activeSlide.image} alt={activeSlide.alt} loading="lazy" />
        <div className="editorial__controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous editorial slide">
            <ArrowLeft size={17} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next editorial slide">
            <ArrowRight size={17} strokeWidth={1.8} />
          </button>
        </div>
        <div className="editorial__dots" aria-label="Editorial slides">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${slide.eyebrow}`}
              key={slide.eyebrow}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
