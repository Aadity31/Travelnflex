# Booking Security Architecture

## Core Rule

**Client NEVER sends pricing data.**

### Client Sends (Safe)
```json
{
  "destination": "rishikesh",
  "startDate": "2024-03-15",
  "endDate": "2024-03-17",
  "persons": 4,
  "packageType": "family",
  "rooms": 2
}
```

### Client MUST NOT Send
- `amount`
- `pricePerPerson`
- Any calculated values

---

## Client-Side ([`BookNowButton.tsx`](uk/src/components/booking/BookNowButton.tsx))

- Input sanitization (XSS prevention)
- Rate limiting (2-second cooldown)
- No pricing stored in session

## Server-Side ([`bookings/create/route.ts`](uk/src/app/api/bookings/create/route.ts))

1. **Fetch prices from database** (not client)
2. **Calculate amount server-side**
3. **Validate package rules**:
   - Solo: max 1 person, 1 room
   - Family: max 10 persons
   - Group: max 30 persons
   - Private: min 5, max 100 persons
4. **Validate discounts** (check expiration)
5. **Check slot availability** (atomic update)

## Payment ([`payments/create-order/route.ts`](uk/src/app/api/payments/create-order/route.ts))

- Fetch amount from `bookings.amount` (database)
- `FOR UPDATE` locks row (prevents race conditions)
- Check existing pending payment

## Database Schema

```sql
ALTER TABLE bookings ADD COLUMN package_type VARCHAR(20);
ALTER TABLE bookings ADD COLUMN price_snapshot JSONB;
```

## Attack Protection

| Attack | Protection |
|--------|------------|
| Modify amount in DevTools | Amount ignored, fetched from DB |
| Expired discount | Server checks `valid_until` |
| Invalid persons | Check constraints (1-50) |
| Unavailable date | Slot availability check |
| Race condition | `FOR UPDATE` locking |

---

Run `uk/scripts/security-migration.sql` to apply schema changes.
