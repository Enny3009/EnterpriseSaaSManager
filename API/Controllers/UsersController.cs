using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Persistence;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("users")]
    [Authorize(Roles = "SuperAdmin,Manager")] // Only Admins or Managers can invite
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService; // <--- NEW

        public UsersController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST /users/invite
        [HttpPost("invite")]
        public async Task<IActionResult> InviteUser([FromBody] InviteRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("User already exists.");

            var tenantId = request.TenantId != Guid.Empty ? request.TenantId : (await _context.Tenants.FirstAsync()).Id;

            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = "Welcome123!", 
                Role = request.Role,
                TenantId = tenantId
            };

            _context.Users.Add(newUser);
            
            // >>> FIX: READ THE EMAIL CLAIM DIRECTLY <<<
            var adminEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            // For now, we will log that an invite happened.
            var log = new AuditLog
            {
                UserId = adminEmail ?? "System", // Now captures "admin@saas.com"
                Action = "Invite User",
                EntityName = "User",
                Details = $"Invited {request.Email} to Tenant {tenantId}"
            };
            _context.AuditLogs.Add(log);

            await _context.SaveChangesAsync();
            // 4. Send Email
            await _emailService.SendEmailAsync(request.Email, "You're Invited!", 
                $"Welcome to the SaaS platform. You have been invited as a {request.Role}.");

            return Ok(new { Message = "User invited successfully", UserId = newUser.Id });
        }
    }

    public class InviteRequest
    {
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public Guid TenantId { get; set; } // Optional: If empty, defaults to HQ
    }
}