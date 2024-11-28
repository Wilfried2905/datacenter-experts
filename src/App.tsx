import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import DatacenterStandards from './pages/Surveys/DatacenterStandards';
import MaintenanceQuestionnaire from './pages/Surveys/MaintenanceQuestionnaire';
import MaintenanceResults from './pages/Results/MaintenanceResults';
import RecommendationsPreview from './pages/Recommendations/RecommendationsPreview';
import DetailedRecommendations from './pages/Recommendations/DetailedRecommendations';
import UserManagement from './pages/Admin/UserManagement';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ReportsPage from './pages/Reports/ReportsPage';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <Navigate to="/dashboard" replace />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <DatacenterStandards />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys/maintenance"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <MaintenanceQuestionnaire />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/maintenance"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <MaintenanceResults />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <RecommendationsPreview />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/detailed-recommendations"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <DetailedRecommendations />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <ReportsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="Administrateur">
                <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
