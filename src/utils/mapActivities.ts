```typescript
// filepath: c:\Users\Asus\Downloads\Devbhoomi_Darshan-\src\types\Activity.ts
export interface Activity {
  id: string;
  name: string;
  // ...other fields...
  reviews?: Review[]; // made optional
}
```

```typescript
// ...existing code...
return rows.map((r): Activity => ({
  id: r.id,
  name: r.name,
  // ...other fields...
  rating: r.rating ?? 0,
  reviewCount: r.reviewCount ?? 0,
  reviews: r.reviews ?? [], // <- add this (or map items if needed)
}));
// ...existing code...
```