const headerHTML = `
    <nav class="NavBar">
        <a class="NavLogo" href="/index" aria-label="Retour à l'accueil">
            <img src="assets/icon.svg" alt="Logo de Lenouille"/>
        </a>
        <ul class="NavLinks">
            <li><a href="/index"><div data-text="Page principale">Accueil</div></a></li>
            <li><a href="/services"><div data-text="Designs UI / UX">Services</div></a></li>
            <li><a href="/reals"><div data-text="Mes réalisations">Portfolio</div></a></li>
            <li><a href="/blog"><div data-text="Tips & Astuces">Articles</div></a></li>
            <li><a href="/about"><div data-text="Toutes les infos">À propos</div></a></li>
        </ul>
        <div class="NavCTAs">
            <button class="SwitchBtn" type="button">
                <span class="BtnTexts">
                    <span class="DefaultText">Me contacter</span>
                    <span class="HoverText">Me contacter</span>
                </span>
                <span class="BtnIcon">
                    <span class="Dot"></span>
                    <span class="Arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                </span>
            </button>
        </div>
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