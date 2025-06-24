import { HiSearch as EvidenceIcon } from "react-icons/hi";
import { TbLayoutDashboardFilled as DashboardIcon } from "react-icons/tb";

import Beneficiary from "@/assets/images/icons/beneficiary.svg?react";
import Contract from "@/assets/images/icons/contract.svg?react";
import Funder from "@/assets/images/icons/funder.svg?react";
import Invoice from "@/assets/images/icons/invoice.svg?react";
import Milestone from "@/assets/images/icons/milestone.svg?react";
import Payout from "@/assets/images/icons/payouts.svg?react";
import Project from "@/assets/images/icons/project.svg?react";
import Provider  from "@/assets/images/icons/provider.svg?react";

import {
  Beneficiaries,
  Contracts,
  Dashboard,
  Evidences,
  Funders,
  Invoices,
  Milestones,
  Payouts,
  Projects,
  Providers,
  Users,
} from "./role-permissions";
import type { InvoiceStatus } from "./types/invoices";
import type { OrgTypes } from "./types/organizations";
import type { UserRoleType } from "./types/users";
import { sortOptions } from "./utils";

export const DEFAULT_PAGE_SIZE = "10";

export const MENUS = [
  {
    name: "dashboard",
    link: "/dashboard",
    permissions: [Dashboard.NAVIGATE],
    icon: DashboardIcon,
  },
  {
    name: "funders",
    link: "/funders",
    permissions: [Funders.NAVIGATE],
    icon: Funder,
  },
  {
    name: "providers",
    link: "/providers",
    permissions: [Providers.NAVIGATE],
    icon: Provider,
  },
  {
    name: "projects",
    link: "/projects",
    permissions: [Projects.NAVIGATE],
    icon: Project,
  },
  {
    name: "contracts",
    link: "/contracts",
    permissions: [Contracts.NAVIGATE],
    icon: Contract,
  },
  {
    name: "beneficiaries",
    link: "/beneficiaries",
    permissions: [Beneficiaries.NAVIGATE],
    icon: Beneficiary,
  },

  {
    name: "users",
    link: "/users",
    permissions: [Users.NAVIGATE],
    icon: Funder,
  },

  {
    name: "invoices",
    link: "/invoices",
    permissions: [Invoices.NAVIGATE],
    icon: Invoice,
  },

  {
    name: "Milestones",
    link: "/milestones",
    permissions: [Milestones.NAVIGATE],
    icon: Milestone,
  },

  {
    name: "Evidences",
    link: "/evidences",
    permissions: [Evidences.NAVIGATE],
    icon: EvidenceIcon,
  },

  {
    name: "Payouts",
    link: "/payouts",
    permissions: [Payouts.NAVIGATE],
    icon: Payout,
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

type StatusType = {
  label: string;
  value: string;
  allowedOrgTypes: OrgTypes[];
};

export const EVIDENCE_STATUS: StatusType[] = [
  {
    label: "Approved",
    value: "approved",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "Pending review",
    value: "pending review",
    allowedOrgTypes: ["provider", "forte"],
  },
  {
    label: "More information requested",
    value: "more information requested",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "Invoiced",
    value: "invoiced",
    allowedOrgTypes: ["provider", "forte"],
  },
  {
    label: "Rejected",
    value: "rejected",
    allowedOrgTypes: ["provider", "forte", "funder"],
  },
  {
    label: "Paid",
    value: "paid",
    allowedOrgTypes: ["provider", "forte"],
  },
];

export const BENEFICIARY_STATUS: StatusType[] = [
  {
    label: "New",
    value: "New",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "In progress",
    value: "In progress",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "Withdrawn",
    value: "Withdrawn",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "Pending evidence collection",
    value: "Pending evidence collection",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "Pending evidence review",
    value: "Pending evidence review",
    allowedOrgTypes: ["funder", "provider", "forte"],
  },
  {
    label: "Rejected",
    value: "Rejected",
    allowedOrgTypes: ["funder", "forte"],
  },
  {
    label: "Accepted",
    value: "Accepted",
    allowedOrgTypes: ["funder", "forte"],
  },
  {
    label: "Paid",
    value: "Paid",
    allowedOrgTypes: ["provider", "forte"],
  },
];

export const filterStatus = (
  statuses: typeof EVIDENCE_STATUS | typeof BENEFICIARY_STATUS,
  type?: OrgTypes
) => {
  if (!type) return statuses;
  return statuses.filter((e) => e.allowedOrgTypes.includes(type));
};

export const NO_PROMPT_STATUS = ["approved", "invoiced", "rejected", "paid"];

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

export const MILESTONE_STATUS = [
  {
    label: "Open",
    value: "open",
  },
  {
    label: "Achieved",
    value: "achieved",
  },
  {
    label: "Invoiced",
    value: "invoiced",
  },
  {
    label: "Paid",
    value: "paid",
  },
];

export const INVOICE_STATUS = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Paid",
    value: "paid",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export const MILESTONE_TYPES = [
  {
    label: "Threshold",
    value: "threshold",
  },
  {
    label: "Per Outcome",
    value: "outcome",
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

export const FREQUENCY = [
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Quarterly",
    value: "quarterly",
  },
  {
    label: "Yearly",
    value: "yearly",
  },
];

export const PAYOUT_STATUS = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Settled",
    value: "settled",
  },
  {
    label: "Draft",
    value: "draft",
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

export const REGIONS = sortOptions([
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
]);

export const DEFAULT_DATE_FORMAT = "dd LLL yyyy";

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

export const INVOICE_STATUSES: Array<InvoiceStatus> = [
  "cancelled",
  "pending",
  "paid",
];
