export type Standard = 'TIA-942' | 'UPTIME';

export interface ClientInfo {
  name: string;
  company: string;
  location: string;
  contactEmail: string;
  projectName: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  area: number;
  powerCapacity: number;
}

export interface Infrastructure {
  power: {
    redundancy: string;
    totalConsumption: number;
    itConsumption: number;
    maintenance: number;
    monitoring: number;
  };
  cooling: {
    efficiency: number;
    redundancy: string;
    maintenance: number;
  };
  physical: {
    security: number;
    monitoring: number;
    maintenance: number;
  };
}

export interface EvaluationData {
  standard: Standard;
  clientInfo: ClientInfo;
  rooms: Room[];
  infrastructure: Infrastructure;
  responses: Record<string, any>;
}

export interface Recommendation {
  id: string;
  category: string;
  priority: 'P1' | 'P2' | 'P3';
  description: string;
  impact: string;
  estimatedCost: string;
  timeline: string;
}

export interface BOMItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier?: string;
  leadTime?: string;
}

export interface EvaluationResults {
  standard: Standard;
  globalScore: number;
  achievedTier: string;
  criticalIssues: string[];
  recommendations: Recommendation[];
  bom: BOMItem[];
  confidentialityPolicy: string;
  clientInfo: ClientInfo;
  rooms: Room[];
  responses: Record<string, any>;
}
