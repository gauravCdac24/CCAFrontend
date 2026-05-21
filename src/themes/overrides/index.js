import {merge} from 'lodash';

//project import

import Tooltip from './Tooltip';
import TextField from './TextField';
import MuiDataGrid from './MuiDataGrid';
import MuiInputBase from './MuiInputBase';
import MuiInputLabel from './MuiInputLabel';
import MuiDivider from './MuiDivider';
import MuiStepLabel from './MuiStepLabel';
import MuiAutocomplete from './MuiAutocomplete';
import MuiMenu from './MuiMenu';

const ComponentsOverrides = (theme) => {
    return merge(
        Tooltip(theme),
        TextField(theme),
        MuiDataGrid(theme),
        MuiInputBase(theme),
        MuiInputLabel(theme),
        MuiDivider(theme),
        MuiStepLabel(theme),
        MuiAutocomplete(theme),
        MuiMenu(theme)
    );
}

export default ComponentsOverrides;