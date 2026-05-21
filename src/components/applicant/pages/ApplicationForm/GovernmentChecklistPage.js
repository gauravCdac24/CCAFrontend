import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel, Typography, Button, Paper, Grid } from '@mui/material';

const GovernmentChecklistPage = ({ handleNext, handleBack }) => {
  const checklistItems = [
    'Upload a valid identity proof',
    'Fill in personal details accurately',
    'Upload a valid credit details',
    'Fill in ISP dtails',
    'Upload the Business Capital Proof',
    'Upload the CPS Document',

  ];

  const [checkedItems, setCheckedItems] = useState(Array(checklistItems.length).fill(false));

  const handleBacks = () => {
        handleBack();
    }
    const handleNexts = () => {
        handleNext();
    }

  const handleCheck = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const allChecked = checkedItems.every(Boolean);

  return (
    <Box sx={{ p: 4 }}>
      
        {checklistItems.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedItems[index]}
                onChange={() => handleCheck(index)}
                color="primary"
              />
            }
            label={item}
            sx={{ display: 'block', mb: 1 }}
          />
        ))}
      <Grid container justifyContent="space-between" sx={{ mt: 4 }}>
        <Button sx={{ mr: 1 }}
                    variant="contained"
                    color="primary"  onClick={handleBacks}>Back</Button>
        <Button variant="contained" disabled={!allChecked}onClick={handleNexts}>
          Next
        </Button>
      </Grid>
    </Box>
  );
};

export default GovernmentChecklistPage;
