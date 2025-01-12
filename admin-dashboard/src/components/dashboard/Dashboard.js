import { Box, Paper, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Inventory,
  Collections,
  Group,
  People,
  DriveFolderUpload
} from '@mui/icons-material';
import { useGlobalState } from "../GlobalStateContext"; // Ensure this exists

export default function Dashboard() {
  const navigate = useNavigate();
  

  const menuCards = [
    {
      title: 'Products',
      icon: <Inventory sx={{ fontSize: 60 }} />,
      path: '/products',
      color: '#4caf50', // green
    },
    {
      title: 'Gallery',
      icon: <Collections sx={{ fontSize: 60 }} />,
      path: '/gallery',
      color: '#2196f3', // blue
    },
    {
      title: 'Users',
      icon: <Group sx={{ fontSize: 60 }} />,
      path: '/users',
      color: '#ff9800', // orange
    },
    {
      title: 'Customers',
      icon: <People sx={{ fontSize: 60 }} />,
      path: '/customers',
      color: '#9c27b0', // purple
    },
    {
      title: 'Documents',
      icon: <DriveFolderUpload sx={{ fontSize: 60 }} />,
      path: '/documents',
      color: '#ad9571', // purple
    },
  ];
  const { globalState } = useGlobalState();



  console.log("HOME/////GlobalState.username: " + globalState.username + 
    " GlobalState.email: "+ globalState.email + " GlobalState.token: "
     + globalState.token + " GlobalState.role: " + globalState.role);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome to the Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {menuCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                height: '200px',
                justifyContent: 'center',
                backgroundColor: `${card.color}15`, // 15% opacity of the color
                borderTop: `4px solid ${card.color}`,
              }}
              onClick={() => navigate(card.path)}
            >
              <Box sx={{ 
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {card.icon}
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}