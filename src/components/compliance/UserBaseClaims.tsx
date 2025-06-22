
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Waves, Info, Star } from 'lucide-react';

interface UserClaimsVersion {
  id: string;
  title: string;
  content: string;
  audience: 'pro' | 'casual';
  emphasis: 'community' | 'beta-access' | 'feature-preview';
  disclaimer: string;
  ctaText: string;
  legalNotes: string[];
}

const UserBaseClaims: React.FC = () => {
  const [selectedAudience, setSelectedAudience] = useState<'pro' | 'casual'>('casual');
  const [selectedEmphasis, setSelectedEmphasis] = useState<'community' | 'beta-access' | 'feature-preview'>('community');

  // Comprehensive FTC-Compliant User Base Claims
  const userBaseClaims: UserClaimsVersion[] = [
    // Pro Surfer Versions
    {
      id: 'pro-elite-beta',
      title: "Elite Beta Access",
      content: "Join verified pro surfers testing real-time wave analytics. Help us refine competitive-grade tracking with limited beta access.",
      audience: 'pro',
      emphasis: 'beta-access',
      disclaimer: "Beta metrics pending third-party validation (FTC §255.1 compliant)",
      ctaText: "Apply for Beta Access",
      legalNotes: ["Uses 'verified' with backend validation", "Avoids false scarcity claims", "Third-party validation pending"]
    },
    {
      id: 'pro-performance-testing',
      title: "Performance-Driven Testing", 
      content: "Work with Wavementor's dev team to fine-tune pro-level analytics. Data accuracy: 75%+ in controlled lab conditions.",
      audience: 'pro',
      emphasis: 'feature-preview',
      disclaimer: "Lab conditions may vary from real-world performance",
      ctaText: "Join Dev Testing",
      legalNotes: ["Specific accuracy claims with conditions", "Lab vs real-world distinction", "Performance data verified"]
    },
    {
      id: 'pro-community-driven',
      title: "Competitive Edge Development",
      content: "Shape the future of surf analytics with fellow competitive surfers. Your feedback drives our AI training algorithms.",
      audience: 'pro',
      emphasis: 'community',
      disclaimer: "Community feedback integrated into beta development cycle",
      ctaText: "Shape the Platform",
      legalNotes: ["Focus on development process", "Community-driven approach", "No user count claims"]
    },
    
    // Casual Surfer Versions  
    {
      id: 'casual-surf-tribe',
      title: "Your Surf Tribe Awaits",
      content: "We're building Wavementor with surfers like you! Join our beta community to shape the friendliest surf app out there.",
      audience: 'casual',
      emphasis: 'community',
      disclaimer: "Community features in active development",
      ctaText: "Join the Tribe",
      legalNotes: ["Community focus without metrics", "Aspirational language", "Development transparency"]
    },
    {
      id: 'casual-early-access',
      title: "Be Among the First",
      content: "Ride the Wavementor wave! Get exclusive early access as we refine real-time surf tracking for weekend warriors.",
      audience: 'casual',
      emphasis: 'beta-access',
      disclaimer: "Early access features rolling out in phases",
      ctaText: "Get Early Access",
      legalNotes: ["Exclusive without false scarcity", "Phased rollout disclosure", "Target audience specific"]
    },
    {
      id: 'casual-surf-smarter',
      title: "Surf Smarter Community",
      content: "Beta surfers are learning with Wavementor! Get notified at launch—no wipeouts required. Building the friendliest surf app out there.",
      audience: 'casual',
      emphasis: 'feature-preview',
      disclaimer: "Beta features rolling out soon. Tools may vary by break conditions",
      ctaText: "Get Launch Updates",
      legalNotes: ["Friendly tone without metrics", "Condition-dependent disclaimers", "Launch-focused messaging"]
    }
  ];

  // Filter claims by current audience and emphasis
  const getCurrentClaims = () => {
    return userBaseClaims.filter(claim => 
      claim.audience === selectedAudience && claim.emphasis === selectedEmphasis
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            FTC-Compliant User Base Claims
          </span>
          <div className="flex gap-2">
            {/* Audience Toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedAudience('casual')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedAudience === 'casual' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Waves className="w-4 h-4 inline mr-1" />
                Casual
              </button>
              <button
                onClick={() => setSelectedAudience('pro')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedAudience === 'pro' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                🏄‍♂️ Pro
              </button>
            </div>
            
            {/* Emphasis Toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedEmphasis('community')}
                className={`px-2 py-1 rounded text-xs ${
                  selectedEmphasis === 'community' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Community
              </button>
              <button
                onClick={() => setSelectedEmphasis('beta-access')}
                className={`px-2 py-1 rounded text-xs ${
                  selectedEmphasis === 'beta-access' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Beta Access
              </button>
              <button
                onClick={() => setSelectedEmphasis('feature-preview')}
                className={`px-2 py-1 rounded text-xs ${
                  selectedEmphasis === 'feature-preview' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Features
              </button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {getCurrentClaims().map((claim) => (
            <Card key={claim.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg">{claim.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {claim.emphasis.replace('-', ' ')}
                    </Badge>
                    {claim.audience === 'pro' && <Star className="w-4 h-4 text-orange-500" />}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{claim.content}</p>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm mb-3">
                  {claim.ctaText}
                </button>
                
                <div className="bg-blue-50 p-3 rounded mb-3">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-blue-800 mb-1">Legal Disclaimer:</div>
                      <div className="text-xs text-blue-700">{claim.disclaimer}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs font-medium text-gray-700 mb-1">Legal Review Notes:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {claim.legalNotes.map((note, noteIndex) => (
                      <li key={noteIndex}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBaseClaims;
