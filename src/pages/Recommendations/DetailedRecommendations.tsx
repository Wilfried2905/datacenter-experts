import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Description as FileTextIcon,
  Warning as AlertIcon,
  Inventory as PackageIcon,
  Description,
} from '@mui/icons-material';

interface SectionData {
  score: number;
  priority: string;
  issues: number;
  topIssue: string;
}

interface SampleData {
  score: number;
  sections: {
    [key: string]: SectionData;
  };
}

const DetailedRecommendations = () => {
  const [selectedSection, setSelectedSection] = useState('summary');
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state;

  const sampleData: SampleData = {
    score: score || 45,
    sections: {
      cooling: {
        score: 40,
        priority: "P1",
        issues: 3,
        topIssue: "Redondance N+1 manquante"
      },
      environmental: {
        score: 55,
        priority: "P2",
        issues: 2,
        topIssue: "Couverture de surveillance insuffisante"
      },
      maintenance: {
        score: 65,
        priority: "P2",
        issues: 2,
        topIssue: "GMAO non implémentée"
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 50) return 'error.main';
    if (score <= 80) return 'warning.main';
    return 'success.main';
  };

  const ScoreDisplay = ({ score }: { score: number }) => (
    <Typography
      variant="h4"
      sx={{
        fontWeight: 'bold',
        color: getScoreColor(score)
      }}
    >
      {score}%
    </Typography>
  );

  const Summary = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Score Global</Typography>
          <ScoreDisplay score={sampleData.score} />
        </Box>
        <Box sx={{ width: '100%', mt: 2, height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${sampleData.score}%`,
              height: '100%',
              bgcolor: getScoreColor(sampleData.score)
            }}
          />
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        {Object.entries(sampleData.sections).map(([key, section]) => (
          <Paper key={key} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
              {key}
            </Typography>
            <ScoreDisplay score={section.score} />
            <Box sx={{ mt: 2 }}>
              <Typography
                component="span"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: 'grey.100',
                  borderRadius: 10,
                  fontSize: '0.875rem'
                }}
              >
                {section.priority}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {section.topIssue}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Description />}
          onClick={() => navigate('/reports')}
        >
          Rapports
        </Button>
      </Box>
    </Box>
  );

  const DetailedRecommendationsSection = () => (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 3, bgcolor: '#ffebee' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Priorité 1 - Système de Refroidissement
        </Typography>
        <Typography paragraph>
          Le datacenter manque d'une unité de secours pour la climatisation. En cas de panne, cela peut entraîner l'arrêt complet des services.
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Ce qu'il faut faire :
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <Typography component="li">Installer une nouvelle unité de climatisation</Typography>
            <Typography component="li">Raccorder au système de surveillance</Typography>
            <Typography component="li">Former les équipes à son utilisation</Typography>
          </Box>
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="primary" fontWeight="medium">
              Pourquoi c'est important :
            </Typography>
            <Typography variant="body2" color="primary.dark">
              Une panne de climatisation peut causer une surchauffe des équipements en moins d'une heure, entraînant des arrêts de service et des dommages matériels.
            </Typography>
          </Box>
        </Paper>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: '#fff3e0' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Priorité 2 - Surveillance Environnementale
        </Typography>
        <Typography paragraph>
          La couverture actuelle des capteurs ne permet pas une surveillance complète des conditions environnementales.
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Ce qu'il faut faire :
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <Typography component="li">Ajouter des capteurs de température et d'humidité</Typography>
            <Typography component="li">Configurer le système de surveillance centralisé</Typography>
            <Typography component="li">Mettre en place des alertes automatiques</Typography>
          </Box>
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="primary" fontWeight="medium">
              Pourquoi c'est important :
            </Typography>
            <Typography variant="body2" color="primary.dark">
              Une surveillance précise permet de détecter et corriger les problèmes avant qu'ils n'affectent les équipements.
            </Typography>
          </Box>
        </Paper>
      </Paper>
    </Box>
  );

  const BOMSection = () => (
    <Box sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Équipement</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Spécifications</TableCell>
            <TableCell>Priorité</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Climatisation de précision</TableCell>
            <TableCell>1</TableCell>
            <TableCell>30kW, communication SNMP</TableCell>
            <TableCell sx={{ bgcolor: '#ffebee' }}>P1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Capteurs IoT</TableCell>
            <TableCell>10</TableCell>
            <TableCell>Température/Humidité</TableCell>
            <TableCell sx={{ bgcolor: '#fff3e0' }}>P2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gateway IoT</TableCell>
            <TableCell>1</TableCell>
            <TableCell>Compatible SNMP/ModBus</TableCell>
            <TableCell sx={{ bgcolor: '#fff3e0' }}>P2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Câblage réseau</TableCell>
            <TableCell>1</TableCell>
            <TableCell>Cat6a, 100m</TableCell>
            <TableCell sx={{ bgcolor: '#fff3e0' }}>P2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );

  const NavButton = ({ icon: Icon, label, section }: { icon: any, label: string, section: string }) => (
    <Button
      variant={selectedSection === section ? 'contained' : 'outlined'}
      onClick={() => setSelectedSection(section)}
      startIcon={<Icon />}
      fullWidth
      sx={{ justifyContent: 'flex-start', mb: 1 }}
    >
      {label}
    </Button>
  );

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Synthèse et Recommandations
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ width: 240 }}>
              <NavButton 
                icon={FileTextIcon}
                label="Synthèse"
                section="summary"
              />
              <NavButton 
                icon={AlertIcon}
                label="Actions Prioritaires"
                section="actions"
              />
              <NavButton 
                icon={PackageIcon}
                label="Matériel Requis"
                section="material"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              {selectedSection === 'summary' && <Summary />}
              {selectedSection === 'actions' && <DetailedRecommendationsSection />}
              {selectedSection === 'material' && <BOMSection />}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetailedRecommendations;
