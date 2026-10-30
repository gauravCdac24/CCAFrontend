import { useEffect, useState } from 'react';
import LicenseIssuanceService from '../../../service/LicenseIssuanceService/LicenseIssuanceService';

/** A review belongs to the renewal only when it was recorded after the current licence was issued. */
export const isRenewalReviewRemark = (review, licenseIssueDate) => {
  if (!review?.created || !licenseIssueDate) {
    return false;
  }
  const reviewTime = new Date(review.created).getTime();
  const issueTime = new Date(licenseIssueDate).getTime();
  if (Number.isNaN(reviewTime) || Number.isNaN(issueTime)) {
    return false;
  }
  return reviewTime > issueTime;
};

export const useLicenseIssueDate = (username) => {
  const [licenseIssueDate, setLicenseIssueDate] = useState(null);

  useEffect(() => {
    if (!username) {
      return undefined;
    }
    let active = true;
    LicenseIssuanceService.getLicenseDetailsByUserName(username)
      .then((res) => {
        if (active) {
          setLicenseIssueDate(res.data?.issueDate || null);
        }
      })
      .catch(() => {
        if (active) {
          setLicenseIssueDate(null);
        }
      });
    return () => {
      active = false;
    };
  }, [username]);

  return licenseIssueDate;
};
