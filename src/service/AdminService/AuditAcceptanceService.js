import API from '../../api/ApplicationAPI';
import { encrypt } from "../../components/global/util/EncryptDecrypt";

const ADMIN_SERVICE = "/admin-service";
const ADD = "/add-audit-acceptance";
const UPDATE = "/update-audit-acceptance";
const GET_ALL = "/get-all-audit-acceptance";
const GET_ALL_ACTIVE = "/get-all-active-audit-acceptance";
const GET_BY_ID = "/get-audit-acceptance-by-id";
const CHANGE_STATUS = "/change-audit-acceptance-status";
const DELETE_BY_ID = "/delete-audit-acceptance-by-id";
const DOWNLOAD = "/download-audit-acceptance";

const downloadConfig = {
    headers: {
        'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob',
};

const encryptIdParam = (id) => encrypt(String(id));

const addDocument = (obj) => {
    return API.post(ADMIN_SERVICE + ADD, obj);
};

const updateDocument = (obj) => {
    return API.post(ADMIN_SERVICE + UPDATE, obj);
};

const getAllDocuments = () => {
    return API.get(ADMIN_SERVICE + GET_ALL);
};

const getAllActiveDocuments = () => {
    return API.get(ADMIN_SERVICE + GET_ALL_ACTIVE);
};

const getById = (id) => {
    return API.get(ADMIN_SERVICE + GET_BY_ID, {
        params: {
            id: encryptIdParam(id),
        },
    });
};

const changeStatus = (id) => {
    return API.get(ADMIN_SERVICE + CHANGE_STATUS, {
        params: {
            id: encryptIdParam(id),
        },
    });
};

const deleteDocument = (id) => {
    return API.get(ADMIN_SERVICE + DELETE_BY_ID, {
        params: {
            id: encryptIdParam(id),
        },
    });
};

const downloadFile = (id, activeOnly = false) => {
    return API.get(ADMIN_SERVICE + DOWNLOAD, {
        params: {
            id: encryptIdParam(id),
            activeOnly: activeOnly ? true : undefined,
        },
        ...downloadConfig,
    });
};

export default {
    addDocument,
    updateDocument,
    getAllDocuments,
    getAllActiveDocuments,
    getById,
    changeStatus,
    deleteDocument,
    downloadFile,
};
