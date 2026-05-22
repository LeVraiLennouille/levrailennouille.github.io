const headerHTML = `
    <nav class="NavBar">
        <a class="NavLogo" href="/index" aria-label="Retour à l'accueil">
            <img src="assets/icon.svg" alt="Logo de Lenouille"/>
        </a>
        <ul class="NavLinks">
            <li><a href="/index">Accueil</a></li>
            <li><a href="/services">Mes services</a></li>
            <li><a href="/reals">Réalisations</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">À propos</a></li>
        </ul>
        <a href="/contact" class="NavCTA">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>     
            </svg>Me contacter
        </a>
    </nav>
`;

document.getElementById('HeaderPlaceHolder').innerHTML = headerHTML;

function initHamburger() {
    var navbar = document.querySelector('.NavBar');
    if (!navbar) return;

    var btn = document.createElement('button');
    btn.className = 'HamburgerBtn';
    btn.setAttribute('aria-label', 'Ouvrir le menu navigation');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
        '<span class="HamburgerLine"></span>' +
        '<span class="HamburgerLine"></span>' +
        '<span class="HamburgerLine"></span>';
    navbar.appendChild(btn);

    var nav = document.createElement('nav');
    nav.className = 'MobileNav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navigation mobile');
    nav.innerHTML =
        '<a href="/index">Accueil</a>' +
        '<a href="/services">Mes services</a>' +
        '<a href="/reals">Réalisations</a>' +
        '<a href="/blog">Blog</a>' +
        '<a href="/about">À propos</a>' +
        '<div class="Divider"></div>' +
        '<div class="CTA"><a href="/contact">Me contacter</a></div>';
    navbar.appendChild(nav);

    function toggle(force) {
        var open = (force !== undefined) ? force : !nav.classList.contains('open');
        nav.classList.toggle('open', open);
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle();
    });

    document.addEventListener('click', function (e) {if (!navbar.contains(e.target) && !nav.contains(e.target)) toggle(false);});
    nav.querySelectorAll('a').forEach(function (a) {a.addEventListener('click', function () { toggle(false); });});
    window.addEventListener('resize', function () {if (window.innerWidth > 950) toggle(false);});
}

initHamburger();