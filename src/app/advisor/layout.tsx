import * as React from "react";
import Box from "@mui/material/Box";

export default function AdvisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* TODO: Add Advisor navigation/sidebar/header here */}
      {children}
    </Box>
  );
}
