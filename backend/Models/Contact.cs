using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Contact
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [Required]
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        // If business: pick one of the predefined subcategories
        public int? SubcategoryId { get; set; }
        public Subcategory? Subcategory { get; set; }

        // If Category == “Other”, free-text
        public string? OtherSubcategory { get; set; }

    }

}
