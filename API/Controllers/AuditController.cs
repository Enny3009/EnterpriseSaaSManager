using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("audit-logs")]
    [Authorize(Roles = "SuperAdmin")] // STRICTLY SuperAdmin only
    public class AuditController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuditController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.AuditLogs
                .OrderByDescending(x => x.Timestamp) // Newest first
                .Take(50) // Limit to last 50 for performance
                .ToListAsync();

            return Ok(logs);
        }
    }
}