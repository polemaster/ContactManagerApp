using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } // Business, Private, Other

        public ICollection<Subcategory>? Subcategories { get; set; }
    }

}
