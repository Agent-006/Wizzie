import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const communitySchema: Schema = new mongoose.Schema({
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    spells: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spell'
        },
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
})

const CommunityModel = mongoose.models.Community || mongoose.model('Community', communitySchema);

export default CommunityModel;