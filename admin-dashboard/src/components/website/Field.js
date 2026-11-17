import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DAY_NAMES, FACT_LABELS, WEEKDAYS, checkAny, factsIn, isChanged, originalOf } from '../../util/website';
import { CountryInput, I18nInput, ImageInput, ImagesInput, ListInput, ProductsInput, ProjectsInput, SelectInput } from './Inputs';

const hourLabel = h => `${String(h).padStart(2, '0')}:00`;

// The original value, shown under a changed field.
const originalText = (f, orig) => {
  if (f.type === 'text') return orig.en || '—';
  if (f.type === 'days') return (orig || []).join(', ');
  if (f.type === 'hour') return hourLabel(orig);
  if (f.type === 'number') return `${Number(orig).toLocaleString('en-US')}${f.suffix || ''}`;
  if (f.type === 'list') return `${(orig || []).length} items`;
  if (f.type === 'products') return `${(orig || []).length} stones`;
  if (f.type === 'image') return orig?.src ? "the website's own photo" : '—';
  return String(orig || '—');
};

// The inputs of the list/photo field types (also used inside list items).
export function renderInput(f, value, onChange, showErrors) {
  switch (f.type) {
    case 'image':
      return <ImageInput value={value} onChange={onChange} />;
    case 'images':
      return <ImagesInput value={value} onChange={onChange} field={f} />;
    case 'i18n':
      return <I18nInput value={value} onChange={onChange} field={f} />;
    case 'select':
      return <SelectInput value={value} onChange={onChange} field={f} />;
    case 'country':
      return <CountryInput value={value} onChange={onChange} />;
    case 'projects':
      return <ProjectsInput value={value} onChange={onChange} />;
    case 'products':
      return <ProductsInput value={value} onChange={onChange} field={f} />;
    case 'list':
      return <ListInput value={value} onChange={onChange} field={f} showErrors={showErrors} renderInput={renderInput} />;
    case 'line':
    case 'number':
      return (
        <TextField
          fullWidth
          size="small"
          type={f.type === 'number' ? 'number' : 'text'}
          value={value ?? ''}
          onChange={e => onChange(f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
          inputProps={f.type === 'number' ? { min: f.min, max: f.max, step: 1 } : { maxLength: f.max || 120 }}
          sx={{ maxWidth: f.type === 'number' ? 200 : 'none' }}
        />
      );
    default:
      return null;
  }
}

// One editable item of a website page. value / onChange: the current value; defaults: the
// website's originals (for "Changed" and "Reset to original"); showErrors: after a save attempt.
export default function Field({ field: f, value, onChange, defaults, showErrors, extra }) {
  const orig = originalOf(f, defaults);
  const changed = isChanged(f, f.type === 'number' || f.type === 'hour' ? Number(value) : value, orig);
  const error = checkAny(f, value);
  const showError = !!error && (showErrors || changed);
  const facts = f.type === 'text' ? factsIn(value?.en) : [];

  const reset = () => onChange(f.type === 'text' ? { en: orig.en || '', ar: orig.ar || '' } : orig);

  let input;
  if (f.type === 'text') {
    const max = f.max || (f.multiline ? 5000 : 500);
    const common = { fullWidth: true, multiline: !!f.multiline, minRows: f.multiline ? 2 : undefined, size: 'small' };
    input = (
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <TextField
          {...common}
          label="English"
          value={value?.en || ''}
          onChange={e => onChange({ ...value, en: e.target.value })}
          error={showError && !value?.en?.trim()}
          helperText={`${(value?.en || '').length} / ${max}`}
          inputProps={{ maxLength: max }}
        />
        <TextField
          {...common}
          label="العربية (Arabic)"
          value={value?.ar || ''}
          onChange={e => onChange({ ...value, ar: e.target.value })}
          helperText={!value?.ar?.trim() ? 'Empty: the Arabic page shows the English text' : `${(value?.ar || '').length} / ${max}`}
          inputProps={{ maxLength: max, dir: 'rtl', lang: 'ar' }}
        />
      </Box>
    );
  } else if (['image', 'images', 'i18n', 'select', 'country', 'projects', 'products', 'list'].includes(f.type)) {
    input = renderInput(f, value, onChange, showErrors);
  } else if (f.type === 'days') {
    input = (
      <ToggleButtonGroup
        size="small"
        value={Array.isArray(value) ? value : []}
        onChange={(e, days) => onChange(WEEKDAYS.filter(d => days.includes(d)))}
        sx={{ flexWrap: 'wrap' }}
      >
        {WEEKDAYS.map(d => (
          <ToggleButton key={d} value={d} aria-label={DAY_NAMES[d]} sx={{ px: 1.5 }}>
            {d}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  } else if (f.type === 'hour') {
    input = (
      <TextField
        select
        size="small"
        value={value === '' ? '' : Number(value)}
        onChange={e => onChange(Number(e.target.value))}
        sx={{ minWidth: 140 }}
      >
        {Array.from({ length: 25 }, (_, h) => (
          <MenuItem key={h} value={h}>
            {hourLabel(h)}
          </MenuItem>
        ))}
      </TextField>
    );
  } else {
    const type = { number: 'number', email: 'email', url: 'url', phone: 'tel' }[f.type] || 'text';
    input = (
      <TextField
        fullWidth
        size="small"
        type={type}
        value={value ?? ''}
        onChange={e => onChange(f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        error={showError}
        inputProps={f.type === 'number' ? { min: f.min, max: f.max, step: 1 } : f.type === 'line' ? { maxLength: f.max || 120 } : { dir: 'ltr' }}
        InputProps={{
          endAdornment:
            f.suffix || (f.type === 'url' && value) ? (
              <InputAdornment position="end">
                {f.suffix && <span>{f.suffix.trim()}</span>}
                {f.type === 'url' && value && (
                  <Tooltip title="Open the link">
                    <IconButton size="small" edge="end" href={value} target="_blank" rel="noopener noreferrer">
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </InputAdornment>
            ) : undefined,
        }}
        sx={{ maxWidth: f.type === 'number' ? 260 : 'none' }}
      />
    );
  }

  return (
    <Box sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider', '&:first-of-type': { borderTop: 0, pt: 0.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Typography component="label" sx={{ fontWeight: 600 }}>
          {f.label}
        </Typography>
        {changed && <Chip label="Changed" size="small" color="primary" variant="outlined" />}
        {changed && (
          <Button size="small" startIcon={<RestartAltIcon />} onClick={reset} sx={{ ml: 'auto' }}>
            Reset to original
          </Button>
        )}
      </Box>
      {f.help && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {f.help}
        </Typography>
      )}
      {input}
      {extra}
      {showError && (
        <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
      {facts.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {facts.map(n => `{{facts.${n}}}`).join(', ')}: filled in automatically with the {facts.map(n => FACT_LABELS[n] || n).join(', ')} from
          "Company facts".
        </Typography>
      )}
      {changed && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
          Original: {originalText(f, orig)}
        </Typography>
      )}
    </Box>
  );
}
