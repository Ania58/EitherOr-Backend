const admin = require("firebase-admin");

const verifyEmailAndUid = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedToken = await admin.auth().verifyIdToken(token);

    const firebaseUser = await admin.auth().getUser(decodedToken.uid);

    if (!firebaseUser.emailVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email." });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = verifyEmailAndUid;