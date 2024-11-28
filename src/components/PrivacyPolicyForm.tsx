import React, { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface PrivacyPolicyFormProps {
  onAccept: () => void;
}

const PrivacyPolicyForm: React.FC<PrivacyPolicyFormProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted) {
      onAccept();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '64rem', margin: '0 auto' }}>
      <Card>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ maxWidth: 'none' }}>
            <Typography variant="h4" sx={{ mb: 6, fontWeight: 'bold' }}>
              Politique de Confidentialité et Protection des Données à Caractère Personnel
            </Typography>
            
            <Box sx={{ maxHeight: '24rem', overflowY: 'auto', mb: 6, '& > *': { mb: 4 } }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>1. Introduction</Typography>
                <Typography>
                  Chez 3R TECHNOLOGIE, nous prenons très au sérieux la protection des données à caractère personnel de nos clients. Ce document décrit de manière claire et transparente la manière dont nous collectons, utilisons, protégeons et partageons vos informations personnelles. En acceptant notre politique de confidentialité, vous nous autorisez à traiter vos données conformément aux termes décrits ci-dessous. Nous nous engageons à respecter la confidentialité de vos informations et à garantir la sécurité des données que vous nous confiez, afin de vous offrir un service de qualité et conforme aux normes en vigueur.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>2. Données Collectées</Typography>
                <Typography paragraph>
                  Dans le cadre de nos surveys, nous pouvons être amenés à collecter les données suivantes :
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Informations sur l'identité : nom, prénom, fonction." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Coordonnées : adresse e-mail, numéro de téléphone." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Informations techniques sur l'environnement évalué : infrastructure, équipements techniques, état des lieux." />
                  </ListItem>
                </List>
                <Typography>
                  Ces informations sont essentielles pour nous permettre de mener à bien nos analyses et de vous fournir des recommandations pertinentes et personnalisées. Nous nous assurons que seules les données nécessaires à nos prestations sont collectées, de manière à limiter tout excès de collecte inutile.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>3. Utilisation des Données</Typography>
                <Typography paragraph>Les données collectées sont utilisées uniquement pour :</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="La réalisation des surveys et la production de rapports détaillés sur l'état de vos infrastructures." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="L'élaboration de recommandations techniques pour améliorer l'efficacité, la sécurité et la conformité des infrastructures." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="La communication avec les clients concernant les étapes des surveys, les conclusions, les recommandations et les actions à mener par la suite." />
                  </ListItem>
                </List>
                <Typography>
                  Nous nous engageons à ne jamais utiliser vos données à des fins de marketing sans votre consentement explicite. Les informations collectées servent exclusivement aux finalités pour lesquelles elles ont été recueillies et dans le strict respect de la réglementation applicable.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>4. Partage des Données</Typography>
                <Typography paragraph>
                  Vos données ne seront jamais vendues à des tiers. Toutefois, elles peuvent être partagées avec des partenaires techniques uniquement dans le cadre des services fournis, et uniquement après votre autorisation expresse. Nos partenaires sont tenus de respecter la confidentialité et la sécurité de vos informations, et nous veillons à ce qu'ils adhèrent aux mêmes standards élevés que nous.
                </Typography>
                <Typography>
                  En cas de transfert de données à des tiers, nous vous informerons en amont et vous aurez la possibilité de refuser ce partage. Nous prenons des mesures strictes pour garantir que tous les transferts de données soient effectués en conformité avec les lois sur la protection des données.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>5. Durée de Conservation</Typography>
                <Typography paragraph>
                  Vos données sont conservées pendant la durée nécessaire à la réalisation des surveys, à la production des rapports et pour se conformer aux obligations légales. Après cette période, elles seront supprimées de manière sécurisée afin de garantir qu'aucune information personnelle ne soit conservée au-delà de ce qui est nécessaire.
                </Typography>
                <Typography>
                  Nous révisons régulièrement nos politiques de conservation des données pour nous assurer que vos informations ne sont pas stockées plus longtemps que nécessaire, tout en tenant compte des exigences légales et des obligations contractuelles.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>6. Sécurité des Données</Typography>
                <Typography paragraph>
                  Nous mettons en place toutes les mesures techniques et organisationnelles nécessaires pour assurer la sécurité de vos données, notamment via le chiffrement des informations sensibles et l'utilisation de protocoles sécurisés pour la transmission des données. Nous utilisons des pares-feux, des systèmes de détection d'intrusion, et procédons à des audits de sécurité réguliers afin de protéger vos données contre les accès non autorisés, les altérations ou les pertes.
                </Typography>
                <Typography>
                  Nous sensibilisons également nos employés à la protection des données personnelles et leur fournissons les outils nécessaires pour respecter les règles de sécurité, garantissant ainsi une protection globale à tous les niveaux.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>7. Vos Droits</Typography>
                <Typography paragraph>
                  Conformément à la réglementation en vigueur, vous disposez des droits suivants concernant vos données personnelles :
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Droit d'accès" 
                      secondary="vous pouvez demander l'accès à vos informations personnelles afin de savoir exactement quelles données sont en notre possession."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Droit de rectification" 
                      secondary="vous pouvez demander la correction des informations inexactes ou incomplètes afin de garantir l'exactitude des données que nous détenons."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Droit à l'effacement" 
                      secondary="vous pouvez demander la suppression de vos données dans certaines circonstances, par exemple si elles ne sont plus nécessaires pour les finalités initiales."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Droit à la limitation du traitement" 
                      secondary="vous pouvez limiter le traitement de vos données en cas de contestation de l'exactitude des données ou si vous vous opposez à leur utilisation."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Droit à la portabilité des données" 
                      secondary="dans certaines situations, vous pouvez demander à recevoir vos données dans un format structuré, couramment utilisé et lisible par machine, pour les transmettre à un autre responsable de traitement."
                    />
                  </ListItem>
                </List>
                <Typography>
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse e-mail suivante : infos@3rtechnologie.com. Nous nous engageons à répondre à toutes vos demandes dans les meilleurs délais et à fournir l'assistance nécessaire.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>8. Acceptation de la Politique de Confidentialité</Typography>
                <Typography>
                  En acceptant cette politique de confidentialité, vous reconnaissez avoir pris connaissance des informations ci-dessus et consentez au traitement de vos données personnelles dans les conditions décrites. Vous avez la possibilité de retirer votre consentement à tout moment, mais cela pourrait limiter notre capacité à vous fournir certains services.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>9. Modifications de la Politique de Confidentialité</Typography>
                <Typography>
                  Cette politique de confidentialité peut être modifiée occasionnellement pour répondre à des mises à jour légales, pour refléter des modifications de nos procédures internes ou pour intégrer de nouvelles fonctionnalités. Toute modification vous sera notifiée par e-mail ou via une mise à jour visible sur notre site web, et vous serez invité à consulter ces changements.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>10. Contact</Typography>
                <Typography paragraph>
                  Pour toute question concernant cette politique, veuillez nous contacter à l'adresse suivante : infos@3rtechnologie.com. Nous sommes disponibles pour répondre à toutes vos interrogations et vous fournir des informations complémentaires sur la gestion de vos données personnelles.
                </Typography>
                <Typography>
                  En cas de litige concernant l'utilisation de vos données personnelles, vous avez également la possibilité de contacter l'autorité de contrôle compétente pour déposer une réclamation.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    name="privacy-accept"
                  />
                }
                label="J'ai lu et j'accepte la politique de confidentialité"
              />
            </Box>

            <Button 
              type="submit" 
              variant="contained"
              disabled={!accepted}
              fullWidth
            >
              Valider
            </Button>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default PrivacyPolicyForm;
