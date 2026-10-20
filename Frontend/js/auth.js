/** Navigation gate for the existing browser-local demo session. */
(() => {
  const protectedPages = new Set([
    'universities.html', 'library.html', 'planner.html', 'chatbot.html', 'space.html',
    'profile.html', 'feedback.html', 'file.html', 'dsa.html', 'uit-faculties.html',
    'uit-is-majors.html', 'uit-is-cttt-subjects.html'
  ]);
  const directory = new URL('./', location.href);
  function isSignedIn() {
    try { return ['student', 'admin'].includes(JSON.parse(sessionStorage.getItem('studyhub-session'))?.role); }
    catch { return false; }
  }
  function isProtected(url) {
    return url.origin === directory.origin && new URL('./', url).pathname === directory.pathname
      && protectedPages.has(url.pathname.split('/').pop());
  }
  function signInUrl(destination) {
    const url = new URL('index.html', directory);
    url.searchParams.set('next', destination.pathname.split('/').pop() + destination.search + destination.hash);
    return url.href;
  }
  function returnDestination() {
    const next = new URLSearchParams(location.search).get('next');
    if (!next) return null;
    try {
      const url = new URL(next, directory);
      return isProtected(url) ? url.href : null;
    } catch { return null; }
  }
  window.StudyHubAuth = { isSignedIn, returnDestination };
  function guardPage() {
    if (!isSignedIn() && isProtected(new URL(location.href))) location.replace(signInUrl(new URL(location.href)));
  }
  guardPage();
  window.addEventListener('pageshow', guardPage);
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || isSignedIn() || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (!isProtected(url)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(signInUrl(url));
  }, true);
})();
