import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

interface ClientRoomsFormProps {
  userEmail: string;
  onSubmit: (data: any) => void;
}

const ClientRoomsForm: React.FC<ClientRoomsFormProps> = ({ userEmail, onSubmit }) => {
  const [clients, setClients] = useState([{
    companyName: '',
    representativeName: '',
    phone: '',
    email: ''
  }]);

  const [technicians, setTechnicians] = useState([{
    name: '',
    phone: '',
    email: userEmail
  }]);

  const [rooms, setRooms] = useState([{
    type: '',
    length: '',
    width: '',
    height: '',
    area: 0,
    volume: 0,
    equipment: [{
      designation: '',
      quantity: '',
      manufacturer: ''
    }]
  }]);

  const roomTypes = ['Salle Serveur', 'Salle Énergie', 'Salle Supervision'];
  
  const equipmentOptions = {
    'Salle Serveur': [
      { name: 'Serveurs (rack, lame, tour)', manufacturers: ['Dell', 'HP', 'IBM', 'Lenovo', 'Huawei'] },
      { name: 'Onduleurs (UPS)', manufacturers: ['APC', 'Eaton', 'Vertiv', 'Legrand'] }
    ],
    'Salle Énergie': [
      { name: 'Onduleurs (UPS)', manufacturers: ['APC by Schneider Electric', 'Eaton', 'Vertiv'] },
      { name: 'Batteries de secours', manufacturers: ['Exide', 'EnerSys', 'C&D Technologies'] }
    ],
    'Salle Supervision': [
      { name: 'Moniteurs de surveillance haute résolution', manufacturers: ['Samsung', 'LG', 'Dell'] },
      { name: 'Postes de travail avec logiciels DCIM', manufacturers: ['IBM', 'SolarWinds', 'Schneider Electric'] }
    ]
  };

  const addClient = () => {
    if (clients.length < 5) {
      setClients([...clients, { companyName: '', representativeName: '', phone: '', email: '' }]);
    }
  };

  const addTechnician = () => {
    if (technicians.length < 5) {
      setTechnicians([...technicians, { name: '', phone: '', email: userEmail }]);
    }
  };

  const addRoom = () => {
    if (rooms.length < 15) {
      setRooms([...rooms, {
        type: '',
        length: '',
        width: '',
        height: '',
        area: 0,
        volume: 0,
        equipment: [{
          designation: '',
          quantity: '',
          manufacturer: ''
        }]
      }]);
    }
  };

  const addEquipment = (roomIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].equipment.push({
      designation: '',
      quantity: '',
      manufacturer: ''
    });
    setRooms(newRooms);
  };

  const updateRoomDimensions = (index: number, field: string, value: string) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;
    
    const { length, width, height } = newRooms[index];
    if (length && width && height) {
      newRooms[index].area = parseFloat(length) * parseFloat(width);
      newRooms[index].volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    }
    
    setRooms(newRooms);
  };

  const removeClient = (indexToRemove: number) => {
    if (clients.length > 1) {
      setClients(clients.filter((_, index) => index !== indexToRemove));
    }
  };

  const removeTechnician = (indexToRemove: number) => {
    if (technicians.length > 1) {
      setTechnicians(technicians.filter((_, index) => index !== indexToRemove));
    }
  };

  const removeRoom = (indexToRemove: number) => {
    setRooms(rooms.filter((_, index) => index !== indexToRemove));
  };

  const removeEquipment = (roomIndex: number, equipmentIndex: number) => {
    const newRooms = [...rooms];
    if (newRooms[roomIndex].equipment.length > 1) {
      newRooms[roomIndex].equipment = newRooms[roomIndex].equipment.filter((_, index) => index !== equipmentIndex);
      setRooms(newRooms);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ clients, technicians, rooms });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent sx={{ p: 6 }}>
          {/* Clients Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
              Information Client
            </Typography>
            {clients.map((client, index) => (
              <Grid container key={index} spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Nom de l'entreprise"
                    value={client.companyName}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].companyName = e.target.value;
                      setClients(newClients);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Nom et prénoms du représentant"
                    value={client.representativeName}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].representativeName = e.target.value;
                      setClients(newClients);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Contact téléphonique"
                    value={client.phone}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].phone = e.target.value;
                      setClients(newClients);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Adresse email"
                    value={client.email}
                    onChange={(e) => {
                      const newClients = [...clients];
                      newClients[index].email = e.target.value;
                      setClients(newClients);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeClient(index)}
                    disabled={clients.length <= 1}
                    sx={{ mt: 1 }}
                  >
                    Supprimer le client
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="contained"
              onClick={addClient}
              disabled={clients.length >= 5}
              sx={{ mt: 2 }}
            >
              Ajouter Client
            </Button>
          </Box>

          {/* Technicians Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
              Information Technicien
            </Typography>
            {technicians.map((tech, index) => (
              <Grid container key={index} spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Nom et prénoms"
                    value={tech.name}
                    onChange={(e) => {
                      const newTechs = [...technicians];
                      newTechs[index].name = e.target.value;
                      setTechnicians(newTechs);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Contact téléphonique"
                    value={tech.phone}
                    onChange={(e) => {
                      const newTechs = [...technicians];
                      newTechs[index].phone = e.target.value;
                      setTechnicians(newTechs);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Adresse email"
                    value={tech.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeTechnician(index)}
                    disabled={technicians.length <= 1}
                    sx={{ mt: 1 }}
                  >
                    Supprimer le technicien
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="contained"
              onClick={addTechnician}
              disabled={technicians.length >= 5}
              sx={{ mt: 2 }}
            >
              Ajouter Technicien
            </Button>
          </Box>

          {/* Rooms Section */}
          <Box>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
              Salles Visitées
            </Typography>
            {rooms.map((room, roomIndex) => (
              <Box
                key={roomIndex}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  mb: 4
                }}
              >
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel>Type de salle</InputLabel>
                      <Select
                        value={room.type}
                        label="Type de salle"
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          newRooms[roomIndex].type = e.target.value;
                          setRooms(newRooms);
                        }}
                      >
                        {roomTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Longueur (m)"
                      value={room.length}
                      onChange={(e) => updateRoomDimensions(roomIndex, 'length', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Largeur (m)"
                      value={room.width}
                      onChange={(e) => updateRoomDimensions(roomIndex, 'width', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Hauteur (m)"
                      value={room.height}
                      onChange={(e) => updateRoomDimensions(roomIndex, 'height', e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Surface (m²)"
                      value={room.area}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Volume (m³)"
                      value={room.volume}
                      disabled
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeRoom(roomIndex)}
                    sx={{ ml: 2 }}
                  >
                    Supprimer la salle
                  </Button>
                </Box>

                {/* Equipment Section */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Équipements
                  </Typography>
                  {room.equipment.map((eq, eqIndex) => (
                    <Box key={eqIndex}>
                      <Grid container spacing={4} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                          <FormControl fullWidth>
                            <InputLabel>Désignation</InputLabel>
                            <Select
                              value={eq.designation}
                              label="Désignation"
                              onChange={(e) => {
                                const newRooms = [...rooms];
                                newRooms[roomIndex].equipment[eqIndex].designation = e.target.value;
                                setRooms(newRooms);
                              }}
                            >
                              {room.type && equipmentOptions[room.type].map(eq => (
                                <MenuItem key={eq.name} value={eq.name}>{eq.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Quantité"
                            value={eq.quantity}
                            onChange={(e) => {
                              const newRooms = [...rooms];
                              newRooms[roomIndex].equipment[eqIndex].quantity = e.target.value;
                              setRooms(newRooms);
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth>
                            <InputLabel>Constructeur</InputLabel>
                            <Select
                              value={eq.manufacturer}
                              label="Constructeur"
                              onChange={(e) => {
                                const newRooms = [...rooms];
                                newRooms[roomIndex].equipment[eqIndex].manufacturer = e.target.value;
                                setRooms(newRooms);
                              }}
                            >
                              {room.type && eq.designation && 
                                equipmentOptions[room.type]
                                  .find(opt => opt.name === eq.designation)
                                  ?.manufacturers.map(mfr => (
                                    <MenuItem key={mfr} value={mfr}>{mfr}</MenuItem>
                                  ))
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => removeEquipment(roomIndex, eqIndex)}
                            disabled={room.equipment.length <= 1}
                            sx={{ mt: 1 }}
                          >
                            Supprimer l'équipement
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    onClick={() => addEquipment(roomIndex)}
                    sx={{ mt: 2 }}
                  >
                    Ajouter un équipement
                  </Button>
                </Box>
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={addRoom}
              disabled={rooms.length >= 15}
              sx={{ mt: 2 }}
            >
              Ajouter une salle
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 6 }}
          >
            Enregistrer
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ClientRoomsForm;
