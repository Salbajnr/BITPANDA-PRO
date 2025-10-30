
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Validation schemas
const todoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});

const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  category: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  completed: z.boolean().optional()
});

// Get all todos for user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { completed, priority, category, search, limit = 50, offset = 0 } = req.query;

    const todos = await storage.getUserTodos(userId);
    let filteredTodos = todos;

    if (completed !== undefined) {
      filteredTodos = filteredTodos.filter(t => t.completed === (completed === 'true'));
    }

    if (priority) {
      filteredTodos = filteredTodos.filter(t => t.priority === priority);
    }

    if (category) {
      filteredTodos = filteredTodos.filter(t => t.category === category);
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredTodos = filteredTodos.filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        t.description?.toLowerCase().includes(searchTerm)
      );
    }

    const startIndex = parseInt(offset.toString());
    const endIndex = startIndex + parseInt(limit.toString());
    const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

    res.json({
      todos: paginatedTodos,
      total: filteredTodos.length,
      hasMore: endIndex < filteredTodos.length
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// Create new todo
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = todoSchema.parse(req.body);

    const todo = await storage.createTodo({
      userId,
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      category: data.category || 'general',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      tags: data.tags || [],
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

// Get single todo
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const todo = await storage.getTodoById(id);
    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ message: 'Failed to fetch todo' });
  }
});

// Update todo
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const data = updateTodoSchema.parse(req.body);

    const todo = await storage.getTodoById(id);
    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await storage.updateTodo(id, {
      ...data,
      updatedAt: new Date()
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// Delete todo
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const todo = await storage.getTodoById(id);
    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await storage.deleteTodo(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

// Toggle todo completion
router.patch('/:id/toggle', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const todo = await storage.getTodoById(id);
    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await storage.updateTodo(id, {
      completed: !todo.completed,
      updatedAt: new Date()
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ message: 'Failed to toggle todo' });
  }
});

// Get todo statistics
router.get('/stats/overview', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const todos = await storage.getUserTodos(userId);

    const stats = {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      overdue: todos.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
      ).length,
      byPriority: {
        high: todos.filter(t => t.priority === 'high').length,
        medium: todos.filter(t => t.priority === 'medium').length,
        low: todos.filter(t => t.priority === 'low').length
      },
      categories: todos.reduce((acc, todo) => {
        acc[todo.category] = (acc[todo.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get todo stats error:', error);
    res.status(500).json({ message: 'Failed to fetch todo statistics' });
  }
});

export default router;
