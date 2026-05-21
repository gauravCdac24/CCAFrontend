import { Box, useTheme } from '@mui/material';

const GradientBox = () =>{

    const theme = useTheme();

  return (
    <Box sx={{
      width: '4px',
      height: '20px',
      borderRadius: '4px',
      background: `linear-gradient(180deg, ${theme.palette.gcolor.main}, ${theme.palette.gcolor.light})`,
      marginRight: '6px',
    }}>
    </Box>
  );
}

export default GradientBox;