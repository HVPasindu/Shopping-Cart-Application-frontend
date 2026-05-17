// src/pages/customer/Notifications.jsx
import { Box, Paper, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

function Notifications() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 3,
          sm: 4,
        },
        borderRadius: "28px",
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
      }}
    >
      <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6fdf4] text-[#16a66d] font-bold text-sm mb-3">
        <NotificationsIcon fontSize="small" />
        Notifications
      </Box>

      <Typography
        fontWeight={900}
        sx={{
          fontSize: {
            xs: "28px",
            sm: "36px",
          },
          lineHeight: 1.1,
        }}
      >
        Notifications
      </Typography>

      <Typography color="text.secondary" className="mt-2">
        Your notifications will be added here later.
      </Typography>
    </Paper>
  );
}

export default Notifications;