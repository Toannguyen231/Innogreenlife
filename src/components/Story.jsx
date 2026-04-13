import { useFadeIn } from '../hooks/useFadeIn'
import { useCounter } from '../hooks/useCounter'
import farmImg from '../assets/img/vuon-xoai-cam-lam-1.jpg'
import './Story.css'

function StatItem({ target, suffix, label }) {
  const { ref, display } = useCounter(target, suffix)
  return (
    <div className="stat">
      <span className="stat-num" ref={ref}>{display}</span>
      <span className="stat-lbl">{label}</span>
    </div>
  )
}

export default function Story() {
  const imgRef  = useFadeIn()
  const textRef = useFadeIn()

  return (
    <section className="story" id="story">
      <div className="wrap">
        <div className="story-wrap">
          <div className="story-img fi" ref={imgRef}>
            <img src={farmImg} alt="Mango Farm" />
          </div>

          <div className="fi d1" ref={textRef}>
            <span className="tag">Our Story</span>
            <h2 className="stitle">From Farm to You</h2>
            <p className="stxt">
              MangoRush started with a simple mission: to make healthy eating accessible and
              delicious. We partner with local farmers who share our commitment to quality
              and sustainability.
            </p>
            <p className="stxt">
              Every mango is hand-picked at peak ripeness, ensuring the sweetest flavor and
              maximum nutrition. Our eco-friendly drying process preserves all the natural goodness.
            </p>

            <div className="stats">
              <StatItem target={50000} suffix="K+" label="Happy Customers" />
              <StatItem target={15}    suffix=""   label="Countries" />
              <StatItem target={100}   suffix="%"  label="Natural" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
