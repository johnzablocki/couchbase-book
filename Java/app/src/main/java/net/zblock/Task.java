package net.zblock;

import java.util.Date;

public class Task {

    private String id;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    private String title;
    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    private String description;
    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private String parentId;
    public String getParentId() {
        return this.parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    private Boolean isComplete;
    public Boolean getIsComplete() {
        return this.isComplete;
    }

    public void setIsComplete(Boolean isComplete) {
        this.isComplete = isComplete;
    }

    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    
    private Date dueDate;

    public Date getDueDate() {
        return this.dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
}