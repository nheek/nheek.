import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import * as fs from "fs";
import * as path from "path";

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), "data", "nheek.db");
    const dbExists = fs.existsSync(dbPath);

    if (dbExists) {
      await requireAuth();
    }

    const db = getDb();

    // Read projects.json
    const projectsPath = path.join(
      process.cwd(),
      "public",
      "featured-projects",
      "json",
      "projects.json",
    );

    if (!fs.existsSync(projectsPath)) {
      return NextResponse.json(
        { error: "projects.json not found" },
        { status: 404 },
      );
    }

    const projectsData = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));

    // Category mapping
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
      INSERT OR IGNORE INTO project_categories (name, slug, description)
      VALUES (?, ?, ?)
    `);

    const updateCategory = db.prepare(`
      UPDATE project_categories SET name = ?, description = ? WHERE slug = ?
    `);

    const insertProject = db.prepare(`
      INSERT INTO projects (
        title, codename, description, category_id, image_url,
        github_link, live_link, featured, display_order, date_added,
        custom_links
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(codename) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        category_id = excluded.category_id,
        image_url = excluded.image_url,
        github_link = excluded.github_link,
        live_link = excluded.live_link,
        featured = excluded.featured,
        display_order = excluded.display_order,
        date_added = excluded.date_added,
        custom_links = excluded.custom_links
    `);

    const getCategoryId = db.prepare(
      "SELECT id FROM project_categories WHERE slug = ?",
    );

    let categoriesCount = 0;
    let projectsCount = 0;

    const migrateAllProjects = db.transaction(() => {
      // Create categories first
      for (const [, category] of Object.entries(categoryMapping)) {
        const result = insertCategory.run(
          category.name,
          category.slug,
          category.description,
        );
        if (result.changes > 0) {
          categoriesCount++;
        } else {
          // Update existing category
          updateCategory.run(
            category.name,
            category.description,
            category.slug,
          );
        }
      }

      // Import all projects
      for (const [categoryKey, projects] of Object.entries(projectsData)) {
        if (!categoryMapping[categoryKey]) {
          continue;
        }

        const category = categoryMapping[categoryKey];
        const categoryRow = getCategoryId.get(category.slug) as any;

        if (!categoryRow || !Array.isArray(projects)) {
          continue;
        }

        interface ProjectData {
          name: string;
          desc?: string;
          image?: string;
          onGithub?: string;
          link?: string;
          onGrit?: string;
          dateAdded?: string;
        }

        projects.forEach((project: ProjectData, index: number) => {
          const codename = project.name.toLowerCase().replace(/\s+/g, "-");

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
              project.onGithub || null,
              project.link || null,
              1, // All projects are featured by default
              index + 1,
              dateAdded || "2000-01-01",
              JSON.stringify(customLinks),
            );
            projectsCount++;
          } catch (error) {
            console.error(`Error migrating ${project.name}:`, error);
          }
        });
      }
    });

    migrateAllProjects();

    return NextResponse.json({
      message: "Projects migrated successfully",
      stats: {
        categories: categoriesCount,
        projects: projectsCount,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error migrating projects:", error);
    return NextResponse.json(
      { error: "Failed to migrate projects" },
      { status: 500 },
    );
  }
}
