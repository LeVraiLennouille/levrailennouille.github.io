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
        document.documentElement.classList.toggle('MenuOpen', open);
        var label = btn.querySelector('.HamburgerLabel');
        if (label) label.textContent = open ? 'Fermer' : 'Menu';
        btn.setAttribute('aria-label', open ? 'Fermer le menu navigation' : 'Ouvrir le menu navigation');
    }

    document.addEventListener('keydown', function (e) {if (e.key === 'Escape' && nav.classList.contains('open')) {toggle(false); btn.focus();}});

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
(function () {
    var root = document.documentElement;
    var hero = document.querySelector('main.Index section.Hero');
    if (!hero) return;

    function done() {root.classList.remove('HeroAnim');}
    if (typeof gsap === 'undefined' || !root.classList.contains('HeroAnim')) {done(); return;}
    setTimeout(done, 5000);

    var wipes = hero.querySelectorAll('.Wipe');
    var tl = gsap.timeline({defaults: {ease: 'power3.out'}, delay: 0.15, onComplete: done});

    tl.from('.HeroBrand', {autoAlpha: 0, y: -14, duration: 0.6, clearProps: 'all'}, 0)
      .from('.HeroMark path', {strokeDashoffset: 1, duration: 1.1, stagger: 0.06, ease: 'power2.inOut', clearProps: 'strokeDashoffset'}, 0.2)
      .from('.HeroMark img', {autoAlpha: 0, scale: 0.86, rotate: -6, duration: 0.9, ease: 'back.out(1.6)', clearProps: 'all'}, 1.0)
      .from('.HeroTags li', {autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.1, clearProps: 'all'}, 1.1);

    wipes.forEach(function (el, i) {
        tl.call(function () {el.classList.add('On');}, null, 0.35 + i * 0.3);
    });
})();

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
    var META_COLORS = {light: '#1c1c1e', dark: '#1c1c1e'}; // la barre du haut (NavBar) est toujours sombre
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

// * Galerie : carrousel * //
(function () {
    document.querySelectorAll('[data-gallery-carousel]').forEach(function (card) {
        var track = card.querySelector('.Slides');
        var prev = card.querySelector('[data-gallery-prev]');
        var next = card.querySelector('[data-gallery-next]');
        if (!track || !prev || !next) return;

        function update() {
            var max = track.scrollWidth - track.clientWidth - 2;
            prev.disabled = track.scrollLeft <= 2;
            next.disabled = track.scrollLeft >= max;
        }
        function go(dir) {track.scrollBy({left: dir * track.clientWidth});}

        prev.addEventListener('click', function () {go(-1);});
        next.addEventListener('click', function () {go(1);});
        track.addEventListener('scroll', update, {passive: true});
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {e.preventDefault(); go(1);}
            if (e.key === 'ArrowLeft') {e.preventDefault(); go(-1);}
        });
        window.addEventListener('resize', update);
        update();
    });
})();

// * Réalisations : slider centré, défilement automatique toutes les 5 s * //
(function () {
    document.querySelectorAll('[data-showcase]').forEach(function (root) {
        var slides = [].slice.call(root.querySelectorAll('.ProjectCard'));
        var dots = [].slice.call(root.querySelectorAll('.ShowcaseDot'));
        var pauseBtn = root.querySelector('.ShowcasePause');
        var n = slides.length;
        if (n < 2) return;

        var active = 0, userPaused = false, away = false, hovered = false, focused = false;
        var prevOff = [];
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) userPaused = true; // pas de défilement automatique si l'utilisateur a demandé moins d'animations

        function offset(i) {
            var d = ((i - active) % n + n) % n;
            if (d > n / 2) d -= n;
            return d;
        }

        function layout(first) {
            slides.forEach(function (s, i) {
                var o = offset(i);
                var jump = !first && Math.abs(o - prevOff[i]) > 1; // carte qui passe d'un bord à l'autre : sans animation
                if (jump) s.style.transition = 'none';
                s.style.setProperty('--off', o);
                if (jump) {void s.offsetWidth; s.style.transition = '';}
                prevOff[i] = o;
                s.classList.toggle('IsActive', o === 0);
                s.tabIndex = o === 0 ? 0 : -1;
                if (Math.abs(o) > 1) s.setAttribute('aria-hidden', 'true'); else s.removeAttribute('aria-hidden');
            });
        }

        function restartProgress() {
            dots.forEach(function (d, i) {
                d.classList.remove('Active');
                d.setAttribute('aria-current', 'false');
            });
            void root.offsetWidth; // relance l'animation de la barre (5 s)
            if (dots[active]) {
                dots[active].classList.add('Active');
                dots[active].setAttribute('aria-current', 'true');
            }
        }

        function syncPause() {
            root.classList.toggle('UserPaused', userPaused);
            root.classList.toggle('IsPaused', userPaused || away || hovered || focused);
            if (pauseBtn) {
                pauseBtn.setAttribute('aria-pressed', String(userPaused));
                pauseBtn.setAttribute('aria-label', userPaused ? 'Reprendre le défilement automatique' : 'Mettre le défilement automatique en pause');
            }
        }

        function goTo(i) {
            active = ((i % n) + n) % n;
            layout(false);
            restartProgress();
        }

        // la barre de progression pilote le minuteur : quand elle atteint 100 %, on passe à la réalisation suivante
        root.addEventListener('animationend', function (e) {
            if (e.animationName === 'ShowcaseFill') goTo(active + 1);
        });

        slides.forEach(function (s, i) {
            s.addEventListener('click', function (e) {
                if (!s.classList.contains('IsActive')) {e.preventDefault(); goTo(i);}
            });
        });
        dots.forEach(function (d, i) {d.addEventListener('click', function () {goTo(i);});});

        if (pauseBtn) pauseBtn.addEventListener('click', function () {userPaused = !userPaused; syncPause();});

        var viewport = root.querySelector('.ShowcaseViewport');
        viewport.addEventListener('mouseenter', function () {hovered = true; syncPause();});
        viewport.addEventListener('mouseleave', function () {hovered = false; syncPause();});
        root.addEventListener('focusin', function () {focused = true; syncPause();});
        root.addEventListener('focusout', function () {focused = false; syncPause();});
        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {goTo(active + 1);}
            if (e.key === 'ArrowLeft') {goTo(active - 1);}
        });

        // balayage tactile
        var startX = null;
        viewport.addEventListener('touchstart', function (e) {startX = e.touches[0].clientX;}, {passive: true});
        viewport.addEventListener('touchend', function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) goTo(active + (dx < 0 ? 1 : -1));
            startX = null;
        });

        // pause hors écran / onglet masqué
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {away = !entries[0].isIntersecting; syncPause();}, {threshold: 0.2}).observe(root);
        }
        document.addEventListener('visibilitychange', function () {away = document.hidden; syncPause();});

        root.classList.add('Ready');
        layout(true);
        restartProgress();
        syncPause();
    });
})();

// * Cartes : carrousel avec points (affiché seulement si les cartes débordent) * //
(function () {
    document.querySelectorAll('[data-cards-carousel]').forEach(function (root) {
        var track = root.querySelector('.CardsTrack');
        var cards = [].slice.call(track.children);
        var dots = [].slice.call(root.querySelectorAll('.CardsDot'));
        var prev = root.querySelector('[data-cards-prev]');
        var next = root.querySelector('[data-cards-next]');
        if (!track || cards.length < 2) return;

        function step() {
            var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            return cards[0].getBoundingClientRect().width + gap;
        }
        function update() {
            var overflow = track.scrollWidth - track.clientWidth > 2;
            root.classList.toggle('HasOverflow', overflow);
            var max = track.scrollWidth - track.clientWidth - 2;
            var idx = Math.min(cards.length - 1, Math.round(track.scrollLeft / step()));
            if (track.scrollLeft >= max) idx = cards.length - 1;
            dots.forEach(function (d, i) {
                d.classList.toggle('Active', i === idx);
                if (i === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
            });
            if (prev) prev.disabled = track.scrollLeft <= 2;
            if (next) next.disabled = track.scrollLeft >= max;
        }
        function goTo(i) {track.scrollTo({left: i * step()});}

        if (prev) prev.addEventListener('click', function () {track.scrollBy({left: -step()});});
        if (next) next.addEventListener('click', function () {track.scrollBy({left: step()});});
        dots.forEach(function (d, i) {d.addEventListener('click', function () {goTo(i);});});
        track.addEventListener('scroll', update, {passive: true});
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {e.preventDefault(); track.scrollBy({left: step()});}
            if (e.key === 'ArrowLeft') {e.preventDefault(); track.scrollBy({left: -step()});}
        });
        window.addEventListener('resize', update);
        update();
    });
})();
