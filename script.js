document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle - Unified for both menu systems
    const toggleBtn = document.querySelector('.toggle_btn') || document.querySelector('.mobile-menu-btn');
    const dropdownMenu = document.querySelector('.dropdown_menu2') || document.querySelector('.main-nav');
    
    if (toggleBtn && dropdownMenu) {
        // Toggle mobile menu
        toggleBtn.addEventListener('click', function() {
            dropdownMenu.classList.toggle('active');
            dropdownMenu.classList.toggle('open'); // Support both class names
            
            // Toggle hamburger icon
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when clicking on links
        const mobileLinks = document.querySelectorAll('.dropdown_menu2 a, .dropdown_menu2 .action_btn, .main-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) { // Only for mobile
                    dropdownMenu.classList.remove('active', 'open');
                    const icon = toggleBtn?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // Unified Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.parentElement;
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Click handler for mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) { // Mobile behavior
                e.preventDefault();
                
                // Close all other dropdowns first
                document.querySelectorAll('.dropdown').forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('active');
                        const otherMenu = item.querySelector('.dropdown-menu');
                        if (otherMenu) otherMenu.style.display = 'none';
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                if (dropdownMenu) {
                    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
        
        // Hover handler for desktop
        if (window.innerWidth > 992 && dropdownMenu) {
            dropdown.addEventListener('mouseenter', function() {
                dropdownMenu.style.display = 'block';
            });
            
            dropdown.addEventListener('mouseleave', function() {
                dropdownMenu.style.display = 'none';
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && window.innerWidth <= 992) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) menu.style.display = 'none';
            });
        }
    });

    // Adjust Hero Height
    function adjustHeroHeight() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.height = window.innerHeight + 'px';
        }
    }
    
    if (document.querySelector('.hero')) {
        adjustHeroHeight();
        window.addEventListener('resize', adjustHeroHeight);
    }

    // Slider Functionality
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        const dotsContainer = document.querySelector('.slider-dots');
        
        let currentSlide = 0;
        const slideCount = slides.length;
        let slideInterval;
        
        // Create dots if container exists
        if (dotsContainer && slideCount > 0) {
            dotsContainer.innerHTML = ''; // Clear existing dots
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        const dots = document.querySelectorAll('.dot');
        
        function goToSlide(slideIndex) {
            if (slideIndex >= 0 && slideIndex < slideCount) {
                sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
                currentSlide = slideIndex;
                updateDots();
            }
        }
        
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                goToSlide(currentSlide);
                resetInterval();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slideCount;
                goToSlide(currentSlide);
                resetInterval();
            });
        }
        
        function startInterval() {
            if (slideCount > 1) { // Only auto-slide if there are multiple slides
                clearInterval(slideInterval);
                slideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slideCount;
                    goToSlide(currentSlide);
                }, 5000);
            }
        }
        
        function resetInterval() {
            if (slideCount > 1) {
                clearInterval(slideInterval);
                startInterval();
            }
        }
        
        // Start auto-sliding
        startInterval();
        
        // Pause on hover
        sliderTrack.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderTrack.addEventListener('mouseleave', () => {
            startInterval();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (dropdownMenu && (dropdownMenu.classList.contains('open') || dropdownMenu.classList.contains('active'))) {
                    dropdownMenu.classList.remove('open', 'active');
                    const icon = toggleBtn?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Handle window resize
    function handleResize() {
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        
        if (window.innerWidth > 992) {
            // Reset mobile menu if resizing to desktop
            if (dropdownMenu) {
                dropdownMenu.classList.remove('active', 'open');
                const icon = toggleBtn?.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
            
            // Reset all dropdown menus
            dropdownMenus.forEach(menu => {
                menu.style.display = '';
            });
            
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        } else {
            // Ensure dropdown menus are hidden on mobile initially
            dropdownMenus.forEach(menu => {
                menu.style.display = 'none';
            });
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
    
    // For dropdowns on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    });
  });

  // PORTFOLIO INTERACTIONS
document.addEventListener('DOMContentLoaded', function() {
    const portfolio = document.querySelector('.portfolio-exact');
    if (!portfolio) return;
  
    // Manage z-index on hover
    const cards = portfolio.querySelectorAll('.portfolio-exact-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
      });
      card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
      });
    });
  
    // Lightbox implementation
    const zoomBtns = portfolio.querySelectorAll('.zoom-exact-btn');
    zoomBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = btn.closest('.portfolio-exact-card').querySelector('img').src;
        console.log('Lightbox would open for:', imgSrc);
        // Implement your lightbox here
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
  const dropdownToggles = document.querySelectorAll('.dropdown > a');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const dropdown = this.parentElement;
        const isActive = dropdown.classList.contains('active');
        
        // Close all dropdowns first
        document.querySelectorAll('.dropdown').forEach(d => {
          d.classList.remove('active');
        });
        
        // Open current one if it wasn't active
        if (!isActive) {
          dropdown.classList.add('active');
        }
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 992) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
});

// Animation for service cards when they come into view
document.addEventListener('DOMContentLoaded', function() {
  // Animate service cards on scroll
  const serviceCards = document.querySelectorAll('.service-card');
  const industryCards = document.querySelectorAll('.industry-card');
  
  function animateOnScroll(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }
  
  const observerOptions = {
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(animateOnScroll, observerOptions);
  
  // Set initial state and observe
  serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
  });
  
  industryCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Phone button click handler
  const phoneBtn = document.querySelector('.btn-outline[href^="tel:"]');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const phoneNumber = this.getAttribute('href').replace('tel:', '');
      if (confirm(`Call ${phoneNumber}?`)) {
        window.location.href = `tel:${phoneNumber}`;
      }
    });
  }
});