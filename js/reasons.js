document.addEventListener("DOMContentLoaded", function () {

    const reasons = [
        "Because moving on from you is something my heart will never agree to 💕",
        "Because even after 104 days of silence, my heart beats only for your name 🎶",
        "Because your smile is still the only thing that fixes my worst days 🌸",
        "Because no matter how much distance comes between us, you remain my home 🥺",
        "Because I am hopelessly, unconditionally, & endlessly in love with you ✨",
        "Because you are not just a person to me… you are my entire world ❤️",
        "Because even in my silence, I am constantly talking to you in my thoughts 🌙",
        "Because I tried to forget, but my soul refuses to love anyone else 🙏",
        "Because Harsh belongs to you, today, tomorrow, and for eternity 💍"
    ];

    let reasonIndex = 0;
    const totalReasons = reasons.length;

    const text = document.getElementById("reasonText");
    const btn = document.getElementById("reasonBtn");
    const numDisplay = document.getElementById("reasonNum");
    const progressFill = document.getElementById("progressFill");

    window.nextReason = function () {
        if (!text) return;

        // Fade out
        text.style.opacity = "0";
        text.style.transform = "translateY(12px)";

        setTimeout(() => {
            if (reasonIndex < totalReasons) {
                text.textContent = reasons[reasonIndex];
                
                if (numDisplay) {
                    numDisplay.textContent = `#${reasonIndex + 1} of ${totalReasons}`;
                }

                // Update progress bar
                if (progressFill) {
                    const progress = ((reasonIndex + 1) / totalReasons) * 100;
                    progressFill.style.width = progress + "%";
                }

                reasonIndex++;

                if (reasonIndex === totalReasons && btn) {
                    btn.textContent = "One More… 💖";
                }

            } else {
                text.textContent = "And the biggest reason… I just love you endlessly ❤️";
                if (btn) {
                    btn.textContent = "That's All 💖";
                    btn.disabled = true;
                    btn.style.opacity = "0.6";
                }
                if (numDisplay) numDisplay.textContent = "💖";
                if (progressFill) progressFill.style.width = "100%";
            }

            // Fade in
            text.style.opacity = "1";
            text.style.transform = "translateY(0)";

        }, 350);
    };

});
