
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon, 
  AlertTriangleIcon, SearchIcon, FilterIcon, EyeIcon,
  FileTextIcon, UserIcon, CalendarIcon, MapPinIcon,
  ThumbsUpIcon, ThumbsDownIcon, MessageSquareIcon
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface KycVerification {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  documentType: string;
  documentNumber: string;
  documentFrontImageUrl: string;
  documentBackImageUrl?: string;
  selfieImageUrl: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  userEmail?: string;
  userUsername?: string;
}

export default function AdminKycManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKycs, setSelectedKycs] = useState<string[]>([]);
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; kyc?: KycVerification }>({ open: false });
  const [bulkReviewDialog, setBulkReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    rejectionReason: '',
    notes: ''
  });

  // Fetch KYC verifications
  const { data: kycData, isLoading } = useQuery({
    queryKey: ["/api/kyc/admin/verifications", page, statusFilter, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      });
      return apiRequest('GET', `/api/kyc/admin/verifications?${params}`);
    },
  });

  // Fetch KYC statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/kyc/admin/statistics"],
    queryFn: () => apiRequest('GET', '/api/kyc/admin/statistics'),
  });

  // Review KYC mutation
  const reviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest('POST', `/api/kyc/admin/verifications/${id}/review`, data),
    onSuccess: () => {
      toast({
        title: "KYC reviewed successfully",
        description: "The verification status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/admin/verifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/admin/statistics"] });
      setReviewDialog({ open: false });
      setReviewData({ status: '', rejectionReason: '', notes: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Review failed",
        description: error.message || "Failed to review KYC verification",
        variant: "destructive",
      });
    },
  });

  // Bulk review mutation
  const bulkReviewMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('POST', '/api/kyc/admin/verifications/bulk-review', data),
    onSuccess: () => {
      toast({
        title: "Bulk review completed",
        description: "Selected verifications have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/admin/verifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/admin/statistics"] });
      setBulkReviewDialog(false);
      setSelectedKycs([]);
      setReviewData({ status: '', rejectionReason: '', notes: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk review failed",
        description: error.message || "Failed to review selected verifications",
        variant: "destructive",
      });
    },
  });

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!reviewDialog.kyc) return;
    
    const data = {
      status,
      rejectionReason: status === 'rejected' ? reviewData.rejectionReason : undefined,
      notes: reviewData.notes
    };

    reviewMutation.mutate({ id: reviewDialog.kyc.id, data });
  };

  const handleBulkReview = () => {
    if (selectedKycs.length === 0 || !reviewData.status) return;

    const data = {
      ids: selectedKycs,
      status: reviewData.status,
      rejectionReason: reviewData.status === 'rejected' ? reviewData.rejectionReason : undefined,
      notes: reviewData.notes
    };

    bulkReviewMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      under_review: 'outline',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'under_review':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangleIcon className="h-4 w-4 text-orange-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          KYC Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Review and manage user identity verifications
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileTextIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangleIcon className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Under Review</p>
                  <p className="text-2xl font-bold">{stats.underReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircleIcon className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedKycs.length > 0 && (
              <Button
                onClick={() => setBulkReviewDialog(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FilterIcon className="h-4 w-4" />
                Bulk Review ({selectedKycs.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KYC Verifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          {kycData?.verifications?.length === 0 ? (
            <div className="text-center py-8">
              <FileTextIcon className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No KYC verifications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {kycData?.verifications?.map((kyc: KycVerification) => (
                <div key={kyc.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedKycs.includes(kyc.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedKycs([...selectedKycs, kyc.id]);
                          } else {
                            setSelectedKycs(selectedKycs.filter(id => id !== kyc.id));
                          }
                        }}
                      />
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(kyc.status)}
                        <div>
                          <h3 className="font-semibold">
                            {kyc.firstName} {kyc.lastName}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {kyc.userEmail} • {kyc.nationality}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(kyc.status)}
                      
                      <Dialog 
                        open={reviewDialog.open && reviewDialog.kyc?.id === kyc.id}
                        onOpenChange={(open) => setReviewDialog({ open, kyc: open ? kyc : undefined })}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Review KYC Verification</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Personal Information */}
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                Personal Information
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>First Name</Label>
                                  <p className="font-medium">{kyc.firstName}</p>
                                </div>
                                <div>
                                  <Label>Last Name</Label>
                                  <p className="font-medium">{kyc.lastName}</p>
                                </div>
                                <div>
                                  <Label>Date of Birth</Label>
                                  <p className="font-medium">{new Date(kyc.dateOfBirth).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label>Nationality</Label>
                                  <p className="font-medium">{kyc.nationality}</p>
                                </div>
                                <div>
                                  <Label>Phone Number</Label>
                                  <p className="font-medium">{kyc.phoneNumber}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Address Information */}
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4" />
                                Address Information
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <Label>Address</Label>
                                  <p className="font-medium">{kyc.address}</p>
                                </div>
                                <div>
                                  <Label>City</Label>
                                  <p className="font-medium">{kyc.city}</p>
                                </div>
                                <div>
                                  <Label>Postal Code</Label>
                                  <p className="font-medium">{kyc.postalCode}</p>
                                </div>
                                <div>
                                  <Label>Country</Label>
                                  <p className="font-medium">{kyc.country}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Document Information */}
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <FileTextIcon className="h-4 w-4" />
                                Document Information
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Document Type</Label>
                                  <p className="font-medium">{kyc.documentType.replace('_', ' ').toUpperCase()}</p>
                                </div>
                                <div>
                                  <Label>Document Number</Label>
                                  <p className="font-medium">{kyc.documentNumber}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Submission Details */}
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Submission Details
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Submitted</Label>
                                  <p className="font-medium">{new Date(kyc.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <div>{getStatusBadge(kyc.status)}</div>
                                </div>
                                {kyc.reviewedAt && (
                                  <div>
                                    <Label>Reviewed</Label>
                                    <p className="font-medium">{new Date(kyc.reviewedAt).toLocaleString()}</p>
                                  </div>
                                )}
                                {kyc.rejectionReason && (
                                  <div className="col-span-2">
                                    <Label>Rejection Reason</Label>
                                    <p className="font-medium text-red-600">{kyc.rejectionReason}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Review Form */}
                            {kyc.status !== 'approved' && (
                              <div className="border-t pt-6">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                  <MessageSquareIcon className="h-4 w-4" />
                                  Review Decision
                                </h3>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea
                                      id="notes"
                                      value={reviewData.notes}
                                      onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                                      placeholder="Add any notes about this verification..."
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="rejection-reason">Rejection Reason (Required if rejecting)</Label>
                                    <Textarea
                                      id="rejection-reason"
                                      value={reviewData.rejectionReason}
                                      onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                                      placeholder="Explain why this verification is being rejected..."
                                    />
                                  </div>
                                  
                                  <div className="flex space-x-3">
                                    <Button
                                      onClick={() => handleReview('approved')}
                                      className="flex items-center gap-2"
                                      disabled={reviewMutation.isPending}
                                    >
                                      <ThumbsUpIcon className="h-4 w-4" />
                                      Approve
                                    </Button>
                                    
                                    <Button
                                      onClick={() => handleReview('rejected')}
                                      variant="destructive"
                                      className="flex items-center gap-2"
                                      disabled={reviewMutation.isPending || !reviewData.rejectionReason}
                                    >
                                      <ThumbsDownIcon className="h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {kycData?.pagination && kycData.pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, kycData.pagination.total)} of {kycData.pagination.total} results
              </p>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === kycData.pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Review Dialog */}
      <Dialog open={bulkReviewDialog} onOpenChange={setBulkReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Review KYC Verifications</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You are about to review {selectedKycs.length} KYC verification(s).
            </p>
            
            <div>
              <Label htmlFor="bulk-status">Action</Label>
              <Select value={reviewData.status} onValueChange={(value) => setReviewData({ ...reviewData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {reviewData.status === 'rejected' && (
              <div>
                <Label htmlFor="bulk-rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="bulk-rejection-reason"
                  value={reviewData.rejectionReason}
                  onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                  placeholder="Explain why these verifications are being rejected..."
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="bulk-notes">Notes (Optional)</Label>
              <Textarea
                id="bulk-notes"
                value={reviewData.notes}
                onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                placeholder="Add any notes about these verifications..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setBulkReviewDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkReview}
                disabled={!reviewData.status || bulkReviewMutation.isPending || (reviewData.status === 'rejected' && !reviewData.rejectionReason)}
              >
                {bulkReviewMutation.isPending ? "Processing..." : "Confirm Bulk Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
