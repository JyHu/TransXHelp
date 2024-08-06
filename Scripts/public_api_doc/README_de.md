# TransX Modul Verwendungsdokumentation

## 1. Modulbeschreibung

Das `TransX`-Modul enthält einige gängige Funktionen des [`JSBridge`](https://github.com/JyHu/JSBridge)-Moduls und bietet Methoden zum Protokollieren, asynchronen Aufrufen, Festlegen des Protokollierungslevels und zum Senden von HTTP-Anfragen. Im Folgenden finden Sie eine detaillierte Beschreibung und Beispiele zur Verwendung dieses Moduls.

## 2. Detaillierte Methodenbeschreibung

### 2.1 log(log, lv = 0)

Gibt Protokollinformationen aus.

**Parameter**

- `log` (`string`): Der auszugebende Protokollinhalt.
- `lv` (`number`, optional): Nachrichtenlevel, standardmäßig 0.

**Beispiel**

```javascript
TransX.log('Dies ist ein Debug-Protokoll.', 0);
TransX.log('Dies ist ein Debug-Protokoll');
```

### 2.2 reply(taskID, params)

Antwortet auf eine Nachricht mit der angegebenen Aufgaben-ID.

**Parameter**

- `taskID` (`number`): Die Aufgaben-ID.
- `params` (`any`): Die zurückgegebenen Parameter.

**Beispiel**

```Javascript
TransX.reply(1, any);
```

Das Format der Rückgabewerte hängt von den spezifischen Geschäftsanforderungen ab.

### 2.3 asyncAfter(seconds, callback)

Asynchroner Aufruf der angegebenen Rückruffunktion.

**Parameter**

- `seconds` (`number`): Verzögerungszeit in Sekunden.
- `callback` (`function`): Die Rückruffunktion.

**Beispiel**

```Javascript
TransX.asyncAfter(1, function() {
    TransX.log('Rückruf nach 1 Sekunde ausgeführt.');
});
```

### 2.4 setLogLevel(level)

Legt das Protokollierungslevel fest.

**Parameter**

- `level` (`number`): Das Protokollierungslevel.

**Beispiel**

```Javascript
TransX.setLogLevel(3);
```

### 2.5 request(params, callback)

Sendet eine HTTP-Anfrage.

**Parameter**

- `params` (`object`): Die Anfrageparameter.
    - `method` (`string`): Die Anfragemethode (z. B. `GET`, `POST`, `PUT`, `DELETE` usw.).
    - `url` (`string`): Das Ziel-URL der Anfrage.
    - `headers` (`object`, optional): Die Anfrageheader, die Metainformationen wie den Inhaltstyp, die Autorisierung usw. enthalten.
    - `params` (`object`, optional): Anfrageparameter
    - `contentType` (`string`, optional): Der Inhaltstyp des Anfragekörpers, mögliche Werte:
        - `json` > `application/json`
        - `form` > `application/x-www-form-urlencoded`
    - `timeout` (`number`, optional): Die Anfrage-Timeout-Zeit.
- `callback` (`function`): Die Rückruffunktion zur Verarbeitung des Anfrageergebnisses.

**Beispiel**

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

Das Format der Rückgabewerte lautet { response, error }.

### 2.6 alert(title, message)

Zeigt einen Alarmdialog mit dem angegebenen Titel und der angegebenen Nachricht an.

**Parameter**

- title (string): Der Titel des Alarms.
- message (string): Der Nachrichtentext des Alarms.

**Beispiel**

```Javascript
TransX.alert('Warnung', 'Dies ist eine Alarmmeldung.');
```

### 2.7 confirm(title, message, callback)

Zeigt einen Bestätigungsdialog mit dem angegebenen Titel und der angegebenen Nachricht an und verarbeitet die Antwort des Benutzers mit einem Callback.

**Parameter**

- title (string): Der Titel des Bestätigungsdialogs.
- message (string): Der Nachrichtentext des Bestätigungsdialogs.
- callback (function): Die Callback-Methode zur Verarbeitung der Antwort des Benutzers.

**Beispiel**

```javascript
TransX.confirm('Bestätigen', 'Sind Sie sicher?', function(response) {
    if (response.confirmed) {
        TransX.log('Benutzer hat bestätigt.');
    } else {
        TransX.log('Benutzer hat abgebrochen.');
    }
});
```

Das Rückgabewert ist ein Wörterbuch, wie z.B. { “confirmed”: true }.

### 2.8 getFiles(callback)

Abrufen grundlegender Informationen über alle lokalisierte Sprachdateien im Projekt.

**Parameter**

- callback (function): Eine Callback-Funktion zur Verarbeitung der Antwort.

**Beispiel**

```Javascript
 TransX.getFiles(function(response) {
     TransX.log(response);
 });
```

Das Format des Rückgabewertes ist wie folgt:

```json
[ 
    {
        "fileID": "Datei ID", 
        "name": "Dateiname", 
        "languages": ["en", "zh-Hans"] 
    }
]
```

### 2.9 getFile(fileID, callback)

Abrufen aller lokalisierten Zeichenfolgen für eine angegebene Datei.

**Parameter**

- fileID (string): Die Datei-ID.
- callback (function): Eine Callback-Funktion zur Verarbeitung der Antwort.

**Beispiel**

```Javascript
TransX.getFile('Datei ID', function(response) {
    TransX.log(response);
});
```

Das Format des Rückgabewertes ist wie folgt:

```json
{
    "fileID": "Datei ID",
    "name": "Dateiname",
    "languages": ["en", "zh-Hans"],
    "groups": [
        {
            "name": "Gruppenname",
            "strings": [
                {
                    "key": "Zeichenfolgen-Schlüssel",
                    "const": "Konstantenwert (falls vorhanden)",
                    "strings": {
                        "en": "Englische Zeichenfolge",
                        "zh-Hans": "Vereinfachtes Chinesisch"
                    }
                }
            ]
        }
    ]
}
```

### 2.10 getStrings(fileID, keys, callback)

Rufen Sie lokalisierte Inhalte aus der angegebenen Datei ab.

**Parameter**

- fileID (string): Die Datei-ID.
- keys (array): Ein Array von Zeichenfolgen-Schlüsseln.
- callback (function): Eine Callback-Funktion zur Verarbeitung der Antwort.

**Beispiel**

```Javascript
TransX.getStrings('Datei ID', ['Zeichenfolgen-Schlüssel'], function(response) {
    TransX.log(response);
});
```

Das Format des Rückgabewertes ist wie folgt:

```json
[
    {
        "key": "Zeichenfolgen-Schlüssel",
        "const": "Konstantenwert (falls vorhanden)",
        "strings": {
            "en": "Englische Zeichenfolge",
            "zh-Hans": "Vereinfachtes Chinesisch"
        }
    },
    {
        "key": "Zeichenfolgen-Schlüssel",
        "const": "Konstantenwert (falls vorhanden)",
        "strings": {
            "en": "Englische Zeichenfolge",
            "zh-Hans": "Vereinfachtes Chinesisch"
        }
    }
]
```

### 2.11 updating(fileStrings)

Eine Methode zum Einfügen und Aktualisieren lokalisierter mehrsprachiger Dateien.

**Parameter**

- fileStrings (object): Informationen über die zu aktualisierenden mehrsprachigen Dateien.

**Beispiel**

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

Die Datei-IDs können mit der Methode getFiles abgerufen werden; 

die verfügbaren Strategien (Strategy) umfassen die folgenden. Wenn nicht angegeben oder falsch angegeben, lautet die Standardeinstellung “all”:

- “all”: Importiert alle neuen lokalisierten Zeichenfolgen und aktualisiert bestehende lokalisierte Zeichenfolgen.
- “insertOnly”: Fügt nur lokalisierte Zeichenfolgen hinzu, die lokal nicht vorhanden sind.
- “updateOnly”: Aktualisiert nur lokalisierte Zeichenfolgen, die bereits lokal vorhanden sind.

### 2.12 fileOpen(types, callback)

Wählen Sie die benötigten Dateien aus dem lokalen System aus.

**Parameter**

- types (array): Array von Dateitypen, die folgende unterstützen: json, csv, plist, text, xml.
- callback (function): Callback-Funktion zur Bearbeitung der Antwort. Das zurückgegebene Datenformat hängt vom Dateityp ab.

**Beispiel**

```Javascript
TransX.fileOpen(['json'], function(response) {
    TransX.log(response);
});
```

Erläuterung des zurückgegebenen Datenformats:

- Für json- und plist-Dateitypen: Gibt Rohdaten im JSON-Format zurück.
- Für text- und xml-Dateitypen: Gibt den Textinhalt zurück.
- Für csv-Dateitypen: Gibt die analysierte Datenstruktur im folgenden Format zurück:

```json
  {
    "header": [....], // Kopfzeile
    "rowValues": [
      {
        "key": "value", // key ist die aktuelle Spaltenüberschrift, value ist der Wert der aktuellen Zeile
        ...
      }
    ]
  }
```

### 2.13 terminate()

Methode zum Beenden der Ausführung des aktuellen benutzerdefinierten Skripts; für Systemskripte nicht erforderlich.

**Beispiel**

```Javascript
TransX.terminate();
```
