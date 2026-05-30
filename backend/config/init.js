const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Initialize the database by executing schema.sql
 * This ensures all tables and seed data are created
 */
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Create a root connection to create database
    const rootConnection = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
    });

    rootConnection.connect((err) => {
      if (err) {
        console.error("❌ Database connection failed:", err.message);
        return reject(err);
      }

      console.log("✓ Connected to MySQL server");

      // Read schema file
      const schemaPath = path.join(__dirname, "schema.sql");
      let schema;
      try {
        schema = fs.readFileSync(schemaPath, "utf8");
      } catch (err) {
        console.error("❌ Failed to read schema.sql:", err.message);
        rootConnection.end();
        return reject(err);
      }

      // Split by semicolon and filter out empty statements
      const statements = schema
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      let completed = 0;

      // Execute each statement
      statements.forEach((statement, index) => {
        rootConnection.query(statement, (err) => {
          if (err) {
            console.error(
              `❌ Error executing statement ${index + 1}:`,
              err.message,
            );
            rootConnection.end();
            return reject(err);
          }
          completed++;
          if (index < 5 || completed === statements.length) {
            console.log(
              `✓ Executed statement ${completed}/${statements.length}`,
            );
          }

          // Resolve when all statements are done
          if (completed === statements.length) {
            console.log("✅ Database initialized successfully!");
            rootConnection.end(() => {
              resolve();
            });
          }
        });
      });
    });
  });
}

module.exports = { initializeDatabase };
