import jwt from "jsonwebtoken";
import customError from "../utils/customError.js";
import User from "../models/user.js";
import UserProfile from "../models/userProfile.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(customError(401, "No Token Provided"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return next(customError(404, "User Not Found"));
    }
    req.user = { userId: payload.userId, username: payload.username };

    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return next(customError(401, "Token Expired"));
    }
    return next(customError(401, "Invalid Token"));
  }
};

const isAdminOrDriver = async (req, res, next) => {
  const { userId } = req.user;
  const user = await User.findById(userId);

  if (!user || (user.role !== "admin" && user.role !== "driver")) {
    return next(customError(401, "Unauthorized"));
  }

  next();
};

const isAdmin = async (req, res, next) => {
  const { userId } = req.user;
  const userProfile = await UserProfile.findOne({ userId }).populate({
    path: "userId",
  });

  if (!userProfile || userProfile.userId.role !== "admin") {
    return next(customError(401, "Unauthorized, Admin Only"));
  }

  next();
};

export { auth, isAdmin, isAdminOrDriver };
