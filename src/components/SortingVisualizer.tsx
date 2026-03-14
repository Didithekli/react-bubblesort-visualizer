import { useState, useEffect } from 'react';

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    if (isSorting) return;
    const newArray = [];
    for (let i = 0; i < 15; i++) {
      newArray.push(randomIntFromInterval(10, 100));
    }
    setArray(newArray);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        // Highlight comparison (optional, can add state for active indices)
        
        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;
          
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 300)); // Delay for visualization
        }
      }
    } while (swapped);
    
    setIsSorting(false);
  };

  return (
    <div className="visualizer-container">
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar-container"
            key={idx}
          >
            <div 
              className="array-bar"
              style={{ height: `${value * 3}px` }}
            >
            </div>
            <div className="array-bar-label">{value}</div>
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={resetArray} disabled={isSorting}>Generate New Array</button>
        <button onClick={bubbleSort} disabled={isSorting}>Sort!</button>
      </div>
    </div>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;
