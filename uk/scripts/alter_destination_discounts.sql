-- Alter destination_discounts table to support package-specific discounts
-- Drop the existing table
DROP TABLE IF EXISTS destination_discounts CASCADE;

-- Create new table with package-specific discount columns
CREATE TABLE IF NOT EXISTS destination_discounts (
    destination_id text NOT NULL PRIMARY KEY,
    solo_traveler_discount integer DEFAULT 0,
    solo_traveler_valid_until date,
    family_package_discount integer DEFAULT 0,
    family_package_valid_until date,
    join_group_discount integer DEFAULT 0,
    join_group_valid_until date,
    own_group_discount integer DEFAULT 0,
    own_group_valid_until date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

-- Add foreign key constraint
ALTER TABLE destination_discounts
ADD CONSTRAINT fk_destination
FOREIGN KEY (destination_id)
REFERENCES destinations(id)
ON DELETE CASCADE;

-- Example: Insert discount for a destination
-- INSERT INTO destination_discounts (destination_id, solo_traveler_discount, solo_traveler_valid_until, family_package_discount, family_package_valid_until)
-- VALUES ('rishikesh-2days', 10, '2026-12-31', 15, '2026-12-31');

-- View current discounts
-- SELECT * FROM destination_discounts;
