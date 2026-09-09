1. PostgreSQL Full-Text Search

For a traffic target of 5k daily visitors, introducing a dedicated search cluster like Elasticsearch adds unnecessary operational weight. V1 utilizes PostgreSQL's native full-text search capabilities.

    Implementation: Prisma will query using search features against concatenated title, content, and description fields.

    Indexing: A GIN (Generalized Inverted Index) will be applied to the searchable text columns in the database schema to ensure query execution remains in the sub-50ms range even as the document table grows.

2. Archival Strategy

    Soft Archiving: Records are rarely permanently deleted. Instead, items older than 12 months or marked with a boolean isArchived flag are filtered out of the primary UI feeds (like the Homepage or recent Notices).

    Searchability: Archived items remain fully accessible via direct URLs and the global search interface, ensuring historical RWA decisions and meeting minutes are never lost.