import { motion } from "framer-motion";
import { BookOpen, Home, Trophy, Lightbulb } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  /** Sits below Cognizo hub tabs when embedded in the main app */
  embed?: boolean;
}

const Navigation = ({ activeSection, onNavigate, embed }: NavigationProps) => {
  const navItems = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "explore", label: "Jelajahi", icon: Lightbulb },
    { id: "lessons", label: "Pelajaran", icon: BookOpen },
    { id: "quiz", label: "Latihan", icon: Trophy },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border ${
        embed ? "top-24" : "top-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">π</span>
            </div>
            <span className="font-bold text-xl text-foreground">
              Pecahan<span className="text-primary">Fun</span>
            </span>
          </motion.div>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
