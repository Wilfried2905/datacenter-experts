import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Collapse,
} from '@mui/material';

interface Finding {
  title: string;
  status: string;
  details: string;
}

interface MaintenanceResultsProps {
  score: number;
  responses: Record<string, boolean>;
  comments: Record<string, string>;
}

const MaintenanceResults: React.FC = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { score, responses, comments } = location.state as MaintenanceResultsProps;

  const getScoreColor = (score: number): string => {
    if (score <= 50) return '#dc2626'; // red-600
    if (score <= 80) return '#f97316'; // orange-500
    return '#16a34a'; // green-600
  };

  const keyFindings: Finding[] = [
    {
      title: "Systèmes de Refroidissement",
      status: "Critique",
      details: "Redondance insuffisante des systèmes de refroidissement"
    },
    {
      title: "Contrôle Environnemental",
      status: "Satisfaisant",
      details: "Surveillance de température et d'humidité conforme"
    },
    {
      title: "Maintenance Préventive",
      status: "À améliorer",
      details: "Calendrier de maintenance à optimiser"
    },
    {
      title: "Documentation",
      status: "Insuffisant",
      details: "Procédures non mises à jour régulièrement"
    },
    {
      title: "Suivi des KPIs",
      status: "À renforcer",
      details: "Reporting environnemental incomplet"
    }
  ];

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Card>
        <CardContent>
          {/* Score Section */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Score Global
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                color: getScoreColor(score)
              }}
            >
              {score.toFixed(1)}%
            </Typography>
          </Box>

          {/* Key Findings */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
              État des Lieux
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {keyFindings.map((finding, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 4, 
                    bgcolor: 'grey.50', 
                    borderRadius: 2
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2 
                    }}
                  >
                    <Typography variant="h6">
                      {finding.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        bgcolor: 'grey.200', 
                        borderRadius: 10,
                        fontSize: '0.875rem'
                      }}
                    >
                      {finding.status}
                    </Box>
                  </Box>
                  <Typography color="text.secondary">
                    {finding.details}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Recommendations Button */}
          <Button 
            variant="contained"
            fullWidth
            onClick={() => setShowRecommendations(!showRecommendations)}
            sx={{ mb: 2 }}
          >
            {showRecommendations ? "Masquer les Recommandations" : "Voir les Recommandations"}
          </Button>

          {/* Recommendations Section */}
          <Collapse in={showRecommendations}>
            <Box 
              sx={{ 
                mt: 3, 
                p: 4, 
                bgcolor: '#e6f3ff', 
                borderRadius: 2 
              }}
            >
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
                Recommandations
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  • Mettre en place une redondance N+1 pour tous les systèmes critiques
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  • Établir un calendrier de maintenance préventive strict
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  • Améliorer la documentation des procédures
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  • Installer des capteurs environnementaux supplémentaires
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  • Mettre en place un tableau de bord de suivi des KPIs
                </Typography>
              </Box>
            </Box>
          </Collapse>

          {/* Next Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/detailed-recommendations', { 
                state: { 
                  score,
                  responses,
                  comments
                }
              })}
            >
              Voir les recommandations détaillées
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaintenanceResults;
