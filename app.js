document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================
       1. CAMERA SHUTTER PRELOADER
       ========================================== */
   window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
});

 document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' || e.target.closest('.watermarked-container')) {
      e.preventDefault();
    }
  });

    /* ==========================================
       2. INITIALIZE AOS (ANIMATE ON SCROLL)
       ========================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 120,
            easing: 'ease-out-cubic'
        });
    }

    /* ==========================================
       3. SMART STICKY NAVBAR LOGIC
       ========================================== */
    const header = document.getElementById("mainHeader");
    let lastScrollTop = 0;
    const scrollThreshold = 10;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Sticky color overlay class
        if (scrollTop > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Hide/Show Navbar on Scroll Down/Up
        if (Math.abs(lastScrollTop - scrollTop) <= scrollThreshold) return;

        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Scroll Down - Hide Navbar
            header.classList.add("nav-hide");
        } else {
            // Scroll Up - Show Navbar
            header.classList.remove("nav-hide");
        }
        
        lastScrollTop = scrollTop;
    });

    /* ==========================================
       4. MOBILE NAVIGATION MENU
       ========================================== */
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Prevent body scroll when menu is open on mobile
            if (navMenu.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    /* ==========================================
       5. PORTFOLIO FILTER SYSTEM
       ========================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Active state toggle
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            portfolioItems.forEach(item => {
                const category = item.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    item.style.display = "block";
                    // Brief delay to trigger transition smoothly
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.8)";
                    // Set display none after opacity animation completes
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 350);
                }
            });
            
            // Refresh AOS so animations trigger correctly after layout changes
            if (typeof AOS !== 'undefined') {
                setTimeout(() => {
                    AOS.refresh();
                }, 400);
            }
        });
    });

    /* ==========================================
       6. PORTFOLIO LIGHTBOX SYSTEM
       ========================================== */
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.querySelector(".lightbox-close");
    
    // Zoom Photos only (videos and reels might have different players)
    portfolioItems.forEach(item => {
        if (item.classList.contains("item-photo")) {
            item.addEventListener("click", () => {
                const img = item.querySelector(".portfolio-img");
                if (img && lightbox && lightboxImage) {
                    lightboxImage.src = img.src;
                    lightbox.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            });
        }
    });

    // Close Lightbox
    if (lightbox && lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
        });

        // Close when clicking outside the image
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }

    /* ==========================================
       7. BOOKING FORM VALIDATION & WHATSAPP INTEGRATION
       ========================================== */
    const bookingForm = document.getElementById("whatsappBookingForm");
    const fullNameInput = document.getElementById("fullName");
    const mobileNumberInput = document.getElementById("mobileNumber");
    const whatsappNumberInput = document.getElementById("whatsappNumber");
    const serviceTypeInput = document.getElementById("serviceType");
    const projectDetailsInput = document.getElementById("projectDetails");

    const nameError = document.getElementById("nameError");
    const phoneError = document.getElementById("phoneError");

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Name Validation
            const nameVal = fullNameInput.value.trim();
            if (nameVal === "") {
                fullNameInput.parentElement.classList.add("invalid");
                isValid = false;
            } else {
                fullNameInput.parentElement.classList.remove("invalid");
            }
            
            // Mobile Number Validation (Simple format check for numeric string of at least 8 chars)
            const mobileVal = mobileNumberInput.value.trim();
            const cleanMobile = mobileVal.replace(/\D/g, ''); // strip non-numeric
            if (cleanMobile === "" || cleanMobile.length < 8) {
                mobileNumberInput.parentElement.classList.add("invalid");
                isValid = false;
            } else {
                mobileNumberInput.parentElement.classList.remove("invalid");
            }

            // If form validation fails, stop execution
            if (!isValid) return;

            // Optional fields processing
            const whatsappVal = whatsappNumberInput.value.trim() !== "" ? whatsappNumberInput.value.trim() : "Same as Mobile";
            const serviceVal = serviceTypeInput.value !== "" ? serviceTypeInput.value : "General Query / Not Selected";
            const detailsVal = projectDetailsInput.value.trim() !== "" ? projectDetailsInput.value.trim() : "None";

            // Formulate WhatsApp message text using the template
            const messageTemplate = `New Booking Request from Website!

Name: ${nameVal}
Calling No: ${mobileVal}
WhatsApp No: ${whatsappVal}
Service Required: ${serviceVal}

Message / Details: > "${detailsVal}"

Please reply to confirm the booking!`;

            // Smit's Phone number: +91 9327881330
            const smitPhoneNumber = "919327881330";
            const waUrl = `https://wa.me/${smitPhoneNumber}?text=${encodeURIComponent(messageTemplate)}`;

            // Open WhatsApp Web or App link in a new window/tab
            window.open(waUrl, "_blank");
        });

        // Realtime Input validation listeners to clear errors once correct
        fullNameInput.addEventListener("input", () => {
            if (fullNameInput.value.trim() !== "") {
                fullNameInput.parentElement.classList.remove("invalid");
            }
        });

        const btnYesWa = document.getElementById("btnYesWa");
        const btnNoWa = document.getElementById("btnNoWa");
        const waChoiceButtons = document.getElementById("waChoiceButtons");
        const waSuccessText = document.getElementById("waSuccessText");
        const waInputWrapper = document.getElementById("waInputWrapper");
        
        let isWaSame = false;

        mobileNumberInput.addEventListener("input", () => {
            const clean = mobileNumberInput.value.replace(/\D/g, '');
            if (clean.length >= 8) {
                mobileNumberInput.parentElement.classList.remove("invalid");
            }
            
            // Real-time synchronization
            if (isWaSame) {
                whatsappNumberInput.value = mobileNumberInput.value;
            }
        });

        if (btnYesWa && btnNoWa) {
            btnYesWa.addEventListener("click", () => {
                isWaSame = true;
                whatsappNumberInput.value = mobileNumberInput.value;
                
                // Hide choice buttons and show success text
                waChoiceButtons.style.display = "none";
                waSuccessText.classList.add("active");
            });

            btnNoWa.addEventListener("click", () => {
                isWaSame = false;
                whatsappNumberInput.value = "";
                
                // Hide choice buttons and show input wrapper
                waChoiceButtons.style.display = "none";
                waInputWrapper.classList.add("active");
                
                // Automatically focus on the input field
                setTimeout(() => {
                    whatsappNumberInput.focus();
                }, 100);
            });
        }
    }

    /* ==========================================
       8. ACTIVE NAVIGATION LINK ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll("section");
    
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 100; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    /* ==========================================
       9. CUSTOM "VIBE" CURSOR LOGIC
       ========================================== */
    const cursorDot = document.getElementById("cursorDot");
    const cursorOutline = document.getElementById("cursorOutline");

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot instantly
            cursorDot.style.left = mouseX + "px";
            cursorDot.style.top = mouseY + "px";
        });

        // Smooth trailing effect for outline using requestAnimationFrame
        const animateOutline = () => {
            const ease = 0.15; // trailing speed factor
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;

            cursorOutline.style.left = outlineX + "px";
            cursorOutline.style.top = outlineY + "px";

            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);

        // Expand outline when hovering links/buttons
        const interactiveElements = document.querySelectorAll("a, button, .btn, .portfolio-item, .select-wrapper, select");
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorOutline.classList.add("hovered");
            });
            el.addEventListener("mouseleave", () => {
                cursorOutline.classList.remove("hovered");
            });
        });
    }

    /* ==========================================
       10. MAGNETIC HOVER EFFECT FOR BUTTONS
       ========================================== */
    const magneticButtons = document.querySelectorAll(".btn");

    magneticButtons.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            // Get mouse position relative to button center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Maximum attraction pull of 12px
            const maxPull = 12;
            const strength = 0.3; // attraction strength factor

            const pullX = x * strength;
            const pullY = y * strength;

            // Clamp the values to maxPull
            const clampedX = Math.max(-maxPull, Math.min(maxPull, pullX));
            const clampedY = Math.max(-maxPull, Math.min(maxPull, pullY));

            btn.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
        });

        btn.addEventListener("mouseleave", () => {
            // Smoothly reset the transform
            btn.style.transform = "translate(0, 0)";
        });
    });

    /* ==========================================
       11. 3D HOVER TILT FOR WHY CHOOSE US CARDS
       ========================================== */
    const whyCards = document.querySelectorAll(".why-card");

    whyCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinates relative to card center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate rotation limits (approx max 10 degrees)
            const rotateX = -(y / rect.height) * 20; 
            const rotateY = (x / rect.width) * 20;
            
            // Apply 3D transform dynamically
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            // Reset to default CSS transform via smooth transition
            card.style.transform = '';
        });
    });

    /* ==========================================
       12. DYNAMIC MOUSE SPOTLIGHT FOR SERVICE CARDS
       ========================================== */
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Calculate mouse position relative to the card in pixels
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS variables for the radial gradient center
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    /* ==========================================
       13. 3D MOUSE PARALLAX ON HERO TEXT
       ========================================== */
    const heroSection = document.getElementById("home");
    const heroTextWrapper = document.getElementById("heroTextWrapper");

    if (heroSection && heroTextWrapper) {
        heroSection.addEventListener("mousemove", (e) => {
            // Get center of screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Calculate mouse position relative to center
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Gentle multiplier for floating effect
            const moveX = (mouseX * -0.02); 
            const moveY = (mouseY * -0.02);

            heroTextWrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        heroSection.addEventListener("mouseleave", () => {
            heroTextWrapper.style.transform = `translate(0, 0)`;
        });
    }
});
