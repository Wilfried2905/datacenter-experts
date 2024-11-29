import { TIA942Evaluator } from './evaluators/TIA942Evaluator';
import { UptimeEvaluator } from './evaluators/UptimeEvaluator';

interface EvaluationResult {
  score: number;
  tier: string;
  recommendations: Array<{
    category: string;
    priority: 'P1' | 'P2' | 'P3';
    items: string[];
    impact: string;
    estimatedCost?: string;
    timeline?: string;
  }>;
  metrics: {
    availability: number;
    pue: number;
    risks: Array<{
      component: string;
      level: string;
      mitigation: string;
    }>;
  };
}

export class StandardsEvaluator {
  private tia942: typeof TIA942Evaluator;
  private uptime: typeof UptimeEvaluator;

  constructor() {
    this.tia942 = TIA942Evaluator;
    this.uptime = UptimeEvaluator;
  }

  evaluateDatacenter(data: any): { tia942: EvaluationResult; uptime: EvaluationResult } {
    return {
      tia942: this.evaluateTIA942(data),
      uptime: this.evaluateUptime(data)
    };
  }

  private evaluateTIA942(data: any): EvaluationResult {
    // Évaluation de la disponibilité
    const availability = this.tia942.performanceMetrics.availability.measure(data);
    const pue = this.tia942.performanceMetrics.powerEfficiency.measure(data);

    // Détermination du Tier
    let tier = 'T1';
    if (availability >= this.tia942.performanceMetrics.availability.thresholds.T4) {
      tier = 'T4';
    } else if (availability >= this.tia942.performanceMetrics.availability.thresholds.T3) {
      tier = 'T3';
    } else if (availability >= this.tia942.performanceMetrics.availability.thresholds.T2) {
      tier = 'T2';
    }

    // Analyse des risques
    const risks = Object.keys(data.components || {}).map(component => ({
      component,
      level: this.tia942.riskAnalysis.calculateRiskScore(data.components[component]),
      mitigation: this.generateMitigation(component, tier)
    }));

    // Génération des recommandations
    const recommendations = this.generateTIA942Recommendations(data, tier);

    return {
      score: availability,
      tier,
      recommendations,
      metrics: {
        availability,
        pue,
        risks
      }
    };
  }

  private evaluateUptime(data: any): EvaluationResult {
    // Évaluation de l'infrastructure
    const siteInfra = this.uptime.performanceMetrics.siteInfrastructure.measure(data);
    const opsSustainability = this.uptime.performanceMetrics.operationalSustainability.measure(data);

    // Calcul du score global
    const score = (
      siteInfra.power.score +
      siteInfra.cooling.score +
      siteInfra.physical.score +
      opsSustainability.management.score +
      opsSustainability.operations.score +
      opsSustainability.building.score
    ) / 6;

    // Détermination du Tier UPTIME
    let tier = 'TIER_I';
    if (score >= this.uptime.performanceMetrics.siteInfrastructure.thresholds.TIER_IV.score) {
      tier = 'TIER_IV';
    } else if (score >= this.uptime.performanceMetrics.siteInfrastructure.thresholds.TIER_III.score) {
      tier = 'TIER_III';
    } else if (score >= this.uptime.performanceMetrics.siteInfrastructure.thresholds.TIER_II.score) {
      tier = 'TIER_II';
    }

    // Analyse des risques
    const riskAnalysis = this.uptime.riskAnalysis.evaluateRisks(data);
    const risks = Object.entries(riskAnalysis).map(([component, risk]) => ({
      component,
      level: risk.score,
      mitigation: risk.recommendations[0] || 'Surveillance continue recommandée'
    }));

    // Génération des recommandations
    const recommendations = this.generateUptimeRecommendations(data, tier);

    return {
      score,
      tier,
      recommendations,
      metrics: {
        availability: siteInfra.power.availability || 0,
        pue: siteInfra.power.pue || 2.0,
        risks
      }
    };
  }

  private generateTIA942Recommendations(data: any, currentTier: string): Array<any> {
    const recommendations = [];

    // Recommandations pour l'infrastructure électrique
    recommendations.push({
      category: "Infrastructure Électrique",
      priority: this.getPriority(data.power?.score || 0),
      items: this.getTIA942PowerRecommendations(currentTier, data),
      impact: "Impact direct sur la disponibilité du datacenter",
      estimatedCost: "Élevé",
      timeline: "6-12 mois"
    });

    // Recommandations pour le refroidissement
    recommendations.push({
      category: "Système de Refroidissement",
      priority: this.getPriority(data.cooling?.score || 0),
      items: this.getTIA942CoolingRecommendations(currentTier, data),
      impact: "Impact sur la performance et la durée de vie des équipements",
      estimatedCost: "Moyen à élevé",
      timeline: "3-6 mois"
    });

    // Recommandations pour la sécurité
    recommendations.push({
      category: "Sécurité Physique",
      priority: this.getPriority(data.security?.score || 0),
      items: this.getTIA942SecurityRecommendations(currentTier, data),
      impact: "Protection des actifs et conformité réglementaire",
      estimatedCost: "Moyen",
      timeline: "2-4 mois"
    });

    return recommendations;
  }

  private generateUptimeRecommendations(data: any, currentTier: string): Array<any> {
    const recommendations = [];

    // Recommandations pour la topologie du site
    recommendations.push({
      category: "Topologie du Site",
      priority: this.getPriority(data.topology?.score || 0),
      items: this.getUptimeTopologyRecommendations(currentTier, data),
      impact: "Fondamental pour la classification Uptime",
      estimatedCost: "Très élevé",
      timeline: "12-24 mois"
    });

    // Recommandations pour la maintenance
    recommendations.push({
      category: "Maintenance et Opérations",
      priority: this.getPriority(data.operations?.score || 0),
      items: this.getUptimeOperationsRecommendations(currentTier, data),
      impact: "Essentiel pour maintenir la certification",
      estimatedCost: "Moyen",
      timeline: "3-6 mois"
    });

    // Recommandations pour la durabilité
    recommendations.push({
      category: "Durabilité Opérationnelle",
      priority: this.getPriority(data.sustainability?.score || 0),
      items: this.getUptimeSustainabilityRecommendations(currentTier, data),
      impact: "Impact sur l'efficacité long terme",
      estimatedCost: "Variable",
      timeline: "Continu"
    });

    return recommendations;
  }

  private getPriority(score: number): 'P1' | 'P2' | 'P3' {
    if (score < 50) return 'P1';
    if (score < 80) return 'P2';
    return 'P3';
  }

  private getTIA942PowerRecommendations(currentTier: string, data: any): string[] {
    const powerScore = data.power?.score || 0;
    if (powerScore < 50) {
      return [
        "Mettre en place une redondance N+1 pour l'alimentation électrique",
        "Installer des UPS pour chaque circuit critique",
        "Améliorer la distribution électrique",
        "Mettre en place un programme de maintenance préventive"
      ];
    } else if (powerScore < 80) {
      return [
        "Optimiser la configuration des UPS",
        "Améliorer le monitoring de la consommation électrique",
        "Renforcer les procédures de maintenance"
      ];
    }
    return [
      "Maintenir les bonnes pratiques actuelles",
      "Planifier les futures améliorations de capacité"
    ];
  }

  private getTIA942CoolingRecommendations(currentTier: string, data: any): string[] {
    const coolingScore = data.cooling?.score || 0;
    if (coolingScore < 50) {
      return [
        "Installer des systèmes de refroidissement redondants",
        "Optimiser la disposition des allées froides/chaudes",
        "Mettre en place un monitoring de la température",
        "Améliorer l'efficacité énergétique du refroidissement"
      ];
    } else if (coolingScore < 80) {
      return [
        "Optimiser les paramètres de refroidissement",
        "Améliorer la circulation d'air",
        "Renforcer la maintenance préventive"
      ];
    }
    return [
      "Maintenir les paramètres optimaux actuels",
      "Surveiller les tendances de température"
    ];
  }

  private getTIA942SecurityRecommendations(currentTier: string, data: any): string[] {
    const securityScore = data.security?.score || 0;
    if (securityScore < 50) {
      return [
        "Mettre en place un contrôle d'accès multi-facteurs",
        "Installer des caméras de surveillance",
        "Établir des procédures de sécurité strictes",
        "Former le personnel aux procédures de sécurité"
      ];
    } else if (securityScore < 80) {
      return [
        "Améliorer la couverture vidéo",
        "Optimiser les procédures d'accès",
        "Renforcer la documentation de sécurité"
      ];
    }
    return [
      "Maintenir les protocoles de sécurité actuels",
      "Effectuer des audits réguliers"
    ];
  }

  private getUptimeTopologyRecommendations(currentTier: string, data: any): string[] {
    const topologyScore = data.topology?.score || 0;
    if (topologyScore < 50) {
      return [
        "Revoir l'architecture globale du site",
        "Mettre en place des chemins de distribution redondants",
        "Améliorer la séparation des systèmes critiques",
        "Créer des zones de maintenance dédiées"
      ];
    } else if (topologyScore < 80) {
      return [
        "Optimiser les chemins de distribution",
        "Améliorer la documentation de l'infrastructure",
        "Renforcer la ségrégation des systèmes"
      ];
    }
    return [
      "Maintenir la topologie actuelle",
      "Planifier les futures extensions"
    ];
  }

  private getUptimeOperationsRecommendations(currentTier: string, data: any): string[] {
    const opsScore = data.operations?.score || 0;
    if (opsScore < 50) {
      return [
        "Établir des procédures opérationnelles détaillées",
        "Mettre en place une équipe 24/7",
        "Créer un programme de formation complet",
        "Implémenter un système de gestion de maintenance"
      ];
    } else if (opsScore < 80) {
      return [
        "Optimiser les procédures existantes",
        "Améliorer la documentation opérationnelle",
        "Renforcer le programme de formation"
      ];
    }
    return [
      "Maintenir les procédures actuelles",
      "Effectuer des exercices réguliers"
    ];
  }

  private getUptimeSustainabilityRecommendations(currentTier: string, data: any): string[] {
    const sustainabilityScore = data.sustainability?.score || 0;
    if (sustainabilityScore < 50) {
      return [
        "Mettre en place un programme de gestion énergétique",
        "Optimiser le PUE",
        "Implémenter des pratiques écologiques",
        "Établir des objectifs de durabilité"
      ];
    } else if (sustainabilityScore < 80) {
      return [
        "Améliorer l'efficacité énergétique",
        "Optimiser la gestion des ressources",
        "Renforcer les pratiques durables"
      ];
    }
    return [
      "Maintenir les pratiques durables actuelles",
      "Surveiller les nouvelles technologies vertes"
    ];
  }

  private generateMitigation(component: string, tier: string): string {
    const mitigations: { [key: string]: { [key: string]: string } } = {
      power: {
        T1: "Maintenance préventive régulière",
        T2: "Redondance N+1 et maintenance améliorée",
        T3: "Redondance 2N et maintenance concurrente",
        T4: "Redondance 2N+1 et maintenance continue"
      },
      cooling: {
        T1: "Monitoring basique de la température",
        T2: "Redondance partielle et monitoring avancé",
        T3: "Redondance N+1 et contrôle automatique",
        T4: "Redondance 2N et optimisation continue"
      },
      network: {
        T1: "Configuration réseau de base",
        T2: "Redondance des liens principaux",
        T3: "Architecture réseau distribuée",
        T4: "Architecture réseau full mesh"
      }
    };

    return mitigations[component]?.[tier] || "Surveillance continue recommandée";
  }
}

export const standardsEvaluator = new StandardsEvaluator();
