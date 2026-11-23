import { createTheme } from '@mui/material';

const colors = {
  gold: '#ad9571',
  blue: '#6a7b83',
  white: '#ffffff',
  lightGray: '#f5f5f5',
  mediumGray: '#e0e0e0',
  darkGray: '#808285',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.gold,
      contrastText: '#fff',
    },
    secondary: {
      main: colors.blue,
      contrastText: '#fff',
    },
    background: {
      default: colors.lightGray,
      paper: colors.white,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          color: colors.gold,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.white,
          borderRight: 'none',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: colors.gold,
          '&:hover': {
            backgroundColor: colors.darkGray,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          transition: 'all 0.2s ease',
        },
        containedSecondary: {
          backgroundColor: colors.blue,
          '&:hover': {
            backgroundColor: colors.darkGray,
            transform: 'translateY(-1px)',
          },
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: colors.gold,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.gold,
            },
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: colors.lightGray,
            '& .MuiListItemIcon-root': {
              color: colors.gold,
            }
          }
        }
      }
    },
    // Phones: tighter table cells and icon buttons, so the action icons fit next to the name
    MuiTableCell: {
      styleOverrides: {
        // table headers: grey and bold (this was a second MuiTableCell entry until 2026-11-23,
        // which the phone entry below silently replaced)
        head: {
          backgroundColor: colors.lightGray,
          fontWeight: 600,
        },
        root: {
          '@media (max-width: 599.95px)': {
            padding: '8px 4px',
            '& .MuiIconButton-root': { padding: '5px' },
            // the last column holds the action icons: let them wrap onto 2 lines instead of being cut off
            '&:last-of-type': { whiteSpace: 'normal', minWidth: 72 },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          // Phones: forms and dialogs use (almost) the whole screen instead of a 32 px margin
          '@media (max-width: 599.95px)': {
            margin: '8px',
            maxHeight: 'calc(100% - 16px)',
          },
        },
        paperFullWidth: {
          '@media (max-width: 599.95px)': {
            width: 'calc(100% - 16px)',
          },
        },
      }
    }
  },
  shape: {
    borderRadius: 8
  },
});
