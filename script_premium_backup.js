document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal Animation Setup
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, { 
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealOnScroll.observe(el));

    // 2. Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Scroll Spy Navigation (Highlight Active Links on Scroll)
    const sections = document.querySelectorAll('main > div, main > section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('text-orange-500');
            item.classList.add('text-slate-400');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.remove('text-slate-400');
                item.classList.add('text-orange-500');
            }
        });
    });

    // 4. Responsive Mobile Menu Functionality
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            
            // Toggle hamburger and close icon
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.setAttribute('icon', 'solar:hamburger-menu-linear');
            } else {
                menuIcon.setAttribute('icon', 'solar:close-circle-linear');
            }
        });

        // Close menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('icon', 'solar:hamburger-menu-linear');
            });
        });

        // Close menu when clicking outside of the menu
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('icon', 'solar:hamburger-menu-linear');
            }
        });
    }

    // 5. AJAX Form Submission for Lead Magnet (Checklist Download)
    const leadForm = document.getElementById('lead-form');
    const formResult = document.getElementById('form-result');
    
    if (leadForm && formResult) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(leadForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            formResult.textContent = "Processing... Please wait.";
            formResult.style.color = "#f59e0b"; // Orange status
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    leadForm.reset();
                    
                    // REPLACE THIS URL with your actual hosted PDF checklist link (e.g. Google Drive/Dropbox/Server)
                    const pdfUrl = "./checklist.html";                     
                    // Replace the submit button with a direct download button to bypass browser popup blockers
                    const submitBtn = leadForm.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.outerHTML = `<a href="${pdfUrl}" target="_blank" id="download-btn" class="w-full block text-center bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all">🎉 Open PDF Checklist</a>`;
                    }
                    
                    formResult.textContent = "Success! Click the green button above to view your PDF.";
                    formResult.style.color = "#22c55e"; // Green success
                } else {
                    formResult.textContent = res.message || "Failed to submit. Please try again.";
                    formResult.style.color = "#ef4444"; // Red error
                }
            })
            .catch(error => {
                console.error(error);
                formResult.textContent = "Network error. Please check your connection.";
                formResult.style.color = "#ef4444";
            });
        });
    }
});