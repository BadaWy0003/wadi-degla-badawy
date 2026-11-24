import { createTheme } from '@mui/material';

// Admin panel look (redesign step 1, 2026-11-24): the website's gold on a warm light
// background, thin borders instead of heavy shadows, one type scale for every page.
export const colors = {
  gold: '#ad9571',
  goldDark: '#8f7a58',
  goldSoft: 'rgba(173, 149, 113, 0.12)',
  blue: '#6a7b83',
  ink: '#1f1b16',
  muted: '#6f6a62',
  line: '#e8e2d8',
  white: '#ffffff',
  lightGray: '#f6f4f0',
  mediumGray: '#e0e0e0',
  darkGray: '#808285',
};

const font = '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

let base = createTheme({
  palette: {
    primary: { main: colors.gold, dark: colors.goldDark, contrastText: '#fff' },
    secondary: { main: colors.blue, contrastText: '#fff' },
    text: { primary: colors.ink, secondary: colors.muted },
    divider: colors.line,
    background: { default: colors.lightGray, paper: colors.white },
  },
  typography: {
    fontFamily: font,
    h4: { fontWeight: 650, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

export const theme = createTheme(base, {
  typography: {
    // page titles: the same size on every page
    h4: { fontSize: '1.9rem', [base.breakpoints.down('md')]: { fontSize: '1.5rem' } },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: colors.white, color: colors.ink, boxShadow: 'none', borderBottom: `1px solid ${colors.line}` },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: colors.white, borderRight: `1px solid ${colors.line}` } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 16 },
        containedPrimary: { '&:hover': { backgroundColor: colors.goldDark } },
        containedSecondary: { '&:hover': { backgroundColor: '#56656c' } },
        outlinedPrimary: { borderColor: colors.line, '&:hover': { borderColor: colors.gold, backgroundColor: colors.goldSoft } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 14 },
        elevation1: { boxShadow: '0 1px 2px rgba(31,27,22,0.04)', border: `1px solid ${colors.line}` },
        outlined: { borderColor: colors.line },
      },
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 2px rgba(31,27,22,0.04)', border: `1px solid ${colors.line}` } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: colors.white,
            '&:hover fieldset': { borderColor: colors.gold },
            '&.Mui-focused fieldset': { borderColor: colors.gold },
          },
        },
      },
    },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': { backgroundColor: colors.lightGray, '& .MuiListItemIcon-root': { color: colors.gold } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: { tooltip: { backgroundColor: colors.ink, fontSize: '0.8rem' }, arrow: { color: colors.ink } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    // Phones: tighter table cells and icon buttons, so the action icons fit next to the name
    MuiTableCell: {
      styleOverrides: {
        // table headers: light and bold
        head: {
          backgroundColor: colors.lightGray,
          fontWeight: 600,
          color: colors.muted,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
        root: {
          borderColor: colors.line,
          '@media (max-width: 599.95px)': {
            padding: '8px 4px',
            '& .MuiIconButton-root': { padding: '5px' },
            // the last column holds the action icons: let them wrap onto 2 lines instead of being cut off
            '&:last-of-type': { whiteSpace: 'normal', minWidth: 72 },
          },
        },
      },
    },
    MuiTableRow: { styleOverrides: { root: { '&.MuiTableRow-hover:hover': { backgroundColor: '#faf8f4' } } } },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          // Phones: forms and dialogs use (almost) the whole screen instead of a 32 px margin
          '@media (max-width: 599.95px)': { margin: '8px', maxHeight: 'calc(100% - 16px)' },
        },
        paperFullWidth: { '@media (max-width: 599.95px)': { width: 'calc(100% - 16px)' } },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 650, fontSize: '1.2rem' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});
