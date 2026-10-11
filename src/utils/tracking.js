// Captura UTM de la URL una vez por sesión y los conserva en sessionStorage
// para que sobrevivan a la navegación interna antes del envío del formulario.

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
const STORAGE_KEY = 'oryon_utm';

export function captureUtmParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const stored = getStoredUtm();
  const next = { ...stored };
  let changed = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && !stored[key]) {
      next[key] = value;
      changed = true;
    }
  }
  if (changed) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // sessionStorage no disponible (modo privado estricto): seguimos sin persistir
    }
  }
  return next;
}

export function getStoredUtm() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getTrackingPayload(pathname = window.location.pathname) {
  const utm = getStoredUtm();
  return {
    utm_source:   utm.utm_source   || '',
    utm_medium:   utm.utm_medium   || '',
    utm_campaign: utm.utm_campaign || '',
    utm_content:  utm.utm_content  || '',
    source_page:  pathname,
  };
}
