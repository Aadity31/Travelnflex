const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_SdU3CEXNIFa1@ep-falling-mud-a1elen0p-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting targeted database migration...');
    console.log('Keeping: users, profiles, otp_verifications, agencies');
    console.log('Dropping & Recreating: destinations, activities, and related price/discount tables\n');
    
    await client.query('BEGIN');
    
    // Drop tables in correct order (respecting foreign keys)
    console.log('Dropping tables...');
    const tablesToDrop = [
      'destination_discounts',
      'destination_prices', 
      'destinations',
      'activity_discounts',
      'activity_prices',
      'activities'
    ];
    
    for (const table of tablesToDrop) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`  - Dropped: ${table}`);
    }
    
    // Create activities table
    console.log('\nCreating activities table...');
    await client.query(`
      CREATE TABLE activities (
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
      )
    `);
    console.log('  - Created: activities');
    
    // Create activity_prices table
    console.log('Creating activity_prices table...');
    await client.query(`
      CREATE TABLE activity_prices (
        activity_id TEXT PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
        price_min INT NOT NULL CHECK (price_min >= 0),
        price_max INT NOT NULL CHECK (price_max >= price_min),
        currency TEXT DEFAULT 'INR'
      )
    `);
    console.log('  - Created: activity_prices');
    
    // Create activity_discounts table
    console.log('Creating activity_discounts table...');
    await client.query(`
      CREATE TABLE activity_discounts (
        activity_id TEXT PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
        percentage INT CHECK (percentage BETWEEN 1 AND 90),
        valid_until DATE NOT NULL
      )
    `);
    console.log('  - Created: activity_discounts');
    
    // Create destinations table
    console.log('Creating destinations table...');
    await client.query(`
      CREATE TABLE destinations (
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
      )
    `);
    console.log('  - Created: destinations');
    
    // Create destination_prices table
    console.log('Creating destination_prices table...');
    await client.query(`
      CREATE TABLE destination_prices (
        destination_id TEXT PRIMARY KEY REFERENCES destinations(id) ON DELETE CASCADE,
        price_per_person INT NOT NULL CHECK (price_per_person >= 0),
        currency TEXT DEFAULT 'INR',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  - Created: destination_prices');
    
    // Create destination_discounts table
    console.log('Creating destination_discounts table...');
    await client.query(`
      CREATE TABLE destination_discounts (
        destination_id TEXT PRIMARY KEY REFERENCES destinations(id) ON DELETE CASCADE,
        percentage INT CHECK (percentage BETWEEN 1 AND 90),
        valid_until DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  - Created: destination_discounts');
    
    // Create triggers for updated_at
    console.log('\nCreating triggers...');
    
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    await client.query(`DROP TRIGGER IF EXISTS update_activities_updated_at ON activities`);
    await client.query(`
      CREATE TRIGGER update_activities_updated_at
      BEFORE UPDATE ON activities
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`DROP TRIGGER IF EXISTS update_destinations_updated_at ON destinations`);
    await client.query(`
      CREATE TRIGGER update_destinations_updated_at
      BEFORE UPDATE ON destinations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`DROP TRIGGER IF EXISTS update_destination_prices_updated_at ON destination_prices`);
    await client.query(`
      CREATE TRIGGER update_destination_prices_updated_at
      BEFORE UPDATE ON destination_prices
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query('COMMIT');
    
    console.log('\n✅ Migration completed successfully!');
    console.log('Tables recreated: activities, activity_prices, activity_discounts, destinations, destination_prices, destination_discounts');
    console.log('Tables preserved: users, profiles, otp_verifications, agencies');
    
    // Verify tables
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('\nAll tables in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
