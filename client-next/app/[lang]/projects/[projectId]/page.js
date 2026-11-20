import { t, buildAlternates, buildSocial } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import ProjectDetails from '../../../../src/components/Projects/ProjectDetails';
import {
  getProjectIds,
  getProject,
  getProjectIndexedLangs,
  getProjects,
  projectCard,
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

// A project with no written description gets its own short one (name, place, up to 4 stones),
// so project pages don't all share the Projects page's description. At most 155 characters:
// stones are dropped from the end until it fits.
function autoDescription(lang, project) {
  const names = (project.materials || []).map((m) => m.name).filter(Boolean);
  const list = (n) => new Intl.ListFormat(lang, { type: 'conjunction' }).format(n);
  const fill = (key, stones, place) => {
    let tpl = t(lang, key, '');
    if (!place) tpl = tpl.replace(/[,،]\s*\{\{place\}\}|（\{\{place\}\}）/, '');
    return tpl
      .replace('{{name}}', project.name)
      .replace('{{place}}', place)
      .replace('{{stones}}', stones);
  };
  // with the place first; a long project name may need it left out
  const places = [[project.city, project.country].filter(Boolean).join(', '), ''];
  for (const place of [...new Set(places)]) {
    for (let n = Math.min(names.length, 4); n > 0; n -= 1) {
      const d = fill('projects.metaAuto', list(names.slice(0, n)), place);
      if (d.length <= 155) return d;
    }
    const d = fill('projects.metaAutoNoStones', '', place);
    if (d.length <= 155) return d;
  }
  return '';
}

export async function generateMetadata({ params }) {
  const { lang, projectId } = params;
  const project = await getProject(projectId, lang);
  const langs = await getProjectIndexedLangs(projectId);
  // " | Wadi Degla" is left off when the title would pass 60 characters (Google cuts the rest)
  const title = project
    ? `${project.name} | Wadi Degla`.length > 60
      ? project.name
      : `${project.name} | Wadi Degla`
    : t(lang, 'projects.pageTitle', 'ProjectDetails | Wadi Degla');
  const description =
    project?.metaDescription ||
    (project && autoDescription(lang, project)) ||
    t(lang, 'projects.metaDescription', '');
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

// "More projects": the other projects of the same country, or else 3 others.
export default async function ProjectDetailsPage({ params }) {
  const project = await getProject(params.projectId, params.lang);
  const others = project
    ? (await getProjects(params.lang)).filter((p) => p.id !== project.id)
    : [];
  const sameCountry = others.filter((p) => p.countryId === project?.countryId);
  const related = (sameCountry.length ? sameCountry : others).slice(0, 6).map(projectCard);
  return (
    <ProjectDetails
      project={project}
      related={related}
      relatedSameCountry={sameCountry.length > 0}
    />
  );
}
