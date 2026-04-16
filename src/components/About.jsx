import { useFadeIn } from '../hooks/useFadeIn'
import './About.css'

export default function About() {
  const ref = useFadeIn()

  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="fi about-inner" ref={ref}>
          <span className="tag">VỀ CHÚNG TÔI</span>
          <h2 className="stitle">Snacking Made Healthy – Tái Sinh Từ Lớp Vỏ</h2>
          
          <p className="stxt">
            Chúng tôi tin rằng ăn vặt lành mạnh phải gắn liền với sự bền vững. MAN-UP SNACK tiên phong biến vỏ xoài thành thực phẩm nhờ công nghệ Sấy lạnh, giúp giữ lượng dưỡng chất cao và hàm lượng chất xơ gấp 2 lần so với thịt quả
          </p>
          
          <p className="stxt">
            Mỗi gói snack không chỉ giàu chất chống oxy hóa Mangiferin giúp nạp năng lượng cho cơ thể, mà còn hiện thực hóa mô hình kinh tế tuần hoàn không rác thải. Thưởng thức vị ngon tự nhiên và an tâm tuyệt đối với mã QR truy xuất nguồn gốc minh bạch.
          </p>
        </div>
      </div>
    </section>
  )
}
