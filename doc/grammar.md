# Grammar

- **statements**:
  **statement**\*

- **statement**:
  IDENTIFIER **expression**\*?  
   **repeat-expr**  
   **func-def**  
   **ed-expr**  
   **tell-expr**  
   **ask-expr**  
   **save-load-expr**
  **each**

- **expression**:  
   **term** ((PLUS|MINUS) **term**)\*?

- **term**:  
   **factor** ((MUL|DIV) **factor**)\*?

- **factor**:  
   (PLUS|MINUS)? **factor**  
   **atom**

- **atom**:  
   INT  
   COLON IDENTIFIER  
   LPAREN **expr** RPAREN  
   KEWORD:WHO

- **ed-expr**:  
   KEYWORD:ED IDENTIFIER  
   KEYWORD:ED LSQUARE IDENTIFIER\* RSQUARE

- **tell-expr**:  
   KEYWORD:TELL **expr**  
   KEYWORD:TELL LSQUARE **expr**\* RSQUARE

- **ask-expr**:  
   KEYWORD:ASK LSQUARE **expr**\* RSQUARE LSQUARE **statments** RSQUARE

- **repeat-expr**:  
   KEYWORD:REPEAT **expression** LSQUARE **statements** RSQUARE

- **func-def**:  
   KEYWORD:TO IDENTIFIER (COLON IDENTIFIER)\*? **statements** KEYWORD:END

- **save-load-expr**
  (KEYWORD:SAVE|KEYWORD:LOAD) PATH

- **each**
  KEYWORD:EACH LSQUARE **statments** RSQUARE

## Legend

- `?` - optional
- `\` - one or more
- `|` - this or this
- CAPITAL - token
- **bold** - other module
- Code starts at module **statements**
