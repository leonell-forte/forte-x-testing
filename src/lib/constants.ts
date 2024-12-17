export const DEFAULT_PAGE_SIZE = "10";

export const MENUS = [
  {
    name: "beneficiaries",
    link: "/beneficiaries",
  },
  {
    name: "contracts",
    link: "/contracts",
  },
  {
    name: "organizations",
    link: "/organizations",
  },
  {
    name: "projects",
    link: "/projects",
  },

  {
    name: "users",
    link: "/users",
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
    value: "readonly",
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

export const BENEFICIARY_STATUS = [
  {
    label: "New",
    value: "new",
  },
  {
    label: "In progress",
    value: "in-progress",
  },
  {
    label: "Withdrawn",
    value: "withdrawn",
  },
  {
    label: "Pending evidence collection",
    value: "pending-evidence-collection",
  },
  {
    label: "Pending evidence review",
    value: "pending-evidence-review",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Accepted",
    value: "accepted",
  },
  {
    label: "Paid",
    value: "paid",
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
  { label: "Afar", value: "aa" },
  { label: "Abkhazian", value: "ab" },
  { label: "Afrikaans", value: "af" },
  { label: "Akan", value: "ak" },
  { label: "Amharic", value: "am" },
  { label: "Aragonese", value: "an" },
  { label: "Arabic", value: "ar" },
  { label: "Assamese", value: "as" },
  { label: "Avaric", value: "av" },
  { label: "Aymara", value: "ay" },
  { label: "Azerbaijani", value: "az" },
  { label: "Bashkir", value: "ba" },
  { label: "Belarusian", value: "be" },
  { label: "Bulgarian", value: "bg" },
  { label: "Bihari languages", value: "bh" },
  { label: "Bislama", value: "bi" },
  { label: "Bambara", value: "bm" },
  { label: "Bengali", value: "bn" },
  { label: "Tibetan", value: "bo" },
  { label: "Breton", value: "br" },
  { label: "Bosnian", value: "bs" },
  { label: "Catalan", value: "ca" },
  { label: "Chechen", value: "ce" },
  { label: "Chamorro", value: "ch" },
  { label: "Corsican", value: "co" },
  { label: "Cree", value: "cr" },
  { label: "Czech", value: "cs" },
  { label: "Church Slavic", value: "cu" },
  { label: "Chuvash", value: "cv" },
  { label: "Welsh", value: "cy" },
  { label: "Danish", value: "da" },
  { label: "German", value: "de" },
  { label: "Divehi", value: "dv" },
  { label: "Dzongkha", value: "dz" },
  { label: "Ewe", value: "ee" },
  { label: "Greek", value: "el" },
  { label: "English", value: "en" },
  { label: "Esperanto", value: "eo" },
  { label: "Spanish", value: "es" },
  { label: "Estonian", value: "et" },
  { label: "Basque", value: "eu" },
  { label: "Persian", value: "fa" },
  { label: "Fulah", value: "ff" },
  { label: "Finnish", value: "fi" },
  { label: "Fijian", value: "fj" },
  { label: "Faroese", value: "fo" },
  { label: "French", value: "fr" },
  { label: "Western Frisian", value: "fy" },
  { label: "Irish", value: "ga" },
  { label: "Gaelic", value: "gd" },
  { label: "Galician", value: "gl" },
  { label: "Guarani", value: "gn" },
  { label: "Gujarati", value: "gu" },
  { label: "Manx", value: "gv" },
  { label: "Hausa", value: "ha" },
  { label: "Hebrew", value: "he" },
  { label: "Hindi", value: "hi" },
  { label: "Hiri Motu", value: "ho" },
  { label: "Croatian", value: "hr" },
  { label: "Haitian", value: "ht" },
  { label: "Hungarian", value: "hu" },
  { label: "Armenian", value: "hy" },
  { label: "Herero", value: "hz" },
  { label: "Interlingua", value: "ia" },
  { label: "Indonesian", value: "id" },
  { label: "Interlingue", value: "ie" },
  { label: "Igbo", value: "ig" },
  { label: "Sichuan Yi", value: "ii" },
  { label: "Inupiaq", value: "ik" },
  { label: "Ido", value: "io" },
  { label: "Icelandic", value: "is" },
  { label: "Italian", value: "it" },
  { label: "Inuktitut", value: "iu" },
  { label: "Japanese", value: "ja" },
  { label: "Javanese", value: "jv" },
  { label: "Georgian", value: "ka" },
  { label: "Kongo", value: "kg" },
  { label: "Kikuyu", value: "ki" },
  { label: "Kwanyama", value: "kj" },
  { label: "Kazakh", value: "kk" },
  { label: "Kalaallisut", value: "kl" },
  { label: "Khmer", value: "km" },
  { label: "Kannada", value: "kn" },
  { label: "Korean", value: "ko" },
  { label: "Kanuri", value: "kr" },
  { label: "Kashmiri", value: "ks" },
  { label: "Kurdish", value: "ku" },
  { label: "Komi", value: "kv" },
  { label: "Cornish", value: "kw" },
  { label: "Kirghiz", value: "ky" },
  { label: "Latin", value: "la" },
  { label: "Luxembourgish", value: "lb" },
  { label: "Ganda", value: "lg" },
  { label: "Limburgish", value: "li" },
  { label: "Lingala", value: "ln" },
  { label: "Lao", value: "lo" },
  { label: "Lithuanian", value: "lt" },
  { label: "Luba-Katanga", value: "lu" },
  { label: "Latvian", value: "lv" },
  { label: "Malagasy", value: "mg" },
  { label: "Marshallese", value: "mh" },
  { label: "Maori", value: "mi" },
  { label: "Macedonian", value: "mk" },
  { label: "Malayalam", value: "ml" },
  { label: "Mongolian", value: "mn" },
  { label: "Marathi", value: "mr" },
  { label: "Malay", value: "ms" },
  { label: "Maltese", value: "mt" },
  { label: "Burmese", value: "my" },
  { label: "Nauru", value: "na" },
  { label: "Norwegian Bokmål", value: "nb" },
  { label: "North Ndebele", value: "nd" },
  { label: "Nepali", value: "ne" },
  { label: "Ndonga", value: "ng" },
  { label: "Dutch", value: "nl" },
  { label: "Norwegian Nynorsk", value: "nn" },
  { label: "Norwegian", value: "no" },
  { label: "South Ndebele", value: "nr" },
  { label: "Navajo", value: "nv" },
  { label: "Chichewa", value: "ny" },
  { label: "Occitan", value: "oc" },
  { label: "Ojibwa", value: "oj" },
  { label: "Oromo", value: "om" },
  { label: "Oriya", value: "or" },
  { label: "Ossetian", value: "os" },
  { label: "Punjabi", value: "pa" },
  { label: "Pali", value: "pi" },
  { label: "Polish", value: "pl" },
  { label: "Pashto", value: "ps" },
  { label: "Portuguese", value: "pt" },
  { label: "Quechua", value: "qu" },
  { label: "Romansh", value: "rm" },
  { label: "Rundi", value: "rn" },
  { label: "Romanian", value: "ro" },
  { label: "Russian", value: "ru" },
  { label: "Kinyarwanda", value: "rw" },
  { label: "Sanskrit", value: "sa" },
  { label: "Sardinian", value: "sc" },
  { label: "Sindhi", value: "sd" },
  { label: "Northern Sami", value: "se" },
  { label: "Sango", value: "sg" },
  { label: "Sinhala", value: "si" },
  { label: "Slovak", value: "sk" },
  { label: "Slovenian", value: "sl" },
  { label: "Samoan", value: "sm" },
  { label: "Shona", value: "sn" },
  { label: "Somali", value: "so" },
  { label: "Albanian", value: "sq" },
  { label: "Serbian", value: "sr" },
  { label: "Swati", value: "ss" },
  { label: "Sotho, Southern", value: "st" },
  { label: "Sundanese", value: "su" },
  { label: "Swedish", value: "sv" },
  { label: "Swahili", value: "sw" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Tajik", value: "tg" },
  { label: "Thai", value: "th" },
  { label: "Tigrinya", value: "ti" },
  { label: "Turkmen", value: "tk" },
  { label: "Tagalog", value: "tl" },
  { label: "Tswana", value: "tn" },
  { label: "Tonga", value: "to" },
  { label: "Turkish", value: "tr" },
  { label: "Tsonga", value: "ts" },
  { label: "Tatar", value: "tt" },
  { label: "Twi", value: "tw" },
  { label: "Tahitian", value: "ty" },
  { label: "Uighur", value: "ug" },
  { label: "Ukrainian", value: "uk" },
  { label: "Urdu", value: "ur" },
  { label: "Uzbek", value: "uz" },
  { label: "Venda", value: "ve" },
  { label: "Vietnamese", value: "vi" },
  { label: "Volapük", value: "vo" },
  { label: "Walloon", value: "wa" },
  { label: "Wolof", value: "wo" },
  { label: "Xhosa", value: "xh" },
  { label: "Yiddish", value: "yi" },
  { label: "Yoruba", value: "yo" },
  { label: "Zhuang", value: "za" },
  { label: "Chinese", value: "zh" },
  { label: "Zulu", value: "zu" },
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

export const DEFAULT_DATE_FORMAT = "dd-LL-yyyy";
