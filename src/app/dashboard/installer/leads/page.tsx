"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { InstallerRouteGuard } from "@/lib/routeGuard";
import { 
  getLeadsForInstaller,
  updateLeadStatus
} from "@/lib/firebaseHelpers";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Star,
  Filter
} from "lucide-react";

interface Lead {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  project_type: string;
  location: string;
  description: string;
  status: string;
  created_at: Date;
  amount?: number;
  installer_notes?: string;
}

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: Clock },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800", icon: MessageCircle },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-800", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function InstallerLeadsPage() {
  const { user } = useUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const leadsData = await getLeadsForInstaller(user.uid);
      const defaultLead = {
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        project_type: "",
        location: "",
        description: "",
        status: "",
        created_at: new Date(),
      };
      setLeads(
        leadsData.map((lead: any) => ({
          ...defaultLead,
          ...lead,
        }))
      );
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const contactCustomer = (lead: Lead, method: "phone" | "email") => {
    if (method === "phone") {
      window.open(`tel:${lead.customer_phone}`, '_blank');
    } else {
      window.open(`mailto:${lead.customer_email}`, '_blank');
    }
  };

  const updateStatus = async (leadId: string, status: string) => {
    try {
      await updateLeadStatus(leadId, status);
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert("Error updating lead status. Please try again.");
    }
  };

  const openNotesModal = (lead: Lead) => {
    setSelectedLead(lead);
    setNotes(lead.installer_notes || "");
    setShowNotesModal(true);
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    
    try {
      await updateLeadStatus(selectedLead.id, selectedLead.status, notes);
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, installer_notes: notes } : lead
      ));
      setShowNotesModal(false);
      setSelectedLead(null);
      setNotes("");
    } catch (error) {
      console.error('Error saving notes:', error);
      alert("Error saving notes. Please try again.");
    }
  };

  const filteredLeads = leads.filter(lead => {
    return filterStatus === "all" || lead.status === filterStatus;
  });

  const getStatusCounts = () => {
    const counts = { new: 0, contacted: 0, in_progress: 0, completed: 0, cancelled: 0 };
    leads.forEach(lead => {
      counts[lead.status as keyof typeof counts]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <InstallerRouteGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
        </div>
      </InstallerRouteGuard>
    );
  }

  return (
    <InstallerRouteGuard>
      <div className="pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Installation Leads</h1>
          <p className="text-gray-600 mt-1">
            Manage your installation requests and customer inquiries
          </p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => {
            const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
            const Icon = config.icon;
            return (
              <div key={status} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus !== "all" 
                ? "Try adjusting your filters to see more results."
                : "New installation requests will appear here."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              const statusConfig = STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {lead.project_type} Installation
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <div className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </div>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lead.customer_name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{lead.customer_phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Mail className="w-3 h-3" />
                            <span>{lead.customer_email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span>{lead.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{getTimeAgo(lead.created_at)}</span>
                          </div>
                          {lead.amount && (
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                              <DollarSign className="w-3 h-3" />
                              <span>{formatPrice(lead.amount)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-700">{lead.description}</p>
                      </div>
                      
                      {lead.installer_notes && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">Your Notes:</p>
                          <p className="text-sm text-gray-700">{lead.installer_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => contactCustomer(lead, "phone")}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                      <button
                        onClick={() => contactCustomer(lead, "email")}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                      <button
                        onClick={() => openNotesModal(lead)}
                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Notes
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      {lead.status !== "new" && (
                        <button
                          onClick={() => updateStatus(lead.id, "new")}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                        >
                          Mark New
                        </button>
                      )}
                      {lead.status !== "contacted" && (
                        <button
                          onClick={() => updateStatus(lead.id, "contacted")}
                          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {lead.status !== "in_progress" && (
                        <button
                          onClick={() => updateStatus(lead.id, "in_progress")}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {lead.status !== "completed" && (
                        <button
                          onClick={() => updateStatus(lead.id, "completed")}
                          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                        >
                          Mark Completed
                        </button>
                      )}
                      {lead.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(lead.id, "cancelled")}
                          className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                        >
                          Mark Cancelled
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Notes for {selectedLead.customer_name}
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                placeholder="Add your notes about this lead..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNotes}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstallerRouteGuard>
  );
} 