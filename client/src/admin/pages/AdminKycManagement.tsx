
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminKycManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="KYC Management"
        description="Manage user KYC verification requests and documents"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>KYC Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>KYC management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
