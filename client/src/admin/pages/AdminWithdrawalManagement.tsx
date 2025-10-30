
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminWithdrawalManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="Withdrawal Management"
        description="Manage user withdrawal requests and approvals"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Withdrawal management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
