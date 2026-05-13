/* =========================================
   FOODLION - ENHANCED SCRIPT.JS
   ========================================= */

/* =========================================
   1. PAGE LOADER
   ========================================= */
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }
    // Trigger initial reveal
    reveal();
    checkUserSession();
});

/* =========================================
   2. STICKY HEADER WITH SHRINK EFFECT
   ========================================= */
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
    reveal();
    updateScrollProgress();
});

/* =========================================
   3. SCROLL PROGRESS BAR
   ========================================= */
function updateScrollProgress() {
    let bar = document.getElementById('scroll-progress');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'scroll-progress';
        bar.style.cssText = `
            position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
            background: linear-gradient(90deg, #FF5722, #ff8a65);
            transition: width 0.1s ease;
            pointer-events: none;
        `;
        document.body.appendChild(bar);
    }
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
}

/* =========================================
   4. MOBILE MENU TOGGLE (ENHANCED)
   ========================================= */
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    const menuIcon = document.querySelector('.menu-toggle i');

    nav.classList.toggle('active');

    if (nav.classList.contains('active')) {
        if (menuIcon) {
            menuIcon.classList.replace('fa-bars', 'fa-xmark');
            menuIcon.style.animation = 'spin180 0.3s ease forwards';
        }
    } else {
        if (menuIcon) {
            menuIcon.classList.replace('fa-xmark', 'fa-bars');
            menuIcon.style.animation = 'spin180reverse 0.3s ease forwards';
        }
    }
}

// Inject icon spin keyframes once
(function() {
    if (!document.getElementById('icon-spin-style')) {
        const s = document.createElement('style');
        s.id = 'icon-spin-style';
        s.textContent = `
            @keyframes spin180 { from { transform: rotate(0deg); } to { transform: rotate(180deg); } }
            @keyframes spin180reverse { from { transform: rotate(180deg); } to { transform: rotate(0deg); } }
        `;
        document.head.appendChild(s);
    }
})();

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav ul');
    const toggle = document.querySelector('.menu-toggle');
    if (nav && toggle && nav.classList.contains('active')) {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('active');
            const icon = document.querySelector('.menu-toggle i');
            if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
        }
    }
});

/* =========================================
   5. TOAST NOTIFICATION (Replaces alerts)
   ========================================= */
function showNotification(message, type = 'success') {
    // Remove any existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* =========================================
   6. ADD TO CART (No Alerts, Uses Toast)
   ========================================= */
function addToCart(item, price, imagePath) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const image = imagePath || 'images/logo-final.png';
    cart.push({ item, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`🛒 ${item} added to your order!`);

    // Animate cart icon in nav if present
    const cartLink = document.querySelector('nav ul li a[href*="cart"]');
    if (cartLink) {
        cartLink.style.animation = 'none';
        cartLink.offsetHeight; // reflow
        cartLink.style.animation = 'cartBounce 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    }
}

// Inject cart bounce keyframe once
(function() {
    if (!document.getElementById('cart-bounce-style')) {
        const s = document.createElement('style');
        s.id = 'cart-bounce-style';
        s.textContent = `
            @keyframes cartBounce {
                0% { transform: scale(1); }
                40% { transform: scale(1.3) rotate(-5deg); }
                70% { transform: scale(0.95) rotate(3deg); }
                100% { transform: scale(1) rotate(0); }
            }
        `;
        document.head.appendChild(s);
    }
})();

/* =========================================
   7. SCROLL REVEAL ENGINE (Enhanced)
   ========================================= */
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
            el.classList.add('active');
        }
    });

    // Stagger children inside newly revealed sections
    document.querySelectorAll('.reveal.active').forEach(section => {
        const cards = section.querySelectorAll('.card:not(.animated)');
        cards.forEach((card, i) => {
            card.classList.add('animated');
            card.style.transitionDelay = `${i * 0.1}s`;
        });
    });
}

/* =========================================
   8. USER SESSION CHECK
   ========================================= */
function checkUserSession() {
    const user = localStorage.getItem('currentUser');
    const authLink = document.querySelector('nav ul li a.btn');

    if (user && authLink) {
        const displayName = user.charAt(0).toUpperCase() + user.slice(1);
        authLink.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${displayName}`;
        authLink.href = 'index.html';
        authLink.style.background = 'var(--dark-color)';
    }
}

/* =========================================
   9. CART COUNT BADGE
   ========================================= */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLinks = document.querySelectorAll('nav ul li a[href*="cart"]');

    cartLinks.forEach(link => {
        const existing = link.querySelector('.cart-count');
        if (existing) existing.remove();

        if (cart.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-count';
            badge.textContent = cart.length;
            badge.style.cssText = `
                position: absolute; top: -6px; right: -6px;
                background: var(--primary-color); color: white;
                border-radius: 50%; width: 18px; height: 18px;
                font-size: 0.65rem; font-weight: 700;
                display: flex; align-items: center; justify-content: center;
                line-height: 1; animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
                pointer-events: none;
            `;
            link.style.position = 'relative';
            link.appendChild(badge);
        }
    });
}

// Inject badge pop style
(function() {
    if (!document.getElementById('badge-pop-style')) {
        const s = document.createElement('style');
        s.id = 'badge-pop-style';
        s.textContent = `
            @keyframes badgePop {
                from { transform: scale(0) rotate(-20deg); opacity: 0; }
                to { transform: scale(1) rotate(0); opacity: 1; }
            }
        `;
        document.head.appendChild(s);
    }
})();

/* =========================================
   10. COUPON CODE COPY (for discount banner)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    reveal();
    updateCartBadge();

    // Coupon copy interaction
    const coupon = document.querySelector('.coupon-code');
    if (coupon) {
        coupon.title = 'Click to copy!';
        coupon.style.cursor = 'pointer';
        coupon.addEventListener('click', () => {
            const code = coupon.querySelector('span')?.textContent || 'LION50';
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    showNotification(`✅ Code "${code}" copied to clipboard!`);
                });
            } else {
                showNotification(`Use code: ${code}`);
            }
        });
    }

    // Add tilt effect to cards
    addTiltEffect();

    // Animate numbers/stats if present
    animateCounters();

    // Inject the page loader into every page
    injectLoader();
});

/* =========================================
   11. INJECT PAGE LOADER
   ========================================= */
function injectLoader() {
    if (!document.getElementById('page-loader')) {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-logo">
                <img src="images/logo-final.png" alt="Loading FoodLion">
            </div>
            <div class="loader-bar"></div>
        `;
        document.body.insertBefore(loader, document.body.firstChild);
        setTimeout(() => loader.classList.add('hidden'), 800);
    }
}

/* =========================================
   12. SUBTLE TILT EFFECT ON CARDS
   ========================================= */
function addTiltEffect() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

/* =========================================
   13. COUNTER ANIMATION
   ========================================= */
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + (counter.dataset.suffix || '');
        }, 16);
    });
}

/* =========================================
   14. SEARCH BAR LIVE FILTER (restaurants page)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.rest-card');
            cards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                const match = name.includes(query) || desc.includes(query);
                card.style.transition = 'all 0.3s ease';
                if (match || query === '') {
                    card.style.opacity = '1';
                    card.style.transform = '';
                    card.style.pointerEvents = '';
                } else {
                    card.style.opacity = '0.3';
                    card.style.transform = 'scale(0.97)';
                    card.style.pointerEvents = 'none';
                }
            });
        });

        // Search button click
        const searchBtn = document.querySelector('.search-bar button');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                searchInput.dispatchEvent(new Event('input'));
            });
        }
    }
});

/* =========================================
   15. SMOOTH ANCHOR SCROLL
   ========================================= */
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.hash) {
        const target = document.querySelector(e.target.hash);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

/* =========================================
   16. IMAGE LAZY LOAD FADE-IN
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                if (img.complete) img.style.opacity = '1';
                imgObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imgObserver.observe(img));
});