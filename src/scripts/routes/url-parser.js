/* ===============================
   URL PARSER (SPA)
   ===============================
   Contoh hash:
   #/
   #/login
   #/register
   #/add
   #/detail/123
================================ */

/* ===============================
   EXTRACT SEGMENTS
================================ */
function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

/* ===============================
   CONSTRUCT ROUTE
================================ */
function constructRouteFromSegments({ resource, id }) {
  if (!resource) return '/';

  let pathname = `/${resource}`;

  if (id) {
    pathname += '/:id';
  }

  return pathname;
}

/* ===============================
   GET ACTIVE PATHNAME
================================ */
export function getActivePathname() {
  return window.location.hash.slice(1).toLowerCase() || '/';
}

/* ===============================
   GET ACTIVE ROUTE
================================ */
export function getActiveRoute() {
  const pathname = getActivePathname();
  const segments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(segments);
}

/* ===============================
   PARSE ACTIVE PATHNAME
================================ */
export function parseActivePathname() {
  return extractPathnameSegments(getActivePathname());
}
