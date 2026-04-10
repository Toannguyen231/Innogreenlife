document.addEventListener('DOMContentLoaded', () => {

    /* ── Custom Cursor ── */
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .benefit-card, .product__btn').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });

    /* ── Particles ── */
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    document.body.prepend(particleContainer);
    const colors = ['#F59E0B', '#16A34A', '#FCD34D', '#4ADE80'];
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 12 + 6;
        p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${Math.random() * 20 + 15}s;animation-delay:${Math.random() * 10}s;`;
        particleContainer.appendChild(p);
    }

    /* ── Header ── */
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.header__nav a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        header.style.background = window.scrollY > 50 ? 'rgba(255,253,245,0.98)' : 'rgba(255,253,245,0.88)';
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - header.offsetHeight - 80) current = sec.id;
        });
        navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--secondary)' : '';
        });
    }, { passive: true });

    /* ── Smooth scroll ── */
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
        });
    });
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' }); }
        });
    });

    /* ── Scroll indicator ── */
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollEl = document.createElement('div');
        scrollEl.className = 'hero__scroll';
        scrollEl.innerHTML = '<div class="hero__scroll-line"></div><span>Scroll</span>';
        hero.appendChild(scrollEl);
        scrollEl.addEventListener('click', () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }));
    }

    /* ── Hero title highlight ── */
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        heroTitle.innerHTML = heroTitle.innerHTML.replace('Healthy', '<span class="highlight">Healthy</span>');
    }

    /* ── Fade-in observer ── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ── Benefit cards stagger ── */
    const cardObserver = new IntersectionObserver((entries) => {
        let delay = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), delay);
                delay += 120;
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.benefit-card').forEach(c => cardObserver.observe(c));

    /* ── Animated counter ── */
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const num = parseInt(raw.replace(/[^0-9]/g, ''));
            const suffix = raw.replace(/[0-9]/g, '');
            if (!num) return;
            let start = 0;
            const inc = num / (1800 / 16);
            const counter = setInterval(() => {
                start += inc;
                if (start >= num) { start = num; clearInterval(counter); }
                el.textContent = Math.floor(start) + suffix;
            }, 16);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat__number').forEach(el => countObserver.observe(el));

    /* ── Ripple ── */
    document.querySelectorAll('.hero__btn, .product__btn, .header__btn, .contact__btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    /* ── Parallax hero ── */
    window.addEventListener('scroll', () => {
        const heroBg = document.querySelector('.hero__bg img');
        if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.1)`;
    }, { passive: true });

    /* ── Tilt on product image ── */
    const productImg = document.querySelector('.product__image');
    if (productImg) {
        const img = productImg.querySelector('img');
        if (img) img.style.transition = 'transform 0.15s ease';
        productImg.addEventListener('mousemove', e => {
            const rect = productImg.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            if (img) img.style.transform = `scale(1.04) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        productImg.addEventListener('mouseleave', () => {
            if (img) img.style.transform = '';
        });
    }

    /* ── Price tag ── */
    const priceOrig = document.querySelector('.price__original');
    if (priceOrig && !document.querySelector('.price__tag')) {
        const tag = document.createElement('span');
        tag.className = 'price__tag';
        tag.textContent = '-25%';
        priceOrig.insertAdjacentElement('afterend', tag);
    }

    /* ── Form + Toast ── */
    const form = document.querySelector('.contact__form');
    if (form) {
        const btn = form.querySelector('.contact__btn');
        btn.innerHTML = '<span>Send Message</span>';
        form.addEventListener('submit', e => {
            e.preventDefault();
            btn.querySelector('span').textContent = 'Sending…';
            btn.disabled = true;
            setTimeout(() => {
                btn.querySelector('span').textContent = '✓ Sent!';
                btn.style.background = 'linear-gradient(135deg, #16A34A, #4ADE80)';
                showToast("Message sent! We'll get back to you soon 🥭");
                setTimeout(() => {
                    btn.querySelector('span').textContent = 'Send Message';
                    btn.style.background = '';
                    btn.disabled = false;
                    form.reset();
                }, 3000);
            }, 1200);
        });
    }

    function showToast(msg) {
        let toast = document.querySelector('.toast');
        if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${msg}</span>`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
});