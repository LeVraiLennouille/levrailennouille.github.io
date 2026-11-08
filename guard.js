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
                // Les caractères spéciaux (ex. "eval(") sont échappés, sinon la RegExp lève une erreur
                const escaped = normalizeText(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const pattern = new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, "i");
                if (pattern.test(normalizedValue)) return {...entry, word};
            }
        }
        return null;
    }

    const TOAST_ICONS = {
        success: '<path d="M5.5 12.5l4.5 4.5L18.5 7.5"/>',
        error: '<path d="M7 7l10 10M17 7L7 17"/>',
        warning: '<path d="M12 5.5v8"/><path d="M12 18.2v.3"/>',
        info: '<path d="M9.3 9.4a2.8 2.8 0 1 1 4.4 2.3c-1 .7-1.7 1.2-1.7 2.4"/><path d="M12 18.2v.3"/>',
    };
    const TOAST_MAX = 3;

    /**
     * Affiche un toast.
     * @param {string} message
     * @param {string} [title]
     * @param {{type?: "success"|"error"|"warning"|"info", link?: {text: string, href: string}, duration?: number}} [options]
     * @returns {HTMLElement|null}
     */
    function showToast(message, title = "Erreur", options = {}) {
        const container = document.getElementById("ToastContainer");
        if (!container) return null;

        const type = TOAST_ICONS[options.type] ? options.type : "error";
        const duration = options.duration || (type === "success" ? 6000 : 8000);
        const key = `${type}|${title}|${message}`;

        // Évite d'empiler deux fois le même toast
        const duplicate = [...container.children].find((t) => t.dataset.key === key && !t.classList.contains("ToastOut"));
        if (duplicate) return duplicate;
        while (container.children.length >= TOAST_MAX) container.firstElementChild.remove();

        const toast = document.createElement("div");
        toast.className = `Toast Toast${type[0].toUpperCase()}${type.slice(1)}`;
        toast.dataset.key = key;
        toast.setAttribute("role", type === "error" || type === "warning" ? "alert" : "status");
        toast.style.setProperty("--ToastDuration", `${duration}ms`);
        toast.innerHTML = `
            <div class="ToastBlobs" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="ToastBadge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${TOAST_ICONS[type]}</svg>
            </div>
            <div class="ToastBody">
                <p class="ToastTitle"></p>
                <p class="ToastMessage"></p>
            </div>
            <button type="button" class="ToastClose" aria-label="Fermer la notification">&times;</button>
            <div class="ToastProgress" aria-hidden="true"></div>
        `;

        toast.querySelector(".ToastTitle").textContent = title;
        const messageEl = toast.querySelector(".ToastMessage");
        messageEl.textContent = message;
        if (options.link) {
            const a = document.createElement("a");
            a.className = "ToastLink";
            a.href = options.link.href;
            a.textContent = options.link.text;
            messageEl.append(" ", a);
        }

        container.appendChild(toast);

        let removed = false;
        const remove = () => {
            if (removed) return;
            removed = true;
            toast.classList.add("ToastOut");
            toast.addEventListener("animationend", () => toast.remove(), {once: true});
            setTimeout(() => toast.remove(), 600);
        };

        toast.querySelector(".ToastClose").addEventListener("click", remove);

        // La barre de progression pilote la fermeture (elle se met en pause au survol / focus)
        const bar = toast.querySelector(".ToastProgress");
        if (getComputedStyle(bar).animationName === "none") {
            setTimeout(remove, duration);
        } else {
            bar.addEventListener("animationend", remove, {once: true});
        }
        return toast;
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