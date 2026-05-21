import React, { useState, useEffect } from 'react';
import { Grid, TextField, Typography, InputLabel, Box, Button, Tooltip, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormHelperText, Link } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CPSDocService from '../../../../service/AdminService/CPSDocService';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';

const VisuallyHiddenInput = styled('input')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0',
});

const errorMessages = {
  
    file: 'please select the file.',
};

const CPSDocumentDetails = ({handleNext,handleBack}) => {
    const [abc] = useState( ["Balance Sheet","MCA Incorporation Certificate", "MoA", "AoA", "Registered Trademark/Logo Certificate","Company Profile","Undertaking document for Role 19","Undertaking document for Payment of Auditor","undertaking document for Bank Guarantee(BG)","Oraganization Chart","Role Matrix","Expense Details"]);
    const allowedFileTypes = ['application/pdf'];
    const [fileNames, setFileNames] = useState(Array(abc.length).fill(''));
    const [fileErrors, setFileErrors] = useState(Array(abc.length).fill(''));
    const userName = useSelector((state)=>state.jwtAuthentication.username);
    const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);

    const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({
        additionalsFile: [{ file: null, fileName: '',DocumentName:'',appDocId:'', }],
        file:null,
        additionalFile: [
            {
                documentTitleName: '', // To store the document title for each file
                fileName: '', // To store the name of the uploaded file
                file: null, // To store the actual file object
                appDocId:'',
            }
        ],
       
        appDocId:'',
        intentId:'',
        userName:userName, 
    });

    useEffect(() => {
     
        setBasicDetailsFormValues((prevState) => ({
          ...prevState,
          userName: userName || '', 
        }));
      }, [userName]); 
  
  
     const [formErrors, setFormErrorss] = useState({});
     const [fileError, setFileError] = useState(Array(basicDetailsFormValues.additionalFile.length).fill(''));
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const MAX_FILES = 10;
    const ALLOWED_FILE_TYPES = ['application/pdf'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

   
    const[applicationReviewData,setApplicatioReviewData]=useState([])
    useEffect(() => {
      setLoading(true);
      ApplicationReview.getAllApplicationReviewByUserName(userName)
          .then((data) => {
              console.log("data.dtaa===>",data.data)
              setApplicatioReviewData(data.data);
              setLoading(false);
          })
          .catch(error => {
              console.error("Error fetching application types:", error);
              setLoading(false);
          });
  }, [userName]);

console.log("applicationReviewData===>",applicationReviewData)

const isFieldEnabled = (fieldName) => {
    // Log the applicationReviewData to confirm structure
    console.log("applicationReviewData:", fieldName);
  
    // Enable by default if data is undefined or empty
    if (!applicationReviewData || applicationReviewData.length === 0) {
      console.log(`Enabling ${fieldName} by default (data undefined or empty).`);
      return true;
    }
  
    // Find matching field by name
    const field = applicationReviewData.find((f) => f.fieldName === fieldName);
  
    // Log the field status
    console.log(`Field found for ${fieldName}:`, field);
  
    // Enable if field is "Active", otherwise disable
    const isEnabled = field ?  field.status === "Active"  : false;
    console.log(`isFieldEnabled(${fieldName}) returns:`, isEnabled);
  
    return isEnabled;
  };
  


    const validateForm = (basicDetailsFormValues) => {
        const errors = {};
    
        if (!basicDetailsFormValues.file) errors.file = errorMessages.file;
    
        return errors;
    };
    const handleDocumentTitleChange = (index, event) => {
        const { value } = event.target;
    
        setBasicDetailsFormValues(prevState => {
            const updatedAdditionalFiles = [...prevState.additionalFile];
            updatedAdditionalFiles[index] = {
                ...updatedAdditionalFiles[index],
                documentTitleName: value // Store the document title
            };
    
            return {
                ...prevState,
                additionalFile: updatedAdditionalFiles
            };
        });
    };

    const handlefilesChange7 = (index, event) => {
        const file = event.target.files[0]; // Get the selected file
        let errorMessage = '';
    
        if (file) {
            // Validate file type
            if (!allowedFileTypes.includes(file.type)) {
                errorMessage = 'Only allowed file types are supported';
            }
    
            // Validate file size
            if (file.size > 5 * 1024 * 1024) { // 5MB
                errorMessage = 'File size must be less than 5MB';
            }
    
            // If no errors, update the file in the state
            if (!errorMessage) {
                setBasicDetailsFormValues(prevState => {
                    const updatedAdditionalFiles = [...prevState.additionalFile];
                    updatedAdditionalFiles[index] = {
                        ...updatedAdditionalFiles[index],
                        fileName: file.name, // Store the file name
                        file: file // Store the actual file object
                    };
    
                    return {
                        ...prevState,
                        additionalFile: updatedAdditionalFiles
                    };
                });
    
                // Clear any existing error for this index
                setFileError(prevErrors => {
                    const newErrors = [...prevErrors];
                    newErrors[index] = '';
                    return newErrors;
                });
            } else {
                // Set error message
                setFileError(prevErrors => {
                    const newErrors = [...prevErrors];
                    newErrors[index] = errorMessage;
                    return newErrors;
                });
            }
        } else {
            // Handle case where no file is selected
            setFileError(prevErrors => {
                const newErrors = [...prevErrors];
                newErrors[index] = 'Please select a file';
                return newErrors;
            });
        }
    };

    const handleAddssField = () => {
        if (basicDetailsFormValues.additionalFile.length < MAX_FILES) {
            setBasicDetailsFormValues(prev => ({
                ...prev,
                additionalFile: [...prev.additionalFile, { file: null, fileName: '' }]
            }));
            setFileError(prev => [...prev, '']); // Add an empty error message for the new file
            setFileInputKey(prev => prev + 1); // Force re-render of file inputs
        }
    };
    
    const handleRemovessField = (index) => {
        setBasicDetailsFormValues(prev => {
            const files = [...prev.additionalFile];
            files.splice(index, 1);
            return { ...prev, additionalFile: files };
        });
        setFileError(prev => {
            const errors = [...prev];
            errors.splice(index, 1);
            return errors;
        });
    };

    const [allCPSDocList, setAllCPSDocList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const getAllCPSDoc = () => {

        setLoading(true);

        CPSDocService.getAllCpsDocList()
            .then((response) => {
                console.log(response)
                const list = response.data.map((obj, index) => {

                    return obj;
                });
                setAllCPSDocList(list);


            })
            .catch((err) => {

            })
            .finally(() => {
                setLoading(false)
            })

    }
    console.log(allCPSDocList)

    useEffect(() => {

        getAllCPSDoc();

    }, [])
 

    const handleDownload = async (id, file_name) => {
        try {
            // Fetch the file from the server
            const response = await CPSDocService.downloadFile(id);

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // Extract the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];

            console.log(JSON.stringify(contentDisposition))

            const filename = file_name;

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
   
 const handleDownloadClick = async (id, file_name) => {
            try {
                // Fetch the file from the server
                const response = await ApplicationForm.downloadSixStepFile(id);
    
                // Create a blob from the response data
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
    
                // Create a link element
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
    
                // Extract the filename from the Content-Disposition header
                const contentDisposition = response.headers['content-disposition'];
    
                console.log(JSON.stringify(contentDisposition))
    
                const filename = file_name;
    
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        };
 
    const [fileName, setFileName] = useState('');

    const [fileNam, setFileNam] = useState('');
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        let errorMessage = '';
    
        if (file) {
            // Check file type
            if (!allowedFileTypes.includes(file.type)) {
                errorMessage = 'Only PDF files are allowed';
            }
    
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                errorMessage = 'File size must be less than 5MB';
            }
    
           
             // Set form errors
             setFormErrorss({
            ...formErrors,
            file: errorMessage
        });

    
            // If no errors, update the form values and file name
            if (!errorMessage) {
                setBasicDetailsFormValues({
                    ...basicDetailsFormValues,
                    file: file
                });
                setFileName(file.name);
            }
        }
    };
    

   

   
    // Allowed file types
   
    // Handle file changes with validation
    const handleFileChange6 = (index) => (event) => {
        const file = event.target.files[0]; // Get the selected file
        let errorMessage = '';
    
        // If a file is selected
        if (file) {
            // Check file type
            if (!allowedFileTypes.includes(file.type)) {
                errorMessage = 'Only PDF files are allowed';
            }
    
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                errorMessage = 'File size must be less than 5MB';
            }
    
            // Update file errors based on validation
            setFileErrors(prevErrors => {
                const newErrors = [...prevErrors];
                newErrors[index] = errorMessage;
                return newErrors;
            });
    
            // If no error, update the file name to the corresponding abc item name
            if (!errorMessage) {
                setBasicDetailsFormValues(prev => {
                    const updatedAdditionalFile = [...prev.additionalsFile];
                    updatedAdditionalFile[index] = { file: file,fileName:file.name, DocumentName: abc[index] }; // Store abc item as fileName
    
                    return {
                        ...prev,
                        additionalsFile: updatedAdditionalFile,
                       // filesname: updatedAdditionalFile.map(fileData => fileData.fileName), // Update file names
                    };
                });
    
                // Update fileNames with abc item
                setFileNames(prevNames => {
                    const updatedFileNames = [...prevNames];
                    updatedFileNames[index] = file.name; // Set abc item name at the correct index
                    return updatedFileNames;
                });
            }
        } else {
            // If no file selected, show an error
            setFileErrors(prevErrors => {
                const newErrors = [...prevErrors];
                newErrors[index] = 'Please select a file';
                return newErrors;
            });
        }
    };
    

    const [showUploadField, setShowUploadField] = useState('');
    
    const handleRadioChange = (event) => {
        setShowUploadField(event.target.value);
        setRadioError(''); 
    };
    const [radioError, setRadioError] = useState('');
    const handleBacks = () => {
        handleBack();
     }

     const logFormData = (formData) => {
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    };

   

   
    useEffect(() => {
        if (userName) {
            setLoading(true);
            ApplicationForm.getApplicationForm6ByUsername(userName)
                .then((response) => {
                    console.log(response.data);
                    const documents = response.data.documents;
    
                    // Find the CPSDocument
                    const cpsDocument = documents.find(doc => doc.documentTitle === "CPSDocument");
    
                    // Filter and map documents with titles 'abc', 'ac1', 'item1', 'item2'
                    const specificDocs = documents.filter(doc => 
                        ["Balance Sheet","MCA Incorporation Certificate", "MoA", "AoA", "Registered Trademark/Logo Certificate","Company Profile","Undertaking document for Role 19","Undertaking document for Payment of Auditor","undertaking document for Bank Guarantee(BG)","Oraganization Chart","Role Matrix","Expense Details"].includes(doc.documentTitle)
                    ).map(doc => ({
                        appDocId:doc.appDocId,
                        DocumentName: doc.documentTitle,
                        fileName: doc.fileName,
                        file: null
                    }));
    
                    // Filter and map remaining documents (those not CPSDocument or specificDocs)
                    const otherDocuments = documents.filter(doc => 
                        doc.documentTitle !== "CPSDocument" &&
                        !["Balance Sheet","MCA Incorporation Certificate", "MoA", "AoA", "Registered Trademark/Logo Certificate","Company Profile","Undertaking document for Role 19","Undertaking document for Payment of Auditor","undertaking document for Bank Guarantee(BG)","Oraganization Chart","Role Matrix","Expense Details"].includes(doc.documentTitle)
                    ).map(doc => ({
                        appDocId:doc.appDocId,
                        documentTitleName: doc.documentTitle,
                        fileName: doc.fileName,
                        file: null
                    }));
    
                    // Update the state accordingly
                    setBasicDetailsFormValues((prevValues) => ({
                        ...prevValues,
                        file: cpsDocument ? cpsDocument.fileName : prevValues.file, // Set CPSDocument fileName in 'file'
                        appDocId:cpsDocument?.appDocId,
                        intentId:cpsDocument?.intentAppId,
                        additionalsFile: specificDocs.length > 0 ? specificDocs : prevValues.additionalsFile, // Set abc, ac1, item1, item2
                        additionalFile: otherDocuments.length > 0 ? otherDocuments : prevValues.additionalFile, // Set remaining documents
                        userName: userName 
                    }));
    
                    // Set the file name for CPSDocument only
                    if (cpsDocument) {
                        setFileName(cpsDocument.fileName);
                    }

                    if (otherDocuments.length > 0) {
                        setShowUploadField('yes');
                    } else {
                        setShowUploadField('no'); // Optionally hide the field if no documents
                    }
    
                    // Set file names for specificDocs (abc, ac1, item1, item2)
                    setFileNames(prevNames => {
                        const updatedFileNames = [...prevNames];
                        specificDocs.forEach((doc, index) => {
                            updatedFileNames[index] = doc.fileName; // Use specificDocs file names
                        });
                        return updatedFileNames;
                    });
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userName]);
    
    

    console.log("basicDetailsFormValues"+JSON.stringify(basicDetailsFormValues))
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(basicDetailsFormValues);
        setFormErrorss(validationErrors);
    
        let isValid = true;
        const newErrors = [...fileErrors]; // Initialize with current fileErrors
       // const newError = [...fileError]; // Initialize with current fileError
    
        // Check if files in `abc` are selected and valid
        abc.forEach((item, index) => {
            if (!fileNames[index]) {
                newErrors[index] = 'Please select a file';
                isValid = false;
            } else if (fileErrors[index]) { // Check existing fileErrors
                isValid = false;
            } else {
                newErrors[index] = ''; // Clear any previous errors
            }
        });
        setFileErrors(newErrors);
    
        console.log(showUploadField);
    

        // Check if `showUploadField` is set and validate `additionalFile`
        if (showUploadField === '') {
            setRadioError('Please select an option for uploading more documents.');
            isValid = false;
        } else if (showUploadField === 'yes') { // Ensure you are using the correct value here
            const { additionalFile } = basicDetailsFormValues;
    
            // additionalFile.forEach((item, index) => {
            //     if (!item.file) { // Assuming `item.file` is the actual file object
            //         newError[index] = 'Please select a file';
            //         isValid = false;
            //     } else if (fileError[index]) { // Check existing fileErrors
            //         isValid = false;
            //     } else {
            //         newError[index] = ''; // Clear any previous errors
            //     }
            // });
    
            // setFileError(newError);
        }
    
        // If no validation errors, proceed with form submission
        if (Object.keys(validationErrors).length === 0 && isValid) {
            // Prepare FormData
            const formData = new FormData();
    
            // Append the 'file' field if it exists
            if (basicDetailsFormValues.file) {
                formData.append('file', basicDetailsFormValues.file);
            }
            formData.append('appDocId', basicDetailsFormValues.appDocId);
            formData.append('intentId', basicDetailsFormValues.intentId);
            formData.append('userName', basicDetailsFormValues.userName);
    
            // Append each file and its metadata from the 'additionalFile' array
            basicDetailsFormValues.additionalFile.forEach((fileObject, index) => {
                if (fileObject.file) {
                    formData.append(`additionalFile[${index}].file`, fileObject.file); // Append the file
                }
                formData.append(`additionalFile[${index}].fileName`, fileObject.fileName); // Append the file name
                formData.append(`additionalFile[${index}].documentTitleName`, fileObject.documentTitleName); // Append the document title
                formData.append(`appDocId[${index}].appDocId`, fileObject.appDocId);
            });
    
            // Append each file and its metadata from the 'additionalsFile' array
            basicDetailsFormValues.additionalsFile.forEach((fileObject, index) => {
                if (fileObject.file) {
                    formData.append(`additionalsFile[${index}].file`, fileObject.file); // Append the file
                }
                formData.append(`additionalsFile[${index}].fileName`, fileObject.fileName); // Append the file name
                formData.append(`additionalsFile[${index}].DocumentName`, fileObject.DocumentName); // Append the document name
                formData.append(`appDocId[${index}].appDocId`, fileObject.appDocId);
            });
    
            console.log(JSON.stringify(formData))
            // Determine the appropriate API call based on the presence of appDocId
            const responseFunction = basicDetailsFormValues.appDocId
                ? ApplicationForm.updateNewApplicationForm6
                : ApplicationForm.addNewApplicationForm6;
    
            responseFunction(formData)
                .then((response) => {
                    showAlert({
                        messageTitle: 'Sixth Step Successful',
                        messageContent: `Sixth step ${basicDetailsFormValues.appDocId ? 'updated' : 'saved'} successfully`,
                        confirmText: 'Ok',
                        onConfirm: () => { handleNext(); }
                    });
                })
                .catch((err) => {
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: err.response.data
                            ? typeof err.response.data === 'object'
                                ? 'Your request cannot be processed at this time. Please try again later.'
                                : err.response.data
                            : 'Your request cannot be processed at this time. Please try again later.',
                        confirmText: 'Ok',
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
    
            // Log FormData contents
            console.log(formData);
            logFormData(formData);
    
        } else {
            console.log('Form submission failed due to validation errors.');
           // console.log(newError);
        }
    };
    
   
    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            {/* Credit Card Details */}

            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'><b>CPS Document*(34)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
            <Grid item xs={12} sm>
            {allCPSDocList.length > 0 ? (
        allCPSDocList.map((item) => (
            <Button
                key={item.cpsDocId}
                onClick={() => handleDownload(item.cpsDocId, item.fileName)} // Ensure fileName is correct
               component="label"
               variant="contained"
                sx={{ margin: 1 }} 
                startIcon={<DownloadIcon />}// Add some margin for spacing
            >
            Download CPS Document
            </Button>
        ))
    ) : (
        <Typography>No documents available.</Typography> // Display if the list is empty
    )}
</Grid>

                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload CPS Document (Only PDF and Max allowed size 5 MB)*</Typography>
                    </InputLabel>

                    <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
                        <Grid item >
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput
                                    key={fileInputKey}
                                    type="file"
                                    name="file"
                                    disabled={!isFieldEnabled("ind")}
                                    onChange={handleFileChange}
                                    
                                />
                            </Button>

                        </Grid>
                        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {fileName && (
                                <Tooltip title={fileName} placement="top">
                                    <Typography variant='body2' sx={{
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle',
                                        textAlign: 'center'
                                    }}>
                                        {fileName}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                    </Grid>
                    {formErrors.file && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {formErrors.file}
        </Typography>
    )}
                   
                </Grid>

            </Grid>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'><b>Documents*</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
    {abc.map((item, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
            <Grid item xs={12} sm={3}>
                <InputLabel shrink={false} htmlFor={`pdffile-${index}`}>
                    <Typography variant='body1' sx={{ mt: 5 }}>
                        {index + 1}. {item} Document
                    </Typography>
                </InputLabel>
            </Grid>
            <Grid item xs={12} sm={7}>
                <InputLabel shrink={false} htmlFor={`pdffile-${index}`}>
                    <Typography variant='body1'>
                        Upload {item} Document (Only PDF and Max allowed size 5 MB)*
                    </Typography>
                </InputLabel>

                {/* Upload and Download Section */}
                <Grid container alignItems="center" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1, p: 1 }}>
                    {/* Upload Button */}
                    <Grid item>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <input
                                type="file"
                                name="file"
                                hidden
                                onChange={handleFileChange6(index)}
                            />
                        </Button>
                    </Grid>

                    {/* File Name Display */}
                    <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
                        {fileNames[index] && (
                            <Tooltip title={fileNames[index]} placement="top">
                                <Typography variant='body2' sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'center'
                                }}>
                                    {fileNames[index]}
                                </Typography>
                            </Tooltip>
                        )}
                    </Grid>

                    {/* Download Link */}
                  
                </Grid>

                {/* Error Message */}
                {fileErrors[index] && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {fileErrors[index]}
                    </Typography>
                )}
            </Grid>

            {basicDetailsFormValues?.additionalsFile[index]?.appDocId && (
                        <Grid item>
                            <Link 
                                href="#" 
                                variant="body2"
                                onClick={() => handleDownloadClick(basicDetailsFormValues?.additionalsFile[index]?.appDocId, `${item}Document`)}
                                sx={{ ml: 2 }}
                            >
                                Download
                            </Link>
                        </Grid>
                    )}

        </Grid>
    ))}
</Grid>


        <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                    <Typography variant="body1">Do you want to upload more documents?</Typography>
                    <RadioGroup
                        row
                        value={showUploadField}
                        onChange={handleRadioChange}
                       
                        sx={{
                            ml: 2, '& .MuiFormControlLabel-root': {
                                mr: 2,
                                '& .MuiTypography-root': { fontSize: '0.875rem' },
                                '& .MuiRadio-root': {
                                    transform: 'scale(0.8)'
                                }
                            }
                        }}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                   
                </Box>
                {radioError && <FormHelperText sx={{color:'red'}}>{radioError}</FormHelperText>}
            </Grid>
            {showUploadField === 'yes' && (
                <>
                 {basicDetailsFormValues.additionalFile.map((record, index) => (
    <React.Fragment key={index}>
        <Grid container spacing={2} sx={{ ml: 1 }}>
            <Grid item xs={12} sm={5}>
                <InputLabel shrink={false} htmlFor={`documentTitleName-${index}`}>
                    <Typography variant='body1'>
                        {basicDetailsFormValues.additionalFile.length > 1 ? `${index + 1}. ` : ''} Document TitleName*
                    </Typography>
                </InputLabel>
                <TextField
                    id={`documentTitleName-${index}`}
                    margin="dense"
                    required
                    fullWidth
                    placeholder='Document TitleName'
                    name={`documentTitleName-${index}`}
                    variant='outlined'
                    value={basicDetailsFormValues.additionalFile[index]?.documentTitleName || ''}
                    onChange={(e) => handleDocumentTitleChange(index, e)}
                    size="small"
                    inputProps={{ maxLength: 15 }}
                />
            </Grid>

            <Grid item xs={12} sm={5}>
                <InputLabel shrink={false} htmlFor={`additionalFile-${index}`}>
                    <Typography variant='body1'>
                        {basicDetailsFormValues.additionalFile.length > 1 ? `${index + 1}. ` : ''} Upload Additional Document (Only PDF and Max allowed size 5 MB)
                    </Typography>
                </InputLabel>

                <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
                    <Grid item>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <VisuallyHiddenInput
                                key={index} // Ensure a unique key for each file input
                                type="file"
                                name={`additionalFile-${index}`}
                                id={`additionalFile-${index}`}
                                onChange={(e) => handlefilesChange7(index, e)}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {record.fileName && (
                            <Tooltip title={record.fileName} placement="top">
                                <Typography variant='body2' sx={{
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    verticalAlign: 'middle',
                                    textAlign: 'center'
                                }}>
                                    {record.fileName}
                                </Typography>
                            </Tooltip>
                        )}
                    </Grid>
                </Grid>
                {fileError[index] && (
                    <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                        {fileError[index]}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={2} sm={0.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 15 }}>
                {basicDetailsFormValues.additionalFile.length > 1 && index === basicDetailsFormValues.additionalFile.length - 1 && basicDetailsFormValues.additionalFile.length < MAX_FILES ? (
                    <>
                        <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 2 } }} onClick={handleAddssField}>
                            <AddIcon fontSize='small' color="success" />
                        </IconButton>
                        <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 2 } }} onClick={() => handleRemovessField(index)}>
                            <RemoveIcon fontSize='small' color="error" />
                        </IconButton>
                    </>
                ) : basicDetailsFormValues.additionalFile.length === 1 ? (
                    <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 2 } }} onClick={handleAddssField}>
                        <AddIcon fontSize='small' color="success" />
                    </IconButton>
                ) : basicDetailsFormValues.additionalFile.length === MAX_FILES && index === MAX_FILES - 1 ? (
                    <IconButton sx={{ width: '20px', height: '20px', mt: { sm: 2 } }} onClick={() => handleRemovessField(index)}>
                        <RemoveIcon fontSize='small' color="error" />
                    </IconButton>
                ) : null}
            </Grid>
        </Grid>
    </React.Fragment>
))}

                </>
            )}
        </Grid>

            <Box sx={{ display: 'flex', justifyContent:'space-between', mt: 3 ,ml:1}}>
            <Button
                                        onClick={handleBacks}
                                        sx={{ mr: 1 }}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Back
                                    </Button>
            <Button
            type="submit"
                                        variant="contained"
                                        color="primary"
                                      
                                    >
                                        Save & Next
                                    </Button>

</Box>
<Grid item xs={12}>
    <InputLabel shrink={false}>
        <Typography variant='body1'>
            Note: * marked field are mandatory to be filled
        </Typography>
       
    </InputLabel>
</Grid>

        </Box>
    );
};

export default CPSDocumentDetails;
