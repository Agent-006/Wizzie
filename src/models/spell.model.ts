import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const spellSchema: Schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentId: {
        type: String,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spell',
        },
    ],
});

const SpellModel = mongoose.models.Spell || mongoose.model("Spell", spellSchema);

export default SpellModel;
