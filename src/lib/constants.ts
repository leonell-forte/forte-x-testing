import {
  Beneficiaries,
  Contracts,
  Organizations,
  Projects,
  Users,
} from "./role-permissions";
import { UserRoleType } from "./types/users";

export const DEFAULT_PAGE_SIZE = "10";

export const MENUS = [
  {
    name: "beneficiaries",
    link: "/beneficiaries",
    permissions: [Beneficiaries.NAVIGATE],
  },
  {
    name: "contracts",
    link: "/contracts",
    permissions: [Contracts.NAVIGATE],
  },
  {
    name: "organizations",
    link: "/organizations",
    permissions: [Organizations.NAVIGATE],
  },
  {
    name: "projects",
    link: "/projects",
    permissions: [Projects.NAVIGATE],
  },

  {
    name: "users",
    link: "/users",
    permissions: [Users.NAVIGATE],
  },
];

export const ROLES = [
  {
    label: "Owner",
    value: "owner",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "User",
    value: "user",
  },
  {
    label: "Read only",
    value: "read-only",
  },
];

export const RISK_LEVEL = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
];

export const TYPES = [
  {
    label: "Funder",
    value: "funder",
  },
  {
    label: "Provider",
    value: "provider",
  },
];

export const EVIDENCE_STATUS = [
  {
    label: "Accepted",
    value: "accepted",
  },
  {
    label: "Pending review",
    value: "pending review",
  },
  {
    label: "More information requested",
    value: "more information requested",
  },
];

export const BENEFICIARY_STATUS = [
  {
    label: "New",
    value: "New",
  },
  {
    label: "In progress",
    value: "In progress",
  },
  {
    label: "Withdrawn",
    value: "Withdrawn",
  },
  {
    label: "Pending evidence collection",
    value: "Pending evidence collection",
  },
  {
    label: "Pending evidence review",
    value: "Pending evidence review",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
  {
    label: "Accepted",
    value: "Accepted",
  },
  {
    label: "Paid",
    value: "Paid",
  },
];

export const CONTRACT_STATUS = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Signed",
    value: "signed",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export const HIGHEST_EDUCATION_LEVEL = [
  {
    label: "Less than High School",
    value: "Less than High School",
  },
  {
    label: "High School Graduate",
    value: "High School Graduate",
  },
  {
    label: "Some College",
    value: "Some College",
  },
  {
    label: "Bachelor’s Degree",
    value: "Bachelor’s Degree",
  },
  {
    label: "Postgraduate Degree",
    value: "Postgraduate Degree",
  },
];

export const STATUS = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export const GENDER = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];

export const LANGUAGES = [
  "Afar",
  "Abkhazian",
  "Afrikaans",
  "Akan",
  "Amharic",
  "Aragonese",
  "Arabic",
  "Assamese",
  "Avaric",
  "Aymara",
  "Azerbaijani",
  "Bashkir",
  "Belarusian",
  "Bulgarian",
  "Bihari languages",
  "Bislama",
  "Bambara",
  "Bengali",
  "Tibetan",
  "Breton",
  "Bosnian",
  "Catalan",
  "Chechen",
  "Chamorro",
  "Corsican",
  "Cree",
  "Czech",
  "Church Slavic",
  "Chuvash",
  "Welsh",
  "Danish",
  "German",
  "Divehi",
  "Dzongkha",
  "Ewe",
  "Greek",
  "English",
  "Esperanto",
  "Spanish",
  "Estonian",
  "Basque",
  "Persian",
  "Fulah",
  "Finnish",
  "Fijian",
  "Faroese",
  "French",
  "Western Frisian",
  "Irish",
  "Gaelic",
  "Galician",
  "Guarani",
  "Gujarati",
  "Manx",
  "Hausa",
  "Hebrew",
  "Hindi",
  "Hiri Motu",
  "Croatian",
  "Haitian",
  "Hungarian",
  "Armenian",
  "Herero",
  "Interlingua",
  "Indonesian",
  "Interlingue",
  "Igbo",
  "Sichuan Yi",
  "Inupiaq",
  "Ido",
  "Icelandic",
  "Italian",
  "Inuktitut",
  "Japanese",
  "Javanese",
  "Georgian",
  "Kongo",
  "Kikuyu",
  "Kwanyama",
  "Kazakh",
  "Kalaallisut",
  "Khmer",
  "Kannada",
  "Korean",
  "Kanuri",
  "Kashmiri",
  "Kurdish",
  "Komi",
  "Cornish",
  "Kirghiz",
  "Latin",
  "Luxembourgish",
  "Ganda",
  "Limburgish",
  "Lingala",
  "Lao",
  "Lithuanian",
  "Luba-Katanga",
  "Latvian",
  "Malagasy",
  "Marshallese",
  "Maori",
  "Macedonian",
  "Malayalam",
  "Mongolian",
  "Marathi",
  "Malay",
  "Maltese",
  "Burmese",
  "Nauru",
  "Norwegian Bokmål",
  "North Ndebele",
  "Nepali",
  "Ndonga",
  "Dutch",
  "Norwegian Nynorsk",
  "Norwegian",
  "South Ndebele",
  "Navajo",
  "Chichewa",
  "Occitan",
  "Ojibwa",
  "Oromo",
  "Oriya",
  "Ossetian",
  "Punjabi",
  "Pali",
  "Polish",
  "Pashto",
  "Portuguese",
  "Quechua",
  "Romansh",
  "Rundi",
  "Romanian",
  "Russian",
  "Kinyarwanda",
  "Sanskrit",
  "Sardinian",
  "Sindhi",
  "Northern Sami",
  "Sango",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Samoan",
  "Shona",
  "Somali",
  "Albanian",
  "Serbian",
  "Swati",
  "Sotho, Southern",
  "Sundanese",
  "Swedish",
  "Swahili",
  "Tamil",
  "Telugu",
  "Tajik",
  "Thai",
  "Tigrinya",
  "Turkmen",
  "Tagalog",
  "Tswana",
  "Tonga",
  "Turkish",
  "Tsonga",
  "Tatar",
  "Twi",
  "Tahitian",
  "Uighur",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Venda",
  "Vietnamese",
  "Volapük",
  "Walloon",
  "Wolof",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zhuang",
  "Chinese",
  "Zulu",
];

export const BOOLEAN = [
  {
    label: "True",
    value: "true",
  },
  {
    label: "False",
    value: "false",
  },
];

export const CONFIRM = [
  {
    label: "Yes",

    value: "yes",
  },

  {
    label: "No",

    value: "no",
  },
];

export const REGIONS = [
  {
    label: "Asia",
    value: "Asia",
  },
  {
    label: "North America",
    value: "North America",
  },
  {
    label: "Latin America",
    value: "Latin America",
  },
  {
    label: "Oceania",
    value: "Oceania",
  },
  {
    label: "Europe",
    value: "Europe",
  },
  {
    label: "Middle East and North Africa",
    value: "Middle East and North Africa",
  },
  {
    label: "Africa",
    value: "Africa",
  },
];

export const DEFAULT_DATE_FORMAT = "dd-LLL-yyyy";

export const REDIRECT_PATHS: Record<UserRoleType, string> = {
  "provider.user": "/beneficiaries",

  "provider.admin": "/beneficiaries",

  "provider.owner": "/beneficiaries",

  "provider.read-only": "/beneficiaries",

  "funder.owner": "/beneficiaries",

  "funder.admin": "/beneficiaries",

  "funder.user": "/beneficiaries",

  "funder.read-only": "/beneficiaries",

  owner: "/beneficiaries",

  admin: "/beneficiaries",

  user: "/beneficiaries",

  "read-only": "/beneficiaries",
};
