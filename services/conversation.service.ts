import Conversation, { IConversation } from '../mongodb/models/conversation';

/**
 * Create a conversation
 * @param {IConversation} conversationBody
 * @returns a Promise<any>(for now)
 * **/
export const createConversation = async (conversationBody: IConversation) =>
  Conversation.create(conversationBody);
