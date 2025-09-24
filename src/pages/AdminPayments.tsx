import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import PaymentsTable from "../components/admin/PaymentsTable";
import type { Payment } from "../components/admin/PaymentsTable";
import API from "../api/api"; 

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bill"); 
      const formattedPayments: Payment[] = res.data.map((p: any) => ({
        ...p,
        total: Number(p.total) || 0,
      }));

      setPayments(formattedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Box 
      sx={{ 
        p: 3, 
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Pagos
      </Typography>
      
      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <PaymentsTable payments={payments} />
        </Box>
      )}
    </Box>
  );
};

export default PaymentsPage;
