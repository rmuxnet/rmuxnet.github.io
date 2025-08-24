// Modern JavaScript for rmux website
class RmuxWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupDeviceModal();
    this.setupCopyButtons();
    this.setupAnimations();
    this.setupIntersectionObserver();
    this.setupTouchSupport();
  }

  // Navigation functionality
  setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Mobile navigation toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });

      // Close mobile menu when clicking on links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Close mobile menu on window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Navbar scroll effect
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Use scroll-margin-top for better positioning
          const offsetTop = targetElement.offsetTop - 20;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Scroll effects and animations
  setupScrollEffects() {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-image-glow');
      
      parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
  }

  // Device modal functionality
  setupDeviceModal() {
    const modal = document.getElementById('deviceModal');
    const modalClose = document.getElementById('modalClose');
    const modalDeviceName = document.getElementById('modalDeviceName');
    const modalDeviceImage = document.getElementById('modalDeviceImage');
    const modalDeviceSpecs = document.getElementById('modalDeviceSpecs');

    // Prevent body scroll when modal is open
    const preventBodyScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    const restoreBodyScroll = () => {
      document.body.style.overflow = '';
    };

    // Device specifications data
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
      }
    };

    // Open modal when clicking on device details button
    document.querySelectorAll('.device-details-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const deviceId = button.dataset.device;
        
        if (deviceId && deviceSpecs[deviceId]) {
          this.openDeviceModal(deviceSpecs[deviceId], modal, modalDeviceName, modalDeviceImage, modalDeviceSpecs);
        }
      });
    });

    // Close modal functionality
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeDeviceModal(modal);
      });
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeDeviceModal(modal);
        }
      });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        this.closeDeviceModal(modal);
      }
    });
  }

  // Open device modal
  openDeviceModal(device, modal, modalDeviceName, modalDeviceImage, modalDeviceSpecs) {
    if (!modal || !modalDeviceName || !modalDeviceImage || !modalDeviceSpecs) return;

    // Add modal event listeners
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeDeviceModal(modal);
      });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeDeviceModal(modal);
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this.closeDeviceModal(modal);
      }
    });

    // Set modal content
    modalDeviceName.textContent = device.name;
    modalDeviceImage.src = device.img;
    modalDeviceImage.alt = device.name;

    // Clear and populate specs
    modalDeviceSpecs.innerHTML = '';
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
    preventBodyScroll();
    
    // Add mobile-specific modal behavior
    if (window.innerWidth <= 768) {
      modal.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });
    }
  }

  // Close device modal
  closeDeviceModal(modal) {
    if (!modal) return;

    modal.classList.remove('show');
    restoreBodyScroll();
    
    // Remove mobile-specific modal behavior
    if (window.innerWidth <= 768) {
      modal.removeEventListener('touchmove', (e) => {
        e.preventDefault();
      });
    }
  }

  // Copy to clipboard functionality
  setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const textToCopy = button.dataset.clipboard;
        if (!textToCopy) return;

        try {
          await navigator.clipboard.writeText(textToCopy);
          this.showCopySuccess(button);
        } catch (err) {
          console.error('Failed to copy text: ', err);
          this.showCopyError(button);
        }
      });
    });
  }

  // Show copy success feedback
  showCopySuccess(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#22C55E';
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.style.background = '';
    }, 2000);
  }

  // Show copy error feedback
  showCopyError(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.style.background = '#EF4444';
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.style.background = '';
    }, 2000);
  }

  // Setup animations
  setupAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.project-card, .device-card, .support-card, .contact-item');
    
    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  // Setup intersection observer for animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.project-card, .device-card, .support-card, .contact-item').forEach(el => {
      observer.observe(el);
    });

    // Hero section animations
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions, .hero-image, .hero-stats');
    heroElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      element.style.transitionDelay = `${index * 0.2}s`;
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 100 + (index * 200));
    });
  }

  // Utility functions
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Touch support for mobile devices
  setupTouchSupport() {
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .device-card');
    
    buttons.forEach(button => {
      button.addEventListener('touchstart', () => {
        button.style.transform = 'scale(0.95)';
      });
      
      button.addEventListener('touchend', () => {
        button.style.transform = '';
      });
      
      button.addEventListener('touchcancel', () => {
        button.style.transform = '';
      });
    });

    // Prevent zoom on double tap for mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Add swipe support for mobile navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (touchEndX < touchStartX - 50) {
      // Swipe left - close menu
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Performance optimization
const optimizePerformance = () => {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  const criticalResources = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'style';
    document.head.appendChild(link);
  });
};

// Service Worker registration for PWA capabilities
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the website
  new RmuxWebsite();
  
  // Optimize performance
  optimizePerformance();
  
  // Register service worker
  registerServiceWorker();
  
  // Add loading animation
  document.body.classList.add('loaded');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = 'rmux - Come back! 🤖';
  } else {
    document.title = 'rmux - Android ROM Developer';
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('Application is online');
});

window.addEventListener('offline', () => {
  console.log('Application is offline');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RmuxWebsite;
}