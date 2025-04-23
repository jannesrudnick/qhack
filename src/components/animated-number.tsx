'use client';
import NumberFlow from '@number-flow/react';

type Props = {
  value: number;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

export function AnimatedNumber({
  value,
  currency,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: Props) {
  if (currency) {
    return (
      <NumberFlow
        value={value}
        transformTiming={{ duration: 1500, easing: 'ease-in-out' }}
        format={{
          style: 'currency',
          currency: currency ?? undefined,
          minimumFractionDigits,
          maximumFractionDigits,
        }}
        willChange
        continuous
      />
    );
  }

  return <NumberFlow value={value} willChange />;
}
