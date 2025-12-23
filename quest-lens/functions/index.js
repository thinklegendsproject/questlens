/**
 * This file contains stubbed-out Cloud Functions for Firebase.
 * These functions need to be deployed using the Firebase CLI.
 *
 * To deploy, you would typically run the following commands in your terminal,
 * from the root of your project directory:
 *
 * 1. firebase login
 * 2. firebase init functions
 * 3. (Copy this code into the generated index.js)
 * 4. firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Triggered when a new user is created.
 * This function creates a corresponding user profile document in Firestore.
 */
exports.onUserCreate = functions.auth.user().onCreate((user) => {
  const userProfile = {
    email: user.email,
    uid: user.uid,
    level: 1,
    xp: 0,
    coins: 100, // Starting coins
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  return admin.firestore().collection("users").doc(user.uid).set(userProfile);
});

/**
 * Triggered when a userQuest document's status changes to 'pending_validation'.
 * This function simulates AI validation by waiting a few seconds, then updates
 * the quest to 'completed' and awards the user with XP and coins.
 */
exports.onQuestSubmit = functions.firestore
  .document("userQuests/{userQuestId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    // We only care about transitions to 'pending_validation'
    if (newData.status !== "pending_validation" || previousData.status === "pending_validation") {
      return null;
    }

    const { userId, questId } = newData;

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay

    try {
      const db = admin.firestore();

      // Get the quest details to find out the rewards
      const questRef = db.collection("quests").doc(questId);
      const questDoc = await questRef.get();
      if (!questDoc.exists) {
        console.error(`Quest with ID ${questId} not found.`);
        return null;
      }
      const questData = questDoc.data();
      const { xp, coins } = questData;

      // Update the userQuest status
      await change.after.ref.update({ status: "completed" });

      // Award the user by updating their profile
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      await userRef.update({
        xp: admin.firestore.FieldValue.increment(xp),
        coins: admin.firestore.FieldValue.increment(coins),
      });

      // Create a social feed entry
      await db.collection("socialFeed").add({
        userId: userId,
        userName: userData.email, // Or a displayName if you have one
        questId: questId,
        questTitle: questData.title,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`User ${userId} completed quest ${questId} and earned ${xp} XP and ${coins} coins.`);
      return null;
    } catch (error) {
      console.error("Error during quest validation: ", error);
      return null;
    }
  });
