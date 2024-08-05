/**
 * Function to validate whether the current multilingual string content is valid.
 * This script checks if the placeholders (e.g., ${xxx}) in each multilingual string have the same quantity and names.
 * If they differ, it will return an array of keys with discrepancies.
 *
 * Parameters:
 *   taskID - Task ID used to identify the task in asynchronous callbacks
 *   watch - Observer object used to monitor task status changes
 *   params - Object passed by the business side containing languages and i18nStrings, for example:
 *   {
 *       "languages": ["en", "zh-Hans", "ja"],
 *       "i18nStrings": [
 *           {
 *               "const": "laaa",
 *               "key": "com.auu.testkey",
 *               "strings": {
 *                   "en": "Hello, you have clicked ${count} times.",
 *                   "zh-Hans": "你好，你已经点击了 ${count} 次。",
 *                   "ja": "こんにちは、${count} 回クリックしました。"
 *               }
 *           },
 *           {
 *               "const": "laaa",
 *               "key": "com.auu.testkey2",
 *               "strings": {
 *                   "en": "Welcome, ${firstName} ${lastName}. You have ${count} messages and ${pending} notifications.",
 *                   "zh-Hans": "欢迎，${firstName} ${lastName}。你有 ${count} 条消息和 ${pending} 个通知。",
 *                   "ja": "${firstName} ${lastName} さん、ようこそ。あなたには ${count} 件のメッセージと ${pending} 件の通知があります。"
 *               }
 *           }
 *       ]
 *   }
 *
 * Returns:
 *   An array of keys with discrepancies in placeholders. eg: { unlegal: unlegalKeys }
 */

function validation(taskID, watch, params) {
    const { languages, i18nStrings } = params;

    // Regular expression to match placeholders
    const variablePattern = /\$\{([^\}]+)\}/g;
    
    // Function to extract variables from a string
    const extractVariables = (str) => {
        const variables = new Set();
        let match;
        while ((match = variablePattern.exec(str)) !== null) {
            variables.add(match[1]);
        }
        return variables;
    };

    // Helper function to check if two sets are equal
    const setsEqual = (a, b) => {
        if (a.size !== b.size) return false;
        for (let item of a) {
            if (!b.has(item)) return false;
        }
        return true;
    };

    // Array to hold keys with discrepancies
    const unlegalKeys = [];

    // Validate each i18nString
    i18nStrings.forEach(i18nString => {
        const strings = i18nString.strings;
        const values = Object.values(strings);

        // Extract variables from the first non-empty value
        const firstValue = values.find(value => value.trim() !== '') || '';
        const expectedVariables = extractVariables(firstValue);

        // Check if all non-empty values contain the same variables
        const isLegal = values.every(value => {
            if (value.trim() === '') return true; // Skip empty strings
            const currentVariables = extractVariables(value);
            return setsEqual(expectedVariables, currentVariables);
        });

        // If not legal, add the key to unlegalKeys
        if (!isLegal) {
            unlegalKeys.push(i18nString.key);
        }
    });

    // Return keys with discrepancies
    TransX.reply(taskID, { unlegal: unlegalKeys });

    if (unlegalKeys.length > 0) {
        // Log the result
        let message = `Keys with discrepancies: ${unlegalKeys.join(', ')}`
        TransX.log(message);
        TransX.alert("校验失败", message);
    }
}

/**
 * Test function to validate the multilingual string content.
 *
 * Parameters:
 *   taskID - Task ID used to identify the task in asynchronous callbacks
 *   watch - Observer object used to monitor task status changes
 *   params - Object passed by the business side
 */
function test(taskID, watch, params) {
    let json = {
        "languages": ["en", "zh-Hans", "ja"],
        "i18nStrings": [
            {
                "const": "laaa",
                "key": "com.auu.testkey",
                "strings": {
                    "en": "Hello, you have clicked ${count} times.",
                    "zh-Hans": "你好，你已经点击了 ${count} 次。",
                    "ja": "こんにちは、${count} 回クリックしました。"
                }
            },
            {
                "const": "laaa",
                "key": "com.auu.testkey2",
                "strings": {
                    "en": "Welcome, ${firstName} ${lastName}. You have ${count} messages and ${pending} notifications.",
                    "zh-Hans": "欢迎，${firstName} ${lastName}。你有 ${count} 条消息和 ${pending} 个通知。",
                    "ja": "${firstName} ${last} さん、ようこそ。あなたには ${count} 件のメッセージと ${pending} 件の通知があります。"
                }
            }
        ]
    };
    
    validation(taskID, watch, json);
}
