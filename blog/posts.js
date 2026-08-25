(function () {
    const POSTS_PER_PAGE = 8;

    const BLOG_POSTS = [
        // {
        //     title: "Gestion du Temps en Freelance : le Guide Complet pour les Créatifs Indépendants",
        //     excerpt: "Check-in matinal, priorisation par énergie, time blocking, méthode Pomodoro : les techniques concrètes pour gérer son temps quand on est designer ou créatif indépendant.",
        //     category: "Freelance",
        //     date: "2027-02-01",
        //     readingTime: "9 min",
        //     url: "/blog/gestion-du-temps-freelance"
        // }, {
        //     title: "Combien Coûte un Site Internet en 2027 ? Prix Réels et Complets",
        //     excerpt: "Combien coûte un site internet en 2027 ? Landing page, vitrine, e-commerce : les vrais prix pratiqués en France selon le prestataire choisi.",
        //     category: "Tarifs",
        //     date: "2027-01-01",
        //     readingTime: "10 min",
        //     url: "/blog/combien-coute-un-site-internet-en-2027"
        // }, {
        //     title: "Pourquoi la Motivation ne Suffit pas pour Atteindre vos Objectifs",
        //     excerpt: "La motivation ne suffit pas pour tenir ses objectifs sur la durée. Pourquoi l'action doit précéder la motivation, et comment construire un processus qui tient dans le temps.",
        //     category: "Mindset",
        //     date: "2026-12-01",
        //     readingTime: "9 min",
        //     url: "/blog/pourquoi-la-motivation-ne-suffit-pas"
        // }, {
        //     title: "Théorie des Couleurs : le Guide Complet pour Créer des Palettes Harmonieuses",
        //     excerpt: "Roue chromatique, harmonies de couleurs, règle des 60-30-10, psychologie des couleurs : le guide complet pour composer une palette cohérente pour votre marque ou votre site.",
        //     category: "Design",
        //     date: "2026-11-01",
        //     readingTime: "10 min",
        //     url: "/blog/theorie-des-couleurs"
        // }, {
        //     title: "Avez-vous Vraiment Besoin des Réseaux Sociaux en Tant que Designer Freelance ?",
        //     excerpt: "Faut-il être sur Instagram ou LinkedIn pour réussir en freelance ? Avantages, inconvénients et alternatives concrètes pour construire une présence qui vous correspond.",
        //     category: "Freelance",
        //     date: "2026-10-01",
        //     readingTime: "8 min",
        //     url: "/blog/reseaux-sociaux-freelance"
        // }, {
        //     title: "La Signification des Couleurs : Psychologie en Design",
        //     excerpt: "Découvrez la théorie des couleurs, la psychologie cachée derrière chaque nuance et comment utiliser les couleurs efficacement dans vos designs et créations artistiques.",
        //     category: "Design",
        //     date: "2026-09-01",
        //     readingTime: "8 min",
        //     url: "/blog/signification-des-couleurs"
        // },
    ];

    const dateFormatter = new Intl.DateTimeFormat("fr-FR", {day: "numeric", month: "long", year: "numeric"});

    function formatDateLabel(isoDate) {
        const parsed = new Date(isoDate + "T00:00:00");
        return isNaN(parsed) ? isoDate : dateFormatter.format(parsed);
    }

    const posts = [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));

    window.LennouilleBlog = { posts: posts, cardHTML: cardHTML, formatDateLabel: formatDateLabel };

    const grid = document.getElementById("BlogGrid");
    const pagination = document.getElementById("Pagination");
    const countEl = document.getElementById("PostCount");

    if (!grid || !pagination) return;

    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
    let currentPage = 1;

    function cardHTML(post, isFeatured) {
        return (
            '<a href="' + post.url + '" class="BlogCard' + (isFeatured ? " Featured" : "") + '">' +
                '<div class="CardTop">' +
                    '<span class="Category">' + post.category + "</span>" +
                    '<span class="ReadTime">' + post.readingTime + "</span>" +
                "</div>" +
                "<h3>" + post.title + "</h3>" +
                "<p>" + post.excerpt + "</p>" +
                '<div class="CardFooter">' +
                    '<time datetime="' + post.date + '">' + formatDateLabel(post.date) + "</time>" +
                    '<span class="Arrow" aria-hidden="true">→</span>' +
                "</div>" +
            "</a>"
        );
    }

    function renderPagination() {
        let html = '<button class="Arrow" data-page="' + (currentPage - 1) + '" aria-label="Page précédente"' + (currentPage === 1 ? " disabled" : "") + ">←</button>";
        for (let i = 1; i <= totalPages; i++) {
            html += '<button data-page="' + i + '" class="' + (i === currentPage ? "active" : "") + '" aria-current="' + (i === currentPage ? "page" : "false") + '">' + i + "</button>";
        }

        html += '<button class="Arrow" data-page="' + (currentPage + 1) + '" aria-label="Page suivante"' + (currentPage === totalPages ? " disabled" : "") + ">→</button>";
        pagination.innerHTML = html;
    }

    function renderPage(page, options) {
        options = options || {};
        currentPage = Math.min(Math.max(1, page), totalPages);

        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);

        grid.innerHTML = pagePosts
            .map(function (post, i) { return cardHTML(post, currentPage === 1 && i === 0); })
            .join("");

        renderPagination();

        if (options.scroll) {grid.scrollIntoView({ behavior: "smooth", block: "start" });}
    }

    pagination.addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-page]");
        if (!btn || btn.disabled) return;
        renderPage(Number(btn.dataset.page), { scroll: true });
    });

    if (countEl) {countEl.textContent = posts.length + (posts.length > 1 ? " articles publiés" : " article publié");}

    renderPage(1);
})();