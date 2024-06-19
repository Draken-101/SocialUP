import bcrypt from 'bcryptjs';
import { Schema, model, Document, Model } from "mongoose";

interface UserDocument extends Document {
    username: string;
    password: string;
    profilePictureUrl: string;
    amigos: string[]
    comparePassword: (userPassword: string) => Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
    encryptPassword: (password: string) => Promise<string>;
}

const userSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePictureUrl: {
        type: String,
        default: ''
    },
    amigos: [{ type: String }]
});

userSchema.methods.comparePassword = function (userPassword: string): Promise<boolean> {
    return bcrypt.compare(userPassword, this.password);
};

userSchema.statics.encryptPassword = async function (password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const User: UserModel = model<UserDocument, UserModel>('User', userSchema);

export default User;
