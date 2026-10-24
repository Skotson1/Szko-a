import React from 'react';
import * as Icons from 'lucide-react';

interface SubjectIconProps {
  name: string;
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({ name, className = 'w-5 h-5' }) => {
  // @ts-expect-error Lucide icons indexed dynamically
  const IconComponent = Icons[name] || Icons.Book;
  return <IconComponent className={className} />;
};
