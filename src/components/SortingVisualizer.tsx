import { useState, useEffect, useRef } from 'react';

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(20);
  const [sortingSpeed, setSortingSpeed] = useState(150);
  const [algorithm, setAlgorithm] = useState<string>('Bubble Sort');
  
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

  const selectionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;
    const newSortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        setActiveIndices([minIdx, j]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        setActiveIndices([i, minIdx]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
      }

      newSortedIndices.push(i);
      setSortedIndices([...newSortedIndices]);
    }

    setActiveIndices([]);
    setIsSorting(false);
  };

  const insertionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;
    const newSortedIndices: number[] = [0];

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      setActiveIndices([i]);
      await new Promise(resolve => setTimeout(resolve, sortingSpeed));

      while (j >= 0 && arr[j] > key) {
        setActiveIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));

        arr[j + 1] = arr[j];
        setArray([...arr]);
        j = j - 1;
      }
      arr[j + 1] = key;
      setArray([...arr]);

      newSortedIndices.push(i);
      setSortedIndices([...newSortedIndices]);
    }

    setActiveIndices([]);
    setIsSorting(false);
  };

  const mergeSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    
    // We update the array in place for visual effect
    const doMergeSort = async (start: number, end: number) => {
      if (start >= end) return;
      
      const mid = Math.floor((start + end) / 2);
      await doMergeSort(start, mid);
      await doMergeSort(mid + 1, end);
      await merge(start, mid, end);
    };

    const merge = async (start: number, mid: number, end: number) => {
      let left = start;
      let right = mid + 1;
      
      // Temporary array to hold merged results
      const temp: number[] = [];

      while (left <= mid && right <= end) {
        setActiveIndices([left, right]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
        
        if (arr[left] <= arr[right]) {
          temp.push(arr[left]);
          left++;
        } else {
          temp.push(arr[right]);
          right++;
        }
      }

      while (left <= mid) {
        temp.push(arr[left]);
        left++;
      }

      while (right <= end) {
        temp.push(arr[right]);
        right++;
      }

      // Copy temp back to original array and update visualization
      for (let i = start; i <= end; i++) {
        arr[i] = temp[i - start];
        setActiveIndices([i]); // Highlight element being correctly placed
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
      }
    };

    await doMergeSort(0, arr.length - 1);
    
    // Mark all as sorted at the very end
    setSortedIndices(arr.map((_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  };

  const quickSort = async () => {
    setIsSorting(true);
    const arr = [...array];

    const partition = async (low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;

      setActiveIndices([high]); // Highlight pivot

      for (let j = low; j < high; j++) {
        setActiveIndices([j, high]); // Compare current element with pivot
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));

        if (arr[j] < pivot) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArray([...arr]);
           await new Promise(resolve => setTimeout(resolve, sortingSpeed));
        }
      }

      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, sortingSpeed));

      return i + 1;
    };

    const doQuickSort = async (low: number, high: number) => {
      if (low < high) {
        const pi = await partition(low, high);
        
        // Element at pi is now in its correct position (sorted)
        setSortedIndices(prev => [...prev, pi]);

        await doQuickSort(low, pi - 1);
        await doQuickSort(pi + 1, high);
      } else if (low === high) {
          setSortedIndices(prev => [...prev, low]);
      }
    };

    // Reset sorted indices before starting
    setSortedIndices([]);
    await doQuickSort(0, arr.length - 1);
    
    setSortedIndices(arr.map((_, i) => i)); // Ensure all are green at the end
    setActiveIndices([]);
    setIsSorting(false);
  };
  
  const handleSort = () => {
    if (algorithm === 'Bubble Sort') bubbleSort();
    else if (algorithm === 'Selection Sort') selectionSort();
    else if (algorithm === 'Insertion Sort') insertionSort();
    else if (algorithm === 'Merge Sort') mergeSort();
    else if (algorithm === 'Quick Sort') quickSort();
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
            <label htmlFor="algorithm">Algorithm:</label>
            <select 
                id="algorithm" 
                value={algorithm} 
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isSorting}
            >
                <option value="Bubble Sort">Bubble Sort</option>
                <option value="Selection Sort">Selection Sort</option>
                <option value="Insertion Sort">Insertion Sort</option>
                <option value="Merge Sort">Merge Sort</option>
                <option value="Quick Sort">Quick Sort</option>
            </select>
          </div>

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
        <button className="primary-button" onClick={handleSort} disabled={isSorting}>Sort!</button>
      </div>
    </div>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;
