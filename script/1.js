// Loading Skeleton
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.getElementById('skeleton-overlay').classList.add('hide');
                // Update the progress bar calculation (99/140 = 70.7%)
                const fill = document.getElementById('progress-fill');
                fill.style.width = '70.7%';
            }, 900);
            
            // Create stars animation - only if not mobile
            if (window.innerWidth > 600) {
                createStars();
            } else {
                // Create fewer stars for mobile
                createStars(true);
            }
            
            // Initialize animations
            initializeAnimations();
        });
        
        // Theme Toggle - Fixed
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light');
                themeToggle.innerHTML = document.body.classList.contains('light')
                    ? '<i class="fas fa-sun"></i>'
                    : '<i class="fas fa-moon"></i>';
                // Update status indicator color based on theme
                const statusIndicator = document.querySelector('.status-indicator');
                if (statusIndicator) {
                    statusIndicator.style.background = document.body.classList.contains('light') ? '#43e97b' : '#fafafa';
                }
                // Recreate stars for theme change
                setTimeout(() => createStars(window.innerWidth <= 600), 300);
            });
        }
        
        // Mobile Nav Toggle - Enhanced with error handling
        const sidebar = document.getElementById('sidebar');
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        if (mobileNavToggle && sidebar) {
            mobileNavToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
        
        // Scroll To Top Button - Enhanced
        const scrollBtn = document.getElementById('scroll-top-btn');
        if (scrollBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 200) {
                    scrollBtn.classList.add('show');
                } else {
                    scrollBtn.classList.remove('show');
                }
            });
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Copy crypto address to clipboard - With better error handling
        document.querySelectorAll('.crypto-address').forEach(el => {
            el.addEventListener('click', function() {
                const address = this.getAttribute('data-address');
                if (!address) return;
                navigator.clipboard.writeText(address).then(() => {
                    this.classList.add('copied');
                    showNotification('Address copied to clipboard!');
                    setTimeout(() => this.classList.remove('copied'), 2000);
                }).catch(() => {
                    showNotification('Failed to copy address.', 2000);
                });
            });
        });
        
        // Notification helper function
        function showNotification(message, duration = 3000) {
            const notification = document.getElementById('notification');
            if (!notification) return;
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), duration);
        }
        
        // Create animated stars background - Enhanced and optimized for mobile
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
            // Shooting stars
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
        
        // Animate-in effect for sections
        function initializeAnimations() {
            document.querySelectorAll('.animate-in').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = 1;
                    el.style.transform = 'none';
                }, 200 + i * 100);
            });
        }
        
        // Device Inventory Modal System
        document.addEventListener('DOMContentLoaded', () => {
            // Device specs data
            const deviceSpecs = {
                redmi12: {
                    name: "Xiaomi Redmi 12",
                    img: "https://media.croma.com/image/upload/v1708666027/Croma%20Assets/Communication/Mobiles/Images/275526_0_pnndxh.png",
                    specs: {
                        "Processor": "MediaTek Helio G88",
                        "RAM": "8GB",
                        "Storage": "256GB, expandable via microSD",
                        "Display": "6.79\" FHD+ LCD, 90Hz refresh rate",
                        "Camera": "50MP main + 8MP ultra-wide + 2MP macro",
                        "Battery": "5000mAh, 18W fast charging",
                        "OS": "HyperOS 2 (Global) Android 15"
                    }
                },
                a71: {
                    name: "Samsung Galaxy A71",
                    img: "https://wiki.lineageos.org/images/devices/a71.png",
                    specs: {
                        "Processor": "Qualcomm Snapdragon 730",
                        "RAM": "8GB",
                        "Storage": "128GB, expandable via microSD",
                        "Display": "6.7\" Super AMOLED, FHD+",
                        "Camera": "64MP main + 12MP ultra-wide + 5MP macro + 5MP depth",
                        "Battery": "4500mAh, 25W fast charging",
                        "OS": "AxionAOSP 1.4"
                    }
                },
                pad6: {
                    name: "Xiaomi Pad 6",
                    img: "https://i.ibb.co/MycBsvc0/1-41-removebg-preview.png",
                    specs: {
                        "Processor": "Qualcomm Snapdragon 870 5G",
                        "RAM": "8GB",
                        "Storage": "256GB",
                        "Display": "11\" 2.8K LCD, 144Hz refresh rate",
                        "Camera": "13MP rear, 8MP front",
                        "Battery": "8840mAh, 33W fast charging",
                        "OS": "AxionAOSP 1.4",
                        "Status": "Coming soon thanks to your support ❤"
                    }
                },
                pixel6pro: {
                    name: "Google Pixel 6 Pro",
                    img: "https://wiki.lineageos.org/images/devices/raven.png",
                    specs: {
                        "Processor": "Google Tensor",
                        "RAM": "12GB",
                        "Storage": "128GB",
                        "Display": "6.7\" QHD+ LTPO OLED, 120Hz refresh rate",
                        "Camera": "50MP main + 12MP ultra-wide + 48MP telephoto (4x optical zoom)",
                        "Battery": "5003mAh, 30W fast charging, wireless charging",
                        "OS": "AxionAOSP 1.5",
                        "Status": "Coming soon!"
                    }
                },
                thinkpadl480: {
                    name: "Lenovo ThinkPad L480",
                    img: "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8NjkwOTl8aW1hZ2UvcG5nfGhkNS9oYjYvOTYwOTE4NDc3MjEyNi5wbmd8ZDMxMWE2M2EyNDVhMmI3MGJhYjBkODUwYjRkM2YwODIwNDQ0NjVlNDM0ZmI5Njg1MGE5MTBkMGZjOWU1YTMxZQ/lenovo-laptop-thinkpad-l480-hero.png",
                    specs: {
                        "Processor": "Intel Core i5-8250U",
                        "RAM": "16GB DDR4",
                        "Storage": "512GB SSD",
                        "Display": "14\" FHD (1920x1080)",
                        "Graphics": "Intel UHD Graphics 620",
                        "Battery": "45Wh, up to 12 hours",
                        "OS": "Windows 10 / Arch Dual boot"
                    }
                }
            };
            
            const modal = document.getElementById('device-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');
            const modalClose = document.getElementById('modal-close');
            
            // Open modal with device info
            function openDeviceModal(deviceId) {
                const device = deviceSpecs[deviceId];
                
                if (!device) return;
                
                modalTitle.textContent = device.name;
                
                // Build modal content
                let content = `
                    <img src="${device.img}" alt="${device.name}" class="modal-img">
                    <ul class="spec-list">
                `;
                
                // Add all specs
                for (const [key, value] of Object.entries(device.specs)) {
                    content += `
                        <li class="spec-item">
                            <div class="spec-label">${key}</div>
                            <div class="spec-value">${value}</div>
                        </li>
                    `;
                }
                
                content += `</ul>`;
                modalBody.innerHTML = content;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
            
            // Close modal
            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Event listeners
            document.querySelectorAll('.device-card').forEach(card => {
                card.addEventListener('click', () => {
                    const deviceId = card.getAttribute('data-device');
                    openDeviceModal(deviceId);
                });
            });
            
            modalClose.addEventListener('click', closeModal);
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });