# TransX 模塊使用文檔

## 1. 模塊說明
`TransX` 模塊封裝了 [`JSBridge`](https://github.com/JyHu/JSBridge) 模塊的一些常用功能，提供了日誌輸出、異步調用、設置日誌等級和發起 HTTP 請求的方法。以下是該模塊的詳細說明和使用示例。

## 2. 方法詳細說明

### 2.1 log(log, lv = 0)

輸出日誌信息。

**參數**

- `log` (`string`): 輸出的日誌內容。
- `lv` (`number`, 可選): 消息等級，默認為 0。

**示例**

```javascript
TransX.log('This is a debug log.', 0);
TransX.log('This is a debug log');
```

### 2.2 reply(taskID, params)

回復指定任務 ID 的消息。

**參數**

- `taskID` (`number`): 任務 ID。
- `params` (`any`): 回傳的參數。

**示例**

```Javascript
TransX.reply(1, any);
```

返回結果格式依據具體業務需求而定。

### 2.3 asyncAfter(seconds, callback)

異步調用指定的回調方法。

**參數**

- `seconds` (`number`): 延遲時間（秒）。
- `callback` (`function`): 回調方法。

**示例**

```Javascript
TransX.asyncAfter(1, function() {
    TransX.log('Callback executed after 1 second.');
});
```

### 2.4 setLogLevel(level)

設置日誌等級。

**參數**

- `level` (`number`): 日誌等級。

**示例**

```Javascript
TransX.setLogLevel(3);
```

### 2.5 request(params, callback)

發起 HTTP 請求。

**參數**

- `params` (`object`): 請求參數。
    - `method` (`string`): 請求方法（例如 `GET`、`POST`、`PUT`、`DELETE` 等）。
    - `url` (`string`): 請求的目標`URL`。
    - `headers` (`object`, 可選): 請求頭，包含一些元信息，如內容類型、授權信息等。
    - `params` (`object`, 可選): 請求參數
    - `contentType` (`string`, 可選): 請求體的內容類型，可選值：
        - `json` > `application/json`
        - `form` > `application/x-www-form-urlencoded`
    - `timeout` (`number`, 可選): 請求超時時間。
- `callback` (`function`): 回調方法，用於處理請求結果。

**示例**

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

返回結果格式為 { response, error }。

### 2.6 alert(title, message)

顯示一個警告對話框，包含指定的標題和信息內容。

**參數**

- title (string): 警告框的標題。
- message (string): 警告框的信息內容。

**示例**

```Javascript
TransX.alert('警告', '這是一個警告信息。');
```

### 2.7 confirm(title, message, callback)

顯示一個確認對話框，包含指定的標題和信息內容，並使用回調處理用戶的響應。

**參數**

- title (string): 確認對話框的標題。
- message (string): 確認對話框的信息內容。
- callback (function): 處理用戶響應的回調方法。

**示例**

```Javascript
TransX.confirm('確認', '你確定嗎?', function(response) {
    if (response.confirmed) {
        TransX.log('用戶已確認。');
    } else {
        TransX.log('用戶已取消。');
    }
});
```

返回結果為一個字典，如 { "confirmed": true }。

### 2.8 getFiles(callback)

獲取項目中所有的本地化語言文件基本信息。

**參數**

- callback (function): 處理響應的回調函數。

**示例**

```Javascript
 TransX.getFiles(function(response) {
     TransX.log(response);
 });
```

返回結果格式如：

```json
[ 
    {
        "fileID": "文件 ID", 
        "name": "文件名", 
        "languages": ["en", "zh-Hans"] 
    }
]
```

### 2.9 getFile(fileID, callback)

獲取指定文件的所有本地化字符串。

**參數**

- fileID (string): 文件 ID。
- callback (function): 處理響應的回調函數。

**示例**

```Javascript
TransX.getFile('文件 ID', function(response) {
    TransX.log(response);
});
```

返回結果格式如：

```json
{
    "fileID": "文件 ID",
    "name": "文件名",
    "languages": ["en", "zh-Hans"],
    "groups": [
        {
            "name": "組名",
            "strings": [
                {
                    "key": "字符串鍵",
                    "const": "常量值（如果存在）",
                    "strings": {
                        "en": "英文字符串",
                        "zh-Hans": "簡體中文字符串"
                    }
                }
            ]
        }
    ]
}
```

### 2.10 getStrings(fileID, keys, callback)

獲取指定文件下的本地化內容。

**參數**

- fileID (string): 文件 ID。
- keys (array): 字符串鍵數組。
- callback (function): 處理響應的回調函數。

**示例**

```Javascript
TransX.getStrings('文件 ID', ['字符串鍵'], function(response) {
    TransX.log(response);
});
```

返回結果格式如：

```json
[
    {
        "key": "字符串鍵",
        "const": "常量值（如果存在）",
        "strings": {
            "en": "英文字符串",
            "zh-Hans": "簡體中文字符串"
        }
    },
    {
        "key": "字符串鍵",
        "const": "常量值（如果存在）",
        "strings": {
            "en": "英文字符串",
            "zh-Hans": "簡體中文字符串"
        }
    }
]
```

### 2.11 updating(fileStrings)

用於插入、更新本地化多語言文件的方法。

**參數**

- fileStrings (object): 用於更新的多語言文件信息。

**示例**

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

其中文件id可以通過`getFiles`方法獲取；
操作策略（Strategy）有以下幾種策略可用，如果未指定或指定錯誤，則默認為 "all":
- "all": 導入所有新的本地化字符串內容並更新已存在的本地化字符串內容。
- "insertOnly": 僅插入本地沒有的本地化字符串內容。
- "updateOnly": 僅更新本地已經存在的本地化字符串內容。

### 2.12 fileOpen(types, callback)

從本地選取需要的文件。

**參數**

- types (array): 文件類型數組，支持以下幾種：json、csv、plist、text、xml。
- callback (function): 處理響應的回調函數。根據不同的文件類型，返回相應的數據格式。

**示例**

```Javascript
TransX.fileOpen(['json'], function(response) {
    TransX.log(response);
});
```

 返回數據格式說明：
 
 - 對於 json 和 plist 類型的文件：返回原始的 JSON 格式數據。
 - 對於 text 和 xml 類型的文件：返回文本內容。
 - 對於 csv 類型的文件：返回解析後的數據結構，格式如下：
 
 ```
   {
     "header": [....], // 表頭
     "rowValues": [
       {
         "key": "value", // key 為當前列的表頭，value為當前行的值
         ...
       }
     ]
   }
```

### 2.13 terminate()

用於終止當前自定義腳本執行的方法；對於系統腳本不需要調用。

**示例**

```Javascript
TransX.terminate();
```
