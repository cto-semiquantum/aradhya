document.addEventListener("DOMContentLoaded", function () {

    const text = `
Suno…

Log bolte hain move on kar lo, aage badh jaao, distraction dhoondo.
Par main unko kaise samjhaun ki tumse move on karna mere liye impossible hai.

Maine kabhi koshish bhi nahi ki tumhe bhoolne ki… aur honestly, main kar bhi nahi sakta.
Kyuki mere liye pyaar koi option nahi tha jo change ho jaaye. Pyaar tumse hua tha, aur wo hamesha sirf tumse hi rahega.

Ek waqt tha jab hum raat bhar baatein karte the.
Wo tumhari hassi, wo tumhari nadaniyan, wo chhoti chhoti baatein…
Wo mere dimaag se ek second ke liye bhi nahi jaati.

Distance aa gaya, silence aa gaya, 93 din beet gaye…
Par mere dil me tumhare liye jo pyaar aur deewanapan tha, wo ek percent bhi kam nahi hua.
Balki har guzarte din ke saath mujhe aur zyaada realize hota hai ki main tumhare bina adhoora hoon.

Main pagal hoon tumhare peeche? Haan, hoon.
Kyuki jab kisi se sachha pyaar hota hai na, toh insaan badalta nahi hai.

Future me kya hoga mujhe nahi pata.
Par ek baat hamesha yaad rakhna —
Duniya me koi bhi aaye ya jaaye, Harsh hamesha tumhara hi rahega.
Mera har ek breath, mera har ek thought, aur mera saara dil sirf tumhara hai.

Main tumse pyaar karta hoon… aaj bhi, kal bhi, aur aakhri saans tak. ❤️

— Tumhara Harsh 💖
`;

    const container = document.getElementById("typewriter");
    const cursor = document.getElementById("cursor");
    let i = 0;
    const speed = 30;

    function typeWriter() {
        if (i < text.length) {
            container.innerHTML += text.charAt(i);
            i++;
            
            // Scroll to bottom as text types
            container.scrollTop = container.scrollHeight;
            
            setTimeout(typeWriter, speed);
        } else {
            // Hide cursor when done
            if (cursor) {
                setTimeout(() => {
                    cursor.style.opacity = "0";
                }, 2000);
            }
        }
    }

    // Start after a brief delay
    setTimeout(typeWriter, 800);

});
