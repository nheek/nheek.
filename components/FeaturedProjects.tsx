import FeaturedProjectsClient from "./FeaturedProjectsClient";

interface Project {
  id: string;
  name: string;
  codename?: string;
  desc?: string;
  description?: string;
  image?: string;
  githubLink?: string;
  liveLink?: string;
  dateAdded?: string;
  featured?: boolean;
}

interface ApiProject {
  id: number;
  title: string;
  codename: string;
  description: string;
  category_slug: string;
  image_url: string;
  github_link: string;
  live_link: string;
  date_added: string;
  created_at: string;
  featured: number;
}

async function getProjects(): Promise<Record<string, Project[]>> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      cache: "no-store", // Always get fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch projects:", response.statusText);
      return {};
    }

    const data = await response.json();
    const apiProjects = data.projects || [];

    // Group projects by category
    const groupedProjects: Record<string, Project[]> = {};
    apiProjects.forEach((project: ApiProject) => {
      const categorySlug = project.category_slug || "uncategorized";
      if (!groupedProjects[categorySlug]) {
        groupedProjects[categorySlug] = [];
      }
      groupedProjects[categorySlug].push({
        id: project.id.toString(),
        name: project.title,
        codename: project.codename,
        desc: project.description,
        description: project.description,
        image: project.image_url,
        githubLink: project.github_link,
        liveLink: project.live_link,
        dateAdded: project.date_added || project.created_at,
        featured: project.featured === 1,
      });
    });

    return groupedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {};
  }
}

export default async function FeaturedProjects() {
  const projects = await getProjects();

  return <FeaturedProjectsClient initialProjects={projects} />;
}
