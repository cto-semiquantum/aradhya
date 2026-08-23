/* ==========================================
   UNIVERSAL PASSCODE LOCK SCRIPT (0411)
   Always prompts for passcode on every fresh app launch
   ========================================== */

(function () {
    const AUTH_KEY = 'aradhya_app_auth_0411';
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // If opening index.html directly from home screen or browser launch, force fresh passcode prompt
    if (currentPath === "index.html" || currentPath === "") {
        const isInternalNav = sessionStorage.getItem('app_internal_nav') === 'true';
        if (!isInternalNav) {
            sessionStorage.removeItem(AUTH_KEY);
        }
        // Reset internal nav flag after checking
        sessionStorage.removeItem('app_internal_nav');
    }

    // Set internal nav flag on all link clicks so internal navigation stays smooth
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link && link.getAttribute("href")) {
            sessionStorage.setItem('app_internal_nav', 'true');
        }
    });

    const isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true';

    // If accessing any page other than index.html directly without authentication
    if (!isAuthenticated && currentPath !== "index.html" && currentPath !== "") {
        window.location.href = "index.html?redirect=" + encodeURIComponent(currentPath);
        return;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const lockScreen = document.getElementById("globalLockScreen");
        const mainContent = document.getElementById("mainAppContainer");
        const passInput = document.getElementById("globalPasscode");
        const unlockBtn = document.getElementById("globalUnlockBtn");
        const errorEl = document.getElementById("globalLockError");

        if (currentPath === "index.html" || currentPath === "") {
            if (isAuthenticated) {
                if (lockScreen) lockScreen.style.display = "none";
                if (mainContent) mainContent.style.display = "block";
            } else {
                if (lockScreen) lockScreen.style.display = "flex";
                if (mainContent) mainContent.style.display = "none";
            }

            function unlockApp() {
                const val = passInput ? passInput.value.trim() : "";
                if (val === "0411" || val === "411") {
                    sessionStorage.setItem(AUTH_KEY, "true");
                    sessionStorage.setItem('app_internal_nav', 'true');
                    if (lockScreen) lockScreen.style.display = "none";
                    if (mainContent) mainContent.style.display = "block";

                    // Check for redirect param
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get("redirect");
                    if (redirect) {
                        window.location.href = redirect;
                    }
                } else {
                    if (errorEl) {
                        errorEl.textContent = "❌ Incorrect passcode! Try again.";
                        errorEl.style.color = "#ff4b91";
                    }
                }
            }

            if (unlockBtn) unlockBtn.addEventListener("click", unlockApp);
            if (passInput) {
                passInput.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") unlockApp();
                });
            }
        }
    });
})();
