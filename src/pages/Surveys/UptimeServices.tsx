import React, { useState } from 'react';
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

const UptimeServices: React.FC = () => {
  const theme = useTheme();
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
    console.log('Form data:', data);
    // TODO: Implement form submission logic
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const serviceCategories: ServiceCategory[] = [
    {
      title: 'Survey',
      services: [
        {
          title: 'Évaluation de classification Tier (I-IV)',
          description: 'Analyse des infrastructures pour déterminer leur niveau de redondance et de disponibilité selon les standards Tier.',
          icon: <SurveyIcon />
        },
        {
          title: 'Survey de redondance des infrastructures critiques',
          description: 'Vérification de la capacité des systèmes à maintenir des opérations continues en cas de défaillance.',
          icon: <SurveyIcon />
        },
        {
          title: 'Survey de performance en termes de capacité et d\'efficacité',
          description: 'Analyse de l\'utilisation des ressources pour optimiser la performance des infrastructures critiques.',
          icon: <SurveyIcon />
        }
      ]
    },
    {
      title: 'Audits',
      services: [
        {
          title: 'Audit de conformité Tier',
          description: 'Évaluation des installations et opérations pour leur conformité aux standards de classification Tier.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit post-incident pour analyse des défaillances',
          description: 'Étude approfondie des incidents pour identifier les causes et éviter leur répétition.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit de résilience opérationnelle',
          description: 'Évaluation des capacités de l\'organisation à assurer la continuité des opérations dans des conditions difficiles.',
          icon: <AuditIcon />
        },
        {
          title: 'Audit de performance Tier',
          description: 'Audit spécifique pour valider les performances des installations selon les attentes des niveaux Tier certifiés.',
          icon: <AuditIcon />
        }
      ]
    },
    {
      title: 'Autres Services',
      services: [
        {
          title: 'Formation aux certifications Tier (ATD, ATS)',
          description: 'Formation spécialisée pour préparer les équipes à comprendre et mettre en œuvre les principes des certifications Tier.',
          icon: <OtherServicesIcon />
        },
        {
          title: 'Consulting pour améliorer ou maintenir un niveau Tier',
          description: 'Accompagnement pour concevoir ou améliorer les infrastructures afin de répondre à des niveaux Tier spécifiques.',
          icon: <OtherServicesIcon />
        },
        {
          title: 'Gestion de projets liés à l\'obtention de certifications',
          description: 'Assistance pour planifier, documenter et exécuter les étapes nécessaires pour obtenir des certifications Tier.',
          icon: <OtherServicesIcon />
        },
        {
          title: 'Maintenance proactive des infrastructures Tier',
          description: 'Mise en place de plans de maintenance spécifiques pour prévenir les interruptions et maximiser la disponibilité.',
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
          Services Uptime Institute
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
          onClick={() => setActiveStep((prev) => Math.min(prev + 1, 2))}
        >
          {activeStep === 2 ? 'Terminer' : 'Suivant'}
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

export default UptimeServices;
