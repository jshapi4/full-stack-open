```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa and JSON Payload with form submission data
    activate server
    server->>browser: 201 Created, notes updated
```
