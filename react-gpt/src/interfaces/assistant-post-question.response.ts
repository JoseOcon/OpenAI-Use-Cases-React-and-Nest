export interface AssistantPostQuestionResponse {
    role:    Role;
    content: string[];
}

export enum Role {
    Assistant = "assistant",
    User = "user",
}
