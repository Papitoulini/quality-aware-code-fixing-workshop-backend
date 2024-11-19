/**
 * Breaks long strings in JSON into multiple lines for better readability.
 * @param {object} jsonObject - The JSON object to process.
 * @param {number} maxLength - The maximum length of each line.
 * @returns {string} - The formatted JSON string with line breaks.
 */
const formatJSONWithLineBreaks = (jsonObject, maxLength = 80) => JSON.stringify(
	jsonObject,
	(key, value) => {
		if (typeof value === "string" && value.length > maxLength) {
			// Break string into lines of maxLength characters
			return value.match(new RegExp(`.{1,${maxLength}}`, "g")).join("\n");
		}

		return value;
	},
	2, // Indentation level for pretty-printing
);

export default formatJSONWithLineBreaks;
