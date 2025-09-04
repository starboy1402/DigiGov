package com.govportal.backend.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // This handles validation errors from DTOs (e.g., @NotEmpty, @Past)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // This handles database errors, like a UNIQUE constraint violation (duplicate NID)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        // Check for specific constraint violation messages
        if (ex.getMostSpecificCause().getMessage().contains("Duplicate entry")) {
            if (ex.getMostSpecificCause().getMessage().contains("nid_number")) {
                 return new ResponseEntity<>("This NID number is already registered.", HttpStatus.BAD_REQUEST);
            }
             if (ex.getMostSpecificCause().getMessage().contains("email")) {
                 return new ResponseEntity<>("This email is already registered.", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>("A database error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // This handles our custom runtime exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
// ```

// **Step 2: Update the `CitizenProfileService` to be More Specific**
// Now, we just need to make sure our service throws the right kind of error. The `DataIntegrityViolationException` for the duplicate NID will be thrown automatically by the database, and our new handler will catch it. We don't need to change anything for that.

// The validation annotations (`@Past` on the date of birth) will also be handled automatically by our new handler. The code in your `CitizenProfileService` is already good to go.

// ---

// #### Part 2: Frontend (React)

// The frontend changes are very small. We just need to make sure our `alert` message displays the new, detailed error from the backend. The code for this is already correct in your `ProfilePage` component!

// ```javascript
// // This code inside your ProfilePage's handleSubmit is already correct!
// catch (error) { 
//     // error.message will now contain the custom message from the backend!
//     alert(`Failed to save profile: ${error.message}`);
// }
