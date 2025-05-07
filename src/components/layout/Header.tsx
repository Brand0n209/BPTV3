import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          {/* TODO: Add logo, navigation, and user info here */}
          App Header
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
