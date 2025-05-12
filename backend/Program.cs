using backend.Data;
using backend.DTOs.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1) EF Core + SQLLite
builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 2) Password hasher for User
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// 3) Sessions & Cookie auth
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
  .AddCookie(options =>
  {
      options.LoginPath = "/api/auth/login";
      options.LogoutPath = "/api/auth/logout";
      options.Cookie.HttpOnly = true;
      options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
  });

// 4) DTO Mapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// 5) Controllers
builder.Services.AddControllers();

// 6) Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
