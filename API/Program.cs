using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer; // New
using Microsoft.IdentityModel.Tokens; // New
using System.Text; // New
using Microsoft.OpenApi.Models; // New
using Application.Interfaces; // Add this
using Infrastructure.Services; // Add this

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


// <<< NEW: Define the Policy >>>
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // The Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// SWAGGER: Configure the "Authorize" button so we can test JWTs in the browser
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SaaS Manager API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Database Context (SQL Server)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// AUTHENTICATION (The Bouncer)
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});


// ... other services
builder.Services.AddScoped<IEmailService, MockEmailService>();

var app = builder.Build();

// 2. Configure Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// <<< NEW: Use the Policy >>>
// MUST be placed BEFORE UseAuthentication and UseAuthorization
app.UseCors("AllowReactApp"); 
// <<< END NEW >>>

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// 3. SEED DATA (The Fuel)
// This block runs once on startup to ensure you have an Admin account
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Ensure Database is Created
    context.Database.EnsureCreated();

    // If no tenants exist, create the HQ tenant and Admin user
    if (!context.Tenants.Any())
    {
        var tenant = new Tenant { Name = "Headquarters", SubscriptionPlan = "Enterprise" };
        context.Tenants.Add(tenant);
        
        var admin = new User 
        { 
            Email = "admin@saas.com", 
            PasswordHash = "admin123", // In production, never store plain text!
            Role = UserRole.SuperAdmin,
            Tenant = tenant
        };
        context.Users.Add(admin);
        
        context.SaveChanges();
    }
}

app.Run();