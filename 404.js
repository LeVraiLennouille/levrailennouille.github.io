(function () {
    var path = window.location.pathname;
    var pathEl = document.getElementById('NotFoundPath');

    if (!pathEl || !path || path === '/') return;

    try {
        path = decodeURIComponent(path);
    } catch (e) {}

    pathEl.textContent = path;
    pathEl.hidden = false;
})();