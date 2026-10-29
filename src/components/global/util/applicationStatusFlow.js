/** Ordered license-acquisition statuses used for progress / next-step labels. */
export const APPLICATION_STATUS_FLOW = [
  "Application Submitted",
  "PaymentProof Recieved",
  "Payment Verification",
  "Application Scrutiny",
  "Reviewed By CCA",
  "Audit By Audit Agency",
  "Document Audit Review",
  "LICENSE_ISSUED",
];

/**
 * Map a live application status string to an index in APPLICATION_STATUS_FLOW.
 */
export const getActiveStepIndex = (currentStatus) => {
  if (!currentStatus) return 0;

  const status = String(currentStatus)
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (
    status.includes("license issued") ||
    status.includes("licence issued") ||
    status === "license_issued"
  ) {
    return 7;
  }

  if (
    status.includes("license details pending") ||
    status.includes("license details sent to admin") ||
    status.includes("bank guarantee proof uploaded")
  ) {
    return 6;
  }

  if (
    status.includes("in principle") ||
    status.includes("principle approval") ||
    status.includes("recommended in principle approval") ||
    status.includes("in principle approval granted") ||
    status.includes("document submitted for license")
  ) {
    return 7;
  }

  if (status.includes("review nc report")) {
    return 6;
  }

  if (
    status.includes("recomanded for audit") ||
    status.includes("recommended for audit") ||
    status.includes("agency selection") ||
    status.includes("approve from cca") ||
    status.includes("nc issued by auditor") ||
    status.includes("nc action taken by applicant")
  ) {
    return 5;
  }

  if (
    status.includes("approved from review") ||
    status.includes("reviewed by cca") ||
    status.includes("reviewed by committee")
  ) {
    return 4;
  }

  if (
    status.includes("edit upon review") ||
    status.includes("application scrutiny") ||
    status.includes("under review") ||
    status.includes("send to rejection")
  ) {
    return 3;
  }

  if (
    status.includes("payment verification") ||
    (status.includes("scrutiny") && !status.includes("application scrutiny")) ||
    status === "payment"
  ) {
    return 2;
  }

  if (
    status.includes("paymentproof") ||
    status.includes("payment proof") ||
    status.includes("paymentproof recieved") ||
    status.includes("paymentproof received")
  ) {
    return 1;
  }

  if (
    status.includes("application submitted") ||
    status === "submitted" ||
    status.includes("application pending") ||
    status === "pending"
  ) {
    return 0;
  }

  return 0;
};

/** Next status label after the current one, or a terminal message. */
export const getNextStepLabel = (currentStatus) => {
  const normalized = String(currentStatus || "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ");

  if (
    normalized.includes("license issued") ||
    normalized.includes("licence issued")
  ) {
    return "License Issued (Completed)";
  }

  // After In-principle grant, applicant must upload BG / Agreement / CSR
  if (
    normalized.includes("in principle approval granted") ||
    (normalized.includes("in principle") &&
      !normalized.includes("recommended"))
  ) {
    return "Upload Bank Guarantee, Agreement & CSR";
  }

  if (normalized.includes("recommended in principle")) {
    return "In Principle Approval Granted";
  }

  if (normalized.includes("document submitted for license")) {
    return "Bank Guarantee Proof Uploaded / License Issue";
  }

  if (normalized.includes("bank guarantee proof uploaded")) {
    return "Fill License Details";
  }

  if (normalized.includes("license details pending cca")) {
    return "CCA Review of License Details";
  }

  if (normalized.includes("license details sent to admin")) {
    return "Admin to Revise License Details";
  }

  const index = getActiveStepIndex(currentStatus);

  if (index >= APPLICATION_STATUS_FLOW.length - 1) {
    return "License Issued (Completed)";
  }

  return APPLICATION_STATUS_FLOW[index + 1] || "-";
};

export const isLicenseIssuedStatus = (status) => {
  const normalized = String(status || "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ");
  return (
    normalized.includes("license issued") ||
    normalized.includes("licence issued") ||
    normalized === "license_issued"
  );
};
