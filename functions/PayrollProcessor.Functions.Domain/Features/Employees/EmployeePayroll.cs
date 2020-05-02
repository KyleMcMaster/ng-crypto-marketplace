using System;

namespace PayrollProcessor.Functions.Domain.Features.Employees
{
    public class EmployeePayroll
    {
        public Guid Id { get; set; }
        public DateTimeOffset CheckDate { get; set; }
        public decimal GrossPayroll { get; set; }
        public string PayrollPeriod { get; set; } = "";
    }
}
