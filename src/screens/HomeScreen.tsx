import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../auth/AuthContext';
import { TaskForm } from '../components/TaskForm';
import { TaskItem } from '../components/TaskItem';
import type { Task, Priority } from '../types';

const TASKS_KEY = '@todo_app_tasks';

/**
 * Main screen that shows the user's tasks and allows:
 * - Adding tasks (with title, description, createdAt, deadline, priority)
 * - Marking as completed
 * - Deleting tasks
 */
export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const json = await AsyncStorage.getItem(TASKS_KEY);
        if (json) {
          const parsed: Task[] = JSON.parse(json);
          setTasks(parsed);
        }
      } catch (error) {
        console.warn('Failed to load tasks', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const persistTasks = async (next: Task[]) => {
    try {
      setTasks(next);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to save tasks', error);
    }
  };

  const handleAddTask = (
    title: string,
    description: string,
    deadline: Date,
    priority: Priority,
  ) => {
    const now = new Date();
    const newTask: Task = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2)}`,
      title,
      description,
      createdAt: now.toISOString(),
      deadline: deadline.toISOString(),
      priority,
      completed: false,
    };

    const next = [newTask, ...tasks];
    // Note: no special sorting algorithm is applied here,
    // to keep things within the non-optional requirements.
    void persistTasks(next);
  };

  const handleToggleCompleted = (id: string) => {
    const next = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    void persistTasks(next);
  };

  const handleDeleteTask = (id: string) => {
    const next = tasks.filter(task => task.id !== id);
    void persistTasks(next);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello{user?.email ? `, ${user.email}` : ''} 👋
          </Text>
          <Text style={styles.subtitle}>Here are your tasks for today.</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TaskForm onSubmit={handleAddTask} />

      <Text style={styles.sectionTitle}>Your Tasks</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading tasks...</Text>
      ) : tasks.length === 0 ? (
        <Text style={styles.emptyText}>
          You don&apos;t have any tasks yet. Add one above to get started.
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleCompleted={() => handleToggleCompleted(item.id)}
              onDelete={() => handleDeleteTask(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  logoutButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutButtonText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
});

