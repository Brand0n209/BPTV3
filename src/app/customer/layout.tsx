import * as React from "react";
import Box from "@mui/material/Box";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* TODO: Add Customer navigation/sidebar/header here */}
      {children}
    </Box>
  );
}
