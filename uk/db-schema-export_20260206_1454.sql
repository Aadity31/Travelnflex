-- ============================================================
-- SCHEMA METADATA
-- ============================================================
-- 
-- Database: Neon PostgreSQL
-- Host: ep-falling-mud-a1elen0p-pooler.ap-southeast-1.aws.neon.tech
-- Database Name: neondb
-- SSL: Required
-- 
-- Export Generated: 2026-02-06T14:54:03.351Z
-- 
-- OBJECT COUNTS:
--   - Tables: 20
--   - Views: 0
--   - Sequences: 4
--   - Functions: 42
--   - Triggers: 11
--   - Indexes: 34
--   - Constraints: 38
-- 
-- TOTAL OBJECTS: 77
-- 
-- ============================================================

-- ============================================================
-- DROP STATEMENTS (Run these first for clean recreation)
-- ============================================================

-- Disable triggers temporarily for cleaner drops
SET session_replication_role = replica;

-- Drop Triggers

-- Drop Functions
DROP FUNCTION IF EXISTS armor(bytea) CASCADE;
DROP FUNCTION IF EXISTS armor(bytea, text[], text[]) CASCADE;
DROP FUNCTION IF EXISTS create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS crypt(text, text) CASCADE;
DROP FUNCTION IF EXISTS dearmor(text) CASCADE;
DROP FUNCTION IF EXISTS decrypt(bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS decrypt_iv(bytea, bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS digest(text, text) CASCADE;
DROP FUNCTION IF EXISTS digest(bytea, text) CASCADE;
DROP FUNCTION IF EXISTS encrypt(bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS encrypt_iv(bytea, bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS gen_random_bytes(integer) CASCADE;
DROP FUNCTION IF EXISTS gen_random_uuid() CASCADE;
DROP FUNCTION IF EXISTS gen_salt(text) CASCADE;
DROP FUNCTION IF EXISTS gen_salt(text, integer) CASCADE;
DROP FUNCTION IF EXISTS generate_agency_code() CASCADE;
DROP FUNCTION IF EXISTS generate_guide_code() CASCADE;
DROP FUNCTION IF EXISTS hmac(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS hmac(bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_armor_headers(text, OUT key text, OUT value text) CASCADE;
DROP FUNCTION IF EXISTS pgp_key_id(bytea) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_decrypt(bytea, bytea, text, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_decrypt(bytea, bytea) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_decrypt(bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_decrypt_bytea(bytea, bytea, text, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_decrypt_bytea(bytea, bytea) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_decrypt_bytea(bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_encrypt(text, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_encrypt(text, bytea) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_encrypt_bytea(bytea, bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_pub_encrypt_bytea(bytea, bytea) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_decrypt(bytea, text, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_decrypt(bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_decrypt_bytea(bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_decrypt_bytea(bytea, text, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_encrypt(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_encrypt(text, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_encrypt_bytea(bytea, text) CASCADE;
DROP FUNCTION IF EXISTS pgp_sym_encrypt_bytea(bytea, text, text) CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop Tables
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS guides CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS destination_prices CASCADE;
DROP TABLE IF EXISTS destination_itinerary CASCADE;
DROP TABLE IF EXISTS destination_discounts CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS agencies CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS admin_permissions CASCADE;
DROP TABLE IF EXISTS admin_invites CASCADE;
DROP TABLE IF EXISTS activity_prices CASCADE;
DROP TABLE IF EXISTS activity_discounts CASCADE;
DROP TABLE IF EXISTS activities CASCADE;

-- Drop Sequences
DROP SEQUENCE IF EXISTS agencies_id_seq CASCADE;
DROP SEQUENCE IF EXISTS agency_seq CASCADE;
DROP SEQUENCE IF EXISTS guide_seq CASCADE;
DROP SEQUENCE IF EXISTS notifications_id_seq CASCADE;

SET session_replication_role = origin;
-- ============================================================
-- SEQUENCES
-- ============================================================

-- Sequence: agencies_id_seq
CREATE SEQUENCE agencies_id_seq
    AS INTEGER
    START WITH 1
    MINVALUE 1
    MAXVALUE 2147483647
    INCREMENT BY 1
    NO CYCLE
    OWNED BY NONE;

SELECT setval('agencies_id_seq', 23, true);

-- Sequence: agency_seq
CREATE SEQUENCE agency_seq
    AS BIGINT
    START WITH 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    INCREMENT BY 1
    NO CYCLE
    OWNED BY NONE;

-- Sequence: guide_seq
CREATE SEQUENCE guide_seq
    AS BIGINT
    START WITH 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    INCREMENT BY 1
    NO CYCLE
    OWNED BY NONE;

SELECT setval('guide_seq', 19, true);

-- Sequence: notifications_id_seq
CREATE SEQUENCE notifications_id_seq
    AS BIGINT
    START WITH 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    INCREMENT BY 1
    NO CYCLE
    OWNED BY NONE;

SELECT setval('notifications_id_seq', 76, true);

-- ============================================================
-- TABLES
-- ============================================================

-- --------------------------------------------------------------
-- Table: activities
-- --------------------------------------------------------------
CREATE TABLE activities (
    id TEXT NOT NULL,
    agency_code TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    duration TEXT NOT NULL,
    location TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    rating NUMERIC NULL DEFAULT 0,
    review_count INTEGER NULL DEFAULT 0,
    max_group_size INTEGER NOT NULL,
    cover_image TEXT NOT NULL,
    gallery_images ARRAY NULL DEFAULT '{}'::text[],
    highlights ARRAY NULL DEFAULT '{}'::text[],
    includes ARRAY NULL DEFAULT '{}'::text[],
    is_popular BOOLEAN NULL DEFAULT false,
    is_trending BOOLEAN NULL DEFAULT false,
    is_active BOOLEAN NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT activities_pkey PRIMARY KEY (id)
);

-- Table activities has 22 columns
ALTER TABLE activities 
    ADD CONSTRAINT activities_agency_code_fkey 
    FOREIGN KEY (agency_code) 
    REFERENCES agencies(code)
    ON DELETE NO ACTION
    ON UPDATE CASCADE;

ALTER TABLE activities 
    ADD CONSTRAINT activities_slug_key UNIQUE (slug);

ALTER TABLE activities 
    ADD CONSTRAINT activities_type_check CHECK ((type = ANY (ARRAY['adventure'::text, 'spiritual'::text, 'cultural'::text, 'food'::text, 'trekking'::text])));

ALTER TABLE activities 
    ADD CONSTRAINT activities_difficulty_check CHECK ((difficulty = ANY (ARRAY['easy'::text, 'moderate'::text, 'difficult'::text])));


-- --------------------------------------------------------------
-- Table: activity_discounts
-- --------------------------------------------------------------
CREATE TABLE activity_discounts (
    activity_id TEXT NOT NULL,
    percentage INTEGER NULL,
    valid_until DATE NOT NULL,
    CONSTRAINT activity_discounts_pkey PRIMARY KEY (activity_id)
);

-- Table activity_discounts has 3 columns
ALTER TABLE activity_discounts 
    ADD CONSTRAINT activity_discounts_activity_id_fkey 
    FOREIGN KEY (activity_id) 
    REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE activity_discounts 
    ADD CONSTRAINT activity_discounts_percentage_check CHECK (((percentage >= 1) AND (percentage <= 90)));


-- --------------------------------------------------------------
-- Table: activity_prices
-- --------------------------------------------------------------
CREATE TABLE activity_prices (
    activity_id TEXT NOT NULL,
    price_min INTEGER NOT NULL,
    price_max INTEGER NOT NULL,
    currency TEXT NULL DEFAULT 'INR'::text,
    CONSTRAINT activity_prices_pkey PRIMARY KEY (activity_id)
);

-- Table activity_prices has 4 columns
ALTER TABLE activity_prices 
    ADD CONSTRAINT activity_prices_activity_id_fkey 
    FOREIGN KEY (activity_id) 
    REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE activity_prices 
    ADD CONSTRAINT activity_prices_price_min_check CHECK ((price_min >= 0));

ALTER TABLE activity_prices 
    ADD CONSTRAINT activity_prices_check CHECK ((price_max >= price_min));


-- --------------------------------------------------------------
-- Table: admin_invites
-- --------------------------------------------------------------
CREATE TABLE admin_invites (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role USER-DEFINED NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    invited_by UUID NULL,
    accepted_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    permissions ARRAY NULL,
    CONSTRAINT admin_invites_pkey PRIMARY KEY (id)
);

-- Table admin_invites has 9 columns
ALTER TABLE admin_invites 
    ADD CONSTRAINT admin_invites_invited_by_fkey 
    FOREIGN KEY (invited_by) 
    REFERENCES admins(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE admin_invites 
    ADD CONSTRAINT admin_invites_token_key UNIQUE (token);


-- --------------------------------------------------------------
-- Table: admin_permissions
-- --------------------------------------------------------------
CREATE TABLE admin_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    permissions ARRAY NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT admin_permissions_pkey PRIMARY KEY (id)
);

-- Table admin_permissions has 5 columns
ALTER TABLE admin_permissions 
    ADD CONSTRAINT admin_permissions_admin_id_fkey 
    FOREIGN KEY (admin_id) 
    REFERENCES admins(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE admin_permissions 
    ADD CONSTRAINT admin_permissions_unique UNIQUE (admin_id);


-- --------------------------------------------------------------
-- Table: admins
-- --------------------------------------------------------------
CREATE TABLE admins (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'google'::text,
    provider_account_id TEXT NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NULL,
    avatar_url TEXT NULL,
    role USER-DEFINED NOT NULL,
    status USER-DEFINED NOT NULL DEFAULT 'ACTIVE'::admin_entity_status,
    agency_id UUID NULL,
    hotel_id UUID NULL,
    created_by UUID NULL,
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT admins_pkey PRIMARY KEY (id)
);

-- Table admins has 15 columns
ALTER TABLE admins 
    ADD CONSTRAINT fk_created_by 
    FOREIGN KEY (created_by) 
    REFERENCES admins(id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION;

ALTER TABLE admins 
    ADD CONSTRAINT fk_admins_agency_uuid 
    FOREIGN KEY (agency_id) 
    REFERENCES agencies(uuid)
    ON DELETE SET NULL
    ON UPDATE NO ACTION;

ALTER TABLE admins 
    ADD CONSTRAINT uq_email UNIQUE (email);

ALTER TABLE admins 
    ADD CONSTRAINT uq_provider_account UNIQUE (provider, provider_account_id);

ALTER TABLE admins 
    ADD CONSTRAINT hotel_admin_check CHECK ((((role = 'HOTEL_ADMIN'::admin_role) AND (hotel_id IS NOT NULL)) OR (role <> 'HOTEL_ADMIN'::admin_role)));

ALTER TABLE admins 
    ADD CONSTRAINT agency_admin_check CHECK ((((role = 'AGENCY_ADMIN'::admin_role) AND (agency_id IS NOT NULL)) OR (role <> 'AGENCY_ADMIN'::admin_role)));

ALTER TABLE admins 
    ADD CONSTRAINT super_admin_scope_check CHECK (((role <> 'SUPER_ADMIN'::admin_role) OR ((agency_id IS NULL) AND (hotel_id IS NULL))));


-- --------------------------------------------------------------
-- Table: agencies
-- --------------------------------------------------------------
CREATE TABLE agencies (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL DEFAULT nextval('agencies_id_seq'::regclass),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    status USER-DEFINED NOT NULL DEFAULT 'PENDING'::admin_entity_status,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    business_phone TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    established_year INTEGER NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    nearby_landmark TEXT NULL,
    pan_number TEXT NOT NULL,
    gst_number TEXT NULL,
    registration_number TEXT NULL,
    iata_number TEXT NULL,
    website_url TEXT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    logo_url TEXT NULL,
    CONSTRAINT agencies_pkey PRIMARY KEY (id)
);

-- Table agencies has 21 columns
ALTER TABLE agencies 
    ADD CONSTRAINT agencies_code_key UNIQUE (code);

ALTER TABLE agencies 
    ADD CONSTRAINT uq_agencies_uuid UNIQUE (uuid);


-- --------------------------------------------------------------
-- Table: bookings
-- --------------------------------------------------------------
CREATE TABLE bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    destination CHARACTER VARYING NOT NULL,
    package_name CHARACTER VARYING NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    persons INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    status CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT bookings_pkey PRIMARY KEY (id)
);

-- Table bookings has 11 columns
ALTER TABLE bookings 
    ADD CONSTRAINT fk_booking_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE bookings 
    ADD CONSTRAINT bookings_persons_check CHECK ((persons > 0));

ALTER TABLE bookings 
    ADD CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'cancelled'::character varying, 'completed'::character varying])::text[])));


-- --------------------------------------------------------------
-- Table: destination_discounts
-- --------------------------------------------------------------
CREATE TABLE destination_discounts (
    destination_id TEXT NOT NULL,
    percentage INTEGER NULL,
    valid_until DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT destination_discounts_pkey PRIMARY KEY (destination_id)
);

-- Table destination_discounts has 4 columns
ALTER TABLE destination_discounts 
    ADD CONSTRAINT destination_discounts_destination_id_fkey 
    FOREIGN KEY (destination_id) 
    REFERENCES destinations(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE destination_discounts 
    ADD CONSTRAINT destination_discounts_percentage_check CHECK (((percentage >= 1) AND (percentage <= 90)));


-- --------------------------------------------------------------
-- Table: destination_itinerary
-- --------------------------------------------------------------
CREATE TABLE destination_itinerary (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    destination_id TEXT NOT NULL,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NULL,
    places ARRAY NULL DEFAULT '{}'::text[],
    activity_ids ARRAY NULL DEFAULT '{}'::text[],
    hotel_name TEXT NULL,
    hotel_images ARRAY NULL DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT destination_itinerary_pkey PRIMARY KEY (id)
);

-- Table destination_itinerary has 11 columns
ALTER TABLE destination_itinerary 
    ADD CONSTRAINT uq_destination_day UNIQUE (destination_id, day_number);

ALTER TABLE destination_itinerary 
    ADD CONSTRAINT destination_itinerary_day_check CHECK ((day_number >= 1));


-- --------------------------------------------------------------
-- Table: destination_prices
-- --------------------------------------------------------------
CREATE TABLE destination_prices (
    destination_id TEXT NOT NULL,
    price_per_person INTEGER NOT NULL,
    currency TEXT NULL DEFAULT 'INR'::text,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT destination_prices_pkey PRIMARY KEY (destination_id)
);

-- Table destination_prices has 5 columns
ALTER TABLE destination_prices 
    ADD CONSTRAINT destination_prices_destination_id_fkey 
    FOREIGN KEY (destination_id) 
    REFERENCES destinations(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE destination_prices 
    ADD CONSTRAINT destination_prices_price_per_person_check CHECK ((price_per_person >= 0));


-- --------------------------------------------------------------
-- Table: destinations
-- --------------------------------------------------------------
CREATE TABLE destinations (
    id TEXT NOT NULL,
    agency_code TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NULL,
    cover_image TEXT NOT NULL,
    gallery_images ARRAY NULL DEFAULT '{}'::text[],
    location TEXT NOT NULL,
    best_time_to_visit TEXT NULL,
    average_rating NUMERIC NULL DEFAULT 0,
    review_count INTEGER NULL DEFAULT 0,
    highlights ARRAY NULL DEFAULT '{}'::text[],
    popular_activities ARRAY NULL DEFAULT '{}'::text[],
    badge_text TEXT NULL,
    badge_type TEXT NULL,
    is_active BOOLEAN NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT destinations_pkey PRIMARY KEY (id)
);

-- Table destinations has 19 columns
ALTER TABLE destinations 
    ADD CONSTRAINT destinations_agency_code_fkey 
    FOREIGN KEY (agency_code) 
    REFERENCES agencies(code)
    ON DELETE NO ACTION
    ON UPDATE CASCADE;

ALTER TABLE destinations 
    ADD CONSTRAINT destinations_slug_key UNIQUE (slug);

ALTER TABLE destinations 
    ADD CONSTRAINT destinations_badge_type_check CHECK ((badge_type = ANY (ARRAY['popular'::text, 'trending'::text, 'new'::text])));


-- --------------------------------------------------------------
-- Table: guides
-- --------------------------------------------------------------
CREATE TABLE guides (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL,
    created_by UUID NULL,
    code TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NULL,
    phone TEXT NOT NULL,
    languages ARRAY NOT NULL,
    skills ARRAY NULL,
    bio TEXT NULL,
    profile_image_url TEXT NULL,
    status USER-DEFINED NOT NULL DEFAULT 'AVAILABLE'::guide_status,
    current_assignment TEXT NULL,
    assignment_end_date DATE NULL,
    city TEXT NULL,
    state TEXT NULL,
    country TEXT NULL DEFAULT 'India'::text,
    govt_id_number TEXT NULL,
    license_number TEXT NULL,
    is_verified BOOLEAN NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT guides_pkey PRIMARY KEY (id)
);

-- Table guides has 23 columns
ALTER TABLE guides 
    ADD CONSTRAINT fk_guides_agency 
    FOREIGN KEY (agency_id) 
    REFERENCES agencies(uuid)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE guides 
    ADD CONSTRAINT fk_guides_created_by 
    FOREIGN KEY (created_by) 
    REFERENCES admins(id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION;

ALTER TABLE guides 
    ADD CONSTRAINT guides_code_key UNIQUE (code);

ALTER TABLE guides 
    ADD CONSTRAINT guides_email_key UNIQUE (email);


-- --------------------------------------------------------------
-- Table: hotels
-- --------------------------------------------------------------
CREATE TABLE hotels (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    agency_id UUID NULL,
    code CHARACTER VARYING NOT NULL,
    name CHARACTER VARYING NOT NULL,
    email CHARACTER VARYING NOT NULL,
    phone CHARACTER VARYING NOT NULL,
    address TEXT NULL,
    city CHARACTER VARYING NULL,
    state CHARACTER VARYING NULL,
    country CHARACTER VARYING NULL,
    pincode CHARACTER VARYING NULL,
    total_rooms INTEGER NULL DEFAULT 0,
    amenities JSONB NULL DEFAULT '[]'::jsonb,
    status CHARACTER VARYING NULL DEFAULT 'PENDING'::character varying,
    rating NUMERIC NULL,
    profile_image_url TEXT NULL,
    cover_image_url TEXT NULL,
    description TEXT NULL,
    contact_person_name CHARACTER VARYING NULL,
    contact_person_phone CHARACTER VARYING NULL,
    contact_person_email CHARACTER VARYING NULL,
    website CHARACTER VARYING NULL,
    check_in_time CHARACTER VARYING NULL DEFAULT '14:00'::character varying,
    check_out_time CHARACTER VARYING NULL DEFAULT '11:00'::character varying,
    cancellation_policy TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT hotels_pkey PRIMARY KEY (id)
);

-- Table hotels has 28 columns

-- --------------------------------------------------------------
-- Table: notifications
-- --------------------------------------------------------------
CREATE TABLE notifications (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
    type CHARACTER VARYING NOT NULL,
    title CHARACTER VARYING NOT NULL,
    message TEXT NOT NULL,
    data JSONB NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    user_id UUID NULL,
    link TEXT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Table notifications has 9 columns
ALTER TABLE notifications 
    ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;


-- --------------------------------------------------------------
-- Table: otp_verifications
-- --------------------------------------------------------------
CREATE TABLE otp_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER NULL DEFAULT 0,
    verified BOOLEAN NULL DEFAULT false,
    user_data JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT otp_verifications_pkey PRIMARY KEY (id)
);

-- Table otp_verifications has 8 columns
ALTER TABLE otp_verifications 
    ADD CONSTRAINT otp_verifications_email_key UNIQUE (email);

ALTER TABLE otp_verifications 
    ADD CONSTRAINT otp_verifications_attempts_check CHECK ((attempts <= 5));


-- --------------------------------------------------------------
-- Table: payments
-- --------------------------------------------------------------
CREATE TABLE payments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    booking_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    currency CHARACTER VARYING NULL DEFAULT 'INR'::character varying,
    status CHARACTER VARYING NOT NULL,
    payment_method CHARACTER VARYING NULL,
    gateway CHARACTER VARYING NULL,
    gateway_order_id TEXT NULL,
    gateway_payment_id TEXT NULL,
    gateway_signature TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT payments_pkey PRIMARY KEY (id)
);

-- Table payments has 13 columns
ALTER TABLE payments 
    ADD CONSTRAINT fk_payment_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE payments 
    ADD CONSTRAINT fk_payment_booking 
    FOREIGN KEY (booking_id) 
    REFERENCES bookings(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE payments 
    ADD CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'success'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[])));


-- --------------------------------------------------------------
-- Table: profiles
-- --------------------------------------------------------------
CREATE TABLE profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    phone CHARACTER VARYING NULL,
    location CHARACTER VARYING NULL,
    bio TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    traveller_type CHARACTER VARYING NULL,
    passport_number CHARACTER VARYING NULL,
    emergency_contact_name CHARACTER VARYING NULL,
    emergency_contact_phone CHARACTER VARYING NULL,
    pickup_type CHARACTER VARYING NULL,
    pickup_state CHARACTER VARYING NULL,
    pickup_city CHARACTER VARYING NULL,
    pickup_address TEXT NULL,
    pickup_pincode CHARACTER VARYING NULL,
    pickup_landmark TEXT NULL,
    pickup_latitude NUMERIC NULL,
    pickup_longitude NUMERIC NULL,
    food_preference CHARACTER VARYING NULL,
    medical_notes TEXT NULL,
    age_group CHARACTER VARYING NULL,
    gender CHARACTER VARYING NULL,
    id_type CHARACTER VARYING NULL,
    id_number_masked CHARACTER VARYING NULL,
    id_document_url TEXT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Table profiles has 26 columns
ALTER TABLE profiles 
    ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE profiles 
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

ALTER TABLE profiles 
    ADD CONSTRAINT profiles_bio_check CHECK ((length(bio) <= 500));

ALTER TABLE profiles 
    ADD CONSTRAINT profiles_traveller_type_check CHECK (((traveller_type)::text = ANY ((ARRAY['indian'::character varying, 'foreign'::character varying])::text[])));

ALTER TABLE profiles 
    ADD CONSTRAINT profiles_pickup_type_check CHECK (((pickup_type)::text = ANY ((ARRAY['agency_point'::character varying, 'home'::character varying])::text[])));

ALTER TABLE profiles 
    ADD CONSTRAINT profiles_id_type_check CHECK (((id_type)::text = ANY ((ARRAY['aadhaar'::character varying, 'passport'::character varying, 'dl'::character varying])::text[])));


-- --------------------------------------------------------------
-- Table: users
-- --------------------------------------------------------------
CREATE TABLE users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NULL,
    email TEXT NOT NULL,
    image TEXT NULL,
    password_hash TEXT NULL,
    auth_provider TEXT NOT NULL,
    google_id TEXT NULL,
    email_verified BOOLEAN NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Table users has 10 columns
ALTER TABLE users 
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE users 
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);

ALTER TABLE users 
    ADD CONSTRAINT users_auth_provider_check CHECK ((auth_provider = ANY (ARRAY['google'::text, 'credentials'::text])));


-- --------------------------------------------------------------
-- Table: wishlist
-- --------------------------------------------------------------
CREATE TABLE wishlist (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT now(),
    item_id TEXT NOT NULL,
    CONSTRAINT wishlist_pkey PRIMARY KEY (id)
);

-- Table wishlist has 4 columns
ALTER TABLE wishlist 
    ADD CONSTRAINT fk_wishlist_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;


-- ============================================================
-- INDEXES (Additional indexes beyond constraints)
-- ============================================================

-- Index: activities_slug_key on activities.slug
CREATE UNIQUE INDEX activities_slug_key 
    ON activities (slug);

-- Index: admin_invites_token_key on admin_invites.token
CREATE UNIQUE INDEX admin_invites_token_key 
    ON admin_invites (token);

-- Index: admin_permissions_unique on admin_permissions.admin_id
CREATE UNIQUE INDEX admin_permissions_unique 
    ON admin_permissions (admin_id);

-- Index: uq_email on admins.email
CREATE UNIQUE INDEX uq_email 
    ON admins (email);

-- Index: uq_provider_account on admins.provider
CREATE UNIQUE INDEX uq_provider_account 
    ON admins (provider);

-- Index: agencies_code_key on agencies.code
CREATE UNIQUE INDEX agencies_code_key 
    ON agencies (code);

-- Index: uq_agencies_uuid on agencies.uuid
CREATE UNIQUE INDEX uq_agencies_uuid 
    ON agencies (uuid);

-- Index: idx_bookings_status on bookings.status
CREATE INDEX idx_bookings_status 
    ON bookings (status);

-- Index: idx_bookings_user on bookings.user_id
CREATE INDEX idx_bookings_user 
    ON bookings (user_id);

-- Index: idx_itinerary_day on destination_itinerary.day_number
CREATE INDEX idx_itinerary_day 
    ON destination_itinerary (day_number);

-- Index: idx_itinerary_destination on destination_itinerary.destination_id
CREATE INDEX idx_itinerary_destination 
    ON destination_itinerary (destination_id);

-- Index: uq_destination_day on destination_itinerary.destination_id
CREATE UNIQUE INDEX uq_destination_day 
    ON destination_itinerary (destination_id);

-- Index: destinations_slug_key on destinations.slug
CREATE UNIQUE INDEX destinations_slug_key 
    ON destinations (slug);

-- Index: guides_code_key on guides.code
CREATE UNIQUE INDEX guides_code_key 
    ON guides (code);

-- Index: guides_email_key on guides.email
CREATE UNIQUE INDEX guides_email_key 
    ON guides (email);

-- Index: idx_guides_active on guides.deleted_at
CREATE INDEX idx_guides_active 
    ON guides (deleted_at);

-- Index: idx_guides_agency on guides.agency_id
CREATE INDEX idx_guides_agency 
    ON guides (agency_id);

-- Index: idx_guides_city on guides.city
CREATE INDEX idx_guides_city 
    ON guides (city);

-- Index: idx_guides_status on guides.status
CREATE INDEX idx_guides_status 
    ON guides (status);

-- Index: idx_hotels_agency_id on hotels.agency_id
CREATE INDEX idx_hotels_agency_id 
    ON hotels (agency_id);

-- Index: idx_hotels_code on hotels.code
CREATE INDEX idx_hotels_code 
    ON hotels (code);

-- Index: idx_hotels_deleted_at on hotels.deleted_at
CREATE INDEX idx_hotels_deleted_at 
    ON hotels (deleted_at);

-- Index: idx_hotels_status on hotels.status
CREATE INDEX idx_hotels_status 
    ON hotels (status);

-- Index: idx_otp_expires_at on otp_verifications.expires_at
CREATE INDEX idx_otp_expires_at 
    ON otp_verifications (expires_at);

-- Index: otp_verifications_email_key on otp_verifications.email
CREATE UNIQUE INDEX otp_verifications_email_key 
    ON otp_verifications (email);

-- Index: idx_payments_booking on payments.booking_id
CREATE INDEX idx_payments_booking 
    ON payments (booking_id);

-- Index: idx_payments_status on payments.status
CREATE INDEX idx_payments_status 
    ON payments (status);

-- Index: idx_payments_user on payments.user_id
CREATE INDEX idx_payments_user 
    ON payments (user_id);

-- Index: idx_profiles_user_id on profiles.user_id
CREATE INDEX idx_profiles_user_id 
    ON profiles (user_id);

-- Index: profiles_user_id_key on profiles.user_id
CREATE UNIQUE INDEX profiles_user_id_key 
    ON profiles (user_id);

-- Index: users_email_key on users.email
CREATE UNIQUE INDEX users_email_key 
    ON users (email);

-- Index: users_google_id_key on users.google_id
CREATE UNIQUE INDEX users_google_id_key 
    ON users (google_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function: armor
CREATE OR REPLACE FUNCTION public.armor(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- Function: armor
CREATE OR REPLACE FUNCTION public.armor(bytea, text[], text[])
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- Function: create_profile_for_user
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO profiles (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$function$
;

-- Function: crypt
CREATE OR REPLACE FUNCTION public.crypt(text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_crypt$function$
;

-- Function: dearmor
CREATE OR REPLACE FUNCTION public.dearmor(text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_dearmor$function$
;

-- Function: decrypt
CREATE OR REPLACE FUNCTION public.decrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt$function$
;

-- Function: decrypt_iv
CREATE OR REPLACE FUNCTION public.decrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt_iv$function$
;

-- Function: digest
CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- Function: digest
CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- Function: encrypt
CREATE OR REPLACE FUNCTION public.encrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt$function$
;

-- Function: encrypt_iv
CREATE OR REPLACE FUNCTION public.encrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt_iv$function$
;

-- Function: gen_random_bytes
CREATE OR REPLACE FUNCTION public.gen_random_bytes(integer)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_random_bytes$function$
;

-- Function: gen_random_uuid
CREATE OR REPLACE FUNCTION public.gen_random_uuid()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/pgcrypto', $function$pg_random_uuid$function$
;

-- Function: gen_salt
CREATE OR REPLACE FUNCTION public.gen_salt(text)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt$function$
;

-- Function: gen_salt
CREATE OR REPLACE FUNCTION public.gen_salt(text, integer)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt_rounds$function$
;

-- Function: generate_agency_code
CREATE OR REPLACE FUNCTION public.generate_agency_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  initials TEXT := '';
  word TEXT;
  seq_num TEXT;
BEGIN
  -- If code is already manually provided, don't override
  IF NEW.code IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Extract initials from agency name
  FOR word IN
    SELECT regexp_split_to_table(NEW.name, '\s+')
  LOOP
    initials := initials || UPPER(LEFT(word, 1));
  END LOOP;

  -- Generate padded number
  seq_num := LPAD(nextval('agency_seq')::TEXT, 4, '0');

  -- Final format: AG-TTAT-0001
  NEW.code := 'AG-' || initials || '-' || seq_num;

  RETURN NEW;
END;
$function$
;

-- Function: generate_guide_code
CREATE OR REPLACE FUNCTION public.generate_guide_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  initials TEXT;
BEGIN
  -- Extract initials from agency name
  SELECT STRING_AGG(UPPER(LEFT(word, 1)), '')
  INTO initials
  FROM (
    SELECT regexp_split_to_table(a.name, '\s+') AS word
    FROM public.agencies a
    WHERE a.uuid = NEW.agency_id
  ) s;

  IF initials IS NULL THEN
    RAISE EXCEPTION 'Agency not found for agency_id %', NEW.agency_id;
  END IF;

  -- Final code format: TTAT-GD-0001
  NEW.code := initials || '-GD-' || LPAD(nextval('guide_seq')::TEXT, 4, '0');

  RETURN NEW;
END;
$function$
;

-- Function: hmac
CREATE OR REPLACE FUNCTION public.hmac(text, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- Function: hmac
CREATE OR REPLACE FUNCTION public.hmac(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- Function: pgp_armor_headers
CREATE OR REPLACE FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text)
 RETURNS SETOF record
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_armor_headers$function$
;

-- Function: pgp_key_id
CREATE OR REPLACE FUNCTION public.pgp_key_id(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_key_id_w$function$
;

-- Function: pgp_pub_decrypt
CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- Function: pgp_pub_decrypt
CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- Function: pgp_pub_decrypt
CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- Function: pgp_pub_decrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- Function: pgp_pub_decrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- Function: pgp_pub_decrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- Function: pgp_pub_encrypt
CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- Function: pgp_pub_encrypt
CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- Function: pgp_pub_encrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- Function: pgp_pub_encrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- Function: pgp_sym_decrypt
CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- Function: pgp_sym_decrypt
CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- Function: pgp_sym_decrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- Function: pgp_sym_decrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- Function: pgp_sym_encrypt
CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- Function: pgp_sym_encrypt
CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- Function: pgp_sym_encrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- Function: pgp_sym_encrypt_bytea
CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- Function: set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

-- Function: update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $function$
;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger: update_activities_updated_at on activities
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: trg_admins_updated_at on admins
CREATE TRIGGER trg_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: trg_generate_agency_code on agencies
CREATE TRIGGER trg_generate_agency_code BEFORE INSERT ON public.agencies FOR EACH ROW EXECUTE FUNCTION generate_agency_code();

-- Trigger: trg_bookings_updated on bookings
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: update_destination_prices_updated_at on destination_prices
CREATE TRIGGER update_destination_prices_updated_at BEFORE UPDATE ON public.destination_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: update_destinations_updated_at on destinations
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: trg_generate_guide_code on guides
CREATE TRIGGER trg_generate_guide_code BEFORE INSERT ON public.guides FOR EACH ROW EXECUTE FUNCTION generate_guide_code();

-- Trigger: trg_guides_updated_at on guides
CREATE TRIGGER trg_guides_updated_at BEFORE UPDATE ON public.guides FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger: trg_payments_updated on payments
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: update_profiles_updated_at on profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: auto_create_profile on users
CREATE TRIGGER auto_create_profile AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

