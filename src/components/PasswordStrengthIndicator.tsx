import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
  show?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  show = true,
}) => {
  if (!show || !password) {
    return null;
  }

  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return Math.min(strength, 5);
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
  ];
  const textColors = [
    'text-red-600',
    'text-orange-600',
    'text-yellow-600',
    'text-lime-600',
    'text-green-600',
    'text-emerald-600',
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${strengthColors[strength]}`}
            style={{
              width: `${((strength + 1) / 6) * 100}%`,
            }}
          />
        </div>
        <span className={`text-xs font-semibold ${textColors[strength]}`}>
          {strengthLabels[strength]}
        </span>
      </div>
      <ul className="text-xs text-gray-600 space-y-1">
        <li className={password.length >= 8 ? 'text-green-600' : ''}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
          {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
          {/[0-9]/.test(password) ? '✓' : '○'} Number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>
          {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} Special character
        </li>
      </ul>
    </div>
  );
};
