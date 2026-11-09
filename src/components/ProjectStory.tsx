import ProjectCream from './ProjectCream'
import ProjectShowcase from './ProjectShowcase'
import ProjectSheet from './ProjectSheet'
import type { Project } from '../data/projects'

/**
 * Every `/work/<slug>` page with `landing` data. Since Nov 4 2026 they all run
 * the ruled sheet: Crisp through its own `showcasePage` layout
 * (`ProjectShowcase`), the rest through `ProjectSheet`. The screenshot-led
 * story renderer that lived here (banded / continuous rows on the shared
 * project frame) was retired with that move; it's in git history before then.
 * A page that sets `landing.cream` runs the cream lattice instead (`ProjectCream`).
 */
export default function ProjectStory({ project }: { project: Project }) {
  const landing = project.landing
  if (!landing) return null
  if (landing.showcasePage) return <ProjectShowcase project={project} content={landing.showcasePage} />
  if (landing.cream) return <ProjectCream project={project} />
  return <ProjectSheet project={project} />
}
