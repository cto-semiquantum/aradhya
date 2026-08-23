document.addEventListener("DOMContentLoaded", function () {

    // Sequential line reveal animation
    const lines = document.querySelectorAll(".line-reveal");
    let delay = 600;

    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add("show");
        }, delay * (index + 1));
    });

    // Cinematic fade to black after all lines reveal
    const totalTime = delay * (lines.length + 1) + 15000;
    
    setTimeout(() => {
        const overlay = document.getElementById("fadeOverlay");
        if (overlay) overlay.style.opacity = "1";
    }, totalTime);

});
