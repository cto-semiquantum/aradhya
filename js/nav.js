/* ==========================================
   TOP NAVIGATION BAR SCRIPT
   Compact, Zero-Scroll Navbar with '••• More' Dropdown
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".top-navbar")) return;

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // Primary prominent links in the pill navbar
    const primaryLinks = [
        { path: "index.html", label: "🏠 Home" },
        { path: "cafe.html", label: "☕ Cafe Aru" },
        { path: "bauni.html", label: "🎀 Baunii AI" },
        { path: "holdhands.html", label: "🤝 Hold Hand" },
        { path: "unsaid.html", label: "🕊️ Unsaid" },
        { path: "diary.html", label: "📝 Diary" }
    ];

    // All links categorized inside the '••• More' menu
    const menuCategories = [
        {
            title: "✨ Interactive & New",
            items: [
                { path: "cafe.html", label: "☕ Cafe Aru" },
                { path: "bauni.html", label: "🎀 Baunii AI" },
                { path: "holdhands.html", label: "🤝 Hold My Hand" },
                { path: "unsaid.html", label: "🕊️ Unsaid Words" },
                { path: "mixtape.html", label: "📼 Retro Mixtape" },
                { path: "bottle.html", label: "🍾 Sea Bottle" },
                { path: "safespace.html", label: "🕯️ Safe Space" },
                { path: "me.html", label: "👦 About Harsh" },
                { path: "live.html", label: "📡 Live Updates" }
            ]
        },
        {
            title: "💌 Memories & Daily Moments",
            items: [
                { path: "cookie.html", label: "🥠 Daily Cookie" },
                { path: "voicenotes.html", label: "🎙️ Voice Notes" },
                { path: "openwhen.html", label: "💌 Open When" },
                { path: "littlethings.html", label: "🎞️ Little Things" },
                { path: "chapter.html", label: "🏫 New Chapter" },
                { path: "growth.html", label: "🏆 My Growth" },
                { path: "recap.html", label: "🎬 My 2026" },
                { path: "birthday.html", label: "🎂 Birthday" }
            ]
        },
        {
            title: "💖 Love, Letters & Devotion",
            items: [
                { path: "her.html", label: "✨ Her (Aradhya)" },
                { path: "diary.html", label: "📝 Harsh's Diary" },
                { path: "herdiary.html", label: "🌸 Aru's Diary" },
                { path: "letter.html", label: "💌 The Letter" },
                { path: "promises.html", label: "📜 Promises" },
                { path: "journey.html", label: "🌸 Journey" },
                { path: "reasons.html", label: "💖 Why I Love You" },
                { path: "timeline.html", label: "📖 Our Story" },
                { path: "proposal.html", label: "💍 Proposal" },
                { path: "love.html", label: "⏳ Counter" }
            ]
        },
        {
            title: "🌌 Special & Secrets",
            items: [
                { path: "sky.html", label: "🌌 Constellation" },
                { path: "future.html", label: "✨ Silent Dreams" },
                { path: "videos.html", label: "🎥 Videos" },
                { path: "music.html", label: "📻 Songs" },
                { path: "secret.html", label: "🔒 Secret Vault" },
                { path: "capsule.html", label: "🎁 Time Capsule" },
                { path: "quiz.html", label: "🎮 Quiz" },
                { path: "scratch.html", label: "🎴 Scratch Cards" },
                { path: "forever.html", label: "✨ Forever" }
            ]
        }
    ];

    // Build Top Navbar
    const nav = document.createElement("nav");
    nav.className = "top-navbar";

    let navHTML = primaryLinks.map(link => {
        const isActive = (currentPath === link.path || (currentPath === "" && link.path === "index.html")) ? "active" : "";
        return `<a href="${link.path}" class="nav-pill ${isActive}">${link.label}</a>`;
    }).join("");

    // More Button
    navHTML += `<button class="nav-pill nav-more-btn" id="navMoreBtn">••• More ✨</button>`;

    // Refresh Button
    navHTML += `<button onclick="reopenApp()" class="nav-pill" style="background: linear-gradient(135deg, #ff4b91, #7f00ff); color: #fff; border: none; cursor: pointer;">🔄</button>`;

    nav.innerHTML = navHTML;
    document.body.prepend(nav);

    // Build More Menu Modal
    const menuEl = document.createElement("div");
    menuEl.className = "nav-more-menu";
    menuEl.id = "navMoreMenu";

    let menuHTML = `
        <div class="nav-menu-header">
            <span class="nav-menu-title">🌟 All Features & Pages</span>
            <button class="nav-menu-close" id="navMenuCloseBtn">✕</button>
        </div>
    `;

    menuCategories.forEach(cat => {
        menuHTML += `<div class="nav-menu-category">${cat.title}</div>`;
        menuHTML += `<div class="nav-menu-grid">`;
        cat.items.forEach(item => {
            const isActive = (currentPath === item.path) ? "style='border-color: #ff4b91; background: rgba(255,75,145,0.2);'" : "";
            menuHTML += `<a href="${item.path}" ${isActive}>${item.label}</a>`;
        });
        menuHTML += `</div>`;
    });

    menuEl.innerHTML = menuHTML;
    document.body.appendChild(menuEl);

    // Toggle More Menu
    const moreBtn = document.getElementById("navMoreBtn");
    const closeBtn = document.getElementById("navMenuCloseBtn");

    function openMenu() {
        menuEl.classList.add("open");
    }

    function closeMenu() {
        menuEl.classList.remove("open");
    }

    if (moreBtn) {
        moreBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (menuEl.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("click", (e) => {
        if (!menuEl.contains(e.target) && e.target !== moreBtn) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

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

    // Register & Auto-Update PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            reg.update();
        }).catch(err => {});
    }
});
