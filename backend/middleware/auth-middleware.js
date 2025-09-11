import jwt from "jsonwebtoken";

// Helper function to verify the token
const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey);
};

// Middleware to authenticate the user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated",
        });
    }

    // Extract the token from the "Bearer" scheme
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing",
        });
    }

    try {
        // Verify the token using the secret key from the environment variables
        const payload = verifyToken(token, process.env.JWT_SECRET);

        // Attach the payload (user info) to the request object
        req.user = payload;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

export default authenticate;