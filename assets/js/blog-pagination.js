/* Pagination du blog — les cartes sont déjà rendues par Jekyll (_includes/posts-grid.html).
   Ce script se contente d'afficher la page demandée. */
(function () {
    var grid = document.getElementById("BlogGrid");
    var pagination = document.getElementById("Pagination");
    if (!grid || !pagination) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-page]"));
    if (!cards.length) return;

    var totalPages = cards.reduce(function (max, card) {
        return Math.max(max, Number(card.dataset.page));
    }, 1);
    var currentPage = 1;

    function render(page, scroll) {
        currentPage = Math.min(Math.max(1, page), totalPages);

        cards.forEach(function (card) {
            card.hidden = Number(card.dataset.page) !== currentPage;
        });

        Array.prototype.forEach.call(pagination.querySelectorAll("button[data-page]"), function (btn) {
            var target = Number(btn.dataset.page);
            if (btn.dataset.nav) {
                var isPrev = btn.dataset.nav === "prev";
                btn.dataset.page = isPrev ? currentPage - 1 : currentPage + 1;
                btn.disabled = isPrev ? currentPage === 1 : currentPage === totalPages;
                return;
            }
            var active = target === currentPage;
            btn.classList.toggle("active", active);
            btn.setAttribute("aria-current", active ? "page" : "false");
        });

        if (scroll) grid.scrollIntoView({behavior: "smooth", block: "start"});
    }

    pagination.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-page]");
        if (!btn || btn.disabled) return;
        render(Number(btn.dataset.page), true);
    });

    render(1, false);
})();
