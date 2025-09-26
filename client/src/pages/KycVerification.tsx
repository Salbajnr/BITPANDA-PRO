
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
    meta: {
      errorMessage: "No KYC verification found"
    }
  });

  const submitKycMutation = useMutation({
    mutationFn: (data: KycData) =>
      apiRequest('/api/kyc/submit', { 
        method: 'POST', 
        body: {
          ...data,
          documentFrontImageUrl: 'placeholder-front.jpg',
          selfieImageUrl: 'placeholder-selfie.jpg'
        }
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
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If KYC already exists, show status
  if (existingKyc) {
    const getStatusIcon = () => {
      switch (existingKyc.status) {
        case 'approved':
          return <CheckCircleIcon className="h-12 w-12 text-green-500" />;
        case 'rejected':
          return <XCircleIcon className="h-12 w-12 text-red-500" />;
        case 'under_review':
          return <ClockIcon className="h-12 w-12 text-green-500" />;
        default:
          return <AlertTriangleIcon className="h-12 w-12 text-orange-500" />;
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
      <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900" style={{ fontWeight: 700, letterSpacing: '-0.4px' }}>
              Verification Status
            </h1>
            <p className="text-lg text-slate-600" style={{ fontWeight: 400 }}>
              Your identity verification details
            </p>
          </div>

          {/* Status Card */}
          <Card className="bg-white border-0 shadow-lg" style={{ borderRadius: '8px' }}>
            <CardHeader className="text-center pb-6" style={{ padding: '32px' }}>
              <div className="flex justify-center mb-6">
                {getStatusIcon()}
              </div>
              <CardTitle className="text-2xl mb-4" style={{ fontWeight: 600 }}>
                <Badge 
                  className={`text-lg px-6 py-3 ${
                    existingKyc.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 
                    existingKyc.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 
                    'bg-green-500 hover:bg-green-600'
                  }`}
                  style={{ borderRadius: '24px', fontWeight: 500 }}
                >
                  {existingKyc.status?.toUpperCase().replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 32px 32px 32px' }}>
              <div className="text-center text-slate-600 mb-8" style={{ fontSize: '17px', lineHeight: '1.4' }}>
                <p>{getStatusMessage()}</p>
              </div>

              {existingKyc.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6" style={{ borderRadius: '8px' }}>
                  <h3 className="font-semibold text-red-800 mb-3" style={{ fontSize: '17px', fontWeight: 600 }}>
                    Rejection Reason:
                  </h3>
                  <p className="text-red-700" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                    {existingKyc.rejectionReason}
                  </p>
                </div>
              )}

              {existingKyc.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6" style={{ borderRadius: '8px' }}>
                  <h3 className="font-semibold text-blue-800 mb-3" style={{ fontSize: '17px', fontWeight: 600 }}>
                    Admin Notes:
                  </h3>
                  <p className="text-blue-700" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                    {existingKyc.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8">
                <div className="space-y-1">
                  <Label className="text-slate-500" style={{ fontSize: '13px', fontWeight: 500 }}>Submitted Date</Label>
                  <p className="font-medium text-slate-900" style={{ fontSize: '15px' }}>{new Date(existingKyc.createdAt).toLocaleDateString()}</p>
                </div>
                {existingKyc.reviewedAt && (
                  <div className="space-y-1">
                    <Label className="text-slate-500" style={{ fontSize: '13px', fontWeight: 500 }}>Reviewed Date</Label>
                    <p className="font-medium text-slate-900" style={{ fontSize: '15px' }}>{new Date(existingKyc.reviewedAt).toLocaleDateString()}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-slate-500" style={{ fontSize: '13px', fontWeight: 500 }}>Document Type</Label>
                  <p className="font-medium text-slate-900" style={{ fontSize: '15px' }}>{existingKyc.documentType?.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500" style={{ fontSize: '13px', fontWeight: 500 }}>Document Number</Label>
                  <p className="font-medium text-slate-900" style={{ fontSize: '15px' }}>***{existingKyc.documentNumber?.slice(-4)}</p>
                </div>
              </div>

              {existingKyc.status === 'rejected' && (
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                    style={{ borderRadius: '8px', fontWeight: 500, fontSize: '15px' }}
                    data-testid="button-resubmit-kyc"
                  >
                    Resubmit Verification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>First Name *</Label>
                <Input
                  id="firstName"
                  value={kycData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Last Name *</Label>
                <Input
                  id="lastName"
                  value={kycData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={kycData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-date-of-birth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Nationality *</Label>
                <Input
                  id="nationality"
                  value={kycData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="e.g., American, British, etc."
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-nationality"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Street Address *</Label>
              <Textarea
                id="address"
                value={kycData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your full street address"
                className="min-h-20 border-slate-300 focus:border-green-500 focus:ring-green-500"
                style={{ borderRadius: '8px', fontSize: '15px' }}
                data-testid="input-address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>City *</Label>
                <Input
                  id="city"
                  value={kycData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={kycData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-postal-code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Country *</Label>
                <Input
                  id="country"
                  value={kycData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={kycData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  style={{ borderRadius: '8px', fontSize: '15px' }}
                  data-testid="input-phone"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="documentType" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Document Type *</Label>
              <select
                id="documentType"
                value={kycData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="w-full h-12 px-4 border border-slate-300 bg-white rounded-lg text-slate-900 focus:border-green-500 focus:ring-green-500"
                style={{ borderRadius: '8px', fontSize: '15px' }}
                data-testid="select-document-type"
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID Card</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber" style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Document Number *</Label>
              <Input
                id="documentNumber"
                value={kycData.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                placeholder="Enter your document number"
                className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                style={{ borderRadius: '8px', fontSize: '15px' }}
                data-testid="input-document-number"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" style={{ borderRadius: '8px' }}>
              <h3 className="font-semibold text-blue-800 mb-3" style={{ fontSize: '17px', fontWeight: 600 }}>
                Document Requirements:
              </h3>
              <ul className="text-blue-700 space-y-2" style={{ fontSize: '15px', lineHeight: '1.4' }}>
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
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4" style={{ fontWeight: 600 }}>Document Upload</h3>
              <p className="text-slate-600 mb-8" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                Upload clear photos of your documents. In a real implementation, 
                this would include file upload functionality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-dashed border-slate-300 hover:border-green-500 transition-colors">
                <CardContent className="p-8 text-center">
                  <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h4 className="font-medium mb-4" style={{ fontSize: '15px', fontWeight: 500 }}>Document Front</h4>
                  <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50" data-testid="button-upload-front">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </CardContent>
              </Card>

              {kycData.documentType !== 'passport' && (
                <Card className="border-2 border-dashed border-slate-300 hover:border-green-500 transition-colors">
                  <CardContent className="p-8 text-center">
                    <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h4 className="font-medium mb-4" style={{ fontSize: '15px', fontWeight: 500 }}>Document Back</h4>
                    <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50" data-testid="button-upload-back">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="border-2 border-dashed border-slate-300 hover:border-green-500 transition-colors">
                <CardContent className="p-8 text-center">
                  <CameraIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h4 className="font-medium mb-4" style={{ fontSize: '15px', fontWeight: 500 }}>Selfie Photo</h4>
                  <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50" data-testid="button-upload-selfie">
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
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900" style={{ fontWeight: 700, letterSpacing: '-0.4px' }}>
            Identity Verification
          </h1>
          <p className="text-lg text-slate-600" style={{ fontWeight: 400 }}>
            Complete your identity verification to access all platform features
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-white border-0 shadow-lg" style={{ borderRadius: '8px' }}>
          <CardHeader style={{ padding: '32px 32px 24px 32px' }}>
            <div className="flex items-center justify-between mb-6">
              <CardTitle className="flex items-center gap-3" style={{ fontSize: '24px', fontWeight: 600 }}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                </div>
                Identity Verification
              </CardTitle>
              <Badge variant="outline" className="px-4 py-2" style={{ borderRadius: '24px', fontSize: '13px' }}>
                Step {currentStep} of 4
              </Badge>
            </div>
            <Progress value={(currentStep / 4) * 100} className="w-full h-2" style={{ borderRadius: '4px' }} />
          </CardHeader>
          
          <CardContent style={{ padding: '0 32px 32px 32px' }}>
            {/* Step indicators */}
            <div className="flex justify-between items-center mb-8">
              {[1, 2, 3, 4].map((step) => {
                const Icon = getStepIcon(step);
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-green-500 text-white' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span className="text-xs mt-3 text-center font-medium" style={{ fontSize: '13px' }}>
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
            <div className="min-h-[400px] mb-8">
              {renderStep()}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50"
                style={{ borderRadius: '8px', fontWeight: 500, fontSize: '15px' }}
                data-testid="button-prev-step"
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNextStep}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white"
                  style={{ borderRadius: '8px', fontWeight: 500, fontSize: '15px' }}
                  data-testid="button-next-step"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={submitKycMutation.isPending}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white disabled:bg-slate-400"
                  style={{ borderRadius: '8px', fontWeight: 500, fontSize: '15px' }}
                  data-testid="button-submit-kyc"
                >
                  {submitKycMutation.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
