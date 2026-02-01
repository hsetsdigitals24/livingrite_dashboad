

interface SidebarProps {
  navigationItems: any[];
  setActiveSection: (section: string) => void;
  activeSection: string;
  name: string;
}


const Sidebar = (props: SidebarProps) => {
  const { navigationItems, setActiveSection, activeSection, name } = props;
  return (
        <div className="sticky top-[8%] inset-y-0 h-full w-64 bg-slate-700 shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-100/20">
            {/* <h1 className="text-xl font-bold text-primary">LivingRite Care</h1> */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.href)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === item.href
                    ? "bg-secondary text-white"
                    : "text-white hover:text-gray-500 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {name?.charAt(0) || "U"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {name}
                </p>
                {/* <p className="text-xs text-gray-500">Premium Client</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Sidebar;