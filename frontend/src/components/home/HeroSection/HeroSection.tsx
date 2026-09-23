import type { Banner } from '../../../types'

type HeroSectionProps = {
  banner?: Banner
  fallbackImage: string
}

export function HeroSection({ banner, fallbackImage }: HeroSectionProps) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${banner?.image?.url || fallbackImage})` }}>
      <div className="hero__content">
        <span className="eyebrow hero__eyebrow">The everyday edit</span>
        <h1>{banner?.title || 'Find a little more of what feels like you.'}</h1>
        <p>{banner?.tagline || 'Thoughtful essentials, considered prices, and a smarter way to shop.'}</p>
      </div>
    </section>
  )
}
