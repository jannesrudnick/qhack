import { ReactNode } from 'react';

export const IconButton =({ icon }: { icon: ReactNode }) => {
  return (
    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-main hover:text-white cursor-pointer transition-all">
      {icon}
    </div>
  );
}
