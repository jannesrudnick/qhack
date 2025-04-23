import IconButton from '@/components/icon-button';
import { EllipsisVertical, LucideMap, User2 } from 'lucide-react';

function Header() {
  return (
    <>
      <div className="flex justify-between">
        <div className="h-14 bg-white rounded-full px-4 flex items-center justify-center">
          Unser<b>Logo</b>
        </div>
        <div className="flex gap-4 items-center">
          <IconButton icon={<LucideMap />} />
          <IconButton icon={<User2 />} />
          <IconButton icon={<EllipsisVertical />} />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center my-6">
          <div className="flex flex-col">
            <p className="text-gray-500">Comprehensive Insights</p>
            <p className="font-bold">Executive Overview</p>
          </div>
          <div className="ml-auto"></div>
        </div>
        <div className="ml-auto"></div>
      </div>
    </>
  );
}

export default Header;
