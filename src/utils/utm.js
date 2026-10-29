// Captura de UTM + página de origen para atribución de leads.
// Se guardan en sessionStorage a la entrada del sitio para sobrevivir
// la navegación interna antes de que el usuario envíe el formulario.

const UTM_KEY = 'oryon_utm_params';
const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

// Llamar una vez al montar la app (Layout). Si la URL trae UTMs, pisan
// a las guardadas; si no, se conservan las de la entrada.
export function captureUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {};
    UTM_FIELDS.forEach((f) => {
      const v = params.get(f);
      if (v) fromUrl[f] = v;
    });
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify({
        ...fromUrl,
        landing_page: window.location.pathname,
      }));
    } else if (!sessionStorage.getItem(UTM_KEY)) {
      // Sin UTMs: registra al menos la página de aterrizaje
      sessionStorage.setItem(UTM_KEY, JSON.stringify({
        landing_page: window.location.pathname,
      }));
    }
  } catch {
    /* sessionStorage no disponible (modo privado estricto) — sin atribución */
  }
}

// Lee los UTMs guardados + la ruta actual como source_page.
export function getAttribution() {
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}');
  } catch { /* noop */ }
  return {
    utm_source:   stored.utm_source   || '',
    utm_medium:   stored.utm_medium   || '',
    utm_campaign: stored.utm_campaign || '',
    utm_content:  stored.utm_content  || '',
    source_page:  stored.landing_page || window.location.pathname,
  };
}
