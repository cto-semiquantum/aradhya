document.addEventListener("DOMContentLoaded", function () {

    const reasons = [
        "Because your smile fixes my worst days 💕",
        "Because your voice feels like home 🎶",
        "Because you support my dreams 💻",
        "Because you understand me without words 🥺",
        "Because you are beautiful inside and out 🌸",
        "Because life feels lighter with you ✨",
        "Because you care deeply ❤️",
        "Because you are my peace 🌙",
        "Because I prayed for someone like you 🙏",
        "Because I can't imagine my future without you 💍"
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
