const headerHTML = `
    <header class="MainHeader">
        <nav class="NavBar">
            <a class="NavLogo" href="/index" aria-label="Retour à l'accueil"><img src="/assets/icon.svg" alt="Logo de Lennouille" /></a>
            <ul class="NavLinks">
                <li><a href="/index">Accueil</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/reals">Réalisations</a></li>
                <li><a href="/about">A propos</a></li>
            </ul>
            <div class="NavBtn"><a href="/contact" class="BtnSolid">Contactez moi</a></div>
        </nav>
    </header>
`;

document.getElementById('HeaderPlaceHolder').innerHTML = headerHTML;

function initHamburger() {
  var navbar = document.querySelector('.NavBar');
  if (!navbar) return;

  var btn = document.createElement('button');
  btn.className = 'HamburgerBtn';
  btn.setAttribute('aria-label', 'Ouvrir le menu navigation');
  btn.setAttribute('aria-expanded', 'false');

  btn.innerHTML = '<span class="HamburgerLine"></span><span class="HamburgerLine"></span><span class="HamburgerLine"></span>';
  navbar.appendChild(btn);

  var nav = document.createElement('nav');
  nav.className = 'MobileNav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Navigation mobile');
  
  nav.innerHTML =
    '<a href="/index">Accueil</a>' +
    '<a href="/services">Services</a>' +
    '<a href="/reals">Réalisations</a>' +
    '<a href="/about">A propos</a>' +
    '<div class="MobileNavDivider"></div>' +
    '<div class="MobileNavCTA"><a href="contact.html" class="BtnSolid">Contactez moi</a></div>';
  document.body.appendChild(nav);

  function toggle(force) {
    var open = (force !== undefined) ? force : !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  document.addEventListener('click', function (e) {if (!navbar.contains(e.target) && !nav.contains(e.target)) toggle(false);});
  nav.querySelectorAll('a').forEach(function (a) {a.addEventListener('click', function () { toggle(false); });});
  window.addEventListener('resize', function () {if (window.innerWidth > 950) toggle(false);});
}