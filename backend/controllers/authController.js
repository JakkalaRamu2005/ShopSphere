const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

async function findUserByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}


exports.register = async (request, response) => {
    try {
        const { name, email, password } = request.body;
// console.log(request.body);
        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return response.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name || null, email, hashedPassword]

        );
        return response.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }

}

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;
console.log(request.body);
        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        console.log('Generated JWT for user', user.id, ':', token);

        response.cookie('token', token,{
            httpOnly: true,
            secure: false, 
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        })
        return response.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }
   
};


exports.logout = (request,response) => {
    response.clearCookie('token');
    return response.status(200).json({message: "Logout successful"});
}