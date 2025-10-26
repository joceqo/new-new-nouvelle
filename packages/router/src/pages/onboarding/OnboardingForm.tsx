import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { Button, Input, Label } from "@nouvelle/ui";
import { Ghost, Upload, ArrowLeft, ChevronDown } from "lucide-react";

interface OnboardingFormProps {
  onBack?: () => void;
  onComplete?: () => void;
  selectedUseCase?: string | null;
}

export function OnboardingForm({ onBack, onComplete, selectedUseCase: _selectedUseCase }: OnboardingFormProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  // Set default name from email
  useEffect(() => {
    if (user?.email && !name) {
      const emailUsername = user.email.split("@")[0];
      setName(emailUsername);
    }
  }, [user?.email]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Send profile data to backend
      // const formData = new FormData();
      // formData.append('name', name);
      // formData.append('useCase', _selectedUseCase || '');
      // if (avatarFile) formData.append('avatar', avatarFile);

      // For now, just call onComplete to proceed to next step
      onComplete?.();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col flex-1">
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
          <ArrowLeft className="h-5 w-5" />
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
          <ChevronDown className="h-4 w-4 text-gray-700 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Create a profile
            </h1>
            <p className="text-sm text-gray-600">
              This is how you'll appear in Notion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <Ghost className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload avatar"
              />

              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Add a photo
              </button>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-700">
                Enter your name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!name.trim() || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
