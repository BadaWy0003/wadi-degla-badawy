import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import projects from '../../../../src/components/Projects/projectList';
import ProjectDetails from '../../../../src/components/Projects/ProjectDetails';

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    projects.map((p) => ({ lang, projectId: String(p.id) })),
  );
}

export function generateMetadata({ params }) {
  const { lang, projectId } = params;
  const project = projects.find((p) => String(p.id) === String(projectId));
  return {
    // Each project gets its own title and canonical URL (it used to point to /projects/,
    // which told Google to ignore the detail pages).
    title: project
      ? `${project.name} | Wadi Degla`
      : t(lang, 'projects.pageTitle', 'ProjectDetails | Wadi Degla'),
    description: t(lang, 'projects.metaDescription', ''),
    alternates: buildAlternates(`/projects/${projectId}`, lang),
  };
}

export default function ProjectDetailsPage({ params }) {
  return <ProjectDetails />;
}
