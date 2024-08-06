# TransX 模块使用文档

## 1. 模块说明
`TransX` 模块封装了 [`JSBridge`](https://github.com/JyHu/JSBridge) 模块的一些常用功能，提供了日志输出、异步调用、设置日志等级和发起 HTTP 请求的方法。以下是该模块的详细说明和使用示例。

## 2. 方法详细说明

### 2.1 log(log, lv = 0)

输出日志信息。

**参数**

- `log` (`string`): 输出的日志内容。
- `lv` (`number`, 可选): 消息等级，默认为 0。

**示例**

```javascript
TransX.log('This is a debug log.', 0);
TransX.log('This is a debug log');
```

### 2.2 reply(taskID, params)

回复指定任务 ID 的消息。

**参数**

- `taskID` (`number`): 任务 ID。
- `params` (`any`): 回传的参数。

**示例**

```Javascript
TransX.reply(1, any);
```

返回结果格式依据具体业务需求而定。

### 2.3 asyncAfter(seconds, callback)

异步调用指定的回调方法。

**参数**

- `seconds` (`number`): 延迟时间（秒）。
- `callback` (`function`): 回调方法。

**示例**

```Javascript
TransX.asyncAfter(1, function() {
    TransX.log('Callback executed after 1 second.');
});
```

### 2.4 setLogLevel(level)

设置日志等级。

**参数**

- `level` (`number`): 日志等级。

**示例**

```Javascript
TransX.setLogLevel(3);
```

### 2.5 request(params, callback)

发起 HTTP 请求。

**参数**

- `params` (`object`): 请求参数。
    - `method` (`string`): 请求方法（例如 `GET`、`POST`、`PUT`、`DELETE` 等）。
    - `url` (`string`): 请求的目标`URL`。
    - `headers` (`object`, 可选): 请求头，包含一些元信息，如内容类型、授权信息等。
    - `params` (`object`, 可选): 请求参数
    - `contentType` (`string`, 可选): 请求体的内容类型，可选值：
        - `json` > `application/json`
        - `form` > `application/x-www-form-urlencoded`
    - `timeout` (`number`, 可选): 请求超时时间。
- `callback` (`function`): 回调方法，用于处理请求结果。

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

返回结果格式为 { response, error }。

### 2.6 alert(title, message)

显示一个警告对话框，包含指定的标题和信息内容。

**参数**

- title (string): 警告框的标题。
- message (string): 警告框的信息内容。

**示例**

```Javascript
TransX.alert('警告', '这是一个警告信息。');
```

### 2.7 confirm(title, message, callback)

显示一个确认对话框，包含指定的标题和信息内容，并使用回调处理用户的响应。

**参数**

- title (string): 确认对话框的标题。
- message (string): 确认对话框的信息内容。
- callback (function): 处理用户响应的回调方法。

**示例**

```Javascript
TransX.confirm('确认', '你确定吗?', function(response) {
    if (response.confirmed) {
        TransX.log('用户已确认。');
    } else {
        TransX.log('用户已取消。');
    }
});
```

返回结果为一个字典，如 { "confirmed": true }。

### 2.8 getFiles(callback)

获取项目中所有的本地化语言文件基本信息。

**参数**

- callback (function): 处理响应的回调函数。

**示例**

```Javascript
 TransX.getFiles(function(response) {
     TransX.log(response);
 });
```

返回结果格式如：

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

获取指定文件的所有本地化字符串。

**参数**

- fileID (string): 文件 ID。
- callback (function): 处理响应的回调函数。

**示例**

```Javascript
TransX.getFile('文件 ID', function(response) {
    TransX.log(response);
});
```

返回结果格式如：

```json
{
    "fileID": "文件 ID",
    "name": "文件名",
    "languages": ["en", "zh-Hans"],
    "groups": [
        {
            "name": "组名",
            "strings": [
                {
                    "key": "字符串键",
                    "const": "常量值（如果存在）",
                    "strings": {
                        "en": "英文字符串",
                        "zh-Hans": "简体中文字符串"
                    }
                }
            ]
        }
    ]
}
```

### 2.10 getStrings(fileID, keys, callback)

获取指定文件下的本地化内容。

**参数**

- fileID (string): 文件 ID。
- keys (array): 字符串键数组。
- callback (function): 处理响应的回调函数。

**示例**

```Javascript
TransX.getStrings('文件 ID', ['字符串键'], function(response) {
    TransX.log(response);
});
```

返回结果格式如：

```json
[
    {
        "key": "字符串键",
        "const": "常量值（如果存在）",
        "strings": {
            "en": "英文字符串",
            "zh-Hans": "简体中文字符串"
        }
    },
    {
        "key": "字符串键",
        "const": "常量值（如果存在）",
        "strings": {
            "en": "英文字符串",
            "zh-Hans": "简体中文字符串"
        }
    }
]
```

### 2.11 updating(fileStrings)

用于插入、更新本地化多语言文件的方法。

**参数**

- fileStrings (object): 用于更新的多语言文件信息。

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

其中文件id可以通过`getFiles`方法获取；
操作策略（Strategy）有以下几种策略可用，如果未指定或指定错误，则默认为 "all":
- "all": 导入所有新的本地化字符串内容并更新已存在的本地化字符串内容。
- "insertOnly": 仅插入本地没有的本地化字符串内容。
- "updateOnly": 仅更新本地已经存在的本地化字符串内容。

### 2.12 fileOpen(types, callback)

从本地选取需要的文件。

**参数**

- types (array): 文件类型数组，支持以下几种：json、csv、plist、text、xml。
- callback (function): 处理响应的回调函数。根据不同的文件类型，返回相应的数据格式。

**示例**

```Javascript
TransX.fileOpen(['json'], function(response) {
    TransX.log(response);
});
```

 返回数据格式说明：
 
 - 对于 json 和 plist 类型的文件：返回原始的 JSON 格式数据。
 - 对于 text 和 xml 类型的文件：返回文本内容。
 - 对于 csv 类型的文件：返回解析后的数据结构，格式如下：
 
 ```
   {
     "header": [....], // 表头
     "rowValues": [
       {
         "key": "value", // key 为当前列的表头，value为当前行的值
         ...
       }
     ]
   }
```

### 2.13 terminate()

用于终止当前自定义脚本执行的方法；对于系统脚本不需要调用。

**示例**

```Javascript
TransX.terminate();
```
