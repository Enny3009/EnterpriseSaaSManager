using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            // Simulate sending
            _logger.LogInformation("--------------------------------------------------");
            _logger.LogInformation($"[EMAIL SENT] To: {to}");
            _logger.LogInformation($"Subject: {subject}");
            _logger.LogInformation($"Body: {body}");
            _logger.LogInformation("--------------------------------------------------");
            return Task.CompletedTask;
        }
    }
}