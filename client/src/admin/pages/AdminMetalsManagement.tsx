
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMetalsManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="Metals Management"
        description="Manage precious metals trading and inventory"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Metals Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Metals management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
