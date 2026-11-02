import { Box, Chip, Typography } from '@mui/material';
import { photoUrl, toParagraphs } from '../../util/news';
import { locationText } from '../../util/projects';

// Preview of a project page in the website's design (client-next/src/components/Projects/
// ProjectDetails.js): photo slider on the left, white card on the right with the gold
// title, location, description and the materials supplied. lang = 'en' | 'ar'; Arabic
// falls back to English when a field is empty, exactly like the website.
const C = { bg: '#0A0A0A', gold: '#ad9571', blue: '#6a7b83', grey: '#808285', white: '#fff' };
const LABELS = {
  en: { home: 'Home', projects: 'Projects', location: 'Location:', materials: 'Materials Supplied:', none: 'No materials available.' },
  ar: { home: 'الرئيسية', projects: 'المشاريع العالمية', location: 'الموقع:', materials: 'المواد المستخدمة:', none: 'لا توجد مواد متاحة.' },
};

export default function ProjectPreview({ project, lang = 'en' }) {
  const pick = field => (lang === 'ar' && field?.ar?.trim() ? field.ar : field?.en || '');
  const L = LABELS[lang];
  const rtl = lang === 'ar';
  const name = pick(project.name);
  const paragraphs = toParagraphs(pick(project.description));
  const photo = project.images?.[0]?.src || project.thumbnail;

  return (
    <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ bgcolor: C.bg, p: { xs: 2, md: 3 }, borderRadius: 1, fontFamily: rtl ? 'Cairo, sans-serif' : 'inherit' }}>
      <Typography sx={{ color: C.grey, fontSize: 13, mb: 2 }}>
        <span style={{ color: C.gold }}>{L.home}</span> {'>'} <span style={{ color: C.gold }}>{L.projects}</span> {'>'} {name || '…'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch' }}>
        <Box sx={{ flex: 3, minHeight: 260, borderRadius: 2, overflow: 'hidden', bgcolor: '#222', position: 'relative' }}>
          {photo && (
            <img src={photoUrl(photo)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          )}
          {project.images?.length > 1 && (
            <Chip
              size="small"
              label={`1 / ${project.images.length}`}
              sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,.6)', color: C.white }}
            />
          )}
        </Box>
        <Box sx={{ flex: 2, bgcolor: C.white, borderRadius: 2, p: 3 }}>
          <Typography sx={{ color: C.gold, textTransform: 'uppercase', fontWeight: 700, fontSize: { xs: 20, md: 26 }, mb: 1.5 }}>
            {name || '(no name yet)'}
          </Typography>
          <Typography sx={{ color: C.blue, mb: 2 }}>
            {L.location} <strong>{locationText(pick(project.city), pick(project.country))}</strong>
          </Typography>
          {paragraphs.map((p, i) => (
            <Typography key={i} sx={{ color: '#1F1F1F', fontSize: 15, lineHeight: 1.7, mb: 1.5, whiteSpace: 'pre-line' }}>
              {p}
            </Typography>
          ))}
          <Typography sx={{ color: C.blue, mt: 1, mb: 1 }}>{L.materials}</Typography>
          {project.materialNames?.length ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.materialNames.map(n => (
                <Chip key={n} label={n} variant="outlined" sx={{ borderColor: C.gold }} />
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: '#1F1F1F' }}>{L.none}</Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }} dir="ltr">
            (On the website each material shows as a product card with its photo.)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
