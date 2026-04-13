import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Benefits from '../components/Benefits'
import ProductGrid from '../components/ProductGrid'
import Story from '../components/Story'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Benefits />
        <ProductGrid />
        <Story />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
