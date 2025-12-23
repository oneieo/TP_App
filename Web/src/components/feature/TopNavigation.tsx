
import { ReactNode } from 'react';

interface TopNavigationProps {
  title?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  showBorder?: boolean;
}

export default function TopNavigation({
  title,
  leftAction,
  rightAction,
  showBorder = true
}: TopNavigationProps) {
  return (
    <div className={`fixed top-0 left-0 right-0 bg-white z-50 safe-area-pt ${showBorder ? 'border-b border-gray-200' : ''}`}>
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex-1 flex justify-start">
          {leftAction}
        </div>
        
        {title && (
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-sf font-semibold text-text truncate">{title}</h1>
          </div>
        )}
        
        <div className="flex-1 flex justify-end">
          {rightAction}
        </div>
      </div>
    </div>
  );
}
