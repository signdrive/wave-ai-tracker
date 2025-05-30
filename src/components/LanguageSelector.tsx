
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {availableLanguages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeLanguage(lang.code)}
            className="text-xs"
          >
            {lang.nativeName}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage}>
      <SelectTrigger className={`w-40 ${className}`}>
        <div className="flex items-center">
          <Languages className="w-4 h-4 mr-2" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center">
              <span className="font-medium mr-2">{lang.nativeName}</span>
              <span className="text-sm text-gray-500">({lang.name})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
