document.addEventListener("DOMContentLoaded", function () {

    // Card entrance animation
    const card = document.querySelector(".journey-card");
    if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        
        setTimeout(() => {
            card.style.transition = "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 200);
    }

});
