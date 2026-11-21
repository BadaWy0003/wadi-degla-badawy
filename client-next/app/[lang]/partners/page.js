import { t, listText, buildAlternates, buildSocial } from '../../../src/util/meta';
import Partners from '../../../src/components/Partners/Partners';
import { PARTNERS } from '../../../src/components/Partners/PartnersData';
import { getProjects, projectCard } from '../../../src/util/projects-data';

export async function generateMetadata(props) {
  const params = await props.params;
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
export default async function PartnersPage(props) {
  const params = await props.params;
  const all = await getProjects(params.lang);
  const wanted = new Set(PARTNERS.flatMap((p) => p.projects));
  const projects = Object.fromEntries(
    all.filter((p) => wanted.has(String(p.id))).map((p) => [String(p.id), projectCard(p)]),
  );
  const stories = Object.fromEntries(
    PARTNERS.map((p) => [p.id, listText(p.story, params.lang, `partners.stories.${p.id}`)]),
  );
  return <Partners projects={projects} projectCount={all.length} stories={stories} />;
}
