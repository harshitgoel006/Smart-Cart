import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react'

const values = [
  { icon: ShieldCheck, title: 'Secure payments', description: 'Protected checkout, every time' },
  { icon: Truck, title: 'Reliable delivery', description: 'Carefully packed and sent your way' },
  { icon: RotateCcw, title: 'Easy 7-day returns', description: 'Shop with complete confidence' },
  { icon: Headphones, title: 'Here to help', description: 'Friendly support when you need it' },
]

export function TrustStrip() {
  return (
    <section className="value-strip trust-badges section" aria-label="SmartCart promises">
      {values.map(({ icon: Icon, title, description }) => (
        <div key={title}>
          <span className="value-icon"><Icon size={18} strokeWidth={1.8} /></span>
          <div><strong>{title}</strong><small>{description}</small></div>
        </div>
      ))}
    </section>
  )
}
