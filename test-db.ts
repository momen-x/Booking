import { Pool } from "pg";
import "dotenv/config";

async function main() {
  console.log("URL:", process.env.DATABASE_URL?.slice(0, 80));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000,
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const client = await pool.connect();
    console.log("Pool connected!");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const res = await client.query('SELECT * FROM "User" LIMIT 1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("Query result:", res.rows);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    client.release();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await pool.end();
  }
}

void main();
