import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputOTPProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ maxLength, value, onChange, disabled, className, autoFocus, ...props }, ref) => {
    // Create refs array to track all inputs
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Handle autoFocus properly using useEffect
    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus]);

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text");
      // Extract only digits from pasted content
      const digits = pastedData.replace(/\D/g, "");

      if (digits.length > 0) {
        // Take only the required number of digits
        const otpValue = digits.slice(0, maxLength);
        onChange(otpValue);

        // Focus the last filled input or the last input if all are filled
        const targetIndex = Math.min(otpValue.length - 1, maxLength - 1);
        // Use setTimeout to ensure state has updated before focusing
        setTimeout(() => {
          inputRefs.current[targetIndex]?.focus();
        }, 0);
      }
    };

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {Array.from({ length: maxLength }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
              // Forward ref for the first input
              if (index === 0 && typeof ref === "function") {
                ref(el);
              } else if (index === 0 && ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              if (!/^\d*$/.test(newValue)) return;

              const newOtp =
                value.substring(0, index) +
                newValue +
                value.substring(index + 1);
              onChange(newOtp);

              // Auto-focus next input
              if (newValue && index < maxLength - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
            onKeyDown={(e) => {
              // Handle backspace
              if (e.key === "Backspace") {
                if (!value[index] && index > 0) {
                  // If current input is empty, go to previous
                  inputRefs.current[index - 1]?.focus();
                } else if (value[index]) {
                  // If current input has value, clear it
                  const newOtp =
                    value.substring(0, index) + value.substring(index + 1);
                  onChange(newOtp);
                }
              }
            }}
            onClick={() => {
              // Ensure input is focused when clicked
              inputRefs.current[index]?.focus();
            }}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "h-12 w-12 rounded-md border border-input bg-transparent text-center text-lg font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
        ))}
      </div>
    );
  }
);
InputOTP.displayName = "InputOTP";

// For compatibility with the original component structure
const InputOTPGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex items-center gap-2">{children}</div>;

const InputOTPSlot: React.FC<{ index: number }> = () => null; // Not used in our implementation

export { InputOTP, InputOTPGroup, InputOTPSlot };
