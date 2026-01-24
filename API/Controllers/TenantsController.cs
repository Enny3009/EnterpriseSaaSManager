using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Needed for the lock
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("tenants")]
    [Authorize(Roles = "SuperAdmin")] // ONLY SuperAdmins can enter. Everyone else gets 403 Forbidden.
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
                .Select(t => new { t.Id, t.Name, t.SubscriptionPlan }) // Select only what we need (DTO projection)
                .ToListAsync();

            return Ok(tenants);
        }

        // POST /tenants
        [HttpPost]
        public async Task<IActionResult> CreateTenant([FromBody] CreateTenantRequest request)
        {
            // 1. Validation
            if (await _context.Tenants.AnyAsync(t => t.Name == request.Name))
                return BadRequest("Tenant already exists.");

            // 2. Create Tenant
            var tenant = new Tenant 
            { 
                Name = request.Name, 
                SubscriptionPlan = "Free" // Default plan
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Tenant created successfully", TenantId = tenant.Id });
        }

        // DTO Class (Put this at the bottom of the file or inside the namespace)
        public class CreateTenantRequest
        {
            public string Name { get; set; } = string.Empty;
        }
    }
}