import { useState } from "react";
import { ArrowLeft, ChevronDown, Briefcase, Home, GraduationCap } from "lucide-react";
import { Button } from "@nouvelle/ui";

type UseCase = "work" | "personal" | "school";

interface UseCaseOption {
  id: UseCase;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface OnboardingUseCaseProps {
  onNext: (useCase: UseCase) => void;
  onBack?: () => void;
}

const useCaseOptions: UseCaseOption[] = [
  {
    id: "work",
    icon: Briefcase,
    title: "For work",
    description: "Track projects, company goals, meeting notes",
  },
  {
    id: "personal",
    icon: Home,
    title: "For personal life",
    description: "Write better, think more clearly, stay organized",
  },
  {
    id: "school",
    icon: GraduationCap,
    title: "For school",
    description: "Keep notes, research, and tasks in one place",
  },
];

export function OnboardingUseCase({ onNext, onBack }: OnboardingUseCaseProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const handleContinue = () => {
    if (selectedUseCase) {
      onNext(selectedUseCase);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!onBack}
          className={`flex items-center gap-2 ${
            onBack ? "text-gray-400 hover:text-white" : "text-gray-700 cursor-not-allowed"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Language Picker */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
            className="appearance-none bg-transparent border-none text-sm text-gray-300 pr-6 cursor-pointer focus:outline-none"
          >
            <option value="en" className="bg-gray-900">English (US)</option>
            <option value="fr" className="bg-gray-900">Français</option>
          </select>
          <ChevronDown className="h-4 w-4 text-gray-300 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-white mb-3">
              How do you want to use Nouvelle?
            </h1>
            <p className="text-base text-gray-400">
              This helps customize your experience
            </p>
          </div>

          {/* Use Case Options */}
          <div className="space-y-4 mb-8">
            {useCaseOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedUseCase === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedUseCase(option.id)}
                  className={`w-full p-6 rounded-lg border transition-all text-left ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? "bg-blue-500/20" : "bg-gray-700/50"
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isSelected ? "text-blue-400" : "text-gray-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedUseCase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
