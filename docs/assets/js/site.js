// Portfolio: language, theme, nav shadow, reveal on scroll, and live numbers
// from the GitHub API (the page reads fine without them).
(function () {
  var root = document.documentElement;
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var en = document.getElementById('lang-en'), id = document.getElementById('lang-id');
  function setLang(l, keep) {
    root.lang = l;
    en.setAttribute('aria-pressed', l === 'en'); id.setAttribute('aria-pressed', l === 'id');
    document.title = l === 'id' ? 'Ivan Novskies (navi-crwn): software open source' : 'Ivan Novskies (navi-crwn): open-source software';
    if (keep) save('lang', l);
    renderDates();
  }
  en.addEventListener('click', function () { setLang('en', true); });
  id.addEventListener('click', function () { setLang('id', true); });

  document.getElementById('theme').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = cur === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next); save('theme', next);
  });

  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('solid', scrollY > 24); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !root.classList.contains('shot-mode')) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // ---- live GitHub data ----
  var dates = [];
  function rel(iso) {
    var d = (Date.now() - new Date(iso)) / 86400000, idn = root.lang === 'id';
    if (d < 1) return idn ? 'hari ini' : 'today';
    if (d < 2) return idn ? 'kemarin' : 'yesterday';
    if (d < 60) return Math.floor(d) + (idn ? ' hari lalu' : ' days ago');
    return Math.floor(d / 30) + (idn ? ' bulan lalu' : ' months ago');
  }
  function renderDates() { dates.forEach(function (x) { x[0].textContent = rel(x[1]); }); }
  setLang(root.lang === 'id' ? 'id' : 'en', false);

  var colors = { Go: '#00ADD8', Swift: '#F05138', PHP: '#4F5D95', Blade: '#f7523f', Ruby: '#701516', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', Shell: '#89e051' };
  fetch('https://api.github.com/users/navi-crwn/repos?per_page=100&sort=pushed').then(function (r) { return r.ok ? r.json() : null; }).then(function (repos) {
    if (!repos) return;
    var stars = 0;
    repos.forEach(function (r) { stars += r.stargazers_count; });
    document.querySelectorAll('[data-gh=stars]').forEach(function (el) { el.textContent = stars; });
    document.querySelectorAll('.project[data-repo]').forEach(function (card) {
      var r = repos.filter(function (x) { return x.name === card.dataset.repo; })[0];
      if (!r) return;
      var set = function (f, v) { var el = card.querySelector('[data-f=' + f + ']'); if (el) el.textContent = v; };
      set('stars', r.stargazers_count); set('forks', r.forks_count);
      var p = card.querySelector('[data-f=pushed]'); if (p) dates.push([p, r.pushed_at]);
      if (card.querySelector('[data-f=release]')) {
        fetch('https://api.github.com/repos/navi-crwn/' + r.name + '/releases/latest').then(function (x) { return x.ok ? x.json() : null; })
          .then(function (j) { if (j && j.tag_name) set('release', j.tag_name); }).catch(function () {});
      }
    });
    renderDates();
    var list = document.getElementById('repo-list');
    list.innerHTML = '';
    repos.filter(function (r) { return !r.fork; }).forEach(function (r) {
      var a = document.createElement('a'); a.className = 'repo'; a.href = r.html_url;
      var b = document.createElement('b'); b.textContent = r.name;
      var p = document.createElement('p'); p.textContent = r.description || '';
      var s = document.createElement('small');
      if (r.language) { var l = document.createElement('span'); l.innerHTML = '<span class="dotl"></span>'; l.firstChild.style.background = colors[r.language] || '#888'; l.appendChild(document.createTextNode(r.language)); s.appendChild(l); }
      var st = document.createElement('span'); st.textContent = '★ ' + r.stargazers_count; s.appendChild(st);
      var up = document.createElement('span'); dates.push([up, r.pushed_at]); s.appendChild(up);
      a.appendChild(b); a.appendChild(p); a.appendChild(s); list.appendChild(a);
    });
    renderDates();
  }).catch(function () {});
})();
