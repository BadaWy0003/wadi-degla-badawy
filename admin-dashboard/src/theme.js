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
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: colors.lightGray,
          fontWeight: 600,
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  },
});
