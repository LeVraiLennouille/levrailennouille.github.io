(function () {
    "use strict";
    const SELECTOR = ".Reveal";

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

        const blocks = gsap.utils.toArray(SELECTOR);

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