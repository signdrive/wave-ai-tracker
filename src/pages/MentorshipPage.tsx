
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MentorshipRouter from '@/components/mentorship/MentorshipRouter';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from '@/components/AuthDialog';

const MentorshipPage: React.FC = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = React.useState(!user);

  React.useEffect(() => {
    setShowAuthDialog(!user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        {user ? (
          <MentorshipRouter />
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Surf Mentorship Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Connect with expert surf mentors or share your knowledge with aspiring surfers
            </p>
            <button
              onClick={() => setShowAuthDialog(true)}
              className="bg-ocean hover:bg-ocean-dark text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              Get Started
            </button>
          </div>
        )}
      </main>
      <Footer />
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};

export default MentorshipPage;
