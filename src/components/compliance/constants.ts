export const STAFF_SIZE_OPTIONS = [
  { value: "1", label: "Just me" },
  { value: "2-5", label: "2–5 people" },
  { value: "5-50", label: "5–50 people" },
  { value: "50-100", label: "50–100 people" },
  { value: "100+", label: "More than 100 people" },
];

export const INDUSTRY_OPTIONS = [
  { value: "digital_services", label: "Digital services" },
  { value: "education", label: "Education" },
  { value: "financial_services", label: "Financial services" },
  { value: "food_beverages", label: "Food & beverages" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hospitality", label: "Hospitality & tourism" },
  { value: "logistics", label: "Logistics" },
  { value: "retail", label: "Retail & shopping" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

export const CATEGORY_MAP: Record<string, { value: string; label: string }[]> = {
  digital_services: [
    { value: "web_dev", label: "Web development and programming" },
    { value: "design", label: "Design & creative services" },
    { value: "marketing", label: "Digital marketing" },
    { value: "saas", label: "SaaS & software" },
  ],
  education: [
    { value: "online_courses", label: "Online courses & e-learning" },
    { value: "tutoring", label: "Tutoring services" },
    { value: "educational_tools", label: "Educational tools" },
  ],
  financial_services: [
    { value: "fintech", label: "Fintech" },
    { value: "insurance", label: "Insurance" },
    { value: "investment", label: "Investment & trading" },
  ],
  food_beverages: [
    { value: "restaurant", label: "Restaurant & café" },
    { value: "food_delivery", label: "Food delivery" },
    { value: "catering", label: "Catering" },
  ],
  healthcare: [
    { value: "clinic", label: "Clinic & hospital" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "health_tech", label: "Health technology" },
  ],
  hospitality: [
    { value: "hotel", label: "Hotel & accommodation" },
    { value: "travel", label: "Travel & tours" },
    { value: "events", label: "Events & entertainment" },
  ],
  logistics: [
    { value: "shipping", label: "Shipping & delivery" },
    { value: "warehousing", label: "Warehousing" },
    { value: "supply_chain", label: "Supply chain" },
  ],
  retail: [
    { value: "fashion", label: "Fashion & apparel" },
    { value: "electronics", label: "Electronics" },
    { value: "home_goods", label: "Home goods" },
    { value: "general_retail", label: "General retail" },
  ],
  technology: [
    { value: "hardware", label: "Hardware & devices" },
    { value: "cloud", label: "Cloud services" },
    { value: "cybersecurity", label: "Cybersecurity" },
  ],
  other: [
    { value: "other_general", label: "Other" },
  ],
};

export const BUSINESS_TYPE_OPTIONS = [
  { value: "registered", label: "Registered Business" },
  { value: "starter", label: "Starter Business (Unregistered)" },
];

export const REGISTRATION_TYPE_OPTIONS = [
  { value: "private_company", label: "Private Company" },
  { value: "public_company", label: "Public Company" },
  { value: "partnership", label: "Partnership" },
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
];

export const GH_REGIONS = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern",
  "Greater Accra", "North East", "Northern", "Oti", "Savannah",
  "Upper East", "Upper West", "Volta", "Western", "Western North",
];

export const PHONE_CODES = [
  { value: "+233", label: "+233" },
  { value: "+234", label: "+234" },
  { value: "+254", label: "+254" },
  { value: "+27", label: "+27" },
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
];

export const GH_BANKS = [
  "Absa Bank Ghana",
  "Access Bank Ghana",
  "Agricultural Development Bank",
  "Bank of Africa Ghana",
  "CAL Bank",
  "Consolidated Bank Ghana",
  "Ecobank Ghana",
  "FBNBank Ghana",
  "Fidelity Bank Ghana",
  "First Atlantic Bank",
  "GCB Bank Limited",
  "National Investment Bank",
  "Prudential Bank",
  "Republic Bank Ghana",
  "Société Générale Ghana",
  "Standard Chartered Bank Ghana",
  "Stanbic Bank Ghana",
  "United Bank for Africa Ghana",
  "Universal Merchant Bank",
  "Zenith Bank Ghana",
];

export const MOBILE_MONEY_PROVIDERS = [
  { value: "mtn", label: "MTN" },
  { value: "telecel", label: "Telecel" },
  { value: "airteltigo", label: "AirtelTigo" },
];

export const NATIONALITIES = [
  "Ghanaian", "Nigerian", "Kenyan", "South African", "American",
  "British", "French", "German", "Chinese", "Indian", "Other",
];

export const ID_DOCUMENTS = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voters_id", label: "Voter's ID" },
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
