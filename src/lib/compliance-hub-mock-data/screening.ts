/**
 * Screening Page Mock Data
 * 
 * This file contains mock data for screening and watchlist management.
 */

import { ScreeningResult } from "@/types/compliance";

export const MOCK_SCREENINGS: ScreeningResult[] = [
  {
    id: "SCR-2024-001",
    subjectId: "APP-2024-003",
    subjectName: "John Mensah",
    listType: "SANCTIONS",
    matchScore: 85,
    matchedAttributes: ["Name", "Date of Birth", "Nationality"],
    screenedAt: "2024-02-20T10:30:00Z",
    disposition: "PENDING",
  },
  {
    id: "SCR-2024-002",
    subjectId: "MERCH-001",
    subjectName: "Global Remittance Services",
    listType: "PEP",
    matchScore: 92,
    matchedAttributes: ["Name", "Country"],
    screenedAt: "2024-02-19T14:20:00Z",
    disposition: "ESCALATED",
  },
  {
    id: "SCR-2024-003",
    subjectId: "APP-2024-005",
    subjectName: "Ama Asante",
    listType: "ADVERSE_MEDIA",
    matchScore: 78,
    matchedAttributes: ["Name"],
    screenedAt: "2024-02-19T09:15:00Z",
    disposition: "PENDING",
  },
  {
    id: "SCR-2024-004",
    subjectId: "APP-2024-002",
    subjectName: "Tech Solutions Ltd",
    listType: "SANCTIONS",
    matchScore: 65,
    matchedAttributes: ["Name"],
    screenedAt: "2024-02-18T16:45:00Z",
    disposition: "FALSE_POSITIVE",
    dispositionBy: "Jane Mensah",
    dispositionAt: "2024-02-18T17:00:00Z",
    dispositionJustification: "Different entity - verified business registration and location",
  },
  {
    id: "SCR-2024-005",
    subjectId: "MERCH-004",
    subjectName: "Kwame Nkrumah",
    listType: "PEP",
    matchScore: 95,
    matchedAttributes: ["Name", "Date of Birth", "Position"],
    screenedAt: "2024-02-18T11:30:00Z",
    disposition: "TRUE_POSITIVE",
    dispositionBy: "Kwame Asante",
    dispositionAt: "2024-02-18T14:20:00Z",
    dispositionJustification: "Confirmed match - current government official, enhanced due diligence applied",
  },
];
