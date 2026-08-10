(function () {
    const POSTS_PER_PAGE = 8;

    const BLOG_POSTS = [
        {
            title: "Combien Coûte un Site Internet en 2027 ? Prix Réels et Complets",
            excerpt: "Landing page, vitrine, e-commerce : les vrais prix pratiqués en France selon le prestataire choisi.",
            category: "Guide Tarifs",
            date: "2027-01-19",
            readingTime: "10 min",
            url: "/blog/combien-coute-un-site-internet-en-2027/"
        },
    ];

    const grid = document.getElementById("BlogGrid");
    const pagination = document.getElementById("Pagination");
    const countEl = document.getElementById("PostCount");

    if (!grid || !pagination) return;

    const dateFormatter = new Intl.DateTimeFormat("fr-FR", {day: "numeric", month: "long", year: "numeric"});

    function formatDateLabel(isoDate) {
        const parsed = new Date(isoDate + "T00:00:00");
        return isNaN(parsed) ? isoDate : dateFormatter.format(parsed);
    }

    const posts = [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
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