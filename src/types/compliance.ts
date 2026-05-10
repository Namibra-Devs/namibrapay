export interface Address {
  country: string;
  state: string;
  city: string;
  street: string;
  complex: string;
  gpsAddress: string;
}

export interface ProfileData {
  tradingName: string;
  description: string;
  staffSize: string;
  annualVolume: string;
  industry: string;
  category: string;
  businessType: string;
  legalName: string;
  registrationType: string;
}

export interface ContactData {
  generalEmail: string;
  supportEmail: string;
  useSupportAsGeneral: boolean;
  disputesEmail: string;
  useDisputeAsGeneral: boolean;
  phoneCode: string;
  phone: string;
  website: string;
  twitter: string;
  facebook: string;
  instagram: string;
  registeredAddress: Address;
  officeAddress: Address;
  useRegisteredForOffice: boolean;
}

export interface AccountData {
  accountType: "bank" | "mobile_money" | "";
  bankName: string;
  accountNumber: string;
  provider: string;
  mobilePhone: string;
  nameOnAccount: string;
}

export interface Person {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  phone: string;
  percentageOwned: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  nationality: string;
  idDocument: string;
  idNumber: string;
  idFileName: string;
  country: string;
  state: string;
  city: string;
  street: string;
  complex: string;
  proofFileName: string;
  gpsAddress: string;
}

export interface DocumentsData {
  form3Name: string;
  certificateName: string;
  ghanaCardFrontName: string;
  ghanaCardBackName: string;
  tin: string;
  directors: Person[];
  beneficialOwners: Person[];
}

export interface ServiceAgreementData {
  fullName: string;
  phoneCode: string;
  phone: string;
  email: string;
  jobTitle: string;
  accepted: boolean;
}
