import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, TextRun, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface ReportData {
  clientInfo: {
    name: string;
    location: string;
    date: string;
  };
  evaluation: {
    tia942: {
      tier: string;
      score: number;
      metrics: {
        availability: number;
        pue: number;
        security: number;
      };
      recommendations: Array<{
        category: string;
        priority: string;
        impact: string;
        items: string[];
        timeline: string;
        estimatedCost: string;
      }>;
    };
    uptime: {
      tier: string;
      score: number;
      metrics: {
        availability: number;
        pue: number;
        cooling: number;
        operations: number;
      };
      recommendations: Array<{
        category: string;
        priority: string;
        impact: string;
        items: string[];
        timeline: string;
        estimatedCost: string;
      }>;
    };
  };
}

const formatScore = (score: number): string => `${score.toFixed(1)}%`;

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'p1': return 'FF0000';
    case 'p2': return 'FFA500';
    case 'p3': return '008000';
    default: return '000000';
  }
};

const createHeaderSection = (data: ReportData): Paragraph[] => [
  new Paragraph({
    text: "Rapport d'Évaluation Datacenter",
    heading: HeadingLevel.TITLE,
    spacing: { after: 400 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Client: ", bold: true }),
      new TextRun(data.clientInfo.name),
      new TextRun({ text: "\nLocalisation: ", bold: true }),
      new TextRun(data.clientInfo.location),
      new TextRun({ text: "\nDate: ", bold: true }),
      new TextRun(data.clientInfo.date)
    ],
    spacing: { after: 400 }
  })
];

const createScoreTable = (data: ReportData): Table => {
  return new Table({
    width: {
      size: 100,
      type: 'pct',
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Métrique", bold: true })],
            width: { size: 30, type: 'pct' }
          }),
          new TableCell({
            children: [new Paragraph({ text: "TIA-942", bold: true })],
            width: { size: 35, type: 'pct' }
          }),
          new TableCell({
            children: [new Paragraph({ text: "UPTIME", bold: true })],
            width: { size: 35, type: 'pct' }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Tier")] }),
          new TableCell({ children: [new Paragraph(data.evaluation.tia942.tier)] }),
          new TableCell({ children: [new Paragraph(data.evaluation.uptime.tier)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Score Global")] }),
          new TableCell({ children: [new Paragraph(formatScore(data.evaluation.tia942.score))] }),
          new TableCell({ children: [new Paragraph(formatScore(data.evaluation.uptime.score))] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Disponibilité")] }),
          new TableCell({ children: [new Paragraph(formatScore(data.evaluation.tia942.metrics.availability))] }),
          new TableCell({ children: [new Paragraph(formatScore(data.evaluation.uptime.metrics.availability))] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("PUE")] }),
          new TableCell({ children: [new Paragraph(data.evaluation.tia942.metrics.pue.toFixed(2))] }),
          new TableCell({ children: [new Paragraph(data.evaluation.uptime.metrics.pue.toFixed(2))] })
        ]
      })
    ]
  });
};

const createRecommendationsSection = (recommendations: ReportData['evaluation']['tia942']['recommendations'], standard: string): Paragraph[] => {
  const sections: Paragraph[] = [
    new Paragraph({
      text: `Recommandations ${standard}`,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  ];

  recommendations.forEach(rec => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${rec.category} (Priorité: ${rec.priority})`,
            bold: true,
            color: getPriorityColor(rec.priority)
          })
        ],
        spacing: { before: 200 }
      }),
      new Paragraph({
        text: `Impact: ${rec.impact}`,
        spacing: { before: 100 }
      })
    );

    rec.items.forEach(item => {
      sections.push(
        new Paragraph({
          text: `• ${item}`,
          spacing: { before: 100 }
        })
      );
    });

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Mise en œuvre\n", bold: true }),
          new TextRun(`Délai estimé: ${rec.timeline}\n`),
          new TextRun(`Budget estimé: ${rec.estimatedCost}`)
        ],
        spacing: { before: 100, after: 200 }
      })
    );
  });

  return sections;
};

const generateConfidentialitySection = (policy: string) => [
  new Paragraph({
    text: "Politique de Confidentialité",
    heading: HeadingLevel.HEADING_1
  }),
  new Paragraph({ text: policy })
];

const generateClientSection = (clientInfo: any) => [
  new Paragraph({
    text: "Informations Client",
    heading: HeadingLevel.HEADING_1
  }),
  new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Société")] }),
          new TableCell({ children: [new Paragraph(clientInfo.company)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Contact")] }),
          new TableCell({ children: [new Paragraph(clientInfo.name)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Email")] }),
          new TableCell({ children: [new Paragraph(clientInfo.contactEmail)] })
        ]
      })
    ]
  })
];

const generateRoomsSection = (rooms: any[]) => [
  new Paragraph({
    text: "Salles Évaluées",
    heading: HeadingLevel.HEADING_1
  }),
  new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Nom")] }),
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("Surface (m²)")] }),
          new TableCell({ children: [new Paragraph("Capacité (kW)")] })
        ]
      }),
      ...rooms.map(room => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(room.name)] }),
          new TableCell({ children: [new Paragraph(room.type)] }),
          new TableCell({ children: [new Paragraph(room.area.toString())] }),
          new TableCell({ children: [new Paragraph(room.powerCapacity.toString())] })
        ]
      }))
    ]
  })
];

const generateQuestionnaireSection = (responses: Record<string, any>) => [
  new Paragraph({
    text: "Réponses au Questionnaire",
    heading: HeadingLevel.HEADING_1
  }),
  ...Object.entries(responses).map(([question, answer]) => 
    new Paragraph({
      children: [
        new TextRun({ text: question + ": ", bold: true }),
        new TextRun(answer.toString())
      ]
    })
  )
];

const generateEvaluationSection = (results: any) => [
  new Paragraph({
    text: "Résultats de l'Évaluation",
    heading: HeadingLevel.HEADING_1
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Score Global: ", bold: true }),
      new TextRun(results.globalScore.toFixed(1) + "%")
    ]
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Niveau Atteint: ", bold: true }),
      new TextRun(results.achievedTier)
    ]
  }),
  new Paragraph({
    text: "Points Critiques",
    heading: HeadingLevel.HEADING_2
  }),
  ...results.criticalIssues.map(issue => 
    new Paragraph({
      text: "• " + issue,
      bullet: { level: 0 }
    })
  )
];

const generateRecommendationsSectionNew = (recommendations: any[]) => [
  new Paragraph({
    text: "Recommandations",
    heading: HeadingLevel.HEADING_1
  }),
  ...recommendations.map(rec => [
    new Paragraph({
      text: rec.category,
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Priorité: ", bold: true }),
        new TextRun(rec.priority)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Description: ", bold: true }),
        new TextRun(rec.description)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Impact: ", bold: true }),
        new TextRun(rec.impact)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Coût Estimé: ", bold: true }),
        new TextRun(rec.estimatedCost)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Délai: ", bold: true }),
        new TextRun(rec.timeline)
      ]
    })
  ]).flat()
];

const generateBOMSection = (bom: any[]) => {
  const totalAmount = bom.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return [
    new Paragraph({
      text: "Liste du Matériel",
      heading: HeadingLevel.HEADING_1
    }),
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Catégorie")] }),
            new TableCell({ children: [new Paragraph("Nom")] }),
            new TableCell({ children: [new Paragraph("Quantité")] }),
            new TableCell({ children: [new Paragraph("Prix unitaire")] }),
            new TableCell({ children: [new Paragraph("Prix total")] })
          ]
        }),
        ...bom.map(item => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(item.category)] }),
            new TableCell({ children: [new Paragraph(item.name)] }),
            new TableCell({ children: [new Paragraph(item.quantity.toString())] }),
            new TableCell({ children: [new Paragraph(item.unitPrice.toString())] }),
            new TableCell({ children: [new Paragraph(item.totalPrice.toString())] })
          ]
        })),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Total")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph(totalAmount.toString())] })
          ]
        })
      ]
    })
  ];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const generateReport = async (data: ReportData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...createHeaderSection(data),
        new Paragraph({
          text: "Synthèse de l'Évaluation",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        createScoreTable(data),
        ...generateConfidentialitySection("Politique de confidentialité"),
        ...generateClientSection(data.clientInfo),
        ...generateRoomsSection(data.evaluation.rooms),
        ...generateQuestionnaireSection(data.evaluation.questionnaire),
        ...generateEvaluationSection(data.evaluation),
        ...generateRecommendationsSectionNew(data.evaluation.recommendations),
        ...generateBOMSection(data.evaluation.bom)
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `rapport_evaluation_${data.clientInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`);

  // Génération de la version HTML
  return generateHTMLReport(data);
};

const generateHTMLReport = (data: ReportData): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Rapport d'Évaluation Datacenter - ${data.clientInfo.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .client-info {
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .recommendation {
            margin: 20px 0;
            padding: 20px;
            border-radius: 5px;
            background-color: #f8f9fa;
          }
          .priority-p1 { border-left: 4px solid #FF0000; }
          .priority-p2 { border-left: 4px solid #FFA500; }
          .priority-p3 { border-left: 4px solid #008000; }
          .metric-card {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rapport d'Évaluation Datacenter</h1>
          <div class="client-info">
            <p><strong>Client:</strong> ${data.clientInfo.name}</p>
            <p><strong>Localisation:</strong> ${data.clientInfo.location}</p>
            <p><strong>Date:</strong> ${data.clientInfo.date}</p>
          </div>
        </div>

        <h2>Synthèse de l'Évaluation</h2>
        <table>
          <tr>
            <th>Métrique</th>
            <th>TIA-942</th>
            <th>UPTIME</th>
          </tr>
          <tr>
            <td>Tier</td>
            <td>${data.evaluation.tia942.tier}</td>
            <td>${data.evaluation.uptime.tier}</td>
          </tr>
          <tr>
            <td>Score Global</td>
            <td>${formatScore(data.evaluation.tia942.score)}</td>
            <td>${formatScore(data.evaluation.uptime.score)}</td>
          </tr>
          <tr>
            <td>Disponibilité</td>
            <td>${formatScore(data.evaluation.tia942.metrics.availability)}</td>
            <td>${formatScore(data.evaluation.uptime.metrics.availability)}</td>
          </tr>
          <tr>
            <td>PUE</td>
            <td>${data.evaluation.tia942.metrics.pue.toFixed(2)}</td>
            <td>${data.evaluation.uptime.metrics.pue.toFixed(2)}</td>
          </tr>
        </table>

        <h2>Recommandations TIA-942</h2>
        ${data.evaluation.tia942.recommendations.map(rec => `
          <div class="recommendation priority-${rec.priority.toLowerCase()}">
            <h3>${rec.category} (Priorité: ${rec.priority})</h3>
            <p><strong>Impact:</strong> ${rec.impact}</p>
            <ul>
              ${rec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <div class="metric-card">
              <h4>Mise en œuvre</h4>
              <p><strong>Délai estimé:</strong> ${rec.timeline}</p>
              <p><strong>Budget estimé:</strong> ${rec.estimatedCost}</p>
            </div>
          </div>
        `).join('')}

        <h2>Recommandations UPTIME INSTITUTE</h2>
        ${data.evaluation.uptime.recommendations.map(rec => `
          <div class="recommendation priority-${rec.priority.toLowerCase()}">
            <h3>${rec.category} (Priorité: ${rec.priority})</h3>
            <p><strong>Impact:</strong> ${rec.impact}</p>
            <ul>
              ${rec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <div class="metric-card">
              <h4>Mise en œuvre</h4>
              <p><strong>Délai estimé:</strong> ${rec.timeline}</p>
              <p><strong>Budget estimé:</strong> ${rec.estimatedCost}</p>
            </div>
          </div>
        `).join('')}
      </body>
    </html>
  `;
};
