# Localization Best Practices Guide

When developing Xcode projects, localization is a common and essential task. Adopting good practices can significantly improve development efficiency and prevent low-level coding issues. This guide will introduce some best practices for localization in Xcode projects.

## 0x01 Localization Methods

When localizing Xcode projects, you typically use the NSLocalizedString series of methods, for example:

```
NSLocalizedString("com.auu.localization.username", comment: "username")
```

To simplify usage, you can encapsulate these methods. Here is an example:

```
/// Localizes a given key and replaces placeholders with provided values.
///
/// - Parameters:
///   - key: The key used to look up the localized string.
///   - replaced: An optional dictionary of placeholder keys and their corresponding replacement values. Default is nil.
///   - comment: An optional comment that provides context for the localized string. Default is an empty string.
/// - Returns: The localized string with placeholders replaced by their corresponding values, if any.
///
/// This function retrieves a localized string based on the provided key and replaces placeholders within the string
/// with the values specified in the `replaced` dictionary. Placeholders are in the format `${key}`.
///
/// Example:
/// ```swift
/// let localizedString = LL("welcome_message", replaced: ["username": "John"], comment: "A welcome message with the user's name.")
/// print(localizedString) // Output: "Welcome, John!"
/// ```
///
/// The localization file (e.g., Localizable.strings) might contain:
/// ```
/// "welcome_message" = "Welcome, ${username}!";
/// ```

func LL(_ key: String, replaced: [String: Any]? = nil, comment: String = "") -> String {
    /// Converts any value to a string.
    ///
    /// - Parameter value: The value to be converted.
    /// - Returns: The string representation of the value.
    func stringify(_ value: Any) -> String {
        if let value = value as? String {
            return value
        }
        
        if let value = value as? CustomStringConvertible {
            return value.description
        }
        
        return String(describing: value)
    }
    
    // Check if there are any placeholders to replace.
    if let replaced, replaced.count > 0 {
        // Retrieve the localized string for the given key.
        var text = NSLocalizedString(key, comment: comment)
        
        // Replace each placeholder with its corresponding value.
        for (key, value) in replaced {
            text = text.replacingOccurrences(of: "${\(key)}", with: stringify(value))
        }
        
        return text
    }
    
    // Return the localized string if there are no placeholders to replace.
    return NSLocalizedString(key, comment: comment)
}
```

## 0x02 Defining Multilingual String Keys

![](./imgs/00.png)

### 1. Literal Keys

When defining multilingual string keys, you can choose to use literal keys, for example:

```
"你好" = "你好";
"你好" = "Hello";
```

The advantage of this method is that the key itself is self-explanatory. However, there are significant drawbacks:

1. Literal keys can be lengthy, making the code cumbersome.
2. If the key’s corresponding value changes, the literal key may no longer match the actual content, leading to confusion.

### 2. General String Keys

A better approach is to use a general string key with a unified naming convention, for example:

```
"com.auu.localization.greet" = "你好";
"com.auu.localization.greet" = "Hello";
```

With this approach, you ensure that the key remains consistent regardless of changes to the corresponding value.

## 0x03 Content Entry and Management

To support multiple languages, you need to add corresponding localized content for each language, for example:

```
"com.auu.localization.greet" = "xxxx";
```

If many languages are supported, switching between files can be cumbersome. Moreover, you must ensure that all languages have consistent keys and corresponding content. Missing or incorrect keys can cause issues in the respective language environment.

When using localized strings, such as LL("com.auu.localization.greet"), you must write the key accurately. However, the compiler does not check the content of string keys, and manually writing keys in multiple places can easily lead to errors.

## 0x04 Using Constants

Using constants can effectively avoid these issues. For example:

```
let lLocalizationLanguageNameKey = "com.auu.localization.language"
```

In use, it can be written as:

```
LL(lLocalizationLanguageNameKey)
```

This way, you only need to define the string constant in one place, making it very convenient to use.

## 0x05 Advantages of Using Constants

1. Avoid Spelling Errors

Directly using string keys makes it difficult to catch spelling errors since the compiler does not check the string content. Using constants avoids these errors because the compiler checks variable names.

2. Ease of Maintenance and Modification

If a string key needs to be changed, you would need to find and modify every occurrence of the key if using string literals. With constants, you only need to change the constant value, and all references will automatically update, significantly improving maintenance efficiency.

3. Higher Code Readability

Constant names are usually more descriptive than string keys, making it easier to understand the purpose of the string. For example, lLocalizationLanguageNameKey is more intuitive and memorable than "com.auu.localization.language".

4. Centralized Management

Defining all localization keys in one place (such as a constants file) facilitates management. This approach allows developers to have a clear overview of the localization keys and their purposes in the project.

5. Increased Code Consistency

Using constants ensures consistency when using the same key across different files and modules. Even with multiple developers working on the project, using constants ensures everyone references the same key, avoiding discrepancies due to personal habits or memory errors.

The advantages of using constants over directly using string keys include avoiding spelling errors, ease of maintenance and modification, improved code readability, centralized management, and increased code consistency. These benefits not only enhance development efficiency but also reduce bugs caused by spelling errors, improving code maintainability and readability.

By defining all localization string keys as constants, developers can focus more on business logic without worrying about the spelling and consistency of string keys. This is especially important for large projects and team collaboration.