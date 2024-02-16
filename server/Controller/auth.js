import User from "../Model/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
    try {
        const  { 
            name,
            email, 
            password,
            profileImage
        } = req.body;


        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            profileImage
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser)

    } catch (error) {
        next(error)
    }
}

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            return res.json({msg: "Incorrect username or password", status: false});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.json({msg: "Incorrect username or password", status: false});
        }

        delete user.password;
        return res.json({status: true, user});

    } catch (error) {
        next(error)
    }
}