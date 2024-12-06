# pianoMeasurementsAPIwithGsheet

This Google Apps Script project allows you to fetch data from a Google Sheet, and send it to Piano Analytics.

## Installation and Setup

### 1. Open Apps Script in Google Sheets
1. Open your Google Sheet.
2. Go to **Extensions > Apps Script** in the menu bar.

### 2. Import the Code
1. Copy the provided code from this repository.
2. Paste it into the Apps Script editor.

### 3. Configure API Variables
- Open the Apps Script editor and locate the following variables:
  - **`apiKey`**: Set your API key for authorization (this is shared across both APIs).
  - **`measurementKey`**: For measurements data, set the key identifying the measurement context.
  - **`siteId`**: For measurements data, set the site ID corresponding to your site OR delete the variable if you use an organization scope Measurement.

### 4. Save the Script
- Click the **File > Save** option in the Apps Script editor.

### 5. Add an Event Trigger (Optional)
To automate the execution of the script, you can set up an event trigger:
1.	In the Apps Script editor, go to Triggers > Add Trigger.
2.	Select the function pianoMeasurementsAPIwithGsheet from the dropdown menu.
3.	Under Select event source, choose the desired trigger type (e.g., From spreadsheet or Time-driven).
4.	If using a time-driven trigger, configure the frequency (e.g., daily, hourly).
5.	Save the trigger to enable automatic execution.

## How to Use

### Measurements API
1. Populate your Google Sheet with the required data for measurements.
2. Ensure your sheet has the following format:
   - `date` column for periods.
   - Columns starting with `m_` for metrics.
   - Other columns for properties.

## Contributing
Feel free to contribute by submitting issues or pull requests to enhance this project.

## License
This project is open-source and created by Kimetrix
