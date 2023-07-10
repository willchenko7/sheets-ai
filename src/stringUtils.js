

function extractImportantMessage(inputString) {
    //const startMarker = '```';
    //const startMarker = 'handleModifyData(initialData, setData)';
    //const endMarker = '```';
    const startMarker = '{';
    const endMarker = '}';
    const startIndex = inputString.indexOf(startMarker);
    const endIndex = inputString.lastIndexOf(endMarker);
  
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      // Markers not found or in incorrect order
      return '';
    }
    const importantPart = inputString.substring(startIndex + startMarker.length, endIndex);
  return importantPart.trim() + ';' + "handleModifyData(initialData, setData);"
};