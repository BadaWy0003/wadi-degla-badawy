import { t, buildAlternates } from '../../../src/components/../util/meta';
import Projects from '../../../src/components/Projects/Projects';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'projects.pageTitle', 'Projects | Wadi Degla'),
    description: t(lang, 'projects.metaDescription', ''),
    alternates: buildAlternates('/projects', lang),
  };
}

export default function ProjectsPage({ params }) {
  return <Projects />;
}
