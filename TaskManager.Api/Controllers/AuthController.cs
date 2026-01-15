using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;

    public AuthController(AppDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required");
        }

        // Check if user already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            return BadRequest("User with this email already exists");
        }

        // Validate password
        if (request.Password.Length < 6)
        {
            return BadRequest("Password must be at least 6 characters");
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = _authService.HashPassword(request.Password),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _authService.GenerateJwtToken(user.Id, user.Email);

        return Ok(new AuthResponse
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Token = token,
        });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password");
        }

        var token = _authService.GenerateJwtToken(user.Id, user.Email);

        return Ok(new AuthResponse
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Token = token,
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Token invalidation typically handled on client side
        // Server-side: could add token to blacklist or update user's refresh token
        return Ok("Logged out successfully");
    }
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}
