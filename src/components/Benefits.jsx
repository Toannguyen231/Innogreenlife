import { useFadeIn } from '../hooks/useFadeIn'
import './Benefits.css'
// import '../../src/pages/index.css'
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
      title: 'Tự Nhiên & Tái Sinh',
      description: 'Tiên phong dòng thực phẩm tái chế (Upcycled Food) từ vỏ xoài tươi, sử dụng kỹ thuật khử chát tự nhiên, hoàn toàn không chiên qua dầu và không chất bảo quản.',
    },
    {
      icon: 'fa-solid fa-heart-pulse',
      title: 'Siêu Thực Phẩm Dinh Dưỡng',
      description: 'Sở hữu hàm lượng chất xơ cao gấp 2 lần thịt quả và giàu hợp chất quý Mangiferin giúp chống oxy hóa, hỗ trợ tiêu hóa và ngăn ngừa lão hóa hiệu quả.',
      delay: 'd1',
    },
    {
      icon: 'fa-solid fa-recycle',
      title: 'Sống Xanh & Minh Bạch',
      description: 'Hiện thực hóa mô hình kinh tế tuần hoàn (Net-Zero) bằng cách giảm phát thải khí Methane. Minh bạch nguồn gốc và nhật ký sấy qua mã QR định danh đã được niêm phong số.',
      delay: 'd2',
    },
  ]

  return (
    <section className="benefits" id="benefits">
      <div className="wrap">
        <div className="ben-hdr fi" ref={headerRef}>
          <span className="tag">Tại Sao Chọn MAN-UP</span>
          <h2 className="stitle"><span className="number-tittle">3</span> Lý Do Để Yêu MAN-UP</h2>
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
