
// Add these methods to your storage class

async createAuditLog(event: any): Promise<void> {
  const query = `
    INSERT INTO audit_logs (user_id, admin_id, action, resource, resource_id, old_value, new_value, 
                           ip, user_agent, endpoint, success, error_message, metadata, severity, 
                           category, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  `;
  
  await this.db.query(query, [
    event.userId, event.adminId, event.action, event.resource, event.resourceId,
    JSON.stringify(event.oldValue), JSON.stringify(event.newValue),
    event.ip, event.userAgent, event.endpoint, event.success, event.errorMessage,
    JSON.stringify(event.metadata), event.severity, event.category, event.timestamp
  ]);
}

async createSecurityLog(event: any): Promise<void> {
  const query = `
    INSERT INTO security_logs (type, user_id, ip, user_agent, endpoint, details, severity, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  
  await this.db.query(query, [
    event.type, event.userId, event.ip, event.userAgent, event.endpoint,
    JSON.stringify(event.details), event.severity, event.timestamp
  ]);
}

async getRateLimitEntry(key: string): Promise<any> {
  const query = 'SELECT * FROM rate_limits WHERE key = $1 AND reset_time > NOW()';
  const result = await this.db.query(query, [key]);
  return result.rows[0] || null;
}

async setRateLimitEntry(key: string, entry: any): Promise<void> {
  const query = `
    INSERT INTO rate_limits (key, count, reset_time, first_request)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (key) DO UPDATE SET
      count = $2, reset_time = $3, first_request = $4
  `;
  
  await this.db.query(query, [
    key, entry.count, new Date(entry.resetTime), new Date(entry.firstRequest)
  ]);
}

async createFileRecord(fileData: any): Promise<any> {
  const query = `
    INSERT INTO file_uploads (user_id, filename, original_name, mimetype, size, type, path, url, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING *
  `;
  
  const result = await this.db.query(query, [
    fileData.userId, fileData.filename, fileData.originalName, fileData.mimetype,
    fileData.size, fileData.type, fileData.path, fileData.url
  ]);
  
  return result.rows[0];
}
