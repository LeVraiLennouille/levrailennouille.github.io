var REALS = [
    {
        id: "portfolio",
        url: "/reals/portfolio",
        name: "Refonte Portfolio v3",
        label: "Portfolio v3",
        category: "Audit & refonte UI / UX",
        tags: ["refonte", "ui-ux", "branding", "design-system", "personnel"],
        image: "/img/reals/portfolio/mockup.png",
        imageAlt: "Mon portfolio : v3",
        date: "2026-03-01"
    }, {
        id: "scorsone",
        url: "/reals/scorsone",
        name: "Création Scorsone",
        label: "Scorsone",
        category: "Création · Product design & Branding",
        tags: ["creation", "product-design", "branding"],
        image: "/img/reals/scorsone/mockup.png",
        imageAlt: "Création Scorsone",
        date: "2026-07-31",
        comingSoon: true
    },{
        id: "primaire",
        url: "/reals/primaire",
        name: "Création Primaire Média",
        label: "Primaire Média",
        category: "Création · Product design e-commerce",
        tags: ["creation", "product-design", "ecommerce", "branding", "wordpress"],
        image: "/img/reals/primaire/mockup.png",
        imageAlt: "Création Primaire",
        date: "2026-06-05"
    },{
        id: "mu",
        url: "/reals/mu",
        name: "Refonte Mü v2",
        label: "Mü-Être",
        category: "Audit & refonte UI / UX · Design System",
        tags: ["refonte", "ui-ux", "branding", "design-system", "bien-etre"],
        image: "/img/reals/mu/mockup.png",
        imageAlt: "Refonte Mü-être v2",
        date: "2026-04-20"
    }, {
        id: "geoptime",
        url: "/reals/geoptime",
        name: "Création GeopTime",
        label: "GeopTime",
        category: "Création · UI / UX & Full-stack",
        tags: ["creation", "ui-ux", "fullstack", "b2b", "branding"],
        image: "/img/reals/geoptime/mockup.png",
        imageAlt: "Création GeopTime",
        date: "2025-12-10"
    }, {
        id: "goon",
        url: "/reals/goon",
        name: "Refonte GOON v3",
        label: "GOON Blindtests",
        category: "Product design · App Web temps réel",
        tags: ["product-design", "ui-ux", "app-web", "gaming", "temps-reel"],
        image: "/img/reals/goon/mockup.png",
        imageAlt: "Refonte GOON v3",
        date: "2026-02-19"
    }, {
        id: "gymaddict",
        url: "/reals/gymaddict",
        name: "Création GymAddict",
        label: "GymAddict",
        category: "UI/UX Design · Webdesign · Identité visuelle",
        tags: ["creation", "ui-ux", "product-design", "app-design", "fitness"],
        image: "/img/reals/gymaddict/mockup.png",
        imageAlt: "Création GymAddict",
        date: "2026-04-15"
    }, {
        id: "habitstracker",
        url: "/reals/habitstracker",
        name: "Création HabitsTracker",
        label: "HabitsTracker",
        category: "UI/UX Design · Webdesign · Identité visuelle",
        tags: ["creation", "ui-ux", "product-design", "app-design", "habitudes"],
        image: "/img/reals/habitstracker/mockup.png",
        imageAlt: "Création HabitsTracker",
        date: "2026-04-01"
    }, {
        id: "caradd",
        url: "/reals/caradd",
        name: "Création CarAdd Studio",
        label: "CarAdd Studio",
        category: "UI/UX Design · Webdesign · Identité visuelle",
        tags: ["creation", "ui-ux", "branding", "identite-visuelle"],
        image: "/img/reals/caradd/mockup.png",
        imageAlt: "Création CarAdd Studio",
        date: "2026-05-01"
    }, {
        id: "yligen",
        url: "/reals/yligen",
        name: "Refonte Yligen v2",
        label: "Yligen",
        category: "UI/UX Design · Webdesign · Identité visuelle",
        tags: ["refonte", "ui-ux", "branding", "identite-visuelle", "migration-cms"],
        image: "/img/reals/yligen/mockup.png",
        imageAlt: "Refonte Yligen v2",
        date: "2025-09-01"
    },
];

document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-reals-grid]");
    if (!grid) return;

    var sorted = REALS.slice().sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    grid.innerHTML = sorted.map(renderProjectCard).join("");

    function renderProjectCard(p) {
        var attrs = p.comingSoon ? ' id="ComingSoonLink"' : "";
        return "" +
            '<a href="' + p.url + '" class="ProjectCard"' + attrs + '>' +
                '<div class="ProjectImage">' +
                    '<img src="' + p.image + '" alt="' + p.imageAlt + '">' +
                    '<div class="ProjectOverlay"><p>' + p.label + "</p></div>" +
                "</div>" +
            "</a>";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector("[data-related-reals]");
    if (!section) return;

    var SIMILAR_COUNT = 3;
    var LATEST_COUNT = 2;

    var currentId = getCurrentProjectId();
    var current = findProject(currentId);
    if (!current) return;

    var others = REALS.filter(function (p) { return p.id !== current.id; });

    var ranked = others
        .map(function (p) { return { reals: p, score: similarityScore(current, p) }; })
        .sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.reals.date) - new Date(a.reals.date);
        });

    var similar = ranked.slice(0, SIMILAR_COUNT).map(function (r) { return r.reals; });
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
        for (var i = 0; i < REALS.length; i++) {
            if (REALS[i].id === id) return REALS[i];
        }
        return null;
    }

    function getCurrentProjectId() {
        var canonical = document.querySelector('link[rel="canonical"]');
        var href = canonical ? canonical.getAttribute("href") : window.location.pathname;
        var match = href.match(/\/reals\/([^\/]+)\/?/);
        return match ? match[1] : null;
    }
});