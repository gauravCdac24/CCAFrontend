import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Captcha from '../../global/util/Captcha';
import LoaderProgress from '../../global/common/LoaderProgress';
import showAlert from '../../global/common/MessageBox/AlertService';
import FormWrapper from '../../global/util/FormWrapper';
import AnnexureService from '../../../service/AnnexureA2Service/AnnexureService';
import AnnexureA2Main from './AnnexureA2/AnnexureA2Main';
import { decrypt } from '../../global/util/EncryptDecrypt';

const TOTAL_ANNEXURE_SECTIONS = 18;

const errorMsg = {
  captcha: {
    blank: 'Please enter captcha.',
    invalid: 'Captcha does not match. Please try again.',
  },
  applicant: {
    invalid: 'Invalid applicant reference. Please open this page from the application list again.',
  },
  remarks: {
    incomplete: 'Please save auditor remarks for all annexure sections before final submit.',
  },
};

const ViewAnnexure = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const applicantUserName = id ? decrypt(decodeURIComponent(id)) : '';

  const [formErrors, setFormErrors] = useState({});
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isLoading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!applicantUserName) {
      errors.applicant = errorMsg.applicant.invalid;
    }

    if (!captchaInput?.trim()) {
      errors.captcha = errorMsg.captcha.blank;
    } else if (captchaInput !== captchaText) {
      errors.captcha = errorMsg.captcha.invalid;
    }

    return errors;
  };

  const getAnnexureProgress = async () => {
    try {
      const response = await AnnexureService.getAnnexureMainByUsername(applicantUserName);
      return response?.data || null;
    } catch {
      return null;
    }
  };

  const handleConfirmSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: Object.values(errors)[0],
        confirmText: 'Ok',
      });
      return;
    }

    setLoading(true);
    try {
      const annexureEntry = await getAnnexureProgress();
      const tracker = annexureEntry?.auditorTracker ?? 0;

      if (tracker < TOTAL_ANNEXURE_SECTIONS) {
        showAlert({
          messageTitle: 'Incomplete Remarks',
          messageContent: `Please save remarks for all ${TOTAL_ANNEXURE_SECTIONS} annexure sections using "SAVE REMARKS" on each section. Completed: ${tracker}/${TOTAL_ANNEXURE_SECTIONS}.`,
          confirmText: 'Ok',
        });
        return;
      }

      const response = await AnnexureService.changeAnnexureStatus(applicantUserName);

      showAlert({
        messageTitle: 'Success',
        messageContent:
          typeof response.data === 'string'
            ? response.data
            : 'Annexure A2 verification submitted successfully.',
        confirmText: 'Ok',
        onConfirm: () => navigate('/auditagency/uploadundertaking'),
      });
    } catch (err) {
      showAlert({
        messageTitle: 'Error',
        messageContent:
          typeof err.response?.data === 'string'
            ? err.response.data
            : 'Request failed. Please try again later.',
        confirmText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: Object.values(errors)[0],
        confirmText: 'Ok',
      });
      return;
    }

    showAlert({
      messageTitle: 'Confirm Submit',
      messageContent:
        'Are you sure you want to submit Annexure A2 verification? You must have saved remarks for all 18 sections. This action will finalize your review.',
      confirmText: 'Yes',
      closeText: 'No',
      fullWidth: true,
      maxWidth: 'md',
      onConfirm: () => handleConfirmSubmit(),
    });
  };

  return (
    <>
      <LoaderProgress open={isLoading} />
      <FormWrapper headingText="View Annexure A2 Data">
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleSubmit}>
          <AnnexureA2Main />

          <Box
            sx={{
              mt: 4,
              pt: 3,
              pb: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontWeight: 600 }}>
              Final Submission — Annexure A2 Auditor Verification
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Save remarks on each section above, then submit below. All {TOTAL_ANNEXURE_SECTIONS} sections must be completed.
            </Typography>

            <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Grid item>
                <Captcha
                  setCaptcha={setCaptchaText}
                  setCaptchaInput={setCaptchaInput}
                  captchaInput={captchaInput}
                  captchaError={!!formErrors.captcha}
                  captchaErrorMsg={formErrors.captcha}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="center" mt={3} sx={{ gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ minWidth: 160 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </FormWrapper>
    </>
  );
};

export default ViewAnnexure;
