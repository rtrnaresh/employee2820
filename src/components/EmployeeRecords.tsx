/**
 * EmployeeRecords.tsx
 * 
 * A comprehensive ERP-style Employee Records form component.
 * Features: Personal details, addresses, education, academics, experience,
 * research publications, technical participation, and more.
 * 
 * @version 2.0.0
 * @exports EmployeeRecords - Main form component
 * 
 * JSON Schema available at: employee-records.schema.json
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Download, Send, FileText, Upload, X, Check, Award, Trophy, Star, Medal, Briefcase } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

interface PersonalDetails {
  fullName: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fatherHusbandName: string;
  motherName: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  designation: string;
  department: string;
  mobileNo: string;
  residenceContactNo: string;
  emailId: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  aadharNo: string;
  pan: string;
  maritalStatus: string;
  physicallyChallenged: string;
  fullNameDevanagari: string;
}

interface Address {
  address: string;
  district: string;
  taluka: string;
  city: string;
  state: string;
  pinCode: string;
}

interface EducationRow {
  id: string;
  courseName: string;
  instituteName: string;
  durationMonths: string;
  yearOfPassing: string;
  percentageOrStatus: string;
  isPhD: boolean;
  phdStatus: 'awarded' | 'pursuing' | '';
  phdCertificateFile: File | null;
}

interface AcademicsRow {
  id: string;
  courseType: 'diploma' | 'undergraduate' | 'postgraduate' | '';
  pgProgram: string[];
  programme: string;
  subjectName: string;
  patternName: string;
  academicYear: string;
  classSemester: string;
  studentsAttempted: string;
  studentsPassed: string;
}

interface ExperienceRow {
  id: string;
  type: 'educational' | 'industrial' | 'research';
  organisation: string;
  designation: string;
  fromDate: string;
  toDate: string;
  offerLetterFile: File | null;
}

interface PublicationRow {
  id: string;
  publicationType: string;
  conferenceScope: 'national' | 'international' | '';
  conferenceRole: 'presenter' | 'attended' | '';
  programme: string;
  academicYear: string;
  title: string;
  area: string;
  publicationDate: string;
  journalConferenceName: string;
  publisherName: string;
  uploadFile: File | null;
  selectedProfiles: string[];
  googleScholarId: string;
  googleScholarLink: string;
  scopusId: string;
  scopusLink: string;
  orcidId: string;
  orcidLink: string;
}

interface TechnicalParticipationRow {
  id: string;
  participationType: string;
  programme: string;
  academicYear: string;
  fromDate: string;
  toDate: string;
  organizationName: string;
  topicArea: string;
  uploadFile: File | null;
}

interface GuidanceRow {
  id: string;
  programmeType: string;
  academicYear: string;
  courseType: string;
  fromDate: string;
  toDate: string;
  venueInstitution: string;
  title: string;
  scholarsOngoing: string;
  scholarsCompleted: string;
  scholarNamesOngoing: string[];
  scholarNamesCompleted: string[];
  status: 'ongoing' | 'completed' | '';
  uploadFile: File | null;
}

interface OrganizedEventRow {
  id: string;
  academicYear: string;
  programme: string;
  eventType: string;
  eventTitle: string;
  fromDate: string;
  endDate: string;
  venueInstitution: string;
  noOfParticipants: string;
  participantsCourse: string[];
  geoTagPhotos: File[];
  eventReport: File | null;
  budgetReport: File | null;
  appreciationLetter: File | null;
}

interface ResponsibilityRow {
  id: string;
  programme: string;
  academicYear: string;
  allottedResponsibility: string;
  remarks: string;
}

interface AwardRow {
  id: string;
  awardType: string[];
  academicYear: string;
  title: string;
  issuingOrganization: string;
  dateReceived: string;
  description: string;
  offCampusDesignation: string;
  offCampusOther: string;
  offCampusPeriodFrom: string;
  offCampusPeriodTo: string;
  offCampusInstitution: string;
  uploadFile: File | null;
}

interface SalaryDetails {
  accountNo: string;
  bankName: string;
  branchName: string;
  paymentBasic: string;
  da: string;
  hra: string;
  gross: string;
  payBand: string;
  pf: string;
  offerLetterFile: File | null;
}

interface ApprovalRow {
  id: string;
  postDesignation: string;
  faculty: string;
  approvalAsPer: string;
  approvalForUGPG: string;
  postType: string;
  selectionDoneBy: string;
  postReservedFor: string;
  workType: 'fullTime' | 'partTime' | 'clockHourBasis' | '';
  approvalType: 'permanent' | 'temporary' | '';
  appointedOn: string;
  universityName: string;
  collegeName: string;
  payscale: 'isCurrent' | 'isBack' | '';
  approvalRefNo: string;
  approvalLetterDate: string;
  validFromDate: string;
  toDate: string;
  documentFile: File | null;
}

interface FormData {
  personalDetails: PersonalDetails;
  correspondenceAddress: Address;
  permanentAddress: Address;
  sameAsCorrespondence: boolean;
  educationalQualifications: EducationRow[];
  academicsRecord: AcademicsRow[];
  approvalDetails: ApprovalRow[];
  experience: ExperienceRow[];
  publications: PublicationRow[];
  technicalParticipation: TechnicalParticipationRow[];
  guidance: GuidanceRow[];
  organizedEvents: OrganizedEventRow[];
  awards: AwardRow[];
  responsibilities: ResponsibilityRow[];
  salaryDetails: SalaryDetails;
}

// ==================== CONSTANTS ====================

// Course-based Programme lists
const DIPLOMA_PROGRAMMES = [
  "Civil Engineering",
  "Artificial Intelligence & Machine Learning (AIML)",
  "Electronics & Telecommunication Engineering (EXTC)",
  "Mechanical Engineering",
  "Mechatronics Engineering"
];

const UG_PROGRAMMES = [
  "Computer Engineering",
  "Computer Science & Engineering (AI & ML)",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics & Telecommunication Engineering (EXTC)",
  "Information Technology Engineering (IT)",
  "Mechanical Engineering"
];

const PG_PROGRAMMES_ME = [
  "Computer Engineering",
  "Electronics & Telecommunication Engineering",
  "Mechanical Engineering (Energy Systems & Management)"
];

const PG_PROGRAMMES_MMS = [
  "Marketing",
  "Finance",
  "Human Resources (HR)",
  "Information Systems",
  "Operations"
];

export const DEPARTMENTS = [
  ...UG_PROGRAMMES.map(p => `B.E./B.Tech - ${p}`),
  ...PG_PROGRAMMES_ME.map(p => `M.E./M.Tech - ${p}`),
  ...PG_PROGRAMMES_MMS.map(p => `MMS - ${p}`),
  ...DIPLOMA_PROGRAMMES.map(p => `Diploma - ${p}`)
];

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['Open', 'OBC', 'VJ-NT', 'SBC', 'EBC', 'SC', 'ST'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const PUBLICATION_TYPES = ['Journal SCI', 'Journal ESCI', 'SCOPUS', 'WOS', 'IEEE', 'Conference', 'Book', 'Chapter', 'Patent', 'Grants'];
const RESEARCH_PROFILES = ['Google Scholar', 'Scopus', 'ORCID iD'];
const PARTICIPATION_TYPES = ['FDP', 'Workshop', 'STTP', 'Seminar', 'Webinar'];
const GUIDANCE_TYPES = ['PhD Supervisor', 'PG Project Guide/Guided', 'UG Project Guide/Guided', 'Diploma Project Guide/Guided', 'Mentor (Hackathon, Club, Project, Idea)'];
const PARTICIPANT_COURSES = ['PhD', 'PG', 'UG', 'Diploma', 'School'];
const EVENT_TYPES = ['Workshop', 'Seminar', 'Conference', 'FDP', 'Guest Lecture', 'Webinar', 'Social Activity', 'NSS', 'Cultural Event', 'Sports Event', 'Technical Event', 'Other'];
const AWARD_TYPES = ['Award', 'Reward', 'Recognition', 'Achievement', 'Off Campus Designation'];
const OFF_CAMPUS_DESIGNATIONS = ['Board of Studies (BOS) Member', 'IQAC Coordinator', 'IQAC Member', 'Trustee', 'Secretary', 'Director', 'Dean', 'Controller of Examinations', 'Senate Member', 'Academic Council Member', 'Other'];

// Previous Approval Letter constants
const POST_DESIGNATIONS = ['Principal', 'Professor', 'Associate Professor', 'Assistant Professor'];
const FACULTIES = ['Engineering', 'Architecture', 'MBA', 'MCA'];
const APPROVAL_FOR_UGPG = ['All', 'BOS', 'Course'];
const POST_TYPES = ['Regular', 'Adhoc'];
const SELECTION_DONE_BY = ['Local Selection Committee', 'University Selection Committee'];
const POST_RESERVED_FOR = ['OPEN', 'OBC', 'VJ-NT', 'SBC', 'EBC', 'SC', 'ST'];
const APPOINTED_ON = ['Non-Granted', 'Granted'];

// Indian Universities List
const INDIAN_UNIVERSITIES = [
  "University of Mumbai",
  "Savitribai Phule Pune University",
  "University of Delhi",
  "Anna University",
  "Jawaharlal Nehru University",
  "Banaras Hindu University",
  "Jadavpur University",
  "Calcutta University",
  "Osmania University",
  "Aligarh Muslim University",
  "Gujarat University",
  "Rajasthan University",
  "Madras University",
  "Bangalore University",
  "Kerala University",
  "Andhra University",
  "Gauhati University",
  "Panjab University",
  "Mysore University",
  "Nagpur University",
  "Dr. Babasaheb Ambedkar Marathwada University",
  "Shivaji University",
  "North Maharashtra University",
  "Solapur University",
  "Rashtrasant Tukadoji Maharaj Nagpur University",
  "Sant Gadge Baba Amravati University",
  "Swami Ramanand Teerth Marathwada University",
  "Indian Institute of Technology Bombay",
  "Indian Institute of Technology Delhi",
  "Indian Institute of Technology Madras",
  "Indian Institute of Technology Kanpur",
  "Indian Institute of Technology Kharagpur",
  "Indian Institute of Technology Roorkee",
  "Indian Institute of Technology Guwahati",
  "Indian Institute of Technology Hyderabad",
  "Birla Institute of Technology and Science",
  "National Institute of Technology Trichy",
  "VIT University",
  "SRM University",
  "Manipal University",
  "Amity University",
  "Lovely Professional University",
  "Symbiosis International University",
  "NMIMS University",
  "Tata Institute of Social Sciences",
  "Indian Statistical Institute",
  "All India Institute of Medical Sciences",
  "Other"
];

const DEFAULT_EDUCATION_ROWS: EducationRow[] = [
  { id: '1', courseName: 'SSC', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '', phdCertificateFile: null },
  { id: '2', courseName: 'HSC', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '', phdCertificateFile: null },
  { id: '3', courseName: 'B.E/B.Tech', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '', phdCertificateFile: null },
  { id: '4', courseName: 'M.E/M.Tech', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '', phdCertificateFile: null },
  { id: '5', courseName: 'Ph.D.', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: true, phdStatus: '', phdCertificateFile: null },
];

// ==================== UTILITY FUNCTIONS ====================

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateAcademicYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(`${i}-${(i + 1).toString().slice(-2)}`);
  }
  return years;
};

const calculateDuration = (fromDate: string, toDate: string): string => {
  if (!fromDate) return '';
  const from = new Date(fromDate);
  const to = toDate ? new Date(toDate) : new Date();
  
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years > 0 && remainingMonths > 0) {
    return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
  } else if (years > 0) {
    return `${years} yr${years > 1 ? 's' : ''}`;
  } else if (remainingMonths > 0) {
    return `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
  }
  return toDate ? '' : 'Currently Employed';
};

const calculatePassPercentage = (attempted: string, passed: string): string => {
  const a = parseInt(attempted, 10);
  const p = parseInt(passed, 10);
  if (isNaN(a) || isNaN(p) || a === 0) return '';
  return ((p / a) * 100).toFixed(2) + '%';
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateAadhar = (aadhar: string): boolean => {
  return /^\d{12}$/.test(aadhar);
};

const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
};

const getProgrammesByType = (courseType: string): string[] => {
  switch (courseType) {
    case 'diploma':
      return DIPLOMA_PROGRAMMES;
    case 'undergraduate':
      return UG_PROGRAMMES;
    case 'postgraduate':
      return [...PG_PROGRAMMES_ME, ...PG_PROGRAMMES_MMS];
    default:
      return [];
  }
};

// ==================== INITIAL STATE ====================

const getInitialFormData = (): FormData => ({
  personalDetails: {
    fullName: '',
    salutation: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherHusbandName: '',
    motherName: '',
    dateOfJoining: '',
    dateOfLeaving: '',
    designation: '',
    department: '',
    mobileNo: '',
    residenceContactNo: '',
    emailId: '',
    dateOfBirth: '',
    gender: '',
    category: '',
    aadharNo: '',
    pan: '',
    maritalStatus: '',
    physicallyChallenged: '',
    fullNameDevanagari: '',
  },
  correspondenceAddress: { address: '', district: '', taluka: '', city: '', state: '', pinCode: '' },
  permanentAddress: { address: '', district: '', taluka: '', city: '', state: '', pinCode: '' },
  sameAsCorrespondence: false,
  educationalQualifications: [...DEFAULT_EDUCATION_ROWS],
  academicsRecord: [],
  approvalDetails: [],
  experience: [],
  publications: [],
  technicalParticipation: [],
  guidance: [],
  organizedEvents: [],
  awards: [],
  responsibilities: [],
  salaryDetails: {
    accountNo: '',
    bankName: '',
    branchName: '',
    paymentBasic: '',
    da: '',
    hra: '',
    gross: '',
    payBand: '',
    pf: '',
    offerLetterFile: null,
  },
});

// ==================== SUB-COMPONENTS ====================

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="erp-section-header">{title}</div>
);

const FormField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, required, error, children, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="erp-label">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
    {error && <span className="text-xs text-destructive mt-0.5">{error}</span>}
  </div>
);

const FileUploadField: React.FC<{
  label: string;
  hint?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
}> = ({ label, hint, file, onFileChange, accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  return (
    <div className="flex flex-col flex-1">
      <label className="erp-label text-xs">{label}</label>
      <div className="erp-file-upload relative h-[70px]">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={label}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-xs h-full">
            <FileText className="w-4 h-4 text-primary" />
            <span className="truncate max-w-[80px]">{file.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
              className="text-destructive hover:text-destructive/80"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground flex flex-col items-center justify-center h-full">
            <Upload className="w-4 h-4 mb-1" />
            <span>Click to upload</span>
            {hint && <div className="text-[9px] mt-0.5 text-center">{hint}</div>}
          </div>
        )}
      </div>
      <span className="text-[9px] text-muted-foreground mt-0.5">Max: 5MB</span>
    </div>
  );
};

const MultiFileUpload: React.FC<{
  label: string;
  hint?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}> = ({ label, hint, files, onFilesChange, maxFiles = 5 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const combined = [...files, ...newFiles].slice(0, maxFiles);
    onFilesChange(combined);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col flex-1">
      <label className="erp-label text-xs">{label}</label>
      <div className="erp-file-upload relative h-[70px]">
        <input
          type="file"
          multiple
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={label}
        />
        <div className="text-xs text-muted-foreground flex flex-col items-center justify-center h-full">
          <Upload className="w-4 h-4 mb-1" />
          <span>({files.length}/{maxFiles})</span>
          {hint && <div className="text-[9px] mt-0.5 text-center">{hint}</div>}
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-1 space-y-1">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
              <FileText className="w-3 h-3" />
              <span className="truncate flex-1">{file.name}</span>
              <button type="button" onClick={() => removeFile(idx)} className="text-destructive">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Summary Component
const SummarySection: React.FC<{ formData: FormData; academicYears: string[] }> = ({ formData, academicYears }) => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  const summary = useMemo(() => {
    const filterByYear = (items: any[], yearField: string = 'academicYear') => {
      if (!selectedYear) return items;
      return items.filter(item => item[yearField] === selectedYear);
    };

    const eventsOrganized = filterByYear(formData.organizedEvents).length;
    const eventsParticipated = filterByYear(formData.technicalParticipation).length;
    const publications = filterByYear(formData.publications).length;
    const scholarsGuided = filterByYear(formData.guidance).reduce((sum, g) => {
      return sum + (parseInt(g.scholarsOngoing) || 0) + (parseInt(g.scholarsCompleted) || 0);
    }, 0);
    const awards = filterByYear(formData.awards).length;
    const responsibilities = filterByYear(formData.responsibilities).length;
    const academicsRecords = filterByYear(formData.academicsRecord).length;

    return {
      eventsOrganized,
      eventsParticipated,
      publications,
      scholarsGuided,
      awards,
      responsibilities,
      academicsRecords
    };
  }, [formData, selectedYear]);

  return (
    <div className="erp-card">
      <SectionHeader title="Summary" />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <FormField label="Filter by Academic Year">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="erp-select w-full"
              >
                <option value="">All Years</option>
                {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </FormField>
          </div>
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-xs">
              <span className="text-muted-foreground">Name:</span>
              <div className="font-medium">{formData.personalDetails.fullName || '-'}</div>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Mobile:</span>
              <div className="font-medium">{formData.personalDetails.mobileNo || '-'}</div>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Department:</span>
              <div className="font-medium truncate">{formData.personalDetails.department || '-'}</div>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Designation:</span>
              <div className="font-medium">{formData.personalDetails.designation || '-'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.eventsOrganized}</div>
            <div className="text-xs text-muted-foreground">Events Organized</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.eventsParticipated}</div>
            <div className="text-xs text-muted-foreground">Events Participated</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.publications}</div>
            <div className="text-xs text-muted-foreground">Publications</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.scholarsGuided}</div>
            <div className="text-xs text-muted-foreground">Scholars Guided</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.awards}</div>
            <div className="text-xs text-muted-foreground">Awards</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.responsibilities}</div>
            <div className="text-xs text-muted-foreground">Responsibilities</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{summary.academicsRecords}</div>
            <div className="text-xs text-muted-foreground">Academic Records</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const EmployeeRecords: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const academicYears = useMemo(() => generateAcademicYears(), []);

  // ==================== HANDLERS ====================

  const updatePersonalDetails = useCallback((field: keyof PersonalDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value }
    }));
    if (errors[`personal.${field}`]) {
      setErrors(prev => { const n = { ...prev }; delete n[`personal.${field}`]; return n; });
    }
  }, [errors]);

  const updateCorrespondenceAddress = useCallback((field: keyof Address, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        correspondenceAddress: { ...prev.correspondenceAddress, [field]: value }
      };
      if (prev.sameAsCorrespondence) {
        newData.permanentAddress = { ...newData.correspondenceAddress };
      }
      return newData;
    });
  }, []);

  const updatePermanentAddress = useCallback((field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      permanentAddress: { ...prev.permanentAddress, [field]: value }
    }));
  }, []);

  const toggleSameAsCorrespondence = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      sameAsCorrespondence: !prev.sameAsCorrespondence,
      permanentAddress: !prev.sameAsCorrespondence ? { ...prev.correspondenceAddress } : prev.permanentAddress
    }));
  }, []);

  // Education handlers
  const updateEducationRow = useCallback((id: string, field: keyof EducationRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      educationalQualifications: prev.educationalQualifications.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const addEducationRow = useCallback(() => {
    if (formData.educationalQualifications.length >= 10) return;
    setFormData(prev => ({
      ...prev,
      educationalQualifications: [...prev.educationalQualifications, {
        id: generateId(),
        courseName: '',
        instituteName: '',
        durationMonths: '',
        yearOfPassing: '',
        percentageOrStatus: '',
        isPhD: false,
        phdStatus: '',
        phdCertificateFile: null
      }]
    }));
  }, [formData.educationalQualifications.length]);

  const removeEducationRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      educationalQualifications: prev.educationalQualifications.filter(row => row.id !== id)
    }));
  }, []);

  // Academics handlers
  const addAcademicsRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      academicsRecord: [...prev.academicsRecord, {
        id: generateId(),
        courseType: '',
        pgProgram: [],
        programme: '',
        subjectName: '',
        patternName: '',
        academicYear: '',
        classSemester: '',
        studentsAttempted: '',
        studentsPassed: ''
      }]
    }));
  }, []);

  const updateAcademicsRow = useCallback((id: string, field: keyof AcademicsRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      academicsRecord: prev.academicsRecord.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeAcademicsRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      academicsRecord: prev.academicsRecord.filter(row => row.id !== id)
    }));
  }, []);

  // Approval Details handlers
  const addApprovalRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      approvalDetails: [...prev.approvalDetails, {
        id: generateId(),
        postDesignation: '',
        faculty: '',
        approvalAsPer: '',
        approvalForUGPG: '',
        postType: '',
        selectionDoneBy: '',
        postReservedFor: '',
        workType: '',
        approvalType: '',
        appointedOn: '',
        universityName: '',
        collegeName: '',
        payscale: '',
        approvalRefNo: '',
        approvalLetterDate: '',
        validFromDate: '',
        toDate: '',
        documentFile: null
      }]
    }));
  }, []);

  const updateApprovalRow = useCallback((id: string, field: keyof ApprovalRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      approvalDetails: prev.approvalDetails.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeApprovalRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      approvalDetails: prev.approvalDetails.filter(row => row.id !== id)
    }));
  }, []);

  // Experience handlers
  const addExperienceRow = useCallback((type: 'educational' | 'industrial' | 'research') => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: generateId(),
        type,
        organisation: '',
        designation: '',
        fromDate: '',
        toDate: '',
        offerLetterFile: null
      }]
    }));
  }, []);

  const updateExperienceRow = useCallback((id: string, field: keyof ExperienceRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeExperienceRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(row => row.id !== id)
    }));
  }, []);

  // Publication handlers
  const addPublicationRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      publications: [...prev.publications, {
        id: generateId(),
        publicationType: '',
        conferenceScope: '',
        conferenceRole: '',
        programme: '',
        academicYear: '',
        title: '',
        area: '',
        publicationDate: '',
        journalConferenceName: '',
        publisherName: '',
        uploadFile: null,
        selectedProfiles: [],
        googleScholarId: '',
        googleScholarLink: '',
        scopusId: '',
        scopusLink: '',
        orcidId: '',
        orcidLink: ''
      }]
    }));
  }, []);

  const updatePublicationRow = useCallback((id: string, field: keyof PublicationRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removePublicationRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter(row => row.id !== id)
    }));
  }, []);

  // Technical Participation handlers
  const addTechnicalRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      technicalParticipation: [...prev.technicalParticipation, {
        id: generateId(),
        participationType: '',
        programme: '',
        academicYear: '',
        fromDate: '',
        toDate: '',
        organizationName: '',
        topicArea: '',
        uploadFile: null
      }]
    }));
  }, []);

  const updateTechnicalRow = useCallback((id: string, field: keyof TechnicalParticipationRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      technicalParticipation: prev.technicalParticipation.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeTechnicalRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      technicalParticipation: prev.technicalParticipation.filter(row => row.id !== id)
    }));
  }, []);

  // Guidance handlers
  const addGuidanceRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      guidance: [...prev.guidance, {
        id: generateId(),
        programmeType: '',
        academicYear: '',
        courseType: '',
        fromDate: '',
        toDate: '',
        venueInstitution: '',
        title: '',
        scholarsOngoing: '',
        scholarsCompleted: '',
        scholarNamesOngoing: [],
        scholarNamesCompleted: [],
        status: '',
        uploadFile: null
      }]
    }));
  }, []);

  const updateGuidanceRow = useCallback((id: string, field: keyof GuidanceRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      guidance: prev.guidance.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeGuidanceRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      guidance: prev.guidance.filter(row => row.id !== id)
    }));
  }, []);

  // Organized Events handlers
  const addEventRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      organizedEvents: [...prev.organizedEvents, {
        id: generateId(),
        academicYear: '',
        programme: '',
        eventType: '',
        eventTitle: '',
        fromDate: '',
        endDate: '',
        venueInstitution: '',
        noOfParticipants: '',
        participantsCourse: [],
        geoTagPhotos: [],
        eventReport: null,
        budgetReport: null,
        appreciationLetter: null
      }]
    }));
  }, []);

  const updateEventRow = useCallback((id: string, field: keyof OrganizedEventRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      organizedEvents: prev.organizedEvents.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeEventRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      organizedEvents: prev.organizedEvents.filter(row => row.id !== id)
    }));
  }, []);

  // Awards handlers
  const addAwardRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, {
        id: generateId(),
        awardType: [],
        academicYear: '',
        title: '',
        issuingOrganization: '',
        dateReceived: '',
        description: '',
        offCampusDesignation: '',
        offCampusOther: '',
        offCampusPeriodFrom: '',
        offCampusPeriodTo: '',
        offCampusInstitution: '',
        uploadFile: null
      }]
    }));
  }, []);

  const updateAwardRow = useCallback((id: string, field: keyof AwardRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeAwardRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter(row => row.id !== id)
    }));
  }, []);

  // Responsibility handlers
  const addResponsibilityRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, {
        id: generateId(),
        programme: '',
        academicYear: '',
        allottedResponsibility: '',
        remarks: ''
      }]
    }));
  }, []);

  const updateResponsibilityRow = useCallback((id: string, field: keyof ResponsibilityRow, value: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  }, []);

  const removeResponsibilityRow = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(row => row.id !== id)
    }));
  }, []);

  // Salary handlers
  const updateSalaryDetails = useCallback((field: keyof SalaryDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      salaryDetails: { ...prev.salaryDetails, [field]: value }
    }));
  }, []);

  // ==================== VALIDATION ====================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const pd = formData.personalDetails;

    if (!pd.fullName.trim()) newErrors['personal.fullName'] = 'Required';
    if (!pd.firstName.trim()) newErrors['personal.firstName'] = 'Required';
    if (!pd.lastName.trim()) newErrors['personal.lastName'] = 'Required';
    if (pd.emailId && !validateEmail(pd.emailId)) newErrors['personal.emailId'] = 'Invalid email';
    if (pd.aadharNo && !validateAadhar(pd.aadharNo)) newErrors['personal.aadharNo'] = 'Must be 12 digits';
    if (pd.pan && !validatePAN(pd.pan)) newErrors['personal.pan'] = 'Invalid PAN format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== ACTIONS ====================

  const getExportData = () => {
    const exportData = JSON.parse(JSON.stringify(formData, (key, value) => {
      if (value instanceof File) return value.name;
      if (Array.isArray(value) && value[0] instanceof File) return value.map(f => f.name);
      return value;
    }));
    return exportData;
  };

  const handleSaveDraft = () => {
    const data = getExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-record-draft-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data = getExportData();
    console.log('Form Submitted:', data);
    setShowSuccessModal(true);
  };

  const handleExportPDF = () => {
    window.print();
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-background py-4 px-2 sm:px-4 lg:px-8 print:bg-white print:p-0">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="bg-primary text-primary-foreground py-3 px-4 rounded-t-lg mb-0">
          <h1 className="text-lg sm:text-xl font-bold text-center uppercase tracking-wider">
            Employee Records
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="bg-card border-x border-border px-4 py-3 flex flex-wrap gap-2 justify-end print:hidden">
          <button type="button" onClick={handleSaveDraft} className="erp-btn-secondary flex items-center gap-1">
            <Download className="w-4 h-4" /> Save Draft
          </button>
          <button type="button" onClick={handleExportPDF} className="erp-btn-secondary flex items-center gap-1">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button type="submit" className="erp-btn-success flex items-center gap-1">
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>

        {/* Personal Details Section */}
        <div className="erp-card rounded-t-none">
          <SectionHeader title="Personal Details" />
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <FormField label="Full Name" required error={errors['personal.fullName']}>
                <input
                  type="text"
                  value={formData.personalDetails.fullName}
                  onChange={(e) => updatePersonalDetails('fullName', e.target.value)}
                  className="erp-input w-full"
                  aria-required="true"
                />
              </FormField>

              <FormField label="Salutation">
                <select
                  value={formData.personalDetails.salutation}
                  onChange={(e) => updatePersonalDetails('salutation', e.target.value)}
                  className="erp-select w-full"
                >
                  <option value="">-- Select --</option>
                  {SALUTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              <FormField label="First Name" required error={errors['personal.firstName']}>
                <input
                  type="text"
                  value={formData.personalDetails.firstName}
                  onChange={(e) => updatePersonalDetails('firstName', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Middle Name">
                <input
                  type="text"
                  value={formData.personalDetails.middleName}
                  onChange={(e) => updatePersonalDetails('middleName', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Last Name" required error={errors['personal.lastName']}>
                <input
                  type="text"
                  value={formData.personalDetails.lastName}
                  onChange={(e) => updatePersonalDetails('lastName', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Father/Husband Full Name">
                <input
                  type="text"
                  value={formData.personalDetails.fatherHusbandName}
                  onChange={(e) => updatePersonalDetails('fatherHusbandName', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Mother's Name">
                <input
                  type="text"
                  value={formData.personalDetails.motherName}
                  onChange={(e) => updatePersonalDetails('motherName', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Date of Joining">
                <input
                  type="date"
                  value={formData.personalDetails.dateOfJoining}
                  onChange={(e) => updatePersonalDetails('dateOfJoining', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Date of Leaving (Admin Only)">
                <input
                  type="date"
                  value={formData.personalDetails.dateOfLeaving}
                  disabled
                  className="erp-input w-full bg-muted cursor-not-allowed"
                  title="This field is managed by admin only"
                />
              </FormField>

              <FormField label="Duration/Period">
                <input
                  type="text"
                  value={calculateDuration(formData.personalDetails.dateOfJoining, '')}
                  readOnly
                  className="erp-input w-full bg-muted"
                />
              </FormField>

              <FormField label="Designation">
                <input
                  type="text"
                  value={formData.personalDetails.designation}
                  onChange={(e) => updatePersonalDetails('designation', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Department">
                <select
                  value={formData.personalDetails.department}
                  onChange={(e) => updatePersonalDetails('department', e.target.value)}
                  className="erp-select w-full"
                >
                  <option value="">-- Select --</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </FormField>

              <FormField label="Mobile No">
                <input
                  type="tel"
                  value={formData.personalDetails.mobileNo}
                  onChange={(e) => updatePersonalDetails('mobileNo', e.target.value.replace(/\D/g, ''))}
                  className="erp-input w-full"
                  maxLength={10}
                />
              </FormField>

              <FormField label="Residence Contact No">
                <input
                  type="tel"
                  value={formData.personalDetails.residenceContactNo}
                  onChange={(e) => updatePersonalDetails('residenceContactNo', e.target.value.replace(/\D/g, ''))}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Email ID" error={errors['personal.emailId']}>
                <input
                  type="email"
                  value={formData.personalDetails.emailId}
                  onChange={(e) => updatePersonalDetails('emailId', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Date of Birth">
                <input
                  type="date"
                  value={formData.personalDetails.dateOfBirth}
                  onChange={(e) => updatePersonalDetails('dateOfBirth', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Gender">
                <select
                  value={formData.personalDetails.gender}
                  onChange={(e) => updatePersonalDetails('gender', e.target.value)}
                  className="erp-select w-full"
                >
                  <option value="">-- Select --</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>

              <FormField label="Category">
                <select
                  value={formData.personalDetails.category}
                  onChange={(e) => updatePersonalDetails('category', e.target.value)}
                  className="erp-select w-full"
                >
                  <option value="">-- Select --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>

              <FormField label="Aadhar UIDAI No" error={errors['personal.aadharNo']}>
                <input
                  type="text"
                  value={formData.personalDetails.aadharNo}
                  onChange={(e) => updatePersonalDetails('aadharNo', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="erp-input w-full"
                  maxLength={12}
                  placeholder="12-digit number"
                />
              </FormField>

              <FormField label="PAN" error={errors['personal.pan']}>
                <input
                  type="text"
                  value={formData.personalDetails.pan}
                  onChange={(e) => updatePersonalDetails('pan', e.target.value.toUpperCase())}
                  className="erp-input w-full"
                  maxLength={10}
                  placeholder="e.g., ABCDE1234F"
                />
              </FormField>

              <FormField label="Marital Status">
                <select
                  value={formData.personalDetails.maritalStatus}
                  onChange={(e) => updatePersonalDetails('maritalStatus', e.target.value)}
                  className="erp-select w-full"
                >
                  <option value="">-- Select --</option>
                  {MARITAL_STATUSES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </FormField>

              <FormField label="Physically Challenged">
                <select
                  value={formData.personalDetails.physicallyChallenged}
                  onChange={(e) => updatePersonalDetails('physicallyChallenged', e.target.value)}
                  className="erp-select w-full"
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </FormField>

              <FormField label="Full Name in Devanagari">
                <input
                  type="text"
                  value={formData.personalDetails.fullNameDevanagari}
                  onChange={(e) => updatePersonalDetails('fullNameDevanagari', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Address for Correspondence */}
        <div className="erp-card">
          <SectionHeader title="Address for Correspondence" />
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <FormField label="Address" className="sm:col-span-2">
                <textarea
                  value={formData.correspondenceAddress.address}
                  onChange={(e) => updateCorrespondenceAddress('address', e.target.value)}
                  className="erp-input w-full h-16 resize-none"
                  rows={2}
                />
              </FormField>

              <FormField label="District">
                <input
                  type="text"
                  value={formData.correspondenceAddress.district}
                  onChange={(e) => updateCorrespondenceAddress('district', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Taluka">
                <input
                  type="text"
                  value={formData.correspondenceAddress.taluka}
                  onChange={(e) => updateCorrespondenceAddress('taluka', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="City">
                <input
                  type="text"
                  value={formData.correspondenceAddress.city}
                  onChange={(e) => updateCorrespondenceAddress('city', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="State">
                <input
                  type="text"
                  value={formData.correspondenceAddress.state}
                  onChange={(e) => updateCorrespondenceAddress('state', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Pin Code">
                <input
                  type="text"
                  value={formData.correspondenceAddress.pinCode}
                  onChange={(e) => updateCorrespondenceAddress('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="erp-input w-full"
                  maxLength={6}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="erp-card">
          <SectionHeader title="Permanent Address" />
          <div className="p-4">
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sameAsCorrespondence}
                onChange={toggleSameAsCorrespondence}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">Same as Correspondence Address</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <FormField label="Address" className="sm:col-span-2">
                <textarea
                  value={formData.permanentAddress.address}
                  onChange={(e) => updatePermanentAddress('address', e.target.value)}
                  className="erp-input w-full h-16 resize-none"
                  rows={2}
                  disabled={formData.sameAsCorrespondence}
                />
              </FormField>

              <FormField label="District">
                <input
                  type="text"
                  value={formData.permanentAddress.district}
                  onChange={(e) => updatePermanentAddress('district', e.target.value)}
                  className="erp-input w-full"
                  disabled={formData.sameAsCorrespondence}
                />
              </FormField>

              <FormField label="Taluka">
                <input
                  type="text"
                  value={formData.permanentAddress.taluka}
                  onChange={(e) => updatePermanentAddress('taluka', e.target.value)}
                  className="erp-input w-full"
                  disabled={formData.sameAsCorrespondence}
                />
              </FormField>

              <FormField label="City">
                <input
                  type="text"
                  value={formData.permanentAddress.city}
                  onChange={(e) => updatePermanentAddress('city', e.target.value)}
                  className="erp-input w-full"
                  disabled={formData.sameAsCorrespondence}
                />
              </FormField>

              <FormField label="State">
                <input
                  type="text"
                  value={formData.permanentAddress.state}
                  onChange={(e) => updatePermanentAddress('state', e.target.value)}
                  className="erp-input w-full"
                  disabled={formData.sameAsCorrespondence}
                />
              </FormField>

              <FormField label="Pin Code">
                <input
                  type="text"
                  value={formData.permanentAddress.pinCode}
                  onChange={(e) => updatePermanentAddress('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="erp-input w-full"
                  maxLength={6}
                  disabled={formData.sameAsCorrespondence}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Educational Qualifications */}
        <div className="erp-card">
          <SectionHeader title="Educational Qualifications" />
          <div className="p-4 overflow-x-auto">
            <table className="erp-table min-w-[800px]">
              <thead>
                <tr>
                  <th className="w-[120px]">Course Name</th>
                  <th>Institute Name</th>
                  <th className="w-[80px]">Duration</th>
                  <th className="w-[80px]">Year</th>
                  <th className="w-[120px]">% Marks / Status</th>
                  <th className="w-[100px]">Certificate</th>
                  <th className="w-16 print:hidden">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.educationalQualifications.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="text"
                        value={row.courseName}
                        onChange={(e) => updateEducationRow(row.id, 'courseName', e.target.value)}
                        className="erp-input w-full text-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.instituteName}
                        onChange={(e) => updateEducationRow(row.id, 'instituteName', e.target.value)}
                        className="erp-input w-full text-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.durationMonths}
                        onChange={(e) => updateEducationRow(row.id, 'durationMonths', e.target.value)}
                        className="erp-input w-full text-xs"
                        placeholder="months"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.yearOfPassing}
                        onChange={(e) => updateEducationRow(row.id, 'yearOfPassing', e.target.value)}
                        className="erp-input w-full text-xs"
                      />
                    </td>
                    <td>
                      {row.isPhD || row.courseName.toLowerCase().includes('ph.d') ? (
                        <div className="flex gap-2">
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              name={`phd-status-${row.id}`}
                              checked={row.phdStatus === 'awarded'}
                              onChange={() => updateEducationRow(row.id, 'phdStatus', 'awarded')}
                              className="w-3 h-3"
                            />
                            Awarded
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              name={`phd-status-${row.id}`}
                              checked={row.phdStatus === 'pursuing'}
                              onChange={() => updateEducationRow(row.id, 'phdStatus', 'pursuing')}
                              className="w-3 h-3"
                            />
                            Pursuing
                          </label>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={row.percentageOrStatus}
                          onChange={(e) => updateEducationRow(row.id, 'percentageOrStatus', e.target.value)}
                          className="erp-input w-full text-xs"
                          placeholder="%"
                        />
                      )}
                    </td>
                    <td>
                      {(row.isPhD || row.courseName.toLowerCase().includes('ph.d')) && row.phdStatus === 'awarded' ? (
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => updateEducationRow(row.id, 'phdCertificateFile', e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                          />
                          {row.phdCertificateFile ? (
                            <div className="flex items-center gap-1 text-xs bg-primary/10 px-2 py-1 rounded">
                              <FileText className="w-3 h-3" />
                              <span className="truncate max-w-[60px]">{row.phdCertificateFile.name}</span>
                              <button type="button" onClick={(e) => { e.stopPropagation(); updateEducationRow(row.id, 'phdCertificateFile', null); }} className="text-destructive">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:bg-primary/5 px-2 py-1 rounded border border-dashed border-primary">
                              <Upload className="w-3 h-3" />
                              <span>Upload</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="print:hidden">
                      <button
                        type="button"
                        onClick={() => removeEducationRow(row.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded"
                        aria-label="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {formData.educationalQualifications.length < 10 && (
              <button
                type="button"
                onClick={addEducationRow}
                className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden"
              >
                <Plus className="w-3 h-3" /> Add Row
              </button>
            )}
          </div>
        </div>

        {/* Academics Record (Teaching) */}
        <div className="erp-card">
          <SectionHeader title="Academics Record (Teaching)" />
          <div className="p-4">
            {formData.academicsRecord.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No academic records added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.academicsRecord.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Record #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAcademicsRow(row.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {/* Course Type - Radio buttons first */}
                      <FormField label="Course Type" className="sm:col-span-2 lg:col-span-4">
                        <div className="flex flex-wrap gap-4 h-8 items-center">
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`courseType-${row.id}`}
                              checked={row.courseType === 'diploma'}
                              onChange={() => {
                                updateAcademicsRow(row.id, 'courseType', 'diploma');
                                updateAcademicsRow(row.id, 'programme', '');
                                updateAcademicsRow(row.id, 'pgProgram', []);
                              }}
                              className="w-4 h-4"
                            />
                            Diploma
                          </label>
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`courseType-${row.id}`}
                              checked={row.courseType === 'undergraduate'}
                              onChange={() => {
                                updateAcademicsRow(row.id, 'courseType', 'undergraduate');
                                updateAcademicsRow(row.id, 'programme', '');
                                updateAcademicsRow(row.id, 'pgProgram', []);
                              }}
                              className="w-4 h-4"
                            />
                            Undergraduate
                          </label>
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`courseType-${row.id}`}
                              checked={row.courseType === 'postgraduate'}
                              onChange={() => {
                                updateAcademicsRow(row.id, 'courseType', 'postgraduate');
                                updateAcademicsRow(row.id, 'programme', '');
                                updateAcademicsRow(row.id, 'pgProgram', []);
                              }}
                              className="w-4 h-4"
                            />
                            Postgraduate
                          </label>
                        </div>
                      </FormField>

                      {/* PG Program checkboxes - only show for postgraduate */}
                      {row.courseType === 'postgraduate' && (
                        <FormField label="PG Programme" className="sm:col-span-2">
                          <div className="flex gap-4 h-8 items-center">
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={row.pgProgram.includes('ME')}
                                onChange={(e) => {
                                  const newPrograms = e.target.checked
                                    ? [...row.pgProgram, 'ME']
                                    : row.pgProgram.filter(p => p !== 'ME');
                                  updateAcademicsRow(row.id, 'pgProgram', newPrograms);
                                }}
                                className="w-4 h-4"
                              />
                              M.E./M.Tech
                            </label>
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={row.pgProgram.includes('MMS')}
                                onChange={(e) => {
                                  const newPrograms = e.target.checked
                                    ? [...row.pgProgram, 'MMS']
                                    : row.pgProgram.filter(p => p !== 'MMS');
                                  updateAcademicsRow(row.id, 'pgProgram', newPrograms);
                                }}
                                className="w-4 h-4"
                              />
                              MMS
                            </label>
                          </div>
                        </FormField>
                      )}

                      {/* Programme dropdown - based on course type */}
                      {row.courseType && (
                        <FormField label="Programme">
                          <select
                            value={row.programme}
                            onChange={(e) => updateAcademicsRow(row.id, 'programme', e.target.value)}
                            className="erp-select w-full"
                          >
                            <option value="">-- Select --</option>
                            {row.courseType === 'postgraduate' ? (
                              <>
                                {row.pgProgram.includes('ME') && (
                                  <optgroup label="M.E./M.Tech">
                                    {PG_PROGRAMMES_ME.map(p => <option key={p} value={p}>{p}</option>)}
                                  </optgroup>
                                )}
                                {row.pgProgram.includes('MMS') && (
                                  <optgroup label="MMS">
                                    {PG_PROGRAMMES_MMS.map(p => <option key={p} value={p}>{p}</option>)}
                                  </optgroup>
                                )}
                              </>
                            ) : (
                              getProgrammesByType(row.courseType).map(p => <option key={p} value={p}>{p}</option>)
                            )}
                          </select>
                        </FormField>
                      )}

                      <FormField label="Academic Year">
                        <select
                          value={row.academicYear}
                          onChange={(e) => updateAcademicsRow(row.id, 'academicYear', e.target.value)}
                          className="erp-select w-full"
                        >
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Subject Name">
                        <input
                          type="text"
                          value={row.subjectName}
                          onChange={(e) => updateAcademicsRow(row.id, 'subjectName', e.target.value)}
                          className="erp-input w-full"
                        />
                      </FormField>

                      <FormField label="Pattern Name">
                        <div className="flex gap-3 h-8 items-center">
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              name={`pattern-${row.id}`}
                              checked={row.patternName === 'R19 C-Scheme'}
                              onChange={() => updateAcademicsRow(row.id, 'patternName', 'R19 C-Scheme')}
                              className="w-3 h-3"
                            />
                            R19 C-Scheme
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              name={`pattern-${row.id}`}
                              checked={row.patternName === 'NEP 2020'}
                              onChange={() => updateAcademicsRow(row.id, 'patternName', 'NEP 2020')}
                              className="w-3 h-3"
                            />
                            NEP 2020
                          </label>
                        </div>
                      </FormField>

                      <FormField label="Class (Semester)">
                        <select
                          value={row.classSemester}
                          onChange={(e) => updateAcademicsRow(row.id, 'classSemester', e.target.value)}
                          className="erp-select w-full"
                        >
                          <option value="">-- Select --</option>
                          {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                          <option value="Year">Year</option>
                        </select>
                      </FormField>

                      <FormField label="No. of Students Attempted Exam">
                        <input
                          type="number"
                          value={row.studentsAttempted}
                          onChange={(e) => updateAcademicsRow(row.id, 'studentsAttempted', e.target.value)}
                          className="erp-input w-full"
                          min="0"
                        />
                      </FormField>

                      <FormField label="No. of Students Passed">
                        <input
                          type="number"
                          value={row.studentsPassed}
                          onChange={(e) => updateAcademicsRow(row.id, 'studentsPassed', e.target.value)}
                          className="erp-input w-full"
                          min="0"
                        />
                      </FormField>

                      <FormField label="Pass Percentage">
                        <input
                          type="text"
                          value={calculatePassPercentage(row.studentsAttempted, row.studentsPassed)}
                          readOnly
                          className="erp-input w-full bg-muted"
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addAcademicsRow}
              className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden"
            >
              <Plus className="w-3 h-3" /> Add Academic Record
            </button>
          </div>
        </div>

        {/* Previous Approve Letter Details (Only for Teaching Staff) */}
        <div className="erp-card">
          <SectionHeader title="Previous Approve Letter Details (Only for Teaching Staff)" />
          <div className="p-4">
            {formData.approvalDetails.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No approval records added yet.</p>
            ) : (
              <div className="space-y-6">
                {formData.approvalDetails.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-4 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold text-foreground">Approval #{idx + 1}</span>
                      <button type="button" onClick={() => removeApprovalRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subject and Course Details */}
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-muted-foreground mb-2 border-b border-border pb-1">Subject and Course Details</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <FormField label="Post Designation" required>
                          <select value={row.postDesignation} onChange={(e) => updateApprovalRow(row.id, 'postDesignation', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {POST_DESIGNATIONS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Faculty" required>
                          <select value={row.faculty} onChange={(e) => updateApprovalRow(row.id, 'faculty', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Approval As Per" required>
                          <select value={row.approvalAsPer} onChange={(e) => updateApprovalRow(row.id, 'approvalAsPer', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            <option value="AICTE">AICTE</option>
                            <option value="UGC">UGC</option>
                            <option value="University">University</option>
                          </select>
                        </FormField>
                        <FormField label="Approval For Whether UG/PG" required>
                          <select value={row.approvalForUGPG} onChange={(e) => updateApprovalRow(row.id, 'approvalForUGPG', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {APPROVAL_FOR_UGPG.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </FormField>
                      </div>
                    </div>

                    {/* Selection Details */}
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-muted-foreground mb-2 border-b border-border pb-1">Selection Details</h5>
                      <p className="text-[10px] text-muted-foreground mb-2 italic">
                        If your designation has been changed by pay scale fixation: Select promotion Non CAS. If you have been promoted through CAS select promotion by CAS.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <FormField label="Post Type" required>
                          <select value={row.postType} onChange={(e) => updateApprovalRow(row.id, 'postType', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {POST_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Selection For This Post Done By" required>
                          <select value={row.selectionDoneBy} onChange={(e) => updateApprovalRow(row.id, 'selectionDoneBy', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {SELECTION_DONE_BY.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Post Was Reserved For" required>
                          <select value={row.postReservedFor} onChange={(e) => updateApprovalRow(row.id, 'postReservedFor', e.target.value)} className="erp-select w-full">
                            <option value="">-- Please Select --</option>
                            {POST_RESERVED_FOR.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </FormField>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-muted-foreground mb-2 border-b border-border pb-1">Appointment Details</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <FormField label="Fulltime/Parttime/Clock Hour Basis">
                          <div className="flex flex-wrap gap-3 h-8 items-center">
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`workType-${row.id}`} checked={row.workType === 'fullTime'} onChange={() => updateApprovalRow(row.id, 'workType', 'fullTime')} className="w-3 h-3" />
                              Full Time
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`workType-${row.id}`} checked={row.workType === 'partTime'} onChange={() => updateApprovalRow(row.id, 'workType', 'partTime')} className="w-3 h-3" />
                              Part Time
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`workType-${row.id}`} checked={row.workType === 'clockHourBasis'} onChange={() => updateApprovalRow(row.id, 'workType', 'clockHourBasis')} className="w-3 h-3" />
                              Clock Hour Basis
                            </label>
                          </div>
                        </FormField>
                        <FormField label="Approval Type">
                          <div className="flex gap-4 h-8 items-center">
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`approvalType-${row.id}`} checked={row.approvalType === 'permanent'} onChange={() => updateApprovalRow(row.id, 'approvalType', 'permanent')} className="w-3 h-3" />
                              Permanent
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`approvalType-${row.id}`} checked={row.approvalType === 'temporary'} onChange={() => updateApprovalRow(row.id, 'approvalType', 'temporary')} className="w-3 h-3" />
                              Temporary
                            </label>
                          </div>
                        </FormField>
                        <FormField label="Appointed On">
                          <select value={row.appointedOn} onChange={(e) => updateApprovalRow(row.id, 'appointedOn', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {APPOINTED_ON.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </FormField>
                        <FormField label="University Name">
                          <select value={row.universityName} onChange={(e) => updateApprovalRow(row.id, 'universityName', e.target.value)} className="erp-select w-full">
                            <option value="">-- Select --</option>
                            {INDIAN_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </FormField>
                        <FormField label="College Name" className="sm:col-span-2">
                          <input type="text" value={row.collegeName} onChange={(e) => updateApprovalRow(row.id, 'collegeName', e.target.value)} className="erp-input w-full" />
                        </FormField>
                      </div>
                    </div>

                    {/* Approval Letter Details */}
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground mb-2 border-b border-border pb-1">Approval Letter Details</h5>
                      <p className="text-[10px] text-muted-foreground mb-2 italic">
                        Note: For Pune University department teachers use your appointment letter as approval letter. Is this your current Appointment/Approval/Designation/Payscale?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <FormField label="Payscale">
                          <div className="flex gap-4 h-8 items-center">
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`payscale-${row.id}`} checked={row.payscale === 'isCurrent'} onChange={() => updateApprovalRow(row.id, 'payscale', 'isCurrent')} className="w-3 h-3" />
                              Is Current
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input type="radio" name={`payscale-${row.id}`} checked={row.payscale === 'isBack'} onChange={() => updateApprovalRow(row.id, 'payscale', 'isBack')} className="w-3 h-3" />
                              Is Back
                            </label>
                          </div>
                        </FormField>
                        <FormField label="Approval Ref.No">
                          <input type="text" value={row.approvalRefNo} onChange={(e) => updateApprovalRow(row.id, 'approvalRefNo', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Approval Letter Date">
                          <input type="date" value={row.approvalLetterDate} onChange={(e) => updateApprovalRow(row.id, 'approvalLetterDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Valid From Date">
                          <input type="date" value={row.validFromDate} onChange={(e) => updateApprovalRow(row.id, 'validFromDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="To Date">
                          <input type="date" value={row.toDate} onChange={(e) => updateApprovalRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FileUploadField label="Document" hint="(Approval Letter)" file={row.documentFile} onFileChange={(f) => updateApprovalRow(row.id, 'documentFile', f)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addApprovalRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Approval Record
            </button>
          </div>
        </div>

        {/* Experience */}
        <div className="erp-card">
          <SectionHeader title="Experience" />
          <div className="p-4 space-y-6">
            {/* Educational Experience */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Educational Experience
              </h4>
              {formData.experience.filter(e => e.type === 'educational').length === 0 ? (
                <p className="text-xs text-muted-foreground mb-2">No educational experience added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.experience.filter(e => e.type === 'educational').map((row, idx) => (
                    <div key={row.id} className="border border-border rounded p-3 bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium">#{idx + 1}</span>
                        <button type="button" onClick={() => removeExperienceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <FormField label="Organisation">
                          <input type="text" value={row.organisation} onChange={(e) => updateExperienceRow(row.id, 'organisation', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Designation">
                          <input type="text" value={row.designation} onChange={(e) => updateExperienceRow(row.id, 'designation', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="From">
                          <input type="date" value={row.fromDate} onChange={(e) => updateExperienceRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="To">
                          <input type="date" value={row.toDate} onChange={(e) => updateExperienceRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Duration">
                          <input type="text" value={calculateDuration(row.fromDate, row.toDate)} readOnly className="erp-input w-full bg-muted text-xs" />
                        </FormField>
                        <FileUploadField label="Offer Letter/Payslip or Experience Letter" hint="(Documents)" file={row.offerLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'offerLetterFile', f)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => addExperienceRow('educational')} className="mt-2 erp-btn-secondary flex items-center gap-1 text-xs print:hidden">
                <Plus className="w-3 h-3" /> Add Educational Experience
              </button>
            </div>

            {/* Industrial Experience */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Industrial Experience
              </h4>
              {formData.experience.filter(e => e.type === 'industrial').length === 0 ? (
                <p className="text-xs text-muted-foreground mb-2">No industrial experience added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.experience.filter(e => e.type === 'industrial').map((row, idx) => (
                    <div key={row.id} className="border border-border rounded p-3 bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium">#{idx + 1}</span>
                        <button type="button" onClick={() => removeExperienceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <FormField label="Organisation">
                          <input type="text" value={row.organisation} onChange={(e) => updateExperienceRow(row.id, 'organisation', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Designation">
                          <input type="text" value={row.designation} onChange={(e) => updateExperienceRow(row.id, 'designation', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="From">
                          <input type="date" value={row.fromDate} onChange={(e) => updateExperienceRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="To">
                          <input type="date" value={row.toDate} onChange={(e) => updateExperienceRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Duration">
                          <input type="text" value={calculateDuration(row.fromDate, row.toDate)} readOnly className="erp-input w-full bg-muted text-xs" />
                        </FormField>
                        <FileUploadField label="Offer Letter/Payslip or Experience Letter" hint="(Documents)" file={row.offerLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'offerLetterFile', f)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => addExperienceRow('industrial')} className="mt-2 erp-btn-secondary flex items-center gap-1 text-xs print:hidden">
                <Plus className="w-3 h-3" /> Add Industrial Experience
              </button>
            </div>

            {/* Research Experience */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Research Experience
              </h4>
              {formData.experience.filter(e => e.type === 'research').length === 0 ? (
                <p className="text-xs text-muted-foreground mb-2">No research experience added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.experience.filter(e => e.type === 'research').map((row, idx) => (
                    <div key={row.id} className="border border-border rounded p-3 bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium">#{idx + 1}</span>
                        <button type="button" onClick={() => removeExperienceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <FormField label="Organisation">
                          <input type="text" value={row.organisation} onChange={(e) => updateExperienceRow(row.id, 'organisation', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Designation">
                          <input type="text" value={row.designation} onChange={(e) => updateExperienceRow(row.id, 'designation', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="From">
                          <input type="date" value={row.fromDate} onChange={(e) => updateExperienceRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="To">
                          <input type="date" value={row.toDate} onChange={(e) => updateExperienceRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                        </FormField>
                        <FormField label="Duration">
                          <input type="text" value={calculateDuration(row.fromDate, row.toDate)} readOnly className="erp-input w-full bg-muted text-xs" />
                        </FormField>
                        <FileUploadField label="Offer Letter/Payslip or Experience Letter" hint="(Documents)" file={row.offerLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'offerLetterFile', f)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => addExperienceRow('research')} className="mt-2 erp-btn-secondary flex items-center gap-1 text-xs print:hidden">
                <Plus className="w-3 h-3" /> Add Research Experience
              </button>
            </div>
          </div>
        </div>

        {/* Research Publication */}
        <div className="erp-card">
          <SectionHeader title="Research Publication" />
          <div className="p-4">
            {formData.publications.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No publications added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.publications.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Publication #{idx + 1}</span>
                      <button type="button" onClick={() => removePublicationRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updatePublicationRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Publication Type">
                        <select value={row.publicationType} onChange={(e) => updatePublicationRow(row.id, 'publicationType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {PUBLICATION_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FormField>

                      {row.publicationType === 'Conference' && (
                        <>
                          <FormField label="Conference Scope">
                            <div className="flex gap-4 h-8 items-center">
                              <label className="flex items-center gap-1 text-xs">
                                <input
                                  type="radio"
                                  name={`confScope-${row.id}`}
                                  checked={row.conferenceScope === 'national'}
                                  onChange={() => updatePublicationRow(row.id, 'conferenceScope', 'national')}
                                  className="w-3 h-3"
                                />
                                National
                              </label>
                              <label className="flex items-center gap-1 text-xs">
                                <input
                                  type="radio"
                                  name={`confScope-${row.id}`}
                                  checked={row.conferenceScope === 'international'}
                                  onChange={() => updatePublicationRow(row.id, 'conferenceScope', 'international')}
                                  className="w-3 h-3"
                                />
                                International
                              </label>
                            </div>
                          </FormField>

                          {row.conferenceScope && (
                            <FormField label="Role">
                              <div className="flex gap-4 h-8 items-center">
                                <label className="flex items-center gap-1 text-xs">
                                  <input
                                    type="radio"
                                    name={`confRole-${row.id}`}
                                    checked={row.conferenceRole === 'presenter'}
                                    onChange={() => updatePublicationRow(row.id, 'conferenceRole', 'presenter')}
                                    className="w-3 h-3"
                                  />
                                  Presenter
                                </label>
                                <label className="flex items-center gap-1 text-xs">
                                  <input
                                    type="radio"
                                    name={`confRole-${row.id}`}
                                    checked={row.conferenceRole === 'attended'}
                                    onChange={() => updatePublicationRow(row.id, 'conferenceRole', 'attended')}
                                    className="w-3 h-3"
                                  />
                                  Attended
                                </label>
                              </div>
                            </FormField>
                          )}
                        </>
                      )}

                      {/* Research Profile Selection */}
                      <FormField label="Research Profile IDs" className="sm:col-span-2 lg:col-span-4">
                        <div className="flex flex-wrap gap-4 mb-2">
                          {RESEARCH_PROFILES.map(profile => (
                            <label key={profile} className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={row.selectedProfiles.includes(profile)}
                                onChange={(e) => {
                                  const newProfiles = e.target.checked
                                    ? [...row.selectedProfiles, profile]
                                    : row.selectedProfiles.filter(p => p !== profile);
                                  updatePublicationRow(row.id, 'selectedProfiles', newProfiles);
                                }}
                                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                              />
                              {profile}
                            </label>
                          ))}
                        </div>
                        {row.selectedProfiles.length > 0 && (
                          <div className="mt-2 p-3 bg-background rounded border border-border">
                            {/* IDs Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                              {row.selectedProfiles.includes('Google Scholar') && (
                                <FormField label="Google Scholar ID">
                                  <input type="text" value={row.googleScholarId} onChange={(e) => updatePublicationRow(row.id, 'googleScholarId', e.target.value)} className="erp-input w-full" placeholder="Enter ID" />
                                </FormField>
                              )}
                              {row.selectedProfiles.includes('Scopus') && (
                                <FormField label="Scopus ID">
                                  <input type="text" value={row.scopusId} onChange={(e) => updatePublicationRow(row.id, 'scopusId', e.target.value)} className="erp-input w-full" placeholder="Enter ID" />
                                </FormField>
                              )}
                              {row.selectedProfiles.includes('ORCID iD') && (
                                <FormField label="ORCID iD">
                                  <input type="text" value={row.orcidId} onChange={(e) => updatePublicationRow(row.id, 'orcidId', e.target.value)} className="erp-input w-full" placeholder="0000-0000-0000-0000" />
                                </FormField>
                              )}
                            </div>
                            {/* Links Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {row.selectedProfiles.includes('Google Scholar') && (
                                <FormField label="Google Scholar Link">
                                  <input type="url" value={row.googleScholarLink} onChange={(e) => updatePublicationRow(row.id, 'googleScholarLink', e.target.value)} className="erp-input w-full" placeholder="https://..." />
                                </FormField>
                              )}
                              {row.selectedProfiles.includes('Scopus') && (
                                <FormField label="Scopus Link">
                                  <input type="url" value={row.scopusLink} onChange={(e) => updatePublicationRow(row.id, 'scopusLink', e.target.value)} className="erp-input w-full" placeholder="https://..." />
                                </FormField>
                              )}
                              {row.selectedProfiles.includes('ORCID iD') && (
                                <FormField label="ORCID Link">
                                  <input type="url" value={row.orcidLink} onChange={(e) => updatePublicationRow(row.id, 'orcidLink', e.target.value)} className="erp-input w-full" placeholder="https://orcid.org/..." />
                                </FormField>
                              )}
                            </div>
                          </div>
                        )}
                      </FormField>

                      <FormField label="Programme">
                        <select value={row.programme} onChange={(e) => updatePublicationRow(row.id, 'programme', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Title" className="sm:col-span-2">
                        <input type="text" value={row.title} onChange={(e) => updatePublicationRow(row.id, 'title', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Area">
                        <input type="text" value={row.area} onChange={(e) => updatePublicationRow(row.id, 'area', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Publication Date">
                        <input type="date" value={row.publicationDate} onChange={(e) => updatePublicationRow(row.id, 'publicationDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Journal/Conference Name">
                        <input type="text" value={row.journalConferenceName} onChange={(e) => updatePublicationRow(row.id, 'journalConferenceName', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Publisher Name">
                        <input type="text" value={row.publisherName} onChange={(e) => updatePublicationRow(row.id, 'publisherName', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FileUploadField label="Upload" hint="(Certificate / Publication / Paper PDF)" file={row.uploadFile} onFileChange={(f) => updatePublicationRow(row.id, 'uploadFile', f)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addPublicationRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Publication
            </button>
          </div>
        </div>

        {/* Technical Participation */}
        <div className="erp-card">
          <SectionHeader title="Technical (Program/Event) Participation" />
          <div className="p-4">
            {formData.technicalParticipation.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No technical participation added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.technicalParticipation.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Participation #{idx + 1}</span>
                      <button type="button" onClick={() => removeTechnicalRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateTechnicalRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Type">
                        <select value={row.participationType} onChange={(e) => updateTechnicalRow(row.id, 'participationType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {PARTICIPATION_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Programme">
                        <select value={row.programme} onChange={(e) => updateTechnicalRow(row.id, 'programme', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="From Date">
                        <input type="date" value={row.fromDate} onChange={(e) => updateTechnicalRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="To Date">
                        <input type="date" value={row.toDate} onChange={(e) => updateTechnicalRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Organization Name">
                        <input type="text" value={row.organizationName} onChange={(e) => updateTechnicalRow(row.id, 'organizationName', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Topic/Area">
                        <input type="text" value={row.topicArea} onChange={(e) => updateTechnicalRow(row.id, 'topicArea', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FileUploadField label="Upload" hint="(Certificate / Appreciation Letter)" file={row.uploadFile} onFileChange={(f) => updateTechnicalRow(row.id, 'uploadFile', f)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addTechnicalRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Participation
            </button>
          </div>
        </div>

        {/* Guidance / Supervisor / Mentor */}
        <div className="erp-card">
          <SectionHeader title="Guidance / Supervisor / Mentor" />
          <div className="p-4">
            {formData.guidance.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No guidance records added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.guidance.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Guidance #{idx + 1}</span>
                      <button type="button" onClick={() => removeGuidanceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <FormField label="Programme Type">
                        <select value={row.programmeType} onChange={(e) => updateGuidanceRow(row.id, 'programmeType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {GUIDANCE_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateGuidanceRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Course Type">
                        <select value={row.courseType} onChange={(e) => updateGuidanceRow(row.id, 'courseType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Postgraduate">Postgraduate</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </FormField>

                      <FormField label="From Date">
                        <input type="date" value={row.fromDate} onChange={(e) => updateGuidanceRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="To Date">
                        <input type="date" value={row.toDate} onChange={(e) => updateGuidanceRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Venue/Institution">
                        <input type="text" value={row.venueInstitution} onChange={(e) => updateGuidanceRow(row.id, 'venueInstitution', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Title">
                        <input type="text" value={row.title} onChange={(e) => updateGuidanceRow(row.id, 'title', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="No. of Scholars Ongoing">
                        <input type="number" value={row.scholarsOngoing} onChange={(e) => updateGuidanceRow(row.id, 'scholarsOngoing', e.target.value)} className="erp-input w-full" min="0" />
                      </FormField>

                      <FormField label="No. of Scholars Completed">
                        <input type="number" value={row.scholarsCompleted} onChange={(e) => updateGuidanceRow(row.id, 'scholarsCompleted', e.target.value)} className="erp-input w-full" min="0" />
                      </FormField>

                      {/* Dynamic scholar name fields for ongoing */}
                      {parseInt(row.scholarsOngoing) > 0 && (
                        <FormField label="Names of Scholars (Ongoing)" className="sm:col-span-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Array.from({ length: parseInt(row.scholarsOngoing) || 0 }).map((_, i) => (
                              <input
                                key={`ongoing-${i}`}
                                type="text"
                                value={row.scholarNamesOngoing[i] || ''}
                                onChange={(e) => {
                                  const names = [...row.scholarNamesOngoing];
                                  names[i] = e.target.value;
                                  updateGuidanceRow(row.id, 'scholarNamesOngoing', names);
                                }}
                                className="erp-input w-full"
                                placeholder={`Scholar ${i + 1}`}
                              />
                            ))}
                          </div>
                        </FormField>
                      )}

                      {/* Dynamic scholar name fields for completed */}
                      {parseInt(row.scholarsCompleted) > 0 && (
                        <FormField label="Names of Scholars (Completed)" className="sm:col-span-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Array.from({ length: parseInt(row.scholarsCompleted) || 0 }).map((_, i) => (
                              <input
                                key={`completed-${i}`}
                                type="text"
                                value={row.scholarNamesCompleted[i] || ''}
                                onChange={(e) => {
                                  const names = [...row.scholarNamesCompleted];
                                  names[i] = e.target.value;
                                  updateGuidanceRow(row.id, 'scholarNamesCompleted', names);
                                }}
                                className="erp-input w-full"
                                placeholder={`Scholar ${i + 1}`}
                              />
                            ))}
                          </div>
                        </FormField>
                      )}

                      <FormField label="Status">
                        <div className="flex gap-4 h-8 items-center">
                          <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name={`guidance-status-${row.id}`} checked={row.status === 'ongoing'} onChange={() => updateGuidanceRow(row.id, 'status', 'ongoing')} className="w-3 h-3" />
                            Ongoing
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name={`guidance-status-${row.id}`} checked={row.status === 'completed'} onChange={() => updateGuidanceRow(row.id, 'status', 'completed')} className="w-3 h-3" />
                            Completed
                          </label>
                        </div>
                      </FormField>

                      <FileUploadField label="Upload" hint="(Certificate / Approval Letter)" file={row.uploadFile} onFileChange={(f) => updateGuidanceRow(row.id, 'uploadFile', f)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addGuidanceRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Guidance Record
            </button>
          </div>
        </div>

        {/* Organized Events */}
        <div className="erp-card">
          <SectionHeader title="Organized Events (Program/Activity/Workshop/Guest Lecture/Social Activity e.g., NSS)" />
          <div className="p-4">
            {formData.organizedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No organized events added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.organizedEvents.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Event #{idx + 1}</span>
                      <button type="button" onClick={() => removeEventRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateEventRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Programme">
                        <select value={row.programme} onChange={(e) => updateEventRow(row.id, 'programme', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Program/Event Type">
                        <select value={row.eventType} onChange={(e) => updateEventRow(row.id, 'eventType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Program/Event Title">
                        <input type="text" value={row.eventTitle} onChange={(e) => updateEventRow(row.id, 'eventTitle', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="From Date">
                        <input type="date" value={row.fromDate} onChange={(e) => updateEventRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="End Date">
                        <input type="date" value={row.endDate} onChange={(e) => updateEventRow(row.id, 'endDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Venue/Institution">
                        <input type="text" value={row.venueInstitution} onChange={(e) => updateEventRow(row.id, 'venueInstitution', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="No. of Participants">
                        <input type="number" value={row.noOfParticipants} onChange={(e) => updateEventRow(row.id, 'noOfParticipants', e.target.value)} className="erp-input w-full" min="0" />
                      </FormField>

                      <FormField label="Participants Course" className="sm:col-span-2 lg:col-span-4">
                        <div className="flex flex-wrap gap-3 min-h-[32px] items-center">
                          {PARTICIPANT_COURSES.map(c => (
                            <label key={c} className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={row.participantsCourse.includes(c)}
                                onChange={(e) => {
                                  const newCourses = e.target.checked
                                    ? [...row.participantsCourse, c]
                                    : row.participantsCourse.filter(x => x !== c);
                                  updateEventRow(row.id, 'participantsCourse', newCourses);
                                }}
                                className="w-3 h-3"
                              />
                              {c}
                            </label>
                          ))}
                        </div>
                      </FormField>

                      {/* 4 uploads in one row with equal spacing */}
                      <div className="sm:col-span-2 lg:col-span-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <MultiFileUpload label="Geo-tagged Photos" hint="(3 photos with Geo Tag)" files={row.geoTagPhotos} onFilesChange={(f) => updateEventRow(row.id, 'geoTagPhotos', f)} maxFiles={3} />
                          <FileUploadField label="Event Report" hint="(Event Report)" file={row.eventReport} onFileChange={(f) => updateEventRow(row.id, 'eventReport', f)} />
                          <FileUploadField label="Budget Report" hint="(Approved Fund Details)" file={row.budgetReport} onFileChange={(f) => updateEventRow(row.id, 'budgetReport', f)} />
                          <FileUploadField label="Appreciation Letter" hint="(Appreciation Letter)" file={row.appreciationLetter} onFileChange={(f) => updateEventRow(row.id, 'appreciationLetter', f)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addEventRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Event
            </button>
          </div>
        </div>

        {/* Awards & Achievements */}
        <div className="erp-card">
          <SectionHeader title="Awards & Achievements" />
          <div className="p-4">
            {formData.awards.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No awards or achievements added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.awards.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Award #{idx + 1}</span>
                      <button type="button" onClick={() => removeAwardRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {/* Award Type Checkboxes */}
                      <FormField label="Type" className="sm:col-span-2 lg:col-span-4">
                        <div className="flex flex-wrap gap-4">
                          {AWARD_TYPES.map(type => (
                            <label key={type} className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={row.awardType.includes(type)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...row.awardType, type]
                                    : row.awardType.filter(t => t !== type);
                                  updateAwardRow(row.id, 'awardType', newTypes);
                                }}
                                className="w-4 h-4"
                              />
                              <span className="flex items-center gap-1">
                                {type === 'Award' && <Award className="w-3 h-3" />}
                                {type === 'Reward' && <Trophy className="w-3 h-3" />}
                                {type === 'Recognition' && <Star className="w-3 h-3" />}
                                {type === 'Achievement' && <Medal className="w-3 h-3" />}
                                {type === 'Off Campus Designation' && <Briefcase className="w-3 h-3" />}
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateAwardRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Title/Name">
                        <input type="text" value={row.title} onChange={(e) => updateAwardRow(row.id, 'title', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Issuing Organization">
                        <input type="text" value={row.issuingOrganization} onChange={(e) => updateAwardRow(row.id, 'issuingOrganization', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Date Received">
                        <input type="date" value={row.dateReceived} onChange={(e) => updateAwardRow(row.id, 'dateReceived', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Description" className="sm:col-span-2">
                        <textarea value={row.description} onChange={(e) => updateAwardRow(row.id, 'description', e.target.value)} className="erp-input w-full h-16 resize-none" />
                      </FormField>

                      {/* Off Campus Designation specific fields */}
                      {row.awardType.includes('Off Campus Designation') && (
                        <>
                          <FormField label="Designation" className="sm:col-span-2 lg:col-span-4">
                            <select value={row.offCampusDesignation} onChange={(e) => updateAwardRow(row.id, 'offCampusDesignation', e.target.value)} className="erp-select w-full">
                              <option value="">-- Select Designation --</option>
                              {OFF_CAMPUS_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </FormField>

                          {row.offCampusDesignation === 'Other' && (
                            <FormField label="Other Designation">
                              <input type="text" value={row.offCampusOther} onChange={(e) => updateAwardRow(row.id, 'offCampusOther', e.target.value)} className="erp-input w-full" placeholder="Specify designation" />
                            </FormField>
                          )}

                          <FormField label="Period From">
                            <input type="date" value={row.offCampusPeriodFrom} onChange={(e) => updateAwardRow(row.id, 'offCampusPeriodFrom', e.target.value)} className="erp-input w-full" />
                          </FormField>

                          <FormField label="Period To">
                            <input type="date" value={row.offCampusPeriodTo} onChange={(e) => updateAwardRow(row.id, 'offCampusPeriodTo', e.target.value)} className="erp-input w-full" />
                          </FormField>

                          <FormField label="Institution/Company">
                            <input type="text" value={row.offCampusInstitution} onChange={(e) => updateAwardRow(row.id, 'offCampusInstitution', e.target.value)} className="erp-input w-full" />
                          </FormField>
                        </>
                      )}

                      <FileUploadField label="Upload" hint="(Certificate / Proof)" file={row.uploadFile} onFileChange={(f) => updateAwardRow(row.id, 'uploadFile', f)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addAwardRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Award/Achievement
            </button>
          </div>
        </div>

        {/* Programme / Other Responsibilities */}
        <div className="erp-card">
          <SectionHeader title="Programme / Other Responsibilities" />
          <div className="p-4">
            {formData.responsibilities.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No responsibilities added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.responsibilities.map((row, idx) => (
                  <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">Responsibility #{idx + 1}</span>
                      <button type="button" onClick={() => removeResponsibilityRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateResponsibilityRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Programme">
                        <select value={row.programme} onChange={(e) => updateResponsibilityRow(row.id, 'programme', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Allotted Responsibility">
                        <input type="text" value={row.allottedResponsibility} onChange={(e) => updateResponsibilityRow(row.id, 'allottedResponsibility', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Remarks/Description" className="sm:col-span-2 md:col-span-3">
                        <textarea
                          value={row.remarks}
                          onChange={(e) => updateResponsibilityRow(row.id, 'remarks', e.target.value)}
                          className="erp-input w-full h-16 resize-none"
                          placeholder="Who assigned, for which term, conditions, work done..."
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addResponsibilityRow} className="mt-3 erp-btn-primary flex items-center gap-1 text-xs print:hidden">
              <Plus className="w-3 h-3" /> Add Responsibility
            </button>
          </div>
        </div>

        {/* Salary Details */}
        <div className="erp-card">
          <SectionHeader title="Salary Details" />
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <FormField label="Account No">
                <input type="text" value={formData.salaryDetails.accountNo} onChange={(e) => updateSalaryDetails('accountNo', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="Bank Name">
                <input type="text" value={formData.salaryDetails.bankName} onChange={(e) => updateSalaryDetails('bankName', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="Branch Name">
                <input type="text" value={formData.salaryDetails.branchName} onChange={(e) => updateSalaryDetails('branchName', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="Payment Basic">
                <input type="text" value={formData.salaryDetails.paymentBasic} onChange={(e) => updateSalaryDetails('paymentBasic', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="DA">
                <input type="text" value={formData.salaryDetails.da} onChange={(e) => updateSalaryDetails('da', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="HRA">
                <input type="text" value={formData.salaryDetails.hra} onChange={(e) => updateSalaryDetails('hra', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="Gross">
                <input type="text" value={formData.salaryDetails.gross} onChange={(e) => updateSalaryDetails('gross', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="Pay Band">
                <input type="text" value={formData.salaryDetails.payBand} onChange={(e) => updateSalaryDetails('payBand', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FormField label="PF">
                <input type="text" value={formData.salaryDetails.pf} onChange={(e) => updateSalaryDetails('pf', e.target.value)} className="erp-input w-full" />
              </FormField>

              <FileUploadField label="Offer Letter" hint="(Salary in CTC)" file={formData.salaryDetails.offerLetterFile} onFileChange={(f) => updateSalaryDetails('offerLetterFile', f)} />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <SummarySection formData={formData} academicYears={academicYears} />

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
            <div className="bg-card rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl animate-scale-in">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-center text-foreground mb-2">Submission Successful!</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Your employee record has been submitted successfully. Check console for JSON output.
              </p>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full erp-btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EmployeeRecords;
