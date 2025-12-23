/**
 * Database Connection Test Script
 * This script tests the database connection and verifies all tables exist
 */

const db = require('./db');

async function testDatabaseConnection() {
    console.log('🔍 Starting Database Connection Test...\n');

    try {
        // Test 1: Basic Connection
        console.log('Test 1: Testing database connection...');
        const connection = await db.getConnection();
        console.log('✅ Database connected successfully!\n');
        connection.release();

        // Test 2: Check if all required tables exist
        console.log('Test 2: Checking if all required tables exist...');
        const [tables] = await db.execute('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        
        const requiredTables = ['users', 'cart', 'wishlist', 'orders', 'order_items'];
        const missingTables = requiredTables.filter(table => !tableNames.includes(table));
        
        if (missingTables.length > 0) {
            console.log('❌ Missing tables:', missingTables.join(', '));
            console.log('\n⚠️  Please run the database_setup.sql script first!\n');
            process.exit(1);
        } else {
            console.log('✅ All required tables exist:', requiredTables.join(', '));
            console.log('   Found tables:', tableNames.join(', '), '\n');
        }

        // Test 3: Check table structures
        console.log('Test 3: Verifying table structures...');
        
        for (const table of requiredTables) {
            const [columns] = await db.execute(`DESCRIBE ${table}`);
            console.log(`   ✅ ${table}: ${columns.length} columns`);
        }
        console.log('');

        // Test 4: Check table counts
        console.log('Test 4: Checking record counts...');
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [cartCount] = await db.execute('SELECT COUNT(*) as count FROM cart');
        const [wishlistCount] = await db.execute('SELECT COUNT(*) as count FROM wishlist');
        const [ordersCount] = await db.execute('SELECT COUNT(*) as count FROM orders');
        const [orderItemsCount] = await db.execute('SELECT COUNT(*) as count FROM order_items');

        console.log(`   Users: ${userCount[0].count}`);
        console.log(`   Cart Items: ${cartCount[0].count}`);
        console.log(`   Wishlist Items: ${wishlistCount[0].count}`);
        console.log(`   Orders: ${ordersCount[0].count}`);
        console.log(`   Order Items: ${orderItemsCount[0].count}\n`);

        // Test 5: Check foreign key constraints
        console.log('Test 5: Checking foreign key constraints...');
        const [constraints] = await db.execute(`
            SELECT 
                TABLE_NAME,
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE 
                REFERENCED_TABLE_SCHEMA = DATABASE()
                AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        
        if (constraints.length > 0) {
            console.log('✅ Foreign key constraints found:');
            constraints.forEach(c => {
                console.log(`   ${c.TABLE_NAME} -> ${c.REFERENCED_TABLE_NAME}`);
            });
        } else {
            console.log('⚠️  No foreign key constraints found');
        }

        console.log('\n✅ All database tests passed successfully!');
        console.log('🎉 Your database is ready to use!\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Database test failed:');
        console.error('Error:', error.message);
        console.error('\nPlease check your database configuration in .env file:');
        console.error('- DB_HOST');
        console.error('- DB_USER');
        console.error('- DB_PASSWORD');
        console.error('- DB_NAME\n');
        process.exit(1);
    }
}

// Run the test
testDatabaseConnection();
