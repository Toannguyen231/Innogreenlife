document.addEventListener('DOMContentLoaded', () => {

    /* ── Header scroll ── */
    const hdr = document.getElementById('hdr');
    window.addEventListener('scroll', () => { hdr.style.background = scrollY > 50 ? 'rgba(255,253,245,.98)' : 'rgba(255,253,245,.9)'; }, { passive: true });

    /* ── Smooth nav ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - hdr.offsetHeight, behavior: 'smooth' }); }
    }));

    /* ── Parallax hero bg ── */
    const hbg = document.querySelector('.hero-bg img');
    window.addEventListener('scroll', () => { if (hbg) hbg.style.transform = `translateY(${scrollY * .22}px) scale(1.1)`; }, { passive: true });

    /* ── Fade-in observer ── */
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fi').forEach(el => io.observe(el));

    /* ── Counter ── */
    const co = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const raw = el.textContent.trim();
        const n = parseInt(raw.replace(/\D/g, ''));
        const sfx = raw.replace(/[\d]/g, '');
        if (!n) return;
        let v = 0; const inc = n / (1600 / 16);
        const t = setInterval(() => { v += inc; if (v >= n) { v = n; clearInterval(t); } el.textContent = Math.floor(v) + sfx; }, 16);
        co.unobserve(el);
    }), { threshold: .6 });
    document.querySelectorAll('.stat-num').forEach(el => co.observe(el));

    /* ── 3D tilt product image ── */
    const pi = document.querySelector('.prod-img');
    if (pi) {
        const img = pi.querySelector('img'); img.style.transition = 'transform .15s ease';
        pi.addEventListener('mousemove', e => { const r = pi.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5; img.style.transform = `scale(1.04) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`; });
        pi.addEventListener('mouseleave', () => img.style.transform = '');
    }

    /* ── Ripple ── */
    document.querySelectorAll('.btn-primary,.btn-buy,.btn-send,.hdr-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const r = this.getBoundingClientRect();
            const s = document.createElement('span'); s.className = 'rpl';
            s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
            this.appendChild(s); setTimeout(() => s.remove(), 700);
        });
    });

    /* ── Form & toast ── */
    const form = document.getElementById('cform');
    const toast = document.getElementById('toast');
    function showToast(msg) { toast.querySelector('span').textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4000); }
    if (form) {
        const btn = form.querySelector('.btn-send');
        form.addEventListener('submit', e => {
            e.preventDefault(); btn.querySelector('span').textContent = 'Sending…'; btn.disabled = true;
            setTimeout(() => {
                btn.querySelector('span').textContent = '✓ Sent!';
                btn.style.background = 'linear-gradient(135deg,#16A34A,#4ADE80)';
                showToast("Message sent! We'll be in touch soon 🥭");
                setTimeout(() => { btn.querySelector('span').textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3000);
            }, 1200);
        });
    }
});