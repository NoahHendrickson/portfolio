import ProjectShowcase from './ProjectShowcase'
import ProjectCurved from './ProjectCurved'
import type { Project } from '../data/projects'

/**
 * Every `/work/<slug>` page with `landing` data, on the curved cards (`Curved.tsx`):
 * Crisp through its own `showcasePage` layout (`ProjectShowcase`), the rest through
 * `ProjectCurved`.
 */
export default function ProjectStory({ project }: { project: Project }) {
  const landing = project.landing
  if (!landing) return null
  if (landing.showcasePage) return <ProjectShowcase project={project} content={landing.showcasePage} />
  return <ProjectCurved project={project} />
}
