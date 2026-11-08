import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Projects from '../../../src/components/Projects/Projects';
import { getProjects } from '../../../src/util/projects-data';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'projects.pageTitle', 'Projects | Wadi Degla');
  const description = t(lang, 'projects.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/projects', lang),
    ...buildSocial({ title, description, path: '/projects', lang }),
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
  return (
    <>
      <HeroPreload page="projects" />
      <Projects projects={projects} />
    </>
  );
}
