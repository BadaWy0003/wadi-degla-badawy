import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import projects from '../../../../src/components/Projects/projectList';
const ProjectDetails = dynamic(() => import('../../../../src/components/Projects/ProjectDetails'), { ssr: false });

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    projects.map((p) => ({ lang, projectId: String(p.id) }))
  );
}

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'projects.pageTitle', 'ProjectDetails | Wadi Degla'),
    description: t(lang, 'projects.metaDescription', ''),
    alternates: buildAlternates('/projects', lang),
  };
}

export default function ProjectDetailsPage({ params }) {
  return <ProjectDetails />;
}
