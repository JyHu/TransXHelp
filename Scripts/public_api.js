const TransX = (function () {
    return {
        /**
         * Logs a message.
         * @param {string} log - The log message.
         * @param {number} [lv=0] - The log level.
         * @example
         * TransX.log('This is a debug log.', 0);
         */
        log: function (log, lv = 0) {
            JSBridge.log(log, lv);
        },
        
        /**
         * Replies to a specific task ID.
         * @param {number} taskID - The task ID.
         * @param {object} params - The parameters to be passed back.
         * @example
         * TransX.reply(1, { key: 'value' });
         * The format of the returned result depends on the specific business requirements.
         */
        reply: function (taskID, params) {
            JSBridge.reply(taskID, params);
        },
        
        /**
         * Calls a callback function asynchronously after a specified time.
         * @param {number} seconds - The delay time in seconds.
         * @param {function} callback - The callback function.
         * @example
         * TransX.asyncAfter(1, function() {
         *     TransX.log('Callback executed after 1 second.');
         * });
         */
        asyncAfter: function (seconds, callback) {
            JSBridge.asyncAfter(seconds, callback);
        },
        
        /**
         * Sets the log level.
         * @param {number} level - The log level.
         * @example
         * TransX.setLogLevel(3);
         */
        setLogLevel: function (level) {
            JSBridge.setLogLevel(level);
        },
        
        /**
         * Initiates an HTTP request.
         * @param {object} params - The request parameters.
         *   @param {string} params.method - The HTTP method (e.g., GET, POST, PUT, DELETE).
         *   @param {string} params.url - The target URL.
         *   @param {object} [params.headers] - The request headers, such as content type, authorization info, etc.
         *   @param {object} [params.params] - The URL query parameters.
         *   @param {string} [params.contentType] - The content type of the request body.
         *     Options:
         *       - `json` -> `application/json`
         *       - `form` -> `application/x-www-form-urlencoded`
         *   @param {number} [params.timeout] - The request timeout in seconds.
         * @param {function} callback - The callback function to handle the response.
         * @example
         * TransX.request({
         *     method: 'POST',
         *     url: 'https://example.com/api',
         *     headers: {
         *         'Authorization': 'Bearer token'
         *     },
         *     params: {
         *         key: 'value'
         *     },
         *     contentType: 'json'
         * }, function(response) {
         *     TransX.log(response);
         * });
         * The format of the returned result is { response, error }
         */
        request: function (params, callback) {
            JSBridge.call("request", params, 1, callback);
        },
        
        /**
         * Displays an alert dialog.
         * @param {string} title - The title of the alert.
         * @param {string} message - The alert message.
         * @example
         * TransX.alert('Warning', 'This is a warning message.');
         */
        alert: function (title, message) {
            JSBridge.call("alert", { title, message }, 0);
        },
        
        /**
         * Displays a confirmation dialog.
         * @param {string} title - The title of the confirmation dialog.
         * @param {string} message - The confirmation message.
         * @param {function} callback - The callback function to handle the user's response.
         * @example
         * TransX.confirm('Confirm', 'Are you sure?', function(response) {
         *     if (response.confirmed) {
         *         TransX.log('User confirmed the action.');
         *     } else {
         *         TransX.log('User canceled the action.');
         *     }
         * });
         * The returned result is an object, such as { "confirmed": true }
         */
        confirm: function (title, message, callback) {
            JSBridge.call("confirm", { title, message }, 1, callback);
        },
        
        /**
         * Retrieves basic information about all localization files in the project.
         * @param {function} callback - The callback function to handle the response.
         * @example
         * TransX.getFiles(function(response) {
         *     TransX.log(response);
         * });
         * The format of the returned result is:
         * [ { "fileID": "File ID", "name": "Filename", "languages": ["en", "zh-Hans"] } ]
         */
        getFiles: function (callback) {
            JSBridge.call("getFiles", {}, 1, callback);
        },
        
        /**
         * Retrieves all localized strings in a specified file.
         * @param {string} fileID - The file ID.
         * @param {function} callback - The callback function to handle the response.
         * @example
         * TransX.getFile('File ID', function(response) {
         *     TransX.log(response);
         * });
         * The format of the returned result is:
         * {
         *   "fileID": "File ID",
         *   "name": "Filename",
         *   "languages": ["en", "zh-Hans"],
         *   "groups": [
         *     {
         *       "name": "Group Name",
         *       "strings": [
         *         {
         *           "key": "String Key",
         *           "const": "Constant Value (if any)",
         *           "strings": {
         *             "en": "English String",
         *             "zh-Hans": "Simplified Chinese String"
         *           }
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        getFile: function (fileID, callback) {
            JSBridge.call("getFile", { fileID }, 1, callback);
        },
        
        /**
         * Retrieves localized content for specified keys in a specified file.
         * @param {string} fileID - The file ID.
         * @param {Array} keys - An array of string keys.
         * @param {function} callback - The callback function to handle the response.
         * @example
         * TransX.getStrings('File ID', ['Key1', 'Key2'], function(response) {
         *     TransX.log(response);
         * });
         * The format of the returned result is:
         * [
         *   {
         *     "key": "String Key",
         *     "const": "Constant Value (if any)",
         *     "strings": {
         *       "en": "English String",
         *       "zh-Hans": "Simplified Chinese String"
         *     }
         *   },
         *   {
         *     "key": "String Key",
         *     "const": "Constant Value (if any)",
         *     "strings": {
         *       "en": "English String",
         *       "zh-Hans": "Simplified Chinese String"
         *     }
         *   }
         * ]
         */
        getStrings: function (fileID, keys, callback) {
            JSBridge.call("getStrings", { fileID, keys }, 1, callback);
        },
        
        /**
         * Inserts or updates localization files.
         * @param {object} fileStrings - The localization file information to be updated.
         * @example
         * TransX.updating({
         *   "strategy": "all",
         *   "files": {
         *     "target file id1": [
         *       {
         *         "key": "xxxx",
         *         "strings": {
         *           "en": "xxxx",
         *           "zh-Hans": "xxxx",
         *           "zh-Hant": "xxxx"
         *         }
         *       }
         *     ],
         *     "target file id2": [
         *       {
         *         "key": "xxxx",
         *         "strings": {
         *           "en": "xxxx",
         *           "zh-Hans": "xxxx",
         *           "zh-Hant": "xxxx"
         *         }
         *       }
         *     ]
         *   }
         * });
         *
         * Strategy:
         * The following strategies are available, and if not specified or incorrectly specified, the default is "all":
         * - "all": Imports all new localized string content and updates existing localized string content.
         * - "insertOnly": Inserts only the localized string content that is not present locally.
         * - "updateOnly": Updates only the localized string content that already exists locally.
         */
        updating: function (fileStrings) {
            JSBridge.call("updating", fileStrings, 0);
        },
        
        /**
         * Selects files from local storage.
         * @param {Array} types - The file types, supporting the following: json, csv, plist, text, xml.
         * @param {function} callback - The callback function to handle the response. The returned data format varies based on the file type.
         *
         * Data format of the returned result:
         * - For json and plist file types: Returns the raw JSON data.
         * - For text and xml file types: Returns the text content.
         * - For csv file type: Returns the parsed data structure in the following format:
         *   {
         *     "header": [....], // The header row
         *     "rowValues": [
         *       {
         *         "key": "value", // The key is the current column's header, the value is the current row's value
         *         ...
         *       }
         *     ]
         *   }
         */
        fileOpen: function (types, callback) {
            JSBridge.call("fileOpen", { types }, 1, callback);
        },
        
        /**
         * Terminates the execution of the current custom script. All custom scripts must call this method.
         */
        terminate: function () {
            JSBridge.call("terminate", {}, 0);
        }
    };
})();