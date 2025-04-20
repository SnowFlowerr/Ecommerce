import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import api from '../../config/api';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/stats');
        return response.data;
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
        throw error;
      }
    },
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        {statsLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box>
            <Typography>Total Orders: {stats?.totalOrders || '0'}</Typography>
            <Typography>Active Riders: {stats?.activeRiders || '0'}</Typography>
            <Typography>Total Earnings: ${stats?.totalEarnings?.toFixed(2) || '0.00'}</Typography>
            <Typography>Growth Rate: {stats?.growthRate || '0'}%</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;