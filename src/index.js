/*
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const numRows = 500;
const numCols = 6;

ReactDOM.render(
  <React.StrictMode>
    <App numRows={numRows} numCols={numCols} />
  </React.StrictMode>,
  document.getElementById('root')
);
*/
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const numRows = 500;
const numCols = 6;

const ModifiedApp = () => {
  const [data, setData] = useState([]);

  // Generate the initialData
  const initialData = React.useMemo(() => {
    const data = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push('');
      }
      data.push(row);
    }
    return data;
  }, [numRows, numCols]);

  const handleModifyData = () => {
    const modifiedData = initialData.map((row) => row.map((value) => value * 2));
    setData(modifiedData);
  };

  return (
    <App numRows={numRows} numCols={numCols} data={data} handleModifyData={handleModifyData} />
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ModifiedApp />
  </React.StrictMode>,
  document.getElementById('root')
);

