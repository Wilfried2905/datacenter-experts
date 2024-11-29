interface QuestionnaireResponse {
  answer: string;
  score: number;
}

interface RecommendationRule {
  category: string;
  condition: (score: number) => boolean;
  recommendations: string[];
}

const recommendationRules: RecommendationRule[] = [
  {
    category: "Refroidissement",
    condition: (score) => score < 3,
    recommendations: [
      "Installer une unité de climatisation redondante",
      "Optimiser la disposition des racks pour une meilleure circulation d'air",
      "Mettre en place un système de surveillance de la température",
      "Implémenter le confinement d'allée chaude/froide"
    ]
  },
  {
    category: "Refroidissement",
    condition: (score) => score >= 3 && score < 4,
    recommendations: [
      "Optimiser les paramètres de climatisation",
      "Ajouter des sondes de température supplémentaires",
      "Planifier une maintenance préventive régulière"
    ]
  },
  {
    category: "Sécurité",
    condition: (score) => score < 3,
    recommendations: [
      "Installer un système de contrôle d'accès biométrique",
      "Mettre en place un système de vidéosurveillance 24/7",
      "Implémenter une procédure stricte de gestion des accès",
      "Ajouter des détecteurs de mouvement"
    ]
  },
  {
    category: "Sécurité",
    condition: (score) => score >= 3 && score < 4,
    recommendations: [
      "Renforcer les procédures de sécurité existantes",
      "Mettre à jour le système de contrôle d'accès",
      "Organiser des formations régulières sur la sécurité"
    ]
  },
  {
    category: "Alimentation",
    condition: (score) => score < 3,
    recommendations: [
      "Installer un système UPS redondant",
      "Mettre en place un groupe électrogène",
      "Implémenter un système de monitoring électrique",
      "Ajouter des PDUs intelligents"
    ]
  },
  {
    category: "Alimentation",
    condition: (score) => score >= 3 && score < 4,
    recommendations: [
      "Optimiser la distribution électrique",
      "Planifier des tests réguliers des systèmes de secours",
      "Mettre à jour le système de monitoring"
    ]
  },
  {
    category: "Infrastructure",
    condition: (score) => score < 3,
    recommendations: [
      "Renforcer la structure du plancher technique",
      "Améliorer l'étanchéité de la salle",
      "Installer des systèmes anti-incendie avancés",
      "Mettre en place un système de détection des fuites"
    ]
  },
  {
    category: "Infrastructure",
    condition: (score) => score >= 3 && score < 4,
    recommendations: [
      "Optimiser l'agencement de la salle",
      "Planifier une maintenance régulière des infrastructures",
      "Mettre à jour les systèmes de détection"
    ]
  }
];

export const generateRecommendations = (responses: Record<string, QuestionnaireResponse>) => {
  const recommendations: Record<string, string[]> = {};
  
  // Calculer le score moyen par catégorie
  const categoryScores: Record<string, { total: number; count: number }> = {};
  
  Object.entries(responses).forEach(([questionId, response]) => {
    const category = questionId.split('_')[0]; // Suppose que l'ID de question commence par la catégorie
    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, count: 0 };
    }
    categoryScores[category].total += response.score;
    categoryScores[category].count += 1;
  });

  // Générer les recommandations basées sur les scores moyens
  Object.entries(categoryScores).forEach(([category, { total, count }]) => {
    const averageScore = total / count;
    
    const applicableRules = recommendationRules.filter(
      rule => rule.category === category && rule.condition(averageScore)
    );

    if (applicableRules.length > 0) {
      recommendations[category] = applicableRules[0].recommendations;
    }
  });

  return recommendations;
};

export const generateBOM = (recommendations: Record<string, string[]>) => {
  const bomItems: Array<{ name: string; quantity: number; specs: string }> = [];

  // Mapping des recommandations vers les équipements nécessaires
  Object.entries(recommendations).forEach(([category, recs]) => {
    recs.forEach(rec => {
      if (rec.includes("climatisation")) {
        bomItems.push({ name: "Climatiseur de précision", quantity: 1, specs: "30kW" });
      }
      if (rec.includes("contrôle d'accès")) {
        bomItems.push({ name: "Contrôleur d'accès", quantity: 2, specs: "Biométrique" });
      }
      if (rec.includes("UPS")) {
        bomItems.push({ name: "UPS", quantity: 1, specs: "60kVA" });
      }
      if (rec.includes("PDU")) {
        bomItems.push({ name: "PDU Intelligent", quantity: 4, specs: "32A" });
      }
      // Ajoutez d'autres mappings selon les besoins
    });
  });

  return bomItems;
};
