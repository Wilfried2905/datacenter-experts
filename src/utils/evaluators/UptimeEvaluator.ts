export const UptimeEvaluator = {
  performanceMetrics: {
    siteInfrastructure: {
      measure: (data: any) => {
        const power = {
          score: calculatePowerScore(data.power),
          availability: calculatePowerAvailability(data.power),
          pue: calculatePUE(data.power)
        };

        const cooling = {
          score: calculateCoolingScore(data.cooling)
        };

        const physical = {
          score: calculatePhysicalScore(data.physical)
        };

        return { power, cooling, physical };
      },
      thresholds: {
        TIER_I: { score: 65 },
        TIER_II: { score: 75 },
        TIER_III: { score: 85 },
        TIER_IV: { score: 95 }
      }
    },
    operationalSustainability: {
      measure: (data: any) => {
        return {
          management: {
            score: calculateManagementScore(data.management)
          },
          operations: {
            score: calculateOperationsScore(data.operations)
          },
          building: {
            score: calculateBuildingScore(data.building)
          }
        };
      }
    }
  },

  riskAnalysis: {
    evaluateRisks: (data: any) => {
      const risks: { [key: string]: any } = {};

      // Évaluation des risques électriques
      risks.power = evaluatePowerRisks(data.power);

      // Évaluation des risques de refroidissement
      risks.cooling = evaluateCoolingRisks(data.cooling);

      // Évaluation des risques physiques
      risks.physical = evaluatePhysicalRisks(data.physical);

      return risks;
    }
  }
};

// Fonctions utilitaires pour les calculs
function calculatePowerScore(powerData: any): number {
  const redundancy = powerData?.redundancy || 0;
  const maintenance = powerData?.maintenance || 0;
  const monitoring = powerData?.monitoring || 0;

  return (redundancy * 0.4 + maintenance * 0.3 + monitoring * 0.3) * 100;
}

function calculatePowerAvailability(powerData: any): number {
  const baseAvailability = 99.671; // Disponibilité de base Tier I
  const redundancyFactor = (powerData?.redundancy || 0) * 0.1;
  const maintenanceFactor = (powerData?.maintenance || 0) * 0.05;

  return Math.min(baseAvailability + redundancyFactor + maintenanceFactor, 99.995);
}

function calculatePUE(powerData: any): number {
  const totalPower = powerData?.totalConsumption || 1000;
  const itPower = powerData?.itConsumption || 500;
  return totalPower / (itPower || 1);
}

function calculateCoolingScore(coolingData: any): number {
  const efficiency = coolingData?.efficiency || 0;
  const redundancy = coolingData?.redundancy || 0;
  const maintenance = coolingData?.maintenance || 0;

  return (efficiency * 0.4 + redundancy * 0.3 + maintenance * 0.3) * 100;
}

function calculatePhysicalScore(physicalData: any): number {
  const security = physicalData?.security || 0;
  const monitoring = physicalData?.monitoring || 0;
  const maintenance = physicalData?.maintenance || 0;

  return (security * 0.4 + monitoring * 0.3 + maintenance * 0.3) * 100;
}

function calculateManagementScore(managementData: any): number {
  const policies = managementData?.policies || 0;
  const procedures = managementData?.procedures || 0;
  const training = managementData?.training || 0;

  return (policies * 0.4 + procedures * 0.3 + training * 0.3) * 100;
}

function calculateOperationsScore(operationsData: any): number {
  const staffing = operationsData?.staffing || 0;
  const procedures = operationsData?.procedures || 0;
  const maintenance = operationsData?.maintenance || 0;

  return (staffing * 0.3 + procedures * 0.4 + maintenance * 0.3) * 100;
}

function calculateBuildingScore(buildingData: any): number {
  const location = buildingData?.location || 0;
  const structure = buildingData?.structure || 0;
  const protection = buildingData?.protection || 0;

  return (location * 0.3 + structure * 0.4 + protection * 0.3) * 100;
}

function evaluatePowerRisks(powerData: any) {
  const score = calculatePowerScore(powerData);
  return {
    score,
    recommendations: generatePowerRecommendations(score)
  };
}

function evaluateCoolingRisks(coolingData: any) {
  const score = calculateCoolingScore(coolingData);
  return {
    score,
    recommendations: generateCoolingRecommendations(score)
  };
}

function evaluatePhysicalRisks(physicalData: any) {
  const score = calculatePhysicalScore(physicalData);
  return {
    score,
    recommendations: generatePhysicalRecommendations(score)
  };
}

function generatePowerRecommendations(score: number): string[] {
  if (score < 70) {
    return [
      "Améliorer la redondance de l'alimentation électrique",
      "Mettre en place un programme de maintenance préventive",
      "Installer des systèmes de monitoring avancés"
    ];
  } else if (score < 85) {
    return [
      "Optimiser les procédures de maintenance",
      "Améliorer le système de monitoring"
    ];
  }
  return ["Maintenir les bonnes pratiques actuelles"];
}

function generateCoolingRecommendations(score: number): string[] {
  if (score < 70) {
    return [
      "Améliorer l'efficacité du système de refroidissement",
      "Mettre en place une redondance N+1",
      "Optimiser la circulation d'air"
    ];
  } else if (score < 85) {
    return [
      "Optimiser les paramètres de refroidissement",
      "Améliorer la maintenance préventive"
    ];
  }
  return ["Maintenir les paramètres actuels"];
}

function generatePhysicalRecommendations(score: number): string[] {
  if (score < 70) {
    return [
      "Renforcer la sécurité physique",
      "Améliorer le système de surveillance",
      "Mettre à jour les procédures d'accès"
    ];
  } else if (score < 85) {
    return [
      "Optimiser les contrôles d'accès",
      "Améliorer la documentation"
    ];
  }
  return ["Maintenir les procédures actuelles"];
}
