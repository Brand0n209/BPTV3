import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container, Paper } from '@mui/material';

const stages = [
  "Add Sub",
  "All Subs",
  "Not Contacted Yet",
  "Contacted",
  "Waiting Cust Approval",
  "Confirmed & Inputted",
  "Not Interested after sub",
  "Bad Lead",
  "Contacted again, no reply",
  "Fired"
];

const SubsPage: React.FC = () => {
  const [currentStage, setCurrentStage] = React.useState(0);

  const handleTabChange = (_: unknown, newValue: number) => {
    setCurrentStage(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Subs - Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Tabs
            value={currentStage}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Sub stages"
            sx={{ mb: 3 }}
          >
            {stages.map((stage) => (
              <Tab key={stage} label={stage} />
            ))}
          </Tabs>
          <Box>
            {currentStage === 0 ? (
              <Typography variant="h5" color="primary">
                Add Sub Form (to be implemented)
              </Typography>
            ) : (
              <Typography variant="h5" color="primary">
                Subs Table for: {stages[currentStage]} (to be implemented)
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SubsPage;
