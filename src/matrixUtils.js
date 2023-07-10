// matrixUtils.js

export const generateInitialMatrix = (initialData) => {
    const numRows = initialData.length;
    const numCols = initialData[0].length;
    const data = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(initialData[i][j]);
      }
      data.push(row);
    }
    return data;
  };
  