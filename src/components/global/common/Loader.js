import { styled, LinearProgress } from "@mui/material";

//loader style
const LoaderWrapper = styled('div')(({theme})=>({
    positon: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    width: '100%',
    '& > * + *':{
        marginTop: theme.spacing(2)
    }
}));

const Loader = () =>(
    <LoaderWrapper>
        <LinearProgress color="primary" />
    </LoaderWrapper>
);

export default Loader;
