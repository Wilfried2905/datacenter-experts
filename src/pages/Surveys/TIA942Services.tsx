import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Collapse,
  Dialog,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Assignment as SurveyIcon,
  Assessment as AuditIcon,
  Extension as OtherServicesIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import PrivacyPolicyForm from '../../components/PrivacyPolicyForm';
import ClientRoomsForm from '../../components/ClientRoomsForm';

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceCategory {
  title: string;
  services: Service[];
}

const TIA942Services: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const toggleCategoryExpansion = (categoryTitle: string) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowPrivacyPolicy(true);
  };

  const handlePrivacyPolicyAccept = () => {
    setShowPrivacyPolicy(false);
    setShowClientForm(true);
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const handleClientFormSubmit = (data: any) => {
    // Sauvegarder les données du formulaire si nécessaire
    console.log('Form data:', data);
    setShowClientForm(false);
    // Rediriger vers le questionnaire de maintenance
    navigate('/surveys/maintenance');
  };

  const serviceCategories: ServiceCategory[] = [
    {
      title: 'Survey',
      services: [
        {
          title: 'Surveys basés sur TIA-942',
          description: 'Analyse complète pour garantir que le design et les infrastructures respectent les normes TIA-942.',
          icon: <SurveyIcon />
        },
        {
          title: 'Survey d\'infrastructure électrique',
          description: 'Vérification des installations électriques pour répondre aux exigences de redondance et de sécurité.',
          icon: <SurveyIcon />
        },
        {
          title: 'Survey de sécurité logique et physique',
          description: 'Identification des vulnérabilités dans les accès physiques et les systèmes de sécurité logique.',
          icon: <SurveyIcon />
        },
        {
          title: 'Maintenance environnementale',
          description: 'Évaluation des besoins pour maintenir un environnement sûr et propre pour les équipements critiques.',
          icon: <SurveyIcon />
        },
        {
          title: 'Survey de câblage structuré',
          description: 'Analyse du câblage réseau pour assurer la conformité aux standards TIA-942 et optimiser les performances.',
          icon: <SurveyIcon />
        }
      ]
    },
    {
      title: 'Audits',
      services: [
        {
          title: 'Audit de conformité des infrastructures',
          description: 'Vérification approfondie pour s\'assurer que les installations respectent les critères de la norme TIA-942.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit énergétique',
          description: 'Identification des inefficacités énergétiques et proposition de solutions pour réduire les coûts opérationnels.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit de sécurité physique et logique',
          description: 'Évaluation de la sécurité des datacenters, y compris les systèmes de contrôle d\'accès et les protocoles de cybersécurité.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit de gestion des risques',
          description: 'Analyse des processus pour minimiser les interruptions et garantir une reprise rapide en cas d\'incident.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit de conformité réglementaire',
          description: 'Validation des installations selon les normes locales et internationales en vigueur.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit de gestion thermique',
          description: 'Vérification de la performance des systèmes de refroidissement pour éviter les risques de surchauffe.',
          icon: <AuditIcon />
        }
      ]
    },
    {
      title: 'Autres Services',
      services: [
        {
          title: 'Support à la documentation',
          description: 'Création de rapports détaillés pour documenter les installations, leur état et les recommandations.',
          icon: <OtherServicesIcon />
        },
        {
          title: 'Formation aux normes TIA-942',
          description: 'Sessions pédagogiques pour former les équipes aux exigences et à l\'application de la norme TIA-942.',
          icon: <OtherServicesIcon />
        },
        {
          title: 'Accompagnement à la mise en conformité',
          description: 'Assistance sur mesure pour adapter les installations aux standards de la norme TIA-942.',
          icon: <OtherServicesIcon />
        },
        {
          title: 'Planification stratégique',
          description: 'Développement de plans stratégiques pour l\'expansion, la maintenance et l\'optimisation des datacenters.',
          icon: <OtherServicesIcon />
        }
      ]
    }
  ];

  const renderServices = (services: Service[]) => (
    <Grid container spacing={2}>
      {services.map((service, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              },
            }}
            onClick={() => handleServiceSelect(service)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: theme.palette.primary.main, mr: 2 }}>
                  {service.icon}
                </Box>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                  {service.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {service.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{ color: theme.palette.primary.main }}
        >
          Retour aux standards
        </Button>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            ml: 2,
            fontWeight: 'bold'
          }}
        >
          Services TIA-942
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, p: 2 }}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Sélection des services</StepLabel>
          </Step>
          <Step>
            <StepLabel>Configuration</StepLabel>
          </Step>
          <Step>
            <StepLabel>Validation</StepLabel>
          </Step>
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        {serviceCategories.map((category) => (
          <Grid item xs={12} key={category.title}>
            <Card>
              <CardContent>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    mb: expandedCategory === category.title ? 2 : 0
                  }}
                  onClick={() => toggleCategoryExpansion(category.title)}
                >
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {category.title}
                  </Typography>
                  <IconButton
                    sx={{
                      transform: expandedCategory === category.title ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={expandedCategory === category.title}>
                  {renderServices(category.services)}
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (activeStep === 2) {
              navigate('/recommendations');
            } else {
              setActiveStep((prev) => Math.min(prev + 1, 2));
            }
          }}
        >
          {activeStep === 2 ? 'Voir les Recommandations' : 'Suivant'}
        </Button>
      </Box>

      <Dialog
        open={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        maxWidth="md"
        fullWidth
      >
        <PrivacyPolicyForm onAccept={handlePrivacyPolicyAccept} />
      </Dialog>

      <Dialog
        open={showClientForm}
        onClose={() => setShowClientForm(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ mb: 4, color: theme.palette.primary.main }}>
            Formulaire de Collecte d'Informations
          </Typography>
          <ClientRoomsForm 
            userEmail={userEmail} 
            onSubmit={handleClientFormSubmit} 
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default TIA942Services;
