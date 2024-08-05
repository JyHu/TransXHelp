//
// Script for batch translation
//
// Here we use niutrans.com as a translation service provider,
//   you need to register an account and get an API key.
// https://niutrans.com/documents/contents/trans_text#accessMode
//

// Maximum requests per second (QPS) to avoid overloading the API server
var QPS = 5;
// Queue to hold translation tasks, ensuring they are processed at a controlled rate
var requestQueue = [];
// Flag to indicate whether the request queue is currently being processed
var processing = false;
// Total count of translation tasks that need to be handled
var totalCount = 0;
// Count of translation tasks that have been processed so far
var dealCount = 0;

/**
 * Main function to handle batch translation requests.
 * This function will queue translation tasks and process them at a rate defined by QPS.
 *
 * @param {string} taskID - Unique identifier for the task.
 * @param {object} watch - An object that can be used for monitoring or tracking the task status.
 * @param {object} params - The parameters for the translation task, including source languages, target languages, and the strings to be translated.
 */
function batchTranslate(taskID, watch, params) {
    const { operate, sources, targets, strings } = params;
    
    // Validate parameters to ensure that all necessary data is provided
    if (operate === null || sources === null || targets === null || strings === null) {
        // Respond with an error message if parameters are missing
        TransX.reply(taskID, { "deal": 0, "total": 0, "error": "Invalid parameters" });
        return;
    }
    
    const apiKey = "<#-- your api key --#>";
    const apiUrl = "https://api.niutrans.com/NiuTransServer/translation";

    // Log the received parameters for debugging purposes
    TransX.log(params);
    
    /**
     * Helper function to retrieve the source string and its language from the provided map.
     * It searches through the source languages and returns the first matching string found.
     *
     * @param {object} stringMap - A map of strings in different languages.
     * @returns {object|null} - An object containing the language and string, or null if no matching string is found.
     */
    function getSource(stringMap) {
        for (let language of sources) {
            let string = stringMap[language];
            if (string != null) {
                return { language, string };
            }
        }
        return null;
    }

    // Mapping of standardized language codes to those used by the translation platform
    var langMap = {
        "zh-Hans": "zh",   // Simplified Chinese
        "zh-Hant": "cht"   // Traditional Chinese
    };
    
    /**
     * Helper function to convert a standard language code to the one required by the translation platform.
     * If the language code is not found in the mapping, it returns the original code.
     *
     * @param {string} language - The standard language code.
     * @returns {string} - The converted language code.
     */
    function makeLanguage(language) {
        return langMap[language] || language;
    }

    // Iterate through each i18n string object in the provided array of strings
    for (let i18nString of strings) {
        // Extract the source language and string from the current i18n object
        let transSource = getSource(i18nString.strings);
        
        // If no source string is found, skip this i18n object
        if (transSource === null) {
            continue;
        }

        // Create a translation task for each target language
        for (let target of targets) {
            // Skip translation if the source and target languages are the same
            if (transSource.language === target) {
                continue;
            }
            
            // In 'fix' mode, skip if the target string already exists
            if (i18nString.strings[target] && operate == "fix") {
                TransX.log(`Skipping ${transSource.string} from ${transSource.language} to ${target}, already translated`);
                continue;
            }
            
            // Prepare the data for the translation request
            let requestData = {
                "from": makeLanguage(transSource.language),  // Convert source language code
                "to": makeLanguage(target),                  // Convert target language code
                "apikey": apiKey,                            // API key for authentication
                "src_text": transSource.string               // Source text to be translated
            };
            
            // Increment the total count of tasks to be processed
            totalCount += 1;

            // Add the translation task to the request queue
            requestQueue.push(() => {
                // Send the translation request to the API
                TransX.request({
                    "url": apiUrl,
                    "method": "POST",
                    "params": requestData
                }, function (response) {
                    // Increment the count of processed tasks
                    dealCount += 1;
                    
                    if (response.response) {
                        var resp = response.response;
                        if (resp && resp.tgt_text) {
                            // Log the successful translation and send a response with the result
                            TransX.log(`Translation success: ${transSource.string} -> ${resp.tgt_text}`);
                            TransX.reply(taskID, {
                                "strings": [
                                    {
                                        "key": i18nString.key,
                                        "target": target,
                                        "result": resp.tgt_text
                                    }
                                ],
                                "total": totalCount,
                                "deal": dealCount
                            });
                            // Optionally update the i18nString object with the translated string
                            // i18nString.strings[target] = resp.tgt_text;
                        } else {
                            // Handle translation errors and log the error message
                            var errorInfo = `Translation failed for ${transSource.string} from ${transSource.language} to ${target}, message: ${resp.error_msg}, code: ${resp.error_code}`;
                            TransX.log(errorInfo);
                            
                            // Send an error response with the failure details
                            TransX.reply(taskID, {
                                "total": totalCount,
                                "deal": dealCount,
                                "error": errorInfo
                            });
                        }
                    } else {
                        // Handle request errors and log the error message
                        var errorInfo = `Translation failed for ${transSource.string} from ${transSource.language} to ${target}, message: ${response.error}`;
                        TransX.log(errorInfo);
                        
                        // Send an error response with the failure details
                        TransX.reply(taskID, {
                            "total": totalCount,
                            "deal": dealCount,
                            "error": errorInfo
                        });
                    }
                });
            });
        }
        
        if (dealCount == totalCount) {
            TransX.reply(taskID, {
                "total": totalCount,
                "deal": dealCount,
                "error": "All strings have been translated."
            });
        }
    }

    // Start processing the request queue
    processQueue();
}

/**
 * Function to process the queued translation requests.
 * It processes the requests in batches according to the QPS limit.
 */
function processQueue() {
    // If already processing, return to prevent multiple concurrent processes
    if (processing) return;
    processing = true;

    /**
     * Helper function to execute a batch of translation requests.
     * It processes a number of requests up to the QPS limit, then schedules the next batch.
     */
    function executeBatch() {
        // Process up to QPS tasks from the request queue
        for (let i = 0; i < QPS && requestQueue.length > 0; i++) {
            let task = requestQueue.shift();  // Get the next task from the queue
            task();  // Execute the task
        }

        // If there are more tasks in the queue, schedule the next batch
        if (requestQueue.length > 0) {
            TransX.asyncAfter(1, executeBatch); // Schedule the next batch after 1 second
        } else {
            processing = false; // No more tasks to process, reset the processing flag
        }
    }

    // Start executing the first batch of tasks
    executeBatch();
}

/**
 * Test function to demonstrate how to use the batchTranslate function.
 * It provides sample data for testing purposes.
 *
 * @param {string} taskID - Unique identifier for the test task.
 * @param {object} watch - An object that can be used for monitoring or tracking the task status.
 * @param {object} params - The parameters for the translation task.
 */
function test(taskID, watch, params) {
    batchTranslate(taskID, watch, {
        operate: 'fix',
        sources: ['zh-Hans', 'en'],   // Source languages: Simplified Chinese and English
        targets: ['en', 'ja', 'de', "zh-Hans"], // Target languages: English, Japanese, German, and Simplified Chinese
        strings: [
            {
                key: 'key',
                strings: {
                    "zh-Hans": "中文",  // Chinese text
                    "en": "Chinese"    // English translation
                }
            },
            {
                key: 'key2',
                strings: {
                    "en": "Hello"     // English text
                }
            },
            {
                key: 'key3',
                strings: {
                    "en": "Hello"     // English text
                }
            },
            {
                key: 'key4',
                strings: {
                    "en": "Name"      // English text
                }
            },
            {
                key: 'key5',
                strings: {
                    "zh-Hans": "我不知道" // Chinese text meaning "I don't know"
                }
            }
        ],
    });
}
