
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Waves } from 'lucide-react';

interface VoiceCommandProps {
  onSpotQuery: (spotName: string) => void;
  onConditionCheck: (location: string) => void;
  onBookingRequest: (service: string) => void;
}

const VoiceCommandSystem: React.FC<VoiceCommandProps> = ({
  onSpotQuery,
  onConditionCheck,
  onBookingRequest
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setLastCommand(transcript);
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);

    // Spot condition queries
    if (command.includes('conditions at') || command.includes('waves at')) {
      const spotMatch = command.match(/(?:conditions at|waves at) (.+?)(?:\?|$)/);
      if (spotMatch) {
        onConditionCheck(spotMatch[1].trim());
        speak(`Checking surf conditions at ${spotMatch[1].trim()}`);
      }
    }
    
    // Booking requests
    else if (command.includes('book') || command.includes('rent')) {
      if (command.includes('lesson') || command.includes('instructor')) {
        onBookingRequest('lesson');
        speak('Opening surf lesson booking');
      } else if (command.includes('board') || command.includes('surfboard')) {
        onBookingRequest('board');
        speak('Opening surfboard rental');
      } else if (command.includes('wetsuit')) {
        onBookingRequest('wetsuit');
        speak('Opening wetsuit rental');
      }
    }
    
    // General queries
    else if (command.includes('best spots') || command.includes('good waves')) {
      speak('Showing the best surf spots with current conditions');
      onSpotQuery('best');
    }
    
    // Weather check
    else if (command.includes('weather') || command.includes('wind')) {
      speak('Checking current weather and wind conditions');
    }
    
    else {
      speak('Sorry, I didn\'t understand that command. Try asking about conditions, booking services, or finding spots.');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <MicOff className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Voice commands not supported in this browser</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-ocean/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Volume2 className="w-5 h-5 mr-2 text-ocean" />
          Wave AI Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`w-16 h-16 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-ocean hover:bg-ocean-dark'
            }`}
          >
            {isListening ? (
              <Mic className="w-8 h-8 text-white" />
            ) : (
              <MicOff className="w-8 h-8 text-white" />
            )}
          </Button>
          
          <div className="mt-3">
            <Badge variant={isListening ? "destructive" : "outline"}>
              {isListening ? 'Listening...' : 'Tap to speak'}
            </Badge>
          </div>
        </div>

        {lastCommand && (
          <div className="bg-ocean/5 p-3 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Last command:</strong> "{lastCommand}"
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Try saying:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• "What are conditions at Malibu?"</p>
            <p>• "Book a surf lesson"</p>
            <p>• "Rent a surfboard"</p>
            <p>• "Show me the best spots"</p>
            <p>• "Check the weather"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommandSystem;
