// ! Functions ! //
// * Header * //
var path = window.location.pathname.split('/').pop() || 'index';

(function () {
    var bar = document.createElement('div');
    bar.className = 'ReadingProgress';
    document.body.prepend(bar);

    function updateProgress() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, {passive: true});
    updateProgress();
})();

function initHamburger() {
    var navbar = document.querySelector('.NavBar');
    var btn = navbar ? navbar.querySelector('.HamburgerBtn') : null;
    var nav = navbar ? navbar.querySelector('.NavMenu') : null;
    if (!navbar || !btn || !nav) return;

    function toggle(force) {
        var open = (force !== undefined) ? force : !nav.classList.contains('open');
        nav.classList.toggle('open', open);
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle();
    });

    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target) && !nav.contains(e.target)) toggle(false);
    });
    nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { toggle(false); });
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth > 950) toggle(false);
    });
}

// * Cursor * //
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

let dot  = null;
let ball = null;

if (isTouchDevice) {
    const _dot  = document.getElementById('CursorDot');
    const _ball = document.getElementById('CursorBall');
    if (_dot)  _dot.style.display  = 'none';
    if (_ball) _ball.style.display = 'none';
} else {
    dot  = document.getElementById('CursorDot');
    ball = document.getElementById('CursorBall');
}

let W = window.innerWidth;
let H = window.innerHeight;

window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
});

const mouse  = {x: W/2, y: H/2};
const dotPos = {x: W/2, y: H/2};
const pos    = {x: W/2, y: H/2};
const speed  = 0.08;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReduced  = reducedMotion.matches;
reducedMotion.addEventListener('change', e => { prefersReduced = e.matches; });

if (!isTouchDevice) {

const rootStyles = getComputedStyle(document.documentElement);
const bgVarRaw = rootStyles.getPropertyValue('--Background').trim();

function resolveColorToRGB(cssValue) {
    const tmp = document.createElement('div');
    tmp.style.cssText = `position:absolute;width:0;height:0;background:${cssValue}`;
    document.body.appendChild(tmp);
    const computed = getComputedStyle(tmp).backgroundColor;
    document.body.removeChild(tmp);
    return computed;
}

const bgVarResolved = bgVarRaw ? resolveColorToRGB(bgVarRaw) : null;
const whiteResolved = resolveColorToRGB('white');

function parseRGB(str) {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
}

const bgVarRGB = bgVarResolved ? parseRGB(bgVarResolved) : null;
const whiteRGB = parseRGB(whiteResolved);

function isLightTarget(rgb) {
    if (!rgb) return false;
    // Luminance perçue : le curseur passe en noir sur fond clair, en blanc sur fond sombre ou coloré
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) > 150;
}

function getEffectiveBgRGB(x, y) {
    const elements = document.elementsFromPoint(x, y).filter(el => el !== dot && el !== ball);
    for (const el of elements) {
        const bg = getComputedStyle(el).backgroundColor;
        const rgb = parseRGB(bg);
        if (!rgb) continue;
        const alphaMatch = bg.match(/rgba?\(\d+,\s*\d+,\s*\d+,?\s*([\d.]+)?/);
        const alpha = alphaMatch?.[1] !== undefined ? +alphaMatch[1] : 1;
        if (alpha === 0) continue;
        return rgb;
    }
    return null;
}

let lightMode = false;

function applyTheme(light) {
    if (light === lightMode) return;
    lightMode = light;
    dot.style.background = light ? '#000' : '#fff';
    ball.style.borderColor = light ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
    if (cursorState === 'text') {ball.style.background = light ? '#000' : '#fff';}
}

let cursorState = 'default';
let isHovering = false;
let isClicking = false;
let isDragging = false;

function applyCursorState() {
    let newState = 'default';
    if (isDragging) newState = 'drag';
    else if (isClicking) newState = 'click';
    else if (isHovering) newState = 'hover';
    if (newState === cursorState) return;

    cursorState = newState;
    const fg = lightMode ? '#000' : '#fff';
    const border = lightMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
    
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.opacity = '1';
    ball.style.width = '28px';
    ball.style.height = '28px';
    ball.style.borderRadius = '50%';
    ball.style.border = `1.5px solid ${border}`;
    ball.style.background = 'transparent';
    ball.style.opacity = '1';

    switch (newState) {
        case 'hover':
            ball.style.width = '52px';
            ball.style.height = '52px';
            dot.style.width = '4px';
            dot.style.height = '4px';
            break;

        case 'click':

            ball.style.width = '18px';
            ball.style.height = '18px';
            dot.style.width = '10px';
            dot.style.height = '10px';
            break;

        case 'drag':
            ball.style.width = '56px';
            ball.style.height = '56px';
            ball.style.opacity = '0.7';
            dot.style.width = '4px';
            dot.style.height = '4px';
            break;
    }
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (isClicking && !isDragging) {
        isDragging = true;
        applyCursorState();
    }
});

document.addEventListener('mousedown', () => {
    isClicking = true;
    isDragging = false;
    applyCursorState();
});

document.addEventListener('mouseup', () => {
    isClicking = false;
    isDragging = false;
    applyCursorState();
});

document.querySelectorAll('.CursorHover').forEach(el => {
    el.addEventListener('mouseenter', () => {
        isHovering = true;
        applyCursorState();
    });
    
    el.addEventListener('mouseleave', () => {
        isHovering = false;
        applyCursorState();
    });
});

let last = performance.now();
let frameCount = 0;
let rafId = null;

function loop(now) {
    const dt = Math.min(now - last, 50);
    last = now;

    const delta = dt * (60 / 1000);
    const lerpT = 1.0 - Math.pow(1.0 - speed, delta);

    if (prefersReduced) {
        pos.x = mouse.x;
        pos.y = mouse.y;
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
    } else {
        pos.x += (mouse.x - pos.x) * lerpT;
        pos.y += (mouse.y - pos.y) * lerpT;

        dotPos.x += (mouse.x - dotPos.x) * 0.85;
        dotPos.y += (mouse.y - dotPos.y) * 0.85;
    }

    dot.style.left = Math.round(dotPos.x) + 'px';
    dot.style.top = Math.round(dotPos.y) + 'px';
    ball.style.left = Math.round(pos.x) + 'px';
    ball.style.top = Math.round(pos.y) + 'px';

    if (frameCount++ % 3 === 0) {
        const mx = Math.round(mouse.x);
        const my = Math.round(mouse.y);
        const topEl = document.elementsFromPoint(mx, my).find(el => el !== dot && el !== ball);
        if (topEl && topEl.closest('.Card, .ChoiceCard, .Input')) {
            applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
        } else {
            const bgRGB = getEffectiveBgRGB(mx, my);
            applyTheme(bgRGB ? isLightTarget(bgRGB) : (bgVarRGB ? isLightTarget(bgVarRGB) : false));
        }
    }

    rafId = requestAnimationFrame(loop);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = null;
    } else {
        last  = performance.now();
        rafId = requestAnimationFrame(loop);
    }
});
rafId = requestAnimationFrame(loop);
}

// * Tab title * //
const originalTitle = document.title;
const tabHiddenMessages = [
    "On t'attend...",
    "Ne pars pas !",
    "Reviens vite 👀",
    "Tu me manques déjà",
    "Vous nous manquez déjà :(",
    "Oups, tu as cliqué à côté",
    "Garde le fil de ta visite",
    "La visite continue ici",
    "Ne perds pas ta progression",
    "Le design t'attend ici",
    "Tu me trompes avec un autre onglet ?",
    "L'autre site est moche de toute façon.",
    "Reviens, j'ai des cookies 🍪",
    "Allo ? Il y a quelqu'un ?",
    "Je sais où tu cliques. (terrifiant, pas vrai ?)",
    "Tes clics me manque...",
    "Tu as oublié de sauvegarder ton travail.",
    "L'autre site a une mauvaise UX.",
    "Onglet abandonné cherche curseur.",
    "Je vais tout balancer au client.",
    "Ta session reste active.",
    "Ta page reste ouverte.",
    "Reprends ton activité.",
    "Ta fenêtre reste disponible.",
    "Ne perds pas ta page.",
    "Ton espace est toujours là.",
    "Ton curseur a laissé une trace.",
    "Ta souris s'est enfuie..",
    "Tu as pris des congés ?",
];

const TAB_TITLE_SUFFIX = " — Lennouille UI / UX Designer";

function getTabHiddenMessage() {
    const stored = sessionStorage.getItem("tabHiddenMessage");
    if (stored) return stored;

    const randomMessage = tabHiddenMessages[Math.floor(Math.random() * tabHiddenMessages.length)];
    sessionStorage.setItem("tabHiddenMessage", randomMessage);
    return randomMessage;
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.title = getTabHiddenMessage() + TAB_TITLE_SUFFIX;
    } else {
        document.title = originalTitle;
    }
});

// * Reals * //
document.querySelectorAll('.FolderCard').forEach((card) => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        card.classList.toggle('Open');
    });
    card.addEventListener('keydown', (e) => {
        if (e.target !== card) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('Open');
        }
    });
});

// * Form * //
const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

function toggleValueClass(event) {
  const el = event.target;
  if (el.value.trim().length > 0) {el.classList.add('has-value');}
  else {el.classList.remove('has-value');}
}

inputs.forEach(input => {
  input.addEventListener('input', toggleValueClass);
  if (input.value.trim().length > 0) {
    input.classList.add('has-value');
  }
});

// * Terms * //
document.addEventListener('DOMContentLoaded', function () {if (typeof initHamburger === 'function') initHamburger();});
(function () {
    var sections = document.querySelectorAll('.TermsArticle[id]');
    var navLinks = document.querySelectorAll('.Nav a');

    function onScroll() {
        var current = '';
        sections.forEach(function (section) {
            if (section.getBoundingClientRect().top <= 120) {current = section.getAttribute('id');}
        });

        navLinks.forEach(function (link) {link.classList.toggle('active', link.getAttribute('href') === '#' + current);});
    }

window.addEventListener('scroll', onScroll, {passive: true});onScroll();})();

document.querySelectorAll('.Nav a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - 96;
            window.scrollTo({top: top, behavior: 'smooth'});
        }
    });
});

// ! Animations ! //
// * Hero * //
let select    = e => document.querySelector(e);
let selectAll = e => document.querySelectorAll(e);

let split     = [[], [], []];
let splitSpan = [[], [], []];
let stagger   = 0.04;

window.addEventListener("load", () => {
    gsap.set("section", {autoAlpha: 1});

    const heroSection = select(".Hero");
    // Pas de hero / de .SubText sur cette page (ex. /ux) : on ne lance pas l'animation
    if (!heroSection || !selectAll(".SubText").length) return;

    gsap.set(heroSection, { "--Rotation": "120deg", transformOrigin: "50% 50%" });
    gsap.set(heroSection, { "--Thickness": "8px", "--Border": "8px", "--Gap": "30px" });

    gsap.set("#SubT1", {x: -600, opacity: 0});
    gsap.set("#SubT2", {x:  600, opacity: 0});

    selectAll(".SubText").forEach((textDiv, i) => {
        let spans = textDiv.querySelectorAll("span");
        split[i].push(spans);
        split[i].forEach(span => {
            let st = new SplitText(span, { type: "chars" });
            gsap.set(st.chars, { opacity: 0 });
            splitSpan[i].push(st);
        });
    });

    function callWriteText() {
        writeText(0, 0);
        writeText(1, 0);

        function writeText(i, j) {
            if (j >= 200) return;
            stagger = (i === 0) ? -0.04 : 0.04;

            let splitText = splitSpan[i][j];
            if (!splitText) return;
            gsap.timeline({
                defaults: { repeatDelay: 0 },
                onComplete: () => {if (split[i][j + 1]) writeText(i, j + 1);}
            }).to(splitText.chars, {opacity: 1, stagger});
        }
    }

    gsap.timeline({defaults: {ease: "elastic.inOut(1.6,0.6,1.3,1)"}})
        .delay(0.25)

        .to("#SubT1", {duration: 2.5, x: 0, opacity: 1})
        .to("#SubT2", {duration: 2.5, x: 0, opacity: 1}, "<")

        .to(heroSection, {duration: 2,   "--Rotation": "-60deg", transformOrigin: "50% 50%"}, 1.5)
        .to(heroSection, {duration: 0.5, "--Thickness": "20px", "--Border": "10px", "--Gap": "52px"}, 2.3)

        .add(() => callWriteText(), 2.5);
});

// * Scroll * //
const textElement = document.getElementById('TextReveal');

if (textElement) {
	const textContent = textElement.innerText;
	textElement.innerHTML = textContent.split(' ').map(Word => {
		return `<span class="Word">${Word}</span>`;
	}).join(' ');
}

const Words = document.querySelectorAll('.Word');
const Scroll = document.getElementById('Scroll');

function handleScroll() {
  	if (!Scroll || Words.length === 0) return;

  	const ScrollTop = Scroll.getBoundingClientRect().top;
  	const windowHeight = window.innerHeight;
  	const scrollableHeight = Scroll.offsetHeight - windowHeight;

  	let percentage = -ScrollTop / scrollableHeight; percentage = Math.max(0, Math.min(1, percentage));

  	const WordsToReveal = Math.floor(percentage * Words.length);
  	Words.forEach((Word, index) => {
	    if (index < WordsToReveal) {Word.classList.add('Revealed');}
		else {Word.classList.remove('Revealed');}
  	});
}

window.addEventListener('scroll', handleScroll);
handleScroll();

// * Posts * //
(function () {
    const grid = document.getElementById("LatestPostsGrid");
    if (!grid || !window.LennouilleBlog) return;

    const latest = window.LennouilleBlog.posts.slice(0, 3);
    grid.innerHTML = latest
        .map(function (post) { return window.LennouilleBlog.cardHTML(post, false); })
        .join("");
})();

// * Comparaisons * //
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".Comparaisons").forEach(function (wrap) {
        var overlay = wrap.querySelector(".Overlay");
        var slider = wrap.querySelector(".Slider");
        var oldImg = wrap.querySelector(".OldImage");
        var dragging = false;

        function syncWidth() {if (oldImg) oldImg.style.width = wrap.offsetWidth + "px";}
        function move(e) {
            if (!dragging) return;
            var rect = wrap.getBoundingClientRect();
            var x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - rect.left;
            x = Math.max(0, Math.min(x, wrap.offsetWidth));
            overlay.style.width = x + "px";
            slider.style.left = x + "px";
        }

        window.addEventListener("resize", syncWidth);
        syncWidth();

        if (!slider) return;
        slider.addEventListener("mousedown", function (e) {
            e.preventDefault();
            dragging = true;
        });

        slider.addEventListener("touchstart", function (e) {
            e.preventDefault();
            dragging = true;
        }, {
            passive: false
        });

        window.addEventListener("mouseup", function () {dragging = false;});
        window.addEventListener("touchend", function () {dragging = false;});
        window.addEventListener("mousemove", move);
        window.addEventListener("touchmove", move, {
            passive: false
        });
    });
});

// * Lois UX : filtre + recherche * //
(function () {
    const grid  = document.getElementById("grid");
    const input = document.getElementById("search");
    if (!grid || !input) return;

    const cards = Array.from(grid.querySelectorAll(".LawCard"));
    const tabs  = document.querySelectorAll(".Tabs .Tab");
    const empty = document.getElementById("LawsEmpty");

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
        cards.forEach(function (card) { io.observe(card); });
    } else {
        cards.forEach(function (card) { card.classList.add("in-view"); });
    }
    const norm  = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let cat = "all";

    function apply() {
        const q = norm(input.value.trim());
        let shown = 0;
        cards.forEach(card => {
            const ok = (cat === "all" || card.dataset.cat === cat) &&
                       (!q || norm(card.dataset.search).includes(q));
            card.style.display = ok ? "" : "none";
            if (ok) shown++;
        });
        if (empty) empty.style.display = shown ? "none" : "block";
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    tabs.forEach(tab => tab.addEventListener("click", () => {
        cat = tab.dataset.cat;
        tabs.forEach(t => {
            const on = t === tab;
            t.classList.toggle("active", on);
            t.setAttribute("aria-pressed", on);
        });
        apply();
    }));

    input.addEventListener("input", apply);
})();


// * Theme (Light / Dark) * //
(function () {
    var root = document.documentElement;
    var KEY = 'theme';
    var META_COLORS = {light: '#1c1c1e', dark: '#121214'};
    var toggles = document.querySelectorAll('[data-theme-toggle]');
    var flashTimer = null;

    function stored() {
        try {
            var v = localStorage.getItem(KEY);
            return (v === 'light' || v === 'dark') ? v : null;
        } catch (e) {return null;}
    }

    function current() {return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';}

    function paint(theme) {
        root.setAttribute('data-theme', theme);
        toggles.forEach(function (btn) {btn.setAttribute('aria-checked', String(theme === 'dark'));});
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', META_COLORS[theme]);
    }

    function setTheme(theme, persist) {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            root.classList.add('ThemeSwitching');
            clearTimeout(flashTimer);
            flashTimer = setTimeout(function () {root.classList.remove('ThemeSwitching');}, 400);
        }
        paint(theme);
        if (persist) {
            try {localStorage.setItem(KEY, theme);} catch (e) {}
        }
    }

    paint(current());

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setTheme(current() === 'dark' ? 'light' : 'dark', true);
        });
    });

    // Tant que le visiteur n'a rien choisi, on suit le thème de son système
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function (e) {if (!stored()) setTheme(e.matches ? 'dark' : 'light', false);};
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);

    // Synchronisation entre onglets
    window.addEventListener('storage', function (e) {
        if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) paint(e.newValue);
    });
})();

// * Search * //
(function () {
    var overlay = document.getElementById('SearchOverlay');
    var input = document.getElementById('SearchInput');
    var list = document.getElementById('SearchResults');
    var statusEl = document.getElementById('SearchStatus');
    var labelEl = document.getElementById('SearchLabel');
    if (!overlay || !input || !list) return;

    var root = document.documentElement;
    var openers = document.querySelectorAll('[data-search-open]');
    var MAX_RESULTS = 8;
    var SUGGESTED = ['/services', '/reals', '/blog', '/ux', '/about', '/contact'];

    var index = null;
    var indexPromise = null;
    var items = [];
    var active = -1;
    var lastFocus = null;

    // Normalisation 1:1 (sans accents, minuscules) : les positions restent alignées avec le texte d'origine
    function foldChar(c) {
        if (c === '’' || c === '‘') return "'";
        var d = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return d.length === 1 ? d : (c.toLowerCase().length === 1 ? c.toLowerCase() : c);
    }
    function fold(str) {
        var out = '';
        for (var i = 0; i < str.length; i++) out += foldChar(str.charAt(i));
        return out;
    }

    function loadIndex() {
        if (index) return Promise.resolve(index);
        if (!indexPromise) {
            indexPromise = fetch('/search.json', {headers: {'Accept': 'application/json'}})
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then(function (data) {
                    index = data.map(function (e) {
                        e._t = fold(e.t || '');
                        e._d = fold(e.d || '');
                        e._k = fold(e.k || '');
                        e._y = fold(e.y || '');
                        return e;
                    });
                    return index;
                })
                .catch(function (err) {
                    indexPromise = null;
                    throw err;
                });
        }
        return indexPromise;
    }

    function wordStart(hay, token) {
        var i = hay.indexOf(token);
        while (i !== -1) {
            if (i === 0 || /[^a-z0-9]/.test(hay.charAt(i - 1))) return true;
            i = hay.indexOf(token, i + 1);
        }
        return false;
    }

    function score(entry, tokens, phrase) {
        var total = 0;
        for (var i = 0; i < tokens.length; i++) {
            var t = tokens[i];
            var s = 0;
            if (entry._t.indexOf(t) !== -1) s = wordStart(entry._t, t) ? 60 : 35;
            if (entry._k.indexOf(t) !== -1) s = Math.max(s, wordStart(entry._k, t) ? 26 : 18);
            if (entry._y.indexOf(t) !== -1) s = Math.max(s, 14);
            if (entry._d.indexOf(t) !== -1) s = Math.max(s, wordStart(entry._d, t) ? 12 : 8);
            if (!s) return 0;
            total += s;
        }
        if (entry._t.indexOf(phrase) === 0) total += 40;
        else if (entry._t.indexOf(phrase) !== -1) total += 20;
        return total;
    }

    function run(query) {
        var phrase = fold(query).trim();
        var tokens = phrase.split(/\s+/).filter(Boolean);
        if (!tokens.length) return [];
        var res = [];
        for (var i = 0; i < index.length; i++) {
            var s = score(index[i], tokens, phrase);
            if (s) res.push({entry: index[i], score: s, order: i});
        }
        res.sort(function (a, b) {return (b.score - a.score) || (a.order - b.order);});
        return res.slice(0, MAX_RESULTS).map(function (r) {return r.entry;});
    }

    // Surlignage (insensible aux accents) construit sans innerHTML
    function highlight(text, tokens) {
        var frag = document.createDocumentFragment();
        var folded = fold(text);
        var marks = new Array(text.length);
        var any = false;
        tokens.forEach(function (t) {
            if (!t) return;
            var i = folded.indexOf(t);
            while (i !== -1) {
                for (var k = i; k < i + t.length; k++) marks[k] = true;
                any = true;
                i = folded.indexOf(t, i + t.length);
            }
        });
        if (!any) {frag.appendChild(document.createTextNode(text)); return frag;}
        var i = 0;
        while (i < text.length) {
            var on = !!marks[i];
            var j = i;
            while (j < text.length && !!marks[j] === on) j++;
            var chunk = text.slice(i, j);
            if (on) {
                var m = document.createElement('mark');
                m.textContent = chunk;
                frag.appendChild(m);
            } else {
                frag.appendChild(document.createTextNode(chunk));
            }
            i = j;
        }
        return frag;
    }

    function snippet(desc, tokens) {
        if (!desc) return '';
        if (desc.length <= 150) return desc;
        var folded = fold(desc);
        var first = -1;
        tokens.forEach(function (t) {
            var i = folded.indexOf(t);
            if (i !== -1 && (first === -1 || i < first)) first = i;
        });
        if (first < 100) return desc.slice(0, 150).replace(/\s+\S*$/, '') + '…';
        var start = Math.max(0, first - 50);
        return '…' + desc.slice(start, start + 150).replace(/^\S*\s+/, '').replace(/\s+\S*$/, '') + '…';
    }

    function clear() {
        list.textContent = '';
        items = [];
        active = -1;
        input.removeAttribute('aria-activedescendant');
    }

    function setStatus(html, visible) {
        statusEl.className = 'SearchStatus' + (visible ? '' : ' Sr');
        statusEl.textContent = '';
        if (typeof html === 'string') {statusEl.textContent = html;}
        else if (html) {statusEl.appendChild(html);}
    }

    function setLabel(text) {
        labelEl.hidden = !text;
        labelEl.textContent = text || '';
    }

    function buildItem(entry, tokens, i) {
        var li = document.createElement('li');
        li.setAttribute('role', 'presentation');
        var a = document.createElement('a');
        a.className = 'SearchItem CursorHover';
        a.href = entry.u;
        a.id = 'SearchItem' + i;
        a.setAttribute('role', 'option');
        a.setAttribute('aria-selected', 'false');
        a.tabIndex = -1;

        var title = document.createElement('span');
        title.className = 'SearchTitle';
        title.appendChild(highlight(entry.t, tokens));
        var type = document.createElement('span');
        type.className = 'SearchType';
        type.textContent = entry.y;
        a.appendChild(title);
        a.appendChild(type);

        var d = snippet(entry.d, tokens);
        if (d) {
            var desc = document.createElement('span');
            desc.className = 'SearchDesc';
            desc.appendChild(highlight(d, tokens));
            a.appendChild(desc);
        }

        a.addEventListener('mousemove', function () {if (active !== i) setActive(i, false);});
        li.appendChild(a);
        return li;
    }

    function setActive(i, scroll) {
        if (items[active]) {
            items[active].classList.remove('Active');
            items[active].setAttribute('aria-selected', 'false');
        }
        active = i;
        if (items[active]) {
            items[active].classList.add('Active');
            items[active].setAttribute('aria-selected', 'true');
            input.setAttribute('aria-activedescendant', items[active].id);
            if (scroll) items[active].scrollIntoView({block: 'nearest'});
        } else {
            input.removeAttribute('aria-activedescendant');
        }
    }

    function render() {
        clear();
        var q = input.value.trim();

        if (!index) {
            setLabel('');
            setStatus('Chargement de la recherche…', true);
            return;
        }

        var results, tokens = [];
        if (!q) {
            results = SUGGESTED.map(function (u) {
                return index.filter(function (e) {return e.u === u;})[0];
            }).filter(Boolean);
            setLabel(results.length ? 'Pages populaires' : '');
            setStatus('', false);
        } else {
            tokens = fold(q).split(/\s+/).filter(Boolean);
            results = run(q);
            setLabel(results.length ? (results.length + (results.length > 1 ? ' résultats' : ' résultat')) : '');
        }

        if (!results.length) {
            if (q) {
                var wrap = document.createDocumentFragment();
                var strong = document.createElement('strong');
                strong.textContent = '« ' + q + ' »';
                wrap.appendChild(document.createTextNode('Aucun résultat pour '));
                wrap.appendChild(strong);
                wrap.appendChild(document.createElement('br'));
                wrap.appendChild(document.createTextNode('Essayez un autre mot-clé, ou '));
                var a = document.createElement('a');
                a.href = '/contact';
                a.textContent = 'posez-moi la question';
                wrap.appendChild(a);
                wrap.appendChild(document.createTextNode('.'));
                setStatus(wrap, true);
            }
            return;
        }

        results.forEach(function (entry, i) {
            var li = buildItem(entry, tokens, i);
            list.appendChild(li);
            items.push(li.firstChild);
        });
        if (q) setStatus(results.length + (results.length > 1 ? ' résultats trouvés' : ' résultat trouvé'), false);
        setActive(0, false);
    }

    function open() {
        if (!overlay.hidden) return;
        lastFocus = document.activeElement;

        var menu = document.querySelector('.NavMenu.open');
        if (menu) {
            menu.classList.remove('open');
            var burger = document.querySelector('.HamburgerBtn.open');
            if (burger) {burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');}
        }

        overlay.hidden = false;
        root.classList.add('SearchOpen');
        openers.forEach(function (b) {b.setAttribute('aria-expanded', 'true');});
        render();
        input.focus();
        input.select();
        loadIndex().then(render).catch(function () {
            clear();
            setLabel('');
            setStatus('La recherche est momentanément indisponible. Réessayez dans un instant.', true);
        });
    }

    function close() {
        if (overlay.hidden) return;
        overlay.hidden = true;
        root.classList.remove('SearchOpen');
        openers.forEach(function (b) {b.setAttribute('aria-expanded', 'false');});
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function go(newTab) {
        var el = items[active] || items[0];
        if (!el) return;
        if (newTab) {window.open(el.href, '_blank', 'noopener');}
        else {window.location.href = el.href;}
    }

    openers.forEach(function (b) {
        b.addEventListener('click', open);
        b.addEventListener('mouseenter', function () {loadIndex().catch(function () {});}, {once: true});
        b.addEventListener('focus', function () {loadIndex().catch(function () {});}, {once: true});
    });
    overlay.querySelectorAll('[data-search-close]').forEach(function (el) {el.addEventListener('click', close);});
    input.addEventListener('input', render);

    overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {e.preventDefault(); close(); return;}
        if (e.key === 'ArrowDown' && items.length) {e.preventDefault(); setActive((active + 1) % items.length, true); return;}
        if (e.key === 'ArrowUp' && items.length) {e.preventDefault(); setActive((active - 1 + items.length) % items.length, true); return;}
        if (e.key === 'Enter' && e.target === input) {e.preventDefault(); go(e.ctrlKey || e.metaKey); return;}
        if (e.key === 'Tab') {
            var focusables = [input, overlay.querySelector('.SearchClose')];
            var idx = focusables.indexOf(document.activeElement);
            if (e.shiftKey && idx <= 0) {e.preventDefault(); focusables[focusables.length - 1].focus();}
            else if (!e.shiftKey && idx === focusables.length - 1) {e.preventDefault(); focusables[0].focus();}
        }
    });

    overlay.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a.SearchItem') : null;
        if (a && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            var url = new URL(a.href, window.location.href);
            if (url.pathname === window.location.pathname) close();
        }
    });

    document.addEventListener('keydown', function (e) {
        var isK = (e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey) && !e.altKey;
        if (isK) {
            e.preventDefault();
            if (overlay.hidden) open(); else close();
            return;
        }
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && overlay.hidden) {
            var t = e.target;
            var typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
            if (!typing) {e.preventDefault(); open();}
        }
    });
})();


// * Pages villes : compteurs des chiffres clés * //
(function () {
    var nodes = document.querySelectorAll('[data-counter]');
    if (!nodes.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // « +50 % », « 88 h », « 160+ » : un seul nombre, sinon (« 4 + 4 », « 2.28 → 11.84 ») on n'anime pas
    function parse(text) {
        var m = text.trim().match(/^([+\-−]?\s?)(\d+(?:[.,]\d+)?)(.*)$/);
        if (!m || /\d/.test(m[3])) return null;
        return {prefix: m[1], number: parseFloat(m[2].replace(',', '.')), decimals: (m[2].split(/[.,]/)[1] || '').length, suffix: m[3]};
    }

    function format(p, value) {
        return p.prefix + value.toFixed(p.decimals).replace('.', ',') + p.suffix;
    }

    function run(el, p) {
        var start = null, duration = 1200;
        function step(ts) {
            if (start === null) start = ts;
            var t = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = format(p, p.number * eased);
            if (t < 1) requestAnimationFrame(step); else el.textContent = el.dataset.final;
        }
        requestAnimationFrame(step);
    }

    var targets = [];
    nodes.forEach(function (el) {
        var p = parse(el.textContent);
        if (!p) return;
        el.dataset.final = el.textContent;
        el.setAttribute('aria-label', el.textContent);
        targets.push({el: el, p: p});
    });
    if (reduce || !('IntersectionObserver' in window)) return;

    targets.forEach(function (t) {t.el.textContent = format(t.p, 0);});
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            var t = targets.filter(function (x) {return x.el === entry.target;})[0];
            if (t) run(t.el, t.p);
        });
    }, {threshold: 0.6});
    targets.forEach(function (t) {io.observe(t.el);});
})();

// * Pages villes : FAQ animée, une seule réponse ouverte à la fois * //
(function () {
    var items = document.querySelectorAll('.CityFAQ details');
    if (!items.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

    items.forEach(function (det) {
        var summary = det.querySelector('summary');
        if (!summary || det.querySelector('.FAQBody')) return;
        var body = document.createElement('div');
        body.className = 'FAQBody';
        while (summary.nextSibling) body.appendChild(summary.nextSibling);
        det.appendChild(body);
    });

    function animate(det, opening) {
        var body = det.querySelector('.FAQBody');
        if (det._anim) det._anim.cancel();
        det._closing = !opening;
        if (reduce) {det.open = opening; det._closing = false; return;}
        if (opening) {
            det.open = true;
            var h = body.offsetHeight;
            det._anim = body.animate([{height: '0px', opacity: 0}, {height: h + 'px', opacity: 1}], {duration: 320, easing: EASE});
            det._anim.onfinish = function () {det._anim = null;};
        } else {
            var h0 = body.offsetHeight;
            det._anim = body.animate([{height: h0 + 'px', opacity: 1}, {height: '0px', opacity: 0}], {duration: 260, easing: EASE});
            det._anim.onfinish = function () {det.open = false; det._closing = false; det._anim = null;};
        }
    }

    items.forEach(function (det) {
        det.querySelector('summary').addEventListener('click', function (e) {
            e.preventDefault();
            if (det.open && !det._closing) {
                animate(det, false);
                return;
            }
            items.forEach(function (other) {if (other !== det && other.open && !other._closing) animate(other, false);});
            animate(det, true);
        });
    });
})();

// * Page /villes : survol/focus synchronisé entre la carte et la liste * //
(function () {
    var hub = document.querySelector('.CitiesMap');
    if (!hub) return;
    var items = hub.querySelectorAll('[data-city]');
    function toggle(city, on) {
        items.forEach(function (el) {
            if (el.getAttribute('data-city') === city) el.classList.toggle('Active', on);
        });
    }
    items.forEach(function (el) {
        var city = el.getAttribute('data-city');
        ['mouseenter', 'focus'].forEach(function (ev) {el.addEventListener(ev, function () {toggle(city, true);}, true);});
        ['mouseleave', 'blur'].forEach(function (ev) {el.addEventListener(ev, function () {toggle(city, false);}, true);});
    });
})();
