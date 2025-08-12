import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheckIcon, UploadIcon, CheckCircleIcon, ClockIcon, 
  XCircleIcon, AlertTriangleIcon, CameraIcon, FileTextIcon,
  UserIcon, MapPinIcon, PhoneIcon, CalendarIcon
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface KycData {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  documentType: 'passport' | 'driver_license' | 'national_id';
  documentNumber: string;
  documentFrontImageUrl?: string;
  documentBackImageUrl?: string;
  selfieImageUrl?: string;
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  notes?: string;
}

export default function KycVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [kycData, setKycData] = useState<KycData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    documentType: 'passport',
    documentNumber: ''
  });

  const { data: existingKyc, isLoading } = useQuery({
    queryKey: ["/api/kyc/status"],
    retry: false,
    enabled: !!user,
  });

  const submitKycMutation = useMutation({
    mutationFn: (data: KycData) =>
      apiRequest('/api/kyc/submit', { 
        method: 'POST', 
        body: data 
      }),
    onSuccess: () => {
      toast({
        title: "KYC submitted successfully",
        description: "Your verification is under review. We'll notify you within 24-48 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/status"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit KYC verification",
        variant: "destructive",
      });
    },
  });

  const updateKycMutation = useMutation({
    mutationFn: (data: Partial<KycData>) =>
      apiRequest('/api/kyc/update', { 
        method: 'PATCH', 
        body: data 
      }),
    onSuccess: () => {
      toast({
        title: "KYC updated successfully",
        description: "Your updated information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/status"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update KYC verification",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  // If KYC already exists, show status
  if (existingKyc) {
    const getStatusIcon = () => {
      switch (existingKyc.status) {
        case 'approved':
          return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
        case 'rejected':
          return <XCircleIcon className="h-8 w-8 text-red-500" />;
        case 'under_review':
          return <ClockIcon className="h-8 w-8 text-yellow-500" />;
        default:
          return <AlertTriangleIcon className="h-8 w-8 text-orange-500" />;
      }
    };

    const getStatusMessage = () => {
      switch (existingKyc.status) {
        case 'approved':
          return 'Your identity has been successfully verified. You have full access to all platform features.';
        case 'rejected':
          return 'Your verification was rejected. Please review the feedback and resubmit with corrected information.';
        case 'under_review':
          return 'Your documents are being reviewed by our verification team. This typically takes 24-48 hours.';
        default:
          return 'Your verification is pending. Please ensure all required documents are uploaded.';
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            KYC Verification Status
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Your identity verification status and details
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl">
              <Badge 
                variant={existingKyc.status === 'approved' ? 'default' : 
                        existingKyc.status === 'rejected' ? 'destructive' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {existingKyc.status?.toUpperCase().replace('_', ' ')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-slate-600 dark:text-slate-400">
              <p>{getStatusMessage()}</p>
            </div>

            {existingKyc.rejectionReason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Rejection Reason:
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  {existingKyc.rejectionReason}
                </p>
              </div>
            )}

            {existingKyc.notes && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Admin Notes:
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  {existingKyc.notes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Submitted Date</Label>
                <p className="font-medium">{new Date(existingKyc.createdAt).toLocaleDateString()}</p>
              </div>
              {existingKyc.reviewedAt && (
                <div>
                  <Label>Reviewed Date</Label>
                  <p className="font-medium">{new Date(existingKyc.reviewedAt).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <Label>Document Type</Label>
                <p className="font-medium">{existingKyc.documentType?.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <Label>Document Number</Label>
                <p className="font-medium">***{existingKyc.documentNumber?.slice(-4)}</p>
              </div>
            </div>

            {existingKyc.status === 'rejected' && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.reload()}
                  data-testid="button-resubmit-kyc"
                >
                  Resubmit Verification
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof KycData, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'nationality'];
      const missingFields = requiredFields.filter(field => !kycData[field as keyof KycData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required personal information",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      const requiredFields = ['address', 'city', 'postalCode', 'country', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !kycData[field as keyof KycData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required address information",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (!kycData.documentType || !kycData.documentNumber) {
        toast({
          title: "Document information required",
          description: "Please provide document type and number",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality',
      'address', 'city', 'postalCode', 'country', 'phoneNumber',
      'documentType', 'documentNumber'
    ];
    
    const missingFields = requiredFields.filter(field => !kycData[field as keyof KycData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields before submitting",
        variant: "destructive",
      });
      return;
    }

    submitKycMutation.mutate(kycData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={kycData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={kycData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={kycData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  data-testid="input-date-of-birth"
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={kycData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="e.g., American, British, etc."
                  data-testid="input-nationality"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                value={kycData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your full street address"
                data-testid="input-address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={kycData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  data-testid="input-city"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={kycData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  data-testid="input-postal-code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={kycData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  data-testid="input-country"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={kycData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  data-testid="input-phone"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="documentType">Document Type *</Label>
              <select
                id="documentType"
                value={kycData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                data-testid="select-document-type"
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID Card</option>
              </select>
            </div>

            <div>
              <Label htmlFor="documentNumber">Document Number *</Label>
              <Input
                id="documentNumber"
                value={kycData.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                placeholder="Enter your document number"
                data-testid="input-document-number"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Document Requirements:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Document must be government-issued</li>
                <li>• Clear, high-resolution photos</li>
                <li>• All text must be legible</li>
                <li>• Document must not be expired</li>
                <li>• No screenshots or photocopies</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Upload clear photos of your documents. In a real implementation, 
                this would include file upload functionality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h4 className="font-medium mb-2">Document Front</h4>
                  <Button variant="outline" size="sm" data-testid="button-upload-front">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </CardContent>
              </Card>

              {kycData.documentType !== 'passport' && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h4 className="font-medium mb-2">Document Back</h4>
                    <Button variant="outline" size="sm" data-testid="button-upload-back">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6 text-center">
                  <CameraIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h4 className="font-medium mb-2">Selfie Photo</h4>
                  <Button variant="outline" size="sm" data-testid="button-upload-selfie">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return UserIcon;
      case 2:
        return MapPinIcon;
      case 3:
        return FileTextIcon;
      case 4:
        return CameraIcon;
      default:
        return UserIcon;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          KYC Verification
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Complete your identity verification to access all platform features
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5" />
              Identity Verification
            </CardTitle>
            <Badge variant="outline">
              Step {currentStep} of 4
            </Badge>
          </div>
          <Progress value={(currentStep / 4) * 100} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step indicators */}
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => {
              const Icon = getStepIcon(step);
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-primary text-white' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center">
                    {step === 1 && 'Personal'}
                    {step === 2 && 'Address'}
                    {step === 3 && 'Document'}
                    {step === 4 && 'Upload'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            {renderStep()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              data-testid="button-prev-step"
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleNextStep} data-testid="button-next-step">
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={submitKycMutation.isPending}
                data-testid="button-submit-kyc"
              >
                {submitKycMutation.isPending ? "Submitting..." : "Submit for Review"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}