# Database Schema Documentation

This document describes the Neon PostgreSQL database schema for Devbhoomi Darshan.

## Overview

- **Database**: Neon (postgresql)
- **Host**: ep-falling-mud-a1elen0p-pooler.ap-southeast-1.aws.neon.tech
- **Database**: neondb
- **SSL**: Required

## Connection

```env
DATABASE_URL=postgresql://neondb_owner:npg_***@ep-falling-mud-a1elen0p-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## Tables

### 1. `users`
Stores user authentication information.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | UUID | NO | gen_random_uuid() | PRIMARY |
| name | TEXT | YES | NULL | |
| email | TEXT | NO | NULL | UNIQUE |
| image | TEXT | YES | NULL | |
| password_hash | TEXT | YES | NULL | |
| auth_provider | TEXT | NO | NULL | CHECK (google, credentials) |
| google_id | TEXT | YES | NULL | UNIQUE |
| email_verified | BOOLEAN | NO | FALSE | |
| created_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | |

**Auto-trigger**: Creates profile on user insert

---

### 2. `profiles`
Extended user profile information.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | UUID | NO | gen_random_uuid() | PRIMARY |
| user_id | UUID | NO | NULL | FOREIGN KEY → users(id) |
| phone | VARCHAR(50) | YES | NULL | |
| location | VARCHAR(255) | YES | NULL | |
| bio | TEXT | YES | NULL | CHECK (LENGTH <= 500) |
| created_at | TIMESTAMPTZ | NO | NOW() | |
| updated_at | TIMESTAMPTZ | NO | NOW() | |

**Indexes**: idx_profiles_user_id

---

### 3. `otp_verifications`
OTP verification for email authentication.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | UUID | NO | gen_random_uuid() | PRIMARY |
| email | TEXT | NO | NULL | UNIQUE |
| otp_hash | TEXT | NO | NULL | |
| expires_at | TIMESTAMPTZ | NO | NULL | |
| attempts | INT | NO | 0 | CHECK (<= 5) |
| verified | BOOLEAN | NO | FALSE | |
| user_data | JSONB | YES | NULL | |
| created_at | TIMESTAMPTZ | NO | NOW() | |

**Indexes**: idx_otp_expires_at

---

### 4. `agencies`
Travel agencies that provide activities/destinations.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | SERIAL | NO | | PRIMARY |
| code | TEXT | NO | NULL | UNIQUE |
| name | TEXT | NO | NULL | |
| status | TEXT | NO | 'active' | CHECK (active, blacklisted) |
| created_at | TIMESTAMPTZ | NO | NOW() | |

---

### 5. `activities`
Adventure/tour activities offered by agencies.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | TEXT | NO | | PRIMARY |
| agency_code | TEXT | NO | NULL | FOREIGN KEY → agencies(code) |
| name | TEXT | NO | NULL | |
| slug | TEXT | NO | NULL | UNIQUE |
| type | TEXT | NO | NULL | CHECK (adventure, spiritual, cultural, food, trekking) |
| description | TEXT | NO | NULL | |
| short_description | TEXT | NO | NULL | |
| duration | TEXT | NO | NULL | |
| location | TEXT | NO | NULL | |
| difficulty | TEXT | NO | NULL | CHECK (easy, moderate, difficult) |
| rating | NUMERIC(2,1) | NO | 0 | |
| review_count | INT | NO | 0 | |
| max_group_size | INT | NO | NULL | |
| cover_image | TEXT | NO | NULL | |
| gallery_images | TEXT[] | NO | '{}' | |
| highlights | TEXT[] | NO | '{}' | |
| includes | TEXT[] | NO | '{}' | |
| is_popular | BOOLEAN | NO | FALSE | |
| is_trending | BOOLEAN | NO | FALSE | |
| is_active | BOOLEAN | NO | TRUE | |
| created_at | TIMESTAMPTZ | NO | NOW() | |
| updated_at | TIMESTAMPTZ | NO | NOW() | |

**ID Format**: `<AGENCY_CODE>_<TYPE>_<SEQ>` (e.g., APS_ADVE_001)

---

### 6. `activity_prices`
Pricing for activities.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| activity_id | TEXT | NO | NULL | PRIMARY, FOREIGN KEY → activities(id) |
| price_min | INT | NO | NULL | CHECK (>= 0) |
| price_max | INT | NO | NULL | CHECK (>= price_min) |
| currency | TEXT | NO | 'INR' | |

---

### 7. `activity_discounts`
Discounts for activities.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| activity_id | TEXT | NO | NULL | PRIMARY, FOREIGN KEY → activities(id) |
| percentage | INT | YES | NULL | CHECK (1-90) |
| valid_until | DATE | NO | NULL | |

---

### 8. `destinations`
Travel destinations.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | TEXT | NO | | PRIMARY |
| agency_code | TEXT | NO | NULL | FOREIGN KEY → agencies(code) |
| name | TEXT | NO | NULL | |
| slug | TEXT | NO | NULL | UNIQUE |
| short_description | TEXT | NO | NULL | |
| description | TEXT | YES | NULL | |
| cover_image | TEXT | NO | NULL | |
| gallery_images | TEXT[] | NO | '{}' | |
| location | TEXT | NO | NULL | |
| best_time_to_visit | TEXT | YES | NULL | |
| average_rating | NUMERIC(2,1) | NO | 0 | |
| review_count | INT | NO | 0 | |
| highlights | TEXT[] | NO | '{}' | |
| popular_activities | TEXT[] | NO | '{}' | |
| badge_text | TEXT | YES | NULL | |
| badge_type | TEXT | YES | NULL | CHECK (popular, trending, new) |
| is_active | BOOLEAN | NO | TRUE | |
| created_at | TIMESTAMPTZ | NO | NOW() | |
| updated_at | TIMESTAMPTZ | NO | NOW() | |

**ID Format**: `<AGENCY_CODE>_DST_<SEQ>` (e.g., APS_DST_001)

---

### 9. `destination_prices`
Pricing for destinations.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| destination_id | TEXT | NO | NULL | PRIMARY, FOREIGN KEY → destinations(id) |
| price_per_person | INT | NO | NULL | CHECK (>= 0) |
| currency | TEXT | NO | 'INR' | |
| created_at | TIMESTAMPTZ | NO | NOW() | |
| updated_at | TIMESTAMPTZ | NO | NOW() | |

---

### 10. `destination_discounts`
Discounts for destinations.

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| destination_id | TEXT | NO | NULL | PRIMARY, FOREIGN KEY → destinations(id) |
| percentage | INT | YES | NULL | CHECK (1-90) |
| valid_until | DATE | NO | NULL | |
| created_at | TIMESTAMPTZ | NO | NOW() | |

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│    users    │──────▶│   profiles  │       │   agencies   │
└─────────────┘       └─────────────┘       └──────────────┘
                                                       │
                              ┌─────────────────────────┘
                              ▼
                     ┌─────────────┐         ┌──────────────────┐
                     │  activities │───────▶│  activity_prices │
                     └─────────────┘         └──────────────────┘
                            │
                            │         ┌──────────────────┐
                            └───────▶│ activity_discounts│
                                     └──────────────────┘

                     ┌─────────────┐         ┌──────────────────┐
                     │ destinations│───────▶│ destination_prices│
                     └─────────────┘         └──────────────────┘
                            │
                            │         ┌────────────────────┐
                            └───────▶│ destination_discounts│
                                     └────────────────────┘
```

---

## API Endpoints

### Get Full Schema
```
GET /api/db-schema
```

Response:
```json
{
  "success": true,
  "schema": [...],
  "sql": "CREATE TABLE ...",
  "generatedAt": "2026-02-06T03:00:00.000Z"
}
```

---

## Viewing Schema in Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/test-ui

3. Click "Refresh Schema" to fetch the latest schema from Neon

4. Toggle between:
   - **Visual Schema**: Interactive table list with columns, types, and foreign keys
   - **SQL Schema**: Complete CREATE TABLE statements

---

## Updating Schema

To modify the database schema:

1. Make changes in Neon Console OR create a migration script
2. Run the migration against your Neon database
3. Use the Refresh button in /test-ui to see updated schema

---

## Generated: 2026-02-06
