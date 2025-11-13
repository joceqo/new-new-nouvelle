# Component: InputOTP + InputOTPGroup + InputOTPSlot

Status: stable  
Intent: One-Time Password input component with automatic focus advancement, paste handling, and theme-integrated styling for authentication flows.

## Props Contract

```ts
export interface InputOTPProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
}
```

## Component Structure

```tsx
<InputOTP
  maxLength={6}
  value={otp}
  onChange={setOtp}
  autoFocus
/>
```

## Behavior Rules

- **Controlled component**: Value managed via `value` and `onChange` props
- **Numeric only**: Automatically filters non-digit input
- **Auto-advance**: Moves focus to next input when digit entered
- **Backspace navigation**: Moves to previous input when current is empty
- **Paste support**: Intelligently handles pasted OTP codes
  - Extracts digits from pasted text
  - Fills inputs from left to right
  - Focuses last filled input
- **Auto-focus**: Optional `autoFocus` prop focuses first input on mount
- **Ref forwarding**: Supports ref forwarding for first input

## Visual & Styling

### Container Layout

- **Display**: Uses `<Flex>` component
  - Alignment: `align="center"`
  - Gap: `gap="2"` (8px between inputs)

### Individual Input Fields

- **Size**: Square inputs for visual consistency
  - Width: `w-10` (40px)
  - Height: `h-10` (40px)
  
- **Typography**:
  - Font size: `text-lg` for easy reading
  - Font weight: `font-semibold`
  - Text alignment: `text-center`
  
- **Styling**:
  - Shape: `rounded-md`
  - Border: `border-2 border-[var(--color-border)]`
  - Background: `bg-[var(--color-bg-base)]`
  - Text color: `text-[var(--color-text-primary)]`
  
- **States**:
  - **Focus**: `focus:border-[var(--palette-blue-text)] focus:outline-none focus:ring-2 focus:ring-[var(--palette-blue-text)]/20`
  - **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-bg-muted)]`
  
- **Transitions**: `transition-all duration-150` for smooth state changes

## Theme Integration

### Colors (Light Mode)

```css
--color-bg-base: #FFFFFF;
--color-bg-muted: #F1F1EF;
--color-border: #E0E0E0;
--color-text-primary: #373530;
--palette-blue-text: #487CA5;
```

### Colors (Dark Mode)

```css
--color-bg-base: #191919;
--color-bg-muted: #252525;
--color-border: #444444;
--color-text-primary: #D4D4D4;
--palette-blue-text: #447ACB;
```

### Focus Ring Pattern

Focus state uses blue theme color with 20% opacity ring:
```css
focus:ring-2 focus:ring-[var(--palette-blue-text)]/20
```

## Accessibility

- **Input mode**: `inputMode="numeric"` shows numeric keyboard on mobile
- **Max length**: `maxLength={1}` per input prevents over-typing
- **Auto-focus**: Configurable via `autoFocus` prop
- **Keyboard navigation**: Backspace moves to previous input
- **Tab navigation**: Standard tab order through inputs
- **Screen readers**: Each input announced separately (consider adding aria-label)
- **Disabled state**: Properly indicated with opacity and cursor

## Dependencies

- `React` - Component framework, hooks, ref forwarding
- `@/lib/utils` - cn() utility for className merging
- `@/components/design_system/Layout/Flex` - Layout component

## Edge Cases

- **Paste handling**: Extracts only digits from clipboard
- **Over-length paste**: Truncates to maxLength
- **Partial fill**: Focuses last filled input, not last input
- **Empty backspace**: Navigates to previous input
- **First input backspace**: Stays on first input when empty
- **Ref forwarding**: Only first input receives forwarded ref
- **Multiple refs**: Uses internal refs array for focus management

## Implementation Details

### Paste Logic

```tsx
const handlePaste = (e: React.ClipboardEvent) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text");
  const digits = pastedData.replace(/\D/g, ""); // Extract digits only
  const otpValue = digits.slice(0, maxLength); // Truncate to max length
  onChange(otpValue);
  // Focus last filled input
  const targetIndex = Math.min(otpValue.length - 1, maxLength - 1);
  setTimeout(() => inputRefs.current[targetIndex]?.focus(), 0);
};
```

### Auto-Advance Logic

```tsx
onChange={(e) => {
  const newValue = e.target.value;
  if (!/^\d*$/.test(newValue)) return; // Digits only
  
  const newOtp = value.substring(0, index) + newValue + value.substring(index + 1);
  onChange(newOtp);
  
  // Auto-advance to next input
  if (newValue && index < maxLength - 1) {
    inputRefs.current[index + 1]?.focus();
  }
}}
```

### Backspace Navigation

```tsx
onKeyDown={(e) => {
  if (e.key === "Backspace") {
    if (!value[index] && index > 0) {
      // Current empty, go back
      inputRefs.current[index - 1]?.focus();
    }
  }
}}
```

## Usage Examples

### Basic OTP Input

```tsx
import { InputOTP } from "@/components/ui/input-otp";

const [otp, setOtp] = useState("");

return (
  <InputOTP
    maxLength={6}
    value={otp}
    onChange={setOtp}
    autoFocus
  />
);
```

### 4-Digit PIN

```tsx
const [pin, setPin] = useState("");

return (
  <div>
    <label className="block text-sm font-medium mb-2">
      Enter PIN
    </label>
    <InputOTP
      maxLength={4}
      value={pin}
      onChange={setPin}
    />
  </div>
);
```

### With Validation

```tsx
const [otp, setOtp] = useState("");
const [error, setError] = useState("");

const handleVerify = async () => {
  if (otp.length !== 6) {
    setError("Please enter all 6 digits");
    return;
  }
  
  try {
    await verifyOTP(otp);
  } catch (err) {
    setError("Invalid code. Please try again.");
    setOtp(""); // Clear on error
  }
};

return (
  <div>
    <InputOTP
      maxLength={6}
      value={otp}
      onChange={(val) => {
        setOtp(val);
        setError(""); // Clear error on input
      }}
      autoFocus
    />
    {error && (
      <p className="text-sm text-[var(--palette-red-text)] mt-2">
        {error}
      </p>
    )}
  </div>
);
```

### Disabled State

```tsx
<InputOTP
  maxLength={6}
  value={otp}
  onChange={setOtp}
  disabled
/>
```

## Performance Notes

- **Controlled inputs**: Re-renders on each keystroke (expected for controlled components)
- **Ref array**: Uses single array for all input refs
- **Timeout for focus**: Ensures state updates before focusing
- **Paste optimization**: Processes paste in single onChange call

## Testing Strategy

- **Digit entry**: Verify only digits accepted
- **Auto-advance**: Test focus moves to next input
- **Backspace navigation**: Test focus moves to previous input
- **Paste handling**: Test pasting full and partial codes
- **Auto-focus**: Verify first input receives focus when autoFocus={true}
- **Max length**: Verify cannot exceed maxLength
- **Disabled state**: Verify inputs disabled and styled correctly

## Future Improvements

- **Aria labels**: Add aria-label for each input (e.g., "Digit 1 of 6")
- **Error state**: Visual error styling variant
- **Success state**: Visual success styling when complete
- **Auto-submit**: Optional callback when all digits filled
- **Separator**: Optional separator between digit groups (e.g., 123-456)
- **Character support**: Option for alphanumeric codes
- **Masked input**: Option to hide digits (type="password")

## Design Patterns

### OTP Flow

1. User requests OTP (email/SMS)
2. InputOTP component displays
3. User enters or pastes code
4. Auto-advance provides smooth experience
5. Verify button enabled when complete
6. Show error or success feedback

### Mobile Optimization

- `inputMode="numeric"`: Shows number pad on mobile
- Large touch targets: 40px × 40px inputs
- Paste support: Essential for OTP from SMS
- Auto-focus: Keyboard appears immediately

## Best Practices

1. **Default to 6 digits**: Most OTPs are 6 digits
2. **Enable paste**: Critical for mobile SMS workflow
3. **Auto-focus first input**: Reduce friction
4. **Clear on error**: Reset inputs when verification fails
5. **Show length**: Visual feedback (6 inputs = 6 digits expected)
6. **Provide context**: Label indicating where code was sent
7. **Resend option**: Allow requesting new code

## Common Use Cases

- **Email verification**: 6-digit codes
- **2FA authentication**: 6-digit TOTP codes
- **Phone verification**: 4-6 digit SMS codes
- **PIN entry**: 4-digit PINs
- **Security codes**: 6-8 digit backup codes

Last updated: 2025-11-12
