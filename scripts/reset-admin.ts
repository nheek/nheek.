import { getDb } from "../lib/db";
import bcrypt from "bcryptjs";

async function resetAdminPassword() {
  console.log("Resetting admin password...");

  const db = getDb();

  // Check if admin user exists
  const adminUser = db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get("admin") as
    | { id: number; username: string; password_hash: string }
    | undefined;

  const defaultPassword = "change_me_123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  if (adminUser) {
    // Update existing admin user
    db.prepare(
      "UPDATE admin_users SET password_hash = ? WHERE username = ?",
    ).run(passwordHash, "admin");
    console.log("✅ Admin password reset successfully");
  } else {
    // Create new admin user
    db.prepare(
      "INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)",
    ).run("admin", passwordHash, "admin@nheek.com");
    console.log("✅ Admin user created successfully");
  }

  console.log("\nDefault credentials:");
  console.log("  Username: admin");
  console.log("  Password: change_me_123");
  console.log(
    "\n⚠️  IMPORTANT: Change the default password after first login!",
  );

  db.close();
}

resetAdminPassword().catch(console.error);
