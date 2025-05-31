
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RoleGateway from "@/components/RoleGateway";
import EnhancedSurfInterface from "@/components/EnhancedSurfInterface";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Main content grid preserving existing Wave AI functionality */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wave AI Tracker - spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <EnhancedSurfInterface />
          </div>
          
          {/* Role-based gateway - spans 1 column */}
          <RoleGateway />
        </div>
      </div>
    </div>
  );
};

export default Index;
