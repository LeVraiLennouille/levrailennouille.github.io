/* Filtre du catalogue de lois UX — les 30 cartes sont déjà rendues par Jekyll
   (_includes/laws-grid.html). Ce script ne fait que masquer / révéler. */
(function () {
    var grid = document.getElementById("grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".LawCard"));
    if (!cards.length) return;

    var searchInput = document.getElementById("search");
    var empty = document.getElementById("LawsEmpty");
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".Tab"));
    var activeCat = "all";
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                io.unobserve(entry.target);
            }
        });
    }, {threshold: 0.12}) : null;

    function reveal(card) {
        if (reduceMotion || !io) {
            card.classList.add("in-view");
        } else if (!card.classList.contains("in-view")) {
            io.observe(card);
        }
    }

    function render() {
        var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var visible = 0;

        cards.forEach(function (card) {
            var catOk = activeCat === "all" || card.dataset.cat === activeCat;
            var textOk = !term || card.dataset.search.indexOf(term) !== -1;
            var show = catOk && textOk;
            card.hidden = !show;
            if (show) {
                visible++;
                reveal(card);
            }
        });

        if (empty) empty.hidden = visible !== 0;
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) {
                t.classList.remove("active");
                t.setAttribute("aria-pressed", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-pressed", "true");
            activeCat = tab.getAttribute("data-cat");
            render();
        });
    });

    if (searchInput) searchInput.addEventListener("input", render);
    render();
})();
