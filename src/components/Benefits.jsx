import { useFadeIn } from '../hooks/useFadeIn'
import './Benefits.css'

function BenefitCard({ icon, title, description, delay = '' }) {
  const ref = useFadeIn()
  return (
    <div className={`benefit-card fi${delay ? ' ' + delay : ''}`} ref={ref}>
      <div className="card-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default function Benefits() {
  const headerRef = useFadeIn()

  const items = [
    {
      icon: 'fa-solid fa-seedling',
      title: '100% Natural',
      description: 'Made from premium organic mangoes with no artificial additives or preservatives.',
    },
    {
      icon: 'fa-solid fa-heart-pulse',
      title: 'Healthy Snack',
      description: 'Rich in vitamins and fiber. A nutritious alternative to processed snacks.',
      delay: 'd1',
    },
    {
      icon: 'fa-solid fa-recycle',
      title: 'Eco-Friendly',
      description: 'Sustainable production process that minimizes waste and cares for our planet.',
      delay: 'd2',
    },
  ]

  return (
    <section className="benefits" id="benefits">
      <div className="wrap">
        <div className="ben-hdr fi" ref={headerRef}>
          <span className="tag">Why Choose Us</span>
          <h2 className="stitle">Three Reasons to Love</h2>
        </div>
        <div className="ben-grid">
          {items.map((item) => (
            <BenefitCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
