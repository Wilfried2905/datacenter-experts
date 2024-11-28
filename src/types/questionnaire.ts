export interface QuestionItem {
  question: string;
}

export interface CheckpointSection {
  title: string;
  items: QuestionItem[];
}

export interface QuestionnaireData {
  id: string;
  title: string;
  reference: string;
  description: string;
  checkpoints: CheckpointSection[];
  help: string;
}

export interface QuestionnaireFormProps {
  data: QuestionnaireData;
  onComplete: (formData: any) => void;
}
