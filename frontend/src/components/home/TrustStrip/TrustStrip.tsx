const values = [
  ['✦', 'Thoughtfully picked', 'Products worth keeping'],
  ['⌁', 'Secure checkout', 'Simple and protected'],
  ['↺', 'Easy returns', 'Shop with confidence'],
  ['♧', 'Seller stories', 'Discover something new'],
]

export function TrustStrip() {
  return <section className="value-strip section">{values.map(([icon, title, description]) => <div key={title}><span className="value-icon">{icon}</span><div><strong>{title}</strong><small>{description}</small></div></div>)}</section>
}
