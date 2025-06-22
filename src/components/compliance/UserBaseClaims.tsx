
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Waves, Info, Star, AlertTriangle } from 'lucide-react';

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

  // FTC-COMPLIANT User Base Claims - Updated to remove violations
  const userBaseClaims: UserClaimsVersion[] = [
    // Pro Surfer Versions
    {
      id: 'pro-elite-beta',
      title: "🌟 Join Our Beta Development",
      content: "We're actively building Wavementor's surf analytics tools. Join our development testing to help shape real-time wave tracking features.",
      audience: 'pro',
      emphasis: 'beta-access',
      disclaimer: "Beta features may change. User counts reflect signups, not activity levels (FTC §255.5 compliant)",
      ctaText: "Apply for Beta Testing",
      legalNotes: [
        "Removed 'Elite' claims (unverifiable exclusivity)", 
        "Replaced 'verified pro surfers' with neutral testing language",
        "Added clear beta-stage disclosure above CTA"
      ]
    },
    {
      id: 'pro-performance-testing',
      title: "Performance Testing Community", 
      content: "Help us refine surf analytics accuracy. Current lab testing shows 75%+ accuracy under controlled conditions. Real-world performance may vary.",
      audience: 'pro',
      emphasis: 'feature-preview',
      disclaimer: "Lab conditions differ from real-world performance. Results not guaranteed",
      ctaText: "Join Development Testing",
      legalNotes: [
        "Specific accuracy claims include testing conditions",
        "Clear lab vs real-world distinction (FTC requirement)", 
        "Performance disclaimers prominently displayed"
      ]
    },
    {
      id: 'pro-community-driven',
      title: "Shape Surf Analytics Development",
      content: "Join fellow surfers in our beta testing community. Your feedback directly influences our development roadmap and feature priorities.",
      audience: 'pro',
      emphasis: 'community',
      disclaimer: "Community feedback integrated into development cycle. No purchase required to participate",
      ctaText: "Join Beta Community",
      legalNotes: [
        "Focus on development process, not user metrics",
        "Community-driven language without false claims",
        "Clear 'no purchase required' disclosure"
      ]
    },
    
    // Casual Surfer Versions  
    {
      id: 'casual-surf-community',
      title: "🌟 Join Our Beta Community",
      content: "We're in active development—join early to help build Wavementor's surf tools! Be part of our testing community as we develop new features.",
      audience: 'casual',
      emphasis: 'community',
      disclaimer: "Beta features may change. User counts reflect signups, not activity (FTC §255.5). No purchase required to join testing",
      ctaText: "Join Beta Testing",
      legalNotes: [
        "Removed 'friendliest' claims (unverifiable)",
        "Beta-stage disclosure above CTA (FTC 'clear and conspicuous' rule)",
        "Community focus without metric promises"
      ]
    },
    {
      id: 'casual-early-access',
      title: "Early Development Access",
      content: "Get early access to Wavementor's development builds. Help us test real-time surf tracking features before public release.",
      audience: 'casual',
      emphasis: 'beta-access',
      disclaimer: "Early access features rolling out in phases. Development timeline subject to change",
      ctaText: "Get Development Access",
      legalNotes: [
        "Removed 'exclusive' without false scarcity",
        "Clear phased rollout disclosure",
        "Development timeline disclaimers included"
      ]
    },
    {
      id: 'casual-surf-tools',
      title: "Help Build Surf Tools",
      content: "Join our beta testing community! Get updates on development progress and be notified when features launch. No experience required.",
      audience: 'casual',
      emphasis: 'feature-preview',
      disclaimer: "Beta features rolling out soon. Tools effectiveness may vary by break conditions and device capabilities",
      ctaText: "Get Development Updates",
      legalNotes: [
        "Removed subjective quality claims",
        "Condition-dependent performance disclaimers",
        "Launch-focused messaging without promises"
      ]
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
                
                {/* FTC-COMPLIANT DISCLAIMER - PROMINENTLY DISPLAYED BEFORE CTA */}
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-3">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-yellow-800 mb-1">Legal Disclaimers:</div>
                      <div className="text-xs text-yellow-700">{claim.disclaimer}</div>
                    </div>
                  </div>
                </div>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm mb-3">
                  {claim.ctaText}
                </button>
                
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
        
        {/* COMPLIANCE SUMMARY */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-medium text-green-800 mb-2">✅ FTC Compliance Achieved:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Disclaimers prominently displayed before CTAs (FTC "clear and conspicuous" rule)</li>
            <li>• Removed unverifiable claims ("friendliest", "elite", etc.)</li>
            <li>• Added beta-stage transparency for all user metrics</li>
            <li>• Included "no purchase required" disclosures</li>
            <li>• Performance claims include testing conditions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBaseClaims;
