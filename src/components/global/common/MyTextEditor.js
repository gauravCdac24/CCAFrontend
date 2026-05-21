import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const MyTextEditor = ({ editorText, setEditorText }) => {
  const editor = useRef(null);

  const handleEditorChange = (content) => {
    setEditorText(content);
  };

  const handleEditorMounted = (ref) => {
    editor.current = ref;
  };

useEffect(()=>{
},[editorText])

  return (
    <Box sx={{ width: { sm: '400px', md: '600px' } }}> 
      <SunEditor
        getSunEditorInstance={handleEditorMounted}
        height="20vh"
        width="100%"
        defaultValue={editorText}
        onChange={handleEditorChange}
        setContents={editorText}
        setOptions={{
          buttonList: [
            ['undo', 'redo'],
            ['align', 'list'],
            ['dir', 'dir_ltr', 'dir_rtl'],
          ],
          readOnly: false,
        }}
      />
    </Box>
  );
};

export default MyTextEditor;
