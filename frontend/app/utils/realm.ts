import * as Realm from "realm-web";

export function initializeRealm() {
  const realmApp = new Realm.App({ id: "bookmarks-app-wjney" });

  realmApp.logIn(Realm.Credentials.anonymous());

  // authenticate using anonymous user
  realmApp.logIn(Realm.Credentials.anonymous());

  return realmApp;
}

export async function bookmarksChanges<T>(callback: (document: T) => void) {
  const realmApp = initializeRealm();

  if (realmApp.currentUser) {
    const mongodb = realmApp.currentUser.mongoClient("mongodb-atlas");
    const bookmarksCollection = mongodb.db("bookmarks").collection("bookmarks");

    const changeStream = bookmarksCollection.watch({
      filter: {
        operationType: "update",
        "updateDescription.updatedFields.summary": { $exists: true },
      },
    });

    for await (const change of changeStream) {
      // @ts-ignore: fullDocument exists on the change
      callback(change?.fullDocument as T);
    }
  }
}
