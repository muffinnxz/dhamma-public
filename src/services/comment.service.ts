import admin from "@/lib/firebase-admin";
import { Comment } from "@/interfaces/comment";
export const createComment = async (userId: string, placeId: string, comment: string) => {
    const fs = admin.firestore();
    const commentRef = fs.collection("comments").doc();

    const newComment = {
        id: commentRef.id,
        userId: userId,
        placeId: placeId,
        comment: comment,
        createdAt: new Date(),
    };
    await commentRef.set(newComment);
    return newComment;
}

export const getCommentsByPlaceId = async (placeId: string): Promise<Array<Comment> | null> => {
  const fs = admin.firestore();
  const commentsRef = await fs.collection("comments").where("placeId", "==", placeId).get();
  return commentsRef.docs.map((doc) => doc.data() as Comment);
};

export const getCommentById = async (commentId: string): Promise<Comment | null> => {
  const fs = admin.firestore();
  const commentRef = await fs.collection("comments").doc(commentId).get();
  return commentRef.data() as Comment;
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  const fs = admin.firestore();
  try {
    await fs.collection("comments").doc(commentId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting comment: ", error);
    return false;
  }
};

export const updateComment = async (commentId: string, comment: string): Promise<Comment | null> => {
  const fs = admin.firestore();
  try {
    await fs.collection("comments").doc(commentId).update({ comment });
    const commentRef = await fs.collection("comments").doc(commentId).get();
    return commentRef.data() as Comment;
  } catch (error) {
    console.error("Error updating comment: ", error);
    return null;
  }
};
