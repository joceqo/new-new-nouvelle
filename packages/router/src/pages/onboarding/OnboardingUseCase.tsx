import { useState } from "react";
import { ArrowLeft, ChevronDown, Briefcase, Home, GraduationCap } from "lucide-react";
import { Button, IconWrapper } from "@nouvelle/ui";

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!onBack}
          className={`flex items-center gap-2 ${
            onBack ? "text-gray-600 hover:text-gray-900 cursor-pointer" : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Go back"
        >
          <IconWrapper icon={ArrowLeft} size="md" />
        </button>

        {/* Language Picker */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
            className="appearance-none bg-transparent border-none text-sm text-gray-700 pr-6 cursor-pointer focus:outline-none"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <IconWrapper
              icon={ChevronDown}
              size="sm"
              className="text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              How do you want to use Nouvelle?
            </h1>
            <p className="text-base text-gray-600">
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
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <IconWrapper
                        icon={Icon}
                        size="lg"
                        className={isSelected ? "text-blue-600" : "text-gray-600"}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">
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
