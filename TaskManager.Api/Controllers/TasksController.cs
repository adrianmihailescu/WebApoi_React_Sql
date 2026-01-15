using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
        => Ok(await _context.Tasks
        .OrderBy(t => t.Order)
        .ToListAsync());

    [HttpPost]
    public async Task<IActionResult> CreateTask(TaskItem task)
    {
        var maxOrder = await _context.Tasks.MaxAsync(t => (int?)t.Order) ?? -1;
        task.Order = maxOrder + 1;

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem updated)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        task.Title = updated.Title;
        task.Description = updated.Description;
        task.IsCompleted = updated.IsCompleted;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("reorder")]
    public async Task<IActionResult> ReorderTasks([FromBody] List<int> taskIds)
    {
        var tasks = await _context.Tasks.ToListAsync();

        for (int i = 0; i < taskIds.Count; i++)
        {
            var task = tasks.First(t => t.Id == taskIds[i]);
            task.Order = i;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

}
