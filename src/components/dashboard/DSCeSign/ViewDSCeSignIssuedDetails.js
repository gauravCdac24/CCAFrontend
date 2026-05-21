import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DashboardService from "../../../service/DashboardService/DashboardService";
import LoaderProgress from "../../global/common/LoaderProgress";
import StateService from "../../../service/AdminService/StateService";
import { decrypt } from "../../global/util/EncryptDecrypt";

const ViewDSCeSignIssuedDetails = ({ year, month }) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stateList, setStateList] = useState([]);
  

  const getDSCeSignIssued = async () => {
    try {
      setLoading(true);

      const [response, states] = await Promise.all([
                            DashboardService.getAllDSCeSignIssuedByYearMonthAndUsername(
                                month,
                                year
                            ),
                              StateService.getAllStateList()
                          ]);

                    setStateList(states.data);

                    const list = response.data.map((obj, index) => {
                        obj['id'] = index + 1;
                        
                        const decryptedStateId = parseInt(decrypt(obj.stateId), 10);
                        const state = states.data.find((e) => e.stateId === decryptedStateId);
                        obj['state'] = state ? state.stateName : '-'; 
                        return obj;
                    });

                        setData(list);




    } catch (err) {
      console.error("Error fetching DSC and eSign issued details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDSCeSignIssued();
  }, []); 

  return (
    <>
      <LoaderProgress open={isLoading} />

      <Box sx={{margin: "0 auto", padding: "20px" }}>
        {data.length > 0 ? (
          <Box>
            <TableContainer>
                <Table sx={{border:  0.5, borderColor: 'grey.500' }}>
                <TableHead>
                    <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                    <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Sl. No.</TableCell>
                    <TableCell sx={{border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>State</TableCell>
                    <TableCell sx={{border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>eSign Issued</TableCell>
                    <TableCell sx={{border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>DSC Issued</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{item.id}</TableCell>
                        <TableCell sx={{border:  0.5, borderColor: 'grey.500' }}>{item.state}</TableCell>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{item.eSignIssued}</TableCell>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{item.dscIssued}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body2">
            No records found for the selected month and year.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ViewDSCeSignIssuedDetails;
