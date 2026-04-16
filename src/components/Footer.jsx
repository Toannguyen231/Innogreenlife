import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="#" className="foot-logo">
              <img src="/img/logo-removebg-preview.png" alt="MAN-UP" style={{ height: '40px' }} />
              <span>MAN-UP</span>
            </a>
            <p>Premium mango snacks for a healthier lifestyle.</p>
          </div>

          <div className="foot-col">
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#benefits">Benefits</a>
            <a href="#product">Product</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="foot-col">
            <h4>Contact</h4>
            <div className="ci">
              <i className="fa-solid fa-envelope"></i> manupsnack@gmail.com
            </div>
            <div className="ci">
              <i className="fa-solid fa-phone"></i> 0378978498
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          &copy; 2024 MAN-UP. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
