//
// Const Generator
// Script to convert string keys into constants
// Example: com.auu.localization.login -> lAuuLocalizationLoginNameKey
//

// Private method for generating constants
// Parameters:
//   value - A string representing a dot-separated key
// Returns:
//   Processed constant string; returns undefined if input is invalid
function __generate__(value) {
    if (value === null || typeof value !== 'string') {
        TransX.log("Invalid parameter: key value should be of type string");
        return;
    }
    
    let parts = value.split('.');
    if (parts.length > 1) {
        parts.shift(); // Remove the first part
    }

    let camelCased = parts.map((part, index) => {
        if (index === 0) {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        } else {
            return part.charAt(0).toUpperCase() + part.slice(1);
        }
    }).join('');

    let result = 'l' + camelCased + 'NameKey';
    return result;
}

// Public method for generating constants
// Parameters:
//   taskID - Task ID used for identifying the task in asynchronous callbacks
//   watch - Observer object used for monitoring task status changes
//   params - Object passed by the business side containing an array of strings
// Returns:
//   No direct return value; results are returned asynchronously via TransX.reply,
//   where each key is the original key and the value is the generated constant
function generate(taskID, watch, params) {
    // Check if params is an array of strings
    if (!Array.isArray(params) || !params.every(item => typeof item === 'string')) {
        // If not an array or if elements are not strings, log an error and return empty data
        TransX.log("Invalid parameters: should be an array of strings");
        TransX.reply(taskID, {});
        return;
    }

    // Iterate over the array of strings and call __generate__(key) for conversion
    let value = params.reduce((acc, key) => {
        acc[key] = __generate__(key);
        return acc;
    }, {});

    // Return results asynchronously
    TransX.reply(taskID, value);
}

// Test method
// Parameters:
//   taskID - Task ID used for identifying the task in asynchronous callbacks
//   watch - Observer object used for monitoring task status changes
//   params - Object passed during invocation (can be empty for local debugging)
// Returns:
//   No direct return value; results are returned asynchronously via TransX.reply
// Description:
//   This method is used for local debugging by calling the internal generate method with test parameters
function test(taskID, watch, params) {
    // Test with invalid parameters
    generate(taskID, watch, "hello"); // Example of incorrect parameter
    // generate(taskID, watch, [123]); // Example of incorrect parameter
    
    // Test with valid parameters
    // generate(taskID, watch, ["com.auu.localization.login", "com.auu.localization.hello"]); // Example of correct parameter
}
