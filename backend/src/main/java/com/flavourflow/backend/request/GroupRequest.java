package com.flavourflow.backend.request;

public class GroupRequest {
    private String name;
    private String description;

    public GroupRequest() {
    }

    public GroupRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "GroupRequest [name=" + name + ", description=" + description + "]";
    }
}
