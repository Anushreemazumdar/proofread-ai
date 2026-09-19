export const initialStats = {
  documentsAnalyzed: 24,
  importantFacts: 142,
  conflictsDetected: 18,
  actionsGenerated: 89
};

export const sampleAnalyses = {
  "Scholarship_Notice_2026.pdf": {
    id: "doc-scholarship-2026",
    document: {
      filename: "Scholarship_Notice_2026.pdf",
      pages: 2,
      file_size_bytes: 245800,
      upload_date: "2026-09-18 14:32"
    },
    summary: {
      importantFacts: 4,
      thingsToVerify: 2,
      conflicts: 1,
      actions: 4
    },
    facts: [
      {
        title: "Application Deadline",
        value: "September 20, 2026",
        source: "Page 1, Section 2.1",
        evidence: "Completed applications along with supporting certificates must reach the dean's office no later than September 20, 2026.",
        confidence: "HIGH"
      },
      {
        title: "Eligibility Criteria",
        value: "Undergraduate students with CGPA ≥ 7.5",
        source: "Page 1, Paragraph 4",
        evidence: "Applicants must be enrolled full-time in an accredited undergraduate curriculum with a cumulative grade point average of 7.5 or above.",
        confidence: "HIGH"
      },
      {
        title: "Application Fee",
        value: "₹500 (Non-refundable)",
        source: "Page 2, Section 5",
        evidence: "A mandatory administrative processing fee of INR 500 is payable through the online college portal.",
        confidence: "HIGH"
      },
      {
        title: "Submission Mode",
        value: "Online Portal + Physical Submission",
        source: "Page 1, Section 3",
        evidence: "Submit online and deliver signed hard copies to Room 104.",
        confidence: "MEDIUM"
      }
    ],
    requirements: [
      {
        title: "Enrollment Certificate",
        description: "Official certificate attested by the department head certifying active student status.",
        source: "Page 2, Annexure A",
        confidence: "HIGH"
      },
      {
        title: "Income Affidavit",
        description: "Family income certificate issued by a competent municipal authority.",
        source: "Page 2, Annexure B",
        confidence: "HIGH"
      }
    ],
    thingsToVerify: [
      {
        issue: "Application deadline discrepancy between notice body and annexure.",
        reason: "Page 1 states September 20, while Annexure timetable lists September 25 for physical submission.",
        priority: "HIGH"
      },
      {
        issue: "Hard copy delivery requirement.",
        reason: "Verify whether physical delivery to Room 104 can be done by courier or requires personal in-person signature.",
        priority: "MEDIUM"
      }
    ],
    actions: [
      {
        priority: "HIGH",
        text: "Verify the final application deadline with the department coordinator before proceeding.",
        completed: false
      },
      {
        priority: "HIGH",
        text: "Request bonafide enrollment certificate from the academic registrar office.",
        completed: false
      },
      {
        priority: "MEDIUM",
        text: "Complete the online application form and pay the ₹500 fee.",
        completed: false
      },
      {
        priority: "LOW",
        text: "Print and collate physical copies of all required certificates for submission.",
        completed: false
      }
    ],
    conflicts: [
      {
        topic: "Application Submission Deadline",
        documentA: {
          value: "September 20, 2026",
          source: "Page 1, Section 2.1 (General Notice)"
        },
        documentB: {
          value: "September 25, 2026",
          source: "Page 2, Annexure Schedule (Physical Verification)"
        },
        severity: "HIGH",
        whyItMatters: "Submitting after September 20 could disqualify the application if the online portal closes on the earlier date.",
        recommendation: "Treat September 20 as the strict hard deadline for online submission, and confirm office verification hours."
      }
    ],
    evidence: [
      {
        claim: "Application closes on September 20, 2026.",
        evidence: "All completed online submissions must be logged before 11:59 PM on September 20, 2026.",
        source: "Page 1, paragraph 3",
        confidence: "HIGH"
      },
      {
        claim: "Non-refundable application processing charge applies.",
        evidence: "Candidates must pay an administrative fee of ₹500 via NetBanking or UPI before final review.",
        source: "Page 2, paragraph 1",
        confidence: "HIGH"
      },
      {
        claim: "Minimum academic threshold is required.",
        evidence: "Only candidates holding CGPA 7.5 or higher at the end of the previous academic term are eligible.",
        source: "Page 1, paragraph 5",
        confidence: "HIGH"
      }
    ],
    isMock: true,
    analysisMode: "Demo / Mock Analysis"
  },

  "Internship_Offer_2026.pdf": {
    id: "doc-internship-2026",
    document: {
      filename: "Internship_Offer_2026.pdf",
      pages: 2,
      file_size_bytes: 185000,
      upload_date: "2026-09-17 11:15"
    },
    summary: {
      importantFacts: 5,
      thingsToVerify: 2,
      conflicts: 0,
      actions: 3
    },
    facts: [
      {
        title: "Role Title",
        value: "Software Engineering Intern (Summer 2026)",
        source: "Page 1, Heading",
        evidence: "Appointment for the position of Software Engineering Intern for the 2026 Summer Program.",
        confidence: "HIGH"
      },
      {
        title: "Start Date",
        value: "June 1, 2026",
        source: "Page 1, Section 1",
        evidence: "The internship tenure will formally commence on Monday, June 1, 2026.",
        confidence: "HIGH"
      },
      {
        title: "Monthly Stipend",
        value: "₹45,000 / month",
        source: "Page 1, Compensation",
        evidence: "You will receive a fixed monthly stipend of INR 45,000 subject to applicable tax deductions.",
        confidence: "HIGH"
      },
      {
        title: "Offer Acceptance Window",
        value: "Within 5 days of receipt",
        source: "Page 2, Section 8",
        evidence: "This offer letter is valid for 5 business days from the date of issue.",
        confidence: "HIGH"
      },
      {
        title: "Work Mode",
        value: "Hybrid (Bangalore Office)",
        source: "Page 1, Location",
        evidence: "Position operates on a hybrid model requiring 3 days presence at the Bangalore Tech Park.",
        confidence: "MEDIUM"
      }
    ],
    requirements: [
      {
        title: "College NOC (No Objection Certificate)",
        description: "Signed approval from college placement cell permitting full-time summer work.",
        source: "Page 2, Checklist",
        confidence: "HIGH"
      }
    ],
    thingsToVerify: [
      {
        issue: "Intellectual Property & Exclusivity Clause",
        reason: "Paragraph 7 restricts independent open-source contributions during the internship period without prior written approval.",
        priority: "HIGH"
      },
      {
        issue: "Relocation & Accommodation Assistance",
        reason: "Document does not specify if corporate accommodation is provided for the first week.",
        priority: "LOW"
      }
    ],
    actions: [
      {
        priority: "HIGH",
        text: "Sign and return the digital offer acceptance copy within 5 business days.",
        completed: false
      },
      {
        priority: "HIGH",
        text: "Obtain official NOC from the university Training and Placement Cell.",
        completed: false
      },
      {
        priority: "MEDIUM",
        text: "Submit scanned PAN card, Aadhaar, and cancelled cheque for payroll setup.",
        completed: false
      }
    ],
    conflicts: [],
    evidence: [
      {
        claim: "Tenure begins June 1, 2026.",
        evidence: "The internship period begins June 1, 2026 and concludes August 7, 2026.",
        source: "Page 1, Clause 1.2",
        confidence: "HIGH"
      },
      {
        claim: "Stipend is ₹45,000 per month.",
        evidence: "Monthly remuneration will be paid at ₹45,000 per active month.",
        source: "Page 1, Clause 3.1",
        confidence: "HIGH"
      }
    ],
    isMock: true,
    analysisMode: "Demo / Mock Analysis"
  },

  "College_Tech_Fest_Notice.pdf": {
    id: "doc-college-event",
    document: {
      filename: "College_Tech_Fest_Notice.pdf",
      pages: 1,
      file_size_bytes: 120000,
      upload_date: "2026-09-16 16:45"
    },
    summary: {
      importantFacts: 4,
      thingsToVerify: 1,
      conflicts: 0,
      actions: 3
    },
    facts: [
      {
        title: "Event Date",
        value: "October 14–15, 2026",
        source: "Page 1",
        evidence: "The National Tech Fest will be conducted over two days on October 14 and 15, 2026.",
        confidence: "HIGH"
      },
      {
        title: "Team Size Limit",
        value: "2 to 4 members",
        source: "Page 1, Guidelines",
        evidence: "Teams must comprise between 2 and 4 registered participants.",
        confidence: "HIGH"
      },
      {
        title: "Registration Fee",
        value: "Free for IEEE student members, ₹250 for non-members",
        source: "Page 1, Registration",
        evidence: "IEEE members participate for free; non-members pay a registration fee of ₹250.",
        confidence: "HIGH"
      },
      {
        title: "Venue",
        value: "Main Auditorium, Campus 2",
        source: "Page 1",
        evidence: "Inauguration and presentations take place at the Main Auditorium.",
        confidence: "MEDIUM"
      }
    ],
    requirements: [],
    thingsToVerify: [
      {
        issue: "Hardware & Equipment Provisioning",
        reason: "Notice does not clarify if power outlets or soldering stations are supplied for robotics entries.",
        priority: "LOW"
      }
    ],
    actions: [
      {
        priority: "HIGH",
        text: "Form a team of 2 to 4 members and assign a team captain.",
        completed: false
      },
      {
        priority: "MEDIUM",
        text: "Register through the online portal and submit IEEE membership IDs if applicable.",
        completed: false
      },
      {
        priority: "LOW",
        text: "Prepare project presentation slides (maximum 10 slides).",
        completed: false
      }
    ],
    conflicts: [],
    evidence: [
      {
        claim: "IEEE members enter without registration fee.",
        evidence: "IEEE active student members are exempted from the registration fee upon providing membership numbers.",
        source: "Page 1, section 4",
        confidence: "HIGH"
      }
    ],
    isMock: true,
    analysisMode: "Demo / Mock Analysis"
  }
};

export const sampleDocumentList = [
  {
    id: "doc-scholarship-2026",
    filename: "Scholarship_Notice_2026.pdf",
    dateAnalyzed: "2026-09-18 14:32",
    documentType: "Scholarship",
    factsCount: 4,
    conflictsCount: 1,
    status: "Analyzed"
  },
  {
    id: "doc-internship-2026",
    filename: "Internship_Offer_2026.pdf",
    dateAnalyzed: "2026-09-17 11:15",
    documentType: "Internship Announcement",
    factsCount: 5,
    conflictsCount: 0,
    status: "Analyzed"
  },
  {
    id: "doc-college-event",
    filename: "College_Tech_Fest_Notice.pdf",
    dateAnalyzed: "2026-09-16 16:45",
    documentType: "Event Notice",
    factsCount: 4,
    conflictsCount: 0,
    status: "Analyzed"
  }
];
