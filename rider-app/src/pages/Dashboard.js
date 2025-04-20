import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsBike,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  LocationOn,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // Fetch rider's active orders
  const { data: activeOrders, isLoading: isLoadingActive } = useQuery({
    queryKey: ['rider-orders', 'active'],
    queryFn: async () => {
      try {
        const response = await api.get('/orders/rider/orders');
        // console.log("orderorder");
        return response.data;
      } catch (error) {
        toast.error('Failed to fetch active orders', 'error');
        throw error;
      }
    },
  });

  // Fetch rider's delivery history
  // const { data: deliveryHistory, isLoading: isLoadingHistory } = useQuery({
  //   queryKey: ['rider-orders', 'history'],
  //   queryFn: async () => {
  //     try {
  //       const response = await api.get('/orders/rider/history');
  //       console.log("historyorder");
  //       return response.data;
  //     } catch (error) {
  //       toast.error('Failed to fetch delivery history', 'error');
  //       throw error;
  //     }
  //   },
  // });

  // Fetch rider's profile
  const { data: riderProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['rider-profile'],
    queryFn: async () => {
      try {
        const response = await api.get('/riders/me');
        // console.log("riderprofile");
        return response.data;
      } catch (error) {
        toast.error('Failed to fetch rider profile', 'error');
        throw error;
      }
    },
  });

  // Accept order mutation
  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await api.post(`/orders/${orderId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rider-orders', 'active']);
      toast.success('Order accepted successfully', 'success');
    },
    onError: () => {
      toast.error('Failed to accept order', 'error');
    },
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rider-orders', 'active']);
      toast.success('Order status updated successfully', 'success');
    },
    onError: () => {
      toast.error('Failed to update order status', 'error');
    },
  });

  const handleAcceptOrder = (orderId) => {
    acceptOrderMutation.mutate(orderId);
  };

  const handleUpdateStatus = (orderId, status) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  if (isLoadingActive || isLoadingProfile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'picked_up':
        return 'info';
      case 'in_transit':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Pending />;
      case 'picked_up':
        return <DirectionsBike />;
      case 'in_transit':
        return <LocalShipping />;
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Active Orders
            </Typography>
            <Typography component="p" variant="h4">
              {activeOrders?.orders?.length || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: theme.palette.success.main,
              color: theme.palette.success.contrastText,
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Deliveries
            </Typography>
            <Typography component="p" variant="h4">
              {riderProfile?.totalDeliveries || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: theme.palette.warning.main,
              color: theme.palette.warning.contrastText,
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Rating
            </Typography>
            <Typography component="p" variant="h4">
              {riderProfile?.rating || '0.0'}/5.0
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: theme.palette.info.main,
              color: theme.palette.info.contrastText,
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Earnings
            </Typography>
            <Typography component="p" variant="h4">
              ${riderProfile?.totalEarnings || '0.00'}
            </Typography>
          </Paper>
        </Grid>

        {/* Active Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Orders
            </Typography>
            <Grid container spacing={2}>
              {activeOrders?.orders?.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                          Order #{order._id.slice(-6)}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status.replace('_', ' ')}
                          color={getStatusColor(order.status)}
                        />
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {order.shippingAddress.address}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </Typography>

                      <Typography variant="body1" fontWeight="bold">
                        ${order.totalAmount}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        View Details
                      </Button>
                      {order.status === 'pending' && (
                        <Button 
                          size="small" 
                          color="success"
                          onClick={() => handleAcceptOrder(order._id)}
                          disabled={acceptOrderMutation.isLoading}
                        >
                          Accept Order
                        </Button>
                      )}
                      {order.status === 'picked_up' && (
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => handleUpdateStatus(order._id, 'in_transit')}
                          disabled={updateOrderStatusMutation.isLoading}
                        >
                          Start Delivery
                        </Button>
                      )}
                      {order.status === 'in_transit' && (
                        <Button 
                          size="small" 
                          color="success"
                          onClick={() => handleUpdateStatus(order._id, 'delivered')}
                          disabled={updateOrderStatusMutation.isLoading}
                        >
                          Mark as Delivered
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Deliveries */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Deliveries
            </Typography>
            <Grid container spacing={2}>
              {/* {deliveryHistory?.orders?.slice(0, 6).map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                          Order #{order._id.slice(-6)}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status.replace('_', ' ')}
                          color={getStatusColor(order.status)}
                        />
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {order.shippingAddress.address}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Delivered on: {new Date(order.actualDeliveryDate).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))} */}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 