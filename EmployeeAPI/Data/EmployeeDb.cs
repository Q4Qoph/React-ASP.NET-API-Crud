using Microsoft.EntityFrameworkCore;
using EmployeeAPI.Models;

namespace EmployeeAPI.Data
{
    public class EmployeeDbContext : DbContext
    {
        public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Optional: Add some seed data
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, Name = "John Doe", Department = "IT", Salary = 75000 },
                new Employee { Id = 2, Name = "Jane Smith", Department = "HR", Salary = 65000 }
            );
        }
    }
}