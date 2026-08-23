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
        { path: "her.html", label: "✨ Her" },
        { path: "videos.html", label: "🎥 Videos" },
        { path: "sky.html", label: "🌌 Sky" },
        { path: "future.html", label: "✨ Dreams" },
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

    nav.innerHTML = links.map(link => {
        const isActive = (currentPath === link.path || (currentPath === "" && link.path === "index.html")) ? "active" : "";
        return `<a href="${link.path}" class="nav-pill ${isActive}">${link.label}</a>`;
    }).join("");

    document.body.prepend(nav);

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => {});
    }
});
