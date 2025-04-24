interface Props {
  displayMode: 'overview' | 'temperature' | 'incidents';
  setDisplayMode: (v: 'overview' | 'temperature' | 'incidents') => void;
}

function NavigationPill({ displayMode, setDisplayMode }: Props) {
  return (
    <div className="bg-white rounded-full p-1 flex gap-1 cursor-pointer">
      {['overview', 'temperature', 'incidents'].map((mode) => (
        <div
          key={mode}
          className={`${
            displayMode === mode ? 'bg-[#E8F15C] text-black' : 'bg-white text-gray-500'
          } rounded-full px-3 py-1.5 cursor-pointer`}
          onClick={() => setDisplayMode(mode)}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </div>
      ))}
    </div>
  );
}

export default NavigationPill;
