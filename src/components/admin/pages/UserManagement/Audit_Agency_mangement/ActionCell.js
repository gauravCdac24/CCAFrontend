import { useState, useEffect } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PreviewIcon from '@mui/icons-material/Preview';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import AuditAgency from '../../../../../service/AdminService/AuditAgency';

const ActionCell = ({ auditAgencyId, params, ViewssAuditAgencyDetails, AuditAgencysDetails }) => {
    const [showPreviewIcon, setShowPreviewIcon] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const statusResponse = await AuditAgency.getAuditAgencyList();
                const encryptedAuditAgencyId = encrypt(auditAgencyId);

                // Check if the userId matches the encryptedAuditAgencyId
                const matchingStatus = statusResponse.data.find(item => item.userId === encryptedAuditAgencyId);

                if (matchingStatus) {
                    setShowPreviewIcon(true); // Show the PreviewIcon if there is a match
                } else {
                    setShowPreviewIcon(false); // Otherwise, don't show it
                }
            } catch (err) {
                console.error('Error fetching audit agency status:', err);
            }
        };

        fetchStatus();
    }, [auditAgencyId]);

    return (
        <>
            {showPreviewIcon ? (
                <Tooltip title="View">
                    <GridActionsCellItem
                        icon={<PreviewIcon color="info" />}
                        label="Edit"
                        onClick={() => AuditAgencysDetails(params.id)}
                    />
                </Tooltip>
            ) : (
                <GridActionsCellItem
                    icon={<VisibilityIcon color="success" />}
                    label="View"
                    onClick={() => ViewssAuditAgencyDetails(params.id)}
                />
            )}
        </>
    );
};

export default ActionCell;
