// ===== Scroll Progress Bar =====
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
    });
}

// ===== Hero Parallax =====
function initParallax() {
    const bg = document.querySelector('.hero-bg');
    if (!bg) return;
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        bg.style.transform = `scale(1.05) translateY(${scrolled * 0.35}px)`;
    }, { passive: true });
}

// ===== Day Tabs =====
function initDayTabs() {
    const tabs = document.querySelectorAll('.day-tab');
    const panels = document.querySelectorAll('.day-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            if (target) {
                target.classList.add('active');
                // Re-trigger fade animations for items inside
                target.querySelectorAll('.fade-up').forEach(el => {
                    el.classList.remove('visible');
                    setTimeout(() => el.classList.add('visible'), 50);
                });
            }
        });
    });
}

// ===== Accordion =====
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const body = item.querySelector('.accordion-body');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.accordion-body').style.maxHeight = '0';
            });

            // Open clicked (if was closed)
            if (!isOpen) {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
}

// ===== Intersection Observer (Fade Up) =====
function initFadeUp() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ===== Smooth scroll for nav =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== Number Counter Animation =====
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
}

// ===== Init all =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initParallax();
    initDayTabs();
    initAccordion();
    initFadeUp();
    initSmoothScroll();
    initCounters();
});
