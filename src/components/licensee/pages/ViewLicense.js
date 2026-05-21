import { useEffect, useRef, useState } from "react";
import LicenseIssuanceService from "../../../service/LicenseIssuanceService/LicenseIssuanceService";
import LoaderProgress from "../../global/common/LoaderProgress";
import { Box, Button, Grid, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { timeStampToDate } from "../../global/util/TimestampConverter";
import showAlert from "../../global/common/MessageBox/AlertService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ESPApplicationService from "../../../service/ESPApplicationService/ESPApplicationService";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PreviewApplication from "./ESPApplication/PreviewApplication";
import dayjs from "dayjs";
import PreviewPreviousApplication from "./ESPApplication/PreviewPreviousApplication";
import CessationNoticeFile from "./CessationLicense/CessationNoticeFile";
import CessationService from "../../../service/CessationService/CessationService";
import LicenseCessationChecklist from "./CessationLicense/LicenseCessationChecklist";
import { encrypt } from "../../global/util/EncryptDecrypt";
import ViewCessationApplication from "./CessationLicense/ViewCessationApplication";
import DownloadIcon from '@mui/icons-material/Download';

const ViewLicense = () => {

    const [licenseDetails, setLicenseDetails] = useState({});
    const [applicationDetails, setApplicationDetails] = useState({});
    const [previousApplicationDetails, setPreviousApplicationDetails] = useState([]);
    const [getAllLicenseId, setAllLicenseId] = useState({});
    const [getAllCessationAppUndertakings, setAllCessationAppUndertakings] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);
    const userName = useSelector((state) => state.jwtAuthentication.username);



    const ref = useRef();

    const handleSubmitDocuments = () => {
        ref.current.handleFormSubmit()
    }

    const handleResetForm = () => {
        ref.current.handleReset()
    }

    const getLicenseDetailsByUsername = () => {

        setIsLoading(true);
        LicenseIssuanceService.getLicenseDetails()
            .then((res) => {
                setLicenseDetails(res.data);
            })
            .catch((err) => {

            })
            .finally(() => {
                setIsLoading(false);
            })


    }

    const getApplicationDetails = () => {

        setIsLoading(true);
        ESPApplicationService.getApplicationDetails()
            .then((res) => {
                setApplicationDetails(res.data);
            })
            .catch((err) => {
                setApplicationDetails(null);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    



   // Function to fetch license details
   const getAllLicenseDetails = async () => {
    setIsLoading(true);

    if (!licenseDetails?.licenseId) {
        console.warn("License ID is undefined.");
        return;
    }

    console.log("Fetching license details for ID:", licenseDetails.licenseId);
    try {
        const response = await CessationService.getAllLicenseId(licenseDetails?.licenseId);
        setAllLicenseId(response.data); 
        console.log("API Response:", JSON.stringify(response.data));
       
    } catch (err) {
        console.error("Error fetching license details:", err);
      
        setAllLicenseId(null); 
    } finally {
        setIsLoading(false); 
    }
};


useEffect(() => {
    if (licenseDetails?.licenseId) {
        console.log("Fetching license details for ID:", licenseDetails.licenseId);
        getAllLicenseDetails();
    } else {
        console.warn("License details not ready yet.");
    }
}, [licenseDetails]);

    console.log("abggdo=-=-=-=-=-=-=-=->",getAllLicenseId)

   

  

    const getAllCessationAppUndertaking = () => {
        setIsLoading(true);
       
        CessationService.getAllDataByCessationAppId( encrypt(getAllLicenseId?.cessationAppId))
            .then((res) => {
                setAllCessationAppUndertakings(res.data);
                console.log("setAllCessationAppUndertakings-=-=-=-=-=-=->",res.data)
            })
            .catch((err) => {
                console.error(err);
                setAllCessationAppUndertakings(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    console.log("setAllCessationAppUndertakings-=-=-=-=-=-=->",getAllCessationAppUndertakings)

    useEffect(() => {
        if (getAllLicenseId?.cessationAppId) {
            console.log("Triggering fetch for cessation app undertakings.");
            getAllCessationAppUndertaking();
        } else {
            console.warn("Cessation App ID not ready yet.");
        }
    }, [getAllLicenseId?.cessationAppId]);

    const getPreviousApplicationDetails = () => {
        setIsLoading(true);
        ESPApplicationService.getPreviousApplicationDetails()
            .then((res) => {
                setPreviousApplicationDetails(res.data);
            })
            .catch((err) => {
                setPreviousApplicationDetails(null);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const handleDownload = async (id) => {
        try {

            const response = await LicenseIssuanceService.viewLicenseDocument(id);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const contentDisposition = response.headers['content-disposition'];
            const filename = "CALicense";

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error viewing file:', error);
        }
    };


    const downloadApplicationForm = async () => {
        try {

            const response = await ESPApplicationService.downloadApplicationForm();
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const contentDisposition = response.headers['content-disposition'];
            const filename = "ApplicationForm";

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error viewing file:', error);
        }
    };

    const editApplication = () => {
        navigate(`${rolePath}/viewlicense/espapplication`);
    }


    const viewPrevApplicationDetails = (id) => {

        showAlert({
            messageTitle: 'View',
            messageContent: (<><PreviewPreviousApplication espappid={id} /></>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: "md"
        });

    }

    const viewApplication = () => {

        showAlert({
            messageTitle: 'View',
            messageContent: (<><PreviewApplication /></>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: "md"
        });
    }

    const handleConfrimSubmit = () => {

        navigate(`${rolePath}/viewlicense/espapplication`);

    }

    const viewCessationApplication = () => {

        showAlert({
            messageTitle: 'View Cessation Document',
            messageContent: (<><ViewCessationApplication id={encrypt(getAllLicenseId?.cessationAppId)}/></>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: "md"
        });
    }

    const applyForESP = () => {

        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Are you sure, you want to apply for eSign Service Provider?',
            confirmText: 'Yes',
            closeText: 'No',

            onConfirm: () => handleConfrimSubmit()
        })

    }
    const uploadForCessation = () => {

        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Are you sure you want to Upload for the cessation notice file of this application?',
            confirmText: 'Yes',
            closeText: 'No',

            onConfirm: () => handleSubmit()
        })

    }

    const handleSubmit = () => {

        showAlert({
            messageTitle: 'Cessation Upload Notice File',
            messageContent: <CessationNoticeFile ref={ref} applicantUsername={userName} refreshList={licenseDetails} />,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            buttonOneText: "Submit",
            buttonTwoText: "Reset",
            onButtonOneClick: () => handleSubmitDocuments(),
            onButtonTwoClick: () => handleResetForm()

        })
    }



    const applyForCessation = () => {

        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Are you sure you want to apply for the cessation  of this application?',
            confirmText: 'Yes',
            closeText: 'No',

            onConfirm: () => handleApplySubmit()
        })



    }

    const handleApplySubmit = () => {
        const encryptedId = encodeURIComponent(encrypt(getAllLicenseId?.cessationAppId));
        navigate(`${rolePath}/viewlicense/licensecessationchecklist/${encryptedId}`);
    }


    const handleEditApplySubmit = () => {
        const encryptedId = encodeURIComponent(encrypt(getAllLicenseId?.cessationAppId));
        navigate(`${rolePath}/viewlicense/editlicensecessationchecklist/${encryptedId}`);
    }



    {/* added by sumit */ }
    const isRenewalAvailable = () => {
        if (licenseDetails.expiryDate) {
            const expiryDate = dayjs(licenseDetails.expiryDate);
            const currentDate = dayjs();
            const daysUntilExpiry = expiryDate.diff(currentDate, "day");

            // Check if the expiry date is within 45 days from today
            return daysUntilExpiry <= 45 && daysUntilExpiry >= 0;
        }
        return false;
    };


    const navigateToRenewalPage = () => {
        navigate("/licensee/viewlicense/renewallicense");
    }

    const Yes = () => {
        showAlert({
            messageTitle: 'Renewal License',
            messageContent: "Are you sure you want to proceed with the License Renewal application?",
            confirmText: 'yes',
            closeText: "cancel",
            onConfirm: () => navigateToRenewalPage(),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            maxWidth: 'sm',
            fullWidth: true,
        });
    };
    {/*------End by Sumit ------*/ }

    useEffect(() => {

        getLicenseDetailsByUsername();
        getApplicationDetails();
        getPreviousApplicationDetails();
       // getAllCessationAppUndertaking();
    }, [])


    return (
        <>

            <LoaderProgress open={isLoading} />

            {
                licenseDetails !== null ? (

                    <>

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>

                            <Box sx={{
                                backgroundImage: 'url("/images/calicensebg.jpg")',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px',
                                width: '600px',
                                p: 2,
                                borderRadius: '10px',
                            }}

                            >

                                <Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs>
                                            <Typography variant="h6" >Serial Number:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{licenseDetails.serialNo}</Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs>
                                            <Typography variant="h6" >Issue Date:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{timeStampToDate(licenseDetails.issueDate)}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs>
                                            <Typography variant="h6" >Expiry Date:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{timeStampToDate(licenseDetails.expiryDate)}</Typography>
                                        </Grid>
                                    </Grid>


                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs>
                                            <Typography variant="h6" >License Certificate:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography > <Link onClick={() => handleDownload(licenseDetails.licenseId)}
                                                sx={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Download
                                            </Link></Typography>
                                        </Grid>
                                    </Grid>


                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs>
                                            <Typography variant="h6" >Status:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            {/* added by sumit */}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography>{licenseDetails.status}</Typography>

                                                {/* Conditionally render Renewal License link
                                                {isRenewalAvailable() && (
                                                    <Link
                                                        onClick={() => {

                                                            Yes()

                                                        }}
                                                        sx={{
                                                            color: "red",
                                                            cursor: "pointer",
                                                            textDecoration: "underline",
                                                            ml: 2,
                                                        }}
                                                    >
                                                        Apply for Renewal
                                                    </Link>
                                                )} */}
                                            </Box>

                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>




                        </Box>
                        {
    getAllCessationAppUndertakings && getAllCessationAppUndertakings.length > 0 ? (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 6,
            }}
        >
            <Grid container mt={2} sx={{ width: "600px" }}>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table sx={{ border: 0.5, borderColor: "grey.500" }}>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor: "tablecolor.main",
                                        color: "tablecolor.text",
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            fontWeight: "bold",
                                            padding: 1,
                                            width: "60px",
                                        }}
                                    >
                                        Sl. No.
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            fontWeight: "bold",
                                            padding: 1,
                                        }}
                                    >
                                        Application Name
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            fontWeight: "bold",
                                            padding: 1,
                                        }}
                                    >
                                        Application Number
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            fontWeight: "bold",
                                            padding: 1,
                                        }}
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            fontWeight: "bold",
                                            padding: 1,
                                        }}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            padding: 1,
                                        }}
                                    >
                                        {"1"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            padding: 1,
                                        }}
                                    >
                                        {"Rejection Application"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            padding: 1,
                                        }}
                                    >
                                        {getAllLicenseId?.userName || "Not Generated"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            padding: 1,
                                        }}
                                    >
                                        {getAllLicenseId?.status}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: 0.5,
                                            borderColor: "grey.500",
                                            padding: 1,
                                        }}
                                    >
                                        <>
                                            <Tooltip title="View">
                                                <IconButton
                                                    aria-label="view"
                                                    color="success"
                                                    onClick={viewCessationApplication}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {getAllLicenseId?.status === "reject_from_cca_officer" && (
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        aria-label="edit"
                                                        color="info"
                                                        onClick={handleEditApplySubmit}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    ) : licenseDetails?.status === "Active" ? (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 6,
            }}
        >
            <TableContainer
                component={Box}
                sx={{
                    width: "600px",
                    border: "1px solid",
                    color: "primary.main",
                    borderRadius: "10px",
                }}
            >
                <Table aria-label="customized table">
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">
                                <Typography variant="h6" color="textcolor.text">
                                    Would you like cessation of this application?
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                {getAllLicenseId?.status === "ApprovedNotice" ? (
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 1 }}
                                        onClick={applyForCessation}
                                    >
                                        Apply
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 1 }}
                                        onClick={uploadForCessation}
                                    >
                                        Upload
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    ) : (
        <>No Records Found</>
    )
}






                        {applicationDetails ?

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 6
                            }}>

                                <Grid container mt={2} sx={{ width: '600px' }}>
                                    <Grid item xs={12}>
                                        <TableContainer>
                                            <Table sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px' }}>Sl. No.</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Application Name</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Application Number</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Status</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{"1"}</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{"eSign Service Provider"}</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{applicationDetails?.applicationNumber || "Not Generated"}</TableCell>
                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{applicationDetails?.applicationStatus}</TableCell>

                                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>

                                                            <>
                                                                <Tooltip title="View">
                                                                    <IconButton
                                                                        aria-label="view"
                                                                        color="success"
                                                                        onClick={viewApplication}
                                                                    ><VisibilityIcon /></IconButton>
                                                                </Tooltip>

                                                                {(applicationDetails.applicationStatus === "Not Completed" || applicationDetails.applicationStatus === "Under Review") && (
                                                                    <Tooltip title="Edit">
                                                                        <IconButton
                                                                            aria-label="edit"
                                                                            color="info"
                                                                            onClick={editApplication}
                                                                        ><EditIcon /></IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            {applicationDetails.applicationStatus !== "Not Completed" && (
                                                            <Tooltip title="Download">
                                                                <IconButton
                                                                    aria-label="download"
                                                                    color="info"
                                                                    onClick={downloadApplicationForm} 
                                                                ><DownloadIcon /></IconButton>
                                                                </Tooltip>)}
                                                            </>
                                                        </TableCell>

                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>


                            </Box>

                            :
                            <>
                                {licenseDetails.status === 'Active' && (
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mt: 6
                                    }}>
                                        <TableContainer component={Box} sx={{ width: '600px', border: '1px solid', color: 'primary.main', borderRadius: '10px' }}>
                                            <Table aria-label="customized table">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="left"><Typography variant="h6" color="textcolor.text">Would you like to become an eSign service provider?</Typography></TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                type="button"
                                                                fullWidth
                                                                variant="contained"
                                                                sx={{ mt: 1 }}
                                                                onClick={applyForESP}
                                                            >
                                                                Apply
                                                            </Button>

                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                    </Box>

                                )}

                            </>



                        }

                    </>

                ) :
                    (
                        <> No Records Found</>
                    )
            }



            {/*---- Previous Application Details----*/}

            {
                previousApplicationDetails && previousApplicationDetails.length > 0 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 6
                    }}>

                        <Grid container mt={2} sx={{ width: '600px' }}>
                            <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h5">Previous Application</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px' }}>Sl. No.</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Application Name</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Application Number</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Status</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>


                                        {previousApplicationDetails.map((item, index) => (




                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{index + 1}</TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{"eSign Service Provider"}</TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{item?.applicationNumber || "Not Generated"}</TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{item?.applicationStatus}</TableCell>

                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>

                                                        <>
                                                            <Tooltip title="View">
                                                                <IconButton
                                                                    aria-label="view"
                                                                    color="success"
                                                                    onClick={() => viewPrevApplicationDetails(item.esignLicenseeAppId)}
                                                                ><VisibilityIcon /></IconButton>
                                                            </Tooltip>


                                                        </>
                                                    </TableCell>

                                                </TableRow>
                                            </TableBody>





                                        ))}

                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>


                )

            }

        </>



    )

}

export default ViewLicense;