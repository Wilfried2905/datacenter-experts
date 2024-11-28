import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { Assignment as ClipboardIcon, 
         Assessment as SpreadsheetIcon, 
         AccountTree as WorkflowIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SurveyAudits: React.FC = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Survey',
      icon: <ClipboardIcon sx={{ fontSize: 40 }} />,
      description: 'Gestion des surveys et visites techniques'
    },
    {
      title: 'Audits',
      icon: <SpreadsheetIcon sx={{ fontSize: 40 }} />,
      description: 'Rapports et audits datacenter'
    },
    {
      title: 'Autres Services',
      icon: <WorkflowIcon sx={{ fontSize: 40 }} />,
      description: 'Services complémentaires'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 6,
                },
                backgroundColor: theme.palette.background.paper,
              }}
              onClick={() => console.log(`Navigating to ${section.title}`)}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 2,
                  }}
                >
                  {section.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 2,
                    fontWeight: 'bold',
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SurveyAudits;
