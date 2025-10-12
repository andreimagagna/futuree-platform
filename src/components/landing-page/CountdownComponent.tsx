import React, { useState, useEffect } from 'react';
import { CountdownProps } from '@/types/LandingPage';

interface CountdownComponentProps {
  props: CountdownProps;
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function CountdownComponent({ props, styles, isEditing, onEdit }: CountdownComponentProps) {
  const { title, targetDate, expiredMessage } = props;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired && !isEditing) {
    return (
      <section style={styles} className="text-center">
        <div className="container mx-auto px-4">
          <p className="text-2xl font-bold">
            {expiredMessage || 'O tempo acabou!'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className="relative"
    >
      <div className="container mx-auto px-4 text-center">
        {title && (
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            {title}
          </h3>
        )}

        <div className="flex justify-center gap-4 md:gap-8">
          {[
            { label: 'Dias', value: timeLeft.days },
            { label: 'Horas', value: timeLeft.hours },
            { label: 'Minutos', value: timeLeft.minutes },
            { label: 'Segundos', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px] shadow-lg">
                <div className="text-3xl md:text-5xl font-bold mb-1">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm opacity-80 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Countdown
          </span>
        </div>
      )}
    </section>
  );
}
