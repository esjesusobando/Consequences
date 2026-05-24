---
name: payload-cms-v3
description: > Triggers on: Payload, Payload CMS, CMS, admin panel.
  Payload CMS v3 patterns - TypeScript-native headless CMS with admin panel.
  Trigger: When setting up CMS, collections, migrations, or admin panels.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Collections Schema (AOLI Use Case)

```typescript
// payload.config.ts
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexorMarkdown } from '@payloadcms/richtext-lexor';

export default buildConfig({
  admin: {
    user: 'users',
  },
  db: mongooseAdapter({
    uri: process.env.MONGODB_URI,
  }),
  collections: [
    {
      slug: 'products',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: ['desk', 'chair', 'cabinet', 'table', 'other'],
        },
        {
          name: 'price',
          type: 'number',
        },
        {
          name: 'condition',
          type: 'select',
          options: ['new', 'like-new', 'good', 'fair'],
        },
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: './media',
        imageSizes: [
          { name: 'thumbnail', width: 300 },
          { name: 'card', width: 600 },
          { name: 'og', width: 1200 },
        ],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
});
```

## Lifecycle Hooks (Meilisearch Sync)

```typescript
// hooks/products.ts
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_KEY,
});

export const syncToMeilisearch: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  if (operation === 'create' || operation === 'update') {
    await client.index('products').addDocuments([{
      id: doc.id,
      title: doc.title,
      category: doc.category,
      price: doc.price,
      condition: doc.condition,
      available: doc.available,
    }]);
  }
};

export const removeFromMeilisearch: CollectionAfterDeleteHook = async ({
  doc,
}) => {
  await client.index('products').deleteDocument(doc.id);
};
```

## API Usage (Next.js)

```typescript
// lib/payload.ts
import { getPayload } from 'payload';
import config from '@payload-config';

export const getProducts = async (query = {}) => {
  const payload = await getPayload({ config });
  
  const products = await payload.find({
    collection: 'products',
    where: query,
    limit: 20,
    sort: '-createdAt',
  });
  
  return products.docs;
};
```

## Auth (Better Auth Integration)

```typescript
// Using Better Auth with Payload
import { betterAuth } from 'better-auth';
import { payloadAdapter } from 'better-auth/adapters/payload';

export const auth = betterAuth({
  database: payloadAdapter({
    payload,
    collectionName: 'users',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

## Keywords

payload, cms, admin, collections, mongodb, headless, payload-config

## Esencia Original

> **Propósito:** CMS type-safe con panel admin para clientes
> **Flujo:** Collections → Hooks → Meilisearch → Next.js Frontend

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: `mongooseAdapter not found`
  - **Por qué**: Debe instalarse `@payloadcms/db-mongodb`
  - **Solución**: `npm install @payloadcms/db-mongodb`

- **[ERROR]**: Hooks no se ejecutan en local
  - **Por qué**: Necesario `--experimental` flag
  - **Solución**: Usar `payload serve` con la config correcta

- **[ERROR]**: Images no cargan
  - **Por qué**: Falta staticDir configurado
  - **Solución**: Agregar `upload: { staticDir: './media' }` en colección media

## 💾 State Persistence

Guardar en:
- `03_Knowledge/` — Documentación
- `04_Operations/` — Estado activo