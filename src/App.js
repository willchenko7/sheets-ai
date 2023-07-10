import React, { useState,useEffect,useRef  } from 'react';
//import { HotTable } from '@handsontable/react';
import axios from 'axios';
import './App.css'; 
// import { handleModifyData } from './dataUtils';
// import { extractImportantMessage } from './stringUtils';
import "pikaday/css/pikaday.css";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import Papa from 'papaparse';
import tokenize from 'tiktoken';

const App = ({ numRows, numCols }) => {

  const [data, setData] = useState([]);
  const [previousData, setPreviousData] = useState([]);

  useEffect(() => {
    const initialData = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => ''));
    setData(initialData);
  }, [numRows, numCols]);

  const hotRef = useRef(null);

  const exportTableAsCSV = () => {
    if (hotRef.current) {
      const exportPlugin = hotRef.current.getPlugin('exportFile');
      exportPlugin.downloadFile('csv', {
        bom: false,
        columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: 'csv',
        filename: 'table',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      const parsedData = Papa.parse(contents).data;

      setData(parsedData);
    };

    reader.readAsText(file);
  };


  useEffect(() => {
    const hotContainer = document.getElementById('hot-table-container');
    const hot = new Handsontable(hotContainer, {
      data: data,
      colHeaders: true,
      rowHeaders: true,
      stretchH: 'all',
      manualColumnResize: true,
      manualRowResize: true,
      contextMenu: true,
      // Other configuration options...
      afterInit: function (instance) {
        hotRef.current = instance;
      },
    });

    hotRef.current = hot;
    
    // Cleanup function
    return () => {
      hot.destroy();
    };
    

  }, [data]);



  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleButtonPress = async () => {
    function extractImportantMessage(inputString) {
      
      setPreviousData(data);
      
      const startMarker = '{';
    const endMarker = '}';
    const startIndex = inputString.indexOf(startMarker);
    const endIndex = inputString.lastIndexOf(endMarker);
  
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      // Markers not found or in incorrect order
      return '';
    }
    const importantPart = inputString.substring(startIndex + startMarker.length, endIndex);
  return importantPart.trim() + ';'
  };
    const actualInput = "you have been given a 2d matrix." + userInput + " . assume that I want the code to be written in js and ran with eval in the following format: ``` function handleModifyData(data,setData) { \n // Code to modify the data \n setData(newData); \n }``` \n . Please do not include any subfunctions in the code you return. Please maintain the matrix that was given to you, only change what the user asked.";
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    //const tokenCount = countTokens(actualInput);
  //console.log("Number of tokens in actualUserInput:", tokenCount);
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: actualInput }],
      temperature: 0.7
    };
  
    try {
      const response = await axios.post(apiEndpoint, payload, { headers });
      const botMessage = response.data.choices[0].message.content;
      console.log(botMessage);
      const importantMessage = extractImportantMessage(botMessage);

      const numTokens = response.data.usage.total_tokens;
      console.log("Number of tokens used:", numTokens);

      let returnedMessage = '';
      if (importantMessage === '') {
        returnedMessage = botMessage;
      } else {
        console.log(importantMessage);
        // execute the important message as code
        try {
          eval(importantMessage);
        }
        catch (err) {
          console.log(err);
          }
          
        //eval(importantMessage);
        //eval("handleModifyData(data, setData)");
        //console.log(importantMessage);
        returnedMessage = "Sure. Press Modify Data button to see the results.";
      }
  
      // Update the conversation with the bot's response
      setConversation(prevConversation => [
        ...prevConversation,
        { role: 'user', content: userInput },
        { role: 'bot', content: returnedMessage }
      ]);
  
      setUserInput('');
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const handleRevert = () => {
    // Get the shape of the previous data
    const numRows = previousData.length;
    const numCols = previousData.length > 0 ? previousData[0].length : 0;
  
    // Adjust the current data to match the shape of the previous data
    const adjustedData = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => ''));
  
    // Copy the values from the previous data to the adjusted data
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        adjustedData[i][j] = previousData[i][j] || '';
      }
    }
  
    // Set the adjusted data as the current data
    setData(adjustedData);
  };


  // console.log("Test");
  return (
    <div className="app">
      <div className="chatbot">
        <h2>Chatbot Section</h2>
        <div className="chatbot-content">
          <div className="conversation">
            {conversation.map((message, index) => (
              <p key={index} className={message.role}>
                {message.content}
              </p>
            ))}
          </div>
          <input type="text" value={userInput} onChange={handleInputChange} />
          <button onClick={handleButtonPress}>Submit</button>
        </div>
      </div>
      <div className="spreadsheet">
        <h2>Spreadsheet Section</h2>
        <div className="spreadsheet-content">
          <div id="hot-table-container"></div>
          <button onClick={exportTableAsCSV}>Export as CSV</button>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <button onClick={handleRevert}>Revert</button>
        </div>
        
      </div>
    </div>
  );
};

export default App;
