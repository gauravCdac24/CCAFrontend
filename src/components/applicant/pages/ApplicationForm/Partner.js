import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, FormHelperText, Button, Select, Tooltip, MenuItem, Typography, IconButton, FormControlLabel, Radio, RadioGroup, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StateService from '../../../../service/AdminService/StateService';
import CountryService from '../../../../service/AdminService/CountryService';
import CityService from '../../../../service/AdminService/CityService';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ValidatePattern from '../../../global/util/ValidatePattern';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import { useSelector } from 'react-redux';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
const VisuallyHiddenInput = styled('input')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0',
});


const countryList=[
    {
        "num_code": "4",
        "alpha_2_code": "AF",
        "alpha_3_code": "AFG",
        "en_short_name": "Afghanistan",
        "nationality": "Afghan"
    },
    {
        "num_code": "248",
        "alpha_2_code": "AX",
        "alpha_3_code": "ALA",
        "en_short_name": "\u00c5land Islands",
        "nationality": "\u00c5land Island"
    },
    {
        "num_code": "8",
        "alpha_2_code": "AL",
        "alpha_3_code": "ALB",
        "en_short_name": "Albania",
        "nationality": "Albanian"
    },
    {
        "num_code": "12",
        "alpha_2_code": "DZ",
        "alpha_3_code": "DZA",
        "en_short_name": "Algeria",
        "nationality": "Algerian"
    },
    {
        "num_code": "16",
        "alpha_2_code": "AS",
        "alpha_3_code": "ASM",
        "en_short_name": "American Samoa",
        "nationality": "American Samoan"
    },
    {
        "num_code": "20",
        "alpha_2_code": "AD",
        "alpha_3_code": "AND",
        "en_short_name": "Andorra",
        "nationality": "Andorran"
    },
    {
        "num_code": "24",
        "alpha_2_code": "AO",
        "alpha_3_code": "AGO",
        "en_short_name": "Angola",
        "nationality": "Angolan"
    },
    {
        "num_code": "660",
        "alpha_2_code": "AI",
        "alpha_3_code": "AIA",
        "en_short_name": "Anguilla",
        "nationality": "Anguillan"
    },
    {
        "num_code": "10",
        "alpha_2_code": "AQ",
        "alpha_3_code": "ATA",
        "en_short_name": "Antarctica",
        "nationality": "Antarctic"
    },
    {
        "num_code": "28",
        "alpha_2_code": "AG",
        "alpha_3_code": "ATG",
        "en_short_name": "Antigua and Barbuda",
        "nationality": "Antiguan or Barbudan"
    },
    {
        "num_code": "32",
        "alpha_2_code": "AR",
        "alpha_3_code": "ARG",
        "en_short_name": "Argentina",
        "nationality": "Argentine"
    },
    {
        "num_code": "51",
        "alpha_2_code": "AM",
        "alpha_3_code": "ARM",
        "en_short_name": "Armenia",
        "nationality": "Armenian"
    },
    {
        "num_code": "533",
        "alpha_2_code": "AW",
        "alpha_3_code": "ABW",
        "en_short_name": "Aruba",
        "nationality": "Aruban"
    },
    {
        "num_code": "36",
        "alpha_2_code": "AU",
        "alpha_3_code": "AUS",
        "en_short_name": "Australia",
        "nationality": "Australian"
    },
    {
        "num_code": "40",
        "alpha_2_code": "AT",
        "alpha_3_code": "AUT",
        "en_short_name": "Austria",
        "nationality": "Austrian"
    },
    {
        "num_code": "31",
        "alpha_2_code": "AZ",
        "alpha_3_code": "AZE",
        "en_short_name": "Azerbaijan",
        "nationality": "Azerbaijani, Azeri"
    },
    {
        "num_code": "44",
        "alpha_2_code": "BS",
        "alpha_3_code": "BHS",
        "en_short_name": "Bahamas",
        "nationality": "Bahamian"
    },
    {
        "num_code": "48",
        "alpha_2_code": "BH",
        "alpha_3_code": "BHR",
        "en_short_name": "Bahrain",
        "nationality": "Bahraini"
    },
    {
        "num_code": "50",
        "alpha_2_code": "BD",
        "alpha_3_code": "BGD",
        "en_short_name": "Bangladesh",
        "nationality": "Bangladeshi"
    },
    {
        "num_code": "52",
        "alpha_2_code": "BB",
        "alpha_3_code": "BRB",
        "en_short_name": "Barbados",
        "nationality": "Barbadian"
    },
    {
        "num_code": "112",
        "alpha_2_code": "BY",
        "alpha_3_code": "BLR",
        "en_short_name": "Belarus",
        "nationality": "Belarusian"
    },
    {
        "num_code": "56",
        "alpha_2_code": "BE",
        "alpha_3_code": "BEL",
        "en_short_name": "Belgium",
        "nationality": "Belgian"
    },
    {
        "num_code": "84",
        "alpha_2_code": "BZ",
        "alpha_3_code": "BLZ",
        "en_short_name": "Belize",
        "nationality": "Belizean"
    },
    {
        "num_code": "204",
        "alpha_2_code": "BJ",
        "alpha_3_code": "BEN",
        "en_short_name": "Benin",
        "nationality": "Beninese, Beninois"
    },
    {
        "num_code": "60",
        "alpha_2_code": "BM",
        "alpha_3_code": "BMU",
        "en_short_name": "Bermuda",
        "nationality": "Bermudian, Bermudan"
    },
    {
        "num_code": "64",
        "alpha_2_code": "BT",
        "alpha_3_code": "BTN",
        "en_short_name": "Bhutan",
        "nationality": "Bhutanese"
    },
    {
        "num_code": "68",
        "alpha_2_code": "BO",
        "alpha_3_code": "BOL",
        "en_short_name": "Bolivia (Plurinational State of)",
        "nationality": "Bolivian"
    },
    {
        "num_code": "535",
        "alpha_2_code": "BQ",
        "alpha_3_code": "BES",
        "en_short_name": "Bonaire, Sint Eustatius and Saba",
        "nationality": "Bonaire"
    },
    {
        "num_code": "70",
        "alpha_2_code": "BA",
        "alpha_3_code": "BIH",
        "en_short_name": "Bosnia and Herzegovina",
        "nationality": "Bosnian or Herzegovinian"
    },
    {
        "num_code": "72",
        "alpha_2_code": "BW",
        "alpha_3_code": "BWA",
        "en_short_name": "Botswana",
        "nationality": "Motswana, Botswanan"
    },
    {
        "num_code": "74",
        "alpha_2_code": "BV",
        "alpha_3_code": "BVT",
        "en_short_name": "Bouvet Island",
        "nationality": "Bouvet Island"
    },
    {
        "num_code": "76",
        "alpha_2_code": "BR",
        "alpha_3_code": "BRA",
        "en_short_name": "Brazil",
        "nationality": "Brazilian"
    },
    {
        "num_code": "86",
        "alpha_2_code": "IO",
        "alpha_3_code": "IOT",
        "en_short_name": "British Indian Ocean Territory",
        "nationality": "BIOT"
    },
    {
        "num_code": "96",
        "alpha_2_code": "BN",
        "alpha_3_code": "BRN",
        "en_short_name": "Brunei Darussalam",
        "nationality": "Bruneian"
    },
    {
        "num_code": "100",
        "alpha_2_code": "BG",
        "alpha_3_code": "BGR",
        "en_short_name": "Bulgaria",
        "nationality": "Bulgarian"
    },
    {
        "num_code": "854",
        "alpha_2_code": "BF",
        "alpha_3_code": "BFA",
        "en_short_name": "Burkina Faso",
        "nationality": "Burkinab\u00e9"
    },
    {
        "num_code": "108",
        "alpha_2_code": "BI",
        "alpha_3_code": "BDI",
        "en_short_name": "Burundi",
        "nationality": "Burundian"
    },
    {
        "num_code": "132",
        "alpha_2_code": "CV",
        "alpha_3_code": "CPV",
        "en_short_name": "Cabo Verde",
        "nationality": "Cabo Verdean"
    },
    {
        "num_code": "116",
        "alpha_2_code": "KH",
        "alpha_3_code": "KHM",
        "en_short_name": "Cambodia",
        "nationality": "Cambodian"
    },
    {
        "num_code": "120",
        "alpha_2_code": "CM",
        "alpha_3_code": "CMR",
        "en_short_name": "Cameroon",
        "nationality": "Cameroonian"
    },
    {
        "num_code": "124",
        "alpha_2_code": "CA",
        "alpha_3_code": "CAN",
        "en_short_name": "Canada",
        "nationality": "Canadian"
    },
    {
        "num_code": "136",
        "alpha_2_code": "KY",
        "alpha_3_code": "CYM",
        "en_short_name": "Cayman Islands",
        "nationality": "Caymanian"
    },
    {
        "num_code": "140",
        "alpha_2_code": "CF",
        "alpha_3_code": "CAF",
        "en_short_name": "Central African Republic",
        "nationality": "Central African"
    },
    {
        "num_code": "148",
        "alpha_2_code": "TD",
        "alpha_3_code": "TCD",
        "en_short_name": "Chad",
        "nationality": "Chadian"
    },
    {
        "num_code": "152",
        "alpha_2_code": "CL",
        "alpha_3_code": "CHL",
        "en_short_name": "Chile",
        "nationality": "Chilean"
    },
    {
        "num_code": "156",
        "alpha_2_code": "CN",
        "alpha_3_code": "CHN",
        "en_short_name": "China",
        "nationality": "Chinese"
    },
    {
        "num_code": "162",
        "alpha_2_code": "CX",
        "alpha_3_code": "CXR",
        "en_short_name": "Christmas Island",
        "nationality": "Christmas Island"
    },
    {
        "num_code": "166",
        "alpha_2_code": "CC",
        "alpha_3_code": "CCK",
        "en_short_name": "Cocos (Keeling) Islands",
        "nationality": "Cocos Island"
    },
    {
        "num_code": "170",
        "alpha_2_code": "CO",
        "alpha_3_code": "COL",
        "en_short_name": "Colombia",
        "nationality": "Colombian"
    },
    {
        "num_code": "174",
        "alpha_2_code": "KM",
        "alpha_3_code": "COM",
        "en_short_name": "Comoros",
        "nationality": "Comoran, Comorian"
    },
    {
        "num_code": "178",
        "alpha_2_code": "CG",
        "alpha_3_code": "COG",
        "en_short_name": "Congo (Republic of the)",
        "nationality": "Congolese"
    },
    {
        "num_code": "180",
        "alpha_2_code": "CD",
        "alpha_3_code": "COD",
        "en_short_name": "Congo (Democratic Republic of the)",
        "nationality": "Congolese"
    },
    {
        "num_code": "184",
        "alpha_2_code": "CK",
        "alpha_3_code": "COK",
        "en_short_name": "Cook Islands",
        "nationality": "Cook Island"
    },
    {
        "num_code": "188",
        "alpha_2_code": "CR",
        "alpha_3_code": "CRI",
        "en_short_name": "Costa Rica",
        "nationality": "Costa Rican"
    },
    {
        "num_code": "384",
        "alpha_2_code": "CI",
        "alpha_3_code": "CIV",
        "en_short_name": "C\u00f4te d'Ivoire",
        "nationality": "Ivorian"
    },
    {
        "num_code": "191",
        "alpha_2_code": "HR",
        "alpha_3_code": "HRV",
        "en_short_name": "Croatia",
        "nationality": "Croatian"
    },
    {
        "num_code": "192",
        "alpha_2_code": "CU",
        "alpha_3_code": "CUB",
        "en_short_name": "Cuba",
        "nationality": "Cuban"
    },
    {
        "num_code": "531",
        "alpha_2_code": "CW",
        "alpha_3_code": "CUW",
        "en_short_name": "Cura\u00e7ao",
        "nationality": "Cura\u00e7aoan"
    },
    {
        "num_code": "196",
        "alpha_2_code": "CY",
        "alpha_3_code": "CYP",
        "en_short_name": "Cyprus",
        "nationality": "Cypriot"
    },
    {
        "num_code": "203",
        "alpha_2_code": "CZ",
        "alpha_3_code": "CZE",
        "en_short_name": "Czech Republic",
        "nationality": "Czech"
    },
    {
        "num_code": "208",
        "alpha_2_code": "DK",
        "alpha_3_code": "DNK",
        "en_short_name": "Denmark",
        "nationality": "Danish"
    },
    {
        "num_code": "262",
        "alpha_2_code": "DJ",
        "alpha_3_code": "DJI",
        "en_short_name": "Djibouti",
        "nationality": "Djiboutian"
    },
    {
        "num_code": "212",
        "alpha_2_code": "DM",
        "alpha_3_code": "DMA",
        "en_short_name": "Dominica",
        "nationality": "Dominican"
    },
    {
        "num_code": "214",
        "alpha_2_code": "DO",
        "alpha_3_code": "DOM",
        "en_short_name": "Dominican Republic",
        "nationality": "Dominican"
    },
    {
        "num_code": "218",
        "alpha_2_code": "EC",
        "alpha_3_code": "ECU",
        "en_short_name": "Ecuador",
        "nationality": "Ecuadorian"
    },
    {
        "num_code": "818",
        "alpha_2_code": "EG",
        "alpha_3_code": "EGY",
        "en_short_name": "Egypt",
        "nationality": "Egyptian"
    },
    {
        "num_code": "222",
        "alpha_2_code": "SV",
        "alpha_3_code": "SLV",
        "en_short_name": "El Salvador",
        "nationality": "Salvadoran"
    },
    {
        "num_code": "226",
        "alpha_2_code": "GQ",
        "alpha_3_code": "GNQ",
        "en_short_name": "Equatorial Guinea",
        "nationality": "Equatorial Guinean, Equatoguinean"
    },
    {
        "num_code": "232",
        "alpha_2_code": "ER",
        "alpha_3_code": "ERI",
        "en_short_name": "Eritrea",
        "nationality": "Eritrean"
    },
    {
        "num_code": "233",
        "alpha_2_code": "EE",
        "alpha_3_code": "EST",
        "en_short_name": "Estonia",
        "nationality": "Estonian"
    },
    {
        "num_code": "231",
        "alpha_2_code": "ET",
        "alpha_3_code": "ETH",
        "en_short_name": "Ethiopia",
        "nationality": "Ethiopian"
    },
    {
        "num_code": "238",
        "alpha_2_code": "FK",
        "alpha_3_code": "FLK",
        "en_short_name": "Falkland Islands (Malvinas)",
        "nationality": "Falkland Island"
    },
    {
        "num_code": "234",
        "alpha_2_code": "FO",
        "alpha_3_code": "FRO",
        "en_short_name": "Faroe Islands",
        "nationality": "Faroese"
    },
    {
        "num_code": "242",
        "alpha_2_code": "FJ",
        "alpha_3_code": "FJI",
        "en_short_name": "Fiji",
        "nationality": "Fijian"
    },
    {
        "num_code": "246",
        "alpha_2_code": "FI",
        "alpha_3_code": "FIN",
        "en_short_name": "Finland",
        "nationality": "Finnish"
    },
    {
        "num_code": "250",
        "alpha_2_code": "FR",
        "alpha_3_code": "FRA",
        "en_short_name": "France",
        "nationality": "French"
    },
    {
        "num_code": "254",
        "alpha_2_code": "GF",
        "alpha_3_code": "GUF",
        "en_short_name": "French Guiana",
        "nationality": "French Guianese"
    },
    {
        "num_code": "258",
        "alpha_2_code": "PF",
        "alpha_3_code": "PYF",
        "en_short_name": "French Polynesia",
        "nationality": "French Polynesian"
    },
    {
        "num_code": "260",
        "alpha_2_code": "TF",
        "alpha_3_code": "ATF",
        "en_short_name": "French Southern Territories",
        "nationality": "French Southern Territories"
    },
    {
        "num_code": "266",
        "alpha_2_code": "GA",
        "alpha_3_code": "GAB",
        "en_short_name": "Gabon",
        "nationality": "Gabonese"
    },
    {
        "num_code": "270",
        "alpha_2_code": "GM",
        "alpha_3_code": "GMB",
        "en_short_name": "Gambia",
        "nationality": "Gambian"
    },
    {
        "num_code": "268",
        "alpha_2_code": "GE",
        "alpha_3_code": "GEO",
        "en_short_name": "Georgia",
        "nationality": "Georgian"
    },
    {
        "num_code": "276",
        "alpha_2_code": "DE",
        "alpha_3_code": "DEU",
        "en_short_name": "Germany",
        "nationality": "German"
    },
    {
        "num_code": "288",
        "alpha_2_code": "GH",
        "alpha_3_code": "GHA",
        "en_short_name": "Ghana",
        "nationality": "Ghanaian"
    },
    {
        "num_code": "292",
        "alpha_2_code": "GI",
        "alpha_3_code": "GIB",
        "en_short_name": "Gibraltar",
        "nationality": "Gibraltar"
    },
    {
        "num_code": "300",
        "alpha_2_code": "GR",
        "alpha_3_code": "GRC",
        "en_short_name": "Greece",
        "nationality": "Greek, Hellenic"
    },
    {
        "num_code": "304",
        "alpha_2_code": "GL",
        "alpha_3_code": "GRL",
        "en_short_name": "Greenland",
        "nationality": "Greenlandic"
    },
    {
        "num_code": "308",
        "alpha_2_code": "GD",
        "alpha_3_code": "GRD",
        "en_short_name": "Grenada",
        "nationality": "Grenadian"
    },
    {
        "num_code": "312",
        "alpha_2_code": "GP",
        "alpha_3_code": "GLP",
        "en_short_name": "Guadeloupe",
        "nationality": "Guadeloupe"
    },
    {
        "num_code": "316",
        "alpha_2_code": "GU",
        "alpha_3_code": "GUM",
        "en_short_name": "Guam",
        "nationality": "Guamanian, Guambat"
    },
    {
        "num_code": "320",
        "alpha_2_code": "GT",
        "alpha_3_code": "GTM",
        "en_short_name": "Guatemala",
        "nationality": "Guatemalan"
    },
    {
        "num_code": "831",
        "alpha_2_code": "GG",
        "alpha_3_code": "GGY",
        "en_short_name": "Guernsey",
        "nationality": "Channel Island"
    },
    {
        "num_code": "324",
        "alpha_2_code": "GN",
        "alpha_3_code": "GIN",
        "en_short_name": "Guinea",
        "nationality": "Guinean"
    },
    {
        "num_code": "624",
        "alpha_2_code": "GW",
        "alpha_3_code": "GNB",
        "en_short_name": "Guinea-Bissau",
        "nationality": "Bissau-Guinean"
    },
    {
        "num_code": "328",
        "alpha_2_code": "GY",
        "alpha_3_code": "GUY",
        "en_short_name": "Guyana",
        "nationality": "Guyanese"
    },
    {
        "num_code": "332",
        "alpha_2_code": "HT",
        "alpha_3_code": "HTI",
        "en_short_name": "Haiti",
        "nationality": "Haitian"
    },
    {
        "num_code": "334",
        "alpha_2_code": "HM",
        "alpha_3_code": "HMD",
        "en_short_name": "Heard Island and McDonald Islands",
        "nationality": "Heard Island or McDonald Islands"
    },
    {
        "num_code": "336",
        "alpha_2_code": "VA",
        "alpha_3_code": "VAT",
        "en_short_name": "Vatican City State",
        "nationality": "Vatican"
    },
    {
        "num_code": "340",
        "alpha_2_code": "HN",
        "alpha_3_code": "HND",
        "en_short_name": "Honduras",
        "nationality": "Honduran"
    },
    {
        "num_code": "344",
        "alpha_2_code": "HK",
        "alpha_3_code": "HKG",
        "en_short_name": "Hong Kong",
        "nationality": "Hong Kong, Hong Kongese"
    },
    {
        "num_code": "348",
        "alpha_2_code": "HU",
        "alpha_3_code": "HUN",
        "en_short_name": "Hungary",
        "nationality": "Hungarian, Magyar"
    },
    {
        "num_code": "352",
        "alpha_2_code": "IS",
        "alpha_3_code": "ISL",
        "en_short_name": "Iceland",
        "nationality": "Icelandic"
    },
    {
        "num_code": "356",
        "alpha_2_code": "IN",
        "alpha_3_code": "IND",
        "en_short_name": "India",
        "nationality": "Indian"
    },
    {
        "num_code": "360",
        "alpha_2_code": "ID",
        "alpha_3_code": "IDN",
        "en_short_name": "Indonesia",
        "nationality": "Indonesian"
    },
    {
        "num_code": "364",
        "alpha_2_code": "IR",
        "alpha_3_code": "IRN",
        "en_short_name": "Iran",
        "nationality": "Iranian, Persian"
    },
    {
        "num_code": "368",
        "alpha_2_code": "IQ",
        "alpha_3_code": "IRQ",
        "en_short_name": "Iraq",
        "nationality": "Iraqi"
    },
    {
        "num_code": "372",
        "alpha_2_code": "IE",
        "alpha_3_code": "IRL",
        "en_short_name": "Ireland",
        "nationality": "Irish"
    },
    {
        "num_code": "833",
        "alpha_2_code": "IM",
        "alpha_3_code": "IMN",
        "en_short_name": "Isle of Man",
        "nationality": "Manx"
    },
    {
        "num_code": "376",
        "alpha_2_code": "IL",
        "alpha_3_code": "ISR",
        "en_short_name": "Israel",
        "nationality": "Israeli"
    },
    {
        "num_code": "380",
        "alpha_2_code": "IT",
        "alpha_3_code": "ITA",
        "en_short_name": "Italy",
        "nationality": "Italian"
    },
    {
        "num_code": "388",
        "alpha_2_code": "JM",
        "alpha_3_code": "JAM",
        "en_short_name": "Jamaica",
        "nationality": "Jamaican"
    },
    {
        "num_code": "392",
        "alpha_2_code": "JP",
        "alpha_3_code": "JPN",
        "en_short_name": "Japan",
        "nationality": "Japanese"
    },
    {
        "num_code": "832",
        "alpha_2_code": "JE",
        "alpha_3_code": "JEY",
        "en_short_name": "Jersey",
        "nationality": "Channel Island"
    },
    {
        "num_code": "400",
        "alpha_2_code": "JO",
        "alpha_3_code": "JOR",
        "en_short_name": "Jordan",
        "nationality": "Jordanian"
    },
    {
        "num_code": "398",
        "alpha_2_code": "KZ",
        "alpha_3_code": "KAZ",
        "en_short_name": "Kazakhstan",
        "nationality": "Kazakhstani, Kazakh"
    },
    {
        "num_code": "404",
        "alpha_2_code": "KE",
        "alpha_3_code": "KEN",
        "en_short_name": "Kenya",
        "nationality": "Kenyan"
    },
    {
        "num_code": "296",
        "alpha_2_code": "KI",
        "alpha_3_code": "KIR",
        "en_short_name": "Kiribati",
        "nationality": "I-Kiribati"
    },
    {
        "num_code": "408",
        "alpha_2_code": "KP",
        "alpha_3_code": "PRK",
        "en_short_name": "Korea (Democratic People's Republic of)",
        "nationality": "North Korean"
    },
    {
        "num_code": "410",
        "alpha_2_code": "KR",
        "alpha_3_code": "KOR",
        "en_short_name": "Korea (Republic of)",
        "nationality": "South Korean"
    },
    {
        "num_code": "414",
        "alpha_2_code": "KW",
        "alpha_3_code": "KWT",
        "en_short_name": "Kuwait",
        "nationality": "Kuwaiti"
    },
    {
        "num_code": "417",
        "alpha_2_code": "KG",
        "alpha_3_code": "KGZ",
        "en_short_name": "Kyrgyzstan",
        "nationality": "Kyrgyzstani, Kyrgyz, Kirgiz, Kirghiz"
    },
    {
        "num_code": "418",
        "alpha_2_code": "LA",
        "alpha_3_code": "LAO",
        "en_short_name": "Lao People's Democratic Republic",
        "nationality": "Lao, Laotian"
    },
    {
        "num_code": "428",
        "alpha_2_code": "LV",
        "alpha_3_code": "LVA",
        "en_short_name": "Latvia",
        "nationality": "Latvian"
    },
    {
        "num_code": "422",
        "alpha_2_code": "LB",
        "alpha_3_code": "LBN",
        "en_short_name": "Lebanon",
        "nationality": "Lebanese"
    },
    {
        "num_code": "426",
        "alpha_2_code": "LS",
        "alpha_3_code": "LSO",
        "en_short_name": "Lesotho",
        "nationality": "Basotho"
    },
    {
        "num_code": "430",
        "alpha_2_code": "LR",
        "alpha_3_code": "LBR",
        "en_short_name": "Liberia",
        "nationality": "Liberian"
    },
    {
        "num_code": "434",
        "alpha_2_code": "LY",
        "alpha_3_code": "LBY",
        "en_short_name": "Libya",
        "nationality": "Libyan"
    },
    {
        "num_code": "438",
        "alpha_2_code": "LI",
        "alpha_3_code": "LIE",
        "en_short_name": "Liechtenstein",
        "nationality": "Liechtenstein"
    },
    {
        "num_code": "440",
        "alpha_2_code": "LT",
        "alpha_3_code": "LTU",
        "en_short_name": "Lithuania",
        "nationality": "Lithuanian"
    },
    {
        "num_code": "442",
        "alpha_2_code": "LU",
        "alpha_3_code": "LUX",
        "en_short_name": "Luxembourg",
        "nationality": "Luxembourg, Luxembourgish"
    },
    {
        "num_code": "446",
        "alpha_2_code": "MO",
        "alpha_3_code": "MAC",
        "en_short_name": "Macao",
        "nationality": "Macanese, Chinese"
    },
    {
        "num_code": "807",
        "alpha_2_code": "MK",
        "alpha_3_code": "MKD",
        "en_short_name": "Macedonia (the former Yugoslav Republic of)",
        "nationality": "Macedonian"
    },
    {
        "num_code": "450",
        "alpha_2_code": "MG",
        "alpha_3_code": "MDG",
        "en_short_name": "Madagascar",
        "nationality": "Malagasy"
    },
    {
        "num_code": "454",
        "alpha_2_code": "MW",
        "alpha_3_code": "MWI",
        "en_short_name": "Malawi",
        "nationality": "Malawian"
    },
    {
        "num_code": "458",
        "alpha_2_code": "MY",
        "alpha_3_code": "MYS",
        "en_short_name": "Malaysia",
        "nationality": "Malaysian"
    },
    {
        "num_code": "462",
        "alpha_2_code": "MV",
        "alpha_3_code": "MDV",
        "en_short_name": "Maldives",
        "nationality": "Maldivian"
    },
    {
        "num_code": "466",
        "alpha_2_code": "ML",
        "alpha_3_code": "MLI",
        "en_short_name": "Mali",
        "nationality": "Malian, Malinese"
    },
    {
        "num_code": "470",
        "alpha_2_code": "MT",
        "alpha_3_code": "MLT",
        "en_short_name": "Malta",
        "nationality": "Maltese"
    },
    {
        "num_code": "584",
        "alpha_2_code": "MH",
        "alpha_3_code": "MHL",
        "en_short_name": "Marshall Islands",
        "nationality": "Marshallese"
    },
    {
        "num_code": "474",
        "alpha_2_code": "MQ",
        "alpha_3_code": "MTQ",
        "en_short_name": "Martinique",
        "nationality": "Martiniquais, Martinican"
    },
    {
        "num_code": "478",
        "alpha_2_code": "MR",
        "alpha_3_code": "MRT",
        "en_short_name": "Mauritania",
        "nationality": "Mauritanian"
    },
    {
        "num_code": "480",
        "alpha_2_code": "MU",
        "alpha_3_code": "MUS",
        "en_short_name": "Mauritius",
        "nationality": "Mauritian"
    },
    {
        "num_code": "175",
        "alpha_2_code": "YT",
        "alpha_3_code": "MYT",
        "en_short_name": "Mayotte",
        "nationality": "Mahoran"
    },
    {
        "num_code": "484",
        "alpha_2_code": "MX",
        "alpha_3_code": "MEX",
        "en_short_name": "Mexico",
        "nationality": "Mexican"
    },
    {
        "num_code": "583",
        "alpha_2_code": "FM",
        "alpha_3_code": "FSM",
        "en_short_name": "Micronesia (Federated States of)",
        "nationality": "Micronesian"
    },
    {
        "num_code": "498",
        "alpha_2_code": "MD",
        "alpha_3_code": "MDA",
        "en_short_name": "Moldova (Republic of)",
        "nationality": "Moldovan"
    },
    {
        "num_code": "492",
        "alpha_2_code": "MC",
        "alpha_3_code": "MCO",
        "en_short_name": "Monaco",
        "nationality": "Mon\u00e9gasque, Monacan"
    },
    {
        "num_code": "496",
        "alpha_2_code": "MN",
        "alpha_3_code": "MNG",
        "en_short_name": "Mongolia",
        "nationality": "Mongolian"
    },
    {
        "num_code": "499",
        "alpha_2_code": "ME",
        "alpha_3_code": "MNE",
        "en_short_name": "Montenegro",
        "nationality": "Montenegrin"
    },
    {
        "num_code": "500",
        "alpha_2_code": "MS",
        "alpha_3_code": "MSR",
        "en_short_name": "Montserrat",
        "nationality": "Montserratian"
    },
    {
        "num_code": "504",
        "alpha_2_code": "MA",
        "alpha_3_code": "MAR",
        "en_short_name": "Morocco",
        "nationality": "Moroccan"
    },
    {
        "num_code": "508",
        "alpha_2_code": "MZ",
        "alpha_3_code": "MOZ",
        "en_short_name": "Mozambique",
        "nationality": "Mozambican"
    },
    {
        "num_code": "104",
        "alpha_2_code": "MM",
        "alpha_3_code": "MMR",
        "en_short_name": "Myanmar",
        "nationality": "Burmese"
    },
    {
        "num_code": "516",
        "alpha_2_code": "NA",
        "alpha_3_code": "NAM",
        "en_short_name": "Namibia",
        "nationality": "Namibian"
    },
    {
        "num_code": "520",
        "alpha_2_code": "NR",
        "alpha_3_code": "NRU",
        "en_short_name": "Nauru",
        "nationality": "Nauruan"
    },
    {
        "num_code": "524",
        "alpha_2_code": "NP",
        "alpha_3_code": "NPL",
        "en_short_name": "Nepal",
        "nationality": "Nepali, Nepalese"
    },
    {
        "num_code": "528",
        "alpha_2_code": "NL",
        "alpha_3_code": "NLD",
        "en_short_name": "Netherlands",
        "nationality": "Dutch, Netherlandic"
    },
    {
        "num_code": "540",
        "alpha_2_code": "NC",
        "alpha_3_code": "NCL",
        "en_short_name": "New Caledonia",
        "nationality": "New Caledonian"
    },
    {
        "num_code": "554",
        "alpha_2_code": "NZ",
        "alpha_3_code": "NZL",
        "en_short_name": "New Zealand",
        "nationality": "New Zealand, NZ"
    },
    {
        "num_code": "558",
        "alpha_2_code": "NI",
        "alpha_3_code": "NIC",
        "en_short_name": "Nicaragua",
        "nationality": "Nicaraguan"
    },
    {
        "num_code": "562",
        "alpha_2_code": "NE",
        "alpha_3_code": "NER",
        "en_short_name": "Niger",
        "nationality": "Nigerien"
    },
    {
        "num_code": "566",
        "alpha_2_code": "NG",
        "alpha_3_code": "NGA",
        "en_short_name": "Nigeria",
        "nationality": "Nigerian"
    },
    {
        "num_code": "570",
        "alpha_2_code": "NU",
        "alpha_3_code": "NIU",
        "en_short_name": "Niue",
        "nationality": "Niuean"
    },
    {
        "num_code": "574",
        "alpha_2_code": "NF",
        "alpha_3_code": "NFK",
        "en_short_name": "Norfolk Island",
        "nationality": "Norfolk Island"
    },
    {
        "num_code": "580",
        "alpha_2_code": "MP",
        "alpha_3_code": "MNP",
        "en_short_name": "Northern Mariana Islands",
        "nationality": "Northern Marianan"
    },
    {
        "num_code": "578",
        "alpha_2_code": "NO",
        "alpha_3_code": "NOR",
        "en_short_name": "Norway",
        "nationality": "Norwegian"
    },
    {
        "num_code": "512",
        "alpha_2_code": "OM",
        "alpha_3_code": "OMN",
        "en_short_name": "Oman",
        "nationality": "Omani"
    },
    {
        "num_code": "586",
        "alpha_2_code": "PK",
        "alpha_3_code": "PAK",
        "en_short_name": "Pakistan",
        "nationality": "Pakistani"
    },
    {
        "num_code": "585",
        "alpha_2_code": "PW",
        "alpha_3_code": "PLW",
        "en_short_name": "Palau",
        "nationality": "Palauan"
    },
    {
        "num_code": "275",
        "alpha_2_code": "PS",
        "alpha_3_code": "PSE",
        "en_short_name": "Palestine, State of",
        "nationality": "Palestinian"
    },
    {
        "num_code": "591",
        "alpha_2_code": "PA",
        "alpha_3_code": "PAN",
        "en_short_name": "Panama",
        "nationality": "Panamanian"
    },
    {
        "num_code": "598",
        "alpha_2_code": "PG",
        "alpha_3_code": "PNG",
        "en_short_name": "Papua New Guinea",
        "nationality": "Papua New Guinean, Papuan"
    },
    {
        "num_code": "600",
        "alpha_2_code": "PY",
        "alpha_3_code": "PRY",
        "en_short_name": "Paraguay",
        "nationality": "Paraguayan"
    },
    {
        "num_code": "604",
        "alpha_2_code": "PE",
        "alpha_3_code": "PER",
        "en_short_name": "Peru",
        "nationality": "Peruvian"
    },
    {
        "num_code": "608",
        "alpha_2_code": "PH",
        "alpha_3_code": "PHL",
        "en_short_name": "Philippines",
        "nationality": "Philippine, Filipino"
    },
    {
        "num_code": "612",
        "alpha_2_code": "PN",
        "alpha_3_code": "PCN",
        "en_short_name": "Pitcairn",
        "nationality": "Pitcairn Island"
    },
    {
        "num_code": "616",
        "alpha_2_code": "PL",
        "alpha_3_code": "POL",
        "en_short_name": "Poland",
        "nationality": "Polish"
    },
    {
        "num_code": "620",
        "alpha_2_code": "PT",
        "alpha_3_code": "PRT",
        "en_short_name": "Portugal",
        "nationality": "Portuguese"
    },
    {
        "num_code": "630",
        "alpha_2_code": "PR",
        "alpha_3_code": "PRI",
        "en_short_name": "Puerto Rico",
        "nationality": "Puerto Rican"
    },
    {
        "num_code": "634",
        "alpha_2_code": "QA",
        "alpha_3_code": "QAT",
        "en_short_name": "Qatar",
        "nationality": "Qatari"
    },
    {
        "num_code": "638",
        "alpha_2_code": "RE",
        "alpha_3_code": "REU",
        "en_short_name": "R\u00e9union",
        "nationality": "R\u00e9unionese, R\u00e9unionnais"
    },
    {
        "num_code": "642",
        "alpha_2_code": "RO",
        "alpha_3_code": "ROU",
        "en_short_name": "Romania",
        "nationality": "Romanian"
    },
    {
        "num_code": "643",
        "alpha_2_code": "RU",
        "alpha_3_code": "RUS",
        "en_short_name": "Russian Federation",
        "nationality": "Russian"
    },
    {
        "num_code": "646",
        "alpha_2_code": "RW",
        "alpha_3_code": "RWA",
        "en_short_name": "Rwanda",
        "nationality": "Rwandan"
    },
    {
        "num_code": "652",
        "alpha_2_code": "BL",
        "alpha_3_code": "BLM",
        "en_short_name": "Saint Barth\u00e9lemy",
        "nationality": "Barth\u00e9lemois"
    },
    {
        "num_code": "654",
        "alpha_2_code": "SH",
        "alpha_3_code": "SHN",
        "en_short_name": "Saint Helena, Ascension and Tristan da Cunha",
        "nationality": "Saint Helenian"
    },
    {
        "num_code": "659",
        "alpha_2_code": "KN",
        "alpha_3_code": "KNA",
        "en_short_name": "Saint Kitts and Nevis",
        "nationality": "Kittitian or Nevisian"
    },
    {
        "num_code": "662",
        "alpha_2_code": "LC",
        "alpha_3_code": "LCA",
        "en_short_name": "Saint Lucia",
        "nationality": "Saint Lucian"
    },
    {
        "num_code": "663",
        "alpha_2_code": "MF",
        "alpha_3_code": "MAF",
        "en_short_name": "Saint Martin (French part)",
        "nationality": "Saint-Martinoise"
    },
    {
        "num_code": "666",
        "alpha_2_code": "PM",
        "alpha_3_code": "SPM",
        "en_short_name": "Saint Pierre and Miquelon",
        "nationality": "Saint-Pierrais or Miquelonnais"
    },
    {
        "num_code": "670",
        "alpha_2_code": "VC",
        "alpha_3_code": "VCT",
        "en_short_name": "Saint Vincent and the Grenadines",
        "nationality": "Saint Vincentian, Vincentian"
    },
    {
        "num_code": "882",
        "alpha_2_code": "WS",
        "alpha_3_code": "WSM",
        "en_short_name": "Samoa",
        "nationality": "Samoan"
    },
    {
        "num_code": "674",
        "alpha_2_code": "SM",
        "alpha_3_code": "SMR",
        "en_short_name": "San Marino",
        "nationality": "Sammarinese"
    },
    {
        "num_code": "678",
        "alpha_2_code": "ST",
        "alpha_3_code": "STP",
        "en_short_name": "Sao Tome and Principe",
        "nationality": "S\u00e3o Tom\u00e9an"
    },
    {
        "num_code": "682",
        "alpha_2_code": "SA",
        "alpha_3_code": "SAU",
        "en_short_name": "Saudi Arabia",
        "nationality": "Saudi, Saudi Arabian"
    },
    {
        "num_code": "686",
        "alpha_2_code": "SN",
        "alpha_3_code": "SEN",
        "en_short_name": "Senegal",
        "nationality": "Senegalese"
    },
    {
        "num_code": "688",
        "alpha_2_code": "RS",
        "alpha_3_code": "SRB",
        "en_short_name": "Serbia",
        "nationality": "Serbian"
    },
    {
        "num_code": "690",
        "alpha_2_code": "SC",
        "alpha_3_code": "SYC",
        "en_short_name": "Seychelles",
        "nationality": "Seychellois"
    },
    {
        "num_code": "694",
        "alpha_2_code": "SL",
        "alpha_3_code": "SLE",
        "en_short_name": "Sierra Leone",
        "nationality": "Sierra Leonean"
    },
    {
        "num_code": "702",
        "alpha_2_code": "SG",
        "alpha_3_code": "SGP",
        "en_short_name": "Singapore",
        "nationality": "Singaporean"
    },
    {
        "num_code": "534",
        "alpha_2_code": "SX",
        "alpha_3_code": "SXM",
        "en_short_name": "Sint Maarten (Dutch part)",
        "nationality": "Sint Maarten"
    },
    {
        "num_code": "703",
        "alpha_2_code": "SK",
        "alpha_3_code": "SVK",
        "en_short_name": "Slovakia",
        "nationality": "Slovak"
    },
    {
        "num_code": "705",
        "alpha_2_code": "SI",
        "alpha_3_code": "SVN",
        "en_short_name": "Slovenia",
        "nationality": "Slovenian, Slovene"
    },
    {
        "num_code": "90",
        "alpha_2_code": "SB",
        "alpha_3_code": "SLB",
        "en_short_name": "Solomon Islands",
        "nationality": "Solomon Island"
    },
    {
        "num_code": "706",
        "alpha_2_code": "SO",
        "alpha_3_code": "SOM",
        "en_short_name": "Somalia",
        "nationality": "Somali, Somalian"
    },
    {
        "num_code": "710",
        "alpha_2_code": "ZA",
        "alpha_3_code": "ZAF",
        "en_short_name": "South Africa",
        "nationality": "South African"
    },
    {
        "num_code": "239",
        "alpha_2_code": "GS",
        "alpha_3_code": "SGS",
        "en_short_name": "South Georgia and the South Sandwich Islands",
        "nationality": "South Georgia or South Sandwich Islands"
    },
    {
        "num_code": "728",
        "alpha_2_code": "SS",
        "alpha_3_code": "SSD",
        "en_short_name": "South Sudan",
        "nationality": "South Sudanese"
    },
    {
        "num_code": "724",
        "alpha_2_code": "ES",
        "alpha_3_code": "ESP",
        "en_short_name": "Spain",
        "nationality": "Spanish"
    },
    {
        "num_code": "144",
        "alpha_2_code": "LK",
        "alpha_3_code": "LKA",
        "en_short_name": "Sri Lanka",
        "nationality": "Sri Lankan"
    },
    {
        "num_code": "729",
        "alpha_2_code": "SD",
        "alpha_3_code": "SDN",
        "en_short_name": "Sudan",
        "nationality": "Sudanese"
    },
    {
        "num_code": "740",
        "alpha_2_code": "SR",
        "alpha_3_code": "SUR",
        "en_short_name": "Suriname",
        "nationality": "Surinamese"
    },
    {
        "num_code": "744",
        "alpha_2_code": "SJ",
        "alpha_3_code": "SJM",
        "en_short_name": "Svalbard and Jan Mayen",
        "nationality": "Svalbard"
    },
    {
        "num_code": "748",
        "alpha_2_code": "SZ",
        "alpha_3_code": "SWZ",
        "en_short_name": "Swaziland",
        "nationality": "Swazi"
    },
    {
        "num_code": "752",
        "alpha_2_code": "SE",
        "alpha_3_code": "SWE",
        "en_short_name": "Sweden",
        "nationality": "Swedish"
    },
    {
        "num_code": "756",
        "alpha_2_code": "CH",
        "alpha_3_code": "CHE",
        "en_short_name": "Switzerland",
        "nationality": "Swiss"
    },
    {
        "num_code": "760",
        "alpha_2_code": "SY",
        "alpha_3_code": "SYR",
        "en_short_name": "Syrian Arab Republic",
        "nationality": "Syrian"
    },
    {
        "num_code": "158",
        "alpha_2_code": "TW",
        "alpha_3_code": "TWN",
        "en_short_name": "Taiwan, Province of China",
        "nationality": "Chinese, Taiwanese"
    },
    {
        "num_code": "762",
        "alpha_2_code": "TJ",
        "alpha_3_code": "TJK",
        "en_short_name": "Tajikistan",
        "nationality": "Tajikistani"
    },
    {
        "num_code": "834",
        "alpha_2_code": "TZ",
        "alpha_3_code": "TZA",
        "en_short_name": "Tanzania, United Republic of",
        "nationality": "Tanzanian"
    },
    {
        "num_code": "764",
        "alpha_2_code": "TH",
        "alpha_3_code": "THA",
        "en_short_name": "Thailand",
        "nationality": "Thai"
    },
    {
        "num_code": "626",
        "alpha_2_code": "TL",
        "alpha_3_code": "TLS",
        "en_short_name": "Timor-Leste",
        "nationality": "Timorese"
    },
    {
        "num_code": "768",
        "alpha_2_code": "TG",
        "alpha_3_code": "TGO",
        "en_short_name": "Togo",
        "nationality": "Togolese"
    },
    {
        "num_code": "772",
        "alpha_2_code": "TK",
        "alpha_3_code": "TKL",
        "en_short_name": "Tokelau",
        "nationality": "Tokelauan"
    },
    {
        "num_code": "776",
        "alpha_2_code": "TO",
        "alpha_3_code": "TON",
        "en_short_name": "Tonga",
        "nationality": "Tongan"
    },
    {
        "num_code": "780",
        "alpha_2_code": "TT",
        "alpha_3_code": "TTO",
        "en_short_name": "Trinidad and Tobago",
        "nationality": "Trinidadian or Tobagonian"
    },
    {
        "num_code": "788",
        "alpha_2_code": "TN",
        "alpha_3_code": "TUN",
        "en_short_name": "Tunisia",
        "nationality": "Tunisian"
    },
    {
        "num_code": "792",
        "alpha_2_code": "TR",
        "alpha_3_code": "TUR",
        "en_short_name": "Turkey",
        "nationality": "Turkish"
    },
    {
        "num_code": "795",
        "alpha_2_code": "TM",
        "alpha_3_code": "TKM",
        "en_short_name": "Turkmenistan",
        "nationality": "Turkmen"
    },
    {
        "num_code": "796",
        "alpha_2_code": "TC",
        "alpha_3_code": "TCA",
        "en_short_name": "Turks and Caicos Islands",
        "nationality": "Turks and Caicos Island"
    },
    {
        "num_code": "798",
        "alpha_2_code": "TV",
        "alpha_3_code": "TUV",
        "en_short_name": "Tuvalu",
        "nationality": "Tuvaluan"
    },
    {
        "num_code": "800",
        "alpha_2_code": "UG",
        "alpha_3_code": "UGA",
        "en_short_name": "Uganda",
        "nationality": "Ugandan"
    },
    {
        "num_code": "804",
        "alpha_2_code": "UA",
        "alpha_3_code": "UKR",
        "en_short_name": "Ukraine",
        "nationality": "Ukrainian"
    },
    {
        "num_code": "784",
        "alpha_2_code": "AE",
        "alpha_3_code": "ARE",
        "en_short_name": "United Arab Emirates",
        "nationality": "Emirati, Emirian, Emiri"
    },
    {
        "num_code": "826",
        "alpha_2_code": "GB",
        "alpha_3_code": "GBR",
        "en_short_name": "United Kingdom of Great Britain and Northern Ireland",
        "nationality": "British, UK"
    },
    {
        "num_code": "581",
        "alpha_2_code": "UM",
        "alpha_3_code": "UMI",
        "en_short_name": "United States Minor Outlying Islands",
        "nationality": "American"
    },
    {
        "num_code": "840",
        "alpha_2_code": "US",
        "alpha_3_code": "USA",
        "en_short_name": "United States of America",
        "nationality": "American"
    },
    {
        "num_code": "858",
        "alpha_2_code": "UY",
        "alpha_3_code": "URY",
        "en_short_name": "Uruguay",
        "nationality": "Uruguayan"
    },
    {
        "num_code": "860",
        "alpha_2_code": "UZ",
        "alpha_3_code": "UZB",
        "en_short_name": "Uzbekistan",
        "nationality": "Uzbekistani, Uzbek"
    },
    {
        "num_code": "548",
        "alpha_2_code": "VU",
        "alpha_3_code": "VUT",
        "en_short_name": "Vanuatu",
        "nationality": "Ni-Vanuatu, Vanuatuan"
    },
    {
        "num_code": "862",
        "alpha_2_code": "VE",
        "alpha_3_code": "VEN",
        "en_short_name": "Venezuela (Bolivarian Republic of)",
        "nationality": "Venezuelan"
    },
    {
        "num_code": "704",
        "alpha_2_code": "VN",
        "alpha_3_code": "VNM",
        "en_short_name": "Vietnam",
        "nationality": "Vietnamese"
    },
    {
        "num_code": "92",
        "alpha_2_code": "VG",
        "alpha_3_code": "VGB",
        "en_short_name": "Virgin Islands (British)",
        "nationality": "British Virgin Island"
    },
    {
        "num_code": "850",
        "alpha_2_code": "VI",
        "alpha_3_code": "VIR",
        "en_short_name": "Virgin Islands (U.S.)",
        "nationality": "U.S. Virgin Island"
    },
    {
        "num_code": "876",
        "alpha_2_code": "WF",
        "alpha_3_code": "WLF",
        "en_short_name": "Wallis and Futuna",
        "nationality": "Wallis and Futuna, Wallisian or Futunan"
    },
    {
        "num_code": "732",
        "alpha_2_code": "EH",
        "alpha_3_code": "ESH",
        "en_short_name": "Western Sahara",
        "nationality": "Sahrawi, Sahrawian, Sahraouian"
    },
    {
        "num_code": "887",
        "alpha_2_code": "YE",
        "alpha_3_code": "YEM",
        "en_short_name": "Yemen",
        "nationality": "Yemeni"
    },
    {
        "num_code": "894",
        "alpha_2_code": "ZM",
        "alpha_3_code": "ZMB",
        "en_short_name": "Zambia",
        "nationality": "Zambian"
    },
    {
        "num_code": "716",
        "alpha_2_code": "ZW",
        "alpha_3_code": "ZWE",
        "en_short_name": "Zimbabwe",
        "nationality": "Zimbabwean"
    }
]


const errorMsg = {
    blockNo: {
        blank: 'Please enter the Block No ',
        length: 'Block No must be between 3 and 20 characters',
    },
    village: {
        blank: 'Please enter the Village Name',
        length: 'Village must be between 3 and 50 characters',
    },
    postOffice: {
        blank: 'Please enter the Post Office Number',
        length: 'Post Office must be between 3 and 50 characters',
    },
    subDivision: {
        blank: 'Please enter the Subdivision name',
        length: 'Subdivision must be between 3 and 50 characters',
    },
    country: {
        blank: 'Please select the Country',
    },
    state: {
        blank: 'Please select the State',
    },
    city: {
        blank: 'Please slect the City',
    },
    nationality: {
        blank: 'Please slect the Nationality',
    },
    pin: {
        blank: 'Please enter the PIN Number',
        format: 'PIN must be a valid 6-digit number',
    },
    fax: {
        blank: 'Please enter the Fax',
        format: 'Fax must be a valid number',
    },
    telephoneNo: {
        blank: 'Please enter the Telephone No',
        format: 'Telephone No must be a valid number',
    },
    mobile: {
        blank: 'Please enter the Mobile No',
        format: 'Mobile No must be a valid 10-digit number',
    },
    salutation: {
        blank: " Please select the Salutation."
    },
    firstName: {
        blank: "First Name cannot be empty.",
        length: "The length of First Name must be between 1 and 30 characters.",
        format: "Please enter a valid First Name."
    },
    middleName: {
        length: "The length of Middle Name must be between 0 and 30 characters.",
        format: "Please enter a valid Middle Name."
    },
    lastName: {
        blank: "Last Name cannot be empty.",
        length: "The length of Last Name must be between 1 and 30 characters.",
        format: "Please enter a valid Last Name."
    },
    underState: {
        blank: 'Please enter the Under State',
        length: 'Under State must be between 3 and 20 characters',
    },
    organizationName: {
        blank: 'Please enter the organization name',
        length: 'organization name must be between 3 and 50 characters',
    },
    department: {
        blank: 'Please enter the department',
        length: 'Department must be between 3 and 50 characters',
    },
    designation: {
        blank: 'Please enter the designation name',
        length: 'designation name must be between 3 and 50 characters',
    },
    emailId: {
        blank: 'Please enter the emailId',
        format: 'Please Enter the valid emailId',
    },
    passportNo: 'Please enter the Passport Number.',
    passportIssuingAuthority: 'Please enter the Passport Issuing Authority.',
    passportExpiryDate: {
        required: 'Please enter the Passport Expiry Date.',
        past: 'Passport Expiry Date cannot be in the past.'
    },
    voterCardNo: ' Please enter the Voter ID Number.',
    pancardNo: 'Please enter the Income Tax Pan Number.',
    capital: 'Please enter the Capital.',
    file1: 'Passport Document is required.',
    file2: 'ID Card Doument is required.',
    file3: 'PanCard Document is required.',
    nationality: 'Please enter the nationality'
};

const Partner = ({ handleNext, handleFormDataChange, handleBack }) => {

    const userName = useSelector((state)=>state.jwtAuthentication.username);
    const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);


    const [communicationAddressFormValues, setCommunicationAddressFormValues] = useState({
        partnerDetails: [
            {
                blockNo: '',
                village: '',
                postOffice: '',
                subDivision: '',
                country: '',
                city: '',
                state: '',
                pin: '',
                fax: '',
                telephoneNo: '',
                mobile: '',
                email: '',
                firstName: '',
                lastName: '',
                middleName: '',
                salutation: '',
                passposrtNo: '',
                passportIssuingAthority: '',
                passportExpirydate: '',
                passportDocument: '',
                voterCardNo: '',
                voterCardDocument: '',
                pancardNo: '',
                pancardDocument: '',
                webURL: '',
                files: {
                    passportDocument: null,
                    idCardDocument: null,
                    panCardDocument: null,
                }, // Store different file types separately
                nationality: '',
                userName:userName,
                partnerDetailId:'',
                addressId:'',
            }
        ]
    });
    const [formErrors, setFormErrors] = useState({
    });
   

    useEffect(() => {
        if (userName) { // Ensure userName is defined and not empty
            setCommunicationAddressFormValues((prevState) => ({
                ...prevState,
                partnerDetails: prevState.partnerDetails.map((partner) => ({
                    ...partner,
                    userName: userName // Update the userName for each partner
                }))
            }));
        }
    }, [userName]);

    const nationalityOptions = countryList.map(country => ({
        label: country.nationality,
        value: country.nationality
      }));

    
    const validateForm = () => {
        const errors = {};
        errors.partnerDetails = [];

        communicationAddressFormValues.partnerDetails.map((partner, index) => {
            if (!errors.partnerDetails[index]) {
                errors.partnerDetails[index] = {};
            }
            console.log('Before Validation:', errors.partnerDetails[index]);
            // Validate blockNo
            if (!partner.blockNo) {
                errors.partnerDetails[index].blockNo = errorMsg.blockNo.blank;
            } else if (partner.blockNo.length < 3 || partner.blockNo.length > 20) {
                errors.partnerDetails[index].blockNo = errorMsg.blockNo.length;
            }

            // Validate village
            if (!partner.village) {
                errors.partnerDetails[index].village = errorMsg.village.blank;
            } else if (partner.village.length < 3 || partner.village.length > 50) {
                errors.partnerDetails[index].village = errorMsg.village.length;
            }

            // Validate postOffice
            if (!partner.postOffice) {
                errors.partnerDetails[index].postOffice = errorMsg.postOffice.blank;
            } else if (partner.postOffice.length < 3 || partner.postOffice.length > 50) {
                errors.partnerDetails[index].postOffice = errorMsg.postOffice.length;
            }

            // Validate subDivision
            if (!partner.subDivision) {
                errors.partnerDetails[index].subDivision = errorMsg.subDivision.blank;
            } else if (partner.subDivision.length < 3 || partner.subDivision.length > 50) {
                errors.partnerDetails[index].subDivision = errorMsg.subDivision.length;
            }

            // Validate country
            if (!partner.country) {
                errors.partnerDetails[index].country = errorMsg.country.blank;
            }

            // Validate state
            if (!partner.state) {
                errors.partnerDetails[index].state = errorMsg.state.blank;
            }

            // Validate city
            if (!partner.city) {
                errors.partnerDetails[index].city = errorMsg.city.blank;
            }

            // Validate pin
            if (!partner.pin) {
                errors.partnerDetails[index].pin = errorMsg.pin.blank;
            } else if (!/^\d{6}$/.test(partner.pin)) {
                errors.partnerDetails[index].pin = errorMsg.pin.format;
            }

            // Validate fax
            if (!partner.fax) {
                errors.partnerDetails[index].fax = errorMsg.fax.blank;
            } else if (isNaN(partner.fax)) {
                errors.partnerDetails[index].fax = errorMsg.fax.format;
            }

            // Validate telephoneNo
            if (!partner.telephoneNo) {
                errors.partnerDetails[index].telephoneNo = errorMsg.telephoneNo.blank;
            } else if (isNaN(partner.telephoneNo)) {
                errors.partnerDetails[index].telephoneNo = errorMsg.telephoneNo.format;
            }

            // Validate mobile
            if (!partner.mobile) {
                errors.partnerDetails[index].mobile = errorMsg.mobile.blank;
            } else if (!/^\d{10}$/.test(partner.mobile)) {
                errors.partnerDetails[index].mobile = errorMsg.mobile.format;
            }

            // Validate salutation
            if (!partner.salutation) {
                errors.partnerDetails[index].salutation = errorMsg.salutation.blank;
            }

            // Validate firstName
            if (!partner.firstName) {
                errors.partnerDetails[index].firstName = errorMsg.firstName.blank;
            } else if (partner.firstName.length < 3 || partner.firstName.length > 30) {
                errors.partnerDetails[index].firstName = errorMsg.firstName.length;
            } else if (!/^[A-Za-z]+$/.test(partner.firstName)) {
                errors.partnerDetails[index].firstName = errorMsg.firstName.format;
            }

            // Validate middleName
            if (partner.middleName) {
                if (partner.middleName.length < 3 || partner.middleName.length > 30) {
                    errors.partnerDetails[index].middleName = errorMsg.middleName.length;
                } else if (!/^[A-Za-z]+$/.test(partner.middleName)) {
                    errors.partnerDetails[index].middleName = errorMsg.middleName.format;
                }
            }

            // Validate lastName
            if (!partner.lastName) {
                errors.partnerDetails[index].lastName = errorMsg.lastName.blank;
            } else if (partner.lastName.length < 3 || partner.lastName.length > 30) {
                errors.partnerDetails[index].lastName = errorMsg.lastName.length;
            } else if (!/^[A-Za-z]+$/.test(partner.lastName)) {
                errors.partnerDetails[index].lastName = errorMsg.lastName.format;
            }

            // Validate email
            // if (!partner.email) {
            //     errors.partnerDetails[index].email = errorMsg.emailId.blank;
            // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partner.email)) {
            //     errors.partnerDetails[index].email = errorMsg.emailId.format;
            // }

            // alert(`passport Card Number: ${partner.passposrtNo}`);
           // Check if all relevant fields are empty
 // Check if all relevant fields are empty
 if (!partner.passposrtNo && !partner.voterCardNo && !partner.pancardNo) {
    errors.partnerDetails[index].general = "At least one of Passport No, Voter ID, or PAN Card must be filled.";
} else {
    delete errors.partnerDetails[index].general;

    // Validate passport fields only if passportNo is filled
    if (partner.passposrtNo) {
        if (!partner.passportIssuingAthority) {
            errors.partnerDetails[index].passportIssuingAuthority = errorMsg.passportIssuingAuthority;
        } else {
            delete errors.partnerDetails[index].passportIssuingAuthority;
        }

        if (!partner.passportExpirydate) {
            errors.partnerDetails[index].passportExpiryDate = errorMsg.passportExpiryDate.required;
        } else {
            delete errors.partnerDetails[index].passportExpiryDate;
        }
    } else {
        delete errors.partnerDetails[index].passportIssuingAuthority;
        delete errors.partnerDetails[index].passportExpiryDate;
    }

    // Validate voterCardNo only if it is filled
    if (partner.voterCardNo) {
        delete errors.partnerDetails[index].voterCardNo;
    }

    // Validate pancardNo only if it is filled
    if (partner.pancardNo) {
        delete errors.partnerDetails[index].pancardNo;
    } 
}
            // Validate webURL
            if (partner.webURL && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(partner.webURL)) {
                errors.partnerDetails[index].webURL = errorMsg.webURL.format;
            }

             // Validate city
             if (!partner.nationality) {
                errors.partnerDetails[index].nationality = errorMsg.nationality;
            }


            // Validate files
            // if (!partner.file1) {
            //     errors.partnerDetails[index].file1 = errorMsg.file1;
            // }
            // if (!partner.file2) {
            //     errors.partnerDetails[index].file2 = errorMsg.file2;
            // }
            // if (!partner.file3) {
            //     errors.partnerDetails[index].file3 = errorMsg.file3;
            // }

            console.log('After Validation:', errors.partnerDetails[index]);

            if (Object.keys(errors.partnerDetails[index]).length === 0) {
                delete errors.partnerDetails[index];
            }
        });

        // Filter out any empty objects from partnerDetails
        errors.partnerDetails = errors.partnerDetails.filter(obj => Object.keys(obj).length !== 0);
        console.log(errors.partnerDetails.length)
        // If there are no errors in partnerDetails, remove it from the errors object
        if (errors.partnerDetails.length === 0) {
            delete errors.partnerDetails;
        }

        return errors;
    };

    const salutationData = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredState, setFilteredState] = useState([]);
    const [filteredCitie, setFilteredCitie] = useState([]);

    // console.log(filteredCitie, "", filteredState)
    useEffect(() => {
        StateService.getAllStateList().then(data => {
            setStates(data.data);
        }).catch(error => {
            console.error("Error fetching states:", error);
        });
    }, []);

    useEffect(() => {
        CountryService.getAllCountryList().then(data => {
            setCountries(data.data);
        }).catch(error => {
            console.error("Error fetching countries:", error);
        });
    }, []);

    useEffect(() => {
        CityService.getAllCityList().then(data => {
            setCities(data.data);
        }).catch(error => {
            console.error("Error fetching cities:", error);
        });
    }, []);

    console.log(communicationAddressFormValues)
    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
    
        // Create a copy of the partnerDetails array to update the specific partner's details
        const updatedPartnerDetails = [...communicationAddressFormValues.partnerDetails];
        const updatedPartner = {
            ...updatedPartnerDetails[index],
            [name]: value
        };
    
        // Handle country change
        if (name === "country") {
            const filteredStates = states.filter(state => state.countryId.countryId === parseInt(value));
            setFilteredState(filteredStates);
            // Reset state and city when country changes
            updatedPartner.state = '';
            updatedPartner.city = '';
        }
    
        // Handle state change
        if (name === "state") {
            const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(value));
            setFilteredCitie(filteredCities);
            // Reset city when state changes
            updatedPartner.city = '';
        }
    
        // Update the form values with the updated partner details
        updatedPartnerDetails[index] = updatedPartner;
        setCommunicationAddressFormValues(prevState => ({
            ...prevState,
            partnerDetails: updatedPartnerDetails
        }));
    };
    

    const handleDateChange = (name, date, index) => {
        console.log('Current State:', communicationAddressFormValues);

        const isValidDate = (date) => {
            return dayjs(date).isValid();
        };

        if (!isValidDate(date)) {
            console.error('Invalid date:', date);
            return;
        }

        const formatDate = (date) => {
            return dayjs(date).format('YYYY-MM-DD');
        };

        const formattedDate = formatDate(date);

        setCommunicationAddressFormValues(prevValues => {
            console.log('Previous Values:', prevValues);

            // Ensure partnerDetails is an array
            const partnerDetailsArray = Array.isArray(prevValues.partnerDetails) ? prevValues.partnerDetails : [];

            return {
                ...prevValues,
                partnerDetails: partnerDetailsArray.map((detail, i) =>
                    i === index ? { ...detail, [name]: formattedDate } : detail
                )
            };
        });
    };
    const allowedFileTypes = ['application/pdf'];
    const handleAutoComplete = (name, value, index) => {
        setCommunicationAddressFormValues((prevValues) => {
            // Create a deep copy of partnerDetails array
            const updatedPartnerDetails = [...prevValues.partnerDetails];
            
            // Update the nationality for the specific partner at the given index
            updatedPartnerDetails[index] = {
                ...updatedPartnerDetails[index],
                [name]: value
            };
    
            const updatedValues = {
                ...prevValues,
                partnerDetails: updatedPartnerDetails
            };
    
            console.log(updatedValues);
    
            return updatedValues;
        });
    };
    


    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event, index, field) => {
        const file = event.target.files[0]; // Get the uploaded file
        let errorMessage = '';
    
        if (file) {
            // Check file type
            if (!allowedFileTypes.includes(file.type)) {
                errorMessage = 'Only PDF files are allowed';
            }
    
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                errorMessage = 'File size must be less than 5MB';
            }
    
            // If there's an error, set it for this specific field and index, then stop further execution
            if (errorMessage) {
                setFormErrors(prevErrors => ({
                    ...prevErrors,
                    [index]: {
                        ...(prevErrors?.[index] || {}),
                        [field]: errorMessage
                    }
                }));
                return;
            }
    
            // Clear the error for this field and index if validation passed
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [index]: {
                    ...(prevErrors?.[index] || {}),
                    [field]: '' // Clear specific error
                }
            }));
    
            // Create a shallow copy of the partnerDetails array
            const updatedPartnerDetails = [...communicationAddressFormValues.partnerDetails];
    
            // Update the specific file field in the files object
            updatedPartnerDetails[index].files[field] = {
                fileName: file.name,
                fileObject: file
            };
    
            // Update the communicationAddressFormValues state with the updated partnerDetails
            setCommunicationAddressFormValues(prevValues => ({
                ...prevValues,
                partnerDetails: updatedPartnerDetails
            }));
        }
    };
    
    
    
    
    
    const [fileInputKey3, setFileInputKey3] = useState(Date.now());
    const [fileName3, setFileName3] = useState('');

    const handleFileChange3 = (e) => {
        const file = e.target.files[0];
        setCommunicationAddressFormValues(prevValues => ({
            ...prevValues,
            file: file
        }));
        setFileName3(file ? file.name : '');
    };
    const [fileInputKey2, setFileInputKey2] = useState(Date.now());
    const [fileName2, setFileName2] = useState('');

    const handleFileChange2 = (e) => {
        const file = e.target.files[0];
        setCommunicationAddressFormValues({
            ...communicationAddressFormValues,
            file2: file
        });
        setFileName2(file ? file.name : '');
    };
    const handleBacks = () => {
        handleBack();
    }

    const MAX_EMAIL_IDS = 3;

    const handleAddssField = () => {
        const newDetails = [
            ...communicationAddressFormValues.partnerDetails,
            {
                blockNo: '',
                village: '',
                postOffice: '',
                subDivision: '',
                country: '',
                city: '',
                state: '',
                pin: '',
                fax: '',
                telephoneNo: '',
                mobile: '',
                email: '',
                firstName: '',
                lastName: '',
                middleName: '',
                salutation: '',
                passportNo: '',
                passportIssuingAthority: '',
                passportExpirydate: '',
                voterCardNo: '',
                nationality:'',
                webURL: '',
                userName:userName,
                files: {
                    passportDocument: null,
                    idCardDocument: null,
                    panCardDocument: null,
                } // Empty files object for new partner
            }
        ];
        setCommunicationAddressFormValues(prevValues => ({
            ...prevValues,
            partnerDetails: newDetails
        }));
    };
    

    const handleRemovessField = (index) => {
        const newDetails = [...communicationAddressFormValues.partnerDetails];
        newDetails.splice(index, 1);
        setCommunicationAddressFormValues(prevValues => ({ ...prevValues, partnerDetails: newDetails }));
    };

    const appendPartnerDetailsToFormData = (formData, partnerDetails) => {
        partnerDetails.forEach((partner, index) => {
            Object.keys(partner).forEach((key) => {
                if (key === 'file1' || key === 'file2' || key === 'file3') {
                    const file = partner[key];
                    if (file instanceof File) { // Check if it's a File object
                        formData.append(`partnerDetails[${index}].${key}`, file);
                    }
                } else {
                    // Append other fields
                    formData.append(`partnerDetails[${index}].${key}`, partner[key] ?? '');
                }
            });
        });
    };
    
    useEffect(() => {
        if (userName) {
            console.log(userName);
            setLoading(true);
            FirmApplicationForm.getAllFirmApplication3(userName)
                .then((response) => {
                    console.log("abc1244===>", response.data);
    
                    const responseData = response.data;
    
                    // Check if there's any data in the response
                    if (!responseData || Object.keys(responseData).length === 0) {
                        console.log("No data found in response");
                        setLoading(false);
                        return; // Exit early if no data is found
                    }
    
                    // Function to map response to form values
                    const updateFormValues = (responseData) => {
                        const appFirmApplication = Array.isArray(responseData.appFirmApplications) ? responseData.appFirmApplications : [];
                        const addressDTOs = Array.isArray(responseData.addressDTOs) ? responseData.addressDTOs : [];
                        console.log("addressDTOs====>", appFirmApplication);
                        
                        // Check if there are any entries in appFirmApplication and addressDTOs
                        if (appFirmApplication.length === 0 || addressDTOs.length === 0) {
                            console.log("Empty appFirmApplication or addressDTOs");
                            setLoading(false);
                            return; // Exit early if no application or address data
                        } else {
    
                        // Map each partner detail and corresponding address
                        const updatedPartnerDetails = appFirmApplication.map((partner) => {
                            // Find the matching address from addressDTOs based on the addressId
                            const correspondingAddress = addressDTOs.find(
                                (address) => address.addressId === decrypt(partner.addressId)
                            ) || {};
    
                            console.log("abc1244456===>", correspondingAddress);
    
                            // Return the partner details with the matching address data
                            return {
                                // Map partner details from appFirmApplication
                                salutation: partner.salutation || '',
                                firstName: partner.firstName || '',
                                middleName: partner.middleName || '',
                                lastName: partner.lastName || '',
                                telephoneNo: partner.telephoneNo || '',
                                mobile: partner.mobileNo || '',
                                fax: partner.fax || '',
                                email: partner.emailId || '',
                                nationality: partner.nationality || '',
                                passposrtNo: partner.passportNo || '',
                                passportIssuingAthority: partner.passportIssuingAuthority || '',
                                passportExpirydate: partner.passportExpiryDate || '',
                                passportDocument: partner.passportDocument || '',
                                voterCardNo: partner.voterIdCard || '',
                                voterCardDocument: partner.voterIdCardDocument || '',
                                pancardNo: partner.pan || '',
                                pancardDocument: partner.panDocument || '',
                                webURL: partner.personalWebPage || '',
                                userName: partner.userName || '',
                                files: {
                                    passportDocument: partner.passportDocument ? {
                                        fileObject: partner.passportDocument, // Actual file object
                                        fileName: partner.passportDocument // Ensure this is the name
                                    } : null,
                                    idCardDocument: partner.voterIdCardDocument ? {
                                        fileObject: partner.voterIdCardDocument,
                                        fileName: partner.voterIdCardDocument // Ensure this is the name
                                    } : null,
                                    panCardDocument: partner.panDocument ? {
                                        fileObject: partner.panDocument,
                                        fileName: partner.panDocument // Ensure this is the name
                                    } : null,
                                },
                                // Map the corresponding address details based on addressId match
                                blockNo: correspondingAddress.blockNo || '',
                                village: correspondingAddress.village || '',
                                postOffice: correspondingAddress.postOffice || '',
                                subDivision: correspondingAddress.subDivision || '',
                                country: correspondingAddress.country || '',
                                city: correspondingAddress.city || '',
                                state: correspondingAddress.state || '',
                                pin: correspondingAddress.pin || '',
                                partnerDetailId:String(partner.partnerDetailId)|| '',
                                addressId:correspondingAddress.addressId||'',
                                userName:userName,

                            };
                        });
                    
                        // Set the updated partner details in the state
                        setCommunicationAddressFormValues(prevState => ({
                            ...prevState,
                            partnerDetails: updatedPartnerDetails, // Overwrite the partnerDetails array with new data
                        }));
                    };
                }
                    // Update the form values with the response data
                    updateFormValues(responseData);
    
                    // Check if addressDTOs has valid data for filtering
                    if (responseData.addressDTOs && responseData.addressDTOs.length > 0) {
                        const currentCountryId = responseData.addressDTOs[0]?.country;
                        const currentStateId = responseData.addressDTOs[0]?.state;
    
                        if (currentCountryId && currentStateId) {
                            // Filter states and cities based on current country and state
                            const filteredStates = states.filter(state => state.countryId.countryId === parseInt(currentCountryId));
                            const filteredCities = cities.filter(city => city.stateId.stateId === parseInt(currentStateId));
    
                            setFilteredState(filteredStates);
                            setFilteredCitie(filteredCities);
                        }
                    }
                })
                .catch((err) => {
                    console.log("Error fetching firm application:", err);
                    // Handle error (e.g., navigate or display a message)
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Handle case where `userName` is not available (e.g., navigate or display a message)
        }
    }, [userName, states, cities]);
    
    console.log("ser=====>",JSON.stringify(communicationAddressFormValues));
    
    
    
    
    const [isLoading, setLoading] = useState(false);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLoading(true); // Start loading state
    
        // Validate the form
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            console.log('Form is valid, proceed with submission.');
    
            // Prepare FormData
            const formData = new FormData();
    
            // Append the partnerDetails JSON
           formData.append('partnerDetails', JSON.stringify(communicationAddressFormValues.partnerDetails));
    
            // Loop through partnerDetails array to append each partner's files
            communicationAddressFormValues.partnerDetails.forEach((partner, index) => {
                // Array of file keys to check and append

                formData.append('partnerDetails', JSON.stringify(partner))
                const fileKeys = ['passportDocument', 'idCardDocument', 'panCardDocument'];
    
                // Append file fields if they exist
                fileKeys.forEach(fileKey => {
                    if (partner.files && partner.files[fileKey]) { // Check if partner.files and specific fileKey exist
                        const file = partner.files[fileKey].fileObject; 
                        console.log("Attempting to append file for key: " + fileKey);
                
                        if (file) {
                            // Log the details of the file being appended
                            console.log(`Appending file: ${file.name} for key: ${fileKey}`);
                            formData.append(`files[${fileKey}][${index}]`, file); // Append with key indicating the file type
                        } else {
                            console.warn(`No file found for ${fileKey} in partner ${index}`);
                        }
                    } else {
                        console.warn(`No files found for ${fileKey} in partner ${index}`);
                    }
                });
            });
    
            formData.forEach((value, key) => {
                if (value instanceof File) {
                    // If the value is a file, log its details
                    console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
                } else {
                    // Otherwise, log the value directly
                    console.log(`${key}: ${value}`);
                }
            });
            // Simulate API call to handle form submission
            const requestMethod = communicationAddressFormValues.partnerDetails[0]?.partnerDetailId ? FirmApplicationForm.updateFirmApplication3: FirmApplicationForm.addNewFirmApplication3;
    
            requestMethod(formData) // Passing the FormData to the request
                .then((response) => {
                    // Handling the response
                    showAlert({
                        messageTitle: 'Successful',
                        messageContent: 'Page saved successfully',
                        confirmText: 'Ok',
                        onConfirm: () => { handleNext(); }
                    });
                })
                .catch((err) => {
                    // Show error message if API fails
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: err.response?.data
                            ? typeof err.response.data === 'object'
                                ? 'Your request cannot be processed at this time. Please try again later.'
                                : err.response.data
                            : 'Your request cannot be processed at this time. Please try again later.',
                        confirmText: 'Ok',
                    });
                })
                .finally(() => {
                    setLoading(false); // Stop loading state
                });
    
        } else {
            console.log('Validation errors:', errors);
            setFormErrors(errors); // Set the errors to display in the UI
            setLoading(false); // Stop loading state if validation fails
        }
    };
    

    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>

            {communicationAddressFormValues.partnerDetails.map((reacord, index) => (
                <React.Fragment key={index}>
                    <Grid container sx={{ mt: 1, mb: 1, alignItems: 'center' }}>
                        <Grid item xs>
                            <Typography variant='h6' sx={{ mt: 1 }}>{communicationAddressFormValues.partnerDetails.length > 1 ? `${index + 1}. ` : ''} Details of Partners/Members/Directors (26)</Typography>
                        </Grid>
                        <Grid item xs={1} sm={0.5} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            {communicationAddressFormValues.partnerDetails.length > 1 && index === communicationAddressFormValues.partnerDetails.length - 1 && communicationAddressFormValues.partnerDetails.length < MAX_EMAIL_IDS ? (
                                <>
                                    <Tooltip title="Add More">
                                        <IconButton
                                            sx={{
                                                width: 36, // Adjust the width
                                                height: 36, // Adjust the height
                                                mt: { sm: 2 },
                                                color: 'success.main' // Simplified without hover effect
                                            }}
                                            onClick={handleAddssField}
                                        >
                                            <AddIcon sx={{ fontSize: '2rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove">
                                        <IconButton
                                            sx={{
                                                width: 36, // Adjust the width
                                                height: 36, // Adjust the height
                                                mt: { sm: 2 },
                                                color: 'error.main' // Simplified without hover effect
                                            }}
                                            onClick={() => handleRemovessField(index)}
                                        >
                                            <RemoveIcon sx={{ fontSize: '2rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : communicationAddressFormValues.partnerDetails.length === 1 ? (
                                <Tooltip title="Add More">
                                    <IconButton
                                        sx={{
                                            width: 36, // Adjust the width
                                            height: 36, // Adjust the height
                                            mt: { sm: 2 },
                                            color: 'success.main' // Simplified without hover effect
                                        }}
                                        onClick={handleAddssField}
                                    >
                                        <AddIcon sx={{ fontSize: '2rem' }} />
                                    </IconButton>
                                </Tooltip>
                            ) : communicationAddressFormValues.partnerDetails.length === MAX_EMAIL_IDS && index === MAX_EMAIL_IDS - 1 ? (
                                <Tooltip title="Remove">
                                    <IconButton
                                        sx={{
                                            width: 36, // Adjust the width
                                            height: 36, // Adjust the height
                                            mt: { sm: 2 },
                                            color: 'error.main' // Simplified without hover effect
                                        }}
                                        onClick={() => handleRemovessField(index)}
                                    >
                                        <RemoveIcon sx={{ fontSize: '2rem' }} />
                                    </IconButton>
                                </Tooltip>
                            ) : (<></>)}
                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 1, mb: 1 }}>
                        <Grid item>
                            <Typography variant='h6' sx={{ mt: 1 }}>a. Full Name</Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>

                            <InputLabel shrink={false} htmlFor={"salutation"}>
                                <Typography variant='body1' >Salutation*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select defaultValue="" id="salutation"
                                    displayEmpty
                                    name="salutation"
                                    value={communicationAddressFormValues.partnerDetails[index]?.salutation || ''}
                                    onChange={(event) => handleInputChange(event, index)}
                                    sx={{
                                        width: { xs: '100%', sm: '100%' },
                                    }}

                                    error={
                                        Boolean((formErrors.partnerDetails && formErrors.partnerDetails[index]?.salutation))
                                    }
                                >
                                    <MenuItem disabled value="">
                                        Salutation
                                    </MenuItem>
                                    {salutationData.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>

                                {(formErrors.partnerDetails && formErrors.partnerDetails[index]?.salutation) && (
                                    <FormHelperText error sx={{ ml: 0 }}>{(formErrors.partnerDetails && formErrors.partnerDetails[index]?.salutation)}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <InputLabel shrink={false} htmlFor={"firstName"}>
                                <Typography variant='body1'>First Name*</Typography>
                            </InputLabel>
                            <TextField
                                id="firstName"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='First Name'
                                name="firstName"
                                variant='outlined'
                                value={communicationAddressFormValues.partnerDetails[index]?.firstName || ''}

                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.firstName)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.firstName) || ''}
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                                onChange={(event) => handleInputChange(event, index)}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            // onKeyDown={(e) => ValidatePattern(e,/^[A-Za-z]+$/)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <InputLabel shrink={false} htmlFor={"middleName"}>
                                <Typography variant='body1'>Middle Name</Typography>
                            </InputLabel>
                            <TextField
                                id="middleName"
                                margin="dense"
                                fullWidth
                                placeholder='Middle Name'
                                name="middleName"
                                variant='outlined'
                                value={communicationAddressFormValues.partnerDetails[index]?.middleName || ''}
                                onChange={(event) => handleInputChange(event, index)}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <InputLabel shrink={false} htmlFor={"lastName"}>
                                <Typography variant='body1'>Last Name/Surname*</Typography>
                            </InputLabel>
                            <TextField
                                id="lastName"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Last Name'
                                name="lastName"
                                value={communicationAddressFormValues.partnerDetails[index]?.lastName || ''}
                                onChange={(event) => handleInputChange(event, index)}
                                variant='outlined'
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.lastName)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.lastName) || ''}
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 1, mb: 1 }}>
                        <Grid item>
                            <Typography variant='h6' sx={{ mt: 1 }}>b. Address</Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="blockNo">
                                <Typography variant='body1'>Flat/Door/Block No*</Typography>
                            </InputLabel>
                            <TextField
                                id="blockNo"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Flat/Door/Block No'
                                name="blockNo"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                value={communicationAddressFormValues.partnerDetails[index]?.blockNo || ''}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.blockNo)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.blockNo) || ''}
                                size="small"
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9A-Za-z.-]+$/)}
                                inputProps={{ maxLength: 15 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="village">
                                <Typography variant='body1'>Name of Premises/Building/Village*</Typography>
                            </InputLabel>
                            <TextField
                                id="village"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Name of Premises/Building/Village'
                                name="village"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                                value={communicationAddressFormValues.partnerDetails[index]?.village || ''}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.village)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.village) || ''}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 0.1 }}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="postOffice">
                                <Typography variant='body1'>Road/Street/Lane/Post Office*</Typography>
                            </InputLabel>
                            <TextField
                                id="postOffice"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Road/Street/Lane/Post Office'
                                name="postOffice"
                                variant='outlined'
                                value={communicationAddressFormValues.partnerDetails[index]?.postOffice || ''}
                                onChange={(event) => handleInputChange(event, index)}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.postOffice)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.postOffice) || ''}
                                size="small"
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="subDivision">
                                <Typography variant='body1'>Area/Locality/Taluka/Sub-Division*</Typography>
                            </InputLabel>
                            <TextField
                                id="subDivision"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Area/Locality/Taluka/Sub-Division'
                                name="subDivision"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                value={communicationAddressFormValues.partnerDetails[index]?.subDivision || ''}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.subDivision)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.subDivision) || ''}
                                size="small"
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 0.1 }}>
    {/* Country Dropdown */}
    <Grid item xs={12} sm={3}>
        <InputLabel shrink={false} htmlFor="country">
            <Typography variant='body1'>Country*</Typography>
        </InputLabel>
        <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
            <Select
                id="country"
                name="country"
                displayEmpty
                required
                value={communicationAddressFormValues.partnerDetails[index]?.country || ''}
                onChange={(event) => handleInputChange(event, index)}
                error={
                    Boolean(formErrors.partnerDetails && formErrors.partnerDetails[index]?.country)
                }
            >
                <MenuItem disabled value="">
                    Select Country
                </MenuItem>
                {countries.map(country => (
                    <MenuItem key={country.countryId} value={country.countryId}>
                        {country.countryName}
                    </MenuItem>
                ))}
            </Select>
            {(formErrors.partnerDetails && formErrors.partnerDetails[index]?.country) && (
                <FormHelperText error sx={{ ml: 0 }}>
                    {formErrors.partnerDetails[index]?.country}
                </FormHelperText>
            )}
        </FormControl>
    </Grid>

    {/* State Dropdown */}
    <Grid item xs={12} sm={3}>
        <InputLabel shrink={false} htmlFor="state">
            <Typography variant='body1'>State/Province*</Typography>
        </InputLabel>
        <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
            <Select
                id="state"
                name="state"
                required
                displayEmpty
                value={communicationAddressFormValues.partnerDetails[index]?.state || ''}
                onChange={(event) => handleInputChange(event, index)}
                error={
                    Boolean(formErrors.partnerDetails && formErrors.partnerDetails[index]?.state)
                }
            >
                <MenuItem disabled value="">
                    Select State/Province
                </MenuItem>
                {filteredState.map(state => (
                    <MenuItem key={state.stateId} value={state.stateId}>
                        {state.stateName}
                    </MenuItem>
                ))}
            </Select>
            {(formErrors.partnerDetails && formErrors.partnerDetails[index]?.state) && (
                <FormHelperText error sx={{ ml: 0 }}>
                    {formErrors.partnerDetails[index]?.state}
                </FormHelperText>
            )}
        </FormControl>
    </Grid>

    {/* City Dropdown */}
    <Grid item xs={12} sm={3}>
        <InputLabel shrink={false} htmlFor="city">
            <Typography variant='body1'>District*</Typography>
        </InputLabel>
        <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
            <Select
                id="city"
                name="city"
                required
                displayEmpty
                value={communicationAddressFormValues.partnerDetails[index]?.city || ''}
                onChange={(event) => handleInputChange(event, index)}
                error={
                    Boolean(formErrors.partnerDetails && formErrors.partnerDetails[index]?.city)
                }
            >
                <MenuItem disabled value="">
                    Select District
                </MenuItem>
                {filteredCitie.map(city => (
                    <MenuItem key={city.cityId} value={city.cityId}>
                        {city.cityName}
                    </MenuItem>
                ))}
            </Select>
            {(formErrors.partnerDetails && formErrors.partnerDetails[index]?.city) && (
                <FormHelperText error sx={{ ml: 0 }}>
                    {formErrors.partnerDetails[index]?.city}
                </FormHelperText>
            )}
        </FormControl>
    </Grid>

    {/* Pin Code Input */}
    <Grid item xs={12} sm={3}>
        <InputLabel shrink={false} htmlFor="pin">
            <Typography variant='body1'>Pin*</Typography>
        </InputLabel>
        <TextField
            id="pin"
            margin="dense"
            required
            fullWidth
            placeholder='Pin'
            name="pin"
            variant='outlined'
            value={communicationAddressFormValues.partnerDetails[index]?.pin || ''}
            onChange={(event) => handleInputChange(event, index)}
            error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.pin)}
            helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.pin) || ''}
            onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
            size="small"
            inputProps={{ maxLength: 6 }}
        />
    </Grid>
</Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="telephoneNo">
                                <Typography variant='body1'>Telephone No*</Typography>
                            </InputLabel>
                            <TextField
                                id="telephoneNo"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Telephone No'
                                name="telephoneNo"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.telephoneNo)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.telephoneNo) || ''}
                                value={communicationAddressFormValues.partnerDetails[index]?.telephoneNo || ''}
                                size="small"
                                inputProps={{ maxLength: 12 }}
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="fax">
                                <Typography variant='body1'>Fax*</Typography>
                            </InputLabel>
                            <TextField
                                id="fax"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Fax'
                                name="fax"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                value={communicationAddressFormValues.partnerDetails[index]?.fax || ''}
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.fax)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.fax) || ''}
                                size="small"
                                inputProps={{ maxLength: 12 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="mobile">
                                <Typography variant='body1'>Mobile*</Typography>
                            </InputLabel>
                            <TextField
                                id="mobile"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Mobile'
                                name="mobile"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                value={communicationAddressFormValues.partnerDetails[index]?.mobile || ''}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.mobile)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.mobile) || ''}
                                size="small"
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>
                    </Grid>
                    {/* Official Address Section */}
                    <Grid container spacing={2} sx={{ mt: 0.1 }}>
                      

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="emailId">
                                <Typography variant='body1'>Email Address*</Typography>
                            </InputLabel>
                            <TextField
                                id="email"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Email Address'
                                name="email"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                value={communicationAddressFormValues.partnerDetails[index]?.email || ''}
                                 error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.email)}
                                 helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.email) || ''}
                                size="small"
                                //onKeyDown={(e) => ValidatePattern(e,/^[0-9A-Za-z]+$/)}
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="webURL">
                                <Typography variant='body1'>Web Page URL Address</Typography>
                            </InputLabel>
                            <TextField
                                id="webURL"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='URL Address'
                                name="webURL"
                                variant='outlined'
                                onChange={(event) => handleInputChange(event, index)}
                                value={communicationAddressFormValues.partnerDetails[index]?.webURL || ''}
                                size="small"

                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
  <InputLabel shrink={false} htmlFor="nationality">
    <Typography variant='body1'>Nationality*</Typography>
  </InputLabel>

  <FormControl sx={{ mt: 1, width: '100%' }}>
    <Autocomplete
      id="nationality"
      onChange={(event, newValue) => {
        // Pass the index and name to the handleAutoComplete function
        handleAutoComplete('nationality', newValue ? newValue.value : '', index);
      }}
      value={
        nationalityOptions.find(option => option.value === communicationAddressFormValues.partnerDetails?.[index]?.nationality) || null
      }
      name="nationality"
      options={nationalityOptions}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Nationality"
          variant="outlined"
          size="small"
          error={!!formErrors.partnerDetails && !!formErrors.partnerDetails[index]?.nationality}
        />
      )}
    />

    {formErrors.partnerDetails && formErrors.partnerDetails[index]?.nationality && (
      <FormHelperText error sx={{ ml: 0 }}>
        {formErrors.partnerDetails[index]?.nationality}
      </FormHelperText>
    )}
  </FormControl>
</Grid>
</Grid>
{/* Conditionally render Visa fields if nationality is not Indian */}
{communicationAddressFormValues.partnerDetails?.[index]?.nationality !== 'Indian' && (
  <>
     <Grid container spacing={2}>
    <Grid item xs={12} sm>
      <InputLabel shrink={false} htmlFor="visaType">
        <Typography variant='body1'>Visa Type*</Typography>
      </InputLabel>
      <TextField
        id="visaType"
        name="visaType"
        value={communicationAddressFormValues.partnerDetails?.[index]?.visaType || ''}
        onChange={(e) => handleAutoComplete('visaType', e.target.value, index)}
        fullWidth
        variant="outlined"
        size="small"
      />
    </Grid>

    <Grid item xs={12} sm>
      <InputLabel shrink={false} htmlFor="visaNumber">
        <Typography variant='body1'>Visa Number*</Typography>
      </InputLabel>
      <TextField
        id="visaNumber"
        name="visaNumber"
        value={communicationAddressFormValues.partnerDetails?.[index]?.visaNumber || ''}
        onChange={(e) => handleAutoComplete('visaNumber', e.target.value, index)}
        fullWidth
        variant="outlined"
        size="small"
      />
    </Grid>
    </Grid>
    <Grid container spacing={2}>
    <Grid item xs={12} sm>
      <InputLabel shrink={false} htmlFor="visaIssueDate">
        <Typography variant='body1'>Visa Issue Date*</Typography>
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          id="visaIssueDate"
          name="visaIssueDate"
          maxDate={dayjs()}
          value={communicationAddressFormValues.partnerDetails?.[index]?.visaIssueDate ? dayjs(communicationAddressFormValues.partnerDetails?.[index]?.visaIssueDate) : null}
          onChange={(date) => handleAutoComplete('visaIssueDate', date ? date.toISOString() : '', index)}
          disableFuture
            slotProps={{
                textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: "Visa Issue Date ",
                     error: !!formErrors.dob,
                        helperText: formErrors.dob || ''
                }
            }}
            sx={{ mt: 1 }}
        />
      </LocalizationProvider>
    </Grid>

    <Grid item xs={12} sm>
      <InputLabel shrink={false} htmlFor="visaExpiryDate">
        <Typography variant='body1'>Visa Expiry Date*</Typography>
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          id="visaExpiryDate"
          name="visaExpiryDate"
          value={communicationAddressFormValues.partnerDetails?.[index]?.visaExpiryDate ? dayjs(communicationAddressFormValues.partnerDetails?.[index]?.visaExpiryDate) : null}
          onChange={(date) => handleAutoComplete('visaExpiryDate', date ? date.toISOString() : '', index)}
          disableFuture
          maxDate={dayjs()}
          slotProps={{
            textField: {
                size: 'small',
                fullWidth: true,
                placeholder: "Visa Expiry Date ",
                 error: !!formErrors.dob,
                    helperText: formErrors.dob || ''
            }
        }}
        sx={{ mt: 1 }}
        />
      </LocalizationProvider>
    </Grid>
    </Grid>
  </>
)}

<Grid container sx={{ mt: 1, mb: 1 }}>
    <Grid item>
        <Typography variant='h6' sx={{ mt: 1 }}>C. Id Card Details</Typography>
    </Grid>
    <Grid item sx={{ mt: 1, mb: 1, ml: 2 }}>
        {formErrors.partnerDetails && formErrors.partnerDetails[index] && formErrors.partnerDetails[index].general && (
            <FormHelperText error>
                {formErrors.partnerDetails[index].general}
            </FormHelperText>
        )}
    </Grid>
</Grid>


                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"passposrtNo"}>
                                <Typography variant='body1'>Passport No#</Typography>
                            </InputLabel>
                            <TextField
                                required
                                name='passposrtNo'
                                placeholder="Passport No."
                                fullWidth
                                id='passposrtNo'
                                variant="outlined"
                                value={communicationAddressFormValues.partnerDetails[index]?.passposrtNo || ''}
                                size="small"
                                onChange={(event) => handleInputChange(event, index)}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.passposrtNo)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.passposrtNo) || ''}
                                inputProps={{ maxLength: 30 }}
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9A-Za-z]+$/)}
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"passportIssuingAuthority"}>
                                <Typography variant='body1'>Passport Issuing Authority#</Typography>
                            </InputLabel>
                            <TextField
                                required
                                name='passportIssuingAthority'
                                placeholder="Passport Issuing Authority"
                                fullWidth
                                id='passportIssuingAthority'
                                variant="outlined"
                                onChange={(event) => handleInputChange(event, index)}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.passportIssuingAthority)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.passportIssuingAthority) || ''}
                                size="small"
                                value={communicationAddressFormValues.partnerDetails[index]?.passportIssuingAthority || ''}
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z]+$/)}
                                inputProps={{ maxLength: 30 }}
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"passportExpiryDate"}>
                                <Typography variant='body1'>Passport Expiry Date#</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="passportExpirydate"
                                    disableFuture
                                    name="passportExpirydate"
                                    value={
                                        communicationAddressFormValues.partnerDetails[index]?.passportExpirydate
                                            && dayjs(communicationAddressFormValues.partnerDetails[index]?.passportExpirydate).isValid()
                                            ? dayjs(communicationAddressFormValues.partnerDetails[index]?.passportExpirydate)
                                            : null
                                    }
                                    onChange={(date) => handleDateChange('passportExpirydate', date, index)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Passport Expiry Date",
                                            error: !!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.passportExpirydate),
                                            helperText: (formErrors.partnerDetails && formErrors.partnerDetails[index]?.passportExpirydate),
                                        }
                                    }}
                                    sx={{ mt: 1 }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm>
    <InputLabel shrink={false} htmlFor={`passportDocument-${index}`}>
        <Typography variant='body1'>
            Upload Passport Document# (Only PDF and Max allowed size 5 MB)
        </Typography>
    </InputLabel>

    <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
        <Grid item>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
            >
                Upload Passport Document
                <VisuallyHiddenInput
                    type="file"
                    accept=".pdf"
                    name={`passportDocument-${index}`}
                    onChange={(e) => handleFileChange(e, index, 'passportDocument')} // Ensure index is passed
                />
            </Button>
        </Grid>

        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {reacord?.files?.passportDocument?.fileName && (
                <Tooltip title={reacord.files.passportDocument.fileName} placement="top">
                    <Typography variant='body2' sx={{
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        verticalAlign: 'middle',
                        textAlign: 'center'
                    }}>
                        {reacord.files.passportDocument.fileName}
                    </Typography>
                </Tooltip>
            )}
        </Grid>
        {formErrors?.[index]?.passportDocument && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {formErrors[index].passportDocument}
        </Typography>
    )}
    </Grid>
  
</Grid>

                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"voterCardNo"}>
                                <Typography variant='body1'>Voter’s Identity Card No.#</Typography>
                            </InputLabel>

                            <TextField
                                id='voterCardNo'
                                required
                                name='voterCardNo'
                                placeholder="Voter’s Identity Card No."
                                onChange={(event) => handleInputChange(event, index)}
                                fullWidth
                                value={communicationAddressFormValues.partnerDetails[index]?.voterCardNo || ''}
                                variant="outlined"
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9A-Za-z]+$/)}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.voterCardNo)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.voterCardNo) || ''}
                                size="small"
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={`idCardDocument-${index}`}>
                <Typography variant='body1'>Upload IdCard Document#(Only PDF and Max allowed size 5 MB)</Typography>
            </InputLabel>

            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
                <Grid item>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload ID Card Document
                        <VisuallyHiddenInput
                            type="file"
                            name={`idCardDocument-${index}`}
                            onChange={(e) => handleFileChange(e, index, 'idCardDocument')} // Pass index and field type
                        />
                    </Button>
                </Grid>

                <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {reacord?.files?.idCardDocument?.fileName && (
                        <Tooltip title={reacord.files.idCardDocument.fileName} placement="top">
                            <Typography variant='body2' sx={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                                textAlign: 'center'
                            }}>
                                {reacord.files.idCardDocument.fileName}
                            </Typography>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
            {formErrors?.[index]?.idCardDocument && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {formErrors[index].idCardDocument}
        </Typography>
    )}
            </Grid>
           
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"pancardNo"}>
                                <Typography variant='body1'>Income Tax PAN No.#</Typography>
                            </InputLabel>
                            <TextField
                                required
                                id='pancardNo'
                                name='pancardNo'
                                placeholder="Income Tax PAN No."
                                onChange={(event) => handleInputChange(event, index)}
                                fullWidth
                                value={communicationAddressFormValues.partnerDetails[index]?.pancardNo || ''}
                                error={!!(formErrors.partnerDetails && formErrors.partnerDetails[index]?.pancardNo)}
                                helperText={(formErrors.partnerDetails && formErrors.partnerDetails[index]?.pancardNo) || ''}
                                variant="outlined"
                                size='small'
                                onKeyDown={(e) => ValidatePattern(e, /^[0-9A-Za-z]+$/)}
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={`panCardDocument-${index}`}>
                <Typography variant='body1'>Upload PAN Card Document#(Only PDF and Max allowed size 5 MB)</Typography>
            </InputLabel>

            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
                <Grid item>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload PAN Card Document
                        <VisuallyHiddenInput
                            type="file"
                            name={`panCardDocument-${index}`}
                            onChange={(e) => handleFileChange(e, index, 'panCardDocument')} // Pass index and field type
                        />
                    </Button>
                </Grid>

                <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {reacord?.files?.panCardDocument?.fileName && (
                        <Tooltip title={reacord.files.panCardDocument.fileName} placement="top">
                            <Typography variant='body2' sx={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                                textAlign: 'center'
                            }}>
                                {reacord.files.panCardDocument.fileName}
                            </Typography>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
            {formErrors?.[index]?.panCardDocument && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {formErrors[index].panCardDocument}
        </Typography>
    )}
            </Grid>
          

                    </Grid>

                </React.Fragment>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, ml: 1 }}>
                <Button
                    onClick={handleBacks}
                    sx={{ mr: 1 }}
                    variant="contained"
                    color="primary"
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"

                >
                    Save & Next
                </Button>

            </Box>
            <Grid item xs={12}>
    <InputLabel shrink={false}>
        <Typography variant='body1'>
            Note: * marked field are mandatory to be filled
        </Typography>
        <Typography variant='body1'>
        Note: # marked field are Optional to be filled
        </Typography>
    </InputLabel>
</Grid>

        </Box>
    );
}

export default Partner;
