import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  EmojiEvents as AwardIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import TIA942Services from './TIA942Services';
import UptimeServices from './UptimeServices';

const DatacenterStandards: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const theme = useTheme();

  const standards = [
    {
      name: 'TIA-942',
      icon: <ShieldIcon sx={{ fontSize: 48 }} />,
      description: 'Telecommunications Industry Association',
      tiers: ['Rated-1', 'Rated-2', 'Rated-3', 'Rated-4']
    },
    {
      name: 'UPTIME INSTITUTE',
      icon: <AwardIcon sx={{ fontSize: 48 }} />,
      description: 'Uptime Institute Professional Services',
      tiers: ['TIER I', 'TIER II', 'TIER III', 'TIER IV']
    }
  ];

  const handleStandardSelect = (standard: string) => {
    setSelectedStandard(standard);
  };

  if (selectedStandard === 'TIA-942') {
    return <TIA942Services />;
  }

  if (selectedStandard === 'UPTIME INSTITUTE') {
    return <UptimeServices />;
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: theme.palette.primary.main,
          mb: 4,
          textAlign: 'center',
          fontWeight: 'bold'
        }}
      >
        Sélectionnez votre Standard
      </Typography>

      <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {standards.map((standard) => (
          <Grid item xs={12} md={6} key={standard.name}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[10],
                },
              }}
              onClick={() => handleStandardSelect(standard.name)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: theme.palette.primary.main }}>
                  {standard.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 2,
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                >
                  {standard.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  {standard.description}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mt: 2 }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Niveaux disponibles :
                  </Typography>
                  <Grid container spacing={1}>
                    {standard.tiers.map((tier) => (
                      <Grid item xs={6} key={tier}>
                        <Chip
                          label={tier}
                          sx={{
                            width: '100%',
                            bgcolor: 'background.default',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DatacenterStandards;
