import { QuestionnaireData } from '../types/questionnaire';

const environmentalQuestionsData: QuestionnaireData[] = [
  {
    id: 'environmental-maintenance',
    title: "Maintenance environnementale du Datacenter",
    reference: "Section TIA-942 5.3.6",
    description: "Évaluation complète des aspects de maintenance environnementale d'un datacenter, incluant les systèmes de contrôle climatique, la qualité de l'air et les procédures de maintenance.",
    checkpoints: [
      {
        title: "Systèmes de Refroidissement",
        items: [
          { question: "Les systèmes de refroidissement sont-ils redondants (N+1 minimum) ?" },
          { question: "Existe-t-il une maintenance préventive planifiée pour les équipements de refroidissement ?" },
          { question: "Les points chauds sont-ils surveillés et traités régulièrement ?" },
          { question: "Le système de refroidissement est-il supervisé 24/7 ?" },
          { question: "Les allées chaudes et froides sont-elles clairement définies et respectées ?" }
        ]
      },
      {
        title: "Contrôle Environnemental",
        items: [
          { question: "La température est-elle maintenue entre 18°C et 27°C dans les zones critiques ?" },
          { question: "L'humidité relative est-elle maintenue entre 45% et 55% ?" },
          { question: "Existe-t-il des capteurs environnementaux redondants ?" },
          { question: "Les alertes environnementales sont-elles configurées et testées ?" },
          { question: "La distribution d'air est-elle optimisée pour éviter les zones mortes ?" }
        ]
      },
      {
        title: "Maintenance Préventive",
        items: [
          { question: "Existe-t-il un calendrier de maintenance préventive documenté ?" },
          { question: "Les filtres à air sont-ils remplacés selon un planning établi ?" },
          { question: "Les chemins de câbles sont-ils inspectés et nettoyés régulièrement ?" },
          { question: "Les systèmes de détection/extinction incendie sont-ils testés périodiquement ?" },
          { question: "Les équipements de secours sont-ils testés mensuellement ?" }
        ]
      },
      {
        title: "Procédures et Documentation",
        items: [
          { question: "Les procédures de maintenance sont-elles documentées et à jour ?" },
          { question: "Existe-t-il un registre des interventions de maintenance ?" },
          { question: "Les incidents environnementaux sont-ils analysés et documentés ?" },
          { question: "Les KPIs environnementaux sont-ils suivis et reportés ?" },
          { question: "Les recommandations des fabricants sont-elles strictement suivies ?" }
        ]
      }
    ],
    help: "Pour une évaluation précise, consultez les logs de maintenance, les relevés environnementaux et la documentation technique. Vérifiez la conformité avec les normes et les meilleures pratiques du secteur."
  }
];

export default environmentalQuestionsData;
