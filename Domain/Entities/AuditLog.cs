using System;

namespace Domain.Entities
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty; // Who did it?
        public string Action { get; set; } = string.Empty; // What did they do? (e.g., "Login", "Invite User")
        public string EntityName { get; set; } = string.Empty; // What did they touch? (e.g., "User", "Tenant")
        public DateTime Timestamp { get; set; } = DateTime.UtcNow; // When?
        public string Details { get; set; } = string.Empty; // Extra info (e.g., "Invited admin@test.com")
    }
}