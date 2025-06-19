function postMessage(messageText) {
  db.collection("messages").add({
    text: messageText,
    replies: [],
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Сообщение добавлено в Firestore!");
  })
  .catch(error => {
    console.error("Ошибка отправки сообщения в Firestore: ", error);
  });
}
