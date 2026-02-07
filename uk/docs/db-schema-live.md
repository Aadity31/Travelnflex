# Database Schema (Live Export)

**Generated:** 2026-02-06T03:35:22.408Z
**Database:** Neon PostgreSQL

---

## Tables (19)

### activities

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | text | ❌ | - | 🔑 PRI |
| agency_code | text | ❌ | - |  |
| name | text | ❌ | - |  |
| slug | text | ❌ | - |  |
| type | text | ❌ | - |  |
| description | text | ❌ | - |  |
| short_description | text | ❌ | - |  |
| duration | text | ❌ | - |  |
| location | text | ❌ | - |  |
| difficulty | text | ❌ | - |  |
| rating | numeric | ✅ | 0 |  |
| review_count | integer | ✅ | 0 |  |
| max_group_size | integer | ❌ | - |  |
| cover_image | text | ❌ | - |  |
| gallery_images | ARRAY | ❌ | - |  |
| highlights | ARRAY | ❌ | - |  |
| is_popular | boolean | ✅ | false |  |
| is_trending | boolean | ✅ | false |  |
| is_active | boolean | ✅ | true |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |
| includes | ARRAY | ✅ | ARRAY[]::text[] |  |

**Foreign Keys:**
- `agency_code` → `agencies(code)`

---

### activity_discounts

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| activity_id | text | ❌ | - | 🔑 PRI |
| percentage | integer | ✅ | - |  |
| valid_until | date | ❌ | - |  |

**Foreign Keys:**
- `activity_id` → `activities(id)`

---

### activity_prices

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| activity_id | text | ❌ | - | 🔑 PRI |
| price_min | integer | ❌ | - |  |
| price_max | integer | ❌ | - |  |
| currency | text | ✅ | 'INR'::text |  |

**Foreign Keys:**
- `activity_id` → `activities(id)`

---

### admin_invites

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| email | text | ❌ | - |  |
| role | USER-DEFINED | ❌ | - |  |
| token | text | ❌ | - |  |
| expires_at | timestamp with time zone | ❌ | - |  |
| invited_by | uuid | ✅ | - |  |
| accepted_at | timestamp with time zone | ✅ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| permissions | ARRAY | ✅ | - |  |

**Foreign Keys:**
- `invited_by` → `admins(id)`

---

### admin_permissions

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| admin_id | uuid | ❌ | - |  |
| permissions | ARRAY | ❌ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |

**Foreign Keys:**
- `admin_id` → `admins(id)`

---

### admins

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| provider | text | ❌ | 'google'::text |  |
| provider_account_id | text | ❌ | - |  |
| email | text | ❌ | - |  |
| full_name | text | ✅ | - |  |
| avatar_url | text | ✅ | - |  |
| role | USER-DEFINED | ❌ | - |  |
| status | USER-DEFINED | ❌ | 'ACTIVE'::admin_entity_status |  |
| agency_id | uuid | ✅ | - |  |
| hotel_id | uuid | ✅ | - |  |
| created_by | uuid | ✅ | - |  |
| last_login_at | timestamp with time zone | ✅ | - |  |
| created_at | timestamp with time zone | ❌ | now() |  |
| updated_at | timestamp with time zone | ❌ | now() |  |
| deleted_at | timestamp with time zone | ✅ | - |  |

**Foreign Keys:**
- `created_by` → `admins(id)`
- `agency_id` → `agencies(uuid)`

---

### agencies

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | integer | ❌ | nextval('agencies_id_seq'::regclass) | 🔑 PRI |
| code | text | ❌ | - |  |
| name | text | ❌ | - |  |
| status | USER-DEFINED | ❌ | 'PENDING'::admin_entity_status |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| uuid | uuid | ❌ | gen_random_uuid() |  |
| business_phone | text | ❌ | - |  |
| owner_phone | text | ❌ | - |  |
| established_year | integer | ❌ | - |  |
| city | text | ❌ | - |  |
| state | text | ❌ | - |  |
| pincode | text | ❌ | - |  |
| nearby_landmark | text | ✅ | - |  |
| pan_number | text | ❌ | - |  |
| gst_number | text | ✅ | - |  |
| registration_number | text | ✅ | - |  |
| iata_number | text | ✅ | - |  |
| website_url | text | ✅ | - |  |
| description | text | ❌ | - |  |
| address | text | ❌ | - |  |
| logo_url | text | ✅ | - |  |

---

### bookings

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| user_id | uuid | ❌ | - |  |
| destination | character varying | ❌ | - |  |
| package_name | character varying | ✅ | - |  |
| start_date | date | ❌ | - |  |
| end_date | date | ❌ | - |  |
| persons | integer | ❌ | - |  |
| amount | numeric | ❌ | - |  |
| status | character varying | ❌ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |

**Foreign Keys:**
- `user_id` → `users(id)`

---

### destination_discounts

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| destination_id | text | ❌ | - | 🔑 PRI |
| percentage | integer | ✅ | - |  |
| valid_until | date | ❌ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| applies_to | ARRAY | ❌ | ARRAY['solo'::text, 'family'::text, 'private'::text, 'group'::text] |  |

**Foreign Keys:**
- `destination_id` → `destinations(id)`

---

### destination_itinerary

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| destination_id | text | ❌ | - |  |
| day_number | integer | ❌ | - |  |
| title | text | ❌ | - |  |
| description | text | ✅ | - |  |
| places | ARRAY | ✅ | '{}'::text[] |  |
| activity_ids | ARRAY | ✅ | '{}'::text[] |  |
| hotel_name | text | ✅ | - |  |
| hotel_images | ARRAY | ✅ | '{}'::text[] |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |

**Foreign Keys:**
- `destination_id` → `destinations(id)`

---

### destination_prices

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| destination_id | text | ❌ | - | 🔑 PRI |
| price_per_person | integer | ❌ | - |  |
| currency | text | ✅ | 'INR'::text |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |
| solo_price | integer | ❌ | 0 |  |
| family_price | integer | ❌ | 0 |  |
| private_price | integer | ❌ | 0 |  |
| group_price | integer | ❌ | 0 |  |

**Foreign Keys:**
- `destination_id` → `destinations(id)`

---

### destinations

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | text | ❌ | - | 🔑 PRI |
| agency_code | text | ❌ | - |  |
| name | text | ❌ | - |  |
| slug | text | ❌ | - |  |
| short_description | text | ❌ | - |  |
| description | text | ✅ | - |  |
| cover_image | text | ❌ | - |  |
| gallery_images | ARRAY | ✅ | '{}'::text[] |  |
| location | text | ❌ | - |  |
| best_time_to_visit | text | ✅ | - |  |
| average_rating | numeric | ✅ | 0 |  |
| review_count | integer | ✅ | 0 |  |
| highlights | ARRAY | ✅ | '{}'::text[] |  |
| popular_activities | ARRAY | ✅ | '{}'::text[] |  |
| badge_text | text | ✅ | - |  |
| badge_type | text | ✅ | - |  |
| is_active | boolean | ✅ | true |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |
| hotel_images | ARRAY | ❌ | '{}'::text[] |  |

**Foreign Keys:**
- `agency_code` → `agencies(code)`

---

### guides

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| agency_id | uuid | ❌ | - |  |
| created_by | uuid | ✅ | - |  |
| code | text | ❌ | - |  |
| full_name | text | ❌ | - |  |
| email | text | ✅ | - |  |
| phone | text | ❌ | - |  |
| languages | ARRAY | ❌ | - |  |
| skills | ARRAY | ✅ | - |  |
| bio | text | ✅ | - |  |
| profile_image_url | text | ✅ | - |  |
| status | USER-DEFINED | ❌ | 'AVAILABLE'::guide_status |  |
| current_assignment | text | ✅ | - |  |
| assignment_end_date | date | ✅ | - |  |
| city | text | ✅ | - |  |
| state | text | ✅ | - |  |
| country | text | ✅ | 'India'::text |  |
| govt_id_number | text | ✅ | - |  |
| license_number | text | ✅ | - |  |
| is_verified | boolean | ✅ | false |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |
| deleted_at | timestamp with time zone | ✅ | - |  |

**Foreign Keys:**
- `agency_id` → `agencies(uuid)`
- `created_by` → `admins(id)`

---

### notifications

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | bigint | ❌ | nextval('notifications_id_seq'::regclass) | 🔑 PRI |
| type | character varying | ❌ | - |  |
| title | character varying | ❌ | - |  |
| message | text | ❌ | - |  |
| data | jsonb | ✅ | '{}'::jsonb |  |
| is_read | boolean | ✅ | false |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| user_id | uuid | ✅ | - |  |
| link | text | ✅ | - |  |

**Foreign Keys:**
- `user_id` → `users(id)`

---

### otp_verifications

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| email | text | ❌ | - |  |
| otp_hash | text | ❌ | - |  |
| expires_at | timestamp with time zone | ❌ | - |  |
| attempts | integer | ✅ | 0 |  |
| verified | boolean | ✅ | false |  |
| user_data | jsonb | ✅ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |

---

### payments

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| user_id | uuid | ❌ | - |  |
| booking_id | uuid | ❌ | - |  |
| amount | numeric | ❌ | - |  |
| currency | character varying | ✅ | 'INR'::character varying |  |
| status | character varying | ❌ | - |  |
| payment_method | character varying | ✅ | - |  |
| gateway | character varying | ✅ | - |  |
| gateway_order_id | text | ✅ | - |  |
| gateway_payment_id | text | ✅ | - |  |
| gateway_signature | text | ✅ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |

**Foreign Keys:**
- `user_id` → `users(id)`
- `booking_id` → `bookings(id)`

---

### profiles

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| user_id | uuid | ❌ | - |  |
| phone | character varying | ✅ | - |  |
| location | character varying | ✅ | - |  |
| bio | text | ✅ | - |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |
| traveller_type | character varying | ✅ | - |  |
| passport_number | character varying | ✅ | - |  |
| emergency_contact_name | character varying | ✅ | - |  |
| emergency_contact_phone | character varying | ✅ | - |  |
| pickup_type | character varying | ✅ | - |  |
| pickup_state | character varying | ✅ | - |  |
| pickup_city | character varying | ✅ | - |  |
| pickup_address | text | ✅ | - |  |
| pickup_pincode | character varying | ✅ | - |  |
| pickup_landmark | text | ✅ | - |  |
| pickup_latitude | numeric | ✅ | - |  |
| pickup_longitude | numeric | ✅ | - |  |
| food_preference | character varying | ✅ | - |  |
| medical_notes | text | ✅ | - |  |
| age_group | character varying | ✅ | - |  |
| gender | character varying | ✅ | - |  |
| id_type | character varying | ✅ | - |  |
| id_number_masked | character varying | ✅ | - |  |
| id_document_url | text | ✅ | - |  |

**Foreign Keys:**
- `user_id` → `users(id)`

---

### users

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| name | text | ✅ | - |  |
| email | text | ❌ | - |  |
| image | text | ✅ | - |  |
| password_hash | text | ✅ | - |  |
| auth_provider | text | ❌ | - |  |
| google_id | text | ✅ | - |  |
| email_verified | boolean | ✅ | false |  |
| created_at | timestamp with time zone | ✅ | now() |  |
| updated_at | timestamp with time zone | ✅ | now() |  |

---

### wishlist

| Column | Type | Nullable | Default | Key |
|--------|------|----------|---------|-----|
| id | uuid | ❌ | gen_random_uuid() | 🔑 PRI |
| user_id | uuid | ❌ | - |  |
| created_at | timestamp without time zone | ✅ | now() |  |
| item_id | text | ❌ | - |  |

**Foreign Keys:**
- `user_id` → `users(id)`

---

