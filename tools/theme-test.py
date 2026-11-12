#!/usr/bin/env python3
"""Teste le fonctionnement Light / Dark d'une page.
Usage : python tools/theme-test.py http://localhost:4000/ [--mobile]
Prérequis : pip install playwright && playwright install chromium
"""
import sys
from playwright.sync_api import sync_playwright

url = next((a for a in sys.argv[1:] if a.startswith('http')), 'http://localhost:4000/')
mobile = '--mobile' in sys.argv
VIEW = {'width': 390, 'height': 844} if mobile else {'width': 1440, 'height': 900}
results = []

def check(name, ok, detail=''):
    results.append(ok)
    print(('PASS  ' if ok else 'FAIL  ') + name + (f'  ({detail})' if detail and not ok else ''))

def state(pg):
    return pg.evaluate("""() => ({
        theme: document.documentElement.dataset.theme,
        stored: localStorage.getItem('theme'),
        aria: [...document.querySelectorAll('[data-theme-toggle]')].map(b => b.getAttribute('aria-checked')),
        bg: getComputedStyle(document.body).backgroundColor})""")

def click_toggle(pg):
    """Clique sur le premier bouton de thème visible (ouvre le menu en mobile si besoin)."""
    def visible():
        return pg.evaluate("""() => [...document.querySelectorAll('[data-theme-toggle]')].findIndex(b => {
            const r = b.getBoundingClientRect(), s = getComputedStyle(b);
            return r.width > 0 && r.height > 0 && s.visibility !== 'hidden'; })""")
    if visible() < 0:
        pg.click('.HamburgerBtn'); pg.wait_for_timeout(900)
    i = visible()
    if i < 0:
        return False
    pg.locator('[data-theme-toggle]').nth(i).click(); pg.wait_for_timeout(600)
    return True

with sync_playwright() as p:
    b = p.chromium.launch()

    for scheme, expected in (('light', 'light'), ('dark', 'dark')):
        ctx = b.new_context(color_scheme=scheme, viewport=VIEW); pg = ctx.new_page(); pg.goto(url); pg.wait_for_timeout(400)
        st = state(pg)
        check(f'Sans choix, le thème suit le système ({scheme})', st['theme'] == expected and st['stored'] is None, st)
        ctx.close()

    ctx = b.new_context(color_scheme='light', viewport=VIEW); pg = ctx.new_page()
    errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(400)
    start = state(pg)

    check('Un bouton de thème existe dans la page', len(start['aria']) > 0)
    check('Au départ aria-checked est cohérent avec le thème', all(a == 'false' for a in start['aria']), start)

    check('Le bouton est cliquable (visible)', click_toggle(pg))
    st = state(pg)
    check('Le clic bascule en sombre', st['theme'] == 'dark' and st['bg'] != start['bg'], st)
    check('Le choix est mémorisé (localStorage)', st['stored'] == 'dark', st)
    check('Tous les boutons restent synchronisés (aria-checked)', all(a == 'true' for a in st['aria']), st)
    check('La couleur du navigateur (theme-color) est définie',
          pg.evaluate("!!document.querySelector('meta[name=theme-color]')"))

    pg.reload(); pg.wait_for_timeout(400)
    check('Le choix survit au rechargement', state(pg)['theme'] == 'dark')

    pg.emulate_media(color_scheme='light'); pg.wait_for_timeout(300)
    check("Un choix mémorisé n'est pas écrasé par le système", state(pg)['theme'] == 'dark')

    pg.evaluate("localStorage.removeItem('theme')"); pg.emulate_media(color_scheme='dark'); pg.wait_for_timeout(700)
    check('Sans choix mémorisé, le changement système est suivi en direct', state(pg)['theme'] == 'dark')

    pg2 = ctx.new_page(); pg2.goto(url); pg2.wait_for_timeout(300)
    click_toggle(pg2)
    check('Synchronisation entre onglets', state(pg)['theme'] == state(pg2)['theme'], (state(pg), state(pg2)))

    pg3 = ctx.new_page()
    pg3.add_init_script("document.addEventListener('DOMContentLoaded', () => window.__t = document.documentElement.dataset.theme)")
    pg3.goto(url)
    check("Pas de flash : le thème est posé avant l'affichage", pg3.evaluate('window.__t') in ('light', 'dark'))

    check('Aucune erreur JavaScript', not errors, errors)
    b.close()

print(f"\n{sum(results)}/{len(results)} vérifications réussies")
sys.exit(0 if all(results) else 1)
