import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoreTodos = create(persist(
    (set: any) => ({
        todos: [],
        modificarTodo: (actualTodos: any) => set(() => ({todos: actualTodos})),
    }),
    {
        name: 'todo'
    }
))