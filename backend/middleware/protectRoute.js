import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
try {
        // 1. Cek dari Cookie (untuk Web)
        let token = req.cookies.jwt;

        // 2. Cek dari Header (untuk Flutter/Mobile)
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Mengambil token setelah kata 'Bearer '
        }

        console.log("Token diterima backend:", token); // Cek terminal Node.js Anda

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");

		req.user = user;
		next();
	} catch (err) {
		console.log("Error in protectRoute middleware", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};