import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@mui/material';
import { Button } from '@mui/material';
import { TextareaAutosize } from '@mui/material';
import { Alert } from '@mui/material';
import { QuestionnaireData, QuestionnaireFormProps } from '../types/questionnaire';
import UploadIcon from '@mui/icons-material/Upload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Typography, Grid, IconButton, Collapse, Dialog } from '@mui/material';

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ data, onComplete }) => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [manualScore, setManualScore] = useState<number | null>(null);
  const [autoScore, setAutoScore] = useState(0);

  const scoringDescriptions = {
    0: "Non conforme",
    1: "Très insuffisant",
    2: "Insuffisant",
    3: "Moyennement conforme",
    4: "Conforme avec des améliorations possibles",
    5: "Entièrement conforme"
  };

  const handleResponse = (sectionTitle: string, questionIndex: number, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      [`${sectionTitle}-${questionIndex}`]: value
    }));
    updateAutoScore();
  };

  const handleComment = (sectionTitle: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [sectionTitle]: value
    }));
  };

  const updateAutoScore = () => {
    const weights = {
      "Systèmes de Refroidissement": 0.35,
      "Contrôle Environnemental": 0.25,
      "Maintenance Préventive": 0.20,
      "Procédures et Documentation": 0.20
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([section, weight]) => {
      const sectionQuestions = Object.keys(responses).filter(key => key.startsWith(section));
      if (sectionQuestions.length > 0) {
        const positiveResponses = sectionQuestions.filter(q => responses[q] === true).length;
        const sectionScore = (positiveResponses / sectionQuestions.length) * 5;
        totalScore += sectionScore * weight;
        totalWeight += weight;
      }
    });

    const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    setAutoScore(finalScore);
  };

  const handleSubmit = () => {
    const formData = {
      responses,
      comments,
      images,
      documents,
      autoScore,
      manualScore
    };
    
    // Calculer le score final (utiliser le score manuel s'il existe, sinon le score auto)
    const finalScore = manualScore !== null ? manualScore * 20 : autoScore * 20;

    // Naviguer vers la page de résultats avec les données
    navigate('/results/maintenance', {
      state: {
        score: finalScore,
        responses,
        comments
      }
    });

    // Appeler le callback onComplete si nécessaire
    onComplete(formData);
  };

  const ScoreSection = () => (
    <Box sx={{ bgcolor: 'grey.100', p: 4, borderRadius: 1, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Système de notation (0-5)</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Score recommandé basé sur vos réponses: {autoScore}/5
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({scoringDescriptions[autoScore as keyof typeof scoringDescriptions]})
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        {Object.entries(scoringDescriptions).map(([score, description]) => (
          <Typography key={score} variant="body2">
            {score} : {description}
          </Typography>
        ))}
      </Box>
      <Grid container spacing={1}>
        {[0, 1, 2, 3, 4, 5].map((score) => (
          <Grid item xs={2} key={score}>
            <Button
              variant={manualScore === score ? 'contained' : 'outlined'}
              onClick={() => setManualScore(score)}
              fullWidth
            >
              {score}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const PreviewContent = () => (
    <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Résumé de l'évaluation</Typography>
      
      {data.checkpoints.map((section, sIndex) => (
        <Box key={sIndex} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{section.title}</Typography>
          <Box sx={{ mb: 2 }}>
            {section.items.map((item, iIndex) => (
              <Box
                key={iIndex}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'grey.50',
                  p: 1,
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <Typography>{item.question}</Typography>
                <Typography
                  color={responses[`${section.title}-${iIndex}`] ? 'success.main' : 'error.main'}
                >
                  {responses[`${section.title}-${iIndex}`] ? "Oui" : "Non"}
                </Typography>
              </Box>
            ))}
          </Box>
          {comments[section.title] && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Commentaires:</Typography>
              <Typography color="text.secondary">{comments[section.title]}</Typography>
            </Box>
          )}
        </Box>
      ))}
      
      <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Score recommandé: {autoScore}/5</Typography>
            <Typography variant="body2" color="text.secondary">
              ({scoringDescriptions[autoScore as keyof typeof scoringDescriptions]})
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Score attribué: {manualScore}/5</Typography>
            <Typography variant="body2" color="text.secondary">
              ({scoringDescriptions[manualScore as keyof typeof scoringDescriptions]})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 2 }}>
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">{data.title}</Typography>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Éditer" : "Aperçu"}
              </Button>
            </Box>
          }
        />

        <CardContent>
          {showPreview ? (
            <PreviewContent />
          ) : (
            <>
              {data.checkpoints.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>{section.title}</Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {section.items.map((item, itemIndex) => (
                      <Box
                        key={itemIndex}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'grey.50',
                          p: 2,
                          borderRadius: 1,
                          mb: 2
                        }}
                      >
                        <Typography>{item.question}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant={responses[`${section.title}-${itemIndex}`] === true ? "contained" : "outlined"}
                            onClick={() => handleResponse(section.title, itemIndex, true)}
                          >
                            Oui
                          </Button>
                          <Button
                            variant={responses[`${section.title}-${itemIndex}`] === false ? "contained" : "outlined"}
                            onClick={() => handleResponse(section.title, itemIndex, false)}
                          >
                            Non
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}

              <ScoreSection />

              {data.checkpoints.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Commentaires - {section.title}
                  </Typography>
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Commentaires pour cette section..."
                    value={comments[section.title] || ''}
                    onChange={(e) => handleComment(section.title, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(0, 0, 0, 0.23)'
                    }}
                  />
                </Box>
              ))}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  component="label"
                >
                  Ajouter des images
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setImages(Array.from(e.target.files));
                      }
                    }}
                  />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  component="label"
                >
                  Ajouter des documents
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setDocuments(Array.from(e.target.files));
                      }
                    }}
                  />
                </Button>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!manualScore}
                >
                  Soumettre l'évaluation
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuestionnaireForm;
