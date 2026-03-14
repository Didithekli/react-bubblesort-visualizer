import { useState, useEffect, useRef } from 'react';

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(20);
  const [sortingSpeed, setSortingSpeed] = useState(150);
  
  // States for color coding
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  
  // Use a ref to keep track of sorting state to abort early if needed
  // Not strictly needed for a basic abort, but good practice
  const isSortingRef = useRef(isSorting);
  isSortingRef.current = isSorting;

  useEffect(() => {
    resetArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize]); // Re-generate array when size changes

  const resetArray = () => {
    if (isSortingRef.current) return;
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
        // dynamic range to keep bars within visual limits
      newArray.push(randomIntFromInterval(10, 100));
    }
    setArray(newArray);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;
    let swapped;
    const newSortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight current comparison
        setActiveIndices([j, j + 1]);
        
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
        
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
          setArray([...arr]);
        }
      }
      
      // The last element of this iteration is now sorted
      newSortedIndices.push(n - i - 1);
      setSortedIndices([...newSortedIndices]);
      
      // If no two elements were swapped by inner loop, then array is sorted
      if (!swapped) {
        // Mark remaining elements as sorted
        for (let k = 0; k < n - i - 1; k++) {
            newSortedIndices.push(k);
        }
        setSortedIndices([...newSortedIndices]);
        break;
      }
    }
    
    // Final cleanup
    setActiveIndices([]);
    setIsSorting(false);
  };

  // Prevent controls from being dragged while sorting
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setArraySize(Number(e.target.value));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Invert the speed so sliding right means faster (less delay)
      // Slider 1 (Fast: 10ms) to 100 (Slow: 1000ms) -> We'll just define min/max on slider
      setSortingSpeed(Number(e.target.value));
  };

  // Calculate dynamic width based on array size
  const barWidth = Math.max(10, Math.floor(600 / arraySize) - 4);

  return (
    <div className="visualizer-container">
        
      <div className="controls-panel">
          <div className="control-group">
            <label htmlFor="arraySize">Array Size: {arraySize}</label>
            <input 
                type="range" 
                id="arraySize" 
                min="5" 
                max="50" 
                value={arraySize} 
                onChange={handleSizeChange}
                disabled={isSorting}
            />
          </div>
          
          <div className="control-group">
            <label htmlFor="sortingSpeed">Delay (ms): {sortingSpeed}</label>
            <input 
                type="range" 
                id="sortingSpeed" 
                min="10" 
                max="500" 
                step="10"
                value={sortingSpeed} 
                onChange={handleSpeedChange}
                disabled={isSorting}
            />
          </div>
      </div>

      <div className="array-container">
        {array.map((value, idx) => {
            const isActive = activeIndices.includes(idx);
            const isSorted = sortedIndices.includes(idx);
            
            let backgroundColor = '#646cff'; // default blue
            if (isActive) backgroundColor = '#eab308'; // yellow when comparing
            if (isSorted) backgroundColor = '#22c55e'; // green when sorted

            return (
                <div
                    className="array-bar-container"
                    key={idx}
                >
                    <div 
                        className="array-bar"
                        style={{ 
                            height: `${value * 3}px`, 
                            width: `${barWidth}px`,
                            backgroundColor 
                        }}
                    >
                    </div>
                    {/* Hide labels if there are too many bars to prevent overlapping */}
                    {arraySize <= 25 && <div className="array-bar-label">{value}</div>}
                </div>
            )
        })}
      </div>
      
      <div className="controls">
        <button onClick={resetArray} disabled={isSorting}>Generate New Array</button>
        <button className="primary-button" onClick={bubbleSort} disabled={isSorting}>Sort!</button>
      </div>
    </div>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;
