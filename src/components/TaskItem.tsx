import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import type { Task } from '../types';

interface Props {
  task: Task;
  onToggleCompleted: () => void;
  onDelete: () => void;
}

/**
 * Renders a single task row with title, deadline, priority and actions.
 */
export const TaskItem: React.FC<Props> = ({
  task,
  onToggleCompleted,
  onDelete,
}) => {
  const priorityColor =
    task.priority === 'high'
      ? '#ef4444'
      : task.priority === 'medium'
      ? '#f97316'
      : '#22c55e';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            task.completed && styles.titleCompleted,
          ]}
        >
          {task.title}
        </Text>
        <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
      </View>

      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          Created: {new Date(task.createdAt).toLocaleString()}
        </Text>
        <Text style={styles.metaText}>
          Deadline: {new Date(task.deadline).toLocaleString()}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            task.completed && styles.primaryButtonCompleted,
          ]}
          onPress={onToggleCompleted}
        >
          <Text style={styles.primaryButtonText}>
            {task.completed ? 'Mark Incomplete' : 'Mark Completed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    flex: 1,
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  description: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
  },
  metaRow: {
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: '#6b7280',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  primaryButtonCompleted: {
    backgroundColor: '#4b5563',
  },
  primaryButtonText: {
    color: '#f9fafb',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
  },
});

