const jwt = require("jsonwebtoken");

function verifyToken(request, response, next) {
    // Check for token in cookies first
    let token = request.cookies.token;

    // If not in cookies, check Authorization header
    if (!token) {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }

    if (!token) {
        return response.status(401).json({ message: "Unauthorized. No token provided" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();

    } catch (error) {
        return response.status(401).json({ message: "expired or . Invalid token" })
    }
}

module.exports = verifyToken;