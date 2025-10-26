import { useState } from "react";
import { ArrowLeft, ChevronDown, Check, List, Target, Briefcase, DollarSign, Book, Globe, Plane, Palette, TrendingUp, UtensilsCrossed } from "lucide-react";
import { Button } from "@nouvelle/ui";

interface Interest {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface OnboardingInterestsProps {
  onNext: (selectedInterests: string[]) => void;
  onBack?: () => void;
}

const interests: Interest[] = [
  { id: "habit-tracking", icon: Check, label: "Habit tracking" },
  { id: "todo-list", icon: List, label: "To-do list" },
  { id: "project-tracking", icon: Target, label: "Project tracking" },
  { id: "personal-finance", icon: DollarSign, label: "Personal finance" },
  { id: "books-media", icon: Book, label: "Books and media" },
  { id: "site-blog", icon: Globe, label: "Site or blog" },
  { id: "travel", icon: Plane, label: "Travel" },
  { id: "hobbies", icon: Palette, label: "Hobbies" },
  { id: "career-building", icon: TrendingUp, label: "Career building" },
  { id: "food-nutrition", icon: UtensilsCrossed, label: "Food & nutrition" },
];

export function OnboardingInterests({ onNext, onBack }: OnboardingInterestsProps) {
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    onNext(Array.from(selectedInterests));
  };

  const handleSkip = () => {
    onNext([]);
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
      <div className="flex-1 flex items-start justify-center px-6 pt-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">
              What's on your mind?
            </h1>
            <p className="text-base text-gray-400">
              Select as many as you want.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedInterests.size} selected
            </p>
          </div>

          {/* Interests Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {interests.map((interest) => {
              const Icon = interest.icon;
              const isSelected = selectedInterests.has(interest.id);

              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-lg border transition-all text-left flex items-center gap-3 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    isSelected ? "text-blue-400" : "text-gray-400"
                  }`} />
                  <span className={`text-sm font-medium ${
                    isSelected ? "text-white" : "text-gray-300"
                  }`}>
                    {interest.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
            </Button>
            <button
              onClick={handleSkip}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
