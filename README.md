# SHEETS-AI

The goal of this repo is to create a natural language interface to perform spreadsheet tasks.

This code uses prompt engineering to generate code from a given request that will then interact with the spreadsheet.

<img src="./sheets-ai-demo.gif" alt="Alt Text" width="800" height="300">

## Requirements
1. npm
2. node packages listed in dependencies.txt
3. An openai api key

This app reads your openai api key from your environment variables. Please set the following key in your env variables like so in powershell,
```console
New-Item -Path Env: -name "REACT_APP_OPENAI_API_KEY" -Value "your_key"
```

## How to Run
1. cd /path/to/sheets-ai
2. npm start
3. The app should automatically open in your browser.
4. Type your prompt in the text box
5. see results!

## How does it work
The approach to this app is to leverage GPT to take a user's request, convert it into a piece of code that is then executed with eval.

Consider the following user request, "write the following sequence in colA: n = n + 3. start with 1. only include 10 iterations"

That user script will then convert that prompt to this:
"you have been given a 2d matrix. write the following sequence in colA: n = n + 3. start with 1. only include 10 iterations . assume that I want the code to be written in js and ran with eval in the following format: ``` function handleModifyData(data,setData) { \n // Code to modify the data \n setData(newData); \n }``` \n . Please do not include any subfunctions in the code you return. Please maintain the matrix that was given to you, only change what the user asked."

The result of this query is:
"""
Here's the code that modifies the given matrix according to the provided sequence:

```javascript
function handleModifyData(data, setData) {
  const newData = [...data]; // Create a shallow copy of the given matrix

  let count = 0;
  let n = 1;

  for (let i = 0; i < newData.length && count < 10; i++) {
    newData[i][0] = n; // Update the value in colA with the current n
    n += 3;

    count++;
  }

  setData(newData); // Update the matrix with the modified data
}
```

Please note that this code assumes the given matrix is a 2D array where each inner array represents a row and the value in colA is located at index 0 of each inner array. The modified matrix is then passed to the `setData` function to update the original data.
"""

The function handleModifyData is then extracted from this output, and executed with eval. 

Can you edit the prompt engineering to get better results?