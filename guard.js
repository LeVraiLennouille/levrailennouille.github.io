const Guard = (() => {
    const BANNED_WORDS = [
        "abruti", "batard", "bitch", "bite", "bordel", "bouffon", "chienne", "con", "connasse", "couille", "crevard", "cul", "encule", "fdp", "foutre", "garce", "gland", "gueule", "nique", "petasse", "pute", "salaud", "tocard", "trouduc",
        "porn", "sexe", "escort", "webcam", "rencontre", "dating", "sexy", "nude", "cam",
        "cocaine", "heroine","cannabis", "weed", "marijuana", "lsd", "mdma", "ecstasy", "meth", "fentanyl", "drogue", "darknet",
        "forex", "trading", "investissement", "crypto", "bitcoin", "ethereum", "nft", "binance", "revenu", "rentable", "facile", "paypal", "pret", "credit", "virement", "western", "gains", "dividendes", "bourse", "bénéfice",
        "viagra", "cialis", "levitra", "kamagra", "xanax", "valium", "tramadol", "pharmacie", "pharmacy", "ordonnance", "prescription", "pilule", "pill", "medicament", "steroids", "ozempic", "minceur",
        "azerty", "azertyuiop", "asdfghjklm", "qwerty", "qwertyuiop", "qsdfghjklm", "qsdf","qsdfgh", "asdf", "asdfgh", "wxcvbn","1234", "12345", "123456", "aze", "qwe", "aaaa", "bbbb", "blabla", "titi", "tata",
        "javascript:", "<script", "onerror=", "onload=", "eval(", "union select", "drop table", "<iframe", "document.cookie", "[url=", "[link=", "vbscript:", "data:text/html",
        "hack", "password", "piratage", "bloque", "compte", "recuperation", "support", "admin", "unlock",
    ];

    function normalizeText(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    /**
     * @param {Array<{value: string, [key: string]: any}>} fields
     * @returns {(object & {word: string}) | null}
     */

    function findBannedWord(fields) {
        for (const entry of fields) {
            if (!entry.value) continue;

            const normalizedValue = normalizeText(entry.value);
            for (const word of BANNED_WORDS) {
                const pattern = new RegExp(`\\b${normalizeText(word)}\\b`, "i");
                if (pattern.test(normalizedValue)) return {...entry, word};
            }
        }
        return null;
    }

    function showToast(message, title = "Erreur") {
        const toastContainer = document.getElementById("ToastContainer");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "Toast";
        toast.setAttribute("role", "alert");
        toast.innerHTML = `
            <svg class="ToastIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 9v4m0 4h.01M10.29 3.86l-8.16 14.14A2 2 0 0 0 3.86 21h16.28a2 2 0 0 0 1.73-3l-8.16-14.14a2 2 0 0 0-3.46 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="ToastBody">
                <p class="ToastTitle"></p>
                <p class="ToastMessage"></p>
            </div>
            <button type="button" class="ToastClose" aria-label="Fermer la notification">&times;</button>
        `;

        toast.querySelector(".ToastTitle").textContent = title;
        toast.querySelector(".ToastMessage").textContent = message;

        toastContainer.appendChild(toast);

        const remove = () => {
            toast.classList.add("ToastOut");
            toast.addEventListener("animationend", () => toast.remove(), {once: true});
        };

        toast.querySelector(".ToastClose").addEventListener("click", remove);
        setTimeout(remove, 6000);
    }

    /**
     * @param {string} key
     * @param {number} max
     * @param {number} windowMs
     */
    function createRateLimiter(key, max, windowMs) {
        function getRecentSubmissions() {
            let timestamps;
            try {
                timestamps = JSON.parse(localStorage.getItem(key)) || [];
            } catch {
                timestamps = [];
            }

            const now = Date.now();
            const recent = timestamps.filter((t) => now - t < windowMs);
            try {
                localStorage.setItem(key, JSON.stringify(recent));
            } catch {}
            return recent;
        }

        return {
            /** @returns {number|null} */
            isLimited() {
                const recent = getRecentSubmissions();
                if (recent.length < max) return null;
                const oldest = Math.min(...recent);
                return Math.ceil((windowMs - (Date.now() - oldest)) / 60000);
            },

            record() {
                const recent = getRecentSubmissions();
                recent.push(Date.now());
                try {
                    localStorage.setItem(key, JSON.stringify(recent));
                } catch {}
            },
        };
    }

    return {BANNED_WORDS, normalizeText, findBannedWord, showToast, createRateLimiter};
})();