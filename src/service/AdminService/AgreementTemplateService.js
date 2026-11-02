import API from '../../api/ApplicationAPI';
import { encrypt } from "../../components/global/util/EncryptDecrypt";

const ADMIN_SERVICE = "/admin-service";
const ADD = "/add-agreement-template";
const UPDATE = "/update-agreement-template";
const GET_ALL = "/get-all-agreement-template";
const GET_ALL_ACTIVE = "/get-all-active-agreement-template";
const GET_BY_ID = "/get-agreement-template-by-id";
const CHANGE_STATUS = "/change-agreement-template-status";
const DELETE_BY_ID = "/delete-agreement-template-by-id";
const DOWNLOAD = "/download-agreement-template";

const config = {
    headers: {
        'content-type': 'multipart/form-data',
    }
};

const downloadConfig = {
    headers: {
        'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob',
};

const addTemplate = (obj) => {
    return API.post(ADMIN_SERVICE + ADD, obj, config);
};

const updateTemplate = (obj) => {
    return API.post(ADMIN_SERVICE + UPDATE, obj, config);
};

const getAllTemplates = () => {
    return API.get(ADMIN_SERVICE + GET_ALL);
};

const getAllActiveTemplates = () => {
    return API.get(ADMIN_SERVICE + GET_ALL_ACTIVE);
};

const getTemplateById = (id) => {
    return API.get(ADMIN_SERVICE + GET_BY_ID, {
        params: {
            id: encrypt(id)
        }
    });
};

const changeStatus = (id) => {
    return API.get(ADMIN_SERVICE + CHANGE_STATUS, {
        params: {
            id: encrypt(id)
        }
    });
};

const deleteTemplate = (id) => {
    return API.get(ADMIN_SERVICE + DELETE_BY_ID, {
        params: {
            id: encrypt(id)
        }
    });
};

const downloadFile = (id, activeOnly = false) => {
    return API.get(ADMIN_SERVICE + DOWNLOAD, {
        params: {
            id: encrypt(id),
            activeOnly
        },
        ...downloadConfig
    });
};

const downloadActiveTemplate = async () => {
    const listResponse = await getAllActiveTemplates();
    const templates = Array.isArray(listResponse.data) ? listResponse.data : [];
    const active = templates.find((item) => item.status === 'Active') || templates[0];
    if (!active) {
        const error = new Error('No active agreement template is available.');
        error.isTemplateMissing = true;
        throw error;
    }
    const fileResponse = await downloadFile(active.templateId, true);
    return {
        data: fileResponse.data,
        contentType: fileResponse.headers['content-type'],
        fileName: active.fileName
    };
};

export default {
    addTemplate,
    updateTemplate,
    getAllTemplates,
    getAllActiveTemplates,
    getTemplateById,
    changeStatus,
    deleteTemplate,
    downloadFile,
    downloadActiveTemplate,
};
