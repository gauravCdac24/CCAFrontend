import { useState, useEffect} from "react";
import AnimatedNumbers from "react-animated-numbers";
import Box from '@mui/material/Box';

//Mui Icons
import RegisteredUserIcon from '@mui/icons-material/AccountCircle';
import VerifiedUserIcon from '@mui/icons-material/Person';
import DSCIssuedIcon from '@mui/icons-material/CollectionsBookmark';
import EsignIssuedIcon from '@mui/icons-material/Style';

import {IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Grid from '@mui/material/Grid2';


import DashboardService from "../../../../service/DashboardService/DashboardService";
import LoaderProgress from "../../../global/common/LoaderProgress";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StateService from "../../../../service/AdminService/StateService";
import CustomMultiselect from "../../../global/util/CustomMultiselect";
import { encrypt } from "../../../global/util/EncryptDecrypt";
import CustomBarChart from "../../Util/CustomBarChart";
import CustomPieChart from "../../Util/CustomPieChart";
import CustomAreaChart from "../../Util/CustomAreaChart";
import CustomAreaBrushChart from "../../Util/CustomAreaBrushChart";
import { timeStampToDate } from "../../../global/util/TimestampConverter";
import EKYCModeService from "../../../../service/AdminService/EKYCModeService";


const AdminDashboard = () =>{

    const [infoList, setInfoList] = useState({
        totalCA: 0,
        totalDSCIssued: 0,
        totalESP: 0,
        totaleSignIssued: 0

      });
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [caList, setCaList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ekycModes, setEkycModes] = useState([]);

    //filter
    const [selectedYear, setSelectedYear] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState([]);
    const [selectedState, setSelectedState] = useState([]);
    const [selectedCA, setSelectedCA] = useState([]);

    //graphs

    const [graphData, setGraphData] = useState({
      "years": [],
      "yearwise": [
          {
              "name": "DSC Issued",
              "data": []
          },
          {
              "name": "eSign Issued",
              "data": []
          }
      ],
      "months": [],
      "monthwise": [
          {
              "name": "DSC Issued",
              "data": []
          },
          {
              "name": "eSign Issued",
              "data": []
          }
      ],
      "states": [],
      "statewise": [
          {
              "name": "DSC Issued",
              "data": []
          },
          {
              "name": "eSign Issued",
              "data": []
          }
      ],
      "ca": [],
      "cawise": [
          {
              "name": "DSC Issued",
              "data": []
          },
          {
              "name": "eSign Issued",
              "data": []
          }
      ],
      "cayoflicensing": [],
      "espEkycModeApproved": []
  });


    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);
    const navigate = useNavigate();

    const getAllEKYCMode = async () => {

      try{
        const response = await EKYCModeService.getAllEKYCMode();
        setEkycModes(response.data);
      }catch(err){

      }
  };


    const getYearList = ()=>{
      
      const uyearlist = [];

        for (let i = new Date().getFullYear(); i >= 2025; i--) {
          uyearlist.push({label: i.toString(), value: i.toString()});
        }
        setYearList(uyearlist);
    }


    const getCAList = async () => {
    
            try{
                const response = await DashboardService.getAllActiveCA();
                const list = response?.data?.map((obj, index) => {
                  return{
                    label: obj.licenseName,
                    value: obj.userName
                  }
              }) || [];
                setCaList(list);
            }catch(err){
    
            }
        }
    


    const getMonthList = () => {

      const months = [
        {label: 'January', value: 'January'},
        {label: 'February', value: 'February'},
        {label: 'March', value: 'March'},
        {label: 'April', value: 'April'},
        {label: 'May', value: 'May'},
        {label: 'June', value: 'June'},
        {label: 'July', value: 'July'},
        {label: 'August', value: 'August'},
        {label: 'September', value: 'September'},
        {label: 'October', value: 'October'},
        {label: 'November', value: 'November'},
        {label: 'December', value: 'December'},
      ]
      setMonthList(months);
    }


  const getStateList = async() => {
        
    try {
      const states = await StateService.getAllStateList();
                    
      const filteredStates = states.data.filter(
        state => state.countryId.countryName === 'India'
      );

      const list = filteredStates?.map((obj, index) => {
        return{
          label: obj.stateName,
          value: encrypt(obj.stateId)
        }
      }) || [];

      setStateList(list);

      } catch (err) {
                                    
      }
        
     }


     const getInfoData = () => {
      setIsLoading(true);
      DashboardService.getCCADashboardDetails()
      .then((response)=>{

        setInfoList(response.data);
        setIsLoading(false);

      })
      .catch((err)=>{

      })
      .finally(()=>{
        setIsLoading(false);
      })

    }

    const getGraphDataEsignDSC = async () => {
      
      const obj = {
        selectedCA: btoa(decodeURIComponent(encodeURIComponent(selectedCA))),
        selectedMonth: btoa(decodeURIComponent(encodeURIComponent(selectedMonth))),
        selectedState: btoa(decodeURIComponent(encodeURIComponent(selectedState))),
        selectedYear: btoa(decodeURIComponent(encodeURIComponent(selectedYear)))
      };
    

      try{
          const response = await DashboardService.getGraphDataEsignDSC(obj);
          setGraphData(response.data);
        }
      catch(err){

      }
    };
    


    useEffect(()=>{
      getAllEKYCMode();
      getInfoData();
      getYearList();
      getMonthList();
      getCAList();
      getStateList();
      getGraphDataEsignDSC();
    }, [])


    useEffect(()=>{
      getGraphDataEsignDSC();
    },[selectedCA, selectedMonth, selectedState, selectedYear])


    useEffect(() => {
    const intervalId = setInterval(() => {
      getInfoData();
    }, 5000);
    return () => clearInterval(intervalId);
    }, []);
    
    
    const navigateToRegisteredCA = () => {
      navigate(`${rolePath}/admindashboard/registeredca`);
    }
    const navigateToRegisteredESP = () => {
      navigate(`${rolePath}/admindashboard/registeredesp`);
    }
    const navigateToDSCIssued = () => {
      navigate(`${rolePath}/admindashboard/dscissued`);
    }
    const navigateToeSignIssued = () => {
      navigate(`${rolePath}/admindashboard/esignissued`);
    }


    return(
        <>

          {/* <LoaderProgress open={isLoading} /> */}

            {/* Dashboard */}
            
            <Box component="div" sx={{m: 1, color: 'infobox.text', flexGrow: 1, fontSize: '16px'}} >


                {/* Info Box */}


          <Grid container spacing={1} >
							<Grid  size={{ xs: 12, sm: 12, md: 'grow' }} sx={{backgroundColor: 'infobox.color1', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:3,
                                      m:1,
                                      cursor: 'pointer',
                                      '&:hover': {
                                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset'
                                      }
                                      }}
                                      onClick={navigateToRegisteredCA}
                                      >
								<Grid container>
									<Grid>
                      <IconButton aria-label="icon">
                          <RegisteredUserIcon sx={{fontSize: '40px'}} color="primary"/>
                      </IconButton>
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Registered CA</Grid>
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {/* <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                        type: "spring",
                        duration: index + 5,
                        
                        })}
                        animateToNumber={infoList?.totalCA || 0}
                                                        
                    /> */}
                    {infoList?.totalCA || 0}
                  </Grid>
                </Grid>
              </Grid>
						</Grid>
					</Grid>

          <Grid    size={{ xs: 12, sm: 12, md: 'grow' }} sx={{backgroundColor: 'infobox.color2', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:3,
                                      m:1,
                                      cursor: 'pointer',
                                      '&:hover': {
                                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset'
                                      }
                                      }}
                                      onClick={navigateToRegisteredESP}>
								<Grid container>
									<Grid>
                      <IconButton aria-label="icon">
                          <VerifiedUserIcon sx={{fontSize: '40px'}} color="primary"/>
                      </IconButton>
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Registered ESP</Grid>
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {/* <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                        type: "spring",
                        duration: index + 5,
                        })}
                        animateToNumber={infoList?.totalESP || 0}
                                                        
                    /> */}
                    {infoList?.totalESP || 0}
                  </Grid>
                </Grid>
              </Grid>
						</Grid>
					</Grid>
						

          <Grid   size={{ xs: 12, sm: 12, md: 'grow' }} sx={{backgroundColor: 'infobox.color3', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:3,
                                      m:1,
                                      cursor: 'pointer',
                                      '&:hover': {
                                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset'
                                      }
                                      }}
                                      onClick={navigateToDSCIssued}>
								<Grid container>
									<Grid>
                      <IconButton aria-label="icon">
                          <DSCIssuedIcon sx={{fontSize: '40px'}} color="primary"/>
                      </IconButton>
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Total DSCs Issued</Grid>
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {/* <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                        type: "spring",
                        duration: index + 5,
                        })}
                        animateToNumber={infoList?.totalDSCIssued || 0}
                                                        
                    /> */}
                    {infoList?.totalDSCIssued || 0}
                  </Grid>
                </Grid>
              </Grid>
						</Grid>
					</Grid>
                        
					<Grid   size={{ xs: 12, sm: 12, md: 'grow' }} sx={{backgroundColor: 'infobox.color4', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:3,
                                      m:1,
                                      cursor: 'pointer',
                                      '&:hover': {
                                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset'
                                      }
                                      }}
                                      onClick={navigateToeSignIssued}>
								<Grid container>
									<Grid >
                      <IconButton aria-label="icon">
                          <EsignIssuedIcon sx={{fontSize: '40px'}} color="primary"/>
                      </IconButton>
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Total eSign Issued</Grid>
                      <Grid  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {/* <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                        type: "spring",
                        duration: index + 5,
                        })}
                        animateToNumber={infoList?.totaleSignIssued || 0}
                                                        
                    /> */}
                    {infoList?.totaleSignIssued || 0}
                  </Grid>
                </Grid>
              </Grid>
						</Grid>
					</Grid>		
						

		</Grid>


  {/* Info Box End */}

  {/* Charts */}


  <Grid container spacing={1} sx={{color: '#000000'}}>
    <Grid    size={{ xs: 12, sm: 12, md: 'grow' }} sx={{boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', m: 1, borderRadius: '4px'}}>
      
          <CustomBarChart series={[{
            data: [infoList.totalCA, infoList.totalESP, infoList.totalDSCIssued, infoList.totaleSignIssued]
          }]} 
                    categories={['Registered CA', 'Registered ESP', 'Total DSCs Issued', 'Total eSign Issued']}  
                    height={400} 
                    id="ccabar1"
                    distributed={true}
                    />
        
    </Grid>

    <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', m: 1, borderRadius: '4px'}}> 
      
          <CustomPieChart 
              series={[infoList.totalCA, infoList.totalESP, infoList.totalDSCIssued, infoList.totaleSignIssued]} 
              categories={['Registered CA', 'Registered ESP', 'Total DSCs Issued', 'Total eSign Issued']} 
              height={400} 
              id="ccapie2"
              legend={true}
              type="donut"
              />
        
    </Grid>
  </Grid>

  {/* Charts End */}




  {
                  /*  

                  Filter Code

                  */
                }

                <Grid container sx={{boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
                    backgroundColor: 'primary.main',
                    borderRadius: '10px',
                    mt: 2,
                    mb: 2
                }}>

                <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m:1}}>
                    <Box sx={{color: '#FFFFFF'}}>Select Year:</Box>
                    <Box>
                        <CustomMultiselect 
                              items={yearList}
                              label=""
                              placeholder="Select Year"
                              selectAllLabel="Select All"
                              onChange={setSelectedYear}
                              selectAllByDefault = {true}
                        />
                    </Box>

                  </Grid>


                  <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m:1}}>
                    <Box sx={{color: '#FFFFFF'}}>Select Month:</Box>
                    <Box>
                        <CustomMultiselect 
                              items={monthList}
                              label=""
                              placeholder="Select Month"
                              selectAllLabel="Select All"
                              onChange={setSelectedMonth}
                              selectAllByDefault = {true}
                        />
                    </Box>

                  </Grid>


                  <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m:1}}>
                    <Box sx={{color: '#FFFFFF'}}>Select State:</Box>
                    <Box>
                        <CustomMultiselect 
                              items={stateList}
                              label=""
                              placeholder="Select State"
                              selectAllLabel="Select All"
                              onChange={setSelectedState}
                              selectAllByDefault = {true}
                        />
                    </Box>

                  </Grid>
  
                  <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m:1}}>
                    <Box sx={{color: '#FFFFFF'}}>Select CA:</Box>
                    <Box>
                        <CustomMultiselect 
                              items={caList}
                              label=""
                              placeholder="Select CA"
                              selectAllLabel="Select All"
                              onChange={setSelectedCA}
                              selectAllByDefault = {true}
                        />
                    </Box>

                  </Grid>
  
                </Grid>




                <Grid container >

                    <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>DSC and eSign Issuances by Year</Box>
                        <Box sx={{color: "#000000"}}>
                          <CustomAreaChart series={[...graphData.yearwise]} categories={[...graphData.years]}   id="ccad1" legend={true}/>
                          {/* <CustomAreaBrushChart series={[...graphData.yearwise]} categories={[...graphData.years]}   id="ccad1" /> */}
                        </Box>
                    </Box>

                      
                          
                    </Grid>
                    

                    <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>DSC and eSign Issuances by Months</Box>
                        <Box sx={{color: "#000000"}}>
                          <CustomBarChart 
                            series={[...graphData.monthwise]} 
                            categories={[...graphData.months]} 
                            filltype="horizontal" 
                            colors={['#9013FE', '#feb45f']} 
                            id="ccad2" 
                            stacked={true} 
                            legend={true}
                            height={530} 
                            horizontal={true}
                            />
                        </Box>
                    </Box>  
                    </Grid>
                    </Grid>




                <Grid container >
                    <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>DSC and eSign Issuances by CA</Box>
                        <Box sx={{color: "#000000"}}>     
                          <CustomAreaChart series={[...graphData.cawise]} categories={[...graphData.ca]} colors={['#e6ca43', '#E91E63']} id="ccad3" legend={true}/>
                          {/* <CustomAreaBrushChart series={[...graphData.cawise]} categories={[...graphData.ca]} colors={['#e6ca43', '#E91E63']} id="ccad3"/> */}
                        </Box>
                    </Box>    
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 'grow' }} sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>DSC and eSign Issuances by State</Box>
                        <Box sx={{color: "#000000"}}>
                            <CustomAreaChart series={[...graphData.statewise]} categories={[...graphData.states]} colors={['#008B8B', '#F44336']} id="ccad4" legend={true}/>
                            {/* <CustomAreaBrushChart series={[...graphData.statewise]} categories={[...graphData.states]} colors={['#008B8B', '#F44336']} id="ccad4"/> */}
                        </Box>
                    </Box>     
                    </Grid>

                </Grid>


                <Grid container >
                    <Grid size={{ xs: 12, sm: 12, md: "grow" }} sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>CA With Year of Licensing</Box>
                        <Box sx={{color: "#000000", overflowY: 'scroll', height: '500px'}}>     
                          
                          {
                            graphData?.cayoflicensing.map((item, index)=>(
                              <Box key={item.caName || index} sx={{m: 3}}>
                                <Box sx={{m: 2}}><b>{index+1}.{" "}{item.caName}</b></Box>

                                <TableContainer>
                                    <Table sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px' }}>Sl. No.</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Date of grant of Licence</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>Licence Valid upto</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>License Number</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {item?.caLicense.map((e, i) => (
                                            <TableRow key={e?.certificateNumber || `${item.caName}-${i}`}>
                                              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{i + 1}</TableCell>
                                              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{e.validFrom ? timeStampToDate(e.validFrom) : "-"}</TableCell>
                                              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{e.validTo ? timeStampToDate(e.validTo) : "-"}</TableCell>
                                              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{e?.certificateNumber || "-"}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                              </Box>
                            ))
                          }

                        </Box>
                    </Box>    
                    </Grid>


                    <Grid size={{ xs: 12, sm: 12, md: "grow" }} sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>ESP-wise approval of eKYC modes</Box>
                        <Box sx={{color: "#000000", height: '500px'}}>     
                        
                              <Box sx={{m: 3}}>
                               

                                <TableContainer>
                                    <Table sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px' }}>Sl. No.</TableCell>
                                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '200px' }}>ESP Name</TableCell>

                                                {
                                                  ekycModes?.map((es, index)=>(
                                                    <TableCell key={index} sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>{es.ekycModeTitle}</TableCell>
                                                  ))
                                                }
                                                
                                                
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {graphData?.espEkycModeApproved.map((eg, i) => (
                                            <TableRow key={eg.espUserName || i}>
                                              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{i + 1}</TableCell>
                                              <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{eg.espUserName}</TableCell>
                                              {ekycModes?.map((einner, index) => (
                                                <TableCell
                                                  key={einner.ekycModeId || index}
                                                  sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}
                                                >
                                                  {eg?.ekycModeApproved?.indexOf(encrypt(einner.ekycModeId)) > -1 ? "Yes" : "No"}
                                                </TableCell>
                                              ))}
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                              </Box>
                            
                          

                        </Box>
                    </Box>    
                    </Grid>


                </Grid>





  </Box>

  {/* Dashboard End */}
        
        </>
    )

}

export default AdminDashboard;