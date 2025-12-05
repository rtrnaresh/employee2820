/**
 * EmployeeRecords.tsx
 * 
 * A comprehensive ERP-style Employee Records form component.
 * Features: Personal details, addresses, education, academics, experience,
 * research publications, technical participation, and more.
 * 
 * @version 1.0.0
 * @exports EmployeeRecords - Main form component
 * 
 * JSON Schema available at: employee-records.schema.json
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Download, Send, FileText, Upload, X, Check } from 'lucide-react';

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
}

interface AcademicsRow {
  id: string;
  department: string;
  programType: string;
  subjectName: string;
  patternName: string;
  branch: string;
  academicYear: string;
  classSemester: string;
  studentsAttended: string;
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
  experienceLetterFile: File | null;
}

interface PublicationRow {
  id: string;
  publicationType: string;
  conferenceSubtypes: string[];
  department: string;
  academicYear: string;
  title: string;
  area: string;
  publicationDate: string;
  journalConferenceName: string;
  publisherName: string;
  uploadFile: File | null;
}

interface TechnicalParticipationRow {
  id: string;
  participationType: string;
  department: string;
  academicYear: string;
  fromDate: string;
  toDate: string;
  organizationName: string;
  topicArea: string;
  uploadFile: File | null;
}

interface GuidanceRow {
  id: string;
  guidanceType: string;
  department: string;
  academicYear: string;
  fromDate: string;
  toDate: string;
  venue: string;
  title: string;
  noOfScholars: string;
  institutionName: string;
  status: 'ongoing' | 'completed' | '';
  uploadFile: File | null;
}

interface OrganizedEventRow {
  id: string;
  department: string;
  academicYear: string;
  programType: string;
  programTitle: string;
  fromDate: string;
  endDate: string;
  venue: string;
  noOfParticipants: string;
  participantsCourse: string[];
  geoTagPhotos: File[];
  eventReport: File | null;
  budgetReport: File | null;
}

interface ResponsibilityRow {
  id: string;
  department: string;
  academicYear: string;
  allottedResponsibility: string;
  remarks: string;
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
  experienceLetterFile: File | null;
}

interface FormData {
  personalDetails: PersonalDetails;
  correspondenceAddress: Address;
  permanentAddress: Address;
  sameAsCorrespondence: boolean;
  educationalQualifications: EducationRow[];
  academicsRecord: AcademicsRow[];
  experience: ExperienceRow[];
  publications: PublicationRow[];
  technicalParticipation: TechnicalParticipationRow[];
  guidance: GuidanceRow[];
  organizedEvents: OrganizedEventRow[];
  responsibilities: ResponsibilityRow[];
  salaryDetails: SalaryDetails;
}

// ==================== CONSTANTS ====================

export const DEPARTMENTS = [
  // Bachelor's Degrees (B.E.)
  "Computer Science & Engineering (AI & ML)",
  "Computer Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics & Telecommunication Engineering (EXTC)",
  "Information Technology Engineering (IT)",
  "Mechanical Engineering",

  // Master's Degrees (M.E.)
  "M.E. Computer Engineering",
  "M.E. Electronics & Telecommunication Engineering",
  "M.E. Mechanical Engineering (including Energy Systems & Management)",

  // Diploma Courses
  "Diploma – Civil Engineering",
  "Diploma – Artificial Intelligence & Machine Learning (AIML)",
  "Diploma – Electronics & Telecommunication Engineering (EXTC)",
  "Diploma – Mechanical Engineering",
  "Diploma – Mechatronics Engineering",

  // Management Courses (MMS/MBA)
  "MMS/MBA – Marketing",
  "MMS/MBA – Finance",
  "MMS/MBA – Human Resources (HR)",
  "MMS/MBA – Systems",
  "MMS/MBA – Operations"
];


export const BRANCHES = [
  "Computer Science & Engineering (AI & ML)",
  "Computer Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics & Telecommunication Engineering (EXTC)",
  "Information Technology Engineering (IT)",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Artificial Intelligence & Machine Learning (AIML)",
  "Master of Management Studies"
];

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['Open', 'OBC','VJ-NT','SBC', 'EBC', 'SC', 'ST'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const PROGRAM_TYPES = ['Undergraduate', 'Postgraduate', 'Diploma'];
const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const PUBLICATION_TYPES = ['Journal SCI', 'Journal ESCI', 'SCOPUS', 'WOS', 'IEEE', 'Conference', 'Book (Chapters)', 'Patent', 'Grants'];
const CONFERENCE_SUBTYPES = ['Conference SCI', 'Conference ESCI', 'Conference SCOPUS', 'Conference IEEE/WOS'];
const PARTICIPATION_TYPES = ['FDP', 'Workshop', 'STTP', 'Seminar', 'Webinar'];
const GUIDANCE_TYPES = ['PhD Supervisor', 'PG Project Guide/Guided', 'UG Project Guide/Guided', 'Diploma Project Guide/Guided', 'Mentor (Hackathon, Club, Project, Idea)'];
const PARTICIPANT_COURSES = ['PhD', 'PG', 'UG', 'Diploma', 'School'];

const DEFAULT_EDUCATION_ROWS: EducationRow[] = [
  { id: '1', courseName: 'SSC', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '' },
  { id: '2', courseName: 'HSC', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '' },
  { id: '3', courseName: 'B.E/B.Tech', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '' },
  { id: '4', courseName: 'M.E/M.Tech', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: false, phdStatus: '' },
  { id: '5', courseName: 'Ph.D.', instituteName: '', durationMonths: '', yearOfPassing: '', percentageOrStatus: '', isPhD: true, phdStatus: '' },
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

const calculatePassPercentage = (attended: string, passed: string): string => {
  const a = parseInt(attended, 10);
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
  experience: [],
  publications: [],
  technicalParticipation: [],
  guidance: [],
  organizedEvents: [],
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
    experienceLetterFile: null,
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
    <div className="flex flex-col">
      <label className="erp-label">{label}</label>
      <div className="erp-file-upload relative">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={label}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span className="truncate max-w-[150px]">{file.name}</span>
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
          <div className="text-xs text-muted-foreground">
            <Upload className="w-4 h-4 mx-auto mb-1" />
            <span>Click to upload</span>
            {hint && <div className="text-[10px] mt-0.5">{hint}</div>}
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground mt-0.5">Max: 5MB | PDF, JPG, PNG, DOC</span>
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
    <div className="flex flex-col">
      <label className="erp-label">{label}</label>
      <div className="erp-file-upload relative">
        <input
          type="file"
          multiple
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={label}
        />
        <div className="text-xs text-muted-foreground">
          <Upload className="w-4 h-4 mx-auto mb-1" />
          <span>Click to upload ({files.length}/{maxFiles})</span>
          {hint && <div className="text-[10px] mt-0.5">{hint}</div>}
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
  const updateEducationRow = useCallback((id: string, field: keyof EducationRow, value: string) => {
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
        phdStatus: ''
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
        department: '',
        programType: '',
        subjectName: '',
        patternName: '',
        branch: '',
        academicYear: '',
        classSemester: '',
        studentsAttended: '',
        studentsPassed: ''
      }]
    }));
  }, []);

  const updateAcademicsRow = useCallback((id: string, field: keyof AcademicsRow, value: string) => {
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
        offerLetterFile: null,
        experienceLetterFile: null
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
        conferenceSubtypes: [],
        department: '',
        academicYear: '',
        title: '',
        area: '',
        publicationDate: '',
        journalConferenceName: '',
        publisherName: '',
        uploadFile: null
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
        department: '',
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
        guidanceType: '',
        department: '',
        academicYear: '',
        fromDate: '',
        toDate: '',
        venue: '',
        title: '',
        noOfScholars: '',
        institutionName: '',
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
        department: '',
        academicYear: '',
        programType: '',
        programTitle: '',
        fromDate: '',
        endDate: '',
        venue: '',
        noOfParticipants: '',
        participantsCourse: [],
        geoTagPhotos: [],
        eventReport: null,
        budgetReport: null
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

  // Responsibility handlers
  const addResponsibilityRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, {
        id: generateId(),
        department: '',
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
    // Convert File objects to file names for JSON export
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

              <FormField label="Date of Leaving">
                <input
                  type="date"
                  value={formData.personalDetails.dateOfLeaving}
                  onChange={(e) => updatePersonalDetails('dateOfLeaving', e.target.value)}
                  className="erp-input w-full"
                />
              </FormField>

              <FormField label="Duration/Period">
                <input
                  type="text"
                  value={calculateDuration(formData.personalDetails.dateOfJoining, formData.personalDetails.dateOfLeaving)}
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
            <table className="erp-table min-w-[700px]">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Institute Name</th>
                  <th>Duration (months)</th>
                  <th>Year of Passing</th>
                  <th>% Marks / Status</th>
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
                        className="erp-input w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.instituteName}
                        onChange={(e) => updateEducationRow(row.id, 'instituteName', e.target.value)}
                        className="erp-input w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.durationMonths}
                        onChange={(e) => updateEducationRow(row.id, 'durationMonths', e.target.value)}
                        className="erp-input w-full"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.yearOfPassing}
                        onChange={(e) => updateEducationRow(row.id, 'yearOfPassing', e.target.value)}
                        className="erp-input w-full"
                        placeholder="YYYY"
                        maxLength={4}
                      />
                    </td>
                    <td>
                      {row.isPhD || row.courseName.toLowerCase().includes('ph.d') ? (
                        <div className="flex gap-3">
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
                          className="erp-input w-full"
                          placeholder="e.g., 85%"
                        />
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
                      <FormField label="Department">
                        <select
                          value={row.department}
                          onChange={(e) => updateAcademicsRow(row.id, 'department', e.target.value)}
                          className="erp-select w-full"
                        >
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Program Type">
                        <select
                          value={row.programType}
                          onChange={(e) => updateAcademicsRow(row.id, 'programType', e.target.value)}
                          className="erp-select w-full"
                        >
                          <option value="">-- Select --</option>
                          {PROGRAM_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
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
                              checked={row.patternName === 'NEP20 Scheme'}
                              onChange={() => updateAcademicsRow(row.id, 'patternName', 'NEP20 Scheme')}
                              className="w-3 h-3"
                            />
                            NEP20 Scheme
                          </label>
                        </div>
                      </FormField>

                      <FormField label="Branch">
                        <select
                          value={row.branch}
                          onChange={(e) => updateAcademicsRow(row.id, 'branch', e.target.value)}
                          className="erp-select w-full"
                        >
                          <option value="">-- Select --</option>
                          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </FormField>

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

                      <FormField label="Class (Semester)">
                        <select
                          value={row.classSemester}
                          onChange={(e) => updateAcademicsRow(row.id, 'classSemester', e.target.value)}
                          className="erp-select w-full"
                        >
                          <option value="">-- Select --</option>
                          {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Students Attended Exam">
                        <input
                          type="number"
                          value={row.studentsAttended}
                          onChange={(e) => updateAcademicsRow(row.id, 'studentsAttended', e.target.value)}
                          className="erp-input w-full"
                          min="0"
                        />
                      </FormField>

                      <FormField label="Students Passed">
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
                          value={calculatePassPercentage(row.studentsAttended, row.studentsPassed)}
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

        {/* Experience */}
        <div className="erp-card">
          <SectionHeader title="Experience" />
          <div className="p-4">
            {/* Educational Experience */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-3 border-b border-border pb-1">Educational Experience</h4>
              {formData.experience.filter(e => e.type === 'educational').length === 0 ? (
                <p className="text-sm text-muted-foreground mb-2">No educational experience added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.experience.filter(e => e.type === 'educational').map((row, idx) => (
                    <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-muted-foreground">#{idx + 1}</span>
                        <button type="button" onClick={() => removeExperienceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                          <input type="text" value={calculateDuration(row.fromDate, row.toDate)} readOnly className="erp-input w-full bg-muted" />
                        </FormField>
                        <FileUploadField label="Offer Letter / Payslip" hint="(Salary in CTC)" file={row.offerLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'offerLetterFile', f)} />
                        <FileUploadField label="Experience Letter" file={row.experienceLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'experienceLetterFile', f)} />
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
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-3 border-b border-border pb-1">Industrial Experience</h4>
              {formData.experience.filter(e => e.type === 'industrial').length === 0 ? (
                <p className="text-sm text-muted-foreground mb-2">No industrial experience added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.experience.filter(e => e.type === 'industrial').map((row, idx) => (
                    <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-muted-foreground">#{idx + 1}</span>
                        <button type="button" onClick={() => removeExperienceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                          <input type="text" value={calculateDuration(row.fromDate, row.toDate)} readOnly className="erp-input w-full bg-muted" />
                        </FormField>
                        <FileUploadField label="Offer Letter / Payslip" hint="(Salary in CTC)" file={row.offerLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'offerLetterFile', f)} />
                        <FileUploadField label="Experience Letter" file={row.experienceLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'experienceLetterFile', f)} />
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
              <h4 className="text-sm font-semibold text-foreground mb-3 border-b border-border pb-1">Research Experience</h4>
              {formData.experience.filter(e => e.type === 'research').length === 0 ? (
                <p className="text-sm text-muted-foreground mb-2">No research experience added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.experience.filter(e => e.type === 'research').map((row, idx) => (
                    <div key={row.id} className="border border-border rounded p-3 bg-muted/30 animate-fade-in">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-muted-foreground">#{idx + 1}</span>
                        <button type="button" onClick={() => removeExperienceRow(row.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded print:hidden">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                          <input type="text" value={calculateDuration(row.fromDate, row.toDate)} readOnly className="erp-input w-full bg-muted" />
                        </FormField>
                        <FileUploadField label="Offer Letter / Payslip" hint="(Salary in CTC)" file={row.offerLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'offerLetterFile', f)} />
                        <FileUploadField label="Experience Letter" file={row.experienceLetterFile} onFileChange={(f) => updateExperienceRow(row.id, 'experienceLetterFile', f)} />
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
                      <FormField label="Publication Type">
                        <select value={row.publicationType} onChange={(e) => updatePublicationRow(row.id, 'publicationType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {PUBLICATION_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FormField>

                      {row.publicationType === 'Conference' && (
                        <FormField label="Conference Subtypes" className="sm:col-span-2">
                          <div className="flex flex-wrap gap-3 h-8 items-center">
                            {CONFERENCE_SUBTYPES.map(cs => (
                              <label key={cs} className="flex items-center gap-1 text-xs">
                                <input
                                  type="checkbox"
                                  checked={row.conferenceSubtypes.includes(cs)}
                                  onChange={(e) => {
                                    const newSubtypes = e.target.checked
                                      ? [...row.conferenceSubtypes, cs]
                                      : row.conferenceSubtypes.filter(s => s !== cs);
                                    updatePublicationRow(row.id, 'conferenceSubtypes', newSubtypes);
                                  }}
                                  className="w-3 h-3"
                                />
                                {cs}
                              </label>
                            ))}
                          </div>
                        </FormField>
                      )}

                      <FormField label="Department">
                        <select value={row.department} onChange={(e) => updatePublicationRow(row.id, 'department', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updatePublicationRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
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
                      <FormField label="Type">
                        <select value={row.participationType} onChange={(e) => updateTechnicalRow(row.id, 'participationType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {PARTICIPATION_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Department">
                        <select value={row.department} onChange={(e) => updateTechnicalRow(row.id, 'department', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateTechnicalRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
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
                      <FormField label="Type">
                        <select value={row.guidanceType} onChange={(e) => updateGuidanceRow(row.id, 'guidanceType', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {GUIDANCE_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Department">
                        <select value={row.department} onChange={(e) => updateGuidanceRow(row.id, 'department', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateGuidanceRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="From Date">
                        <input type="date" value={row.fromDate} onChange={(e) => updateGuidanceRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="To Date">
                        <input type="date" value={row.toDate} onChange={(e) => updateGuidanceRow(row.id, 'toDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Venue">
                        <input type="text" value={row.venue} onChange={(e) => updateGuidanceRow(row.id, 'venue', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Title">
                        <input type="text" value={row.title} onChange={(e) => updateGuidanceRow(row.id, 'title', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="No. of Scholars">
                        <input type="number" value={row.noOfScholars} onChange={(e) => updateGuidanceRow(row.id, 'noOfScholars', e.target.value)} className="erp-input w-full" min="0" />
                      </FormField>

                      <FormField label="Institution Name">
                        <input type="text" value={row.institutionName} onChange={(e) => updateGuidanceRow(row.id, 'institutionName', e.target.value)} className="erp-input w-full" />
                      </FormField>

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
          <SectionHeader title="Organized Events (Program/Activity/Workshop/Social Activity e.g., NSS)" />
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
                      <FormField label="Department">
                        <select value={row.department} onChange={(e) => updateEventRow(row.id, 'department', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateEventRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Program Type">
                        <input type="text" value={row.programType} onChange={(e) => updateEventRow(row.id, 'programType', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Program Title">
                        <input type="text" value={row.programTitle} onChange={(e) => updateEventRow(row.id, 'programTitle', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="From Date">
                        <input type="date" value={row.fromDate} onChange={(e) => updateEventRow(row.id, 'fromDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="End Date">
                        <input type="date" value={row.endDate} onChange={(e) => updateEventRow(row.id, 'endDate', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="Venue">
                        <input type="text" value={row.venue} onChange={(e) => updateEventRow(row.id, 'venue', e.target.value)} className="erp-input w-full" />
                      </FormField>

                      <FormField label="No. of Participants">
                        <input type="number" value={row.noOfParticipants} onChange={(e) => updateEventRow(row.id, 'noOfParticipants', e.target.value)} className="erp-input w-full" min="0" />
                      </FormField>

                      <FormField label="Participants Course" className="sm:col-span-2">
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

                      <MultiFileUpload label="Photos" hint="(3 photos with Geo Tag)" files={row.geoTagPhotos} onFilesChange={(f) => updateEventRow(row.id, 'geoTagPhotos', f)} maxFiles={3} />
                      <FileUploadField label="Event Report" hint="(Event Report)" file={row.eventReport} onFileChange={(f) => updateEventRow(row.id, 'eventReport', f)} />
                      <FileUploadField label="Budget Report" hint="(Approved Fund Details)" file={row.budgetReport} onFileChange={(f) => updateEventRow(row.id, 'budgetReport', f)} />
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

        {/* Department / Other Responsibilities */}
        <div className="erp-card">
          <SectionHeader title="Department / Other Responsibilities" />
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
                      <FormField label="Department">
                        <select value={row.department} onChange={(e) => updateResponsibilityRow(row.id, 'department', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Academic Year">
                        <select value={row.academicYear} onChange={(e) => updateResponsibilityRow(row.id, 'academicYear', e.target.value)} className="erp-select w-full">
                          <option value="">-- Select --</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
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
                          placeholder="Who assigned, for which term, conditions..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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

              <FileUploadField label="Offer Letter / Payslip" hint="(Salary in CTC)" file={formData.salaryDetails.offerLetterFile} onFileChange={(f) => updateSalaryDetails('offerLetterFile', f)} />
              <FileUploadField label="Experience Letter" file={formData.salaryDetails.experienceLetterFile} onFileChange={(f) => updateSalaryDetails('experienceLetterFile', f)} />
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="bg-card rounded-b-lg border border-t-0 border-border px-4 py-4 flex flex-wrap gap-2 justify-center print:hidden">
          <button type="button" onClick={handleSaveDraft} className="erp-btn-secondary flex items-center gap-1">
            <Download className="w-4 h-4" /> Save as Draft
          </button>
          <button type="button" onClick={handleExportPDF} className="erp-btn-secondary flex items-center gap-1">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button type="submit" className="erp-btn-success flex items-center gap-1">
            <Send className="w-4 h-4" /> Submit Form
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-card rounded-lg p-6 max-w-sm mx-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mx-auto mb-4">
              <Check className="w-6 h-6 text-[hsl(var(--success))]" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Form Submitted Successfully!</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">Your employee record has been submitted. Check the console for the JSON output.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full erp-btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRecords;
