
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNewsManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="News Management"
        description="Manage news articles and announcements"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>News Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>News management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
