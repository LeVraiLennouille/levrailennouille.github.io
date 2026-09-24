(function () {
    "use strict";

    const SELECTORS = [
        ".Card",
        ".ProjectCard",
        ".BlogCard",
        ".LawCard",
        ".RelatedCard",
        ".FolderCard",
        ".BudgetCard",
        ".TimelineItem",
        ".Anchor",
        ".SectionHeader",
        ".Part",
        ".Column",
        ".ProjectBloc",
        ".CompItem",
        ".TermsArticle",
        ".Highlight",
        ".DemoBox",
        ".SourceGroup",
        ".CallToAction",
        ".DesignedCTA",
        ".Me",
        ".Merge"
    ].join(", ");

    const CONFIG = {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        start: "top 85%"
    };

    function initRevealAnimations() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            console.warn("[anims.js] GSAP ou ScrollTrigger introuvable — animations désactivées.");
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            return;
        }

        const blocks = gsap.utils.toArray(SELECTORS).filter(function (block) {
            return !block.closest(".Marquee");
        });

        blocks.forEach(function (block) {
            gsap.from(block, {
                opacity: CONFIG.opacity,
                y: CONFIG.y,
                duration: CONFIG.duration,
                ease: CONFIG.ease,
                scrollTrigger: {
                    trigger: block,
                    start: CONFIG.start
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", initRevealAnimations);
})();