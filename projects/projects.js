var PROJECTS = [
    {
        id: "portfolio",
        url: "/projets/portfolio",
        name: "Refonte Portfolio v3",
        label: "Portfolio v3",
        category: "Audit & refonte UI / UX",
        tags: ["refonte", "ui-ux", "branding", "design-system", "personnel"],
        image: "/img/reals/portfolio/mockup.png",
        imageAlt: "Mon portfolio : v3",
        date: "2026-01-01" // TODO : date réelle
    },
    {
        id: "mu",
        url: "/projets/mu",
        name: "Refonte Mü v2",
        label: "Mü-Être",
        category: "Audit & refonte UI / UX · Design System",
        tags: ["refonte", "ui-ux", "branding", "design-system", "bien-etre"],
        image: "/img/reals/mu/mockup.png",
        imageAlt: "Refonte Mü-être v2",
        date: "2025-11-01" // TODO : date réelle
    },
    {
        id: "primaire",
        url: "/projets/primaire",
        name: "Création Primaire Média",
        label: "Primaire Média",
        category: "Création · Product design e-commerce",
        tags: ["creation", "product-design", "ecommerce", "branding", "woocommerce"],
        image: "/img/reals/primaire/mockup.png",
        imageAlt: "Création Primaire",
        date: "2025-10-01" // TODO : date réelle
    },
    {
        id: "geoptime",
        url: "/projets/geoptime",
        name: "Création GeopTime",
        label: "GeopTime",
        category: "Création · UI / UX & Full-stack",
        tags: ["creation", "ui-ux", "fullstack", "b2b", "branding"],
        image: "/img/reals/geoptime/mockup.png",
        imageAlt: "Création GeopTime",
        date: "2025-05-01" // TODO : date réelle
    },
    {
        id: "goon",
        url: "/projets/goon",
        name: "Refonte GOON v3",
        label: "GOON Blindtests",
        category: "Product design · App Web temps réel",
        tags: ["product-design", "ui-ux", "app-web", "gaming", "temps-reel"],
        image: "/img/reals/goon/mockup.png",
        imageAlt: "Refonte GOON v3",
        date: "2025-09-01" // TODO : date réelle
    },
];

document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector("[data-related-projects]");
    if (!section) return;

    var SIMILAR_COUNT = 3;
    var LATEST_COUNT = 2;

    var currentId = getCurrentProjectId();
    var current = findProject(currentId);
    if (!current) return;

    var others = PROJECTS.filter(function (p) { return p.id !== current.id; });

    var ranked = others
        .map(function (p) { return { project: p, score: similarityScore(current, p) }; })
        .sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.project.date) - new Date(a.project.date);
        });

    var similar = ranked.slice(0, SIMILAR_COUNT).map(function (r) { return r.project; });
    var usedIds = similar.map(function (p) { return p.id; });

    var latest = others
        .filter(function (p) { return usedIds.indexOf(p.id) === -1; })
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .slice(0, LATEST_COUNT);

    fillGrid("similar", similar);
    fillGrid("latest", latest);

    function fillGrid(key, list) {
        var block = section.querySelector('[data-related-block="' + key + '"]');
        var grid = section.querySelector('[data-related-grid="' + key + '"]');
        if (!grid) return;
        if (!list.length) {
            if (block) block.style.display = "none";
            return;
        }
        grid.innerHTML = list.map(renderCard).join("");
    }

    function renderCard(p) {
        return "" +
            '<a href="' + p.url + '" class="RelatedCard">' +
                '<div class="RelatedImage">' +
                    '<img src="' + p.image + '" alt="' + p.imageAlt + '">' +
                    '<div class="RelatedOverlay"><span>' + p.label + "</span></div>" +
                "</div>" +
                '<div class="RelatedMeta">' +
                    '<p class="RelatedCategory">' + p.category + "</p>" +
                    '<h3 class="RelatedName">' + p.name + "</h3>" +
                "</div>" +
            "</a>";
    }

    function similarityScore(a, b) {
        var score = a.category === b.category ? 2 : 0;
        for (var i = 0; i < b.tags.length; i++) {
            if (a.tags.indexOf(b.tags[i]) !== -1) score++;
        }
        return score;
    }

    function findProject(id) {
        for (var i = 0; i < PROJECTS.length; i++) {
            if (PROJECTS[i].id === id) return PROJECTS[i];
        }
        return null;
    }

    function getCurrentProjectId() {
        var canonical = document.querySelector('link[rel="canonical"]');
        var href = canonical ? canonical.getAttribute("href") : window.location.pathname;
        var match = href.match(/\/projets\/([^\/]+)\/?/);
        return match ? match[1] : null;
    }
});