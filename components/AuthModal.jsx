"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import Cookies from "js-cookie";

// Regular expressions for phone validation
const phonePatterns = {
  US: /^\d{10}$/,
  CA: /^\d{10}$/,
  GB: /^\d{10,11}$/,
  IN: /^\d{10}$/,
  AU: /^\d{9,10}$/,
  DE: /^\d{10,11}$/,
  FR: /^\d{9,10}$/,
  JP: /^\d{10,11}$/,
  CN: /^\d{11}$/,
  BR: /^\d{10,11}$/,
  MX: /^\d{10}$/,
  RU: /^\d{10}$/,
  IT: /^\d{9,10}$/,
  ES: /^\d{9}$/,
  AR: /^\d{10,11}$/,
  global: /^\d{7,15}$/, // fallback pattern
};

const countries = [
  {
    name: "Afghanistan",
    code: "+93",
    short_name: "AF",
    phonePattern: phonePatterns.global,
    phoneLength: [7, 15],
  },
  {
    name: "Albania",
    code: "+355",
    short_name: "AL",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Algeria",
    code: "+213",
    short_name: "DZ",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Andorra",
    code: "+376",
    short_name: "AD",
    phonePattern: phonePatterns.global,
    phoneLength: [6, 8],
  },
  {
    name: "Angola",
    code: "+244",
    short_name: "AO",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Antigua and Barbuda",
    code: "+1-268",
    short_name: "AG",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Argentina",
    code: "+54",
    short_name: "AR",
    phonePattern: phonePatterns.AR,
    phoneLength: [10, 11],
  },
  {
    name: "Armenia",
    code: "+374",
    short_name: "AM",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Australia",
    code: "+61",
    short_name: "AU",
    phonePattern: phonePatterns.AU,
    phoneLength: [9, 10],
  },
  {
    name: "Austria",
    code: "+43",
    short_name: "AT",
    phonePattern: phonePatterns.global,
    phoneLength: [10, 11],
  },
  {
    name: "Azerbaijan",
    code: "+994",
    short_name: "AZ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Bahamas",
    code: "+1-242",
    short_name: "BS",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Bahrain",
    code: "+973",
    short_name: "BH",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Bangladesh",
    code: "+880",
    short_name: "BD",
    phonePattern: phonePatterns.global,
    phoneLength: [10, 11],
  },
  {
    name: "Barbados",
    code: "+1-246",
    short_name: "BB",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Belarus",
    code: "+375",
    short_name: "BY",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Belgium",
    code: "+32",
    short_name: "BE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Belize",
    code: "+501",
    short_name: "BZ",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Benin",
    code: "+229",
    short_name: "BJ",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Bhutan",
    code: "+975",
    short_name: "BT",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Bolivia",
    code: "+591",
    short_name: "BO",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Bosnia and Herzegovina",
    code: "+387",
    short_name: "BA",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Botswana",
    code: "+267",
    short_name: "BW",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Brazil",
    code: "+55",
    short_name: "BR",
    phonePattern: phonePatterns.BR,
    phoneLength: [10, 11],
  },
  {
    name: "Brunei",
    code: "+673",
    short_name: "BN",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Bulgaria",
    code: "+359",
    short_name: "BG",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Burkina Faso",
    code: "+226",
    short_name: "BF",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Burundi",
    code: "+257",
    short_name: "BI",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Cabo Verde",
    code: "+238",
    short_name: "CV",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Cambodia",
    code: "+855",
    short_name: "KH",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Cameroon",
    code: "+237",
    short_name: "CM",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Canada",
    code: "+1",
    short_name: "CA",
    phonePattern: phonePatterns.CA,
    phoneLength: [10],
  },
  {
    name: "Central African Republic",
    code: "+236",
    short_name: "CF",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Chad",
    code: "+235",
    short_name: "TD",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Chile",
    code: "+56",
    short_name: "CL",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "China",
    code: "+86",
    short_name: "CN",
    phonePattern: phonePatterns.CN,
    phoneLength: [11],
  },
  {
    name: "Colombia",
    code: "+57",
    short_name: "CO",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Comoros",
    code: "+269",
    short_name: "KM",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Congo",
    code: "+242",
    short_name: "CG",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Congo (Democratic Republic)",
    code: "+243",
    short_name: "CD",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Costa Rica",
    code: "+506",
    short_name: "CR",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Croatia",
    code: "+385",
    short_name: "HR",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Cuba",
    code: "+53",
    short_name: "CU",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Cyprus",
    code: "+357",
    short_name: "CY",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Czech Republic",
    code: "+420",
    short_name: "CZ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Denmark",
    code: "+45",
    short_name: "DK",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Djibouti",
    code: "+253",
    short_name: "DJ",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Dominica",
    code: "+1-767",
    short_name: "DM",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Dominican Republic",
    code: "+1-809",
    short_name: "DO",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Ecuador",
    code: "+593",
    short_name: "EC",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Egypt",
    code: "+20",
    short_name: "EG",
    phonePattern: phonePatterns.global,
    phoneLength: [10, 11],
  },
  {
    name: "El Salvador",
    code: "+503",
    short_name: "SV",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Equatorial Guinea",
    code: "+240",
    short_name: "GQ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Eritrea",
    code: "+291",
    short_name: "ER",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Estonia",
    code: "+372",
    short_name: "EE",
    phonePattern: phonePatterns.global,
    phoneLength: [7, 8],
  },
  {
    name: "Eswatini",
    code: "+268",
    short_name: "SZ",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Ethiopia",
    code: "+251",
    short_name: "ET",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Fiji",
    code: "+679",
    short_name: "FJ",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Finland",
    code: "+358",
    short_name: "FI",
    phonePattern: phonePatterns.global,
    phoneLength: [9, 10],
  },
  {
    name: "France",
    code: "+33",
    short_name: "FR",
    phonePattern: phonePatterns.FR,
    phoneLength: [9, 10],
  },
  {
    name: "Gabon",
    code: "+241",
    short_name: "GA",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Gambia",
    code: "+220",
    short_name: "GM",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Georgia",
    code: "+995",
    short_name: "GE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Germany",
    code: "+49",
    short_name: "DE",
    phonePattern: phonePatterns.DE,
    phoneLength: [10, 11],
  },
  {
    name: "Ghana",
    code: "+233",
    short_name: "GH",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Greece",
    code: "+30",
    short_name: "GR",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Grenada",
    code: "+1-473",
    short_name: "GD",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Guatemala",
    code: "+502",
    short_name: "GT",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Guinea",
    code: "+224",
    short_name: "GN",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Guinea-Bissau",
    code: "+245",
    short_name: "GW",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Guyana",
    code: "+592",
    short_name: "GY",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Haiti",
    code: "+509",
    short_name: "HT",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Honduras",
    code: "+504",
    short_name: "HN",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Hungary",
    code: "+36",
    short_name: "HU",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Iceland",
    code: "+354",
    short_name: "IS",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "India",
    code: "+91",
    short_name: "IN",
    phonePattern: phonePatterns.IN,
    phoneLength: [10],
  },
  {
    name: "Indonesia",
    code: "+62",
    short_name: "ID",
    phonePattern: phonePatterns.global,
    phoneLength: [10, 11],
  },
  {
    name: "Iran",
    code: "+98",
    short_name: "IR",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Iraq",
    code: "+964",
    short_name: "IQ",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Ireland",
    code: "+353",
    short_name: "IE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Israel",
    code: "+972",
    short_name: "IL",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Italy",
    code: "+39",
    short_name: "IT",
    phonePattern: phonePatterns.IT,
    phoneLength: [9, 10],
  },
  {
    name: "Jamaica",
    code: "+1-876",
    short_name: "JM",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Japan",
    code: "+81",
    short_name: "JP",
    phonePattern: phonePatterns.JP,
    phoneLength: [10, 11],
  },
  {
    name: "Jordan",
    code: "+962",
    short_name: "JO",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Kazakhstan",
    code: "+7",
    short_name: "KZ",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Kenya",
    code: "+254",
    short_name: "KE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Kiribati",
    code: "+686",
    short_name: "KI",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Korea (North)",
    code: "+850",
    short_name: "KP",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Korea (South)",
    code: "+82",
    short_name: "KR",
    phonePattern: phonePatterns.global,
    phoneLength: [10, 11],
  },
  {
    name: "Kuwait",
    code: "+965",
    short_name: "KW",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Kyrgyzstan",
    code: "+996",
    short_name: "KG",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Laos",
    code: "+856",
    short_name: "LA",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Latvia",
    code: "+371",
    short_name: "LV",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Lebanon",
    code: "+961",
    short_name: "LB",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Lesotho",
    code: "+266",
    short_name: "LS",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Liberia",
    code: "+231",
    short_name: "LR",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Libya",
    code: "+218",
    short_name: "LY",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Liechtenstein",
    code: "+423",
    short_name: "LI",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Lithuania",
    code: "+370",
    short_name: "LT",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Luxembourg",
    code: "+352",
    short_name: "LU",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Madagascar",
    code: "+261",
    short_name: "MG",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Malawi",
    code: "+265",
    short_name: "MW",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Malaysia",
    code: "+60",
    short_name: "MY",
    phonePattern: phonePatterns.global,
    phoneLength: [9, 10],
  },
  {
    name: "Maldives",
    code: "+960",
    short_name: "MV",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Mali",
    code: "+223",
    short_name: "ML",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Malta",
    code: "+356",
    short_name: "MT",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Marshall Islands",
    code: "+692",
    short_name: "MH",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Mauritania",
    code: "+222",
    short_name: "MR",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Mauritius",
    code: "+230",
    short_name: "MU",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Mexico",
    code: "+52",
    short_name: "MX",
    phonePattern: phonePatterns.MX,
    phoneLength: [10],
  },
  {
    name: "Micronesia",
    code: "+691",
    short_name: "FM",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Moldova",
    code: "+373",
    short_name: "MD",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Monaco",
    code: "+377",
    short_name: "MC",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Mongolia",
    code: "+976",
    short_name: "MN",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Montenegro",
    code: "+382",
    short_name: "ME",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Morocco",
    code: "+212",
    short_name: "MA",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Mozambique",
    code: "+258",
    short_name: "MZ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Myanmar",
    code: "+95",
    short_name: "MM",
    phonePattern: phonePatterns.global,
    phoneLength: [9, 10],
  },
  {
    name: "Namibia",
    code: "+264",
    short_name: "NA",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Nauru",
    code: "+674",
    short_name: "NR",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Nepal",
    code: "+977",
    short_name: "NP",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Netherlands",
    code: "+31",
    short_name: "NL",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "New Zealand",
    code: "+64",
    short_name: "NZ",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Nicaragua",
    code: "+505",
    short_name: "NI",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Niger",
    code: "+227",
    short_name: "NE",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Nigeria",
    code: "+234",
    short_name: "NG",
    phonePattern: phonePatterns.global,
    phoneLength: [10, 11],
  },
  {
    name: "North Macedonia",
    code: "+389",
    short_name: "MK",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Norway",
    code: "+47",
    short_name: "NO",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Oman",
    code: "+968",
    short_name: "OM",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Pakistan",
    code: "+92",
    short_name: "PK",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Palau",
    code: "+680",
    short_name: "PW",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Panama",
    code: "+507",
    short_name: "PA",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Papua New Guinea",
    code: "+675",
    short_name: "PG",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Paraguay",
    code: "+595",
    short_name: "PY",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Peru",
    code: "+51",
    short_name: "PE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Philippines",
    code: "+63",
    short_name: "PH",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Poland",
    code: "+48",
    short_name: "PL",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Portugal",
    code: "+351",
    short_name: "PT",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Qatar",
    code: "+974",
    short_name: "QA",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Romania",
    code: "+40",
    short_name: "RO",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Russia",
    code: "+7",
    short_name: "RU",
    phonePattern: phonePatterns.RU,
    phoneLength: [10],
  },
  {
    name: "Rwanda",
    code: "+250",
    short_name: "RW",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Saint Kitts and Nevis",
    code: "+1-869",
    short_name: "KN",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Saint Lucia",
    code: "+1-758",
    short_name: "LC",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Saint Vincent and the Grenadines",
    code: "+1-784",
    short_name: "VC",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Samoa",
    code: "+685",
    short_name: "WS",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "San Marino",
    code: "+378",
    short_name: "SM",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Sao Tome and Principe",
    code: "+239",
    short_name: "ST",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Saudi Arabia",
    code: "+966",
    short_name: "SA",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Senegal",
    code: "+221",
    short_name: "SN",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Serbia",
    code: "+381",
    short_name: "RS",
    phonePattern: phonePatterns.global,
    phoneLength: [8, 9],
  },
  {
    name: "Seychelles",
    code: "+248",
    short_name: "SC",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Sierra Leone",
    code: "+232",
    short_name: "SL",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Singapore",
    code: "+65",
    short_name: "SG",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Slovakia",
    code: "+421",
    short_name: "SK",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Slovenia",
    code: "+386",
    short_name: "SI",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Solomon Islands",
    code: "+677",
    short_name: "SB",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Somalia",
    code: "+252",
    short_name: "SO",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "South Africa",
    code: "+27",
    short_name: "ZA",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "South Sudan",
    code: "+211",
    short_name: "SS",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Spain",
    code: "+34",
    short_name: "ES",
    phonePattern: phonePatterns.ES,
    phoneLength: [9],
  },
  {
    name: "Sri Lanka",
    code: "+94",
    short_name: "LK",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Sudan",
    code: "+249",
    short_name: "SD",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Suriname",
    code: "+597",
    short_name: "SR",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Sweden",
    code: "+46",
    short_name: "SE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Switzerland",
    code: "+41",
    short_name: "CH",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Syria",
    code: "+963",
    short_name: "SY",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Taiwan",
    code: "+886",
    short_name: "TW",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Tajikistan",
    code: "+992",
    short_name: "TJ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Tanzania",
    code: "+255",
    short_name: "TZ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Thailand",
    code: "+66",
    short_name: "TH",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Timor-Leste",
    code: "+670",
    short_name: "TL",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Togo",
    code: "+228",
    short_name: "TG",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Tonga",
    code: "+676",
    short_name: "TO",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Trinidad and Tobago",
    code: "+1-868",
    short_name: "TT",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Tunisia",
    code: "+216",
    short_name: "TN",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Turkey",
    code: "+90",
    short_name: "TR",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Turkmenistan",
    code: "+993",
    short_name: "TM",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Tuvalu",
    code: "+688",
    short_name: "TV",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Uganda",
    code: "+256",
    short_name: "UG",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Ukraine",
    code: "+380",
    short_name: "UA",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "United Arab Emirates",
    code: "+971",
    short_name: "AE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "United Kingdom",
    code: "+44",
    short_name: "GB",
    phonePattern: phonePatterns.GB,
    phoneLength: [10, 11],
  },
  {
    name: "United States",
    code: "+1",
    short_name: "US",
    phonePattern: phonePatterns.US,
    phoneLength: [10],
  },
  {
    name: "Uruguay",
    code: "+598",
    short_name: "UY",
    phonePattern: phonePatterns.global,
    phoneLength: [8],
  },
  {
    name: "Uzbekistan",
    code: "+998",
    short_name: "UZ",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Vanuatu",
    code: "+678",
    short_name: "VU",
    phonePattern: phonePatterns.global,
    phoneLength: [7],
  },
  {
    name: "Vatican City",
    code: "+379",
    short_name: "VA",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Venezuela",
    code: "+58",
    short_name: "VE",
    phonePattern: phonePatterns.global,
    phoneLength: [10],
  },
  {
    name: "Vietnam",
    code: "+84",
    short_name: "VN",
    phonePattern: phonePatterns.global,
    phoneLength: [9, 10],
  },
  {
    name: "Yemen",
    code: "+967",
    short_name: "YE",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Zambia",
    code: "+260",
    short_name: "ZM",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
  {
    name: "Zimbabwe",
    code: "+263",
    short_name: "ZW",
    phonePattern: phonePatterns.global,
    phoneLength: [9],
  },
];

export default function AuthModal() {
  const { isAuthOpen, closeAuth, authMode, switchToOtp } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [inputMode, setInputMode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    short_name: "IN",
    code: "+91",
    name: "India",
    phonePattern: phonePatterns.IN,
    phoneLength: [10],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const prevInputModeRef = useRef("");
  const isModeChangingRef = useRef(false);

  const isValidEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const isValidMobile = useCallback(
    (mobile) => {
      // Remove any spaces, dashes, or parentheses
      const cleanMobile = mobile.replace(/[\s\-()]/g, "");

      // Check if it matches the selected country's pattern
      if (selectedCountry.phonePattern) {
        return selectedCountry.phonePattern.test(cleanMobile);
      }

      // Fallback to length validation
      if (selectedCountry.phoneLength) {
        return selectedCountry.phoneLength.includes(cleanMobile.length);
      }

      // Default validation - 7 to 15 digits
      return /^[0-9]{7,15}$/.test(cleanMobile);
    },
    [selectedCountry]
  );

  const getPhoneValidationMessage = () => {
    if (selectedCountry.phoneLength) {
      if (selectedCountry.phoneLength.length === 1) {
        return `Please enter a valid ${selectedCountry.phoneLength[0]}-digit mobile number for ${selectedCountry.name}`;
      } else {
        const lengths = selectedCountry.phoneLength.join(" or ");
        return `Please enter a valid ${lengths}-digit mobile number for ${selectedCountry.name}`;
      }
    }
    return `Please enter a valid mobile number for ${selectedCountry.name}`;
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const previousMode = inputMode;
    let newMode = inputMode;
    const wasFocused = e.target === document.activeElement;
    const cursorPosition = e.target.selectionStart || rawValue.length;

    // Clear error when user starts typing
    if (error) setError("");

    // Determine input mode based on content
    // Priority: Check for email indicators first (letters or @ symbol)
    if (rawValue.includes("@") || /[a-zA-Z]/.test(rawValue)) {
      newMode = "email";
      setInputMode("email");
      setInputValue(rawValue);
    } else if (rawValue === "") {
      newMode = "";
      setInputMode("");
      setInputValue("");
    } else if (/^\d+$/.test(rawValue)) {
      // Only digits - mobile mode
      newMode = "mobile";
      setInputMode("mobile");
      setInputValue(rawValue);
    } else {
      // Mixed characters or other - default to email mode
      newMode = "email";
      setInputMode("email");
      setInputValue(rawValue);
    }

    // If mode changed and input was focused, ensure it stays focused after re-render
    if (previousMode !== newMode && wasFocused) {
      isModeChangingRef.current = true;
      // Use multiple animation frames to ensure DOM is updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            // Restore cursor position
            const newCursorPos = Math.min(cursorPosition, rawValue.length);
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
          // Reset flag after focus is restored
          setTimeout(() => {
            isModeChangingRef.current = false;
          }, 100);
        });
      });
    }
  };

  const handleInputBlur = (e) => {
    // If we're in the middle of a mode change, prevent blur and refocus
    if (isModeChangingRef.current && inputRef.current) {
      e.preventDefault();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    // Clear error when country changes
    if (error && inputMode === "mobile") setError("");
  };

  const validateInput = () => {
    if (!inputValue.trim()) {
      setError("Enter your email or mobile phone number");
      return false;
    }

    if (inputMode === "email" && !isValidEmail(inputValue)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (inputMode === "mobile" && !isValidMobile(inputValue)) {
      setError(getPhoneValidationMessage());
      return false;
    }

    if (!inputMode) {
      setError("Please enter a valid email or mobile number");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const isEmail = inputMode === "email";
    let payload;

    if (isEmail) {
      payload = {
        email: inputValue.trim().toLowerCase(),
        type: "email",
      };
    } else {
      // 🧼 Clean mobile number: remove any spaces
      const cleanedMobile = `${selectedCountry.code}${inputValue.replace(/\s+/g, "")}`;
      payload = {
        mobile: cleanedMobile,
        type: "mobile",
      };
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await strapiPost(
        "login-register-user",
        payload,
        themeConfig.TOKEN
      );


      if (response?.message) {
        setSuccessMessage("Code has been sent.");
        setTimeout(() => {
          switchToOtp(isEmail ? payload.email : payload.mobile);
          setSuccessMessage("");
        }, 1500);
      } else {
        setError("Something went wrong. Please try again.");
        console.error("❌ No message in response:", response);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "An error occurred. Please try again.";
      setError(errorMsg);
      console.error("❌ Error during request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    // Allow letters and @ symbol to enable switching from mobile to email mode
    // Only prevent special characters (not letters, digits, or @)
    if (
      inputMode === "mobile" &&
      !/[\d@a-zA-Z]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)
    ) {
      e.preventDefault();
    }
  };


  // Focus input when modal opens
  useEffect(() => {
    if (isAuthOpen && inputRef.current) {
      // Small delay to ensure modal is fully rendered
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".country-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (authMode === "otp") {
    return (
      <CodeModal
        isOpen={isAuthOpen}
        onClose={closeAuth}
        identifier={
          inputMode === "email"
            ? inputValue.toLowerCase()
            : `${selectedCountry.code}${inputValue}`
        }
        type={inputMode === "email" ? "email" : "mobile"}
      />
    );
  }

  return (
    <Modal
      hideCloseButton={true}
      isOpen={isAuthOpen}
      onOpenChange={(open) => !open && closeAuth()}
      classNames={{ backdrop: "bg-black/50" }}
    >
      <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
        {(onClose) => (
          <>
            <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
              Sign in or create account
              <button
                onClick={onClose}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </ModalHeader>
            <ModalBody className="p-0 gap-0 relative">
              <p className="text-gray-600 sm:mb-[30px] mb-5">
                Seamless shopping starts with a simple sign in or create
                account.
              </p>
              {inputMode === "mobile" ? (
                <div
                  className={`flex items-center border ${error ? "border-red-500" : "border-gray-200"
                    } rounded-md py-[11px] px-2 relative country-dropdown`}
                >
                  <div className="z-10">
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="flex items-center justify-between min-w-[80px] w-auto pr-3 pl-[10px] border-r border-gray-200 bg-white uppercase hover:bg-gray-50 transition-colors"
                      tabIndex={-1}
                      aria-label="Select country code"
                    >
                      <span className="text-sm whitespace-nowrap">
                        {selectedCountry.short_name} {selectedCountry.code}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="11"
                        viewBox="0 0 9 11"
                        fill="none"
                        className={`ml-2 transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? "rotate-0" : "rotate-180"
                          }`}
                      >
                        <path
                          d="M4.1612 2.31217C4.35263 2.13578 4.64737 2.13578 4.8388 2.31217L8.8388 5.9977C8.94155 6.09237 9 6.22571 9 6.36541V6.85679C9 7.29285 8.48076 7.51995 8.16057 7.22393L4.83943 4.15343C4.64781 3.97628 4.35219 3.97628 4.16057 4.15343L0.839427 7.22393C0.519237 7.51995 0 7.29285 0 6.85679V6.36541C0 6.22571 0.0584515 6.09237 0.161196 5.9977L4.1612 2.31217Z"
                          fill="#505050"
                        />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <ul className="absolute z-20 bg-white border border-[#D9DDE2] rounded-[5px] shadow-lg max-h-36 overflow-y-auto w-[180px] left-0 top-full mt-[1px] scrollbar-custom">
                        {countries.map((country) => (
                          <li
                            key={country.short_name}
                            onClick={() => selectCountry(country)}
                            className={`cursor-pointer px-4 py-2 text-sm font-normal text-[#505050] hover:bg-gray-100 transition-colors ${selectedCountry.code === country.code
                                ? "bg-primary text-white hover:bg-primary"
                                : ""
                              }`}
                          >
                            {country.name} {country.code}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter mobile number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={(e) => e.target.focus()}
                    className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                    aria-label="Mobile number"
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center border ${error ? "border-red-500" : "border-gray-200"
                    } rounded-md py-[11px] px-2`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter mobile number or email"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={(e) => e.target.focus()}
                    className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                    aria-label="Email or mobile number"
                  />
                </div>
              )}

              {error && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-2" role="alert">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-2 text-green-600 text-sm" role="status">
                  {successMessage}
                </div>
              )}

              <p className="text-sm text-gray-600 my-[22px]">
                By continuing, you agree to WebbyTemplate’s{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer" // ✅ security/best practice
                  href="/terms-and-conditions"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Terms & Conditions,
                </Link>{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer" // ✅ security/best practice
                  href="/privacy-policy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer" // ✅ security/best practice
                  href="/author-terms-and-policy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Author Policy
                </Link>
                .
              </p>

              <Button
                className="w-full btn-primary hover:bg-blue-700 text-white hover:text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                color="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function CodeModal({ isOpen, onClose, identifier, type }) {
  const { login } = useAuth();
  const [codeValues, setCodeValues] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const firstInputRef = useRef(null);
  const hasAutoSubmittedRef = useRef(false);
  const lastSubmittedCodeRef = useRef("");

  // Focus first input when modal opens and reset auto-submit flag
  useEffect(() => {
    if (isOpen) {
      hasAutoSubmittedRef.current = false;
      lastSubmittedCodeRef.current = "";
      if (firstInputRef.current) {
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    }
  }, [isOpen]);

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-submit when all 6 digits are filled and valid
  useEffect(() => {
    const isComplete = codeValues.every((val) => val && /^\d$/.test(val));
    const allFilled = codeValues.length === 6 && isComplete;
    const currentCode = codeValues.join("");

    // Reset auto-submit flag when code values are cleared (e.g., on resend)
    if (codeValues.every((val) => !val)) {
      hasAutoSubmittedRef.current = false;
      lastSubmittedCodeRef.current = "";
      return;
    }

    // Only auto-submit if:
    // 1. All 6 digits are filled and valid
    // 2. Not currently submitting
    // 3. Haven't already auto-submitted this exact code
    // 4. The current code is different from the last submitted one
    if (
      allFilled &&
      !isSubmitting &&
      !hasAutoSubmittedRef.current &&
      currentCode !== lastSubmittedCodeRef.current
    ) {
      hasAutoSubmittedRef.current = true;
      lastSubmittedCodeRef.current = currentCode;
      // Small delay to ensure UI updates
      setTimeout(() => {
        // Double-check the code is still valid before submitting
        const codeString = codeValues.join("");
        if (
          codeString.length === 6 &&
          codeValues.every((val) => val && /^\d$/.test(val))
        ) {
          handleSubmit();
        } else {
          hasAutoSubmittedRef.current = false;
          lastSubmittedCodeRef.current = "";
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeValues, isSubmitting]);

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCodeValues = [...codeValues];
    newCodeValues[index] = value;
    setCodeValues(newCodeValues);

    // Clear error when user starts typing
    if (codeError) setCodeError("");

    // Reset auto-submit flag when user edits code (allows re-submission of new code)
    const newCode = newCodeValues.join("");
    if (newCode !== lastSubmittedCodeRef.current) {
      hasAutoSubmittedRef.current = false;
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=code-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=code-${index - 1}]`);
      if (prevInput) prevInput.focus();
    }

    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const numbersOnly = e.clipboardData
      .getData("text/plain")
      .trim()
      .replace(/\D/g, "");

    const newCodeValues = [...codeValues];
    for (let i = 0; i < Math.min(numbersOnly.length, 6); i++) {
      newCodeValues[i] = numbersOnly[i];
    }
    setCodeValues(newCodeValues);

    // Reset auto-submit flag when user pastes new code
    const newCode = newCodeValues.join("");
    if (newCode !== lastSubmittedCodeRef.current) {
      hasAutoSubmittedRef.current = false;
    }

    // Focus next empty input or last input
    const nextEmptyIndex = newCodeValues.findIndex((val) => !val);
    const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    const target = document.querySelector(`input[name=code-${targetIndex}]`);
    if (target) target.focus();
  };

  const validateCode = () => {
    if (codeValues.some((val) => !val)) {
      setCodeError("Please enter the complete 6-digit code");
      return false;
    }

    if (codeValues.some((val) => !/^\d$/.test(val))) {
      setCodeError("Code must contain only numbers");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setResendMessage("");
    if (!validateCode()) {
      // Don't reset hasAutoSubmittedRef here - let it stay true to prevent re-submission
      // The flag will be reset when user changes the code
      return;
    }

    setIsSubmitting(true);
    const cart_id = Cookies.get("cart_id");
    const wishlist_id = Cookies.get("wishlist_id");

    try {
      const response = await strapiPost(
        "verify-otp",
        {
          [type === "email" ? "email" : "mobile"]: identifier,
          type: type,
          otp: codeValues.join(""),
          cart_id: cart_id,
          wishlist_id: wishlist_id,
        },
        themeConfig.TOKEN
      );

      if (response && response.jwt) {
        const query = {
          token: response.jwt,
          user: JSON.stringify(response.user),
        };

        const queryString = Object.entries(query)
          .filter(([_, value]) => value != null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        const cookieResponse = await fetch(`/api/auth/login?${queryString}`);

        if (cookieResponse.ok) {
          onClose();
          login();
          const currentUrl = window.location.href;
          const hasAuthorQuery = currentUrl.includes("author=true");
          const documentId = response.user?.documentId || response.user?.id;

          setTimeout(() => {
            if (hasAuthorQuery && documentId) {
              window.location.href = `/user/${documentId}/become-an-author`;
            } else {
              window.location.reload();
            }
          }, 1000);
        } else {
          throw new Error("Failed to set authentication cookies");
        }
      } else {
        setCodeError("Invalid code. Please try again.");
        // Don't reset hasAutoSubmittedRef on error - prevents re-submission of same invalid code
        // User must change the code to trigger a new submission
      }
    } catch (error) {
      setCodeError(
        error?.response?.data?.error?.message ||
        "An error occurred. Please try again later."
      );
      // Don't reset hasAutoSubmittedRef on error - prevents re-submission of same invalid code
      // User must change the code to trigger a new submission
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendMessage("");
    setCodeValues(["", "", "", "", "", ""]);
    hasAutoSubmittedRef.current = false;
    lastSubmittedCodeRef.current = "";

    try {
      const payload =
        type === "email"
          ? { email: identifier, type: "email" }
          : { mobile: identifier, type: "mobile" };

      await strapiPost("login-register-user", payload, themeConfig.TOKEN);

      // setResendMessage("Code has been resent successfully.");
      setCodeError("");
      setResendCooldown(30); // 30 second cooldown
      
      // Focus the first OTP input box after resending
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      setCodeError("Failed to resend code. Please try again.");
      setResendMessage("");
    }

    setTimeout(() => {
      setResendMessage("");
    }, 3000);
  };

  const maskIdentifier = (identifier) => {
    if (identifier.includes("@")) {
      // Email masking
      const [username, domain] = identifier.split("@");
      const maskedUsername =
        username.length > 2
          ? username.slice(0, 2) + "*".repeat(username.length - 2)
          : username;
      return `${maskedUsername}@${domain}`;
    } else {
      // Mobile masking - show first 2 and last 2 digits
      const cleanNumber = identifier.replace(/\D/g, "");
      if (cleanNumber.length > 4) {
        return (
          cleanNumber.slice(0, 2) +
          "*".repeat(cleanNumber.length - 4) +
          cleanNumber.slice(-2)
        );
      }
      return identifier;
    }
  };

  return (
    <Modal
      hideCloseButton={true}
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      classNames={{ backdrop: "bg-black/50" }}
    >
      <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
        {(onClose) => (
          <>
            <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
              Welcome to WebbyTemplate
              <button
                onClick={onClose}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </ModalHeader>
            <ModalBody className="p-0 gap-0">
              <p className="text-gray-600 sm:mb-[30px] mb-5">
                {identifier ? (
                  <>
                    Enter the code sent to{" "}
                    <span className="font-bold">
                      {isNaN(identifier) ? maskIdentifier(identifier) : `+${maskIdentifier(identifier)}`}
                    </span>
                  </>
                ) : (
                  "Seamless shopping starts with a simple login."
                )}
              </p>

              <div>
                <div className="flex justify-center md:space-x-[18px] space-x-3 mb-[18px]">
                  {codeValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`code-${index}`}
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      ref={index === 0 ? firstInputRef : null}
                      className={`2xl:w-[60px] 2xl:h-[60px] xl:w-[55px] xl:h-[55px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] text-center text-lg font-medium border ${codeError ? "border-red-500" : "border-gray-200"
                        } text-black placeholder:text-gray-400 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all`}
                      aria-label={`Code digit ${index + 1}`}
                    />
                  ))}
                </div>

                {codeError && (
                  <div className="flex justify-center mb-2">
                    <div className="text-red-500 text-sm flex items-center gap-2 w-full max-w-[330px] md:max-w-[384px] xl:max-w-[423px] 2xl:max-w-[468px] justify-start" role="alert">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{codeError}</span>
                    </div>
                  </div>
                )}
              </div>

              {resendMessage && (
                <div className="mt-2 text-green-600 text-sm mb-2" role="status">
                  {resendMessage}
                </div>
              )}

              <div className="text-center mb-5">
                <p className="text-sm text-gray-500">
                  {"Didn't receive the code? "}
                  <button
                    className={`font-medium transition-colors ${resendCooldown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800 hover:underline"
                      }`}
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </p>
              </div>

              {isSubmitting && (
                <div className="w-full text-center py-3">
                  <p className="text-sm text-gray-600">Verifying code...</p>
                </div>
              )}
            </ModalBody>  
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
