# TransX Module Usage Documentation

## 1. Module Description

The `TransX` module encapsulates some common functionalities of the [`JSBridge`](https://github.com/JyHu/JSBridge) module, providing methods for logging, asynchronous calls, setting log levels, and making HTTP requests. The following is a detailed explanation and usage examples of this module.

## 2. Method Details

### 2.1 log(log, lv = 0)

Outputs log information.

**Parameters**

- `log` (`string`): The log content to be output.
- `lv` (`number`, optional): The message level, default is 0.

**Example**

```javascript
TransX.log('This is a debug log.', 0);
TransX.log('This is a debug log');
```

### 2.2 reply(taskID, params)

Replies to a message with the specified task ID.

**Parameters**

- `taskID` (`number`): The task ID.
- `params` (`any`): The parameters to be passed back.

**Example**

```Javascript
TransX.reply(1, any);
```

The format of the return results depends on the specific business requirements.

### 2.3 asyncAfter(seconds, callback)

Asynchronously calls the specified callback method.

**Parameters**

- `seconds` (`number`): The delay time in seconds.
- `callback` (`function`): The callback method.

**Example**

```Javascript
TransX.asyncAfter(1, function() {
    TransX.log('Callback executed after 1 second.');
});
```

### 2.4 setLogLevel(level)

Sets the log level.

**Parameters**

- `level` (`number`): The log level.

**Example**

```Javascript
TransX.setLogLevel(3);
```

### 2.5 request(params, callback)

Makes an HTTP request.

**Parameters**

- `params` (`object`): The request parameters.
    - `method` (`string`): The request method (e.g., `GET`, `POST`, `PUT`, `DELETE`, etc.).
    - `url` (`string`): The target URL of the request.
    - `headers` (`object`, optional): The request headers, including metadata such as content type and authorization information.
    - `params` (`object`, optional): The URL request parameters.
    - `contentType` (`string`, optional): The content type of the request body, with the following optional values:
        - `json` > `application/json`
        - `form` > `application/x-www-form-urlencoded`
    - `timeout` (`number`, optional): The request timeout.
- `callback` (`function`): The callback method used to handle the request result.

**Example**

```Javascript
TransX.request({
    method: 'POST',
    url: 'https://example.com/api',
    headers: {
        'Authorization': 'Bearer token'
    },
    body: {
        key: 'value'
    },
    contentType: 'json'
}, function(response) {
    TransX.log(response);
});
```

The format of the return results is { response, error }.

### 2.6 alert(title, message)

Displays an alert dialog with the specified title and message.

**Parameters**

- `title` (`string`): The title of the alert.
- `message` (`string`): The message content of the alert.

**Example**

```javascript
TransX.alert('Warning', 'This is an alert message.');
```

### 2.7 confirm(title, message, callback)

Displays a confirmation dialog with the specified title and message, and handles the user’s response with a callback.

**Parameters**

- title (string): The title of the confirmation dialog.
- message (string): The message content of the confirmation dialog.
- callback (function): The callback method used to handle the user’s response.

**Example**

```javascript
TransX.confirm('Confirm', 'Are you sure?', function(response) {
    if (response.confirmed) {
        TransX.log('User confirmed.');
    } else {
        TransX.log('User cancelled.');
    }
});
```

The return result is a dictionary, such as { “confirmed”: true }.

### 2.8 getFiles(callback)

Retrieve basic information about all localized language files in the project.

**Parameters**

- callback (function): A callback function to handle the response.

**Example**

```Javascript
 TransX.getFiles(function(response) {
     TransX.log(response);
 });
```

The format of the return result is as follows:

```json
[ 
    {
        "fileID": "File ID", 
        "name": "File Name", 
        "languages": ["en", "zh-Hans"] 
    }
]
```

### 2.9 getFile(fileID, callback)

Retrieve all localized strings for a specified file.

**Parameters**

- fileID (string): The file ID.
- callback (function): A callback function to handle the response.

**Example**

```Javascript
TransX.getFile('file ID', function(response) {
    TransX.log(response);
});
```

The format of the return result is as follows:

```json
{
    "fileID": "file ID",
    "name": "file name",
    "languages": ["en", "zh-Hans"],
    "groups": [
        {
            "name": "group name",
            "strings": [
                {
                    "key": "string key",
                    "const": "constant value (if any)",
                    "strings": {
                        "en": "English string",
                        "zh-Hans": "Simplified Chinese string"
                    }
                }
            ]
        }
    ]
}
```

### 2.10 getStrings(fileID, keys, callback)

Retrieve localized content from the specified file.

**Parameters**

- fileID (string): The file ID.
- keys (array): An array of string keys.
- callback (function): A callback function to handle the response.

**Example**

```Javascript
TransX.getStrings('file ID', ['string key'], function(response) {
    TransX.log(response);
});
```

The format of the return result is as follows:

```json
[
    {
        "key": "string key",
        "const": "constant value (if any)",
        "strings": {
            "en": "English string",
            "zh-Hans": "Simplified Chinese string"
        }
    },
    {
        "key": "string key",
        "const": "constant value (if any)",
        "strings": {
            "en": "English string",
            "zh-Hans": "Simplified Chinese string"
        }
    }
]
```

### 2.11 updating(fileStrings)

A method for inserting and updating localized multilingual files.

**Parameters**

- fileStrings (object): Information about the multilingual files to be updated.

**Example**

```Javascript
TransX.updating({
  "strategy": "all",
  "files": {
    "target file id1": [
      {
        "key": "xxxx",
        "strings": {
          "en": "xxxx",
          "zh-Hans": "xxxx",
          "zh-Hant": "xxxx"
        }
      }
    ],
    "target file id2": [
      {
        "key": "xxxx",
        "strings": {
          "en": "xxxx",
          "zh-Hans": "xxxx",
          "zh-Hant": "xxxx"
        }
      }
    ]
  }
});
```

The file IDs can be obtained using the getFiles method. 

The available operation strategies (Strategy) include the following. If not specified or specified incorrectly, the default is “all”:

- “all”: Import all new localized string content and update existing localized string content.
- “insertOnly”: Only insert localized string content that does not exist locally.
- “updateOnly”: Only update localized string content that already exists locally.

### 2.12 fileOpen(types, callback)

Select the required files from the local system.

**Parameters**

- types (array): Array of file types, supporting the following: json, csv, plist, text, xml.
- callback (function): Callback function to handle the response. The returned data format depends on the file type.

**Example**

```Javascript
TransX.fileOpen(['json'], function(response) {
    TransX.log(response);
});
```

Explanation of returned data format:

- For json and plist file types: Returns raw JSON format data.
- For text and xml file types: Returns the text content.
- For csv file types: Returns parsed data structure, formatted as follows:

```json
  {
    "header": [....], // Header
    "rowValues": [
      {
        "key": "value", // key is the current column header, value is the current row's value
        ...
      }
    ]
  }
```

### 2.13 terminate()

Method used to terminate the execution of the current custom script; not required for system scripts.

**Example**

```Javascript
TransX.terminate();
```
