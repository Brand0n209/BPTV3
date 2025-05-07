import * as React from "react";
import Box from "@mui/material/Box";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* TODO: Add Admin navigation/sidebar/header here */}
      {children}
    </Box>
  );
}
