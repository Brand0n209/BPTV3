import * as React from "react";
import Box from "@mui/material/Box";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* TODO: Add Technician navigation/sidebar/header here */}
      {children}
    </Box>
  );
}
