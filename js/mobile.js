
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

function openMenu() {

    mobileMenu.classList.add("open");

    document.body.style.overflow = "hidden";

}

function closeMobileMenu() {

    mobileMenu.classList.remove("open");

    document.body.style.overflow = "";

}


menuButton.addEventListener("click", openMenu);

closeMenu.addEventListener("click", closeMobileMenu);


/* Close menu when clicking a link */

document.querySelectorAll(".mobile-menu-link").forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});


/* =========================================================
   BEFORE / AFTER SLIDERS
========================================================= */

document.querySelectorAll(".ba-slider").forEach(slider => {

    const input = slider.querySelector(".ba-input");
    const beforeWrapper = slider.querySelector(".ba-before-wrapper");
    const handle = slider.querySelector(".ba-handle");
    const instruction = slider.querySelector(".ba-start");

    function updateSlider(value) {

        beforeWrapper.style.width = `${value}% `;

        handle.style.left = `${value}% `;

        if (value > 5) {

            instruction.style.opacity = "0";

        } else {

            instruction.style.opacity = "1";

        }

    }


    input.addEventListener("input", function () {

        updateSlider(this.value);

    });


    /* Initial state */

    updateSlider(input.value);

});


/* =========================================================
   PRICING ACCORDIONS
========================================================= */

document.querySelectorAll(".details-toggle").forEach(button => {

    button.addEventListener("click", function () {

        const card = this.closest(".price-card");

        const content =
            card.querySelector(".extra-features");

        const isOpen =
            content.classList.contains("open");


        if (isOpen) {

            content.classList.remove("open");

            this.classList.remove("open");

            this.setAttribute(
                "aria-expanded",
                "false"
            );

            this.childNodes[0].textContent =
                "View Everything ";

        } else {

            content.classList.add("open");

            this.classList.add("open");

            this.setAttribute(
                "aria-expanded",
                "true"
            );

            this.childNodes[0].textContent =
                "Hide Details ";

        }

    });

});


/* =========================================================
   BOOKING DATE
========================================================= */

const dateInput =
    document.getElementById("booking_date_picker");

if (dateInput) {

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.min = today;

}


/* =========================================================
   TRACK BOOKING CLICKS
========================================================= */

document.querySelectorAll(
    'a[href="#booking"]'
).forEach(button => {

    button.addEventListener("click", function () {

        const timestamp =
            new Date().toISOString();

        sessionStorage.setItem(
            "quote_click_timestamp",
            timestamp
        );

    });

});


/* =========================================================
   FORM TRACKING
========================================================= */



/* =========================================================
   HIDE STICKY BAR WHEN BOOKING IS VISIBLE
========================================================= */

const bottomBar =
    document.querySelector(".mobile-bottom-bar");

const bookingSection =
    document.getElementById("booking");

if (
    bottomBar &&
    bookingSection &&
    "IntersectionObserver" in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        bottomBar.style.transform =
                            "translateY(100%)";

                    } else {

                        bottomBar.style.transform =
                            "translateY(0)";

                    }

                });

            },
            {
                threshold: .15
            }
        );

    observer.observe(bookingSection);

}


/* =========================================================
   PREVENT DOUBLE TAP ZOOM ON BUTTONS
========================================================= */

document.querySelectorAll(
    "button, a"
).forEach(element => {

    element.addEventListener(
        "touchend",
        function () {

            this.style.webkitTapHighlightColor =
                "transparent";

        }
    );

});

