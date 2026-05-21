import Routes from './routes';
import Loadable from './components/global/common/Loadable';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';


const App = () =>{

  const nonce = useSelector((state) => state.customNonce.nonce);
 
  const csp = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}';
  style-src 'self' 'nonce-${nonce}';
  img-src 'self' data:;
  font-src 'self' data:;
  connect-src 'self' http://localhost:7778;
  `;

  return(
    <HelmetProvider>
      
      <Box sx={{backgroundColor: 'bodycolor.main'}}>
      {/* <Helmet>
          <meta http-equiv="Content-Security-Policy" content={csp} data-rh="true"/>
        </Helmet> */}
        <Loadable>
            <Routes />
        </Loadable>
      </Box>
      </HelmetProvider>
  )

}

export default App;
