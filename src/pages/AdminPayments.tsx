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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Pagos
      </Typography>
      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : (
        <PaymentsTable payments={payments} />
      )}
    </Box>
  );
};

export default PaymentsPage;
