import mongoose from 'mongoose';

const spellSchema = new mongoose.Schema({
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
    children : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spell'
        }
    ]
})

const SpellModel = mongoose.models.spells || mongoose.model("spells", spellSchema)

export default SpellModel;