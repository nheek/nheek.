import Database from "better-sqlite3";
import * as path from "path";

function updateSchema() {
  const db = new Database(path.join(process.cwd(), "data", "nheek.db"));

  console.log("Updating projects table schema...");

  try {
    // Add new columns
    db.exec(`
      ALTER TABLE projects ADD COLUMN mobile_image_url TEXT;
    `);
    console.log("✓ Added mobile_image_url column");
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log("✓ mobile_image_url column already exists");
    } else {
      console.error("Error adding mobile_image_url:", error);
    }
  }

  try {
    db.exec(`
      ALTER TABLE projects ADD COLUMN status TEXT;
    `);
    console.log("✓ Added status column");
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log("✓ status column already exists");
    } else {
      console.error("Error adding status:", error);
    }
  }

  try {
    db.exec(`
      ALTER TABLE projects ADD COLUMN date_added TEXT;
    `);
    console.log("✓ Added date_added column");
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log("✓ date_added column already exists");
    } else {
      console.error("Error adding date_added:", error);
    }
  }

  try {
    db.exec(`
      ALTER TABLE projects ADD COLUMN tech_stack TEXT DEFAULT '[]';
    `);
    console.log("✓ Added tech_stack column");
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log("✓ tech_stack column already exists");
    } else {
      console.error("Error adding tech_stack:", error);
    }
  }

  try {
    db.exec(`
      ALTER TABLE projects ADD COLUMN deployed_with TEXT DEFAULT '[]';
    `);
    console.log("✓ Added deployed_with column");
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log("✓ deployed_with column already exists");
    } else {
      console.error("Error adding deployed_with:", error);
    }
  }

  console.log("\n✅ Schema update completed!");
  db.close();
}

updateSchema();
