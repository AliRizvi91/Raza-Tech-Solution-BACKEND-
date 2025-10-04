import express, { Request, Response } from "express";
import { upload } from "../middlewares/multerMddleware";
import { protect } from "../middlewares/authMiddleware";
import {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  Login,
  googleLogin,
  TokenVerification,
  ResendToken,
  SendMailForResetPassword,
  ResetPassword,
} from "../controllers/userControler";

const User_R = express.Router();

//___---- Get All Users ----___
User_R.route("/")
  .get(getAllUsers);

//___---- Signup ----___
User_R.route("/signup")
  .post(upload.single("image"), addUser);

//___---- Profile ----___
User_R.get("/profile", protect, async (req: Request, res: Response) => {
  try {
    // req.user is added by protect middleware (we should extend Express.Request type)
    if (!(req as any).user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No user data found" });
    }

    res.status(200).json({
      user: (req as any).user,
    });
  } catch (error: any) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Internal server error while retrieving profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

//___---- Auth & Tokens ----___
User_R.post("/login", Login);
User_R.post("/google-login", googleLogin);
User_R.post("/resend-token", ResendToken);
User_R.post("/mail-for-reset-password", SendMailForResetPassword);
User_R.post("/reset-password", ResetPassword);
User_R.post("/verify-token", TokenVerification);

//___---- CRUD by Id ----___
User_R.route("/:id")
  .get(getUser)
  .put(upload.single("image"), updateUser)
  .delete(deleteUser);

export default User_R;
