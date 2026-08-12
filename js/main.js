document.addEventListener("DOMContentLoaded", () => {

    const responsiveAnchorMap = {
        "#home": { mobile: ".show-mobile #home", desktop: ".show-desktop #hero" },
        "#hero": { mobile: ".show-mobile #home", desktop: ".show-desktop #hero" },
        "#about": { mobile: ".show-mobile #about", desktop: ".show-desktop #about" },
        "#work": { mobile: ".show-mobile #work", desktop: ".show-desktop #work1" },
        "#work1": { mobile: ".show-mobile #work", desktop: ".show-desktop #work1" },
        "#gallery": { mobile: ".show-mobile #work", desktop: ".show-desktop #gallery" },
        "#pricing": { mobile: ".show-mobile #pricing1", desktop: ".show-desktop #pricing" },
        "#pricing1": { mobile: ".show-mobile #pricing1", desktop: ".show-desktop #pricing" },
        "#reviews": { mobile: ".show-mobile #reviews", desktop: ".show-desktop #testimonials" },
        "#testimonials": { mobile: ".show-mobile #reviews", desktop: ".show-desktop #testimonials" },
        "#booking": { mobile: ".show-mobile #booking", desktop: ".show-desktop #book-now" },
        "#book-now": { mobile: ".show-mobile #booking", desktop: ".show-desktop #book-now" },
        "#driveway-duo": { mobile: ".show-mobile #driveway-duo", desktop: ".show-desktop #driveway-duo-desktop" },
        "#driveway-duo-desktop": { mobile: ".show-mobile #driveway-duo", desktop: ".show-desktop #driveway-duo-desktop" }
    };

    function getResponsiveAnchorTarget(targetId) {
        if (!targetId || targetId === "#") return null;

        const normalizedTargetId = targetId.toLowerCase();
        const responsiveTarget = responsiveAnchorMap[normalizedTargetId];

        if (responsiveTarget) {
            const selector = window.matchMedia("(max-width: 768px)").matches
                ? responsiveTarget.mobile
                : responsiveTarget.desktop;

            return document.querySelector(selector);
        }

        try {
            return document.getElementById(decodeURIComponent(targetId.slice(1)));
        } catch (error) {
            return null;
        }
    }

    function getNavigationOffset() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            return document.querySelector(".mobile-header")?.offsetHeight || 0;
        }

        return document.querySelector(".navbar")?.offsetHeight || 0;
    }

    function scrollToResponsiveAnchor(targetId, behavior = "smooth") {
        const targetElement = getResponsiveAnchorTarget(targetId);
        if (!targetElement) return false;

        const targetPosition = Math.max(
            0,
            targetElement.getBoundingClientRect().top + window.scrollY - getNavigationOffset()
        );

        window.scrollTo({
            top: targetPosition,
            behavior
        });

        return true;
    }

    // --- PERFORMANCE SMOOTH SCROLL ANCHOR ENGINE ---
    const localLinks = document.querySelectorAll('a[href^="#"]');
    localLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = getResponsiveAnchorTarget(targetId);

            if (targetElement) {
                if (window.location.hash !== targetId) {
                    window.history.pushState(null, "", targetId);
                }

                scrollToResponsiveAnchor(targetId);

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

    function scrollToCurrentHash(behavior = "smooth") {
        const currentHash = window.location.hash;
        if (!currentHash || currentHash === "#") return;

        scrollToResponsiveAnchor(currentHash, behavior);
    }

    if (window.location.hash && window.location.hash !== "#") {
        requestAnimationFrame(() => scrollToCurrentHash("auto"));
        window.addEventListener("load", () => scrollToCurrentHash("auto"), { once: true });
    }

    window.addEventListener("hashchange", () => scrollToCurrentHash());
    window.addEventListener("popstate", () => scrollToCurrentHash());

    const mobileBreakpoint = window.matchMedia("(max-width: 768px)");
    const handleBreakpointChange = () => scrollToCurrentHash("auto");

    if (typeof mobileBreakpoint.addEventListener === "function") {
        mobileBreakpoint.addEventListener("change", handleBreakpointChange);
    } else if (typeof mobileBreakpoint.addListener === "function") {
        mobileBreakpoint.addListener(handleBreakpointChange);
    }

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

    // --- MINIMUM DATE BOUNDARY CONTROLLER FOR CALENDARS ---

    const datePickers = document.querySelectorAll(
        '#booking_date_picker, #booking_date_picker1'
    );

    if (datePickers.length) {

        const today = new Date();

        const yyyy = today.getFullYear();

        let mm = today.getMonth() + 1;
        let dd = today.getDate();

        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;

        const minimumDate = `${yyyy}-${mm}-${dd}`;

        datePickers.forEach(datePicker => {
            datePicker.min = minimumDate;
        });
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

    // --- FORM TRACKING / HIDDEN INPUTS ---

    const forms = document.querySelectorAll(
        "#leadCaptureForm, #leadCaptureForm1"
    );

    forms.forEach(form => {

        const drivewayDuoToggle = form.querySelector("[data-driveway-duo-toggle]");
        const drivewayDuoField = form.querySelector("[data-driveway-duo-field]");
        const secondVehicleInput = drivewayDuoField?.querySelector("textarea");

        if (drivewayDuoToggle && drivewayDuoField && secondVehicleInput) {
            drivewayDuoToggle.addEventListener("change", function (event) {
                const isSelected = drivewayDuoToggle.checked;

                drivewayDuoField.hidden = !isSelected;
                drivewayDuoToggle.setAttribute("aria-expanded", String(isSelected));
                secondVehicleInput.disabled = !isSelected;
                secondVehicleInput.required = isSelected;

                if (isSelected && event.isTrusted) {
                    secondVehicleInput.focus();
                } else {
                    secondVehicleInput.value = "";
                }
            });
        }

        // Find the date field inside THIS form
        const dateField = form.querySelector(
            'input[type="date"][name="requested_date"]'
        );

        // Find hidden tracking fields inside THIS form
        const selectedDateField = form.querySelector(
            '[name="user_selected_date"]'
        );

        const timestampField = form.querySelector(
            '[name="click_timestamp"]'
        );

        const cityField = form.querySelector(
            '[name="user_city"]'
        );

        const regionField = form.querySelector(
            '[name="user_region"]'
        );

        // -----------------------------
        // DATE SELECTION
        // -----------------------------

        if (dateField && selectedDateField) {

            dateField.addEventListener("change", function () {

                selectedDateField.value = this.value;

            });

        }

        // -----------------------------
        // CLICK TIMESTAMP
        // -----------------------------

        if (timestampField) {

            // Check whether a timestamp
            // was already saved during this visit
            const savedTimestamp =
                sessionStorage.getItem("quote_click_timestamp");

            if (savedTimestamp) {
                timestampField.value = savedTimestamp;
            }

        }

        // -----------------------------
        // GEOLOCATION
        // -----------------------------

        if (cityField || regionField) {

            fetch("https://ipapi.co/json/")
                .then(response => response.json())
                .then(data => {

                    if (!data) return;

                    if (cityField) {
                        cityField.value =
                            data.city || "Unknown City";
                    }

                    if (regionField) {
                        regionField.value =
                            data.region || "Unknown Region";
                    }

                })
                .catch(error => {

                    console.log(
                        "Location metadata unavailable.",
                        error
                    );

                });

        }

    });

    document.addEventListener("click", function (event) {
        const promotionButton = event.target.closest(".driveway-duo-button");
        if (!promotionButton) return;

        const form = window.matchMedia("(max-width: 768px)").matches
            ? document.getElementById("leadCaptureForm")
            : document.getElementById("leadCaptureForm1");
        const interestToggle = form?.querySelector("[data-driveway-duo-toggle]");

        if (interestToggle && !interestToggle.checked) {
            interestToggle.checked = true;
            interestToggle.dispatchEvent(new Event("change", { bubbles: true }));
        }
    });

    // --- SAVE QUOTE CLICK TIMESTAMP ---

    document.addEventListener("click", function (e) {

        const quoteButton = e.target.closest(
            '[href="#booking"], [href="#book-now"]'
        );

        if (!quoteButton) return;

        const timestamp = new Date().toISOString();

        sessionStorage.setItem(
            "quote_click_timestamp",
            timestamp
        );

    });

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




    // =====================================
    // FORM SUBMISSION / LEAD CONVERSION
    // =====================================

    document.addEventListener("submit", async (e) => {

    const form = e.target;

    // Only handle your two booking forms
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
        submitButton.innerHTML = `
            Sending...
            <i class="bi bi-hourglass-split"></i>
        `;
    }

    const data = new FormData(form);

    // FormSubmit AJAX endpoint
    const ajaxUrl =
        "https://formsubmit.co/ajax/giandetails@gmail.com";

    try {

        const response = await fetch(ajaxUrl, {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        });

        const result = await response.json();

        console.log("FormSubmit response:", result);

        // ---------------------------------
        // SUCCESS
        // ---------------------------------

        if (response.ok && result.success !== false) {

            // Send conversion event to GA4
            if (typeof window.trackGiansEvent === "function") {
                window.trackGiansEvent("generate_lead", {
                    form_id: form.id,
                    form_location: form.id === "leadCaptureForm" ? "mobile" : "desktop",
                    lead_source: "website_quote_form",
                    promotion_name: form.querySelector("[data-driveway-duo-toggle]")?.checked
                        ? "driveway_duo_full_detail"
                        : "none"
                });
            }

            // Give GA4 a moment to send
            setTimeout(() => {

                window.location.href = "/thankyou.html";

            }, 500);

        }

        // ---------------------------------
        // FORM ERROR
        // ---------------------------------

        else {

            if (typeof window.trackGiansEvent === "function") {
                window.trackGiansEvent("quote_form_error", {
                    form_location: form.id === "leadCaptureForm" ? "mobile" : "desktop",
                    error_type: "submission_rejected"
                });
            }

            console.error("FormSubmit error:", result);

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    Get My Free Quote
                    <i class="bi bi-arrow-right"></i>
                `;
            }

            alert(
                "We couldn't submit your request. Please try again or call 631-346-6455."
            );

        }

    }

    catch (error) {

        if (typeof window.trackGiansEvent === "function") {
            window.trackGiansEvent("quote_form_error", {
                form_location: form.id === "leadCaptureForm" ? "mobile" : "desktop",
                error_type: "network_error"
            });
        }

        console.error("Form submission error:", error);

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                Get My Free Quote
                <i class="bi bi-arrow-right"></i>
            `;
        }

        alert(
            "We couldn't submit your request. Please try again or call 631-346-6455."
        );

    }

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
