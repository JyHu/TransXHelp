//
// Key Generator
// Localization string key generation script
// Generates random string keys for localization in Xcode projects
// Example: prefix -> prefixXX-XXX-XXXX
//

// Public method for generating random string keys
// Parameters:
//   taskID - Task ID used to identify the task in asynchronous callbacks
//   watch - Observer object used to monitor task status changes
//   params - Object passed by the business side containing count and prefix
// Returns:
//   No return value; results are returned asynchronously via TransX.reply
//   The result is an array of generated random string keys
function generate(taskID, watch, params) {
    // Get the count parameter; return an empty array if undefined
    const count = params.count;
    if (count === undefined) {
        // If count is not provided, return an empty array
        TransX.reply(taskID, []);
        return;
    }

    // Get the prefix parameter; use "localized" as the default if undefined
    const prefix = params.prefix || "localized";

    // Generate a random character
    function getRandomChar() {
        const template = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomIndex = Math.floor(Math.random() * template.length);
        return template[randomIndex];
    }

    // Generate a random string of a given length
    function generateString(length) {
        return Array.from({ length: length }, getRandomChar).join('');
    }

    // Generate a random string key with the given prefix
    function generateWith(prefix) {
        const effectivePrefix = prefix === "" ? "localized" : prefix;
        return `${effectivePrefix}${generateString(2)}-${generateString(3)}-${generateString(4)}`;
    }

    // Create the result array and fill it with random string keys
    const result = Array.from({ length: count }, () => generateWith(prefix));

    // Log the result
    TransX.log(result);

    // Return the result asynchronously
    TransX.reply(taskID, result);
}

// Generic method for testing
// Parameters:
//   taskID - Task ID used to identify the task in asynchronous callbacks
//   watch - Observer object used to monitor task status changes
//   params - Object passed during invocation (can be empty for local debugging)
// Returns:
//   No return value; results are returned asynchronously via TransX.reply
// Description:
//   This method is used for local debugging by calling the internal generate method with test parameters
function test(taskID, watch, params) {
    // Test with valid parameters
    generate(taskID, watch, { count: 5, prefix: "com.auu.test." });
    generate(taskID, watch, { count: 5 });
    generate(taskID, watch, {});
}
