(function () {
    "use strict";

    const measurementId = "G-Q2SGHGPHTK";

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(analyticsScript);

    function trackEvent(eventName, parameters) {
        window.gtag("event", eventName, {
            ...parameters,
            page_location: window.location.href,
            transport_type: "beacon"
        });
    }

    window.trackGiansEvent = trackEvent;

    function cleanText(value) {
        return (value || "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 100);
    }

    function getPageLayout(element) {
        if (element.closest(".show-mobile")) return "mobile_layout";
        if (element.closest(".show-desktop")) return "desktop_layout";
        return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
    }

    function getSection(element) {
        const section = element.closest("section, nav, footer, header");
        if (!section) return "page";
        return section.id || section.classList[0] || section.tagName.toLowerCase();
    }

    function getElementName(element) {
        return element.dataset.package || element.id || cleanText(element.textContent) || "unnamed_element";
    }

    function getServiceName(element) {
        const card = element.closest(".pricing-card, .price-card");
        const heading = card?.querySelector("h3");
        return cleanText(heading?.textContent) || element.dataset.package || "general_quote";
    }

    function getSocialPlatform(url) {
        if (url.includes("instagram.com")) return "instagram";
        if (url.includes("tiktok.com")) return "tiktok";
        if (url.includes("facebook.com")) return "facebook";
        return "other";
    }

    function isReviewUrl(url) {
        return url.includes("maps.app.goo.gl") ||
            url.includes("google.com/maps") ||
            url.includes("g.page/");
    }

    document.addEventListener("click", function (event) {
        const accordionButton = event.target.closest(".accordion-header");

        if (accordionButton) {
            trackEvent("pricing_detail_view", {
                service_name: getServiceName(accordionButton),
                detail_name: cleanText(accordionButton.textContent),
                page_layout: getPageLayout(accordionButton)
            });
            return;
        }

        const link = event.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href") || "";
        const absoluteUrl = link.href || href;
        const commonParameters = {
            element_name: getElementName(link),
            section_name: getSection(link),
            page_layout: getPageLayout(link)
        };

        if (link.matches(".driveway-duo-button")) {
            trackEvent("select_promotion", {
                promotion_id: "driveway_duo_full_detail_50",
                promotion_name: "Driveway Duo - Two Full Details",
                creative_slot: getPageLayout(link)
            });
        }

        if (href.startsWith("tel:")) {
            trackEvent("phone_call_click", commonParameters);
            return;
        }

        if (href.startsWith("mailto:")) {
            trackEvent("email_click", commonParameters);
            return;
        }

        if (href === "#booking" || href === "#book-now") {
            trackEvent("quote_start", {
                ...commonParameters,
                service_name: getServiceName(link)
            });
            return;
        }

        if (isReviewUrl(absoluteUrl)) {
            trackEvent("review_click", commonParameters);
            return;
        }

        if (link.matches(".work-card, .video a")) {
            trackEvent("work_video_click", {
                ...commonParameters,
                video_name: cleanText(link.querySelector("img")?.alt || link.textContent)
            });
            return;
        }

        if (/instagram\.com|tiktok\.com|facebook\.com/.test(absoluteUrl)) {
            trackEvent("social_click", {
                ...commonParameters,
                platform: getSocialPlatform(absoluteUrl)
            });
            return;
        }

        if (href === "#pricing" || href === "#pricing1") {
            trackEvent("pricing_view", commonParameters);
            return;
        }

        if (href.startsWith("#")) {
            trackEvent("navigation_click", {
                ...commonParameters,
                destination: href.slice(1) || "top"
            });
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
        const path = window.location.pathname.toLowerCase();

        if (window.location.hash && window.location.hash !== "#") {
            trackEvent("section_landing", {
                destination: window.location.hash.slice(1),
                page_layout: window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop"
            });
        }

        if (path.endsWith("thankyou.html")) {
            trackEvent("thank_you_page_view", {});
        } else if (path.endsWith("socials.html")) {
            trackEvent("social_hub_view", {});
        }

        document.querySelectorAll("#leadCaptureForm, #leadCaptureForm1").forEach(function (form) {
            let hasStarted = false;

            form.addEventListener("focusin", function (event) {
                if (hasStarted || event.target.type === "hidden") return;
                hasStarted = true;

                trackEvent("quote_form_start", {
                    form_location: form.id === "leadCaptureForm" ? "mobile" : "desktop"
                });
            });

            form.querySelector("[data-driveway-duo-toggle]")?.addEventListener("change", function (event) {
                trackEvent("driveway_duo_interest", {
                    form_location: form.id === "leadCaptureForm" ? "mobile" : "desktop",
                    selected: event.target.checked ? "yes" : "no"
                });
            });
        });

        document.querySelectorAll(".driveway-duo-terms").forEach(function (terms) {
            terms.addEventListener("toggle", function () {
                if (!terms.open) return;
                trackEvent("promotion_terms_view", {
                    promotion_name: "driveway_duo_full_detail",
                    page_layout: getPageLayout(terms)
                });
            });
        });

        if (window.location.hash === "#driveway-duo") {
            trackEvent("promotion_landing", {
                promotion_name: "driveway_duo_full_detail"
            });
        }

        if (window.location.hash === "#pricing") {
            trackEvent("pricing_landing", {
                page_layout: window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop"
            });
        }

        const visiblePromotion = Array.from(document.querySelectorAll(".driveway-duo-offer"))
            .find(function (offer) { return offer.offsetParent !== null; });

        if (visiblePromotion && "IntersectionObserver" in window) {
            const promotionObserver = new IntersectionObserver(function (entries, observer) {
                if (!entries.some(function (entry) { return entry.isIntersecting; })) return;

                trackEvent("view_promotion", {
                    promotion_id: "driveway_duo_full_detail_50",
                    promotion_name: "Driveway Duo - Two Full Details",
                    creative_slot: getPageLayout(visiblePromotion)
                });
                observer.disconnect();
            }, { threshold: 0.5 });

            promotionObserver.observe(visiblePromotion);
        }

        const reachedDepths = new Set();
        const depthMilestones = [50, 90];

        function trackScrollDepth() {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollableHeight <= 0) return;

            const percent = Math.round((window.scrollY / scrollableHeight) * 100);

            depthMilestones.forEach(function (milestone) {
                if (percent >= milestone && !reachedDepths.has(milestone)) {
                    reachedDepths.add(milestone);
                    trackEvent(`scroll_${milestone}`, {});
                }
            });
        }

        window.addEventListener("scroll", trackScrollDepth, { passive: true });
    });
})();
