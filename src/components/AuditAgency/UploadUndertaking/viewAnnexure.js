import { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Captcha from '../../global/util/Captcha';
import LoaderProgress from '../../global/common/LoaderProgress';
import showAlert from '../../global/common/MessageBox/AlertService';
import FormWrapper from '../../global/util/FormWrapper';
import AnnexureService from '../../../service/AnnexureA2Service/AnnexureService';
import AnnexureA2Main from './AnnexureA2/AnnexureA2Main';
import { decrypt } from '../../global/util/EncryptDecrypt';
import {
  setAnnualAuditScheduleId,
  clearAnnualAuditScheduleId,
} from '../../global/util/annualAuditSchedule';

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
    incomplete: 'Please provide Auditor Remarks',
  },
};

const hasText = (value) => String(value ?? '').trim().length > 0;

const isMeaningfulDate = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  const asString = String(value);
  if (
    asString.startsWith('1970-01-01') ||
    asString.startsWith('01-Jan-1970') ||
    asString === '0'
  ) {
    return false;
  }
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) {
    // non-parseable but non-empty string dates from UI (e.g. dd-MM-yyyy)
    return hasText(value);
  }
  return time > 0;
};

const hasAnyValue = (obj, fields) =>
  fields.some((field) => {
    const value = obj?.[field];
    if (typeof value === 'number') {
      return !Number.isNaN(value);
    }
    if (field.toLowerCase().includes('date') || field.endsWith('Date')) {
      return isMeaningfulDate(value);
    }
    return hasText(value);
  });

const listHasMeaningfulRows = (list, fields) =>
  Array.isArray(list) && list.some((row) => hasAnyValue(row, fields));

/**
 * Treat a section as filled only when the applicant entered real content —
 * not when only catalog/placeholder rows or an empty Main shell exists.
 */
const sectionHasApplicantData = (apiNum, data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  switch (apiNum) {
    case '1':
      return listHasMeaningfulRows(data.details, ['fromDate', 'toDate', 'observations']);
    case '2':
      return listHasMeaningfulRows(data.details, [
        'fromDate',
        'toDate',
        'observations',
        'auditorDetails',
      ]);
    case '3':
      return listHasMeaningfulRows(data.details, [
        'fromDate',
        'toDate',
        'observations',
        'auditorDetails',
      ]);
    case '4':
      return hasAnyValue(data, [
        'approvalDateOfflineAadhaar',
        'approvalDateOnlineAadhar',
        'approvalDatePAN',
        'approvalDateCA',
        'approvalDateOrganisational',
        'approvalDateBanking',
        'offlineAadhaarDSCCount',
        'onlineAadharDSCCount',
        'panDSCCount',
        'caDSCCount',
        'organisationalDSCCount',
        'bankingDSCCount',
        'kuaLicenseDate',
        'panServDetails',
        'gstServiceDetails',
        'nameOfBanks',
        'extServOffAadhar',
        'extServOnAadhar',
        'extServPAN',
        'extServCA',
        'extServOrg',
        'extServBanking',
      ]);
    case '5':
      return hasAnyValue(data, [
        'totalRA',
        'activeRA',
        'datesOfRAAudit',
        'ncReportedByRA',
        'caActionTaken',
      ]);
    case '6':
      return hasAnyValue(data, [
        'activeCourtCases',
        'courtCasesCount',
        'policeComplaintsCount',
      ]);
    case '7':
      return hasAnyValue(data, ['dscRevokedCount', 'revocReqReason', 'dscRevokedReason']);
    case '8':
      return listHasMeaningfulRows(data.cryptoTokenDetails, [
        'brandName',
        'oemDetails',
        'makInPercentage',
        'fipCertUpTo',
        'secAuditDetails',
      ]);
    case '9':
      return listHasMeaningfulRows(data.caSwWebDetails, [
        'developedBy',
        'databaseUsed',
        'certification',
        'lastSecurityAudit',
      ]);
    case '10':
      return listHasMeaningfulRows(data.locationDetails, [
        'location',
        'caAdministratorCount',
        'sysAdministratorCount',
        'caOperatorsCount',
        'verificationOfficersCount',
        'caManpowerCount',
      ]);
    case '11':
      return listHasMeaningfulRows(data.caServicesDetails, [
        'internalOnly',
        'externalOnly',
        'aspOrgCount',
        'aspOrgCountFile',
      ]);
    case '12':
      return hasAnyValue(data, ['aspCount', 'aspsAuditOverdueCount']);
    case '13':
      return listHasMeaningfulRows(data.publicInfoDetails, ['webLink']);
    case '14':
      return hasAnyValue(data, [
        'avgDscIssuMaintenanceCost',
        'avgFeeChargedByCA',
        'explanationForCostMismatch',
      ]);
    case '15':
      return hasAnyValue(data, [
        'dscIssuedCountWAppForm',
        'ncReason',
        'dscIssuedWFee',
        'detailsDSCIssuedWFee',
        'dscIssuedWPhysicalVer',
        'dscIssuedWMatch',
        'ncReasonWithMatch',
        'isOTPSent',
        'otpReasonNC',
        'caSystemAccessDetails',
        'ownNCDetails',
      ]);
    case '16':
      return listHasMeaningfulRows(data.connectivityDetails, ['description']);
    case '17':
      return hasAnyValue(data, [
        'reasonAndMeasuresTaken',
        'downTimeHour',
        'downTimeMinute',
        'downTimeSecond',
      ]);
    case '18':
      return listHasMeaningfulRows(data.trustedPersonDetails, [
        'fullName',
        'designation',
        'locationOfPosting',
        'role',
        'idCardNo',
        'mobileNo',
        'identificationDetails',
        'employedSince',
        'trainingDetails',
        'lastBackVerDate',
      ]);
    default:
      return false;
  }
};

const getAuditorRemarks = (data) => {
  if (!data || typeof data !== 'object') {
    return '';
  }
  return String(data.auditorVerification ?? '').trim();
};

const ViewAnnexure = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const applicantUserName = id ? decrypt(decodeURIComponent(id)) : '';

  const [formErrors, setFormErrors] = useState({});
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!applicantUserName) {
      clearAnnualAuditScheduleId();
      return undefined;
    }

    let cancelled = false;
    AnnexureService.getAnnexureMainByUsername(applicantUserName)
      .then((response) => {
        if (cancelled) {
          return;
        }
        const scheduleId = response?.data?.auditScheduleId;
        if (scheduleId) {
          setAnnualAuditScheduleId(scheduleId);
        } else {
          clearAnnualAuditScheduleId();
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearAnnualAuditScheduleId();
        }
      });

    return () => {
      cancelled = true;
      clearAnnualAuditScheduleId();
    };
  }, [applicantUserName]);

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

  const hasMissingAuditorRemarks = async () => {
    const checks = Array.from({ length: TOTAL_ANNEXURE_SECTIONS }, (_, index) => {
      const apiNum = String(index + 1);
      return AnnexureService.getAuditorVerification({
        userName: applicantUserName,
        apiNum,
      })
        .then((response) => {
          const data = response?.data;
          if (!sectionHasApplicantData(apiNum, data)) {
            return false;
          }
          return !getAuditorRemarks(data);
        })
        .catch(() => false);
    });

    const results = await Promise.all(checks);
    return results.some(Boolean);
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
      const missingRemarks = await hasMissingAuditorRemarks();
      if (missingRemarks) {
        showAlert({
          messageTitle: 'Error',
          messageContent: errorMsg.remarks.incomplete,
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
      const serverMessage =
        typeof err.response?.data === 'string' ? err.response.data : null;
      showAlert({
        messageTitle: 'Error',
        messageContent: serverMessage || 'Request failed. Please try again later.',
        confirmText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);
    try {
      const missingRemarks = await hasMissingAuditorRemarks();
      if (missingRemarks) {
        showAlert({
          messageTitle: 'Error',
          messageContent: errorMsg.remarks.incomplete,
          confirmText: 'Ok',
        });
        return;
      }
    } catch {
      showAlert({
        messageTitle: 'Error',
        messageContent: 'Unable to verify auditor remarks. Please try again.',
        confirmText: 'Ok',
      });
      return;
    } finally {
      setLoading(false);
    }

    showAlert({
      messageTitle: 'Confirm Submit',
      messageContent:
        'Are you sure you want to submit Annexure A2 verification? Auditor remarks must be saved for every section the applicant has filled. This action will finalize your review.',
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
              Save remarks on each section the applicant has filled, then submit below.
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
