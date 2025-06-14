
import React from 'react';
import PremiumGate from '@/components/PremiumGate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WavePoolBooking from '@/components/WavePoolBooking';
import BookingMarketplace from '@/components/BookingMarketplace';

const BookSessionsPage = () => {
  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 h-full">
      <PremiumGate>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ocean-dark mb-2">Book Surf Sessions</h1>
            <p className="text-gray-600">Reserve your perfect wave experience at wave pools and natural surf spots</p>
          </div>

          <Tabs defaultValue="wave-pools" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="wave-pools">Wave Pools</TabsTrigger>
              <TabsTrigger value="natural-spots">Natural Spots</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wave-pools">
              <WavePoolBooking />
            </TabsContent>
            
            <TabsContent value="natural-spots">
              <BookingMarketplace 
                spotId="pipeline" 
                spotName="Pipeline, Hawaii" 
              />
            </TabsContent>
          </Tabs>
        </div>
      </PremiumGate>
    </div>
  );
};

export default BookSessionsPage;
