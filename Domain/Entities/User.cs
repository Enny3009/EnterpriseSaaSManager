using System;

namespace Domain.Entities
{
    public enum UserRole
    {
        SuperAdmin,
        Manager,    
        Viewer      
    }

    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}