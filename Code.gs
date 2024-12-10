/**
 * Script for automating data imports from Google Sheets to Piano Measurements API.
 * Repository: https://github.com/GuillaumeMeignan/pianoMeasurementsAPIwithGsheet
 *
 * Main function to fetch data from Google Sheets, format it for Piano measurements,
 * and send it to the Piano Measurements API.
 */
function pianoMeasurementsAPIwithGsheet(e) {
  const sheet = e ? e.source.getSheetByName('data') : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('data');

  const apiUrl = 'https://analytics-api-eu.piano.io/import/measurements/v1';

  const apiKey = '<ACCESS_KEY>_<SECRET_KEY>';
  const measurementKey = 'abcde';
  const siteId = 123456;

  try {
    // Retrieve and validate data from the sheet
    const data = getSheetDataAsJson(sheet);

    // Transform data for the API
    const formattedData = data.map(entry => formatDataForMeasurements(entry, measurementKey, siteId || null));
    
    // Send the formatted data to the API
    const response = sendDataToAPI(apiUrl, apiKey, { measurements: formattedData });
    Logger.log(`Response Code: ${response.getResponseCode()} ${response.getContentText()}`);

  } catch (error) {
    Logger.log(`Error: ${error.message}`);
  }
}

/**
 * Formats a single data entry for Piano Measurements API.
 * @param {Object} entry - The original data entry.
 * @param {string} measurementKey - The measurement key.
 * @param {number} siteId - The site ID.
 * @return {Object} - The formatted data object.
 */
function formatDataForMeasurements(entry, measurementKey, siteId) {
  const { date, ...rest } = entry;

  const values = Object.keys(rest)
    .filter(key => key.startsWith('m_'))
    .reduce((acc, key) => ({ ...acc, [key]: rest[key] }), {});

  const properties = Object.keys(rest)
    .filter(key => !key.startsWith('m_'))
    .reduce((acc, key) => ({ ...acc, [key]: rest[key] }), {});

  const result = {
    key: measurementKey,
    period: date,
    values,
    properties,
  };

  if (siteId) {
    result.site_id = siteId;
  }

  return result;
}

/**
 * Reads data from the given sheet and converts it into an array of JSON objects.
 * Validates that the sheet has at least 2 rows and 2 columns.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The active sheet object.
 * @return {Array<Object>} - Array of JSON objects representing the sheet data.
 */
function getSheetDataAsJson(sheet) {
  const values = sheet.getDataRange().getValues();

  if (values.length < 2 || values[0].length < 2) {
    throw new Error('The sheet must have at least 2 rows (headers + 1 data row) and 2 columns.');
  }

  const headers = values[0];
  return values.slice(1).map(row => {
    return headers.reduce((record, header, index) => {
      let cellValue = row[index];

      // Vérifie si la valeur est une date et la formate au format ISO
      if (Object.prototype.toString.call(cellValue) === '[object Date]' && !isNaN(cellValue)) {
        // Format de la date en "YYYY-MM-DD"
        let year = cellValue.getFullYear();
        let month = ('0' + (cellValue.getMonth() + 1)).slice(-2); // Mois commence à 0
        let day = ('0' + cellValue.getDate()).slice(-2);
        cellValue = `${year}-${month}-${day}`;
      }
      
      record[header] = cellValue;
      return record;
    }, {});
  });
}

/**
 * Sends the given data to the specified API endpoint using the provided API key.
 * @param {string} url - The API endpoint URL.
 * @param {string} apiKey - The API key for authorization.
 * @param {Object|Array<Object>} data - The data to send in the POST request.
 * @return {GoogleAppsScript.URL_Fetch.HTTPResponse} - The HTTP response from the API.
 */
function sendDataToAPI(url, apiKey, data) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey },
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  };

  return UrlFetchApp.fetch(url, options);
}
