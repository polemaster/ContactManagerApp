using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CategoriesController(AppDbContext db) => _db = db;

        /// <summary>
        /// GET /api/categories
        /// Returns all categories, each with its list of subcategories (may be empty).
        /// They are in the format:
        /// [
        ///  { "id":1, "name":"Business", "subcategories":[{"id":1,"name":"Boss"},…] },
        ///  { "id":2, "name":"Private",  "subcategories":[] },
        ///  { "id":3, "name":"Other",    "subcategories":[] }
        /// ]
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<CategoryWithSubsDto[]>> GetAll()
        {
            var cats = await _db.Categories
              .AsNoTracking()
              .Include(c => c.Subcategories)
              .Select(c => new CategoryWithSubsDto
              {
                  Id = c.Id,
                  Name = c.Name,
                  Subcategories = c.Subcategories!
                                  .Select(s => new SubcategoryDto
                                  {
                                      Id = s.Id,
                                      Name = s.Name
                                  })
                                  .ToArray()
              })
              .ToArrayAsync();

            return Ok(cats);
        }
    }

    public class CategoryWithSubsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public SubcategoryDto[] Subcategories { get; set; } = Array.Empty<SubcategoryDto>();
    }

    public class SubcategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
