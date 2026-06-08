# Payload CMS v3 - Referencia Avanzada

## Colecciones Comunes para E-commerce

### Products Collection

```typescript
{
  slug: 'products',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'richText' },
    { name: 'price', type: 'number', required: true },
    { name: 'compareAtPrice', type: 'number' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'inventory', type: 'number', defaultValue: 0 },
    { name: 'sku', type: 'text' },
    { name: 'weight', type: 'number' },
    { name: 'dimensions', type: 'group', fields: [
      { name: 'length', type: 'number' },
      { name: 'width', type: 'number' },
      { name: 'height', type: 'number' }
    ]},
    { name: 'status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'draft' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ]
}
```

### Categories Collection

```typescript
{
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'parent', type: 'relationship', relationTo: 'categories' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ]
}
```

### Orders Collection

```typescript
{
  slug: 'orders',
  admin: { useAsTitle: 'orderNumber' },
  access: {
    read: ({ req }) => req.user,
    update: ({ req }) => req.user,
  },
  fields: [
    { name: 'orderNumber', type: 'text', unique: true },
    { name: 'customer', type: 'relationship', relationTo: 'users' },
    { name: 'items', type: 'array', fields: [
      { name: 'product', type: 'relationship', relationTo: 'products' },
      { name: 'quantity', type: 'number' },
      { name: 'price', type: 'number' }
    ]},
    { name: 'subtotal', type: 'number' },
    { name: 'tax', type: 'number' },
    { name: 'total', type: 'number' },
    { name: 'status', type: 'select', options: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] },
    { name: 'shippingAddress', type: 'json' },
    { name: 'notes', type: 'textarea' },
  ]
}
```

## Hooks Comunes

### Auto-generate slug desde title

```typescript
import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data.title && !data.slug) {
            data.slug = data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
          }
        }
        return data;
      },
    ],
  },
  // ... resto de la config
};
```

### Inventory tracking

```typescript
beforeChange: [
  async ({ data, req, operation }) => {
    if (operation === 'update' && data.inventory !== undefined) {
      const previousDoc = await req.payload.findByID({
        collection: 'products',
        id: req.id,
        depth: 0,
      });
      
      if (previousDoc.inventory !== data.inventory) {
        // Log de cambio de inventario
        console.log(`Inventory changed: ${previousDoc.inventory} -> ${data.inventory}`);
      }
    }
    return data;
  },
],
```

### Soft Delete

```typescript
fields: [
  {
    name: 'deleted',
    type: 'checkbox',
    defaultValue: false,
    admin: { hidden: true },
  },
],
hooks: {
  beforeChange: [
    ({ data, operation }) => {
      if (operation === 'delete') {
        return { ...data, deleted: true };
      }
      return data;
    },
  ],
},
```

## Variables de Entorno

```env
MONGODB_URI=mongodb://localhost:27017/payload
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
MEILI_HOST=http://localhost:7700
MEILI_KEY=masterKey
```

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Generar tipos de TypeScript
npm run payload:generate

# Migrar base de datos
npx payload migrate

# Reset de base de datos (desarrollo)
npx payload migration:create --name init

# Build para producción
npm run build
```

## Recursos

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Payload Discord](https://discord.com/invite/payload)
- [Awesome Payload](https://github.com/payload-integrations/awesome-payload)