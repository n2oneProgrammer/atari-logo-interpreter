# Gramar

- __statements__:  
    IDENTIFIER __expr__*?  
    __repeat-expr__  
    __func-def__  
    __ed-expr__  
    __tell-expr__  
    __ask-expr__  
  
- __expr__:  
    __term__ ((PLUS|MINUS) __term__)*?

- __term__:   
    __factor__ ((MUL|DIV) __factor__)*?

- __factor__:     
    (PLUS|MINUS)? __factor__   
    __atom__

- __atom__:  
    INT   
    COLON IDENTIFIER  
    LPAREN __expr__ RPAREN  
    KEWORD:WHO

- __ed-expr__:  
    KEYWORD:ED IDENTIFIER  
    KEYWORD:ED LSQUARE IDENTIFIER* RSQUARE

- __tell-expr__:  
    KEYWORD:TELL IDENTIFIER  
    KEYWORD:TELL LSQUARE IDENTIFIER* RSQUARE

- __ask-expr__:  
    KEYWORD:ASK LSQUARE IDENTIFIER* RSQUARE LSQUARE __statments__ RSQUARE

- __repeat-expr__:  
    KEYWORD:REPEAT __expr__ LSQUARE __statements__ RSQUARE

- __func-def__:  
    KEYWORD:TO IDENTIFIER (COLON IDENTIFIER)*? __statements__ KEYWORD:END 

## Legend
- `?` - optional
- `\` - one or more
- `|` - this or this
- CAPITAL - token
- __bold__ - other module
- Code starts at module __statements__
