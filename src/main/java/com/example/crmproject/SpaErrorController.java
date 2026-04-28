package com.example.crmproject;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
public class SpaErrorController implements ErrorController {
    @RequestMapping("/error")
    public Object handleError(HttpServletRequest request) {
        String path = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        int statusCode = readStatusCode(request);

        if (statusCode == HttpStatus.NOT_FOUND.value() && shouldServeSpa(path, request.getHeader("Accept"))) {
            return "forward:/index.html";
        }

        HttpStatus status = HttpStatus.resolve(statusCode);
        if (status == null) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return ResponseEntity.status(status).body(Map.of(
                "status", status.value(),
                "error", status.getReasonPhrase()
        ));
    }

    private int readStatusCode(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (status instanceof Integer statusCode) {
            return statusCode;
        }
        return HttpStatus.INTERNAL_SERVER_ERROR.value();
    }

    private boolean shouldServeSpa(String path, String acceptHeader) {
        if (path == null || path.startsWith("/api/") || path.equals("/api")) {
            return false;
        }
        if (path.contains(".")) {
            return false;
        }
        return acceptHeader == null || acceptHeader.contains("text/html") || acceptHeader.contains("*/*");
    }
}
