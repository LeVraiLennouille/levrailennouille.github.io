(function () {
    const ACCENT =
        getComputedStyle(document.documentElement)
        .getPropertyValue("--Primary")
        .trim() || "#207EDE";
    let HAS_VAR = true;

    function probeVar() {
        const root = document.querySelector("main") || document.body;
        const p = document.createElement("span");
        p.textContent = "WWWiiiRRR";
        p.style.cssText =
            "position:absolute;visibility:hidden;white-space:nowrap;font-size:40px;font-weight:400";
        root.appendChild(p);
        p.style.fontVariationSettings = '"wght" 400';
        const w1 = p.getBoundingClientRect().width;
        p.style.fontVariationSettings = '"wght" 800';
        const w2 = p.getBoundingClientRect().width;
        p.remove();
        HAS_VAR = Math.abs(w2 - w1) > 1;
        document.documentElement.classList.toggle("NoVarFont", !HAS_VAR);
    }

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(probeVar);
    window.addEventListener("load", probeVar);

    function setWeight(el, w) {
        if (HAS_VAR) {
            el.style.fontVariationSettings = '"wght" ' + w;
            el.style.removeProperty("-webkit-text-stroke");
        } else {
            const px = ((w - 400) / 400) * 2.2;
            el.style.setProperty(
                "-webkit-text-stroke",
                px.toFixed(2) + "px currentColor",
            );
        }
    }
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+-/<>[]{}01";
    const rand = (a, b) => Math.random() * (b - a) + a;
    const randInt = (a, b) => Math.floor(rand(a, b + 1));

    function splitToSpans(el, textOverride, staggerMax) {
        const text = textOverride || el.textContent;
        el.textContent = "";
        el.setAttribute("aria-label", text);
        const frag = document.createDocumentFragment();
        const chars = [...text];
        const len = Math.max(chars.length - 1, 1);
        let word = null;
        chars.forEach((ch, i) => {
            if (ch === " ") {
                word = null;
                frag.appendChild(document.createTextNode(" "));
                return;
            }
            if (!word) {
                word = document.createElement("span");
                word.className = "Word";
                frag.appendChild(word);
            }
            const s = document.createElement("span");
            s.className = "Ch";
            s.dataset.c = ch;
            s.style.setProperty("--i", i);
            if (staggerMax)
                s.style.setProperty("--d", ((i / len) * staggerMax).toFixed(0) + "ms");
            s.textContent = ch;
            word.appendChild(s);
        });
        el.appendChild(frag);
        return [...el.querySelectorAll(".Ch")];
    }

    document.querySelectorAll(".Plate").forEach((p) => {
        const n = p.querySelector(".PlateNum");
        if (n) p.setAttribute("data-index", n.textContent.trim());
    });

    const stages = document.querySelectorAll(".Stage[data-observe]");
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    el.classList.add("In");
                    el.dispatchEvent(new CustomEvent("specimen:enter"));
                } else {
                    el.classList.remove("In");
                    el.dispatchEvent(new CustomEvent("specimen:leave"));
                }
            });
        }, {
            threshold: 0,
            rootMargin: "-25% 0px -25% 0px",
        },
    );
    stages.forEach((s) => io.observe(s));

    const plates = document.querySelectorAll(".Plate");
    const progressEl = document.getElementById("progress");
    const navLinks = document.querySelectorAll(".Sidebar a");
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const plate = entry.target;
                const num = plate.dataset.index;
                const name = plate.querySelector("h3") ?
                    plate.querySelector("h3").textContent :
                    "";
                if (progressEl)
                    progressEl.innerHTML = `<span class="Num">${num}</span> / 30 — ${name}`;
                navLinks.forEach((a) => {
                    a.classList.toggle(
                        "Active",
                        a.getAttribute("href") === "#" + plate.id,
                    );
                });
            });
        }, {
            threshold: 0,
            rootMargin: "-45% 0px -45% 0px",
        },
    );
    plates.forEach((p) => sectionObserver.observe(p));

    document.querySelectorAll('[data-anim="scramble"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const target = el.dataset.text;
        let timer = null;

        function run() {
            clearInterval(timer);
            let revealed = 0;
            let frame = 0;
            timer = setInterval(() => {
                frame++;
                let out = "";
                for (let i = 0; i < target.length; i++) {
                    if (target[i] === " ") {
                        out += " ";
                        continue;
                    }
                    if (i < revealed) out += target[i];
                    else out += CHARS[randInt(0, CHARS.length - 1)];
                }
                el.textContent = out;
                if (frame % 3 === 0) revealed++;
                if (revealed > target.length) {
                    clearInterval(timer);
                    el.textContent = target;
                }
            }, 40);
        }
        stage.addEventListener("specimen:enter", run);
    });

    document.querySelectorAll('[data-anim="typewriter"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const target = el.dataset.text;
        el.style.borderRight = "2px solid var(--Primary)";
        el.style.paddingRight = "4px";
        let timer;

        function run() {
            clearInterval(timer);
            let i = 0;
            el.textContent = "";
            timer = setInterval(() => {
                el.textContent = target.slice(0, i + 1);
                i++;
                if (i >= target.length) clearInterval(timer);
            }, 65);
        }
        stage.addEventListener("specimen:enter", run);
    });

    document.querySelectorAll('[data-anim="splitflap"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const target = el.dataset.text;

        function run() {
            const spans = splitToSpans(el, target);
            spans.forEach((s, i) => {
                const finalChar = s.dataset.c;
                if (finalChar === " ") return;
                let count = 0;
                const total = randInt(8, 16);
                s.style.borderBottom = "1px solid rgba(255, 255, 255, 0.25)";
                const t = setInterval(
                    () => {
                        count++;
                        if (count >= total) {
                            s.textContent = finalChar;
                            clearInterval(t);
                        } else s.textContent = CHARS[randInt(0, CHARS.length - 1)];
                    },
                    45 + i * 4,
                );
            });
        }
        stage.addEventListener("specimen:enter", run);
    });

    ["stagger", "blur", "flip", "gravity", "wave", "liquid"].forEach((name) => {
        document.querySelectorAll(`[data-anim="${name}"] .Demo`).forEach((el) => {
            splitToSpans(el, null, 420);
        });
    });

    (function () {
        const el = document.querySelector(".RotatorWord");
        if (!el) return;
        const words = ["Lennouille", "Lenny Gadroy"];
        let idx = 0;
        el.style.display = "inline-block";
        el.style.transition =
            "transform .5s cubic-bezier(.5,0,.2,1), opacity .5s ease";

        function show() {
            el.textContent = words[idx];
            el.style.opacity = 0;
            el.style.transform = "translateY(18px)";
            requestAnimationFrame(() => {
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            });
        }
        show();
        setInterval(() => {
            el.style.opacity = 0;
            el.style.transform = "translateY(-18px)";
            setTimeout(() => {
                idx = (idx + 1) % words.length;
                show();
            }, 400);
        }, 2200);
    })();

    document.querySelectorAll('[data-anim="magnet"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const spans = splitToSpans(el);
        stage.addEventListener("mousemove", (e) => {
            const rect = stage.getBoundingClientRect();
            const mx = e.clientX - rect.left,
                my = e.clientY - rect.top;
            spans.forEach((s) => {
                const r = s.getBoundingClientRect();
                const cx = r.left - rect.left + r.width / 2;
                const cy = r.top - rect.top + r.height / 2;
                const dx = mx - cx,
                    dy = my - cy;
                const dist = Math.max(30, Math.sqrt(dx * dx + dy * dy));
                const pull = Math.min(1, 90 / dist);
                s.style.transform = `translate(${dx * pull * 0.35}px, ${dy * pull * 0.35}px)`;
            });
        });
        stage.addEventListener("mouseleave", () =>
            spans.forEach((s) => (s.style.transform = "")),
        );
    });

    document.querySelectorAll('[data-anim="scrub"]').forEach((stage) => {
        function update() {
            const r = stage.getBoundingClientRect();
            const vh = window.innerHeight;
            let progress = 1 - (r.top + r.height / 2) / (vh + r.height / 2);
            progress = Math.max(0, Math.min(1, progress));
            stage.style.setProperty("--p", (progress * 100).toFixed(1) + "%");
        }
        window.addEventListener("scroll", update, {
            passive: true,
        });
        update();
    });

    document.querySelectorAll('[data-anim="scatter"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const spans = splitToSpans(el);
        stage.addEventListener("mouseenter", () => {
            spans.forEach((s) => {
                s.style.transform = `translate(${rand(-40, 40)}px, ${rand(-30, 30)}px) rotate(${rand(-40, 40)}deg)`;
            });
        });
        stage.addEventListener("mouseleave", () =>
            spans.forEach((s) => (s.style.transform = "")),
        );
    });

    document.querySelectorAll('[data-anim="pressure"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const spans = splitToSpans(el);
        stage.addEventListener("mousemove", (e) => {
            const rect = stage.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            spans.forEach((s) => {
                const r = s.getBoundingClientRect();
                const cx = r.left - rect.left + r.width / 2;
                const dist = Math.abs(mx - cx);
                const wght = Math.max(400, 800 - dist * 4);
                setWeight(s, wght);
            });
        });
        stage.addEventListener("mouseleave", () =>
            spans.forEach((s) => setWeight(s, 400)),
        );
    });

    document.querySelectorAll('[data-anim="distort"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        const spans = splitToSpans(el);
        stage.addEventListener("mousemove", (e) => {
            const rect = stage.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            spans.forEach((s) => {
                const r = s.getBoundingClientRect();
                const cx = r.left - rect.left + r.width / 2;
                const dist = mx - cx;
                const proximity = Math.max(0, 1 - Math.abs(dist) / 120);
                const skew = (dist > 0 ? -1 : 1) * proximity * 18;
                const scale = 1 + proximity * 0.4;
                s.style.transform = `skewX(${skew}deg) scale(${scale})`;
            });
        });
        stage.addEventListener("mouseleave", () =>
            spans.forEach((s) => (s.style.transform = "")),
        );
    });

    document.querySelectorAll('[data-anim="shatter"] .Demo').forEach((el) => {
        const spans = splitToSpans(el);
        spans.forEach((s) => {
            s.style.setProperty("--tx", rand(-120, 120).toFixed(0) + "px");
            s.style.setProperty("--ty", rand(-90, 90).toFixed(0) + "px");
            s.style.setProperty("--tr", rand(-90, 90).toFixed(0) + "deg");
        });
    });

    (function () {
        const el = document.querySelector(".TerminalText");
        if (!el) return;
        const words = ["lenn run build", 'git commit -m "lenn"', "deploy --prod-lenn"];
        let wi = 0;
        el.style.borderRight = "2px solid var(--Primary)";
        el.style.paddingRight = "4px";

        function typeWord(word, cb) {
            let i = 0;
            const t = setInterval(() => {
                el.textContent = word.slice(0, i + 1);
                i++;
                if (i >= word.length) {
                    clearInterval(t);
                    cb();
                }
            }, 60);
        }

        function deleteWord(cb) {
            let text = el.textContent;
            const t = setInterval(() => {
                text = text.slice(0, -1);
                el.textContent = text;
                if (text.length === 0) {
                    clearInterval(t);
                    cb();
                }
            }, 35);
        }

        function loop() {
            typeWord(words[wi], () => {
                setTimeout(() => {
                    deleteWord(() => {
                        wi = (wi + 1) % words.length;
                        setTimeout(loop, 300);
                    });
                }, 1100);
            });
        }
        loop();
    })();

    document.querySelectorAll('[data-anim="matrix"]').forEach((stage) => {
        const canvas = stage.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const word = "Lennouille";
        const fontSize = 22;
        const W = 560;
        const H = 150;
        const BG = "#1c1c1e";
        const targetRow = 3;
        const STEP = 70;
        const cols = Math.floor(W / fontSize);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let drops,
            locked,
            start,
            lastStep,
            settleStart,
            raf;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "700 " + fontSize + "px ui-monospace, monospace";

        function reset() {
            drops = new Array(cols).fill(0).map(() => -randInt(0, 10));
            locked = new Array(cols).fill(null);
            start = lastStep = settleStart = null;
            const startCol = Math.floor((cols - word.length) / 2);
            for (let i = 0; i < word.length; i++) {
                locked[startCol + i] = {
                    char: word[i],
                    row: targetRow,
                    lockAt: 900 + i * 220 + randInt(0, 200),
                    done: false,
                };
            }
        }

        function drawLetter(c, t) {
            ctx.fillStyle = BG;
            ctx.fillRect(c * fontSize, (t.row - 1) * fontSize + 4, fontSize, fontSize + 2);
            ctx.fillStyle = ACCENT;
            ctx.fillText(t.char, c * fontSize + fontSize / 2, t.row * fontSize);
        }

        function drawWord() {
            locked.forEach((t, c) => t && drawLetter(c, t));
        }

        function draw(now) {
            if (start === null) start = lastStep = now;
            const elapsed = now - start;
            const rainActive = settleStart === null;

            ctx.fillStyle = rainActive ? "rgba(28,28,30,0.14)" : "rgba(28,28,30,0.28)";
            ctx.fillRect(0, 0, W, H);

            if (rainActive && now - lastStep >= STEP) {
                lastStep = now;
                let allDone = true;
                for (let c = 0; c < cols; c++) {
                    const t = locked[c];
                    if (t && t.done) continue;
                    if (t) allDone = false;
                    if (t && elapsed >= t.lockAt && drops[c] === t.row) {
                        t.done = true;
                        continue;
                    }
                    const ch = CHARS[randInt(0, CHARS.length - 1)];
                    ctx.fillStyle = "rgba(255,255,255,0.35)";
                    ctx.fillText(ch, c * fontSize + fontSize / 2, drops[c] * fontSize);
                    drops[c]++;
                    if (drops[c] * fontSize > H) drops[c] = 0;
                }
                if (allDone) settleStart = now;
            }

            locked.forEach((t, c) => t && t.done && drawLetter(c, t));

            if (settleStart !== null && now - settleStart > 700) {
                ctx.fillStyle = BG;
                ctx.fillRect(0, 0, W, H);
                drawWord();
                return;
            }
            raf = requestAnimationFrame(draw);
        }

        function run() {
            cancelAnimationFrame(raf);
            reset();
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);
            if (reduceMotion) {
                drawWord();
                return;
            }
            raf = requestAnimationFrame(draw);
        }

        stage.addEventListener("specimen:enter", run);
        stage.addEventListener("specimen:leave", () => cancelAnimationFrame(raf));
    });

    document.querySelectorAll(".MorphWrap").forEach((wrap) => {
        setInterval(() => wrap.classList.toggle("Swap"), 2200);
    });

    document.querySelectorAll('[data-anim="chroma"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");

        function update() {
            const r = stage.getBoundingClientRect();
            const vh = window.innerHeight;
            const center = vh / 2;
            const stageCenter = r.top + r.height / 2;
            const offset = Math.max(
                -1,
                Math.min(1, (stageCenter - center) / (vh / 2)),
            );
            const mag = Math.abs(offset) * 8;
            el.style.textShadow = `${offset * mag}px 0 rgba(229,62,62,.85), ${-offset * mag}px 0 rgba(32,126,222,.95)`;
        }
        window.addEventListener("scroll", update, {
            passive: true,
        });
        update();
    });

    document.querySelectorAll('[data-anim="spotlight"]').forEach((stage) => {
        const el = stage.querySelector(".Demo");
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        let raf = null,
            t0 = 0,
            hover = false;

        function setPos(x, y) {
            el.style.setProperty("--mx", x.toFixed(1) + "px");
            el.style.setProperty("--my", y.toFixed(1) + "px");
            el.style.setProperty("--r", Math.max(70, el.offsetHeight * 1.2) + "px");
        }

        function sweep(ts) {
            if (!t0) t0 = ts;
            const t = ts - t0;
            const w = el.offsetWidth,
                h = el.offsetHeight;
            setPos(
                ((Math.sin(t / 1100 - Math.PI / 2) + 1) / 2) * w,
                h / 2 + Math.sin(t / 700) * h * 0.18,
            );
            raf = requestAnimationFrame(sweep);
        }

        function start() {
            if (!raf && !hover) raf = requestAnimationFrame(sweep);
        }

        function stop() {
            cancelAnimationFrame(raf);
            raf = null;
            t0 = 0;
        }
        stage.addEventListener("pointermove", (e) => {
            hover = true;
            stop();
            const r = el.getBoundingClientRect();
            setPos(e.clientX - r.left, e.clientY - r.top);
        });
        stage.addEventListener("pointerleave", () => {
            hover = false;
            if (stage.classList.contains("In")) start();
        });
        stage.addEventListener("specimen:enter", start);
        stage.addEventListener("specimen:leave", stop);
    });
})();