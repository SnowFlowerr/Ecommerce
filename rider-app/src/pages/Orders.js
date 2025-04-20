import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
} from '@mui/material';
import {
  LocationOn,
  Person,
  Phone,
  ShoppingBag,
  CheckCircle,
  Cancel,
  Directions,
} from '@mui/icons-material';

const Orders = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  // Fetch rider's orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['riderOrders'],
    queryFn: async () => {
      const response = await axios.get('/api/orders/rider');
      return response.data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await axios.put(`/api/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['riderOrders']);
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'picked_up':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="24vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error loading orders: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Delivery Orders
      </Typography>
      
      {orders?.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders assigned
          </Typography>
        </Paper>
      ) : (
        <List>
          {orders?.map((order) => (
            <React.Fragment key={order._id}>
              <Paper sx={{ mb: 2, p: 2 }}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <ShoppingBag />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                          Order #{order.orderNumber}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Box mt={1}>
                          <Typography variant="body2" color="text.primary">
                            <Person fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {order.shippingAddress.name}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            <Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {order.shippingAddress.phone}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                          </Typography>
                        </Box>
                        <Box mt={2}>
                          <Typography variant="body2" color="text.secondary">
                            Items: {order.orderItems.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total: ${order.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<Directions />}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${order.shippingAddress.latitude},${order.shippingAddress.longitude}`}
                    target="_blank"
                  >
                    Get Directions
                  </Button>
                  <Box>
                    {order.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleStatusUpdate(order._id, 'accepted')}
                          sx={{ mr: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStatusUpdate(order._id, 'picked_up')}
                      >
                        Mark as Picked Up
                      </Button>
                    )}
                    {order.status === 'picked_up' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Orders; 