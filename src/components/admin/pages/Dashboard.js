import { useState, useEffect} from "react";
import AnimatedNumbers from "react-animated-numbers";
import Chart from "react-apexcharts";
import { MultiSelect } from "react-multi-select-component";
import Box from '@mui/material/Box';

//Mui Icons
import RegisteredUserIcon from '@mui/icons-material/AccountCircle';
import VerifiedUserIcon from '@mui/icons-material/Person';
import CAIcon from '@mui/icons-material/School';
import ESPIcon from '@mui/icons-material/AutoAwesomeMosaic';
import DSCIssuedIcon from '@mui/icons-material/CollectionsBookmark';
import EsignIssuedIcon from '@mui/icons-material/Style';
import { Grid, IconButton } from "@mui/material";

const Dashboard = () =>{

   
    const [selectedYear, setSelectedYear] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState([]);
    const [selectedCA, setSelectedCA] = useState([]);
    const [selectedState, setSelectedState] = useState([]);

    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [caList, setCAList] = useState([
        {label: 'C-DAC', value: '1'},
    ]);
    const [stateList, setStateList] = useState([
        {label: 'Delhi', value: '1'},
        {label: 'Bihar', value: '1'},
        {label: 'Rajasthan', value: '1'},
    ]);

    const [infoList, setInfoList] = useState({
      totalRegisteredUsers: 40,
      totalVerifiedUsers: 30,
      totalCA: 30,
      totalESP: 20,
      totalDSCIssued: 130,
      totalEsignIssued: 90,
  });

  const [dscEsignIssued, setDscEsignIssued] = useState({
    year: ['2024'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    data:
    [
    {
        name: 'DSC Issued',
        data: [20, 5, 10, 0, 30, 0, 17, 0, 15, 0, 0, 0]
    },
    {
        name: 'Esign Issued',
        data: [3, 2, 10, 60, 0, 0, 40, 0, 70, 0, 0, 0]
    },
    
]})
    
    function getYearList(){
      
      const uyearlist = [];

        for (let i = 2024; i <= new Date().getFullYear(); i++) {
          uyearlist.push({label: i, value: i});
        }

        setYearList(uyearlist);
        setSelectedYear(uyearlist);
      
    }

    function getMonthList(){
      setMonthList([
        {label: 'January', value: '1'},
        {label: 'February', value: '2'},
        {label: 'March', value: '3'},
        {label: 'April', value: '4'},
        {label: 'May', value: '5'},
        {label: 'June', value: '6'},
        {label: 'July', value: '7'},
        {label: 'August', value: '8'},
        {label: 'September', value: '9'},
        {label: 'October', value: '10'},
        {label: 'November', value: '11'},
        {label: 'December', value: '12'},
      ])

      setSelectedMonth([
        {label: 'January', value: '1'},
        {label: 'February', value: '2'},
        {label: 'March', value: '3'},
        {label: 'April', value: '4'},
        {label: 'May', value: '5'},
        {label: 'June', value: '6'},
        {label: 'July', value: '7'},
        {label: 'August', value: '8'},
        {label: 'September', value: '9'},
        {label: 'October', value: '10'},
        {label: 'November', value: '11'},
        {label: 'December', value: '12'},
      ]);
      
    }


    useEffect(() => {
      getYearList();
      getMonthList();
      const intervalId = setInterval(() => {
      }, 5000);
    
      return () => clearInterval(intervalId);

    }, []);
    
    

    


    const infoChart ={
        series: [infoList.totalRegisteredUsers, infoList.totalVerifiedUsers, infoList.totalCA, infoList.totalESP],
        options: {
          chart: {
            width: 380,
            type: 'donut',
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: true
          },
          fill: {
            type: 'gradient',
          },
          
          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 270
            }
          },
          labels: ['Registered Users', 'Verified Users', 'CA', 'ESP'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
    }

    const infoChartBar ={
        series: [{
            data: [infoList.totalRegisteredUsers, infoList.totalVerifiedUsers, infoList.totalCA, infoList.totalESP]
          }],
          options: {
            chart: {
              height: 350,
              type: 'bar',
              events: {
                click: function(chart, w, e) {
                  // console.log(chart, w, e)
                }
              },
              toolbar: {
                show: false
              }
            },
            
            plotOptions: {
              bar: {
                columnWidth: '45%',
                distributed: true,
              }
            },
            fill: {
                type: 'gradient',
              },
              
            dataLabels: {
              enabled: false
            },
            legend: {
              show: false
            },
            xaxis: {
              categories: ['Registered Users', 'Verified Users', 'CA', 'ESP'],
              labels: {
                style: {
                    
                  fontSize: '12px'
                }
              }
            }
          },
    }


    

    const dscEsignIssuedChart = {
        series: dscEsignIssued.data,
          options: {
            chart: {
              type: 'bar',
              height: 400,
              stacked: true,
              
              toolbar: {
                show: false
              },
              zoom: {
                enabled: true
              }
            },
            
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            plotOptions: {
              bar: {
                horizontal: false,
                
                
              },
            },
            xaxis: {
              type: 'text',
              categories: dscEsignIssued.months,
              
            },
            legend: {
              position: 'right',
              offsetY: 40
            },
            fill: {
              opacity: 1,
              type: 'gradient',
            }
          },
    }


    const dscEsignIssuedLineChart = {
        series: [{
            name: "Total DSC Issued",
            data: dscEsignIssued.data[0].data
        }],
        options: {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: true
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'DSC Issued',
            align: 'left'
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], 
              opacity: 0.5
            },
          },
          fill: {
            opacity: 1,
            type: 'gradient',
          },
          xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          }
        },
    }



    return(
        <>
        

            {/* Dashboard */}
            
            <Box component="div" sx={{m: 1, color: 'infobox.text'}}>


                {/* Info Box */}


                        <Grid container>
							<Grid item  xs sx={{backgroundColor: 'infobox.color1', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:1,
                                      m:1,
                                      height: '100px'
                                      }}>
								<Grid container>
									<Grid item >
                                            <IconButton aria-label="icon">
                                                <RegisteredUserIcon sx={{fontSize: '40px'}} color="primary"/>
                                            </IconButton>
                                    </Grid>
                                        <Grid item xs>
                                            <Grid container direction="column">
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Total Registered Users</Grid>
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <AnimatedNumbers
                                                        includeComma
                                                        transitions={(index) => ({
                                                        type: "spring",
                                                        duration: index + 5,
                                                        })}
                                                        animateToNumber={infoList.totalRegisteredUsers}
                                                        
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
									</Grid>
							</Grid>
						


                        
							<Grid item  xs sx={{backgroundColor: 'infobox.color2', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:1,
                                      m:1,
                                      height: '100px'
                                      }}>
								<Grid container>
									<Grid item>
                                            <IconButton aria-label="icon">
                                                <VerifiedUserIcon sx={{fontSize: '40px'}} color="primary"/>
                                            </IconButton>
                                    </Grid>
                                        <Grid item xs>
                                            <Grid container direction="column">
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Total Verified Users</Grid>
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <AnimatedNumbers
                                                        includeComma
                                                        transitions={(index) => ({
                                                        type: "spring",
                                                        duration: index + 5,
                                                        })}
                                                        animateToNumber={infoList.totalVerifiedUsers}
                                                        
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
									</Grid>
							</Grid>
						
							<Grid item  xs sx={{backgroundColor: 'infobox.color3', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:1,
                                      m:1,
                                      height: '100px'
                                      }}>
								<Grid container>
									<Grid item>
                                            <IconButton aria-label="icon">
                                                <CAIcon sx={{fontSize: '40px'}} color="primary"/>
                                            </IconButton>
                                    </Grid>
                                        <Grid item xs>
                                            <Grid container direction="column">
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Total CA</Grid>
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <AnimatedNumbers
                                                        includeComma
                                                        transitions={(index) => ({
                                                        type: "spring",
                                                        duration: index + 5,
                                                        })}
                                                        animateToNumber={infoList.totalCA}
                                                        
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
									</Grid>
							</Grid>
						
							<Grid item  xs sx={{backgroundColor: 'infobox.color4', 
                                      borderRadius: '4px',
                                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                      p:1,
                                      m:1,
                                      height: '100px'
                                      }}>
								<Grid container>
									<Grid item>
                                            <IconButton aria-label="icon">
                                                <ESPIcon sx={{fontSize: '40px'}} color="primary"/>
                                            </IconButton>
                                    </Grid>
                                        <Grid xs item >
                                            <Grid container direction="column">
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Total ESP</Grid>
                                                <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <AnimatedNumbers
                                                        includeComma
                                                        transitions={(index) => ({
                                                        type: "spring",
                                                        duration: index + 5,
                                                        })}
                                                        animateToNumber={infoList.totalESP}
                                                        
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
									</Grid>
							</Grid>
						
						</Grid>


                {/* Info Box End */}

                {/* Charts */}


                <Grid container>


               

                 <Grid item xs sx={{boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', m: 1, borderRadius: '4px'}}>
                    <Box>
                        <Box></Box>
                        <Box>
                            <Chart options={infoChartBar.options} series={infoChartBar.series} type="bar" height={400} />
                        </Box>
                    </Box>
                 </Grid>

                <Grid item xs sx={{boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', m: 1, borderRadius: '4px'}}> 
                    <Box>
                        <Box></Box>
                        <Box>
                            <Chart options={infoChart.options} series={infoChart.series} type="donut" height={400} />
                        </Box>
                    </Box>
                 </Grid>

                 

                </Grid>


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

                <Grid item xs sx={{m:1}}>
                    <Box sx={{color: '#FFFFFF'}}>
                        Select Year:
                    </Box>

                    <Box>
                        
                        <MultiSelect
                        options={yearList}
                        value={selectedYear}
                        onChange={setSelectedYear}
                        labelledBy={"Select Year"}
                        isCreatable={false}
                        />
                    </Box>
                  </Grid>

                  

                <Grid item xs sx={{m:1}}>

                  <Box sx={{color: '#FFFFFF'}}>
                    Select Month:
                  </Box>

                
                  <Box>
                  
                    <MultiSelect
                      options={monthList}
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      labelledBy={"Select Month"}
                      isCreatable={false}
                    />
                  </Box>
                </Grid>

                <Grid item xs sx={{m:1}}>

                  <Box sx={{color: '#FFFFFF'}}>
                    Select State:
                  </Box>

                
                  <Box>
                  
                    <MultiSelect
                      options={stateList}
                      value={selectedState}
                      onChange={setSelectedState}
                      labelledBy={"Select State"}
                      isCreatable={false}
                    />
                  </Box>
                </Grid>

                <Grid item xs sx={{m:1}}>

                  <Box sx={{color: '#FFFFFF'}}>
                    Select CA:
                  </Box>

                  <Box>
                  
                    <MultiSelect
                      
                      options={caList}
                      value={selectedCA}
                      onChange={setSelectedCA}
                      labelledBy={"Select CA"}
                      isCreatable={false}
                    />
                  </Box>
                </Grid>

                </Grid>


                <Grid container >

                 <Grid item xs sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    <Box >
                        <Box sx={{fontWeight: '600', m: 1}}>Year: {dscEsignIssued.year}</Box>
                        <Box>
                            <Chart options={dscEsignIssuedChart.options} series={dscEsignIssuedChart.series} type="bar" height={400} />
                        </Box>
                    </Box>
                 </Grid>

                 <Grid item xs sx={{m: 1, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '4px'}}>
                    <Box>
                        <Box></Box>
                        <Box>
                            <Chart options={dscEsignIssuedLineChart.options} series={dscEsignIssuedLineChart.series} type="line" height={400} />
                        </Box>
                    </Box>
                 </Grid>


                </Grid>

                


                {/* Charts End */}

            </Box>

            {/* Dashboard End */}
        
        </>
    )

}

export default Dashboard;