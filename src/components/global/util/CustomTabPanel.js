import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const CustomTabPanel = (props) => {

    const {children, value, index, ...other} = props;

    return(
        <Box component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Box>{children}</Box>
                </Box>
            )}

        </Box>
    )


}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

export default CustomTabPanel;