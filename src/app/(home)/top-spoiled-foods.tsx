
export const TopSpoiledFoods = () => {
  return (
    <div className="glass-card p-4">
      <p className="font-bold">Top wasted products</p>
      <p className="text-sm text-gray-500 mb-4">40% of waste in the last 30 days came from these 3 items</p>

      {[
        {
          name: 'Bananas',
          weight: '891kg',
          percentage: '100%',
          supplier: 'Supplier AG',
          supplierInfo: '50% of all spoiled bananes came from Supplier AG',
          chart: [2, 1, 1],
        },
        {
          name: 'Apples',
          weight: '445kg',
          percentage: '51%',
          supplier: 'Fruit GmbH',
          supplierInfo: '40% of all spoiled apples came from Fruit GmbH',
          chart: [2, 1],
        },
        {
          name: 'Oranges',
          weight: '300kg',
          percentage: '34%',
          supplier: 'Citrus Co.',
          supplierInfo: '30% of all spoiled oranges came from Citrus Co.',
          chart: [2, 2, 1],
        },
      ].map((item, index) => (
        <div key={index} className="border p-2 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="font-bold">{item.name}</p>
            </div>
            <p className="text-gray-500 italic">{item.weight}</p>
          </div>
          <div className="relative rounded-full h-2 w-full bg-gray-300 mt-2">
            <div className="absolute inset-0 bg-emerald-700 rounded-full" style={{ width: item.percentage }} />
          </div>
          <div className="rounded bg-amber-100/30 border border-yellow-400 flex items-center justify-between p-2 mt-4 text-sm">
            <div>
              <p className="font-bold">Main Supplier: {item.supplier}</p>
              <p>{item.supplierInfo}</p>
            </div>
            <div className="relative h-4 w-20 flex gap-0.5">
              {item.chart.map((flex, i) => (
                <div key={i} className={`flex-[${flex}] rounded ${i === 0 ? 'bg-yellow-700' : 'bg-yellow-500'}`}></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
