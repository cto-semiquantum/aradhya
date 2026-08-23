document.addEventListener("DOMContentLoaded", function () {

    // Scroll-based reveal animation
    function revealOnScroll() {
        const items = document.querySelectorAll(".reveal");

        items.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 80) {
                // Stagger the animation
                setTimeout(() => {
                    el.classList.add("active");
                }, index * 100);
            }
        });
    }

    // Run on scroll and on load
    window.addEventListener("scroll", revealOnScroll);
    
    // Initial reveal with slight delay for page load
    setTimeout(revealOnScroll, 300);

});
