import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: String,
    bio: String,
    spells: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spell'
        },
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        },
    ],
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;