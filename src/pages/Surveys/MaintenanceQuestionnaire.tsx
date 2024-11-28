import React from 'react';
import QuestionnaireForm from '../../components/QuestionnaireForm';
import { maintenanceQuestionnaire } from '../../data/maintenanceQuestionnaire';
import { Box, Typography, Container } from '@mui/material';

const MaintenanceQuestionnaire: React.FC = () => {
  const handleQuestionnaireComplete = (formData: any) => {
    // TODO: Implement submission logic
    console.log('Questionnaire submitted:', formData);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {maintenanceQuestionnaire.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {maintenanceQuestionnaire.description}
        </Typography>
        <QuestionnaireForm
          data={maintenanceQuestionnaire}
          onComplete={handleQuestionnaireComplete}
        />
      </Box>
    </Container>
  );
};

export default MaintenanceQuestionnaire;
