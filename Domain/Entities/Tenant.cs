using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Tenant
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string SubscriptionPlan { get; set; } = "Free"; // e.g., Free, Pro, Enterprise
        
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}