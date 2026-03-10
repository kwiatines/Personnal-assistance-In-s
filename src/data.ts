export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

export interface InesProfile {
  name: string;
  title: string;
  contact: {
    phone: string;
    email: string;
    location: string;
    linkedin: string;
  };
  profileSummary: string;
  experience: Experience[];
  education: Education[];
  skills: {
    dataAnalytics: string[];
    hardSkills: string[];
    languages: { language: string; level: string }[];
  };
  interests: string[];
  personality: string[];
  studentJobs: string[];
}

export const inesData: InesProfile = {
  name: "Inès KWIATKOWSKI",
  title: "Business Development & Account Strategy | Data-Driven Sales",
  contact: {
    phone: "+33 6 42 06 50 45",
    email: "kwiatkowski.ines.ik@gmail.com",
    location: "Paris 10",
    linkedin: "LinkedIn",
  },
  profileSummary: "Incoming Master’s graduate and Valedictorian, with a proven track record in Category Growth and Data-Driven Strategy. Expert in managing high-level stakeholder relationships and delivering measurable business impact through negotiation and analytical insights. Fluent in English and French, I am result oriented and eager to leverage my digital expertise and strategic mindset to drive long-term client success and growth.",
  experience: [
    {
      role: "CATEGORY MANAGER SUPPLIES RETAIL",
      company: "HP FRANCE",
      location: "MEUDON, FRANCE",
      period: "SEP. 2024",
      achievements: [
        "Achieved +3 pts market share and +2 pts global availability by executing 4P marketing plans through data-driven stock monitoring and field team coordination.",
        "Managed senior buyer relationships across 9 major retailers, negotiating listings and ensuring 100% compliance with linear share agreements.",
        "Developed growth action plans for the Inkjet category based on deep market analysis and competitive intelligence.",
        "Reduced reporting application bugs by 50% as a field intermediary, significantly enhancing sales data reliability for the organization.",
        "Redesigned the French retail product assortment for the supplies category, optimizing the mix for maximum performance."
      ]
    },
    {
      role: "CRM PROJECT LEADER",
      company: "RAKUTEN FRANCE",
      location: "PARIS, FRANCE",
      period: "JULY 2023 – DEC. 2023",
      achievements: [
        "Maximized CRM performance for High-Tech, Refurbished, and C2C categories by managing end-to-end multi-channel activations (Email, Push, Web Push).",
        "Enhanced commercial planning accuracy by leveraging Salesforce and SAP BI to track KPIs and refine targeting strategies for millions of users.",
        "Streamlined cross-functional workflows using Notion and Batch to ensure timely execution of large-scale promotional campaigns."
      ]
    },
    {
      role: "PROJECTS & CONSULTING",
      company: "VARIOUS",
      location: "REMOTE/PARIS",
      period: "2021 – 2025",
      achievements: [
        "Digital Strategy Consultant for INVITIN: Provided strategic growth recommendations for a digital platform.",
        "Import-Export Consultant for GROUPE TSFM: Conducted market analysis and business development strategies."
      ]
    }
  ],
  education: [
    {
      degree: "MASTER’S DEGREE IN INTERNATIONAL CONSUMER MARKETING",
      institution: "ESCE, FRANCE",
      period: "2021 – 2026",
      details: ["Valedictorian & 1st Prize for the Best Startup Project for the 2021/2022 academic year"]
    },
    {
      degree: "ERASMUS - BACHELOR OF BUSINESS AND COMMUNICATION",
      institution: "UCV VALENCIA, SPAIN",
      period: "2023",
      details: ["Core courses: Entrepreneurship, Growth Strategy, Marketing, Communication"]
    }
  ],
  skills: {
    dataAnalytics: ["Salesforce CRM", "SAP BI", "GFK", "Microsoft Office Suite", "Notion", "Batch"],
    hardSkills: ["Data-driven Decision Making", "Strategic Project management"],
    languages: [
      { language: "French", level: "Native" },
      { language: "English", level: "Professional - TOEIC: 815/990" },
      { language: "Spanish", level: "B1" },
      { language: "Russian", level: "A2" }
    ]
  },
  interests: ["Sailing (10 years with competition)", "Photography (Self-taught)"],
  personality: ["Ambitious", "Curious", "Autonomous", "Never settles for the minimum", "Leadership oriented"],
  studentJobs: ["Sales advisor", "Hostess", "Life assistance (financial independence)"]
};
