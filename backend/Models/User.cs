using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        // We store a hashed password here
        public string PasswordHash { get; set; }
    }
}
