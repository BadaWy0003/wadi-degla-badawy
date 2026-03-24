import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Projects = dynamic(() => import('../../../src/components/Projects/Projects'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'projects.pageTitle', 'Projects | Wadi Degla'),
    description: t(lang, 'projects.metaDescription', ''),
    alternates: buildAlternates('/projects'),
  };
}

export default function ProjectsPage({ params }) {
  return <Projects />;
}
