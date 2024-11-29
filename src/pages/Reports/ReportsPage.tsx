import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Alert
} from '@mui/material';
import {
  Description as FileTextIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { generateReport } from '../../utils/reportGenerator';
import { standardsEvaluator } from '../../utils/standardsEvaluator';

const ReportsPage = () => {
  const location = useLocation();
  const { responses } = location.state || {};
  const [clientInfo, setClientInfo] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!clientInfo.name || !clientInfo.location) {
      setError("Veuillez remplir toutes les informations client");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const evaluation = standardsEvaluator.evaluateDatacenter(responses || {});
      
      await generateReport({
        clientInfo,
        evaluation
      });

      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors de la génération du rapport");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Génération de Rapport
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informations Client
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du Client"
                value={clientInfo.name}
                onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localisation"
                value={clientInfo.location}
                onChange={(e) => setClientInfo(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={clientInfo.date}
                onChange={(e) => setClientInfo(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileTextIcon />}
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? 'Génération...' : 'Générer le Rapport'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Le rapport généré inclura :
        <ul>
          <li>Évaluation détaillée selon les normes TIA-942 et UPTIME</li>
          <li>Scores et métriques de performance</li>
          <li>Recommandations priorisées</li>
          <li>Estimations de coûts et délais</li>
        </ul>
      </Typography>
    </Box>
  );
};

export default ReportsPage;
