import AuthService from '../../../service/AuthService/AuthService';
import IntentService from '../../../service/AdminService/IntentService';
import ApplicationForm from '../../../service/NewLicenseService/ApplicationForm';

export const trimPart = (value) => (value == null ? '' : String(value).trim());

export const buildFullName = ({
  salutation,
  firstName,
  middleName,
  lastName,
  organizationName,
} = {}) => {
  const coreName = [firstName, middleName, lastName]
    .map(trimPart)
    .filter(Boolean)
    .join(' ')
    .trim();

  if (coreName) {
    const sal = trimPart(salutation);
    return sal ? `${sal} ${coreName}` : coreName;
  }

  return trimPart(organizationName);
};

export const isSalutationOnly = (name) =>
  /^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s*$/i.test(trimPart(name));

const extractNameFromApplication = (data) => {
  if (!data) {
    return null;
  }

  const app = data.application;
  if (app) {
    return {
      salutation: app.salutation1,
      firstName: app.firstName1,
      middleName: app.middleName1,
      lastName: app.lastName1,
    };
  }

  const govt = data.appGovtOrganizationApplication;
  if (govt) {
    return {
      salutation: govt.salutation,
      firstName: govt.firstName,
      middleName: govt.middleName,
      lastName: govt.lastName,
      organizationName: govt.orgName,
    };
  }

  const firm = data.appFirmApplication;
  if (firm) {
    return {
      salutation: firm.salutation,
      firstName: firm.firstName,
      middleName: firm.middleName,
      lastName: firm.lastName,
      organizationName: firm.officeName,
    };
  }

  return null;
};

const mergeNameFields = (profile, nameSource) => {
  if (!nameSource) {
    return profile;
  }

  return {
    ...profile,
    salutation: nameSource.salutation || profile.salutation,
    firstName: nameSource.firstName || profile.firstName,
    middleName: nameSource.middleName || profile.middleName,
    lastName: nameSource.lastName || profile.lastName,
    organizationName: nameSource.organizationName || profile.organizationName,
  };
};

export const resolveApplicantDisplayName = async (username) => {
  const profile = await resolveProfileDetails(username);
  return buildFullName(profile) || username;
};

export const resolveProfileDetails = async (username) => {
  let profile = { userName: username };

  try {
    const loginResponse = await AuthService.getUserLoginByUsername(username);
    profile = { ...profile, ...loginResponse.data };
    if (trimPart(profile.firstName)) {
      return profile;
    }
  } catch {
    // fall through to intent/application sources
  }

  try {
    const intentResponse = await IntentService.getIntentByUserName(username);
    profile = mergeNameFields(profile, intentResponse.data);
    if (trimPart(profile.firstName) || trimPart(profile.organizationName)) {
      return profile;
    }
  } catch {
    // fall through
  }

  try {
    const applicationResponse = await ApplicationForm.getApplicationFormByUsername(username);
    profile = mergeNameFields(profile, extractNameFromApplication(applicationResponse.data));
  } catch {
    // return best available profile
  }

  return profile;
};
