using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Auth users must have unique emails
            modelBuilder.Entity<User>()
              .HasIndex(u => u.Email)
              .IsUnique();

            // Contacts keep their own unique email index
            modelBuilder.Entity<Contact>()
                .HasIndex(c => c.Email)
                .IsUnique();


            // Seed the three main categories
            modelBuilder.Entity<Category>().HasData(
              new Category { Id = 1, Name = "Business" },
              new Category { Id = 2, Name = "Private" },
              new Category { Id = 3, Name = "Other" }
            );

            // Seed some business subcategories
            modelBuilder.Entity<Subcategory>().HasData(
              new Subcategory { Id = 1, CategoryId = 1, Name = "Boss" },
              new Subcategory { Id = 2, CategoryId = 1, Name = "Customer" },
              new Subcategory { Id = 3, CategoryId = 1, Name = "Supplier" }
            );
        }
    }

}
