import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { standardsEvaluator } from '../../utils/standardsEvaluator';

const formatDomainName = (domain: string) => {
  return domain.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'success.main';
  if (score >= 60) return 'warning.main';
  return 'error.main';
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'p1': return 'error';
    case 'p2': return 'warning';
    case 'p3': return 'success';
    default: return 'default';
  }
};

const ScoreDisplay = ({ score }: { score: number }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 'bold',
        color: getScoreColor(score)
      }}
    >
      {score}%
    </Typography>
    <LinearProgress
      variant="determinate"
      value={score}
      sx={{
        mt: 1,
        height: 8,
        borderRadius: 4,
        bgcolor: 'grey.200',
        '& .MuiLinearProgress-bar': {
          bgcolor: getScoreColor(score),
          borderRadius: 4
        }
      }}
    />
  </Box>
);

const DetailedRecommendations = () => {
  const location = useLocation();
  const { responses } = location.state || {};

  const evaluation = useMemo(() => 
    standardsEvaluator.evaluateDatacenter(responses || {}),
    [responses]
  );

  const Summary = () => {
    const tia942Scores = evaluation.tia942.metrics;
    const uptimeScores = evaluation.uptime.metrics;

    const domainScores = {
      infrastructure: {
        value: tia942Scores.availability,
        priority: evaluation.tia942.recommendations.find(r => r.category === 'Infrastructure Électrique')?.priority || 'P2',
        criticalIssues: evaluation.tia942.recommendations.filter(r => r.priority === 'P1').length
      },
      cooling: {
        value: uptimeScores.cooling || 75,
        priority: evaluation.uptime.recommendations.find(r => r.category === 'Système de Refroidissement')?.priority || 'P2',
        criticalIssues: evaluation.uptime.recommendations.filter(r => r.priority === 'P1').length
      },
      security: {
        value: tia942Scores.security || 80,
        priority: evaluation.tia942.recommendations.find(r => r.category === 'Sécurité Physique')?.priority || 'P3',
        criticalIssues: 0
      },
      operations: {
        value: uptimeScores.operations || 85,
        priority: evaluation.uptime.recommendations.find(r => r.category === 'Maintenance et Opérations')?.priority || 'P2',
        criticalIssues: 0
      }
    };

    return (
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">Score Global</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                TIA-942: Tier {evaluation.tia942.tier} | UPTIME: {evaluation.uptime.tier}
              </Typography>
            </Box>
            <ScoreDisplay score={Math.round((evaluation.tia942.score + evaluation.uptime.score) / 2)} />
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {Object.entries(domainScores).map(([domain, score]) => (
            <Grid item xs={12} sm={6} md={3} key={domain}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, textTransform: 'capitalize' }}>
                  {formatDomainName(domain)}
                </Typography>
                <ScoreDisplay score={score.value} />
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={score.priority}
                    color={getPriorityColor(score.priority)}
                    size="small"
                  />
                  {score.criticalIssues > 0 && (
                    <Chip
                      label={`${score.criticalIssues} critiques`}
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const RecommendationsList = () => {
    const allRecommendations = [
      ...evaluation.tia942.recommendations,
      ...evaluation.uptime.recommendations
    ].reduce((acc: any, rec) => {
      if (!acc[rec.priority]) acc[rec.priority] = [];
      acc[rec.priority].push(rec);
      return acc;
    }, {});

    return (
      <Box sx={{ mt: 4 }}>
        {Object.entries(allRecommendations).map(([priority, items]: [string, any]) => (
          <Paper 
            key={priority}
            sx={{ 
              p: 3, 
              mb: 3,
              bgcolor: priority === 'P1' ? 'error.light' : 
                      priority === 'P2' ? 'warning.light' : 'success.light',
              '& .MuiCard-root': {
                bgcolor: 'background.paper'
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Priorité {priority} - {items.length} actions requises
            </Typography>

            <List>
              {items.map((item: any, index: number) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{item.category}</Typography>
                      <Chip 
                        label={`Impact: ${item.impact}`}
                        color={getPriorityColor(priority)}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List dense>
                      {item.items.map((recommendation: string, idx: number) => (
                        <ListItem key={idx}>
                          <ListItemText primary={recommendation} />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        Mise en œuvre:
                      </Typography>
                      <Typography variant="body2">
                        Délai estimé: {item.timeline}
                      </Typography>
                      <Typography variant="body2">
                        Budget estimé: {item.estimatedCost}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Évaluation Détaillée
      </Typography>
      
      <Summary />
      <RecommendationsList />
    </Box>
  );
};

export default DetailedRecommendations;
