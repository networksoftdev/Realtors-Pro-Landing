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
    appendListItems(document.getElementById('property-amenities'), [...new Set(amenities)]);
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
    const response = await fetch('/properties.json');
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
