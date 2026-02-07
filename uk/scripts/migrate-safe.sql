-- Database Migration Script for Devbhoomi Darshan
-- This script is SAFE for existing data - it only creates missing tables/columns
-- Generated: 2026-02-06

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    image TEXT,
    password_hash TEXT,
    auth_provider TEXT NOT NULL CHECK (auth_provider IN ('google', 'credentials')),
    google_id TEXT UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    location VARCHAR(255),
    bio TEXT CHECK (LENGTH(bio) <= 500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OTP VERIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT DEFAULT 0 CHECK (attempts <= 5),
    verified BOOLEAN DEFAULT FALSE,
    user_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENCIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agencies (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blacklisted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    agency_code TEXT NOT NULL REFERENCES agencies(code) ON UPDATE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('adventure', 'spiritual', 'cultural', 'food', 'trekking')),
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    duration TEXT NOT NULL,
    location TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'difficult')),
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    max_group_size INT NOT NULL,
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    includes TEXT[] DEFAULT '{}',
    is_popular BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY PRICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_prices (
    activity_id TEXT PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
    price_min INT NOT NULL CHECK (price_min >= 0),
    price_max INT NOT NULL CHECK (price_max >= price_min),
    currency TEXT DEFAULT 'INR'
);

-- ============================================
-- ACTIVITY DISCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_discounts (
    activity_id TEXT PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
    percentage INT CHECK (percentage BETWEEN 1 AND 90),
    valid_until DATE NOT NULL
);

-- ============================================
-- DESTINATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    agency_code TEXT NOT NULL REFERENCES agencies(code) ON UPDATE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT,
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    best_time_to_visit TEXT,
    average_rating NUMERIC(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    highlights TEXT[] DEFAULT '{}',
    popular_activities TEXT[] DEFAULT '{}',
    badge_text TEXT,
    badge_type TEXT CHECK (badge_type IN ('popular', 'trending', 'new')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DESTINATION PRICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS destination_prices (
    destination_id TEXT PRIMARY KEY REFERENCES destinations(id) ON DELETE CASCADE,
    price_per_person INT NOT NULL CHECK (price_per_person >= 0),
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DESTINATION DISCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS destination_discounts (
    destination_id TEXT PRIMARY KEY REFERENCES destinations(id) ON DELETE CASCADE,
    percentage INT CHECK (percentage BETWEEN 1 AND 90),
    valid_until DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_verifications(expires_at);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update profiles.updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update activities.updated_at
DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update destinations.updated_at
DROP TRIGGER IF EXISTS update_destinations_updated_at ON destinations;
CREATE TRIGGER update_destinations_updated_at
    BEFORE UPDATE ON destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update destination_prices.updated_at
DROP TRIGGER IF EXISTS update_destination_prices_updated_at ON destination_prices;
CREATE TRIGGER update_destination_prices_updated_at
    BEFORE UPDATE ON destination_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile when user is created
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS auto_create_profile ON users;
CREATE TRIGGER auto_create_profile
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Database migration completed successfully!';
END $$;
