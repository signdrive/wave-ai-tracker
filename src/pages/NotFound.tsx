
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Waves } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Optional: Send analytics event for 404 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_not_found', {
        page_path: location.pathname,
        page_title: '404 - Page Not Found'
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean/5 to-sand/20 px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Waves className="w-16 h-16 text-ocean-dark animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-bold text-ocean-dark mb-2">404</CardTitle>
          <p className="text-xl text-gray-600">Oops! Wave not found</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">
            The page you're looking for seems to have drifted away with the tide.
          </p>
          <p className="text-sm text-gray-400 font-mono bg-gray-50 p-2 rounded">
            Path: {location.pathname}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-ocean hover:bg-ocean-dark">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-400">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
