import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  DirectionsBike,
  TwoWheeler as MotorcycleIcon,
  DirectionsCar,
  CheckCircle,
  Cancel,
  LocationOn,
  Star,
  LocalShipping,
  Person,
  Phone,
  Email,
} from '@mui/icons-material';
import api from '../config/api';

const RiderProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  // Fetch rider profile
  const { data: rider, isLoading } = useQuery({
    queryKey: ['riderProfile'],
    queryFn: async () => {
      const response = await api.get('/riders/me');
      // console.log(response.data);
      return response.data;
    },
  });

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ status, isAvailable }) => {
      const response = await api.put('/riders/status', { status, isAvailable });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['riderProfile']);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update status');
    },
  });

  // Update location mutation
  const updateLocation = useMutation({
    mutationFn: async (location) => {
      const response = await api.put(`/riders/location`, location);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['riderProfile']);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update location');
    },
  });

  const handleStatusChange = (newStatus,newisAvailable) => {
    updateStatus.mutate({ status: newStatus,isAvailable:newisAvailable });
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation.mutate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError('Failed to get location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!rider) {
    return (
      <Alert severity="error">
        No rider profile found. Please complete your rider registration.
      </Alert>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
          opacity: 0.1,
        },
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={rider?.user?.name || 'Not provided'}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'text.primary',
                      sx: { fontWeight: 'medium' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={rider?.user?.phone || 'Not provided'}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'text.primary',
                      sx: { fontWeight: 'medium' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={rider?.user?.email || 'Not provided'}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'text.primary',
                      sx: { fontWeight: 'medium' }
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle Information Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsBike color="primary" />
                Vehicle Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={
                    rider.vehicleType === 'bicycle' ? (
                      <DirectionsBike />
                    ) : rider.vehicleType === 'motorcycle' ? (
                      <MotorcycleIcon />
                    ) : (
                      <DirectionsCar />
                    )
                  }
                  label={rider.vehicleType.charAt(0).toUpperCase() + rider.vehicleType.slice(1)}
                  color="primary"
                  sx={{ mr: 1 }}
                />
                {rider.vehicleNumber && (
                  <Chip
                    label={`Vehicle: ${rider.vehicleNumber}`}
                    sx={{ mr: 1 }}
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  icon={rider.isAvailable ? <CheckCircle /> : <Cancel />}
                  label={rider.isAvailable ? 'Available' : 'Unavailable'}
                  color={rider.isAvailable ? 'success' : 'error'}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
                  color={
                    rider.status === 'active'
                      ? 'success'
                      : rider.status === 'suspended'
                      ? 'error'
                      : 'warning'
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color={rider.status=="active" ? 'error' : 'success'}
                  onClick={() => handleStatusChange(rider.status=="active"?"inactive":"active", rider.isAvailable)}
                  fullWidth={isMobile}
                >
                  {rider.status=="active" ? 'Go Offline' : 'Go Online'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLocationUpdate}
                  startIcon={<LocationOn />}
                  fullWidth={isMobile}
                >
                  Update Location
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star color="primary" />
                Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {rider.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {rider.totalDeliveries}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Deliveries
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RiderProfile; 