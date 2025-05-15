document.addEventListener('DOMContentLoaded', () => {
    // Skeleton loading
    setTimeout(() => {
        const skeletonOverlay = document.getElementById('skeleton-overlay');
        const progressFill = document.getElementById('progress-fill');
        if (skeletonOverlay) skeletonOverlay.classList.add('hide');
        if (progressFill) progressFill.style.width = '70.7%';
    }, 900);

    // Stars animation
    createStars(window.innerWidth <= 600);

    // Initialize animations
    initializeAnimations();

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', handleThemeToggle);
    }

    // Mobile nav toggle
    const sidebar = document.getElementById('sidebar');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                mobileNavToggle && !mobileNavToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Scroll to top button
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('show', window.scrollY > 200);
        });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Copy crypto address
    document.querySelectorAll('.crypto-address').forEach(el => {
        el.addEventListener('click', async function () {
            const address = this.getAttribute('data-address');
            if (!address) return;
            try {
                await navigator.clipboard.writeText(address);
                this.classList.add('copied');
                showNotification('Address copied to clipboard!');
                setTimeout(() => this.classList.remove('copied'), 2000);
            } catch (error) {
                showNotification('Failed to copy address.', 2000);
            }
        });
    });

    // Device modal system
    setupDeviceModal();
});

// Helper functions
function handleThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    document.body.classList.toggle('light');
    themeToggle.innerHTML = document.body.classList.contains('light')
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        statusIndicator.style.background = document.body.classList.contains('light') ? '#43e97b' : '#fafafa';
    }

    setTimeout(() => createStars(window.innerWidth <= 600), 300);
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), duration);
}

function createStars(isMobile = false) {
    const container = document.getElementById('stars-container');
    if (!container) return;
    container.innerHTML = '';
    const starCount = isMobile ? 40 : 120;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
        star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
        container.appendChild(star);
    }

    if (!isMobile) {
        for (let i = 0; i < 2; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.top = Math.random() * 80 + '%';
            shootingStar.style.left = Math.random() * 80 + '%';
            shootingStar.style.width = (Math.random() * 120 + 80) + 'px';
            shootingStar.style.animationDelay = (Math.random() * 3) + 's';
            container.appendChild(shootingStar);
        }
    }
}

function initializeAnimations() {
    document.querySelectorAll('.animate-in').forEach((el, i) => {
        setTimeout(() => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        }, 200 + i * 100);
    });
}

function setupDeviceModal() {
    const modal = document.getElementById('device-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalTitle || !modalBody || !modalClose) return;

    const deviceSpecs = {
        // Add your device specs here, example:
        "workstation": {
            name: "Workstation",
            img: "path/to/workstation.jpg",
            specs: {
                "CPU": "Intel i9-12900K",
                "GPU": "NVIDIA RTX 3080",
                "RAM": "32GB DDR5",
                "Storage": "2TB NVMe SSD"
            }
        },
        // Add more devices as needed
    };

    function openDeviceModal(deviceId) {
        const device = deviceSpecs[deviceId];
        if (!device) return;

        modalTitle.textContent = device.name;
        modalBody.innerHTML = `
            <img src="${device.img}" alt="${device.name}" class="modal-img">
            <ul class="spec-list">
                ${Object.entries(device.specs).map(([key, value]) => `
                    <li class="spec-item">
                        <div class="spec-label">${key}</div>
                        <div class="spec-value">${value}</div>
                    </li>
                `).join('')}
            </ul>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.device-card').forEach(card => {
        card.addEventListener('click', () => openDeviceModal(card.getAttribute('data-device')));
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && modal.classList.contains('active') && closeModal());
}
