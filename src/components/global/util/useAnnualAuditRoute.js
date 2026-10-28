import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    parseAnnualAuditRouteId,
    setAnnualAuditScheduleId,
    clearAnnualAuditScheduleId,
} from './annualAuditSchedule';

export const useAnnualAuditRoute = () => {
    const { id } = useParams();
    const { userName, auditScheduleId } = parseAnnualAuditRouteId(id);

    useEffect(() => {
        if (auditScheduleId) {
            setAnnualAuditScheduleId(auditScheduleId);
        }
        return () => {
            if (auditScheduleId) {
                clearAnnualAuditScheduleId();
            }
        };
    }, [auditScheduleId]);

    return { userName, auditScheduleId };
};

export default useAnnualAuditRoute;
