// Loading Skeleton - Make sure this executes immediately
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const skeletonOverlay = document.getElementById('skeleton-overlay');
        if (skeletonOverlay) {
            skeletonOverlay.classList.add('hide');
        }
        
        // Update the progress bar calculation (99/140 = 70.7%)
        const fill = document.getElementById('progress-fill');
        if (fill) {
            fill.style.width = '70.7%';
        }
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

    // Initialize device modal system (which was also using DOMContentLoaded)
    initDeviceModals();
});

// Rest of your code remains the same...

// Device Inventory Modal System - moved to a function
function initDeviceModals() {
    // Device specs data
    const deviceSpecs = {
        redmi12: {
            name: "Xiaomi Redmi 12",
            // rest of your device specs
        },
        // other devices...
    };
    
    const modal = document.getElementById('device-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalTitle || !modalBody || !modalClose) return;
    
    // Open modal with device info
    function openDeviceModal(deviceId) {
        // existing modal opening code
    }
    
    // Close modal
    function closeModal() {
        // existing modal closing code
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
}
