import AuditAgency from "../../../../service/AdminService/AuditAgency";
import AuditService from "../../../../service/AuditService/AuditService";
import AnnexureService from "../../../../service/AnnexureA2Service/AnnexureService";
import ApplicationReviewCommittee from "../../../../service/RenewLicenseService/ApplicationReviewCommittee";
import { encrypt } from "../../../global/util/EncryptDecrypt";

const ANNEXURE_SECTIONS = [
  { apiNum: "1", title: "1. Annual Audit Period Details" },
  { apiNum: "2", title: "2. Internal Audit Details" },
  { apiNum: "3", title: "3. eKYC Account Audit Details" },
  { apiNum: "4", title: "4. eKYC Account-based Verification" },
  { apiNum: "5", title: "5. RA Audit Details" },
  { apiNum: "6", title: "6. Court Cases / Police Complaints" },
  { apiNum: "7", title: "7. Revocation of DSC" },
  { apiNum: "8", title: "8. Empanelment of Crypto Token" },
  { apiNum: "9", title: "9. CA Software / Website" },
  { apiNum: "10", title: "10. DC & DR Site" },
  { apiNum: "11", title: "11. CA Services" },
  { apiNum: "12", title: "12. ASP Details" },
  { apiNum: "13", title: "13. Public Information on CA Website" },
  { apiNum: "14", title: "14. Cost of Certificates" },
  { apiNum: "15", title: "15. CA Self-assessment" },
  { apiNum: "16", title: "16. CA Software and External Connectivity" },
  { apiNum: "17", title: "17. Down time during the Audit Period" },
  { apiNum: "18", title: "18. CA Trusted Persons" },
];

const REMARK_FIELDS = [
  ["remarks", "Remarks"],
  ["remark", "Remarks"],
  ["auditorRemarks", "Auditor remarks"],
  ["auditorVerification", "Auditor remarks"],
  ["ccaRemarks", "CCA remarks"],
  ["applicantRemarks", "Applicant remarks"],
  ["reviewRemarks", "Review remarks"],
  ["ncRemarks", "NC remarks"],
  ["actionTaken", "Action taken"],
  ["observations", "Observations"],
  ["observation", "Observations"],
  ["comments", "Comments"],
  ["comment", "Comments"],
];

const TIME_FIELDS = [
  "created",
  "updated",
  "reviewDate",
  "actionDate",
  "esignedOn",
  "signedOn",
  "statusInitiatedOn",
  "applicationInitiatedOn",
];

const asList = (res) => {
  const data = res?.data ?? res;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.list)) return data.list;
  return [];
};

const textOf = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  return trimmed;
};

const isInactiveStatus = (status) => {
  const value = textOf(status).toLowerCase();
  if (!value) return false;
  return ["inactive", "rejected", "disabled", "false", "0"].includes(value);
};

const readStatus = (obj) => {
  if (!obj || typeof obj !== "object") return "";
  if (textOf(obj.status)) return textOf(obj.status);
  if (textOf(obj.userStatus)) return textOf(obj.userStatus);
  if (obj.active === true) return "Active";
  if (obj.active === false) return "Inactive";
  return "";
};

const readLogin = (obj) => {
  if (!obj || typeof obj !== "object") return "";
  return (
    textOf(obj.userName) ||
    textOf(obj.username) ||
    textOf(obj.loginId) ||
    textOf(obj.loginName) ||
    ""
  );
};

const applicantUserNameOf = (item = {}) =>
  textOf(item.applicantUserName) ||
  textOf(item.aplicantUserName) ||
  textOf(item.applicantUsername) ||
  textOf(item.licenseeId) ||
  "";

const applicantNameOf = (item = {}, fallback = "") =>
  textOf(item.applicantName) ||
  textOf(item.aplicantName) ||
  textOf(item.name) ||
  fallback;

const statusOfApplication = (item = {}) =>
  textOf(item.applicationCurrentStatus) ||
  textOf(item.applicationStatus) ||
  textOf(item.status) ||
  "Agency Selection";

const agencyIdOf = (item = {}) => {
  const raw =
    item.auditAgencyId ??
    item.agencyId ??
    item.auditAgency?.auditAgencyId ??
    "";
  if (raw === null || raw === undefined || raw === "") return "";
  return String(raw);
};

const normalizePerson = (value) =>
  textOf(value)
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const namesMatch = (left, right) => {
  const a = normalizePerson(left);
  const b = normalizePerson(right);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
};

const personName = (auditor = {}) => {
  if (typeof auditor === "string") return textOf(auditor);
  return (
    [auditor.salutation, auditor.firstName, auditor.middleName, auditor.lastName]
      .map(textOf)
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || textOf(auditor.auditorName)
  );
};

const matchNamesFor = (auditor, displayName) => {
  const names = new Set();
  if (displayName) names.add(displayName);
  if (auditor && typeof auditor === "object") {
    const shortName = `${textOf(auditor.firstName)} ${textOf(auditor.lastName)}`
      .replace(/\s+/g, " ")
      .trim();
    if (shortName) names.add(shortName);
    if (textOf(auditor.auditorName)) names.add(textOf(auditor.auditorName));
  }
  return Array.from(names);
};

const firstEmail = (agency) => {
  if (Array.isArray(agency?.emailId)) {
    const found = agency.emailId.map((item) => textOf(item?.email || item)).find(Boolean);
    return found || "";
  }
  return textOf(agency?.emailId);
};

const mapPool = async (items, limit, mapper) => {
  if (!items.length) return [];
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const current = cursor;
        cursor += 1;
        try {
          out[current] = await mapper(items[current], current);
        } catch (error) {
          out[current] = null;
        }
      }
    }
  );
  await Promise.all(workers);
  return out;
};

const pullTime = (node) => {
  if (!node || typeof node !== "object") return null;
  for (const field of TIME_FIELDS) {
    if (node[field]) return node[field];
  }
  return null;
};

const pullDetails = (node, fields = REMARK_FIELDS) => {
  if (!node || typeof node !== "object" || Array.isArray(node)) return [];
  const details = [];
  const seen = new Set();
  fields.forEach(([field, label]) => {
    const value = textOf(node[field]);
    if (!value || value.length > 4000 || seen.has(value)) return;
    seen.add(value);
    details.push({ label, text: value });
  });
  return details;
};

const pullActor = (node, fallback = "") => {
  const actor =
    textOf(node?.reviewerUserName) ||
    textOf(node?.createdBy) ||
    textOf(node?.updatedBy) ||
    textOf(node?.auditorName);
  if (!actor || actor.length > 80) return fallback;
  return actor;
};

const pullMeta = (node) => {
  if (!node || typeof node !== "object") return [];
  const meta = [];
  const compliance = textOf(node.compliance) || textOf(node.isCompliant);
  if (compliance) meta.push({ label: "Compliance", text: compliance });
  const reference =
    textOf(node.auditControlId) ||
    textOf(node.controlNo) ||
    textOf(node.auditCriteria) ||
    textOf(node.criteria) ||
    textOf(node.parameter);
  if (reference) {
    const display = reference.includes("-") ? reference.split("-")[0] : reference;
    if (display.length <= 80) meta.push({ label: "Reference", text: display });
  }
  return meta;
};

const collectRemarkRecords = (payload, fields = REMARK_FIELDS) => {
  const records = [];
  const visit = (node, depth) => {
    if (node == null || depth > 4) return;
    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof node !== "object") return;
    const details = pullDetails(node, fields);
    if (details.length) records.push(node);
    Object.values(node).forEach((value) => {
      if (Array.isArray(value)) visit(value, depth + 1);
    });
  };
  visit(payload, 0);
  return records;
};

const AUDITOR_REMARK_FIELDS = [
  ["auditorVerification", "Auditor remarks"],
  ["auditorRemarks", "Auditor remarks"],
  ["remarks", "Remarks"],
  ["remark", "Remarks"],
];

const eventsFromPayload = (payload, { category, title, actor, order, fields }) =>
  collectRemarkRecords(payload, fields).map((node, index) => {
    const reference = textOf(node.auditControlId);
    const controlNo = reference ? reference.split("-")[0] : "";
    return {
      id: `${category}-${order}-${index}`,
      category,
      title: controlNo ? `${title} (${controlNo})` : title,
      actor: pullActor(node, actor),
      rawTime: pullTime(node),
      order: order + index,
      details: pullDetails(node, fields),
      meta: pullMeta(node),
    };
  });

const dedupeEvents = (events) => {
  const seen = new Set();
  return events.filter((event) => {
    const key = [
      event.category,
      event.title,
      (event.details || []).map((item) => item.text).join("|"),
      event.rawTime || "",
    ].join("::");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sortEvents = (events) => {
  const start = events.filter((event) => event.pin === "start");
  const end = events.filter((event) => event.pin === "end");
  const middle = events
    .filter((event) => !event.pin)
    .sort((a, b) => {
      const left = a.rawTime ? new Date(a.rawTime).getTime() : NaN;
      const right = b.rawTime ? new Date(b.rawTime).getTime() : NaN;
      const leftOk = Number.isFinite(left) && left > 0;
      const rightOk = Number.isFinite(right) && right > 0;
      if (leftOk && rightOk && left !== right) return left - right;
      if (leftOk && !rightOk) return -1;
      if (!leftOk && rightOk) return 1;
      return (a.order || 0) - (b.order || 0);
    });
  return [...start, ...middle, ...end];
};

const safe = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    return null;
  }
};

const findAgencyUser = (users, agency) => {
  const agencyId = agency?.auditAgencyId;
  if (agencyId == null) return null;
  const encryptedId = encrypt(agencyId);
  return (
    users.find((user) => user?.userId && encryptedId && user.userId === encryptedId) ||
    users.find((user) => agencyIdOf(user) && agencyIdOf(user) === String(agencyId)) ||
    users.find(
      (user) =>
        textOf(user?.auditAgencyName) &&
        textOf(user.auditAgencyName).toLowerCase() ===
          textOf(agency.auditAgencyName).toLowerCase()
    ) ||
    null
  );
};

const blankApplicant = (userName, extra = {}) => ({
  applicantUserName: userName,
  applicantName: applicantNameOf(extra, userName),
  currentStatus: statusOfApplication(extra),
  initiatedOn: extra.applicationInitiatedOn || extra.created || extra.updated || null,
  auditAgencyId: agencyIdOf(extra),
  auditorNames: [],
  esignStatus: "NONE",
  esignedOn: null,
});

const esignCountOf = (row) =>
  (row.applications || []).filter(
    (item) => item.esignStatus === "COMPLETED" && (item.auditorNamed || row.soleAuditor)
  ).length;

const preferApplicant = (current, next) => {
  const nextStatus = statusOfApplication(next);
  const keepStatus =
    current.currentStatus &&
    current.currentStatus !== "Agency Selection" &&
    nextStatus === "Agency Selection";
  return {
    ...current,
    ...next,
    applicantUserName: current.applicantUserName,
    applicantName:
      next.applicantName && next.applicantName !== current.applicantUserName
        ? next.applicantName
        : current.applicantName || next.applicantName,
    currentStatus: keepStatus ? current.currentStatus : nextStatus || current.currentStatus,
    initiatedOn: current.initiatedOn || next.initiatedOn || null,
    auditorNames:
      next.auditorNames?.length ? next.auditorNames : current.auditorNames || [],
    esignStatus: next.esignStatus || current.esignStatus || "NONE",
    esignedOn: next.esignedOn || current.esignedOn || null,
  };
};

const isEsignComplete = (data = {}) => {
  const status = textOf(data.esignStatus).toUpperCase();
  return status === "COMPLETED" || data.workflowAdvanced === true || Boolean(data.signedDocId);
};

export const esignLabel = (status) => {
  const value = textOf(status).toUpperCase();
  if (value === "COMPLETED") return "eSigned";
  if (value === "PENDING") return "eSign pending";
  if (value === "FAILED") return "eSign failed";
  return "Not eSigned";
};

export async function loadAuditorTracking() {
  const [agencyRes, userRes, selectionRes, applicationRes] = await Promise.all([
    AuditAgency.getAllAuditAgencyList().catch(() => ({ data: [] })),
    AuditAgency.getAuditAgencyList().catch(() => ({ data: [] })),
    AuditService.getAllAuditSelectionList().catch(() => ({ data: [] })),
    ApplicationReviewCommittee.getAllApplication().catch(() => ({ data: [] })),
  ]);

  const agencies = asList(agencyRes);
  const users = asList(userRes);
  const selections = asList(selectionRes);
  const applications = asList(applicationRes);

  const applicationByUser = new Map();
  applications.forEach((item) => {
    const userName = applicantUserNameOf(item);
    if (!userName) return;
    applicationByUser.set(userName, item);
  });

  const agencyBuckets = agencies
    .map((agency) => {
      const user = findAgencyUser(users, agency);
      const agencyStatus = readStatus(agency);
      const userStatus = readStatus(user);
      if (isInactiveStatus(agencyStatus) && !user) return null;
      if (isInactiveStatus(userStatus)) return null;
      if (isInactiveStatus(agencyStatus) && isInactiveStatus(userStatus)) return null;
      if (user && isInactiveStatus(userStatus)) return null;

      const status = !isInactiveStatus(userStatus) && userStatus
        ? userStatus
        : agencyStatus || userStatus || "Active";
      if (isInactiveStatus(status)) return null;

      const userName =
        readLogin(user) ||
        readLogin(agency) ||
        firstEmail(agency) ||
        textOf(agency.auditAgencyName);

      const people = (Array.isArray(agency.auditors) ? agency.auditors : [])
        .map((auditor) => {
          const auditorName = personName(auditor);
          if (!auditorName) return null;
          return {
            auditorName,
            matchNames: matchNamesFor(auditor, auditorName),
          };
        })
        .filter(Boolean);

      const auditorRows = (people.length
        ? people
        : [
            {
              auditorName: textOf(agency.auditAgencyName) || userName || "Auditor",
              matchNames: [textOf(agency.auditAgencyName)].filter(Boolean),
            },
          ]
      ).map((person) => ({
        userName: userName || "-",
        auditorName: person.auditorName,
        matchNames: person.matchNames,
        currentStatus: status || "Active",
        agencyId: agencyIdOf(agency),
        agencyName: textOf(agency.auditAgencyName),
        soleAuditor: people.length <= 1,
        applications: [],
      }));

      return {
        agencyId: agencyIdOf(agency),
        userName,
        auditorRows,
      };
    })
    .filter(Boolean);

  const knownUserNames = Array.from(
    new Set(agencyBuckets.map((bucket) => bucket.userName).filter((name) => name && name !== "-"))
  );

  const assignedLists = await mapPool(knownUserNames, 4, async (userName) => {
    const response = await safe(() =>
      ApplicationReviewCommittee.getAllApplicationForAuditor(userName)
    );
    return { userName, applications: asList(response) };
  });

  const assignedByUser = new Map(
    assignedLists.filter(Boolean).map((item) => [item.userName, item.applications])
  );

  const applicantSeeds = new Map();
  const pushSeed = (userName, source) => {
    if (!userName) return;
    const overlay = applicationByUser.get(userName) || {};
    const next = blankApplicant(userName, {
      ...overlay,
      ...source,
      applicantUserName: userName,
    });
    const existing = applicantSeeds.get(userName);
    applicantSeeds.set(userName, existing ? preferApplicant(existing, next) : next);
  };

  agencyBuckets.forEach((bucket) => {
    selections
      .filter((item) => agencyIdOf(item) && agencyIdOf(item) === bucket.agencyId)
      .forEach((item) => pushSeed(applicantUserNameOf(item), item));
    (assignedByUser.get(bucket.userName) || []).forEach((item) =>
      pushSeed(applicantUserNameOf(item), item)
    );
  });

  const enriched = await mapPool(Array.from(applicantSeeds.values()), 5, async (seed) => {
    const [formRes, esignRes] = await Promise.all([
      safe(() => AuditService.getAuditorApplicationbyApplicatantUserName(seed.applicantUserName)),
      safe(() => AuditService.getAuditEsignStatus(seed.applicantUserName)),
    ]);
    const form = formRes?.data && typeof formRes.data === "object" ? formRes.data : {};
    const auditorNames = (Array.isArray(form.auditorDesscription) ? form.auditorDesscription : [])
      .map((item) => textOf(item?.auditorName))
      .filter(Boolean);
    const esign = esignRes?.data && typeof esignRes.data === "object" ? esignRes.data : {};
    return {
      ...seed,
      auditorNames,
      esignStatus: isEsignComplete(esign) ? "COMPLETED" : textOf(esign.esignStatus) || "NONE",
      esignedOn: esign.esignedOn || esign.signedOn || esign.updated || null,
    };
  });

  const applicants = enriched.filter(Boolean);

  const rows = [];
  agencyBuckets.forEach((bucket) => {
    const selectionApps = selections
      .filter((item) => agencyIdOf(item) && agencyIdOf(item) === bucket.agencyId)
      .map(applicantUserNameOf)
      .filter(Boolean);
    const assignedApps = (assignedByUser.get(bucket.userName) || [])
      .map(applicantUserNameOf)
      .filter(Boolean);
    const userNames = Array.from(new Set([...selectionApps, ...assignedApps]));
    const bucketApplicants = userNames
      .map((userName) => applicants.find((item) => item.applicantUserName === userName))
      .filter(Boolean);

    const rowMatches = (row, applicant) =>
      applicant.auditorNames.some((name) =>
        row.matchNames.some((candidate) => namesMatch(candidate, name))
      );

    bucket.auditorRows.forEach((row) => {
      // Until the undertaking names an auditor, every auditor of the agency
      // can see the application. After names are saved, only those auditors do.
      row.applications = bucketApplicants
        .filter((applicant) => !applicant.auditorNames.length || rowMatches(row, applicant))
        .map((applicant) => ({
          ...applicant,
          auditorNamed: applicant.auditorNames.length > 0,
        }));
      row.esignCount = esignCountOf(row);
      rows.push(row);
    });

    bucketApplicants.forEach((applicant) => {
      applicant.auditorNames.forEach((name) => {
        const matched = bucket.auditorRows.some((row) =>
          row.matchNames.some((candidate) => namesMatch(candidate, name))
        );
        if (matched) return;

        const key = `${bucket.agencyId}::${normalizePerson(name)}`;
        let extra = rows.find((row) => row.extraKey === key);
        if (!extra) {
          extra = {
            extraKey: key,
            userName: bucket.userName || "-",
            auditorName: name,
            matchNames: [name],
            currentStatus: bucket.auditorRows[0]?.currentStatus || "Active",
            agencyId: bucket.agencyId,
            agencyName: bucket.auditorRows[0]?.agencyName || "",
            soleAuditor: false,
            applications: [],
            esignCount: 0,
          };
          rows.push(extra);
        }
        if (!extra.applications.some((item) => item.applicantUserName === applicant.applicantUserName)) {
          extra.applications.push({ ...applicant, auditorNamed: true });
        }
        extra.esignCount = esignCountOf(extra);
      });
    });
  });

  const deduped = [];
  const seenRows = new Set();
  rows.forEach((row) => {
    const key = `${row.userName}::${normalizePerson(row.auditorName)}::${row.agencyId}`;
    if (seenRows.has(key)) {
      const existing = deduped.find(
        (item) =>
          `${item.userName}::${normalizePerson(item.auditorName)}::${item.agencyId}` === key
      );
      if (!existing) return;
      row.applications.forEach((applicant) => {
        const index = existing.applications.findIndex(
          (item) => item.applicantUserName === applicant.applicantUserName
        );
        if (index === -1) existing.applications.push(applicant);
        else existing.applications[index] = preferApplicant(existing.applications[index], applicant);
      });
      existing.soleAuditor = existing.soleAuditor || row.soleAuditor;
      existing.esignCount = esignCountOf(existing);
      return;
    }
    seenRows.add(key);
    deduped.push(row);
  });

  return deduped
    .sort((a, b) => a.auditorName.localeCompare(b.auditorName))
    .map((row, index) => ({
      id: index + 1,
      userName: row.userName || "-",
      auditorName: row.auditorName || "-",
      currentStatus: row.currentStatus || "Active",
      esignCount: esignCountOf(row),
      agencyName: row.agencyName || "-",
      applications: [...row.applications].sort((a, b) =>
        (a.applicantName || "").localeCompare(b.applicantName || "")
      ),
    }));
}

const selectionEvent = (payload, applicant) => {
  const records = Array.isArray(payload) ? payload : payload ? [payload] : [];
  const record =
    records.find((item) => applicantUserNameOf(item) === applicant.applicantUserName) ||
    records[0];
  if (!record) return null;
  const agency =
    textOf(record.auditAgencyName) ||
    textOf(record.name) ||
    applicant.agencyName ||
    "Audit agency";
  return {
    id: "workflow-agency-selection",
    category: "workflow",
    pin: "start",
    title: "Applicant selected the audit agency",
    actor: "Applicant",
    rawTime: pullTime(record) || applicant.initiatedOn || null,
    order: 0,
    details: [{ label: "Audit agency", text: agency }],
    meta: [],
  };
};

const undertakingEvent = (form) => {
  if (!form || typeof form !== "object") return null;
  const names = (Array.isArray(form.auditorDesscription) ? form.auditorDesscription : [])
    .map((item) => textOf(item?.auditorName))
    .filter(Boolean);
  const scopes = (Array.isArray(form.auditScope) ? form.auditScope : [])
    .map((item) => textOf(item?.auditTitle) || textOf(item?.description))
    .filter(Boolean);
  if (!names.length && !textOf(form.undertakingFileName) && !scopes.length) return null;
  const details = [];
  if (names.length) details.push({ label: "Auditors named", text: names.join(", ") });
  if (scopes.length) details.push({ label: "Audit scope", text: scopes.join("; ") });
  if (textOf(form.undertakingFileName)) {
    details.push({ label: "Undertaking", text: textOf(form.undertakingFileName) });
  }
  return {
    id: "workflow-undertaking",
    category: "workflow",
    title: "Undertaking and auditor details recorded",
    actor: "Auditor",
    rawTime: pullTime(form),
    order: 20,
    details,
    meta: [],
  };
};

const esignEvent = (esign, signed) => {
  const data = esign && typeof esign === "object" ? esign : {};
  const signedData = signed && typeof signed === "object" ? signed : {};
  const completed = isEsignComplete({ ...signedData, ...data });
  const status = completed ? "COMPLETED" : textOf(data.esignStatus) || "NONE";
  const title =
    status === "COMPLETED"
      ? "Audit report eSigned by the auditor"
      : status === "FAILED"
        ? "Audit report eSign failed"
        : status === "PENDING"
          ? "Audit report eSign is pending"
          : "Audit report is not eSigned yet";
  const details = [{ label: "eSign status", text: esignLabel(status) }];
  if (completed) details.push({ label: "Outcome", text: "Auditor eSign is complete for this audit report." });
  return {
    id: "esign-status",
    category: "esign",
    pin: "end",
    title,
    actor: "Auditor",
    rawTime: data.esignedOn || data.signedOn || data.updated || signedData.updated || null,
    order: 900,
    details,
    meta: [],
  };
};

export async function loadApplicantAuditHistory(applicant) {
  const userName = applicant?.applicantUserName;
  if (!userName) {
    return { events: [], error: "Applicant username is missing." };
  }

  const [
    selectionRes,
    formRes,
    criteriaRes,
    remarksRes,
    auditorReviewRes,
    annexureMainRes,
    ncReportRes,
    shortComingRes,
    shortReportRes,
    actionRes,
    esignRes,
    signedRes,
  ] = await Promise.all([
    safe(() => AuditService.getAllAuditSelectionByUsername(userName)),
    safe(() => AuditService.getAuditorApplicationbyApplicatantUserName(userName)),
    safe(() => AuditService.getByApplicantUserNames(userName)),
    safe(() => AuditService.viewRemarks(userName)),
    safe(() => AuditService.getByAllAuditorRemarksByApplicantUserName(userName)),
    safe(() => AnnexureService.getAnnexureMainByUsername(userName)),
    safe(() => AuditService.auditNCReport(userName)),
    safe(() => AuditService.getAllShortComming(userName)),
    safe(() => AuditService.getByAllShortCommingReportApplicantUserName(userName)),
    safe(() => AuditService.getByApplicantActionTaken(userName)),
    safe(() => AuditService.getAuditEsignStatus(userName)),
    safe(() => AuditService.getEsignedDocumentId(userName)),
  ]);

  const annexureSections = await mapPool(ANNEXURE_SECTIONS, 6, async (section) => {
    const response = await safe(() =>
      AnnexureService.getAuditorVerification({ userName, apiNum: section.apiNum })
    );
    return { section, payload: response?.data };
  });

  const events = [];
  const selection = selectionEvent(selectionRes?.data, applicant);
  if (selection) events.push(selection);
  else {
    events.push({
      id: "workflow-open",
      category: "workflow",
      pin: "start",
      title: "Audit workflow is open for this applicant",
      actor: "Applicant",
      rawTime: applicant.initiatedOn || null,
      order: 0,
      details: [
        {
          label: "Current status",
          text: applicant.currentStatus || "Agency selection",
        },
      ],
      meta: [],
    });
  }

  const form = formRes?.data;
  const undertaking = undertakingEvent(form);
  if (undertaking) events.push(undertaking);

  events.push(
    ...eventsFromPayload(criteriaRes?.data, {
      category: "audit",
      title: "Audit application review",
      actor: "Auditor",
      order: 100,
    }),
    ...eventsFromPayload(remarksRes?.data, {
      category: "audit",
      title: "Audit application remarks",
      actor: "Auditor",
      order: 140,
    }),
    ...eventsFromPayload(auditorReviewRes?.data, {
      category: "audit",
      title: "Auditor review on the audit report",
      actor: "Auditor",
      order: 180,
    })
  );

  const annexureMain = annexureMainRes?.data;
  if (annexureMain && typeof annexureMain === "object") {
    const tracker = textOf(annexureMain.auditorTracker);
    if (tracker) {
      events.push({
        id: "annexure-progress",
        category: "annexure",
        title: "Annexure A-2 verification progress",
        actor: "Auditor",
        rawTime: pullTime(annexureMain),
        order: 200,
        details: [
          {
            label: "Sections verified",
            text:
              tracker === "NOT FOUND"
                ? "Annexure A-2 has not been verified yet."
                : `${tracker} of 18 sections recorded`,
          },
        ],
        meta: [],
      });
    }
  }

  annexureSections.filter(Boolean).forEach(({ section, payload }) => {
    events.push(
      ...eventsFromPayload(payload, {
        category: "annexure",
        title: `Annexure A-2 — ${section.title}`,
        actor: "Auditor",
        order: 220 + Number(section.apiNum),
        fields: AUDITOR_REMARK_FIELDS,
      })
    );
  });

  events.push(
    ...eventsFromPayload(ncReportRes?.data, {
      category: "nc",
      title: "NC report",
      actor: "Auditor",
      order: 400,
    }),
    ...eventsFromPayload(shortComingRes?.data, {
      category: "nc",
      title: "NC list review",
      actor: "Auditor",
      order: 440,
    }),
    ...eventsFromPayload(shortReportRes?.data, {
      category: "nc",
      title: "NC shortcoming report",
      actor: "Reviewer",
      order: 480,
    }),
    ...eventsFromPayload(actionRes?.data, {
      category: "nc",
      title: "Applicant response on NC",
      actor: "Applicant",
      order: 520,
    })
  );

  events.push(esignEvent(esignRes?.data, signedRes?.data));

  return {
    events: sortEvents(dedupeEvents(events)),
    error: "",
  };
}
