#!/usr/bin/env python3
"""Audit de contraste du texte dans les deux thèmes (WCAG AA : 4.5, ou 3 pour le grand texte).
Usage : python tools/theme-audit.py http://localhost:4000 / /services /about [--mobile]
Ignore le texte transparent (animations) et les fonds en dégradé / image (non calculables).
"""
import sys
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
base = args[0].rstrip('/'); paths = args[1:] or ['/']
VIEW = {'width': 390, 'height': 844} if '--mobile' in sys.argv else {'width': 1440, 'height': 900}

JS = r"""() => {
 const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(parseFloat); return {r:p[0], g:p[1], b:p[2], a:p.length>3?p[3]:1}; };
 const lum = ({r,g,b}) => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }; return .2126*f(r)+.7152*f(g)+.0722*f(b); };
 const over = (f,b) => ({r:f.r*f.a+b.r*(1-f.a), g:f.g*f.a+b.g*(1-f.a), b:f.b*f.a+b.b*(1-f.a), a:1});
 function bgOf(el) {
   const chain = []; for (let e = el; e && e.nodeType === 1; e = e.parentElement) chain.push(getComputedStyle(e));
   let base = parse(getComputedStyle(document.documentElement).backgroundColor) || {r:255,g:255,b:255,a:1};
   if (base.a < 1) base = over(base, {r:255,g:255,b:255,a:1});
   let unknown = false;
   for (let i = chain.length - 1; i >= 0; i--) {
     if (chain[i].backgroundImage !== 'none') unknown = true;
     const c = parse(chain[i].backgroundColor); if (c && c.a > 0) base = over(c, base);
   }
   return {color: base, unknown};
 }
 const out = [], seen = new Set(); let skipped = 0;
 const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
 while (n = w.nextNode()) {
   const t = n.textContent.trim(); if (!t) continue;
   const el = n.parentElement; if (!el || ['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) continue;
   let hidden = false;
   for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e);
     if (s.display==='none' || s.visibility==='hidden' || parseFloat(s.opacity)===0 || /^inset\(0(px)? 100%/.test(s.clipPath)) { hidden = true; break; } }
   if (hidden) continue;
   const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
   const cs = getComputedStyle(el); let fg = parse(cs.color); if (!fg || fg.a === 0) continue;
   const bg = bgOf(el); if (bg.unknown) { skipped++; continue; }
   fg = over(fg, bg.color);
   const L1 = lum(fg), L2 = lum(bg.color), ratio = (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
   const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
   const need = (size >= 24 || (bold && size >= 18.66)) ? 3 : 4.5;
   if (ratio < need) { const key = (el.className||el.tagName)+'|'+cs.color+'|'+bg.color.r+bg.color.g+bg.color.b; if (seen.has(key)) continue; seen.add(key);
     out.push({texte: t.slice(0,34), classe: (el.className||el.tagName).toString().slice(0,30), ratio: +ratio.toFixed(2), requis: need, couleur: cs.color}); }
 }
 return {out, skipped};
}"""

bad = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for path in paths:
        for theme in ('light', 'dark'):
            pg = b.new_page(viewport=VIEW); pg.goto(base + path)
            pg.evaluate(f"localStorage.setItem('theme','{theme}')"); pg.reload(); pg.wait_for_timeout(500)
            h = pg.evaluate('document.body.scrollHeight')
            for y in range(0, h, 700): pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(40)
            pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(300)
            res = pg.evaluate(JS); bad += len(res['out'])
            print(f"== {path} / {theme} : {len(res['out'])} problème(s)  [{res['skipped']} texte(s) sur dégradé/image ignoré(s)]")
            for r in res['out'][:30]: print('   ', r)
            pg.close()
    b.close()
sys.exit(1 if bad else 0)
