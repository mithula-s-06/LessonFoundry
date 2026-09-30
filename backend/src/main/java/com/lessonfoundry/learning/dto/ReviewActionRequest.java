package com.lessonfoundry.learning.dto;

public class ReviewActionRequest {
    private String reason;

    public ReviewActionRequest() {}

    public ReviewActionRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
