
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const LegalGuidelines: React.FC = () => {
  // Legal Review Guidelines - Comprehensive FTC Compliance
  const legalReviewGuidelines = [
    {
      section: "FTC §255.1 - Truth in Advertising",
      rules: [
        "✅ Avoid 'active users' → use 'beta testers' or 'registered users'",
        "✅ No unverified user count claims without backend logs",
        "✅ 'Elite' implies exclusivity but avoids false scarcity"
      ]
    },
    {
      section: "FTC §255.2 - Substantiation Required",
      rules: [
        "✅ All 'join X+ users' claims require backend signup verification",
        "✅ Accuracy percentages must cite controlled conditions",
        "✅ Performance claims need lab vs real-world distinction"
      ]
    },
    {
      section: "FTC §255.5 - Clear and Conspicuous Disclosures",
      rules: [
        "✅ Disclaimers must be adjacent to metrics (no fine print)",
        "✅ Beta-stage disclaimers prevent misleading expectations",
        "✅ Condition-dependent language for variable performance"
      ]
    }
  ];

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Comprehensive Legal Review Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {legalReviewGuidelines.map((guideline, index) => (
            <div key={index} className="border-l-4 border-l-yellow-400 pl-4">
              <h4 className="font-semibold text-yellow-800 mb-2">{guideline.section}</h4>
              <div className="space-y-1">
                {guideline.rules.map((rule, ruleIndex) => (
                  <p key={ruleIndex} className="text-sm text-yellow-700">{rule}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
          <div className="text-sm font-medium text-yellow-800 mb-2">Dynamic Counter Suggestions (FTC Compliant):</div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• "Join 500+ surfers on our beta waitlist!" (requires backend verification)</li>
            <li>• "1,200+ beta signups and counting" (with signup timestamp logs)</li>
            <li>• "Active development with 50+ verified beta testers" (verified user tracking)</li>
          </ul>
        </div>
        
        <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
          <div className="text-sm font-medium text-yellow-800 mb-2">Post-Launch Tooltip Ideas:</div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• "Active users verified by third-party analytics (Google Analytics)"</li>
            <li>• "User metrics independently audited monthly"</li>
            <li>• "Real-time user count updated every 15 minutes"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalGuidelines;
