import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Partners from '../../../src/components/Partners/Partners';
import { PARTNERS } from '../../../src/components/Partners/PartnersData';
import { getProjects, projectCard } from '../../../src/util/projects-data';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'partners.pageTitle', 'Partners | Wadi Degla');
  const description = t(lang, 'partners.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/partners', lang),
    ...buildSocial({ title, description, path: '/partners', lang }),
  };
}

// The partners' projects (cards) come from the admin panel at build time, so their names and
// links are in the HTML.
export default async function PartnersPage({ params }) {
  const all = await getProjects(params.lang);
  const wanted = new Set(PARTNERS.flatMap((p) => p.projects));
  const projects = Object.fromEntries(
    all.filter((p) => wanted.has(String(p.id))).map((p) => [String(p.id), projectCard(p)]),
  );
  return <Partners projects={projects} projectCount={all.length} />;
}
