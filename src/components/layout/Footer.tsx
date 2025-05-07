import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box component="footer" sx={{ p: 2, bgcolor: "background.paper", textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {/* TODO: Add footer content here */}
        &copy; {new Date().getFullYear()} Bright Prodigy
      </Typography>
    </Box>
  );
}
