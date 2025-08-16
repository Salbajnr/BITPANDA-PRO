
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminBalanceManipulator from '@/components/AdminBalanceManipulator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

export default function AdminBalanceManagement() {
  const { user, isLoading } = useAuth();

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/analytics/overview'],
    queryFn: () => apiRequest('/api/admin/analytics/overview'),
    retry: 1,
    enabled: user?.role === 'admin',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Balance Management</h1>
              <p className="text-orange-100">
                Comprehensive tools for managing user balances and financial operations
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-orange-200" />
                    <div>
                      <p className="text-sm text-orange-200">Total Users</p>
                      <p className="text-xl font-bold">{stats.totalUsers || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-orange-200" />
                    <div>
                      <p className="text-sm text-orange-200">Total Platform Value</p>
                      <p className="text-xl font-bold">
                        ${parseFloat(stats.totalPlatformValue || '0').toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-orange-200" />
                    <div>
                      <p className="text-sm text-orange-200">Active Portfolios</p>
                      <p className="text-xl font-bold">{stats.activePortfolios || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-orange-200" />
                    <div>
                      <p className="text-sm text-orange-200">Adjustments Today</p>
                      <p className="text-xl font-bold">{stats.adjustmentsToday || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Balance Manipulator */}
        <AdminBalanceManipulator />
      </div>
    </div>
  );
}
