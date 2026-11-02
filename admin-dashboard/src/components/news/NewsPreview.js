import { Box, Typography } from '@mui/material';
import { formatDate, photoUrl, toParagraphs } from '../../util/news';

// Preview of an article in the website's design (same colours, layout and paragraph rule as
// client-next/src/components/News/NewsDetail.js). lang = 'en' | 'ar'; Arabic falls back to
// English when a field is empty, exactly like the website.
const C = { bg: '#0A0A0A', gold: '#ad9571', white: '#fff', light: '#bcbec0', grey: '#808285' };

export default function NewsPreview({ article, lang = 'en' }) {
  const pick = field => (lang === 'ar' && article[field]?.ar?.trim() ? article[field].ar : article[field]?.en || '');
  const title = pick('title');
  const paragraphs = toParagraphs(pick('content'));
  const images = article.images || [];
  const rtl = lang === 'ar';

  return (
    <Box
      dir={rtl ? 'rtl' : 'ltr'}
      sx={{ bgcolor: C.bg, pb: 6, fontFamily: rtl ? 'Cairo, sans-serif' : 'inherit', borderRadius: 1, overflow: 'hidden' }}
    >
      <Box
        sx={{
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
          background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${photoUrl(article.thumbnail)}) center/cover no-repeat, #222`,
        }}
      >
        <Typography
          sx={{
            color: C.white,
            fontSize: { xs: '1.3rem', md: '2.2rem' },
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            maxWidth: '85%',
            lineHeight: 1.35,
          }}
        >
          {title || '(no title yet)'}
        </Typography>
        <Typography sx={{ color: C.white, fontSize: 14, mt: 2 }}>
          {rtl ? 'الرئيسية' : 'Home'} {'>'} <span style={{ color: C.gold }}>{rtl ? 'الأخبار' : 'News'}</span>
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 820, mx: 'auto', px: 3, mt: 4 }}>
        <Typography sx={{ color: C.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
          {formatDate(article.year, article.month)}
        </Typography>
        {paragraphs.length ? (
          paragraphs.map((p, i) => (
            <Typography key={i} sx={{ color: C.light, fontSize: 16, lineHeight: 1.8, mb: 2, whiteSpace: 'pre-line' }}>
              {p}
            </Typography>
          ))
        ) : (
          <Typography sx={{ color: C.grey }}>(no text yet)</Typography>
        )}
        {article.author && <Typography sx={{ color: C.grey, fontSize: 13, mt: 2 }}>— {article.author}</Typography>}
      </Box>

      {images.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
            gap: 1,
            maxWidth: 1200,
            mx: 'auto',
            px: 3,
            mt: 4,
          }}
        >
          {images.map((img, i) => (
            <Box key={i} sx={{ aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 1 }}>
              <img src={photoUrl(img.src)} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
