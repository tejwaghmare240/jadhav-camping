// ============================================
// JADHAV CAMPING - FINAL CLEAN JAVASCRIPT
// Razorpay + Google Sheet Integration FIXED
// ============================================

const scriptURL = "https://script.google.com/macros/s/AKfycbxkZ71_3EhuZH0nkhsmJK1xUY5D3Cd0PwyW9SHq6XTOul1CiEM5rf5lLfFqqV4Zu72yFg/exec";

// ============================================
// MOBILE MENU
// ============================================

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

// ============================================
// POPUP FUNCTION
// ============================================

function showPopup(type, message) {
    const old = document.querySelector(".custom-popup");
    if (old) old.remove();

    const popup = document.createElement("div");
    popup.className = `custom-popup ${type}`;
    popup.innerHTML = `
        <div class="popup-content">
            <div>${message}</div>
            <button onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 5000);
}

// ============================================
// RAZORPAY + BOOKING SYSTEM (FIXED)
// ============================================

function sendBooking(form, type) {
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = "Processing...";
        submitBtn.disabled = true;

        const formData = new FormData(form);

        const data = {
            type: type,
            name: formData.get("name") || "",
            phone: formData.get("phone") || "",
            email: formData.get("email") || "",
            people: formData.get("people") || "",
            date: formData.get("date") || "",
            package: formData.get("package") || "",
            message: formData.get("message") || "",
            totalPrice: document.getElementById("totalPrice")
                ? document.getElementById("totalPrice").value.replace(/[^\d]/g, "")
                : "",
            advancePrice: "500"
        };

        const options = {
            key: "rzp_live_SqStrBrYIzThka",
            amount:6000,
            currency: "INR",
            name: "Jadhav Camping",
            description: "Booking Payment",

            handler: async function (response) {

                data.paymentId = response.razorpay_payment_id;

                try {
                    await fetch(scriptURL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    showPopup("success", "Booking Successful 🎉");

                    form.reset();

                } catch (err) {
                    console.error(err);
                    showPopup("error", "Payment done पण data save नाही झाला");
                }

                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            },

            modal: {
                ondismiss: function () {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            },

            theme: {
                color: "#4CAF50"
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    });
}

// ============================================
// INIT FORMS
// ============================================

const bookingForms = document.querySelectorAll(".booking-form");

bookingForms.forEach((form) => {
    sendBooking(form, "Booking");
});

// ============================================
// GROUP PRICE CALCULATION
// ============================================

const membersInput = document.getElementById("groupMembers");
const packageInput = document.getElementById("groupPackage");
const totalPrice = document.getElementById("totalPrice");

function calculatePrice() {
    if (!membersInput || !packageInput || !totalPrice) return;

    const members = parseInt(membersInput.value) || 0;
    const price = parseInt(packageInput.value) || 0;

    let total = members * price;
    let discount = 0;

    if (members >= 20) discount = 20;
    else if (members >= 10) discount = 10;

    const final = total - (total * discount) / 100;

    totalPrice.value = final > 0 ? `₹${final}` : "";
}

if (membersInput && packageInput) {
    membersInput.addEventListener("input", calculatePrice);
    packageInput.addEventListener("change", calculatePrice);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    navbar.style.background =
        window.scrollY > 100
            ? "rgba(0,0,0,0.98)"
            : "rgba(0,0,0,0.95)";
});


// ====================================
// Testimonials Feedback Feature
// ====================================

document.addEventListener("DOMContentLoaded", function () {

    const dotsContainer = document.querySelector(".testimonial-dots");
    const openFeedbackBtn = document.getElementById("openFeedback");
    const feedbackForm = document.getElementById("feedbackForm");
    const submitFeedbackBtn = document.getElementById("submitFeedback");
    const testimonialSlider = document.querySelector(".testimonial-slider");

    if (!openFeedbackBtn || !feedbackForm || !submitFeedbackBtn || !testimonialSlider) {
        console.log("Feedback elements not found");
        return;
    }

    // =========================
    // Create Dots
    // =========================
    function updateDots() {
        if (!dotsContainer) return;

        const slides = testimonialSlider.querySelectorAll(".testimonial-slide");

        dotsContainer.innerHTML = "";

        slides.forEach(function (_, index) {

            const dot = document.createElement("span");
            dot.className = "dot";

            if (index === currentSlide) {
                dot.classList.add("active");
            }

            dot.addEventListener("click", function () {
                currentSlide = index;
                showSlide(currentSlide);
            });

            dotsContainer.appendChild(dot);
        });
    }

    // =========================
    // Open / Close Form
    // =========================
    openFeedbackBtn.addEventListener("click", function () {

        feedbackForm.style.display =
            feedbackForm.style.display === "block"
                ? "none"
                : "block";
    });

    // =========================
    // Create Testimonial Card
    // =========================
    function createTestimonial(name, place, message, active = false) {

        const slide = document.createElement("div");

        slide.className = "testimonial-slide";

        if (active) {
            slide.classList.add("active");
        }

        slide.innerHTML = `
            <div class="testimonial-content">
                <i class="fas fa-quote-left fa-2x"></i>

                <p>"${message}"</p>

                <div class="stars">★★★★★</div>

                <div class="testimonial-author">
                    <h4>${name}</h4>
                    <span>${place}</span>
                </div>
            </div>
        `;

        return slide;
    }

    // =========================
    // Load Saved Feedbacks
    // =========================
    const savedFeedbacks =
        JSON.parse(localStorage.getItem("campFeedbacks")) || [];

    savedFeedbacks.forEach(function (item) {

        const slide = createTestimonial(
            item.name,
            item.place,
            item.message
        );

        testimonialSlider.appendChild(slide);
    });

    // =========================
    // Submit Feedback
    // =========================
    submitFeedbackBtn.addEventListener("click", function () {

        const guestName =
            document.getElementById("guestName").value.trim();

        const guestPlace =
            document.getElementById("guestPlace").value.trim();

        const guestMessage =
            document.getElementById("guestMessage").value.trim();

        if (!guestName || !guestPlace || !guestMessage) {

            alert("Please fill all fields");
            return;
        }

        // Remove active from all slides
        const slides =
            testimonialSlider.querySelectorAll(".testimonial-slide");

        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });

        // Create new active slide
        const newSlide = createTestimonial(
            guestName,
            guestPlace,
            guestMessage,
            true
        );

        // Add at top
        testimonialSlider.prepend(newSlide);

        // Save to localStorage
        savedFeedbacks.unshift({
            name: guestName,
            place: guestPlace,
            message: guestMessage
        });

        localStorage.setItem(
            "campFeedbacks",
            JSON.stringify(savedFeedbacks)
        );

        // Clear form
        document.getElementById("guestName").value = "";
        document.getElementById("guestPlace").value = "";
        document.getElementById("guestMessage").value = "";

        // Hide form
        feedbackForm.style.display = "none";

        // Reset slider
        currentSlide = 0;

        showSlide(currentSlide);

        updateDots();
    });

    // =========================
    // Slider Function
    // =========================
    let currentSlide = 0;

    function showSlide(index) {

        const slides =
            document.querySelectorAll(".testimonial-slide");

        if (slides.length === 0) return;

        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });

        if (index >= slides.length) {
            currentSlide = 0;
        }

        if (index < 0) {
            currentSlide = slides.length - 1;
        }

        slides[currentSlide].classList.add("active");

        updateDots();
    }

    // =========================
    // Auto Slider
    // =========================
    setInterval(function () {

        const slides =
            document.querySelectorAll(".testimonial-slide");

        if (slides.length <= 1) return;

        currentSlide++;

        showSlide(currentSlide);

    }, 4000);

    // Initialize
    showSlide(currentSlide);
    updateDots();

});

// ======================================
// PHOTO / VIDEO TAB SWITCH
// ======================================

function showGallery(type) {

    const photosSection =
        document.getElementById("photos-section");

    const videosSection =
        document.getElementById("videos-section");

    const buttons =
        document.querySelectorAll(".gallery-tab");

    // Remove active class from all buttons
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    // Show Photos
    if (type === "photos") {

        photosSection.style.display = "block";
        videosSection.style.display = "none";

        buttons[0].classList.add("active");

    }

    // Show Videos
    else {

        photosSection.style.display = "none";
        videosSection.style.display = "block";

        buttons[1].classList.add("active");
    }
}

// ======================================
// DEFAULT OPEN
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    // Open Photos First
    showGallery("photos");

    // ======================================
    // VIDEO POPUP
    // ======================================

    const modal =
        document.getElementById("videoModal");

    const popupVideo =
        document.getElementById("popupVideo");

    const closeBtn =
        document.querySelector(".close-video");

    const videoItems =
        document.querySelectorAll(".cinematic-item");

    // Open Popup
    videoItems.forEach(item => {

        item.addEventListener("click", () => {

            const video =
                item.querySelector("video");

            const src =
                video.getAttribute("data-video");

            popupVideo.src = src;

            modal.classList.add("active");

            popupVideo.muted = false;

            popupVideo.play();
        });

    });

    // ======================================
    // CLOSE BUTTON
    // ======================================

    closeBtn.addEventListener("click", closeVideoModal);

    // ======================================
    // CLICK OUTSIDE TO CLOSE
    // ======================================

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {
            closeVideoModal();
        }

    });

    // ======================================
    // CLOSE FUNCTION
    // ======================================

    function closeVideoModal() {

        modal.classList.remove("active");

        popupVideo.pause();

        popupVideo.currentTime = 0;

        popupVideo.src = "";
    }

});