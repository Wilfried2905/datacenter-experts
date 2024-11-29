import { Document, Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { completeDocumentTemplates } from './documentTemplates';

interface ClientInfo {
  company: string;
  representative: string;
  phone: string;
  email: string;
}

interface Room {
  name: string;
  dimensions: string;
  equipment: Array<{
    name: string;
    quantity: number;
  }>;
}

interface MappedData {
  informations_client: ClientInfo;
  politique_confidentialite: string;
  salles_visitees: Room[];
  resultats_questionnaire: Record<string, any>;
  recommandations: Record<string, string[]>;
  bom: Array<{
    name: string;
    quantity: number;
    specs: string;
  }>;
  planning: string;
  [key: string]: any;
}

const generateClientSection = (clientInfo: ClientInfo) => {
  return [
    new Paragraph({
      text: "Informations Client",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Entreprise: ", bold: true }),
        new TextRun(clientInfo.company)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Représentant: ", bold: true }),
        new TextRun(clientInfo.representative)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Téléphone: ", bold: true }),
        new TextRun(clientInfo.phone)
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Email: ", bold: true }),
        new TextRun(clientInfo.email)
      ]
    })
  ];
};

const generateConfidentialitySection = (policy: string) => {
  return [
    new Paragraph({
      text: "Politique de Confidentialité",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    }),
    new Paragraph({
      text: policy
    })
  ];
};

const generateRoomsSection = (rooms: Room[]) => {
  const paragraphs = [
    new Paragraph({
      text: "Salles Visitées",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  ];

  rooms.forEach(room => {
    paragraphs.push(
      new Paragraph({
        text: room.name,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Dimensions: ", bold: true }),
          new TextRun(room.dimensions)
        ]
      })
    );

    // Table des équipements
    if (room.equipment.length > 0) {
      const table = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Équipement")] }),
              new TableCell({ children: [new Paragraph("Quantité")] })
            ]
          }),
          ...room.equipment.map(eq => new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(eq.name)] }),
              new TableCell({ children: [new Paragraph(eq.quantity.toString())] })
            ]
          }))
        ]
      });
      paragraphs.push(table);
    }
  });

  return paragraphs;
};

const generateRecommendationsSection = (recommendations: Record<string, string[]>) => {
  const paragraphs = [
    new Paragraph({
      text: "Recommandations",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  ];

  Object.entries(recommendations).forEach(([category, recs]) => {
    paragraphs.push(
      new Paragraph({
        text: category,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    recs.forEach(rec => {
      paragraphs.push(
        new Paragraph({
          text: `• ${rec}`,
          spacing: { before: 100 }
        })
      );
    });
  });

  return paragraphs;
};

const generateBOMSection = (bom: Array<{ name: string; quantity: number; specs: string }>) => {
  const paragraphs = [
    new Paragraph({
      text: "Liste du Matériel (BOM)",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  ];

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Équipement")] }),
          new TableCell({ children: [new Paragraph("Quantité")] }),
          new TableCell({ children: [new Paragraph("Spécifications")] })
        ]
      }),
      ...bom.map(item => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(item.name)] }),
          new TableCell({ children: [new Paragraph(item.quantity.toString())] }),
          new TableCell({ children: [new Paragraph(item.specs)] })
        ]
      }))
    ]
  });

  paragraphs.push(table);
  return paragraphs;
};

export const handleDocumentGeneration = async (type: string, data: any) => {
  try {
    const template = completeDocumentTemplates[type];
    if (!template) {
      throw new Error(`Template not found for type: ${type}`);
    }

    // Mapping des données
    const mappedData: MappedData = {
      informations_client: {
        company: data?.clientInfo?.companyName || '',
        representative: data?.clientInfo?.representativeName || '',
        phone: data?.clientInfo?.phone || '',
        email: data?.clientInfo?.email || ''
      },
      politique_confidentialite: data?.confidentialityPolicy || 'Les informations contenues dans ce document sont confidentielles...',
      salles_visitees: data?.rooms || [],
      resultats_questionnaire: data?.responses || {},
      recommandations: data?.recommendations || {},
      bom: data?.bom || [],
      planning: data?.planning || '',
      ...data
    };

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: template.title,
            heading: HeadingLevel.TITLE,
            spacing: { before: 400, after: 300 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString()),
              new TextRun({ text: '\nRéf: ', bold: true }),
              new TextRun(data?.reference || `REF-${new Date().getTime()}`)
            ],
            spacing: { before: 200, after: 400 }
          }),

          ...generateClientSection(mappedData.informations_client),
          ...generateConfidentialitySection(mappedData.politique_confidentialite),
          ...generateRoomsSection(mappedData.salles_visitees),
          ...generateRecommendationsSection(mappedData.recommandations),
          ...generateBOMSection(mappedData.bom)
        ]
      }]
    });

    // Générer le blob et télécharger
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${template.title}_${new Date().toISOString().split('T')[0]}.docx`);
  } catch (error) {
    console.error('Erreur génération document:', error);
    throw new Error('Erreur lors de la génération du document');
  }
};
