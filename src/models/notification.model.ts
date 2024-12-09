import { TComment } from "./comment.model";
import { TPost } from "./post.model";

export enum ENotificationType {
  REACTION = 'REACTION',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  SYSTEM = 'SYSTEM'
};


export type TNotification = {
  type?: ENotificationType;
  id: number;
  createdAt: Date;
  read: boolean;
  itemId: number | null;
  messageTitle: string | null;
  messageContent: string | null;
} & ({post: TPost, itemType: 'post'}| {comment: TComment, itemType: 'comment'})