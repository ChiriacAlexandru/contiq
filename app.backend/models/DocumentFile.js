const { sql } = require('../config/database');

class DocumentFile {
	static get TABLE() {
		return 'document_files';
	}

	static async create({
		original_name,
		s3_key,
		mime_type,
		size_bytes,
		uploaded_by,
		document_id = null,
		supplier_id = null,
		notes = null
	}) {
		const [row] = await sql`
			INSERT INTO document_files (
				original_name, s3_key, mime_type, size_bytes,
				uploaded_by, document_id, supplier_id, notes
			) VALUES (
				${original_name}, ${s3_key}, ${mime_type}, ${size_bytes},
				${uploaded_by}, ${document_id}, ${supplier_id}, ${notes}
			) RETURNING *
		`;
		return row;
	}

		static async list({ search = '', limit = 50, offset = 0, supplier_id = null, document_id = null }) {
			const conditions = [];
			const params = [];
			let i = 1;

			if (search) { conditions.push(`(original_name ILIKE $${i} OR notes ILIKE $${i})`); params.push(`%${search}%`); i++; }
			if (supplier_id) { conditions.push(`supplier_id = $${i}`); params.push(supplier_id); i++; }
			if (document_id) { conditions.push(`document_id = $${i}`); params.push(document_id); i++; }

			const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
			params.push(limit, offset);

			// Primary query with join on users (requires uploaded_by column)
			const queryWithJoin = `SELECT df.*, u.email as uploaded_by_email
														 FROM document_files df
														 LEFT JOIN users u ON u.id = df.uploaded_by
														 ${where}
														 ORDER BY df.created_at DESC
														 LIMIT $${i} OFFSET $${i + 1}`;

			try {
				const rows = await sql.unsafe(queryWithJoin, params);
				const countQuery = `SELECT COUNT(*)::int AS total FROM document_files df ${where}`;
				const [{ total }] = await sql.unsafe(countQuery, params.slice(0, -2));
				return { files: rows, total, limit, offset };
			} catch (err) {
				// If uploaded_by column is missing (code 42703), fallback without join
				if (err?.code === '42703') {
					const query = `SELECT df.*
												 FROM document_files df
												 ${where}
												 ORDER BY df.created_at DESC
												 LIMIT $${i} OFFSET $${i + 1}`;
					const rows = await sql.unsafe(query, params);
					const countQuery = `SELECT COUNT(*)::int AS total FROM document_files df ${where}`;
					const [{ total }] = await sql.unsafe(countQuery, params.slice(0, -2));
					return { files: rows, total, limit, offset };
				}
				throw err;
			}
		}

	static async getById(id) {
		const [row] = await sql`SELECT * FROM document_files WHERE id = ${id}`;
		return row || null;
	}

	static async delete(id) {
		const [row] = await sql`DELETE FROM document_files WHERE id = ${id} RETURNING *`;
		return row || null;
	}
}

module.exports = DocumentFile;

