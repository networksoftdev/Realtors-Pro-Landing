const PROPERTY_SPEC_LABELS = {
  type: 'Tipo de inmueble',
  area: 'Superficie',
  built_area: 'Superficie construida',
  terrace: 'Terraza',
  total_area: 'Superficie total',
  bedrooms: 'Recámaras',
  bathrooms: 'Baños',
  parking: 'Estacionamiento',
  reference_price: 'Precio de referencia',
  starting_price: 'Precio desde',
  approximate_down_payment_10_percent: 'Enganche aproximado (10%)',
  approximate_loan_90_percent: 'Crédito aproximado (90%)',
  approximate_monthly_payment: 'Mensualidad aproximada',
  verifiable_monthly_income: 'Ingresos mensuales comprobables',
};
const PROPERTIES_API_URL = 'https://realtors-pro.free.beeceptor.com/properties';

function normalizePropertyIdentifier(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function appendListItems(list, items) {
  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = 'flex items-start gap-3';
    const marker = document.createElement('span');
    marker.className = 'mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400';
    marker.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = item;
    listItem.append(marker, text);
    list.appendChild(listItem);
  });
}

function getAmenityIconPaths(amenity) {
  const normalized = amenity.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/alberca|piscina|agua/.test(normalized)) {
    return ['M12 3c-3.5 4.2-5.5 6.8-5.5 10a5.5 5.5 0 0 0 11 0c0-3.2-2-5.8-5.5-10Z', 'M9 15.5c.5 1 1.4 1.5 2.5 1.5'];
  }
  if (/verde|jardin|area verde|arbol/.test(normalized)) {
    return ['M20 4c-8 0-13 3.5-13 10a6 6 0 0 0 6 6c6.5 0 7-8 7-16Z', 'M4 20c3-4 6-7 11-10'];
  }
  if (/seguridad|acceso|control|privad|porton/.test(normalized)) {
    return ['M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z', 'm9 12 2 2 4-4'];
  }
  if (/cancha|deport|gimnasio/.test(normalized)) {
    return ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M3.5 9h17', 'M3.5 15h17', 'M9 3.5c2 2.2 3 5.1 3 8.5s-1 6.3-3 8.5', 'M15 3.5c-2 2.2-3 5.1-3 8.5s1 6.3 3 8.5'];
  }
  if (/juego|infantil|nino|familia/.test(normalized)) {
    return ['M12 3v3', 'M12 18v3', 'M3 12h3', 'M18 12h3', 'm5.6 5.6 2.1 2.1', 'm16.3 16.3 2.1 2.1', 'm18.4 5.6-2.1 2.1', 'm7.7 16.3-2.1 2.1', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'];
  }
  if (/palapa|terraza|salon|area comun/.test(normalized)) {
    return ['M3 11 12 4l9 7', 'M5 10v10h14V10', 'M9 20v-6h6v6'];
  }
  return ['M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z'];
}

function appendAmenityCards(container, amenities) {
  amenities.forEach((amenity) => {
    const card = document.createElement('article');
    card.className = 'property-amenity-card';

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.6');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    icon.classList.add('property-amenity-icon');
    getAmenityIconPaths(amenity).forEach((pathData) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      icon.appendChild(path);
    });

    const label = document.createElement('span');
    label.className = 'property-amenity-label';
    label.textContent = amenity;
    card.append(icon, label);
    container.appendChild(card);
  });
}

function appendSpecs(specs, container) {
  Object.entries(specs).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    const row = document.createElement('div');
    row.className = 'border border-gold-400/15 bg-ink-800 p-4';
    const label = document.createElement('dt');
    label.className = 'text-xs uppercase tracking-wider text-gold-400';
    label.textContent = PROPERTY_SPEC_LABELS[key] || key.replace(/_/g, ' ');
    const detail = document.createElement('dd');
    detail.className = 'mt-2 text-gold-100';
    detail.textContent = String(value);
    row.append(label, detail);
    container.appendChild(row);
  });
}

function showSection(id, visible) {
  document.getElementById(id).classList.toggle('hidden', !visible);
}

function getYouTubeVideoId(url) {
  if (typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();
    let videoId = null;

    if (host === 'youtu.be') {
      videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      videoId = parsedUrl.pathname === '/watch'
        ? parsedUrl.searchParams.get('v')
        : parsedUrl.pathname.split('/').filter(Boolean).pop();
    }

    return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}

function createYouTubeFrame(videoId, { autoplay = false, controls = true, loop = false } = {}) {
  const parameters = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: controls ? '1' : '0',
    mute: autoplay ? '1' : '0',
    playsinline: '1',
    rel: '0',
  });
  if (loop) {
    parameters.set('loop', '1');
    parameters.set('playlist', videoId);
  }

  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?${parameters.toString()}`;
  frame.title = 'Video de la propiedad';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  return frame;
}

function renderPropertyVideos(videos) {
  const validVideos = Array.isArray(videos)
    ? videos.map((video) => ({
      video,
      videoId: getYouTubeVideoId(video && video.url),
    })).filter(({ videoId }) => videoId)
    : [];

  const hero = document.getElementById('property-hero-video');
  const overlay = document.getElementById('property-video-overlay');
  const gallery = document.getElementById('property-videos');
  const videoCount = document.getElementById('property-video-count');

  if (validVideos.length > 0) {
    hero.appendChild(createYouTubeFrame(validVideos[0].videoId, { autoplay: true, controls: false }));
    hero.classList.remove('hidden');
    overlay.classList.remove('hidden');
    videoCount.textContent = `(${validVideos.length})`;

    validVideos.forEach(({ video, videoId }) => {
      const item = document.createElement('article');
      item.className = 'property-video-widget';
      const frameContainer = document.createElement('div');
      frameContainer.className = 'property-gallery-item';
      frameContainer.appendChild(createYouTubeFrame(videoId));

      const title = document.createElement('h3');
      title.className = 'font-display text-lg text-gold-100';
      title.textContent = typeof video.title === 'string' && video.title.trim()
        ? video.title
        : 'Video de la propiedad';
      item.append(frameContainer, title);

      if (typeof video.description === 'string' && video.description.trim()) {
        const description = document.createElement('p');
        description.className = 'text-sm leading-relaxed text-gold-100/60';
        description.textContent = video.description;
        item.appendChild(description);
      }
      gallery.appendChild(item);
    });
  }

  showSection('property-videos-section', validVideos.length > 0);
}

function renderProperty(property) {
  const specs = property.technical_specs;
  document.title = `${property.name} | Realtor's Pro`;
  document.querySelector('meta[name="description"]').content =
    `${property.name} en ${property.location}. Consulta características y opciones con Realtor's Pro.`;
  document.getElementById('property-name').textContent = property.name;
  document.getElementById('property-type').textContent = specs.type || 'Propiedad';
  document.getElementById('property-location').textContent = property.location;
  document.getElementById('property-price').textContent =
    specs.reference_price || specs.starting_price || 'Precio por confirmar';
  document.getElementById('property-contact-link').href =
    `/?propiedad=${encodeURIComponent(property.name)}#contacto`;
  renderPropertyVideos(property.videos);

  const description = property.location_description;
  const development = property.development;
  if (description) {
    document.getElementById('property-description').textContent = description;
  }
  if (development) {
    document.getElementById('property-development').textContent = development;
  }
  showSection('property-description-section', Boolean(description || development));
  showSection('property-development', Boolean(development));

  appendSpecs(specs, document.getElementById('property-specs'));
  showSection('property-specs-section', Object.keys(specs).length > 0);

  const features = property.features || property.layout || [];
  if (features.length > 0) {
    appendListItems(document.getElementById('property-features'), features);
  }
  showSection('property-features-section', features.length > 0);

  const amenities = [...(property.amenities || []), ...(property.amenities_and_security || [])];
  if (amenities.length > 0) {
    appendAmenityCards(document.getElementById('property-amenities'), [...new Set(amenities)]);
  }
  showSection('property-amenities-section', amenities.length > 0);
  showSection('property-lists-section', features.length > 0 || amenities.length > 0);

  if (property.ideal_for) {
    document.getElementById('property-ideal').textContent = property.ideal_for;
  }
  showSection('property-ideal-section', Boolean(property.ideal_for));

  if (property.address) {
    document.getElementById('property-address').textContent = property.address;
  }
  showSection('property-address-section', Boolean(property.address));

  if (Array.isArray(property.financing) && property.financing.length > 0) {
    appendListItems(document.getElementById('property-financing'), property.financing);
  }
  showSection('property-financing-section', Array.isArray(property.financing) && property.financing.length > 0);
  document.getElementById('property-status').remove();
}

async function loadPropertyDetail() {
  const parameters = new URLSearchParams(window.location.search);
  const slug = parameters.get('slug');
  const name = parameters.get('name');
  const requestedIdentifier = normalizePropertyIdentifier(slug || name || '');
  const status = document.getElementById('property-status');

  if (!requestedIdentifier) {
    status.textContent = 'Selecciona una propiedad desde el catálogo para consultar su información.';
    return;
  }

  try {
    const response = await fetch(PROPERTIES_API_URL);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el catálogo de propiedades (${response.status}).`);
    }

    const catalog = await response.json();
    if (!catalog || !Array.isArray(catalog.properties)) {
      throw new Error('El catálogo de propiedades tiene un formato no válido.');
    }

    const property = catalog.properties.find((item) =>
      normalizePropertyIdentifier(item.name) === requestedIdentifier
    );
    if (!property) {
      status.textContent = 'No encontramos esa propiedad. Revisa el nombre o slug e inténtalo nuevamente.';
      return;
    }

    renderProperty(property);
  } catch (error) {
    console.error('Error al cargar el detalle de la propiedad:', error);
    status.textContent = 'No fue posible cargar la propiedad. Intenta nuevamente más tarde.';
  }
}

loadPropertyDetail();
