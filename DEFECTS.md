Interactive mode 
- isn't '-i', thats fine, docs and help need update
- ✅ [FIXED] truncates input text, doesn't wait long enough for all the text to come in, or stops on newlines or something else? 
  - Fixed by changing the behavior to not exit on empty lines
  - Added timeout of ~5 seconds of inactivity to finish input mode
  - Updated help text to clarify that Ctrl+D/Ctrl+C can be used to finish input
- ✅ [FIXED] ctrl-c to quit doesn't work, but typing 'q' does, so thats fine. update docs/help/interactive help.
  - Updated help text to clarify exit options
