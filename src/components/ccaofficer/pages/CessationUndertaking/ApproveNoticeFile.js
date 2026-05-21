import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography, Link } from '@mui/material';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CessationService from '../../../../service/CessationService/CessationService';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';

const ApproveNoticeFile = () => {
  const { id } = useParams();
  const cessationAppId = decrypt(id);

  const [requiredDoc, setRequiredDoc] = useState({
    userName: '',
    cessationNotice: null,
    licenseId: '',
  });

  const [isLoading, setLoading] = useState(false);
  const [cessationList, setCessationList] = useState({});

  const getCessationList = () => {
    setLoading(true);
    CessationService.getByCessationAppId(cessationAppId)
      .then((response) => {
        setCessationList(response.data);
      })
      .catch((err) => {
        console.error('Error fetching cessation list:', err);
        showAlert({
          messageTitle: 'Error',
          messageContent: 'Failed to fetch cessation list. Please try again later.',
          confirmText: 'Ok',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

console.log("cessationList==-=-=-=->",cessationList)

  const handleConfirmSubmit = () => {
    setLoading(true);

    CessationService.approveCessationNoticeFile(String(cessationAppId))
      .then((response) => {
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          closeParent: true,
          onConfirm: ()=>handleBack()
        });
      })
      .catch((err) => {
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data || 'Failed to upload the file. Please try again later.',
          confirmText: 'Ok',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApprove = () => {
    showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure you want to approve this application?',
      confirmText: 'Yes',
      closeText: 'No',
      fullWidth: true,
      maxWidth: 'sm',
      onConfirm: handleConfirmSubmit,
    });
  };


  const handleRejectSubmit = () => {
    setLoading(true);

    CessationService.rejectCessationNoticeFile(String(cessationAppId))
      .then((response) => {
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          closeParent: true,
          onConfirm: ()=>handleBack()
        });
      })
      .catch((err) => {
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data || 'Failed to upload the file. Please try again later.',
          confirmText: 'Ok',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };



  const handleReject = () => {
    showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure you want to reject this application?',
      confirmText: 'Yes',
      closeText: 'No',
      fullWidth: true,
      maxWidth: 'sm',
      onConfirm: handleRejectSubmit, // You might need to replace this with a reject-specific logic
    });
  };

  const downloadDocument = async (id, type) => {
    try {
      setLoading(true);

      const response = await CessationService.downloadStepTwoDocument(encrypt(id));
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${type}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      showAlert({
        messageTitle: 'Error',
        messageContent: 'Failed to download the document. Please try again later.',
        confirmText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCessationList();
  }, []);

  const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const navigate = useNavigate();

  const handleBack = () => {
    navigate(`${routeRootPath}/cessationapplication`, { replace: true })
  }
  

  return (
    <>
      <LoaderProgress open={isLoading} />

      <Box component="div" sx={{mb: 2}}>
        <Grid container spacing={2} direction={'column'}>
            <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                <Button variant="contained" onClick={handleBack}>
                    <Typography variant="h6">Back</Typography>
                </Button>
            </Grid>
        </Grid>
    </Box>

      <FormWrapper headingText="Approve Notice File">
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid container sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight="bold">
                  Cessation Notice File:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Link
                  href="#"
                  onClick={() => downloadDocument(cessationList?.cessationAppId, 'cessationNoticeDocument')}
                >
                  Download
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            sx={{ mt: 4 }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ maxWidth: '120px' }}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                color="reset"
                fullWidth
                variant="contained"
                sx={{ maxWidth: '120px',color:'white' }}
                onClick={handleReject}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormWrapper>
    </>
  );
};

export default ApproveNoticeFile;
