# Meilisearch - Referencia Avanzada

## Configuración de Índices por Caso de Uso

### E-commerce Inventory

```typescript
// inventario completo con facetas
await index.updateFilterableAttributes([
  'category',
  'brand',
  'price',
  'color',
  'size',
  'inStock',
  'rating',
]);

await index.updateSortableAttributes([
  'price',
  'createdAt',
  'rating',
  'sales',
]);

await index.updateDisplayedAttributes([
  'title',
  'description',
  'price',
  'image',
  'category',
  'rating',
]);
```

### Blog / Contenido

```typescript
await index.updateFilterableAttributes([
  'author',
  'publishedAt',
  'tags',
  'category',
]);

await index.updateSortableAttributes([
  'publishedAt',
  'readingTime',
]);

await index.updateStopWords([
  'el', 'la', 'los', 'las', 'de', 'del', 'en',
  'que', 'es', 'son', 'para', 'por', 'con',
]);
```

## Búsqueda Avanzada

### Búsqueda con Facetas

```typescript
const results = await index.search('escritorio', {
  filter: 'price >= 100 AND price <= 500',
  facets: ['category', 'brand'],
  attributesToRetrieve: ['title', 'price', 'category'],
  limit: 20,
  offset: 0,
});

// results.facetDistribution contiene el conteo por faceta
console.log(results.facetDistribution);
```

### Búsqueda con highlighting

```typescript
const results = await index.search('silla oficina', {
  attributesToHighlight: ['title', 'description'],
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
});

results.hits.forEach(hit => {
  console.log(hit._formatted.title); // Con highlights
});
```

### Búsqueda Geoespacial

```typescript
// Meilisearch no tiene geo nativamente, pero puedes simularlo
const results = await index.search('', {
  filter: '_geo = {"lat": 40.7128, "lng": -74.0060, "radius": "50km"}',
});
```

## Optimización de Performance

### Paginación Eficiente

```typescript
// En lugar de offset, usar cursor-based pagination
const results = await index.search('query', {
  limit: 20,
  filter: 'lastId > 12345', // lastId del último resultado anterior
});
```

### Batch Operations

```typescript
// Importar documentos en batch (máx 1000 por request)
const documents = [...]; // hasta 1000 docs
await index.addDocuments(documents);

// Para más de 1000, dividir en chunks
const chunks = chunk(documents, 1000);
for (const chunk of chunks) {
  await index.addDocuments(chunk);
}
```

### Cold Start Prevention

```typescript
// Crear index con settings desde el inicio (evita cold start)
await meili.createIndex('products', {
  primaryKey: 'id',
});

const index = meili.index('products');
await index.updateSettings({
  searchableAttributes: ['title', 'description'],
  filterableAttributes: ['category', 'price'],
  sortableAttributes: ['price', 'createdAt'],
});
```

## Rate Limiting y Seguridad

### API Keys con Permisos

```typescript
// Crear API key para lectura pública
const publicKey = await meili.createApiKey({
  name: 'Public Search Key',
  description: 'Key para búsqueda pública',
  actions: ['search'],
  indexes: ['products'],
  expiresAt: '2027-01-01',
});

// Crear API key para admin
const adminKey = await meili.createApiKey({
  name: 'Admin Key',
  actions: ['*'], // todas las acciones
  indexes: ['*'], // todos los índices
});
```

### Rate Limiting (Middleware)

```typescript
// En tu API route
export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  const rateLimit = await redis.get(`rate:${ip}`);
  
  if (rateLimit > 100) {
    return new Response('Too many requests', { status: 429 });
  }
  
  await redis.incr(`rate:${ip}`);
  await redis.expire(`rate:${ip}`, 60);
}
```

## Integración con Next.js

### Server Component

```typescript
// app/search/page.tsx
import { meili } from '@/lib/meilisearch';

export default async function SearchPage({
  searchParams,
}: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  const results = await meili.index('products').search(query, {
    limit: 20,
    filter: 'inStock = true',
  });
  
  return (
    <div>
      {results.hits.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Revalidación

```typescript
// Revalidar cada hora
export const revalidate = 3600;

// O revalidar on-demand cuando cambia el inventory
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, data: any) {
  await db.product.update({ where: { id }, data });
  revalidatePath('/search');
  revalidatePath(`/inventory/${id}`);
}
```

## Recursos

- [Meilisearch Docs](https://www.meilisearch.com/docs)
- [Meilisearch GitHub](https://github.com/meilisearch/meilisearch)
- [Meilisearch Blog](https://blog.meilisearch.com)