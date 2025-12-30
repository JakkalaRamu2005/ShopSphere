const db = require('./db');

(async () => {
    try {
        const [rows] = await db.query('SELECT id, title, image FROM products LIMIT 5');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
