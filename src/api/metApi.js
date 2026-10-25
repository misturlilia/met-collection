const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection';

const apiCache = new Map();

export const transformArtworkData = (raw) => ({
  id: raw.objectID,
  title: raw.title || 'Без назви',
  artist: raw.artistDisplayName || 'Невідомий автор',
  year: raw.objectDate || raw.accessionYear || 'Дата невідома',
  medium: raw.medium || 'Матеріал не вказано',
  dimensions: raw.dimensions || 'Розміри не вказані',
  department: raw.department || 'Загальна колекція',
  departmentId: raw.departmentId,
  image: raw.primaryImageSmall || raw.primaryImage || '',
  isHighlight: Boolean(raw.isHighlight),
  objectUrl: raw.objectURL || '',
});

export const fetchArtworkIds = async ({ q = '*', departmentId, hasImages = true, isHighlight }) => {
  const params = new URLSearchParams();
  params.append('q', q || '*');
  if (departmentId) params.append('departmentId', departmentId);
  if (hasImages) params.append('hasImages', 'true');
  if (isHighlight) params.append('isHighlight', 'true');

  const cacheKey = `ids_${params.toString()}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const response = await fetch(`${BASE_URL}/v1.1/search?${params.toString()}`);
  if (!response.ok) throw new Error('Помилка при завантаженні списку обʼєктів');

  const data = await response.json();
  const objectIds = data.objectIDs || [];

  apiCache.set(cacheKey, objectIds);
  return objectIds;
};

export const fetchArtworkById = async (id) => {
  const numericId = Number(id);
  const cacheKey = `artwork_${numericId}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const response = await fetch(`${BASE_URL}/v1/objects/${numericId}`);
  if (!response.ok) throw new Error(`Не вдалося завантажити обʼєкт з ID: ${numericId}`);

  const rawData = await response.json();
  const transformed = transformArtworkData(rawData);

  apiCache.set(cacheKey, transformed);
  return transformed;
};

export const fetchArtworksBatch = async (idsBatch) => {
  const promises = idsBatch.map((id) => fetchArtworkById(id).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter((item) => item !== null);
};

export const fetchRelatedArtworks = async (departmentId, currentId, limit = 4) => {
  if (!departmentId) return [];
  const ids = await fetchArtworkIds({ departmentId, hasImages: true });
  const filteredIds = ids.filter((id) => id !== Number(currentId)).slice(0, limit);
  return fetchArtworksBatch(filteredIds);
};

export const fetchDepartments = async () => {
  const cacheKey = 'departments_list';
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const response = await fetch(`${BASE_URL}/v1/departments`);
  if (!response.ok) throw new Error('Помилка завантаження відділів');

  const data = await response.json();
  const departments = data.departments || [];

  apiCache.set(cacheKey, departments);
  return departments;
};