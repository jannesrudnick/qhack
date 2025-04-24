interface Props {
  displayMode: 'overview' | 'temperature' | 'incidents';
  setDisplayMode: (v: 'overview' | 'temperature' | 'incidents') => void;
}

const modes = ['overview', 'temperature', 'incidents'] as const;

function NavigationPill({ displayMode, setDisplayMode }: Props) {
  return (
    <div className="bg-white rounded-full p-1.5 flex gap-1 cursor-pointer">
      {modes.map((mode) => (
        <div
          key={mode}
          className={`${
            displayMode === mode ? 'bg-[#E8F15C] text-black' : 'bg-white text-gray-500'
          } rounded-full px-3 py-2 cursor-pointer capitalize`}
          onClick={() => setDisplayMode(mode)}
        >
          {mode}
        </div>
      ))}
    </div>
  );
}

export default NavigationPill;
