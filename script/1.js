// JavaScript for the website
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
                "Status": "5 HRS left till pickup thanks to your support ❤"
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
        },
        newdevice: {
            name: "Mistery Device",
            img: "https://pngimg.com/d/question_mark_PNG91.png",
            specs: {
                "Processor": "Qualcomm Snapdragon 870",
                "RAM": "8GB",
                "Storage": "256GB",
                "Display": "6.7\" 120Hz OLED",
                "Camera": "???",
                "Battery": "???",
                "OS": "???",
                "Status": "Coming soon! Stay tuned."
            }
        }
    };

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');

    mobileNavToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileNavToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile nav when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Copy to clipboard functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-clipboard');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                }, 2000);
            });
        });
    });

    // Device Modal Functionality
    const modal = document.getElementById('deviceModal');
    const modalClose = document.querySelector('.device-modal-close');
    const modalDeviceName = document.getElementById('modalDeviceName');
    const modalDeviceImage = document.getElementById('modalDeviceImage');
    const modalDeviceSpecs = document.getElementById('modalDeviceSpecs');

    // Open modal when clicking on device card
    document.querySelectorAll('.device-card, .device-link').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the device ID from the card or its parent
            const deviceId = this.dataset.device || this.closest('.device-card').dataset.device;
            
            if (deviceId && deviceSpecs[deviceId]) {
                const device = deviceSpecs[deviceId];
                
                // Set modal content
                modalDeviceName.textContent = device.name;
                modalDeviceImage.src = device.img;
                modalDeviceImage.alt = device.name;
                
                // Clear previous specs
                modalDeviceSpecs.innerHTML = '';
                
                // Add specs to modal
                Object.entries(device.specs).forEach(([key, value]) => {
                    const specItem = document.createElement('div');
                    specItem.className = 'spec-item';
                    
                    const specName = document.createElement('div');
                    specName.className = 'spec-name';
                    specName.textContent = key;
                    
                    const specValue = document.createElement('div');
                    specValue.className = 'spec-value';
                    specValue.textContent = value;
                    
                    specItem.appendChild(specName);
                    specItem.appendChild(specValue);
                    modalDeviceSpecs.appendChild(specItem);
                });
                
                // Show modal
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close modal when clicking on close button
    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.style.overflow = ''; // Re-enable scrolling
        }, 300);
    });

    // Close modal when clicking outside of modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.style.overflow = ''; // Re-enable scrolling
            }, 300);
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.style.overflow = ''; // Re-enable scrolling
            }, 300);
        }
    });

    // Scroll animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements to animate
    document.querySelectorAll('.project-card, .device-card, .support-card').forEach((el, index) => {
        el.style.opacity = 0;
        el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        observer.observe(el);
    });

    // Fade-in body on load
    document.body.classList.add('fadein-body');
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            document.body.classList.remove('fadein-body');
        }, 100);
    });

    // Remove shimmer effect for image loading
    // document.querySelectorAll('.device-image img').forEach(img => {
    //     img.classList.add('img-loading');
    //     img.addEventListener('load', () => {
    //         img.classList.remove('img-loading');
    //     });
    //     img.addEventListener('error', () => {
    //         img.classList.remove('img-loading');
    //     });
    // });