document.addEventListener("DOMContentLoaded", function () {

    const text = `
Kabhi kabhi sochta hoon…

Kaise ek simple si mulaqat meri life ka sabse meaningful chapter ban gayi.

Pehle hum mile…
Phir baatein shuru hui…
Phir bina pata chale best friends ban gaye.

Raat bhar calls.
Random hasi.
Choti choti baatein jo aaj bhi yaad aati hain.

Wo din jab mai dadi ko lane ja raha tha…
Us din samjha ki tum sirf best friend nahi ho.

Phir relationship.
Phir breakup.
Phir silence.

Lekin respect kabhi khatam nahi hui.

Ek saal baad…
Hum phir best friends hain.
Aur is baar zyada samajhdar.

Main tumse pyaar kyun karta hoon?

Kyuki tum genuine ho.
Tumhara heart soft hai.
Tum care karti ho bina show off ke.

Aur agar future me hum saath ho ya na ho —
Main hamesha tumhare saath rahunga.

As a best friend.
As your silent support.
As someone who truly wants you happy.

Tum meri life ka phase nahi ho.
Tum meri growth ka part ho.

Main hoon.
Hamesha.

— Harsh ❤️
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
