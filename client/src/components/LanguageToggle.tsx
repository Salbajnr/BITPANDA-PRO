import { useLanguage, supportedLanguages, type Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Globe, Check } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  
  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
        >
          <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="sr-only">{t('settings.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900"
      >
        <div className="px-2 py-1.5 text-sm font-semibold text-green-700 dark:text-green-300">
          {t('settings.language')}
        </div>
        <div className="h-px bg-green-100 dark:bg-green-900 my-1" />
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950 transition-colors ${
              language === lang.code 
                ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <span className="font-medium">{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </DropdownMenuItem>
        ))}
        <div className="h-px bg-green-100 dark:bg-green-900 my-1" />
        <div className="px-2 py-1.5">
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs"
          >
            {currentLanguage?.flag} {currentLanguage?.name}
          </Badge>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}