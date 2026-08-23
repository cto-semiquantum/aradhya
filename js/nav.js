/* ==========================================
   TOP NAVIGATION BAR SCRIPT
   Inserts instant sleek top navbar across all pages
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".top-navbar")) return;

    const nav = document.createElement("nav");
    nav.className = "top-navbar";

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    const links = [
        { path: "index.html", label: "🏠 Home" },
        { path: "chapter.html", label: "🏫 New Chapter" },
        { path: "growth.html", label: "🏆 My Growth" },
        { path: "recap.html", label: "🎬 My 2026" },
        { path: "birthday.html", label: "🎂 Birthday Gift" },
        { path: "sky.html", label: "🌌 Constellation Sky" },
        { path: "future.html", label: "✨ Silent Dreams" },
        { path: "her.html", label: "✨ Her" },
        { path: "videos.html", label: "🎥 Videos" },
        { path: "music.html", label: "📻 Songs" },
        { path: "promises.html", label: "📜 Promises" },
        { path: "journey.html", label: "🌸 Journey" },
        { path: "reasons.html", label: "💖 Why I Love You" },
        { path: "timeline.html", label: "📖 Our Story" },
        { path: "letter.html", label: "💌 Letter" },
        { path: "proposal.html", label: "💍 Proposal" },
        { path: "love.html", label: "⏳ Counter" },
        { path: "diary.html", label: "📝 Diary" },
        { path: "secret.html", label: "🔒 Secret" },
        { path: "capsule.html", label: "🎁 Capsule" },
        { path: "quiz.html", label: "🎮 Quiz" },
        { path: "scratch.html", label: "🎴 Cards" },
        { path: "forever.html", label: "✨ Forever" }
    ];

    let navHTML = links.map(link => {
        const isActive = (currentPath === link.path || (currentPath === "" && link.path === "index.html")) ? "active" : "";
        return `<a href="${link.path}" class="nav-pill ${isActive}">${link.label}</a>`;
    }).join("");

    navHTML += `<button onclick="reopenApp()" class="nav-pill" style="background: linear-gradient(135deg, #ff4b91, #7f00ff); color: #fff; border: none; cursor: pointer;">🔄 Re-open App</button>`;

    nav.innerHTML = navHTML;
    document.body.prepend(nav);

    // Global Re-open / Refresh App function
    window.reopenApp = function () {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.update();
                }
            });
        }
        window.location.reload(true);
    };

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => {});
    }
});
