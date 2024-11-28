import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface User {
  id: number;
  email: string;
  role: 'Administrateur' | 'Technicien' | 'Superviseur';
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Entrez une adresse email valide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .required('Le mot de passe est requis'),
  role: yup
    .string()
    .oneOf(['Administrateur', 'Technicien', 'Superviseur'], 'Sélectionnez un rôle valide')
    .required('Le rôle est requis'),
});

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, email: 'admin@datacenterexperts.net', role: 'Administrateur' },
    { id: 2, email: 'tech@datacenterexperts.net', role: 'Technicien' },
    { id: 3, email: 'sup@datacenterexperts.net', role: 'Superviseur' },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleCloseDialog();
    },
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      formik.setValues({
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    formik.resetForm();
  };

  const handleResetPassword = (userId: number) => {
    console.log('Réinitialisation du mot de passe pour l\'utilisateur:', userId);
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Suppression de l\'utilisateur:', userId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des Utilisateurs
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PersonAddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un Utilisateur
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Rôle</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleResetPassword(user.id)} color="secondary">
                      <RefreshIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            {!editingUser && (
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mot de passe"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
              />
            )}
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rôle</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
                label="Rôle"
              >
                <MenuItem value="Administrateur">Administrateur</MenuItem>
                <MenuItem value="Technicien">Technicien</MenuItem>
                <MenuItem value="Superviseur">Superviseur</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingUser ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
