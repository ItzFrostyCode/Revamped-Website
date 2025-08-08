// Games Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme system - synchronized with main site
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const body = document.body;
    
    // Load saved theme from main site
    const savedTheme = localStorage.getItem('theme');
    console.log('Games JS - Saved theme from localStorage:', savedTheme);
    
    // Default to light-mode if no theme is saved
    const initialTheme = savedTheme || 'light-mode';
    console.log('Games JS - Initial theme to apply:', initialTheme);
    
    // Apply theme synchronization
    function applyTheme(theme) {
        console.log('Games JS - Applying theme:', theme);
        
        // Remove both theme classes
        body.classList.remove('light-mode', 'dark-mode');
        document.documentElement.classList.remove('light-mode', 'dark-mode');
        
        // Apply the theme class (matches main site structure)
        body.classList.add(theme);
        document.documentElement.classList.add(theme);
        
        // Update theme toggle icons
        updateThemeIcons(theme);
        
        // Save theme to localStorage
        localStorage.setItem('theme', theme);
        
        console.log('Games JS - Theme applied. Body classes:', body.className);
    }
    
    function updateThemeIcons(theme) {
        console.log('Games JS - Updating icons for theme:', theme);
        if (theme === 'dark-mode') {
            // In dark mode, show sun icon (to switch back to light)
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            // In light mode, show moon icon (to switch to dark)
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
    
    // Initialize theme on page load
    applyTheme(initialTheme);
    
    // Theme toggle functionality
    if (themeToggle && sunIcon && moonIcon) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
            const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            
            console.log('Games JS - Toggle clicked. Current:', currentTheme, 'New:', newTheme);
            applyTheme(newTheme);
        });
    } else {
        console.error('Theme toggle elements not found:', {
            themeToggle: !!themeToggle,
            sunIcon: !!sunIcon,
            moonIcon: !!moonIcon
        });
    }

    // Mobile theme toggle functionality
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', function() {
            const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
            const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            
            console.log('Games JS - Mobile Toggle clicked. Current:', currentTheme, 'New:', newTheme);
            applyTheme(newTheme);
        });
    }
    
    // Listen for theme changes from main site (in case of cross-tab synchronization)
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme' && e.newValue) {
            console.log('Games JS - Storage event detected. New theme:', e.newValue);
            applyTheme(e.newValue);
        }
    });
    
    console.log('Mobile menu elements found:', {
        toggle: false,
        dropdown: false
    });

    // Hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close button functionality
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.category');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when pressing escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Category filtering functionality
    const categoryLinks = document.querySelectorAll('.category');
    const gameItems = document.querySelectorAll('.game-item');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all categories (both desktop and mobile)
            categoryLinks.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category and its counterpart
            const category = this.textContent.toLowerCase().trim();
            categoryLinks.forEach(cat => {
                if (cat.textContent.toLowerCase().trim() === category) {
                    cat.classList.add('active');
                }
            });
            
            // Filter games based on category
            gameItems.forEach(item => {
                const gameTitle = item.querySelector('.game-title').textContent.toLowerCase();
                
                if (category === 'all games') {
                    item.style.display = 'block';
                } else if (category === 'card' && gameTitle.includes('21')) {
                    item.style.display = 'block';
                } else if (category === 'puzzle' && gameTitle.includes('puzzle')) {
                    item.style.display = 'block';
                } else if (category === 'action' && (gameTitle.includes('space') || gameTitle.includes('racing') || gameTitle.includes('rpg') || gameTitle.includes('target'))) {
                    item.style.display = 'block';
                } else if (!item.classList.contains('coming-soon')) {
                    // For actual games, show if no specific filter matches
                    item.style.display = category === 'all games' ? 'block' : 'none';
                } else {
                    // For coming soon games, apply the filter logic
                    item.style.display = 'none';
                }
            });
            
            // Close mobile menu after selection
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            const mobileNav = document.getElementById('mobileNav');
            if (hamburgerMenu && mobileNav) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation for game cards
    const gameCards = document.querySelectorAll('.game-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    gameCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // No mobile menu to handle
    });
});
