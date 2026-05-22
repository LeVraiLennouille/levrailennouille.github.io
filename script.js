// ! Functions ! //
// * Cursor * //
	const dot    = document.getElementById('CursorDot');
    const ball   = document.getElementById('CursorBall');
    const canvas = document.getElementById('Trail');
    const ctx    = canvas.getContext('2d');
 
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
 
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });
 
    const mouse  = { x: W / 2, y: H / 2 };
    const dotPos = { x: W / 2, y: H / 2 };
    const pos    = { x: W / 2, y: H / 2 };
    const speed  = 0.08;
 
    const trail     = [];
    const MAX_TRAIL = 32;
 
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
 
    document.querySelectorAll('.CursorHover').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ball.style.width       = '52px';
        ball.style.height      = '52px';
        ball.style.borderColor = 'rgba(255,255,255,0.9)';
        dot.style.width        = '4px';
        dot.style.height       = '4px';
        dot.style.background   = 'rgba(255,255,255,0.4)';
      });
      el.addEventListener('mouseleave', () => {
        ball.style.width       = '28px';
        ball.style.height      = '28px';
        ball.style.borderColor = 'rgba(255,255,255,0.6)';
        dot.style.width        = '8px';
        dot.style.height       = '8px';
        dot.style.background   = '#fff';
      });
    });
 
    let last = performance.now();
 
    function loop(now) {
      const dt    = Math.min(now - last, 50);
      last        = now;
 
      const delta = dt * (60 / 1000);
      const lerpT = 1.0 - Math.pow(1.0 - speed, delta);
 
      pos.x += (mouse.x - pos.x) * lerpT;
      pos.y += (mouse.y - pos.y) * lerpT;
 
      dotPos.x += (mouse.x - dotPos.x) * 0.85;
      dotPos.y += (mouse.y - dotPos.y) * 0.85;
 
      dot.style.left  = Math.round(dotPos.x) + 'px';
      dot.style.top   = Math.round(dotPos.y) + 'px';
      ball.style.left = Math.round(pos.x) + 'px';
      ball.style.top  = Math.round(pos.y) + 'px';
 
      trail.push({ x: pos.x, y: pos.y });
      if (trail.length > MAX_TRAIL) trail.shift();
 
      ctx.clearRect(0, 0, W, H);
      for (let i = 1; i < trail.length; i++) {
        const ratio = i / trail.length;
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, ratio * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ratio * 0.18})`;
        ctx.fill();
      }
 
      requestAnimationFrame(loop);
    }
 
    requestAnimationFrame(loop);