//
// Translation Script
// This script translates input strings into specified target languages.
// It simulates the translation of strings provided in the input object and returns the results.
// Example: {
//   "com.auu.localization": {
//     "from": "zh-Hans",
//     "text": "你好",
//     "targets": ["en", "ja"]
//   }
// } -> {
//   "com.auu.localization": {
//     "en": "Hello",
//     "ja": "こんにちは"
//   }
// }

// 最大请求频率，每秒最多请求5次
var QPS = 5;

// 任务队列
var requestQueue = [];

// 是否正在处理队列
var processing = false;

// 计数器来跟踪所有请求是否完成
var totalTasks = 0;
var completedTasks = 0;

// 用于批量翻译的方法
function __translate__(taskID, params) {
    TransX.log(`Called with parameters: ${JSON.stringify(params)}`);
    
    if (typeof params !== 'object' || params === null) {
        TransX.log("Invalid parameters. Should be an object, e.g., {\"key\": {\"from\": \"\", \"text\": \"\", \"targets\": []}}");
        return;
    }
    
    const apiKey = "<#-- your api key --#>";
    const apiUrl = "https://api.niutrans.com/NiuTransServer/translation";

    var langMap = {
        "zh-Hans": "zh",
        "zh-Hant": "cht"
    };
    
    function makeLanguage(language) {
        return langMap[language] || language;
    }
    
    let translatedDict = {};
    
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            let entry = params[key];
            let targets = entry.targets;
            let text = entry.text;
            
            translatedDict[key] = {};
            
            for (let i = 0; i < targets.length; i++) {
                let requestData = {
                    "from": makeLanguage(entry["from"]),
                    "to": makeLanguage(targets[i]),
                    "apikey": apiKey,
                    "src_text": text
                };
                                
                totalTasks += 1;
                
                requestQueue.push(() => {
                    return new Promise((resolve, reject) => {
                        TransX.request({
                            "url": apiUrl,
                            "method": "POST",
                            "params": requestData
                        }, function (response) {
                            if (response.response) {
                                var resp = response.response;
                                if (resp && resp.tgt_text) {
                                    TransX.log(`Translation success: ${text} -> ${resp.tgt_text}`);
                                    translatedDict[key][targets[i]] = resp.tgt_text;
                                } else {
                                    var errorInfo = `Translation failed for ${text} from ${entry["from"]} to ${targets[i]}, message: ${resp.error_msg}, code: ${resp.error_code}`;
                                    TransX.log(errorInfo);
                                }
                            } else {
                                var errorInfo = `Translation failed for ${text} from ${entry["from"]} to ${targets[i]}, message: ${response.error}`;
                                TransX.log(errorInfo);
                            }
                            
                            completedTasks += 1;
                            if (completedTasks === totalTasks) {
                                TransX.log(JSON.stringify(translatedDict));
                                TransX.reply(taskID, translatedDict);
                            }
                            resolve();
                        });
                    });
                });
            }
        }
    }

    // 开始处理队列
    processQueue();
}

// 处理请求队列
function processQueue() {
    if (processing) return;
    processing = true;

    function executeBatch() {
        let promises = [];
        for (let i = 0; i < QPS && requestQueue.length > 0; i++) {
            let task = requestQueue.shift();
            promises.push(task());
        }

        Promise.all(promises).then(() => {
            if (requestQueue.length > 0) {
                TransX.asyncAfter(1, executeBatch); // 1秒后处理下一个批次
            } else {
                processing = false; // 无更多任务
            }
        });
    }

    executeBatch();
}

// translate 公共方法
function translate(taskID, watch, params) {
    totalTasks = 0;
    completedTasks = 0;
    __translate__(taskID, params);
}

// test 方法
function test(taskID, watch, params) {
    // 使用无效参数进行测试
    // translate(taskID, watch, "test"); // 示例错误参数
    
    // 使用有效参数进行测试
    translate(taskID, watch, {
        "key1": {
            "from": "zh-Hans",
            "text": "你好",
            "targets": ["ja", "en"]
        },
        "key2": {
            "from": "en",
            "text": "World",
            "targets": ["zh-Hans", "ja", "de"]
        }
    });
}
