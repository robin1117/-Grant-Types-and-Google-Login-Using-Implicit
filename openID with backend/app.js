import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;
import userDB from "./userDB.json" with { type: "json" };
import sessionDB from "./sessionDB.json" with { type: "json" };
import fs from "node:fs/promises";
import { OAuth2Client } from "google-auth-library";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5500','http://127.0.0.1:5500'],
    credentials: true,
  }),
);

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = process.env.GOOGLE_REDIRECT_URI;
//setting-up Google client
let client = new OAuth2Client({
  // client_id: clientId,
  // client_secret: clientSecret,
  // redirectUri: redirectUrl
})


// grabing id_token from body which contains details of user. 
// we just need to verifiy it first using 'google-auth-library'
// its a jwk token having 3 parts
app.post('/get-id-token', async (req, res) => {
  try {

    let { id_token } = req.body
    // As we know google uses Asymmetric Crypography which is based on Public/Private key Architecture to sign the id_token.
    // So anyone can verifiy this jwt token with public key provided by google, googel-auth-library do the same thing for us.
    // JWT token itself is formed by combining 3 parts <header>, <payload>, <signatue> 
    // 'google-auth-library' first fetch the Public Key corressponding to 'Kid' present in <header>
    // And this is how Library could able to verify id token even without clientId , clientSecret, clientSecret

    let loginTicket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID // is this id_token intended for our application 
    })


    let { sub, email, name, picture } = loginTicket.payload;

    let existingSession = sessionDB.find(({ id, uid }) => uid == sub);

    if (existingSession) {
      res.cookie("sid", existingSession.id, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'None',
        secure: true

      });
      return res.status(200).json({ msg: 'sucess', isLogin: true })
    }

    let existingUser = userDB.find(({ id }) => id === sub);
    if (existingUser) {
      let id = crypto.randomUUID();
      sessionDB.push({ id, uid: sub });
      await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));
      res.cookie("sid", id, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'None',
        secure: true

      });
      return res.status(200).json({ msg: 'sucess', isLogin: true })
    }

    let createdUser = { id: sub, email, name, picture };
    userDB.push(createdUser);
    await fs.writeFile("./userDB.json", JSON.stringify(userDB, null, 2));

    let id = crypto.randomUUID();

    let createdSession = { id, uid: sub };
    sessionDB.push(createdSession);
    await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));

    res.cookie("sid", id, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'None',
      secure: true
    });
    return res.status(200).json({ msg: 'sucess', isLogin: true })

  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ msg: error.message, isLogin: false })
    // next(error)
  }

})



app.get("/profile", (req, res, next) => {
  let { sid } = req.cookies;
  console.log(sid);
  if (!sid) {
    return res.json({ data: "You are not logged in", isLogin: false });
  }
  let sessionInfo = sessionDB.find(({ id }) => id == sid);
  if (!sessionInfo) {
    return next({ data: "session not available", isLogin: false });
  }
  let userInfo = userDB.find(({ id }) => id == sessionInfo.uid);
  res.status(200).json({ data: userInfo, isLogin: true });
});

app.post("/logout", async (req, res, next) => {
  try {
    let { sid } = req.cookies;
    if (!sid) {
      return res.status(200).json({ msg: "logout sussess", isLogin: false });
    }
    let sessionIndex = sessionDB.findIndex(({ id }) => id == sid);
    sessionDB.splice(sessionDB, 1);
    await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));
    res.status(200).json({ msg: "logout sussess", isLogin: false });
  } catch (error) {
    res.status(200).json({ msg: "logout Failed", isLogin: true });
  }
});

//Error Handleding
app.use((err, req, res, next) => {
  console.log(err);
  res.json({ msg: "something went wrong", err: err.message });
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
