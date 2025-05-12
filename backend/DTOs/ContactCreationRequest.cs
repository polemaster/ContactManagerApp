using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ContactCreationRequest : IValidatableObject
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
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

        public int? SubcategoryId { get; set; }

        public string? OtherSubcategory { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var db = validationContext.GetService(typeof(AppDbContext)) as AppDbContext;
            var category = db?.Categories
                .AsNoTracking()
                .Include(c => c.Subcategories)
                .FirstOrDefault(category => category.Id == CategoryId);

            if (category == null)
            {
                yield return new ValidationResult("Invalid category.", new[] { "CategoryId" });
                yield break;
            }

            if (category.Name.Equals("business", StringComparison.OrdinalIgnoreCase))
            {
                if (SubcategoryId == null || !category.Subcategories.Any(subcategory => subcategory.Id == SubcategoryId))
                {
                    yield return new ValidationResult("A valid subcategory is required for the 'business' category.", new[] { "SubcategoryId" });
                }
            }
            else if (category.Name.Equals("other", StringComparison.OrdinalIgnoreCase))
            {
                if (string.IsNullOrWhiteSpace(OtherSubcategory))
                {
                    yield return new ValidationResult("Custom subcategory is required for the 'other' category.", new[] { "OtherSubcategory" });
                }
            }
        }
    }
}
