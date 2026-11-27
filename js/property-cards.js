const PROPERTY_CARD_BACKGROUNDS = [
  'from-gold-900 via-ink-700 to-ink-950',
  'from-ink-600 via-gold-800 to-ink-950',
  'from-gold-950 via-ink-800 to-gold-700',
];
const PROPERTIES_API_URL = 'https://realtors-pro.free.beeceptor.com/properties';

function createPropertyDetail(text) {
  const detail = document.createElement('li');
  detail.textContent = text;
  return detail;
}

function createPropertyCard(property, index, layout) {
  const specs = property.technical_specs;
  const area = specs.total_area || specs.area || specs.built_area;
  const price = specs.reference_price || specs.starting_price || 'Precio por confirmar';
  const details = [
    Number.isFinite(specs.bedrooms) ? `${specs.bedrooms} rec.` : null,
    Number.isFinite(specs.bathrooms) ? `${specs.bathrooms} baños` : null,
    Number.isFinite(specs.parking)
      ? `${specs.parking} ${specs.parking === 1 ? 'estacionamiento' : 'estacionamientos'}`
      : null,
    area || null,
  ].filter(Boolean);

  const card = document.createElement('article');
  card.className = layout === 'featured'
    ? 'group/card bg-ink-800 border border-gold-400/10 rounded-lg overflow-hidden hover:border-gold-400/50 hover:shadow-gold transition'
    : 'rounded-lg border border-gold-400/15 bg-ink-800 p-6';

  const propertyLink = document.createElement('a');
  const slug = property.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  propertyLink.href = `/property/?slug=${encodeURIComponent(slug)}`;
  propertyLink.className = 'block h-full';
  propertyLink.setAttribute('aria-label', `Ver detalles de ${property.name}`);

  if (layout === 'featured') {
    const visual = document.createElement('div');
    visual.className = `relative h-56 bg-gradient-to-br ${PROPERTY_CARD_BACKGROUNDS[index % PROPERTY_CARD_BACKGROUNDS.length]}`;

    const type = document.createElement('span');
    type.className = 'absolute top-4 left-4 bg-ink-950/80 border border-gold-400/50 text-gold-200 text-[0.65rem] font-semibold uppercase tracking-wider px-3 py-1 rounded-sm';
    type.textContent = specs.type || 'Propiedad';

    const priceLabel = document.createElement('span');
    priceLabel.className = 'absolute bottom-4 right-4 font-display text-2xl text-gold-200';
    priceLabel.textContent = price;
    visual.append(type, priceLabel);

    const content = document.createElement('div');
    content.className = 'p-6 space-y-3';
    const location = document.createElement('p');
    location.className = 'text-xs uppercase tracking-wider text-gold-400';
    location.textContent = property.location;

    const name = document.createElement('h3');
    name.className = 'font-display text-2xl text-gold-50 group-hover/card:text-gold-300 transition';
    name.textContent = property.name;

    const detailList = document.createElement('ul');
    detailList.className = 'flex flex-wrap gap-x-5 gap-y-2 text-sm text-gold-100/60 pt-2 border-t border-gold-400/10';
    details.forEach((detail) => detailList.appendChild(createPropertyDetail(detail)));
    content.append(location, name, detailList);
    propertyLink.append(visual, content);
    card.appendChild(propertyLink);
    return card;
  }

  const location = document.createElement('p');
  location.className = 'text-xs uppercase tracking-wider text-gold-400';
  location.textContent = property.location;

  const name = document.createElement('h3');
  name.className = 'mt-3 font-display text-2xl text-gold-100';
  name.textContent = property.name;

  const detailList = document.createElement('ul');
  detailList.className = 'mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gold-100/60';
  details.forEach((detail) => detailList.appendChild(createPropertyDetail(detail)));

  const priceLabel = document.createElement('p');
  priceLabel.className = 'mt-5 font-display text-2xl text-gold-300';
  priceLabel.textContent = price;

  propertyLink.append(location, name, detailList, priceLabel);
  card.appendChild(propertyLink);
  return card;
}

async function renderPropertyCards() {
  const containers = document.querySelectorAll('[data-property-cards]');
  if (containers.length === 0) {
    return;
  }

  const statuses = document.querySelectorAll('[data-property-status]');
  try {
    const response = await fetch(PROPERTIES_API_URL);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el catálogo de propiedades (${response.status}).`);
    }

    const catalog = await response.json();
    if (!catalog || !Array.isArray(catalog.properties)) {
      throw new Error('El catálogo de propiedades tiene un formato no válido.');
    }
    if (catalog.properties.length === 0) {
      statuses.forEach((status) => {
        status.textContent = 'No hay propiedades disponibles.';
      });
      return;
    }

    catalog.properties.forEach((property, index) => {
      if (!property || typeof property.name !== 'string' || typeof property.location !== 'string'
        || !property.technical_specs || typeof property.technical_specs !== 'object') {
        throw new Error(`La propiedad ${index + 1} no tiene los datos necesarios para mostrarse.`);
      }
    });

    containers.forEach((container) => {
      const fragment = document.createDocumentFragment();
      catalog.properties.forEach((property, index) => {
        fragment.appendChild(createPropertyCard(property, index, container.dataset.propertyCards));
      });
      container.replaceChildren(fragment);
    });
    statuses.forEach((status) => status.remove());
  } catch (error) {
    console.error('Error al cargar las tarjetas de propiedades:', error);
    statuses.forEach((status) => {
      status.textContent = 'No fue posible cargar las propiedades. Intenta nuevamente más tarde.';
      status.classList.remove('hidden');
    });
  }
}

renderPropertyCards();
