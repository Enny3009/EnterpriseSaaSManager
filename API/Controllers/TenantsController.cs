using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("tenants")]
    [Authorize(Roles = "SuperAdmin")]
    public class TenantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TenantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /tenants
        [HttpGet]
        public async Task<IActionResult> GetAllTenants()
        {
            var tenants = await _context.Tenants
                .Select(t => new { t.Id, t.Name, t.SubscriptionPlan })
                .ToListAsync();

            return Ok(tenants);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTenant([FromBody] CreateTenantRequest request)
        {
            // 1. Validation
            if (await _context.Tenants.AnyAsync(t => t.Name == request.Name))
                return BadRequest("Tenant already exists.");

            // 2. >>> PAYWALL LOGIC <<<
            // Check if Headquarters is on the Free plan
            var hq = await _context.Tenants.FirstOrDefaultAsync(t => t.Name == "Headquarters");
            if (hq != null && hq.SubscriptionPlan == "Free")
            {
                // Count how many tenants exist
                var count = await _context.Tenants.CountAsync();
                if (count >= 2) // Headquarters + 1 Allowed
                {
                    return BadRequest("PAYWALL: You must upgrade to Enterprise to create more tenants.");
                }
            }

            // 3. Create Tenant (This was missing in your snippet!)
            var tenant = new Tenant 
            { 
                Name = request.Name, 
                SubscriptionPlan = "Free" 
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Tenant created successfully", TenantId = tenant.Id });
        }

        // POST /tenants/upgrade
        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeSubscription([FromBody] UpgradeRequest request)
        {
            var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Name == "Headquarters");
            
            if (tenant == null) return NotFound("Tenant not found");

            tenant.SubscriptionPlan = request.PlanId == "pro" ? "Enterprise" : "Free";
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Upgraded to {tenant.SubscriptionPlan}" });
        }

        public class UpgradeRequest
        {
            public string PlanId { get; set; }
        }

        public class CreateTenantRequest
        {
            public string Name { get; set; } = string.Empty;
        }
    }
}