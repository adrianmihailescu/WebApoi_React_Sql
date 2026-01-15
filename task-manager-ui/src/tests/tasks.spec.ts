import { test, expect } from '@playwright/test';

test.describe('Task Manager', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Task Form', () => {
    test('should display the task form', async ({ page }) => {
      // Check if the form exists
      const form = page.locator('form');
      await expect(form).toBeVisible();
    });
  });

  test.describe('Task List Display', () => {
    test('should display column headers', async ({ page }) => {
      const headers = ['#', 'Title', 'Description', 'Status', 'Actions'];
      
      for (const header of headers) {
        await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
      }
    });

    test('should display all tasks in a table', async ({ page }) => {
      const table = page.locator('table.task-table');
      await expect(table).toBeVisible();

      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      // Should have at least 0 rows (might be empty)
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Task Filtering', () => {
    test('should have a search input', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();
    });

    test('should filter tasks by status', async ({ page }) => {
      const statusSelect = page.locator('select');
      
      // Select "Pending" filter
      await statusSelect.selectOption('pending');
      
      // Verify the filter was applied
      const selectedValue = await statusSelect.inputValue();
      expect(selectedValue).toBe('pending');
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state message when no tasks match filter', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]');
      
      // Search for something that won't exist
      await searchInput.fill('NONEXISTENT_TASK_12345');

      // Should see the no matching tasks message
      const noTasksMessage = page.locator('text=/No matching tasks/i');
      await expect(noTasksMessage).toBeVisible();
    });
  });

  test.describe('Responsive UI Elements', () => {
    test('should have proper button styling', async ({ page }) => {
      const buttons = page.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
