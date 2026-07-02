import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudents } from "@/services/studentService";
import { getFees, getFeeSummary, recordPayment, initiateMpesaPayment } from "@/services/feeService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TERMS = ["Term 1", "Term 2", "Term 3"];
const YEARS = ["2024", "2025", "2026"];
const FEE_TYPES = ["tuition", "bus", "lunch", "exam", "other"];

export default function FeesPage() {
  const { userProfile } = useAuth();
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState("2026");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentFee, setPaymentFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaFee, setMpesaFee] = useState(null);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedTerm, selectedYear]);

  async function loadData() {
    setLoading(true);
    try {
      const [studentsData, feesData, summaryData] = await Promise.all([
        getStudents(),
        getFees({ term: selectedTerm, year: selectedYear }),
        getFeeSummary(selectedYear, selectedTerm),
      ]);
      setStudents(studentsData);
      setFees(feesData);
      setSummary(summaryData);
    } catch (err) {
      console.error("Error loading fees:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredFees = fees.filter((fee) => {
    const student = students.find((s) => s.id === fee.studentId);
    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      student?.fullName?.toLowerCase().includes(searchLower) ||
      student?.admissionNo?.toLowerCase().includes(searchLower) ||
      fee.type?.toLowerCase().includes(searchLower)
    );
  });

  const handleRecordPayment = async () => {
    if (!paymentFee || !paymentAmount) return;
    setPaymentLoading(true);
    try {
      await recordPayment(paymentFee.id, paymentFee.studentId, {
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        recordedBy: userProfile?.fullName || "Unknown",
      });
      setShowPaymentModal(false);
      setPaymentAmount("");
      setPaymentMethod("cash");
      setPaymentFee(null);
      await loadData();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to record payment: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!mpesaFee || !mpesaPhone) return;
    setMpesaLoading(true);
    setMpesaMessage("");
    try {
      const student = students.find((s) => s.id === mpesaFee.studentId);
      const result = await initiateMpesaPayment({
        phoneNumber: mpesaPhone,
        amount: mpesaFee.balance || mpesaFee.amount,
        studentId: mpesaFee.studentId,
        feeId: mpesaFee.feeId || mpesaFee.id,
        admissionNumber: student?.admissionNo || null,
        term: mpesaFee.term,
        year: mpesaFee.year,
      });
      setMpesaMessage(result.message || "STK push sent! Check your phone.");
      setTimeout(() => {
        setShowMpesaModal(false);
        setMpesaPhone("");
        setMpesaMessage("");
        setMpesaFee(null);
        loadData();
      }, 3000);
    } catch (err) {
      console.error("M-Pesa error:", err);
      setMpesaMessage("Error: " + err.message);
    } finally {
      setMpesaLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-800 hover:bg-green-100",
      partial: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      pending: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      overdue: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return (
      <Badge className={cn(styles[status] || styles.pending, "capitalize")}>
        {status}
      </Badge>
    );
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.fullName || "Unknown";
  };

  const getStudentAdmission = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.admissionNo || "-";
  };

  const getStudentPhone = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.parentPhone || student?.phone || "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground">
              Track and manage student fee payments
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TERMS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {summary && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {summary.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary.count} fee records
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Collected</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  KES {summary.collected.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((summary.collected / summary.total) * 100 || 0).toFixed(1)}% collected
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  KES {summary.pending.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary.overdue} overdue
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  KES {summary.balance.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Outstanding amount</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fee Records</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student or fee type..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Student</th>
                      <th className="text-left py-3 px-4 font-medium">Adm No</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                      <th className="text-right py-3 px-4 font-medium">Paid</th>
                      <th className="text-right py-3 px-4 font-medium">Balance</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFees.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-8 text-muted-foreground">
                          No fee records found
                        </td>
                      </tr>
                    ) : (
                      filteredFees.map((fee) => (
                        <tr key={fee.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">
                            {getStudentName(fee.studentId)}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {getStudentAdmission(fee.studentId)}
                          </td>
                          <td className="py-3 px-4 capitalize">{fee.type}</td>
                          <td className="py-3 px-4 text-right">
                            KES {(fee.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-green-600">
                            KES {(fee.paidAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            KES {(fee.balance || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(fee.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {fee.status !== "paid" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setPaymentFee(fee);
                                      setPaymentAmount(fee.balance?.toString() || "");
                                      setShowPaymentModal(true);
                                    }}
                                  >
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Cash
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      setMpesaFee(fee);
                                      setMpesaPhone(getStudentPhone(fee.studentId));
                                      setMpesaMessage("");
                                      setShowMpesaModal(true);
                                    }}
                                  >
                                    <Smartphone className="h-3 w-3 mr-1" />
                                    M-Pesa
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cash Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Cash Payment</DialogTitle>
          </DialogHeader>
          {paymentFee && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">{getStudentName(paymentFee.studentId)}</p>
                <p className="text-sm text-muted-foreground">
                  Balance: KES {(paymentFee.balance || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Amount (KES)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={paymentFee.balance}
                />
              </div>
              <div className="space-y-2">
                <Label>Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleRecordPayment} disabled={!paymentAmount || paymentLoading}>
                  {paymentLoading ? "Recording..." : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Record Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* M-Pesa Payment Modal */}
      <Dialog open={showMpesaModal} onOpenChange={setShowMpesaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay with M-Pesa</DialogTitle>
          </DialogHeader>
          {mpesaFee && (
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-medium">{getStudentName(mpesaFee.studentId)}</p>
                <p className="text-sm text-green-700">
                  Amount: KES {(mpesaFee.balance || mpesaFee.amount || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>M-Pesa Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Format: 2547XXXXXXXX (e.g., 254712345678)
                </p>
              </div>
              {mpesaMessage && (
                <div className={cn(
                  "p-3 rounded-lg text-sm",
                  mpesaMessage.includes("Error") 
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                )}>
                  {mpesaMessage}
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMpesaModal(false);
                    setMpesaMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleMpesaPayment} 
                  disabled={!mpesaPhone || mpesaLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {mpesaLoading ? "Sending..." : (
                    <>
                      <Smartphone className="h-4 w-4 mr-1" />
                      Send STK Push
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
