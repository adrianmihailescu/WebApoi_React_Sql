using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Controllers;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using Xunit;

namespace TaskManager.Api.Tests;

public class TasksControllerTests
{
    private static AppDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        var ctx = new AppDbContext(options);
        return ctx;
    }

    [Fact]
    public async Task GetTasks_ReturnsOrderedTasks()
    {
        // Arrange
        using var ctx = CreateContext("GetTasksDb");
        ctx.Tasks.AddRange(new[] {
            new TaskItem { Title = "A", Order = 2 },
            new TaskItem { Title = "B", Order = 0 },
            new TaskItem { Title = "C", Order = 1 }
        });
        await ctx.SaveChangesAsync();

        var controller = new TasksController(ctx);

        // Act
        var result = await controller.GetTasks();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsAssignableFrom<List<TaskItem>>(ok.Value);
        Assert.Equal(new[] { "B", "C", "A" }, list.Select(t => t.Title));
    }

    [Fact]
    public async Task CreateTask_AssignsOrderAndReturnsTask()
    {
        // Arrange
        using var ctx = CreateContext("CreateTaskDb");
        ctx.Tasks.Add(new TaskItem { Title = "Existing", Order = 0 });
        await ctx.SaveChangesAsync();

        var controller = new TasksController(ctx);
        var newTask = new TaskItem { Title = "NewTask" };

        // Act
        var result = await controller.CreateTask(newTask);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<TaskItem>(ok.Value);
        Assert.Equal(1, returned.Order);

        // Ensure persisted
        var persisted = await ctx.Tasks.FindAsync(returned.Id);
        Assert.NotNull(persisted);
        Assert.Equal("NewTask", persisted!.Title);
    }

    [Fact]
    public async Task UpdateTask_UpdatesExistingTask_ReturnsNoContent()
    {
        // Arrange
        using var ctx = CreateContext("UpdateTaskDb");
        var task = new TaskItem { Title = "Old", Description = "d", IsCompleted = false };
        ctx.Tasks.Add(task);
        await ctx.SaveChangesAsync();

        var controller = new TasksController(ctx);
        var updated = new TaskItem { Title = "Updated", Description = "new", IsCompleted = true };

        // Act
        var result = await controller.UpdateTask(task.Id, updated);

        // Assert
        Assert.IsType<NoContentResult>(result);
        var persisted = await ctx.Tasks.FindAsync(task.Id);
        Assert.Equal("Updated", persisted!.Title);
        Assert.Equal("new", persisted.Description);
        Assert.True(persisted.IsCompleted);
    }

    [Fact]
    public async Task DeleteTask_RemovesTask_ReturnsNoContent()
    {
        // Arrange
        using var ctx = CreateContext("DeleteTaskDb");
        var task = new TaskItem { Title = "ToDelete" };
        ctx.Tasks.Add(task);
        await ctx.SaveChangesAsync();

        var controller = new TasksController(ctx);

        // Act
        var result = await controller.DeleteTask(task.Id);

        // Assert
        Assert.IsType<NoContentResult>(result);
        var persisted = await ctx.Tasks.FindAsync(task.Id);
        Assert.Null(persisted);
    }

    [Fact]
    public async Task ReorderTasks_UpdatesOrderValues()
    {
        // Arrange
        using var ctx = CreateContext("ReorderDb");
        var t1 = new TaskItem { Title = "T1", Order = 0 };
        var t2 = new TaskItem { Title = "T2", Order = 1 };
        var t3 = new TaskItem { Title = "T3", Order = 2 };
        ctx.Tasks.AddRange(t1, t2, t3);
        await ctx.SaveChangesAsync();

        var controller = new TasksController(ctx);
        // new order: t3, t1, t2
        var newOrder = new List<int> { t3.Id, t1.Id, t2.Id };

        // Act
        var result = await controller.ReorderTasks(newOrder);

        // Assert
        Assert.IsType<NoContentResult>(result);
        var tasks = await ctx.Tasks.OrderBy(t => t.Order).ToListAsync();
        Assert.Equal(new[] { t3.Id, t1.Id, t2.Id }, tasks.Select(t => t.Id));
    }
}
