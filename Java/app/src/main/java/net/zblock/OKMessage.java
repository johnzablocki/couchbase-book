package net.zblock;

public class OKMessage {

    public OKMessage(String message) {
        status = message;
    }

    private String status;
    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }
}
