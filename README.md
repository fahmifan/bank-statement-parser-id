# Bank PDF Statement Parser

This npm package is designed to parse Indonesian bank PDF statements, extracting relevant information such as transaction details, dates, amounts, and transaction types. It aims to simplify the process of extracting data from PDF statements issued by various banks in Indonesia.

## Installation

```
npm install @fahmifan/bank-pdf-statement-parser-id
```

## Usage
```tsx
import { parseBCAStatement } from "@fahmifan/bank-statement-parser-id";

async function parse(file: File) {
    const buf = await file.arrayBuffer()
    await parseBCAStatement(
        buf,
        askPasswordPrompt,
        askRetryPasswordPrompt,
    );
}


function askPasswordPrompt(): string {
    const pass = window.prompt(
        "The PDF is password protected. Please enter password to continue.",
    );
    return pass || "";
}

function askRetryPasswordPrompt(): string {
    const pass = window.prompt(
        "The password is incorrect. Please enter the correct password to continue.",
    );
    return pass || "";
}
```

Example project: [bank-statement-parser-example](https://github.com/fahmifan/bank-statement-parser-example)

## Supported Banks

- Bank Mandiri
- Bank BCA

## Contribution

Contributions are welcome! If you find a bank statement format that is not yet supported or have ideas for improvements, feel free to open an issue or submit a pull request.

## Disclaimer

This package is provided as-is without any warranty. While every effort has been made to ensure accurate parsing of PDF statements, the developers of this package are not responsible for any inaccuracies or errors in the parsed data. Always verify the extracted information with the original PDF statement for accuracy.

