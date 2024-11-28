import React from 'react';
import { Box, Button, Card, CardContent, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import {
  Description as FileTextIcon,
  Assignment as ClipboardListIcon,
  Search as SearchIcon,
  ContentPaste as ClipboardIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleDocumentGeneration } from '../../utils/documentGenerator';

const ReportsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleGenerateReport = async (type: string) => {
    setLoading(true);
    try {
      const mockData = {
        clientInfo: {
          companyName: "Entreprise Test",
          representativeName: "John Doe",
          phone: "+225 0123456789",
          email: "john.doe@example.com"
        },
        confidentialityPolicy: "Les informations contenues dans ce document sont confidentielles...",
        rooms: [
          {
            type: "Salle Serveurs",
            length: 10,
            width: 8,
            height: 3,
            equipment: [
              { name: "Racks", quantity: 10 },
              { name: "Climatiseurs", quantity: 2 }
            ]
          }
        ],
        questionnaire: {
          "Q1": { answer: "Oui", score: 5 },
          "Q2": { answer: "Non", score: 0 },
          "Q3": { answer: "Partiel", score: 3 }
        },
        recommendations: {
          "Refroidissement": [
            "Installer une unité de climatisation redondante",
            "Optimiser la disposition des racks"
          ],
          "Sécurité": [
            "Mettre à niveau le système de contrôle d'accès",
            "Installer des caméras supplémentaires"
          ]
        },
        bom: [
          { name: "Climatiseur de précision", quantity: 1, specs: "30kW" },
          { name: "Contrôleur d'accès", quantity: 2, specs: "Biométrique" }
        ],
        planning: "Planning détaillé des travaux...",
        reference: `REF-${new Date().getTime()}`
      };

      let documentType = '';
      switch (type) {
        case 'technical':
          documentType = 'offreTechnique';
          break;
        case 'specifications':
          documentType = 'cahierCharges';
          break;
        case 'survey':
          documentType = 'rapportSurvey';
          break;
        case 'audit':
          documentType = 'rapportAudit';
          break;
        case 'other':
          documentType = 'autresServices';
          break;
      }

      await handleDocumentGeneration(documentType, {
        ...mockData,
        ...location.state
      });
      
      setSnackbar({
        open: true,
        message: 'Document généré avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating document:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la génération du document',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    {
      type: 'technical',
      label: 'Générer une Offre Technique',
      icon: FileTextIcon
    },
    {
      type: 'specifications',
      label: 'Générer un Cahier des Charges',
      icon: ClipboardListIcon
    },
    {
      type: 'survey',
      label: 'Générer un Rapport de Survey',
      icon: SearchIcon
    },
    {
      type: 'audit',
      label: 'Générer un Rapport d\'Audit',
      icon: ClipboardIcon
    },
    {
      type: 'other',
      label: 'Générer un Rapport Autres Services',
      icon: SettingsIcon
    }
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Génération des Documents
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reports.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outlined"
                onClick={() => handleGenerateReport(type)}
                startIcon={<Icon />}
                disabled={loading}
                sx={{
                  py: 3,
                  justifyContent: 'flex-start',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                ) : null}
                {label}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Retour
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportsPage;
