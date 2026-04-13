import { useFadeIn } from '../hooks/useFadeIn'
import './About.css'

export default function About() {
  const ref = useFadeIn()

  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="fi about-inner" ref={ref}>
          <span className="tag">About</span>
          <h2 className="stitle">Snacking Made Healthy</h2>
          <p className="stxt">
            We believe healthy eating should be delicious and convenient. Our mango snacks are
            carefully crafted from premium, organically grown mangoes to deliver the perfect
            balance of natural sweetness and nutrition.
          </p>
          <p className="stxt">
            Each pack is filled with essential vitamins, fiber, and antioxidants to fuel your
            body while satisfying your sweet cravings the natural way.
          </p>
        </div>
      </div>
    </section>
  )
}
