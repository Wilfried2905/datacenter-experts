import { Document, Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { completeDocumentTemplates } from './documentTemplates';

interface ClientInfo {
  companyName: string;
  representativeName: string;
  phone: string;
  email: string;
}

interface Equipment {
  name: string;
  quantity: number;
}

interface Room {
  type: string;
  length: number;
  width: number;
  height: number;
  equipment: Equipment[];
}

interface MappedData {
  informations_client?: {
    company: string;
    representative: string;
    phone: string;
    email: string;
  };
  politique_confidentialite?: string;
  salles_visitees?: {
    name: string;
    dimensions: string;
    equipment: Equipment[];
  }[];
  resultats_questionnaire?: any;
  recommandations?: any;
  bom?: any;
  planning?: any;
  [key: string]: any;
}

const formatContent = (type: string, data: any): Paragraph[] | Table[] => {
  switch(type) {
    case 'informations_client':
      return [
        new Paragraph({
          children: [
            new TextRun({ text: 'Entreprise: ', bold: true }),
            new TextRun(data.company || 'N/A')
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Représentant: ', bold: true }),
            new TextRun(data.representative || 'N/A')
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Téléphone: ', bold: true }),
            new TextRun(data.phone || 'N/A')
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Email: ', bold: true }),
            new TextRun(data.email || 'N/A')
          ]
        })
      ];
    
    case 'salles_visitees':
      if (!Array.isArray(data)) return [new Paragraph('Aucune salle visitée')];
      
      return data.map(room => [
        new Paragraph({
          text: `Salle: ${room.name}`,
          heading: HeadingLevel.HEADING_3
        }),
        new Paragraph(`Dimensions: ${room.dimensions}`),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph('Équipement')] }),
                new TableCell({ children: [new Paragraph('Quantité')] })
              ]
            }),
            ...room.equipment.map(eq => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(eq.name)] }),
                  new TableCell({ children: [new Paragraph(eq.quantity.toString())] })
                ]
              })
            )
          ]
        })
      ]).flat();

    case 'resultats_questionnaire':
      if (!data) return [new Paragraph('Aucun résultat disponible')];
      
      return [
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph('Question')] }),
                new TableCell({ children: [new Paragraph('Réponse')] }),
                new TableCell({ children: [new Paragraph('Score')] })
              ]
            }),
            ...Object.entries(data).map(([question, response]: [string, any]) => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(question)] }),
                  new TableCell({ children: [new Paragraph(response.answer || 'N/A')] }),
                  new TableCell({ children: [new Paragraph(response.score?.toString() || 'N/A')] })
                ]
              })
            )
          ]
        })
      ];

    case 'recommandations':
      if (!data) return [new Paragraph('Aucune recommandation disponible')];
      
      return Object.entries(data).map(([category, recommendations]: [string, any]) => [
        new Paragraph({
          text: category,
          heading: HeadingLevel.HEADING_3
        }),
        ...(Array.isArray(recommendations) ? recommendations : [recommendations]).map(rec =>
          new Paragraph({
            bullet: {
              level: 0
            },
            text: typeof rec === 'string' ? rec : JSON.stringify(rec)
          })
        )
      ]).flat();

    case 'bom':
      if (!data) return [new Paragraph('Aucun BOM disponible')];
      
      return [
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph('Item')] }),
                new TableCell({ children: [new Paragraph('Quantité')] }),
                new TableCell({ children: [new Paragraph('Spécifications')] })
              ]
            }),
            ...data.map((item: any) => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(item.name || 'N/A')] }),
                  new TableCell({ children: [new Paragraph(item.quantity?.toString() || 'N/A')] }),
                  new TableCell({ children: [new Paragraph(item.specs || 'N/A')] })
                ]
              })
            )
          ]
        })
      ];

    default:
      return [new Paragraph(typeof data === 'string' ? data : JSON.stringify(data, null, 2))];
  }
};

const generateSection = (section: any, data: MappedData) => {
  const content: (Paragraph | Table)[] = [];
  
  // Ajouter titre de section
  content.push(
    new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_1,
      spacing: {
        before: 400,
        after: 200
      }
    })
  );

  // Générer contenu pour chaque sous-section
  section.subsections.forEach((subsection: string) => {
    const subsectionKey = subsection.toLowerCase().replace(/\s/g, '_');
    const subsectionData = data[subsectionKey];
    
    content.push(
      new Paragraph({
        text: subsection,
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 150
        }
      })
    );

    const formattedContent = formatContent(subsectionKey, subsectionData);
    content.push(...formattedContent);
  });

  return content;
};

const handleDocumentGeneration = async (type: string, data: any) => {
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
      politique_confidentialite: data?.confidentialityPolicy,
      salles_visitees: data?.rooms?.map((room: Room) => ({
        name: room.type,
        dimensions: `${room.length}x${room.width}x${room.height}`,
        equipment: room.equipment
      })),
      resultats_questionnaire: data?.questionnaire,
      recommandations: data?.recommendations,
      bom: data?.bom,
      planning: data?.planning,
      ...data
    };

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // En-tête
          new Paragraph({
            text: template.title,
            heading: HeadingLevel.TITLE,
            spacing: {
              before: 400,
              after: 300
            }
          }),
          
          // Date et référence
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString()),
              new TextRun({ text: '\nRéf: ', bold: true }),
              new TextRun(data?.reference || `REF-${new Date().getTime()}`)
            ],
            spacing: {
              before: 200,
              after: 400
            }
          }),

          // Sections du document
          ...template.sections.flatMap(section => 
            generateSection(section, mappedData)
          )
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

export { handleDocumentGeneration };
