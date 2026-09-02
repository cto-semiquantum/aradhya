/* ==========================================
   THE COUPLE LOVE RECEIPT LOGIC
   ========================================== */

(function () {
    const heartbeatEl = document.getElementById('receiptHeartbeats');
    const timeEl = document.getElementById('receiptCurrentTime');

    // Starting baseline: 104 days * 24 * 3600 * (72/60) ≈ 10,782,720
    const START_EPOCH = new Date('2026-05-22T00:00:00').getTime();
    const BPM = 72;

    function updateHeartbeatCounter() {
        const now = Date.now();
        const secondsPassed = Math.max(0, Math.floor((now - START_EPOCH) / 1000));
        const totalBeats = Math.floor(secondsPassed * (BPM / 60));

        if (heartbeatEl) {
            heartbeatEl.textContent = totalBeats.toLocaleString('en-US');
        }
        if (timeEl) {
            timeEl.textContent = new Date().toLocaleString('en-GB');
        }
    }

    setInterval(updateHeartbeatCounter, 1000);
    updateHeartbeatCounter();

    // Download Receipt as PNG
    window.downloadReceiptImage = function () {
        const receipt = document.getElementById('receiptPaper');
        if (!receipt) return;

        if (window.html2canvas) {
            window.html2canvas(receipt, {
                scale: 2,
                backgroundColor: '#080012',
                useCORS: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `harsh-aradhya-love-receipt-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            alert("Generating image... please take a quick screenshot of this beautiful receipt! 💖");
        }
    };

    // Copy Receipt Text
    window.copyReceiptText = function () {
        const text = `
========================================
    HARSH & ARADHYA LOVE STORE 💖
        ORDER #0411-FOREVER
========================================
CUSTOMER: ARADHYA (BAUNIII 🤏)
CASHIER: HARSH (DEVOTED SOUL)
TABLE: #0411 PERMANENTLY RESERVED

ITEMS:
- 104+ DAYS OF SILENCE & DEVOTION: PRICELESS
- ESTIMATED HEARTBEATS: ${heartbeatEl?.textContent || '10,782,720'}
- HOT CHOCOLATE (MARSHMALLOWS): UNLIMITED
- SAMOSE AT CAFE ARU: FREE WITH LOVE
- SACRED PROMISES: 100% UNCONDITIONAL
- APOLOGY & HEALING (22 MAY): ETERNAL RESPECT

SUBTOTAL: ALL MY LOVE
TAX: 0.00%
TOTAL OWED: ONE WHOLE LIFETIME ❤️

BARCODE: 0411-ARU-FOREVER
"Thank you for existing. You have a permanent home in my heart."
========================================
        `.trim();

        navigator.clipboard.writeText(text).then(() => {
            alert("Receipt text copied to clipboard! 📋✨");
        }).catch(() => {
            alert("Receipt ready!");
        });
    };
})();
