const { query, withTransaction } = require("../../../common/database/database-postgres");

function rowToDoc(row) {
    if (!row) return null;
    const dropdowns = Array.isArray(row.dropdowns) ? row.dropdowns : [];
    return {
        _id: row.id,
        id: row.id,
        module_name: row.module_name,
        dropdowns,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

function mergeDropdowns(existing, incoming) {
    const merged = (existing || []).map((d) => ({
        dropdown_name: d.dropdown_name,
        dropdown_values: [...(d.dropdown_values || [])],
    }));

    for (const d of incoming || []) {
        const target = merged.find((x) => x.dropdown_name === d.dropdown_name);
        if (target) {
            for (const v of d.dropdown_values || []) {
                if (!target.dropdown_values.includes(v)) {
                    target.dropdown_values.push(v);
                }
            }
        } else {
            merged.push({
                dropdown_name: d.dropdown_name,
                dropdown_values: [...(d.dropdown_values || [])],
            });
        }
    }
    return merged;
}

class PlatformDropdownConfigsRepository {
    async create(data) {
        const { rows } = await query(
            `INSERT INTO platform_dropdown_configs (id, module_name, dropdowns)
             VALUES ($1, $2, $3::jsonb)
             RETURNING *`,
            [data.id, data.module_name, JSON.stringify(data.dropdowns || [])]
        );
        return { result: rowToDoc(rows[0]) };
    }

    async findByModuleName(moduleName) {
        const { rows } = await query(
            `SELECT * FROM platform_dropdown_configs WHERE module_name = $1`,
            [moduleName]
        );
        return { result: rowToDoc(rows[0]) };
    }

    async findById(id) {
        const { rows } = await query(
            `SELECT * FROM platform_dropdown_configs WHERE id = $1`,
            [id]
        );
        return { result: rowToDoc(rows[0]) };
    }

    async findAll() {
        const { rows } = await query(
            `SELECT * FROM platform_dropdown_configs ORDER BY created_at DESC`
        );
        return { result: rows.map(rowToDoc) };
    }

    async mergeIntoExisting(id, incomingDropdowns) {
        const existing = await this.findById(id);
        if (!existing.result) {
            throw new Error(`platform_dropdown_configs id "${id}" not found for merge.`);
        }
        const merged = mergeDropdowns(existing.result.dropdowns, incomingDropdowns);
        const { rows } = await query(
            `UPDATE platform_dropdown_configs SET dropdowns = $2::jsonb, updated_at = NOW()
             WHERE id = $1 RETURNING *`,
            [id, JSON.stringify(merged)]
        );
        return { result: rowToDoc(rows[0]) };
    }

    async mergeIntoExistingByModuleName(moduleName, incomingDropdowns) {
        const existing = await this.findByModuleName(moduleName);
        if (!existing.result) {
            throw new Error(`platform_dropdown_configs for module_name "${moduleName}" reported a duplicate key but could not be re-read.`);
        }
        return this.mergeIntoExisting(existing.result.id, incomingDropdowns);
    }

    async updateDropdownValue(id, dropdownName, action, value) {
        return withTransaction(async (client) => {
            const { rows } = await client.query(
                `SELECT * FROM platform_dropdown_configs WHERE id = $1 FOR UPDATE`,
                [id]
            );
            const row = rows[0];
            if (!row) return { result: { matchedCount: 0, modifiedCount: 0 } };

            let dropdowns = Array.isArray(row.dropdowns) ? [...row.dropdowns] : [];
            const idx = dropdowns.findIndex((d) => d.dropdown_name === dropdownName);

            if (action === "add") {
                if (idx >= 0) {
                    const values = [...(dropdowns[idx].dropdown_values || [])];
                    if (!values.includes(value)) values.push(value);
                    dropdowns[idx] = { ...dropdowns[idx], dropdown_values: values };
                } else {
                    dropdowns.push({ dropdown_name: dropdownName, dropdown_values: [value] });
                }
            } else if (action === "remove") {
                if (idx < 0) return { result: { matchedCount: 0, modifiedCount: 0 } };
                dropdowns[idx] = {
                    ...dropdowns[idx],
                    dropdown_values: (dropdowns[idx].dropdown_values || []).filter((v) => v !== value),
                };
            }

            await client.query(
                `UPDATE platform_dropdown_configs SET dropdowns = $2::jsonb, updated_at = NOW() WHERE id = $1`,
                [id, JSON.stringify(dropdowns)]
            );
            return { result: { matchedCount: 1, modifiedCount: 1 } };
        });
    }

    async deleteById(id) {
        const { rowCount } = await query(
            `DELETE FROM platform_dropdown_configs WHERE id = $1`,
            [id]
        );
        return { result: { deletedCount: rowCount } };
    }

    isUniqueViolation(err) {
        return err?.code === "23505";
    }
}

module.exports = PlatformDropdownConfigsRepository;
