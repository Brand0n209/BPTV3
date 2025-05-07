import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Topbar() {
  return (
    <AppBar position="fixed" color="secondary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          {/* TODO: Add topbar content here */}
          App Topbar
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
