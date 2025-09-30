import { Observable } from "@nativescript/core";
const Sqlite = require("nativescript-sqlite");

let db = null;

export function onNavigatingTo(args) {
  const page = args.object;
  page.bindingContext = new Observable();

  if (!db) {
    new Sqlite("mydb.db").then(database => {
      db = database;
      db.execSQL("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
      db.execSQL("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", "1234"]);
    });
  }
}

export function onLogin(args) {
  const page = args.object.page;
  const username = page.getViewById("username").text;
  const password = page.getViewById("password").text;
  const messageLabel = page.getViewById("message");

  db.get("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, row) => {
    if (row) {
      messageLabel.text = `✅ Bienvenido ${row[1]}`;
    } else {
      messageLabel.text = "❌ Usuario o contraseña incorrectos";
    }
  });
}
