document.addEventListener("DOMContentLoaded", () => {

    // --- PERFORMANCE SMOOTH SCROLL ANCHOR ENGINE ---
    const localLinks = document.querySelectorAll('a[href^="#"]');
    localLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector(".navbar").offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                // Smoothly collapse hamburger nav toggles instantly on mobile viewport click actions
                const navMenu = document.getElementById("navMenu");
                if (navMenu && navMenu.classList.contains("show")) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // --- DYNAMIC SCROLL CLASSES FOR NAVBAR APPEARANCE ---
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = "#030303";
            navbar.style.padding = "8px 0";
        } else {
            navbar.style.backgroundColor = "rgba(13, 13, 13, 0.9)";
            navbar.style.padding = "15px 0";
        }
    });

    // --- MINIMUM DATE BOUNDARY CONTROLLER FOR CALENDAR ---
    const datePicker = document.getElementById('booking_date_picker');
    if (datePicker) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();

        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;

        // Prevent users from clicking past historical dates to guarantee high-quality incoming leads
        datePicker.min = `${yyyy}-${mm}-${dd}`;
    }


    // --- HERO VIDEO MEMORY OPTIMIZATION (LOAD/UNLOAD VIA SCROLLTRIGGER) ---
    const heroVideo = document.getElementById("hero-video");
    if (heroVideo && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const videoSrc = heroVideo.querySelector("source")?.getAttribute("src");

        const tryPlay = () => {
            const attemptPlay = () => heroVideo.play().catch(() => {
                // Autoplay was blocked (e.g. stricter mobile policy); retry on first user interaction
                const retry = () => {
                    heroVideo.play().catch(() => { });
                    document.removeEventListener("touchstart", retry);
                    document.removeEventListener("click", retry);
                };
                document.addEventListener("touchstart", retry, { once: true });
                document.addEventListener("click", retry, { once: true });
            });

            if (heroVideo.readyState >= 3) {
                attemptPlay();
            } else {
                heroVideo.addEventListener("loadeddata", attemptPlay, { once: true });
            }
        };

        const loadHeroVideo = () => {
            if (heroVideo.dataset.loaded === "true") return;
            const source = heroVideo.querySelector("source");
            if (source && !source.getAttribute("src")) {
                source.setAttribute("src", videoSrc);
            }
            heroVideo.dataset.loaded = "true";
            heroVideo.load();
            tryPlay();
        };

        const unloadHeroVideo = () => {
            if (heroVideo.dataset.loaded !== "true") return;
            heroVideo.pause();
            const source = heroVideo.querySelector("source");
            if (source) source.removeAttribute("src");
            heroVideo.removeAttribute("src");
            heroVideo.load();
            heroVideo.dataset.loaded = "false";
        };

        // Determine initial state from the hero's actual position, don't assume it's in view
        const heroSection = document.getElementById("hero");
        const heroRect = heroSection.getBoundingClientRect();
        const heroInView = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

        if (heroInView) {
            loadHeroVideo();
        } else {
            heroVideo.dataset.loaded = "false";
        }

        ScrollTrigger.create({
            trigger: "#hero",
            start: "top bottom",
            end: "bottom top",
            onLeave: unloadHeroVideo,
            onEnterBack: loadHeroVideo,
            onLeaveBack: unloadHeroVideo,
            onEnter: loadHeroVideo
        });
    }

    // --- GEOLOCATION AND ANTI-BOT FORENSIC SCRIPTING ENGINE ---
    const dateField = document.getElementById('booking_date_picker');
    const formElement = document.getElementById('leadCaptureForm');

    if (dateField && formElement) {
        // As soon as user clicks the calendar input field, log details to diagnose if traffic is human or bot behavior
        dateField.addEventListener('click', () => {

            // 1. Capture exact high-accuracy system click timestamp
            const clickTime = new Date().toISOString();
            document.getElementById('track_click_timestamp').value = clickTime;

            // 2. Fetch geolocation intelligence through a secure, fast CDN IP API
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        document.getElementById('track_user_city').value = data.city || 'Unknown City';
                        document.getElementById('track_user_region').value = data.region || 'Unknown Region';

                        // Intelligent Security Layer: If user's IP locates far outside New York, make the captcha check strictly enforced
                        if (data.region_code !== 'NY') {
                            const verificationZone = document.getElementById('captcha-verification-zone');
                            if (verificationZone) {
                                verificationZone.style.border = "1px solid #dc3545"; // Soft warning layout indicator
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('Location metadata payload request bypass.', err);
                });
        });

        // Map selected calendar values to hidden input fields upon final changes
        dateField.addEventListener('change', (e) => {
            document.getElementById('track_selected_date').value = e.target.value;
        });
    }

    // --- SCROLL-SCRUBBED TEXT REVEAL ---
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Selectors to apply the scrub reveal to
        const textTargets = [
            "#about .section-title",
            "#about .section-tag",
            "#about .section-text",
            "#pricing .section-tag",
            "#pricing .section-title",
            ".parallax-section h2",
            "#gallery .section-tag",
            "#gallery .section-title",
            "#testimonials .section-tag",
            "#testimonials .section-title",
            "#book-now .section-tag",
            "#book-now .section-title",
            "#work .section-title",
            "#work .section-tag"
        ];

        textTargets.forEach(selector => {
            const el = document.querySelector(selector);
            if (!el) return;

            // Wrap each word in a span for individual animation
            const raw = el.innerHTML;
            el.innerHTML = raw.replace(/(\S+)/g, '<span class="scrub-word" style="display:inline-block;opacity:0;transform:translateY(50px)">$1</span>');

            const words = el.querySelectorAll(".scrub-word");
            if (!words.length) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    end: "bottom 60%",
                    scrub: 1.2   // ties animation progress directly to scroll speed
                }
            });

            tl.to(words, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.04,
                ease: "power2.out"
            });
        });
    }




    // ===========================
    // GOOGLE ANALYTICS 4 EVENTS
    // ===========================

    if (typeof gtag === "function") {

        // ---------------------------------
        // DATA-PACKAGE BUTTON TRACKING
        // ---------------------------------
        // Automatically tracks every element
        // with data-package="..."

        document.addEventListener("click", (e) => {

            const element = e.target.closest("[data-package]");

            if (!element) return;

            gtag("event", "button_click", {
                button_name: element.dataset.package
            });

        });


        // ---------------------------------
        // GOOGLE REVIEWS
        // ---------------------------------

        document.getElementById("googleReviewBtn")?.addEventListener("click", () => {

            gtag("event", "google_reviews_click", {
                button_name: "google_review_badge"
            });

        });


        // ---------------------------------
        // SOCIAL MEDIA
        // ---------------------------------

        document.getElementById("instagramBtn")?.addEventListener("click", () => {

            gtag("event", "social_click", {
                platform: "instagram"
            });

        });


        document.getElementById("tiktokBtn")?.addEventListener("click", () => {

            gtag("event", "social_click", {
                platform: "tiktok"
            });

        });


        document.getElementById("facebookBtn")?.addEventListener("click", () => {

            gtag("event", "social_click", {
                platform: "facebook"
            });

        });

    }


    // =====================================
    // FORM SUBMISSION / LEAD CONVERSION
    // =====================================

    document.addEventListener("submit", async (e) => {

        const form = e.target;

        // Only handle your two Formspree forms
        if (
            form.id !== "leadCaptureForm" &&
            form.id !== "leadCaptureForm1"
        ) {
            return;
        }

        e.preventDefault();

        const submitButton = form.querySelector('[type="submit"]');

        // Prevent double submissions
        if (submitButton) {
            submitButton.disabled = true;
        }

        const data = new FormData(form);

        try {

            const response = await fetch(form.action, {
                method: "POST",
                body: data,
                headers: {
                    "Accept": "application/json"
                }
            });


            // ---------------------------------
            // SUCCESS
            // ---------------------------------

            if (response.ok) {

                // Send conversion event to GA4
                if (typeof gtag === "function") {

                    gtag("event", "generate_lead", {

                        form_id: form.id,

                        page_location: window.location.href

                    });

                }


                // Give GA4 a moment to send the event
                setTimeout(() => {

                    window.location.href = "/thankyou.html";

                }, 300);


            }


            // ---------------------------------
            // FORM ERROR
            // ---------------------------------

            else {

                if (submitButton) {
                    submitButton.disabled = false;
                }

                alert("Something went wrong. Please try again.");

            }

        }

        catch (error) {

            console.error("Form submission error:", error);

            if (submitButton) {
                submitButton.disabled = false;
            }

            alert("Something went wrong. Please try again.");

        }

    });

    // Package Selection
    document.addEventListener("click", (e) => {

        const element = e.target.closest("[data-package]");

        if (!element || typeof gtag !== "function") return;

        gtag("event", "button_click", {
            button_name: element.dataset.package
        });

    });

    /* ==========================================================
   PRICING PACKAGE ACCORDION
========================================================== */


    

    const sliders = document.querySelectorAll(".before-after-slider");

    sliders.forEach(function (slider) {

        const range = slider.querySelector(".slider-input");
        const beforeWrapper = slider.querySelector(".before-image-wrapper");
        const handle = slider.querySelector(".slider-handle");

        function updateSlider() {

            const value = range.value;

            beforeWrapper.style.width = value + "%";
            handle.style.left = value + "%";

            // Once the user interacts, hide the instruction
            if (value > 0) {
                slider.classList.add("has-interacted");
            }

        }

        // Initial position
        updateSlider();

        // Mouse / touch / keyboard
        range.addEventListener("input", updateSlider);

    });



    const toggles = document.querySelectorAll(".package-toggle");

    toggles.forEach(toggle => {

        toggle.addEventListener("click", () => {

            const content = document.getElementById(
                toggle.getAttribute("aria-controls")
            );

            const isOpen = toggle.getAttribute("aria-expanded") === "true";

            // Close every package
            toggles.forEach(btn => {

                btn.setAttribute("aria-expanded", "false");
                btn.classList.remove("active");

                const target = document.getElementById(
                    btn.getAttribute("aria-controls")
                );

                target.classList.remove("open");
                target.style.maxHeight = null;

            });

            // Open selected package
            if (!isOpen) {

                toggle.setAttribute("aria-expanded", "true");
                toggle.classList.add("active");

                content.classList.add("open");
                content.style.maxHeight = content.scrollHeight + "px";

            }

        });

        // Keyboard Accessibility
        toggle.addEventListener("keydown", e => {

            if (e.key === "Enter" || e.key === " ") {

                e.preventDefault();
                toggle.click();

            }

        });

    });
});
