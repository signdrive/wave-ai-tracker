import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, Plane, Cloud, Crown, ArrowRight } from 'lucide-react';

const MonetizationShowcase = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Surf Gear Marketplace',
      description: 'Buy and sell surf equipment with the community',
      link: '/marketplace',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: GraduationCap,
      title: 'Surf Lessons',
      description: 'Learn from certified instructors worldwide',
      link: '/lessons',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Plane,
      title: 'Travel Packages',
      description: 'Curated surf trips to epic destinations',
      link: '/travel',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Cloud,
      title: 'Premium Weather',
      description: 'Extended forecasts with advanced analytics',
      link: '/premium-weather',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      premium: true
    }
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Surf Ecosystem
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need for your surf journey in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                    {feature.premium && (
                      <Crown className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <CardTitle className="text-xl flex items-center justify-center gap-2">
                    {feature.title}
                    {feature.premium && <Crown className="w-4 h-4 text-yellow-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {feature.description}
                  </p>
                  <Link to={feature.link}>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-ocean group-hover:text-white group-hover:border-ocean transition-colors"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/premium">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MonetizationShowcase;