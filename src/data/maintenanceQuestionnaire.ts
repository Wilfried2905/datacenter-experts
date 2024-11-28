import { QuestionnaireData } from '../types/questionnaire';

export const maintenanceQuestionnaire: QuestionnaireData = {
  id: 'maintenance-questionnaire',
  title: 'Questionnaire de Maintenance Environnementale',
  reference: 'TIA-942 Section 5.3.6',
  description: 'Évaluation complète des systèmes de maintenance environnementale du datacenter',
  help: 'Ce questionnaire évalue la conformité aux standards de maintenance environnementale selon TIA-942',
  checkpoints: [
    {
      title: 'Systèmes de Refroidissement',
      items: [
        {
          question: 'Les systèmes de refroidissement sont-ils régulièrement inspectés et entretenus ?'
        },
        {
          question: 'Existe-t-il un programme de maintenance préventive pour les unités CRAC/CRAH ?'
        },
        {
          question: 'Les filtres sont-ils remplacés selon un calendrier établi ?'
        },
        {
          question: 'Les condenseurs sont-ils nettoyés régulièrement ?'
        },
        {
          question: 'Y a-t-il un système de surveillance de la température en temps réel ?'
        }
      ]
    },
    {
      title: 'Contrôle Environnemental',
      items: [
        {
          question: 'La température est-elle maintenue dans les plages recommandées ?'
        },
        {
          question: 'L\'humidité relative est-elle contrôlée et surveillée ?'
        },
        {
          question: 'Existe-t-il des capteurs environnementaux redondants ?'
        },
        {
          question: 'Les points chauds sont-ils identifiés et gérés ?'
        },
        {
          question: 'La circulation d\'air est-elle optimisée (allées chaudes/froides) ?'
        }
      ]
    },
    {
      title: 'Maintenance Préventive',
      items: [
        {
          question: 'Existe-t-il un calendrier de maintenance documenté ?'
        },
        {
          question: 'Les équipements critiques sont-ils inspectés mensuellement ?'
        },
        {
          question: 'Les procédures d\'urgence sont-elles testées régulièrement ?'
        },
        {
          question: 'Le personnel est-il formé aux procédures de maintenance ?'
        },
        {
          question: 'Les pièces de rechange sont-elles disponibles sur site ?'
        }
      ]
    },
    {
      title: 'Procédures et Documentation',
      items: [
        {
          question: 'Les procédures de maintenance sont-elles documentées ?'
        },
        {
          question: 'Les interventions sont-elles enregistrées dans un journal ?'
        },
        {
          question: 'Existe-t-il des procédures d\'escalade en cas de problème ?'
        },
        {
          question: 'Les rapports d\'incidents sont-ils analysés régulièrement ?'
        },
        {
          question: 'Les modifications des systèmes sont-elles documentées ?'
        }
      ]
    }
  ]
};
