import { useFadeIn } from '../hooks/useFadeIn'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const PRODUCTS = [
  {
    id: 1,
    title: 'Snack vỏ xoài vị phô mai',
    description: 'Hương vị phô mai ngọt ngào nơi đầu lưỡi, ngon đến bất ngờ nhờ hương vị tự nhiên.',
    link: '/product',
  },
  {
    id: 2,
    title: 'Snack vỏ xoài vị tự nhiên',
    description: 'Giữ nguyên vị ngọt thuần túy của xoài tươi, sấy khô giòn tan hấp dẫn.',
    link: '/product',
  },
  {
    id: 3,
    title: 'Snack vỏ xoài vị cay muối',
    description: 'Kết hợp hoàn hảo giữa vị cay nhẹ và muối tinh, kích thích vị giác.',
    link: '/product',
  },
]

export default function ProductGrid() {
  const headerRef = useFadeIn()

  return (
    <section className="product-section" id="product">
      <div className="container-product">
        <div className="ben-hdr fi" ref={headerRef}>
          <span className="tag">Our Product</span>
          <h2 className="stitle">Premium Mango Snacks</h2>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
