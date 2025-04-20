import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  LocalShipping,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';

const OrderList = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch available orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['availableOrders', page],
    queryFn: async () => {
      const response = await axios.get(`/api/orders/rider/orders?page=${page}`);
      return response.data;
    },
  });

  // Accept order mutation
  const acceptOrder = useMutation({
    mutationFn: async (orderId) => {
      const response = await axios.put(`/api/orders/rider/${orderId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['availableOrders']);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to accept order');
    },
  });

  // Update delivery status mutation
  const updateDeliveryStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await axios.put(`/api/orders/rider/${orderId}/delivery`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['availableOrders']);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update delivery status');
    },
  });

  const handleAcceptOrder = (orderId) => {
    acceptOrder.mutate(orderId);
  };

  const handleUpdateStatus = (orderId, status) => {
    updateDeliveryStatus.mutate({ orderId, status });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const { orders, total, pages } = ordersData || { orders: [], total: 0, pages: 0 };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        Available Orders
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id.slice(-6)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'cancelled'
                        ? 'error'
                        : 'primary'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={order.shippingAddress.address}>
                    <IconButton size="small">
                      <LocationOn />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {order.status === 'confirmed' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAcceptOrder(order._id)}
                      startIcon={<CheckCircle />}
                    >
                      Accept
                    </Button>
                  )}
                  {order.status === 'picked_up' && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleUpdateStatus(order._id, 'in_transit')}
                      startIcon={<LocalShipping />}
                    >
                      Start Delivery
                    </Button>
                  )}
                  {order.status === 'in_transit' && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleUpdateStatus(order._id, 'delivered')}
                      startIcon={<CheckCircle />}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {orders.length === 0 && (
        <Box textAlign="center" py={3}>
          <Typography color="textSecondary">
            No available orders at the moment
          </Typography>
        </Box>
      )}

      {pages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {page} of {pages}
          </Typography>
          <Button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default OrderList; 