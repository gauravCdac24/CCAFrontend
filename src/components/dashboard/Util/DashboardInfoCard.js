import { Box, IconButton } from "@mui/material";
import Grid from '@mui/material/Grid2';

/**
 * Shared metric card so icon + label + value keep the same alignment
 * and reflow together across all role dashboards.
 */
const DashboardInfoCard = ({
  bgColor = 'infobox.color1',
  icon: Icon,
  label,
  value,
  onClick,
}) => {
  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 'grow' }}
      sx={{
        backgroundColor: bgColor,
        borderRadius: '4px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
        p: 3,
        m: 1,
        minWidth: 0,
        flex: { md: '1 1 0' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        ...(onClick
          ? {
              '&:hover': {
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset',
              },
            }
          : {}),
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          width: '100%',
          minWidth: 0,
        }}
      >
        <IconButton aria-label={label} sx={{ flexShrink: 0, p: 0.5 }}>
          <Icon sx={{ fontSize: '40px' }} color="primary" />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            textAlign: 'center',
            flex: '1 1 auto',
          }}
        >
          <Box
            sx={{
              width: '100%',
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {label}
          </Box>
          <Box sx={{ width: '100%', fontWeight: 500 }}>{value ?? 0}</Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default DashboardInfoCard;
