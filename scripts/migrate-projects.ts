import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

async function migrateProjects() {
  const db = new Database(path.join(process.cwd(), "data", "nheek.db"));

  // Read projects.json
  const projectsPath = path.join(
    process.cwd(),
    "public",
    "featured-projects",
    "json",
    "projects.json",
  );
  if (!fs.existsSync(projectsPath)) {
    console.error("projects.json not found!");
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));

  console.log("Migrating project categories and projects...");

  // Category mapping: JSON key -> DB category
  const categoryMapping: Record<
    string,
    { name: string; slug: string; description: string }
  > = {
    websites: {
      name: "Websites",
      slug: "websites",
      description: "Web applications and websites",
    },
    desktop: {
      name: "Desktop Apps",
      slug: "desktop",
      description: "Desktop applications",
    },
    mobile: {
      name: "Mobile Apps",
      slug: "mobile",
      description: "Mobile applications",
    },
    consulting: {
      name: "Consulting",
      slug: "consulting",
      description: "Consulting projects",
    },
    contributions: {
      name: "Contributions",
      slug: "contributions",
      description: "Open source contributions",
    },
    static: {
      name: "Static Sites",
      slug: "static",
      description: "Static websites and landing pages",
    },
    template: {
      name: "Templates",
      slug: "template",
      description: "Website templates",
    },
    utility: {
      name: "Utilities",
      slug: "utility",
      description: "Self-hosted utilities and tools",
    },
  };

  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO project_categories (name, slug, description)
    VALUES (?, ?, ?)
  `);

  const insertProject = db.prepare(`
    INSERT INTO projects (
      title, 
      codename, 
      description, 
      category_id, 
      image_url, 
      mobile_image_url,
      github_link, 
      live_link, 
      featured, 
      display_order,
      status,
      date_added,
      tech_stack,
      deployed_with,
      custom_links
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const getCategoryId = db.prepare(
    "SELECT id FROM project_categories WHERE slug = ?",
  );

  // Create categories first
  for (const [key, category] of Object.entries(categoryMapping)) {
    insertCategory.run(category.name, category.slug, category.description);
    console.log(`✓ Created category: ${category.name}`);
  }

  // Migrate all projects
  let totalProjects = 0;

  const migrateAllProjects = db.transaction(() => {
    for (const [categoryKey, projects] of Object.entries(projectsData)) {
      if (!categoryMapping[categoryKey]) {
        console.log(`⚠ Skipping unknown category: ${categoryKey}`);
        continue;
      }

      const category = categoryMapping[categoryKey];
      const categoryRow = getCategoryId.get(category.slug) as any;

      if (!categoryRow) {
        console.error(`❌ Category not found: ${category.slug}`);
        continue;
      }

      if (!Array.isArray(projects)) {
        console.log(`⚠ ${categoryKey} is not an array, skipping`);
        continue;
      }

      projects.forEach((project: any, index: number) => {
        const codename = project.name.toLowerCase().replace(/\s+/g, "-");

        // Prepare tech_stack JSON
        const techStack = project.techstack
          ? JSON.stringify(project.techstack)
          : "[]";

        // Prepare deployed_with JSON
        const deployedWith = project.deployedWith
          ? JSON.stringify(project.deployedWith)
          : "[]";

        // Prepare custom_links JSON
        const customLinks = [];
        if (project.link) {
          customLinks.push({
            name: "Live Demo",
            url: project.link,
            color: "#6366f1",
          });
        }
        if (project.onGithub) {
          customLinks.push({
            name: "GitHub",
            url: project.onGithub,
            color: "#181717",
          });
        }
        if (project.onGrit) {
          customLinks.push({
            name: "Grit",
            url: project.onGrit,
            color: "#609926",
          });
        }

        // Parse date_added (format: DD.MM.YYYY)
        let dateAdded = null;
        if (project.dateAdded) {
          const [day, month, year] = project.dateAdded.split(".");
          if (day && month && year) {
            dateAdded = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }
        }

        try {
          insertProject.run(
            project.name,
            codename,
            project.desc || null,
            categoryRow.id,
            project.image || null,
            project.mobileImage || null,
            project.onGithub || null,
            project.link || null,
            1, // All projects are featured by default
            index + 1,
            project.status || null,
            dateAdded,
            techStack,
            deployedWith,
            JSON.stringify(customLinks),
          );
          totalProjects++;
          console.log(`  ✓ Migrated: ${project.name} (${category.name})`);
        } catch (error) {
          console.error(`  ❌ Error migrating ${project.name}:`, error);
        }
      });
    }
  });

  try {
    migrateAllProjects();
    console.log(
      `\n✅ Migration completed! ${totalProjects} projects imported.`,
    );
  } catch (error) {
    console.error("❌ Error during migration:", error);
  }

  db.close();
}

migrateProjects().catch(console.error);
