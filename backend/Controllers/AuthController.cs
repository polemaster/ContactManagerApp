using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _hasher;

        public AuthController(AppDbContext context, IPasswordHasher<User> hasher)
        {
            _context = context;
            _hasher = hasher;
        }

        [HttpGet("me")]
        public IActionResult Me()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return Ok(new { email = User.FindFirst(ClaimTypes.Email)?.Value });
            }
            return Unauthorized();
        }

        /// <summary>
        /// Registers a new user (contact) with email+password.
        /// Password will be hashed.
        /// Automatically logs in the new user.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1) Check if email already in use
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict(new { message = "Email already registered" });

            // 2) Basic password complexity
            if (dto.Password.Length < 6 ||
                !dto.Password.Any(char.IsDigit) ||
                !dto.Password.Any(char.IsUpper))
            {
                return BadRequest(new
                {
                    message = "Password must be ≥6 chars, contain at least one digit and one uppercase letter"
                });
            }

            // 3) Create a new User
            var user = new User
            {
                Email = dto.Email,
                // Hash & set password
                PasswordHash = _hasher.HashPassword(null!, dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4) Sign in automatically
            await SignInUser(user);

            // Return 
            return CreatedAtAction(null, new { user.Email });
        }
        
        // Logs in existing user by verifying hashed password.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            // verify password
            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials");

            await SignInUser(user);

            return Ok();
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        // Helper function used in both registration and logging in
        private Task SignInUser(User user)
        {
            var claims = new List<Claim> {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                  };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            return HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(identity));
        }
    }
}
