import { useNavigate, useLocation } from 'react-router-dom';
import showAlert from '../common/MessageBox/AlertService';
import { useEffect } from 'react';
import { decrypt } from '../util/EncryptDecrypt';
import AuditService from '../../../service/AuditService/AuditService';

const EsignResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  var res = urlParams.get('id');
  var rurl = urlParams.get('pid');
  const pendingEsignUser = urlParams.get('pendingEsign');
  rurl = rurl.replace(/ /g, '+');

  const navigateAfterEsign = () => navigate(decrypt(rurl));

  const markAuditEsignFailedIfNeeded = () => {
    if (!pendingEsignUser) {
      return Promise.resolve();
    }
    const applicantUserName = decrypt(pendingEsignUser.replace(/ /g, '+'));
    return AuditService.markAuditEsignFailed(applicantUserName).catch(() => {});
  };

  const msg = () => {

    

    if (decrypt(res) === "signer_mismatch") {
      showAlert({
        messageTitle: 'Error',
        messageContent: 'The signer name does not match with the applicant name.',
        confirmText: 'OK',
        onConfirm: () => navigate(decrypt(rurl)),
        closeParent: true,
        disableOutsideKeyDown:true
      });
    }else if (decrypt(res) === "signed_success") {
      showAlert({
        messageTitle: 'Success',
        messageContent: 'The document has been successfully signed.',
        confirmText: 'OK',
        onConfirm: () => navigate(decrypt(rurl)),
        closeParent: true,
        disableOutsideKeyDown:true
      });
    }else if (decrypt(res) === "failed") {
      markAuditEsignFailedIfNeeded().finally(() => {
        showAlert({
          messageTitle: 'Error',
          messageContent: 'Failed to eSign the NC audit report. You can open the applicant again and use Retry eSign.',
          confirmText: 'OK',
          onConfirm: navigateAfterEsign,
          closeParent: true,
          disableOutsideKeyDown:true
        });
      });
    }
    
    else{
        navigate("/login");
    }
  };

  useEffect(() => {
    msg();
  }, []);

  return <></>;
};

export default EsignResponse;
