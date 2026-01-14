/**
 * XPERT TERM - FINAL JS ENGINE (Vanilla)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация иконок
    lucide.createIcons();

    // 2. Инициализация Lenis (Плавный скролл)
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. Мобильное меню
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        burger.classList.toggle('burger--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    };

    burger.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // 4. Reveal Animation (Intersection Observer)
    const initReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // 5. Hero Parallax
    const initParallax = () => {
        const hero = document.querySelector('.hero');
        const card = document.querySelector('.viz__card');
        if (!hero || !card) return;

        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });
    };

    // 6. Card Glow Effect
    const initCardGlow = () => {
        const cards = document.querySelectorAll('.about-card, .contact__form-wrapper');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    };

    // 7. Counters (Count Up)
    const initCounters = () => {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const goal = parseInt(target.getAttribute('data-target'));
                    let current = 0;
                    const step = goal / 100;
                    const update = () => {
                        current += step;
                        if (current < goal) {
                            target.innerText = Math.ceil(current);
                            setTimeout(update, 20);
                        } else {
                            target.innerText = goal;
                        }
                    };
                    update();
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.stats-box__number').forEach(n => counterObserver.observe(n));
    };

    // 8. Контактная форма и капча
    let captchaRes = 0;
    const genCaptcha = () => {
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        captchaRes = n1 + n2;
        const q = document.getElementById('captcha-question');
        if (q) q.innerText = `${n1} + ${n2} = ?`;
    };

    const initForm = () => {
        const form = document.getElementById('contact-form');
        const phone = document.getElementById('phone-input');
        if (!form) return;

        phone.addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, ''));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const ans = parseInt(document.getElementById('captcha-answer').value);
            if (ans !== captchaRes) {
                alert('Капча введена неверно!');
                genCaptcha();
                return;
            }
            const btn = document.getElementById('submit-btn');
            btn.disabled = true;
            btn.innerText = 'Отправка...';
            setTimeout(() => {
                form.classList.add('form--hidden');
                document.getElementById('form-success').classList.add('form-success--active');
            }, 1500);
        });
    };

    // 9. Cookie Popup
    const initCookies = () => {
        const popup = document.getElementById('cookie-popup');
        const acceptBtn = document.getElementById('cookie-accept');
        
        if (!localStorage.getItem('xpert_cookies_accepted')) {
            setTimeout(() => {
                popup.classList.add('cookie-popup--active');
            }, 2000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('xpert_cookies_accepted', 'true');
            popup.classList.remove('cookie-popup--active');
        });
    };

    // Запуск всех систем
    initReveal();
    initParallax();
    initCardGlow();
    initCounters();
    genCaptcha();
    initForm();
    initCookies();
});

// Глобальная функция сброса формы (для кнопки в окне успеха)
function resetForm() {
    location.reload(); 
}