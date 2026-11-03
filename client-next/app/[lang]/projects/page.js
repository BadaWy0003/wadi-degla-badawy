import { t, buildAlternates } from '../../../src/util/meta';
import Projects from '../../../src/components/Projects/Projects';
import { getProjects } from '../../../src/util/projects-data';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'projects.pageTitle', 'Projects | Wadi Degla'),
    description: t(lang, 'projects.metaDescription', ''),
    alternates: buildAlternates('/projects', lang),
  };
}

// Projects from the admin panel, read at build time. The cards only need these fields
// (the photos and descriptions stay on the project pages).
export default async function ProjectsPage({ params }) {
  const projects = (await getProjects(params.lang)).map(
    ({ id, name, city, country, countryId, thumbnail }) => ({
      id,
      name,
      city,
      country,
      countryId,
      thumbnail,
    }),
  );
  return <Projects projects={projects} />;
}
