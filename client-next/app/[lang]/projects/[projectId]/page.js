import { t, buildAlternates, buildSocial } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import ProjectDetails from '../../../../src/components/Projects/ProjectDetails';
import {
  getProjectIds,
  getProject,
  getProjectIndexedLangs,
} from '../../../../src/util/projects-data';

// One page per project and language, from the admin panel (read at build time). The
// address is the project number (/projects/7). With no visible projects, a static export
// can't have an empty dynamic route, so a placeholder page ("project not found", noindex,
// not in the sitemap) is built.
const EMPTY_ID = 'no-projects';

export async function generateStaticParams() {
  const ids = await getProjectIds();
  const list = ids.length ? ids : [EMPTY_ID];
  return SUPPORTED_LANGS.flatMap((lang) => list.map((projectId) => ({ lang, projectId })));
}

export async function generateMetadata({ params }) {
  const { lang, projectId } = params;
  const project = await getProject(projectId, lang);
  const langs = await getProjectIndexedLangs(projectId);
  const title = project
    ? `${project.name} | Wadi Degla`
    : t(lang, 'projects.pageTitle', 'ProjectDetails | Wadi Degla');
  const description = project?.metaDescription || t(lang, 'projects.metaDescription', '');
  return {
    // Each project gets its own title, description (when written) and canonical URL.
    title,
    description,
    alternates: buildAlternates(`/projects/${projectId}`, lang, langs),
    // Shared links show the project's main photo.
    ...buildSocial({
      title,
      description,
      path: `/projects/${projectId}`,
      lang,
      image: project?.thumbnail || project?.images?.[0]?.src,
    }),
    // Not found, or not written in this language: keep out of Google.
    ...(project && langs.includes(lang) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ProjectDetailsPage({ params }) {
  const project = await getProject(params.projectId, params.lang);
  return <ProjectDetails project={project} />;
}
