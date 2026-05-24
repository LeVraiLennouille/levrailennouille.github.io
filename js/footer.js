const footerHTML = `
<footer class="Footer">
    <div class="FooterAccent"></div>
    <div class="FooterContainer">
        <div class="FooterCol">
            <h3 class="FooterLogo">Lenny Gadroy</h3>
            <span class="FooterBadge">
                <span class="FooterBadgeDot"></span>Disponible pour des opportunités
            </span>
            <p class="FooterDesc">Étudiant passionné par l'UI/UX Design, créant des expériences digitales fluides et mémorables.</p>
            <a href="/contact" class="FooterCta">Me contacter
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
        <div class="FooterCol">
            <h4 class="FooterTitle">Navigation</h4>
            <ul class="FooterLinks">
                <li><a href="/index"><span class="FooterLinkArrow">›</span>Accueil</a></li>
                <li><a href="/services"><span class="FooterLinkArrow">›</span>Mes services</a></li>
                <li><a href="/reals"><span class="FooterLinkArrow">›</span>Portfolio</a></li>
                <li><a href="/blog"><span class="FooterLinkArrow">›</span>Articles</a></li>
                <li><a href="/about"><span class="FooterLinkArrow">›</span>A propos</a></li>
            </ul>
        </div>
        <div class="FooterCol">
            <h4 class="FooterTitle">Contact</h4>
            <ul class="FooterLinks FooterSocialLinks">
                <li><a href="https://linkedin.com/in/lennygadroy/" target="_blank" rel="noopener noreferrer">
                    <span class="FooterIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </span>LinkedIn
                </a></li>
                <li><a href="https://instagram.com/lennygdr19/" target="_blank" rel="noopener noreferrer">
                    <span class="FooterIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </span>Instagram
                </a></li>
                <li><a href="https://github.com/LennyGadroy/" target="_blank" rel="noopener noreferrer">
                    <span class="FooterIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </span>GitHub
                </a></li>
                <li><a href="/contact">
                    <span class="FooterIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>Me contacter
                </a></li>
            </ul>
        </div>
    </div>
    <div class="FooterBottom">
        <p>&copy; 2026 Lenny Gadroy. Tous droits réservés.</p>
        <button class="FooterBackTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Retour en haut">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
    </div>
</footer>
`;

document.getElementById('FooterPlaceHolder').innerHTML = footerHTML;