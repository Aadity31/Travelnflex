-- ============================================================
-- Devbhoomi Darshan - Database Schema Export
-- Generated: 2026-02-08T09:26:40.434Z
-- Database: Neon PostgreSQL
-- ============================================================

-- ACTIVITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
    id text NOT NULL PRIMARY KEY,
    agency_code text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    short_description text NOT NULL,
    duration text NOT NULL,
    location text NOT NULL,
    difficulty text NOT NULL,
    rating numeric DEFAULT 0,
    review_count integer DEFAULT 0,
    max_group_size integer NOT NULL,
    cover_image text NOT NULL,
    gallery_images ARRAY DEFAULT '{}'::text[],
    highlights ARRAY DEFAULT '{}'::text[],
    includes ARRAY DEFAULT '{}'::text[],
    is_popular boolean DEFAULT false,
    is_trending boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Foreign Key: agency_code -> agencies(code)

-- ACTIVITY_DISCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_discounts (
    activity_id text NOT NULL PRIMARY KEY,
    percentage integer,
    valid_until date NOT NULL
);

-- Foreign Key: activity_id -> activities(id)

-- ACTIVITY_PRICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_prices (
    activity_id text NOT NULL PRIMARY KEY,
    price_min integer NOT NULL,
    price_max integer NOT NULL,
    currency text DEFAULT 'INR'::text
);

-- Foreign Key: activity_id -> activities(id)

-- ADMIN_INVITES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    email text NOT NULL,
    role USER-DEFINED NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    invited_by uuid,
    accepted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    permissions ARRAY
);

-- Foreign Key: invited_by -> admins(id)

-- ADMIN_PERMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    admin_id uuid NOT NULL,
    permissions ARRAY NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Foreign Key: admin_id -> admins(id)

-- ADMINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    provider text DEFAULT 'google'::text NOT NULL,
    provider_account_id text NOT NULL,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    role USER-DEFINED NOT NULL,
    status USER-DEFINED DEFAULT 'ACTIVE'::admin_entity_status NOT NULL,
    agency_id uuid,
    hotel_id uuid,
    created_by uuid,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);

-- Foreign Key: created_by -> admins(id)
-- Foreign Key: agency_id -> agencies(uuid)

-- AGENCIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS agencies (
    id integer DEFAULT nextval('agencies_id_seq'::regclass) NOT NULL PRIMARY KEY,
    code text NOT NULL,
    name text NOT NULL,
    status USER-DEFINED DEFAULT 'PENDING'::admin_entity_status NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    business_phone text NOT NULL,
    owner_phone text NOT NULL,
    established_year integer NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    pincode text NOT NULL,
    nearby_landmark text,
    pan_number text NOT NULL,
    gst_number text,
    registration_number text,
    iata_number text,
    website_url text,
    description text NOT NULL,
    address text NOT NULL,
    logo_url text
);

-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    destination character varying NOT NULL,
    package_name character varying,
    start_date date NOT NULL,
    end_date date NOT NULL,
    persons integer NOT NULL,
    amount numeric NOT NULL,
    status character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Foreign Key: user_id -> users(id)

-- DESTINATION_AVAILABILITY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_availability (
    destination_id text NOT NULL PRIMARY KEY,
    is_available boolean DEFAULT true,
    package_types ARRAY DEFAULT '{}'::text[],
    advance_booking_days integer DEFAULT 0,
    min_pax integer DEFAULT 1,
    max_pax integer DEFAULT 100,
    cancellation_policy text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    solo_traveler_min_pax integer DEFAULT 1,
    solo_traveler_max_pax integer DEFAULT 50,
    solo_traveler_advance_days integer DEFAULT 7,
    join_group_min_pax integer DEFAULT 1,
    join_group_max_pax integer DEFAULT 30,
    join_group_advance_days integer DEFAULT 7,
    family_package_min_pax integer DEFAULT 2,
    family_package_max_pax integer DEFAULT 10,
    family_package_advance_days integer DEFAULT 7,
    own_group_min_pax integer DEFAULT 5,
    own_group_max_pax integer DEFAULT 100,
    own_group_advance_days integer DEFAULT 7
);

-- Foreign Key: destination_id -> destinations(id)

-- DESTINATION_AVAILABLE_DATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_available_dates (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    destination_id text NOT NULL,
    package_type text NOT NULL,
    available_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    available_slots integer DEFAULT 0,
    total_slots integer DEFAULT 50
);

-- Foreign Key: destination_id -> destinations(id)

-- DESTINATION_DAY_ACTIVITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_day_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    day_id uuid NOT NULL,
    activity_name text NOT NULL,
    activity_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- Foreign Key: day_id -> destination_itinerary_days(id)

-- DESTINATION_DAY_PLACES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_day_places (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    day_id uuid NOT NULL,
    place_name text NOT NULL,
    place_order integer DEFAULT 0,
    duration text,
    created_at timestamp with time zone DEFAULT now()
);

-- Foreign Key: day_id -> destination_itinerary_days(id)

-- DESTINATION_DISCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_discounts (
    destination_id text NOT NULL PRIMARY KEY,
    percentage integer,
    valid_until date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    solo_traveler_discount integer DEFAULT 0,
    solo_traveler_valid_until date,
    family_package_discount integer DEFAULT 0,
    family_package_valid_until date,
    join_group_discount integer DEFAULT 0,
    join_group_valid_until date,
    own_group_discount integer DEFAULT 0,
    own_group_valid_until date
);

-- Foreign Key: destination_id -> destinations(id)

-- DESTINATION_ITINERARY_DAYS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_itinerary_days (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    destination_id text NOT NULL,
    day_number integer NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    start_time time without time zone,
    end_time time without time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- DESTINATION_PRICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_prices (
    destination_id text NOT NULL PRIMARY KEY,
    price_per_person integer NOT NULL,
    currency text DEFAULT 'INR'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    solo_traveler_includes text DEFAULT ''::text,
    family_package_price integer,
    family_package_includes text DEFAULT ''::text,
    own_group_price integer,
    own_group_includes text DEFAULT ''::text,
    join_group_price integer,
    join_group_includes text DEFAULT ''::text,
    hotel_per_person integer DEFAULT 0,
    additional_costs jsonb DEFAULT '[]'::jsonb,
    solo_traveler_price integer
);

-- Foreign Key: destination_id -> destinations(id)

-- DESTINATION_STOPS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_stops (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    destination_id text NOT NULL,
    location text NOT NULL,
    duration text,
    stop_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- DESTINATION_TRAVEL_ROUTE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_travel_route (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    destination_id text NOT NULL,
    from_location text,
    to_location text,
    travel_duration text,
    travel_mode text,
    created_at timestamp with time zone DEFAULT now()
);

-- DESTINATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
    id text NOT NULL PRIMARY KEY,
    agency_code text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    short_description text NOT NULL,
    description text,
    cover_image text NOT NULL,
    gallery_images ARRAY DEFAULT '{}'::text[],
    location text NOT NULL,
    best_time_to_visit text,
    average_rating numeric DEFAULT 0,
    review_count integer DEFAULT 0,
    highlights ARRAY DEFAULT '{}'::text[],
    popular_activities ARRAY DEFAULT '{}'::text[],
    badge_text text,
    badge_type text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    trip_days integer DEFAULT 0,
    trip_nights integer DEFAULT 0,
    hotel_images ARRAY DEFAULT '{}'::text[],
    hotel_image_public_ids ARRAY DEFAULT '{}'::text[]
);

-- Foreign Key: agency_code -> agencies(code)

-- GUIDES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS guides (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    agency_id uuid NOT NULL,
    created_by uuid,
    code text NOT NULL,
    full_name text NOT NULL,
    email text,
    phone text NOT NULL,
    languages ARRAY NOT NULL,
    skills ARRAY,
    bio text,
    profile_image_url text,
    status USER-DEFINED DEFAULT 'AVAILABLE'::guide_status NOT NULL,
    current_assignment text,
    assignment_end_date date,
    city text,
    state text,
    country text DEFAULT 'India'::text,
    govt_id_number text,
    license_number text,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);

-- Foreign Key: agency_id -> agencies(uuid)
-- Foreign Key: created_by -> admins(id)

-- HOTELS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS hotels (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    agency_id uuid,
    code character varying NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    address text,
    city character varying,
    state character varying,
    country character varying,
    pincode character varying,
    total_rooms integer DEFAULT 0,
    amenities jsonb DEFAULT '[]'::jsonb,
    status character varying DEFAULT 'PENDING'::character varying,
    rating numeric,
    profile_image_url text,
    cover_image_url text,
    description text,
    contact_person_name character varying,
    contact_person_phone character varying,
    contact_person_email character varying,
    website character varying,
    check_in_time character varying DEFAULT '14:00'::character varying,
    check_out_time character varying DEFAULT '11:00'::character varying,
    cancellation_policy text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);

-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id bigint DEFAULT nextval('notifications_id_seq'::regclass) NOT NULL PRIMARY KEY,
    type character varying NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    link text
);

-- Foreign Key: user_id -> users(id)

-- OTP_VERIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS otp_verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    email text NOT NULL,
    otp_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    attempts integer DEFAULT 0,
    verified boolean DEFAULT false,
    user_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    booking_id uuid NOT NULL,
    amount numeric NOT NULL,
    currency character varying DEFAULT 'INR'::character varying,
    status character varying NOT NULL,
    payment_method character varying,
    gateway character varying,
    gateway_order_id text,
    gateway_payment_id text,
    gateway_signature text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Foreign Key: user_id -> users(id)
-- Foreign Key: booking_id -> bookings(id)

-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    phone character varying,
    location character varying,
    bio text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    traveller_type character varying,
    passport_number character varying,
    emergency_contact_name character varying,
    emergency_contact_phone character varying,
    pickup_type character varying,
    pickup_state character varying,
    pickup_city character varying,
    pickup_address text,
    pickup_pincode character varying,
    pickup_landmark text,
    pickup_latitude numeric,
    pickup_longitude numeric,
    food_preference character varying,
    medical_notes text,
    age_group character varying,
    gender character varying,
    id_type character varying,
    id_number_masked character varying,
    id_document_url text
);

-- Foreign Key: user_id -> users(id)

-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text,
    email text NOT NULL,
    image text,
    password_hash text,
    auth_provider text NOT NULL,
    google_id text,
    email_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- WISHLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    item_id text NOT NULL
);

-- Foreign Key: user_id -> users(id)

