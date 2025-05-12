using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ContactsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // View contacts list
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.Contacts
              .Select(c => new {
                  c.Id,
                  c.FirstName,
                  c.LastName,
                  c.Email,
                  Category = c.Category.Name
              })
              .ToListAsync();
            return Ok(list);
        }

        // View the contact's details
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _context.Contacts
              .Include(x => x.Category)
              .Include(x => x.Subcategory)
              .FirstOrDefaultAsync(x => x.Id == id);
            if (c == null) return NotFound();

            return Ok(new
            {
                c.Id,
                c.FirstName,
                c.LastName,
                c.Email,
                c.Password,
                Category = c.Category.Name,
                Subcategory = c.Category.Name == "Other"
                ? c.OtherSubcategory
                : c.Subcategory?.Name,
                c.Phone,
                c.DateOfBirth
            });
        }

        // Create a contact
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContactCreationRequest request)
        {
            var contact = _mapper.Map<Contact>(request);

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
        }

        // Update a contact (all fields required in PUT)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContactUpdateRequest request)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _mapper.Map(request, contact);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Delete a contact by ID
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _context.Contacts.Remove(contact);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
