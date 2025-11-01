import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { OnboardingUseCase } from "./OnboardingUseCase";
import { OnboardingForm } from "./OnboardingForm";
import { OnboardingInterests } from "./OnboardingInterests";

type UseCase = "work" | "personal" | "school";
type OnboardingStep = "profile" | "useCase" | "interests";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  const handleProfileComplete = () => {
    setCurrentStep("useCase");
  };

  const handleUseCaseSelect = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setCurrentStep("interests");
  };

  const handleInterestsComplete = (_interests: string[]) => {
    // TODO: Send interests to backend
    // Generate random page ID similar to Notion's format
    const pageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    navigate({ to: `/getting-started/${pageId}` });
  };

  const handleBackToProfile = () => {
    setCurrentStep("profile");
  };

  const handleBackToUseCase = () => {
    setCurrentStep("useCase");
  };

  if (currentStep === "profile") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <OnboardingForm onComplete={handleProfileComplete} selectedUseCase={selectedUseCase} />
      </div>
    );
  }

  if (currentStep === "useCase") {
    return <OnboardingUseCase onNext={handleUseCaseSelect} onBack={handleBackToProfile} />;
  }

  return <OnboardingInterests onNext={handleInterestsComplete} onBack={handleBackToUseCase} />;
}
