
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, 
  MoreHorizontal, Edit, Trash2 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Order {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  amount: number;
  price: number;
  filled: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  createdAt: string;
}

export default function Orders() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("open");

  // Mock data - replace with real API calls
  const openOrders: Order[] = [
    {
      id: "1",
      pair: "BTC/USD",
      type: "buy",
      orderType: "limit",
      amount: 0.5,
      price: 48000,
      filled: 0,
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      pair: "ETH/USD",
      type: "sell",
      orderType: "limit",
      amount: 2.0,
      price: 2800,
      filled: 0.5,
      status: "partial",
      createdAt: "2024-01-15T09:15:00Z"
    }
  ];

  const orderHistory: Order[] = [
    {
      id: "3",
      pair: "BTC/USD",
      type: "buy",
      orderType: "market",
      amount: 0.1,
      price: 49500,
      filled: 0.1,
      status: "filled",
      createdAt: "2024-01-14T15:45:00Z"
    },
    {
      id: "4",
      pair: "SOL/USD",
      type: "sell",
      orderType: "limit",
      amount: 10,
      price: 95,
      filled: 0,
      status: "cancelled",
      createdAt: "2024-01-13T11:20:00Z"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'filled':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'filled':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'partial':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <Navbar />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Management</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Track and manage your trading orders
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="open">Open Orders ({openOrders.length})</TabsTrigger>
                    <TabsTrigger value="history">Order History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="open">
                    {openOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Pair
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Filled
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {openOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-slate-900 dark:text-white">
                                    {order.pair}
                                  </div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {order.orderType.toUpperCase()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`flex items-center ${
                                    order.type === 'buy' ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {order.type === 'buy' ? (
                                      <TrendingUp className="h-4 w-4 mr-1" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4 mr-1" />
                                    )}
                                    {order.type.toUpperCase()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                  {order.amount} {order.pair.split('/')[0]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                  ${order.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-slate-900 dark:text-white">
                                    {((order.filled / order.amount) * 100).toFixed(1)}%
                                  </div>
                                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                                    <div 
                                      className="bg-primary h-1.5 rounded-full transition-all"
                                      style={{ width: `${(order.filled / order.amount) * 100}%` }}
                                    ></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={getStatusColor(order.status)}>
                                    <div className="flex items-center">
                                      {getStatusIcon(order.status)}
                                      <span className="ml-1 capitalize">{order.status}</span>
                                    </div>
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">No open orders</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Your active orders will appear here</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Pair
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {orderHistory.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {order.pair}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {order.orderType.toUpperCase()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`flex items-center ${
                                  order.type === 'buy' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {order.type === 'buy' ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                  )}
                                  {order.type.toUpperCase()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                {order.amount} {order.pair.split('/')[0]}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                ${order.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center">
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 capitalize">{order.status}</span>
                                  </div>
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
