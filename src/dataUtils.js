/*
export function handleModifyData(initialData,setData) {
    // Code to modify the data
    const newData = initialData.map(row => row.map(cell => cell * 2));
    setData(newData);
  }
  */
  export function handleModifyData(initialData, setData) { const newData = initialData.map(row => row.map(x => x * 2)); setData(newData); }