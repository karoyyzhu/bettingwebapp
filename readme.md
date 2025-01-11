# Gambling Web Application

- `npm run dev` in root directory will run local server accessible through web browser, port 3000
- TypeScript, Node.js, EJS
- Data persists by serializing to JSON file

# Additional notes:
- Application file found at src/server.ts
- src/utils represents additional functionality, generally abstracted into the different components forming the web app
- views/ stores models for specific pages, use EJS as template
- Serialized and writes data to JSON file, which would not be efficient at scale, but given how lightweight the app is, for this use case it does not require anything heavier duty
- JSON file `session_data.json` serves as a list of events (called bet_data)
- "Run" functionality for the 'withdraw' button is very basic and somewhat laggy (written in static js, mostly as a fun exercise), but button shifts a random distance across the screen when moused over if user has reached a high balance threshold
- Redundancy: if there is no history or if the log file is deleted, it is always re-instantiated with a default value attached, marked by the "DEFAULT" value of the `alert` field
