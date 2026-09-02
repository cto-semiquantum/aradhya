/* ==========================================
   CAFE ARU — OUR DREAM CAFE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playBellSound() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.5);
        } catch(e) {}
    }

    const orderStatusBox = document.getElementById('orderStatusBox');
    const orderMessage = document.getElementById('orderMessage');
    const orderSubtext = document.getElementById('orderSubtext');
    const statusCup = document.getElementById('statusCup');

    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.dataset.item;
            const icon = btn.dataset.icon || '☕';
            const remark = btn.dataset.remark || 'Freshly brewed with love!';

            playBellSound();

            if (statusCup) statusCup.textContent = icon;
            if (orderMessage) orderMessage.textContent = `Order Placed: ${item}! ✨`;
            if (orderSubtext) orderSubtext.textContent = `"${remark}" — Barista Harsh is serving Table #0411 (Aru) ❤️`;

            if (orderStatusBox) {
                orderStatusBox.classList.add('active');
                orderStatusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Cloud sync notification to Harsh's phone
            try {
                fetch("https://ntfy.sh/harsh_diary_cloud_sync_411", {
                    method: "POST",
                    body: JSON.stringify({
                        event: "cafe_order",
                        item: item,
                        time: new Date().toISOString()
                    }),
                    headers: { "Title": `☕ Cafe Aru Order: ${item}` }
                }).catch(() => {});
            } catch(e) {}
        });
    });

    // Bell action button
    const ringBellBtn = document.getElementById('ringBellBtn');
    if (ringBellBtn) {
        ringBellBtn.addEventListener('click', () => {
            playBellSound();
            alert("🛎️ *Ding!* Barista Harsh running to Table #0411! 'Ji boliye Aru, kya laaun aapke liye?' 🌸");
        });
    }

});
