'use server';

import SpellModel from "@/models/spell.model";

export async function fetchAllChildSpells(spellId: string): Promise<any[]> {
    const childSpells = await SpellModel.find({ parentId: spellId });

    const descendantSpells = [];

    for(const childSpell of childSpells) {
        const descendants = await fetchAllChildSpells(childSpell._id);
        descendantSpells.push(childSpell, ...descendants);
    }

    return descendantSpells;
}