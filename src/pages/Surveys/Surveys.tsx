import React from 'react';
import {
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const mockSurveys = [
  {
    id: 1,
    title: 'Audit Datacenter Paris',
    status: 'En cours',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Survey Infrastructure Lyon',
    status: 'Planifié',
    date: '2024-02-01',
  },
  {
    id: 3,
    title: 'Audit Sécurité Marseille',
    status: 'Terminé',
    date: '2024-01-10',
  },
];

const Surveys: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Survey et Audits
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Nouveau Survey
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Surveys Récents
            </Typography>
            <List>
              {mockSurveys.map((survey) => (
                <ListItem
                  key={survey.id}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <ListItemText
                    primary={survey.title}
                    secondary={`Status: ${survey.status} | Date: ${survey.date}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Total Surveys" secondary="15" />
              </ListItem>
              <ListItem>
                <ListItemText primary="En cours" secondary="5" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Planifiés" secondary="7" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Terminés" secondary="3" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Surveys;
