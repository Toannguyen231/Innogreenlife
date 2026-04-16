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
            <span className="tag">Câu Chuyện</span>
            <h2 className="stitle">Hành Trình Tái Sinh</h2>
            <h3 className="story-subtitle">Từ "Phế Phẩm" Đến Siêu Thực Phẩm</h3>
            <p className="stxt">
              MAN-UP không chọn phần thịt xoài ngọt lịm thông thường, mà tập trung vào lớp vỏ – nơi chứa hàm lượng Mangiferin và chất xơ cao gấp 2 lần. Sứ mệnh của chúng tôi là thực hiện mô hình kinh tế tuần hoàn, giúp giảm phát thải khí Methane và tăng giá trị cây xoài thêm 15-20% cho nông dân.
            </p>
            <p className="stxt">
              Mỗi miếng snack là kết quả của công nghệ Sấy lạnh - ép đùn nổ bỏng, bảo tồn nhiều dưỡng chất mà không cần chiên dầu.
            </p>
            
            <div className="stats">
              <StatItem target={2} suffix="X" label="Chất Xơ" />
              <StatItem target={3} suffix=" KHÔNG" label="Không dầu mỡ, không chất bảo quản, không phẩm màu" />
              <StatItem target={0} suffix="" label="Phát thải (Net-Zero)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
