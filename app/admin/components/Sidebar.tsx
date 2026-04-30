import { BarChart3, Calendar, DollarSign, MessageSquare, Settings, TrendingUp, Users, GitBranch, FileText, BookOpen, ShieldCheck } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const menuItems = [
    { label: "Dashboard", icon: BarChart3, id: "overview" },
    { label: "Pipeline", icon: GitBranch, id: "pipeline" },
    { label: "Consultations", icon: Calendar, id: "consultations" },
    { label: "Patients", icon: Users, id: "patients" },
    { label: "Clients", icon: Users, id: "clients" },
    { label: "Caregivers", icon: Users, id: "caregivers" },
    { label: "Allow List", icon: ShieldCheck, id: "caregiver-allow-list" },
    { label: "Invoices", icon: FileText, id: "invoices" },
    { label: "Reports", icon: TrendingUp, id: "reports" },
    { label: "Tickets", icon: MessageSquare, id: "tickets" },
    // { label: "Case Studies", icon: BookOpen, id: "case-studies" },
    { label: "Settings", icon: Settings, id: "settings" },
  ];

  const handleItemClick = (id: string) => {
    setActiveSection(id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
        <nav className="p-4 lg:p-6 space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full cursor-pointer flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all text-sm lg:text-base ${
                activeSection === item.id
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed md:hidden left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-30 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;