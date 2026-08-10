(function () {
    const article = document.querySelector(".BlogArticle");
    const progress = document.getElementById("ReadingProgress");
    const navLinks = document.querySelectorAll(".BlogContent .Nav a[href^='#']");

    if (!article) return;

    function updateProgress() {
        if (!progress) return;
        const rect = article.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        const articleHeight = article.offsetHeight - window.innerHeight;
        const scrolled = window.scrollY - articleTop;
        const percent = Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));
        progress.style.width = percent + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    if (navLinks.length) {
        const headings = Array.from(navLinks)
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                    });
                });
            },
            { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
        );

        headings.forEach((heading) => observer.observe(heading));
    }
})()