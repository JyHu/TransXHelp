# TransX モジュールの使用方法

## 1. モジュールの説明
`TransX` モジュールは [`JSBridge`](https://github.com/JyHu/JSBridge) モジュールの一部の一般的な機能をカプセル化し、ログの出力、非同期呼び出し、ログレベルの設定、HTTPリクエストの発行などのメソッドを提供します。以下に、このモジュールの詳細な説明と使用例を示します。

## 2. メソッドの詳細な説明

### 2.1 log(log, lv = 0)

ログ情報を出力します。

**パラメーター**

- `log` (`string`): 出力するログの内容。
- `lv` (`number`, オプション): メッセージのレベル。デフォルトは0です。

**例**

```javascript
TransX.log('これはデバッグログです。', 0);
TransX.log('これはデバッグログです。');
```

### 2.2 reply(taskID, params)

指定されたタスクIDのメッセージに返信します。

**パラメーター**

- `taskID` (`number`): タスクID。
- `params` (`any`): 返されるパラメーター。

**例**

```Javascript
TransX.reply(1, any);
```

返却結果の形式は、具体的なビジネス要件によって決まります。

### 2.3 asyncAfter(seconds, callback)

指定されたコールバックメソッドを非同期で呼び出します。

**パラメーター**

- `seconds` (`number`): 遅延時間（秒）。
- `callback` (`function`): コールバックメソッド。

**例**

```Javascript
TransX.asyncAfter(1, function() {
    TransX.log('1秒後にコールバックが実行されました。');
});
```

### 2.4 setLogLevel(level)

ログレベルを設定します。

**パラメーター**

- `level` (`number`): ログレベル。

**例**

```Javascript
TransX.setLogLevel(3);
```

### 2.5 request(params, callback)

HTTPリクエストを発行します。

**パラメーター**

- `params` (`object`): リクエストパラメーター。
    - `method` (`string`): リクエストメソッド（例：`GET`、`POST`、`PUT`、`DELETE`など）。
    - `url` (`string`): リクエストのターゲットURL。
    - `headers` (`object`, オプション): リクエストヘッダーには、コンテンツタイプ、認証情報などのいくつかのメタ情報が含まれます。
    - `params` (`object`, オプション): リクエストパラメーター
    - `contentType` (`string`, オプション): リクエストボディのコンテンツタイプ、次の値が選択できます：
        - `json` > `application/json`
        - `form` > `application/x-www-form-urlencoded`
    - `timeout` (`number`, オプション): リクエストのタイムアウト時間。
- `callback` (`function`): リクエスト結果を処理するためのコールバックメソッド。

**例**

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

返却結果の形式は { response, error } です。

### 2.6 alert(title, message)

指定されたタイトルとメッセージを含むアラートダイアログを表示します。

**パラメータ**

- title (string): アラートのタイトル。
- message (string): アラートのメッセージ内容。

**例**

```Javascript
TransX.alert('警告', 'これはアラートメッセージです。');
```

### 2.7 confirm(title, message, callback)

指定されたタイトルとメッセージを含む確認ダイアログを表示し、ユーザーの応答をコールバックで処理します。

**パラメータ**

- title (string): 確認ダイアログのタイトル。
- message (string): 確認ダイアログのメッセージ内容。
- callback (function): ユーザーの応答を処理するコールバックメソッド。

**例**

```Javascript
TransX.confirm('確認', 'よろしいですか？', function(response) {
    if (response.confirmed) {
        TransX.log('ユーザーが確認しました。');
    } else {
        TransX.log('ユーザーがキャンセルしました。');
    }
});
```

返却結果は { “confirmed”: true } のような辞書です。

### 2.8 getFiles(callback)

プロジェクト内のすべてのローカライズ言語ファイルの基本情報を取得します。

**パラメータ**

- callback (function): 応答を処理するコールバック関数。

**例**

```Javascript
 TransX.getFiles(function(response) {
     TransX.log(response);
 });
```

返却結果の形式は以下の通りです：

```json
[ 
    {
        "fileID": "ファイル ID", 
        "name": "ファイル名", 
        "languages": ["en", "zh-Hans"] 
    }
]
```

### 2.9 getFile(fileID, callback)

指定されたファイルのすべてのローカライズ文字列を取得します。

**パラメータ**

- fileID (string): ファイルID。
- callback (function): 応答を処理するコールバック関数。

**例**

```Javascript
TransX.getFile('ファイルID', function(response) {
    TransX.log(response);
});
```

返却結果の形式は以下の通りです：

```
{
    "fileID": "ファイルID",
    "name": "ファイル名",
    "languages": ["en", "zh-Hans"],
    "groups": [
        {
            "name": "グループ名",
            "strings": [
                {
                    "key": "文字列キー",
                    "const": "定数値（ある場合）",
                    "strings": {
                        "en": "英語の文字列",
                        "zh-Hans": "簡体字中国語の文字列"
                    }
                }
            ]
        }
    ]
}
```

### 2.10 getStrings(fileID, keys, callback)

指定されたファイルからローカライズされたコンテンツを取得します。

**パラメータ**

- fileID (string): ファイルID。
- keys (array): 文字列キーの配列。
- callback (function): 応答を処理するコールバック関数。

**例**

```Javascript
TransX.getStrings('ファイルID', ['文字列キー'], function(response) {
    TransX.log(response);
});
```

返却結果の形式は以下の通りです：

```json
[
    {
        "key": "文字列キー",
        "const": "定数値（ある場合）",
        "strings": {
            "en": "英語の文字列",
            "zh-Hans": "簡体字中国語の文字列"
        }
    },
    {
        "key": "文字列キー",
        "const": "定数値（ある場合）",
        "strings": {
            "en": "英語の文字列",
            "zh-Hans": "簡体字中国語の文字列"
        }
    }
]
```

### 2.11 updating(fileStrings)

ローカライズされた多言語ファイルを挿入および更新するためのメソッドです。

**パラメータ**

- fileStrings (object): 更新する多言語ファイルの情報。

**例**

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

ファイルIDはgetFilesメソッドを使用して取得できます。

操作戦略（Strategy）には以下のような戦略があります。指定されていない場合、または間違って指定された場合、デフォルトは”all”です：

- “all”: すべての新しいローカライズされた文字列コンテンツをインポートし、既存のローカライズされた文字列コンテンツを更新します。
- “insertOnly”: ローカルに存在しないローカライズされた文字列コンテンツのみを挿入します。
- “updateOnly”: すでにローカルに存在するローカライズされた文字列コンテンツのみを更新します。

### 2.12 fileOpen(types, callback)

ローカルから必要なファイルを選択します。

**パラメータ**

- types (array): ファイルタイプの配列。json、csv、plist、text、xmlのいずれかをサポートします。
- callback (function): レスポンスを処理するコールバック関数。ファイルタイプに応じて返されるデータフォーマットが異なります。

**例**

```Javascript
TransX.fileOpen(['json'], function(response) {
    TransX.log(response);
});
```

返されるデータフォーマットの説明：

- jsonおよびplistタイプのファイルの場合：元のJSON形式のデータを返します。
- textおよびxmlタイプのファイルの場合：テキスト内容を返します。
- csvタイプのファイルの場合：次のような解析されたデータ構造を返します：

```json
  {
    "header": [....], // ヘッダー
    "rowValues": [
      {
        "key": "value", // keyは現在の列のヘッダー、valueは現在の行の値
        ...
      }
    ]
  }
```

### 2.13 terminate()

現在のカスタムスクリプトの実行を終了するためのメソッドです。システムスクリプトには呼び出す必要はありません。

**例**

```Javascript
TransX.terminate();
```
