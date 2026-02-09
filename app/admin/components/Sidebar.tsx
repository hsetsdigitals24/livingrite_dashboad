import { BarChart3, Calendar, DollarSign, MessageSquare, Settings, TrendingUp, Users } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}
 
const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => { 
  return (
         <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
                 <nav className="p-6 space-y-2">
                   {[
                     { label: "Dashboard", icon: BarChart3, id: "overview" },
                     { label: "Consultations", icon: Calendar, id: "consultations" },
                     {label: "Patients", icon: Users, id: "patients"},
                     { label: "Clients", icon: Users, id: "clients" },
                     { label: "Caregivers", icon: Users, id: "caregivers" },
                     { label: "Revenue", icon: DollarSign, id: "revenue" },
                     { label: "Analytics", icon: TrendingUp, id: "analytics" },
                     { label: "Tickets", icon: MessageSquare, id: "tickets" },
                     { label: "Settings", icon: Settings, id: "settings" },
                   ].map((item) => (
                     <button
                       key={item.id}
                       onClick={() => setActiveSection(item.id)}
                       className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                         activeSection === item.id
                           ? "bg-primary text-white shadow-md"
                           : "text-gray-700 hover:bg-gray-100"
                       }`}
                     >
                       <item.icon className="w-5 h-5" />
                       <span className="font-medium">{item.label}</span>
                     </button>
                   ))}
                 </nav>
               </aside>
    )
}

export default Sidebar;