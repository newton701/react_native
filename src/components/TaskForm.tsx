import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import type { Priority } from '../types';

interface Props {
  onSubmit: (
    title: string,
    description: string,
    deadline: Date,
    priority: Priority,
  ) => void;
}

/**
 * Form component used for creating new tasks.
 */
export const TaskForm: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [priority, setPriority] = useState<Priority>('medium');
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const handleDeadlineChange = (
    _event: DateTimePickerEvent,
    date?: Date | undefined,
  ) => {
    setShowDeadlinePicker(false);
    if (date) {
      setDeadline(date);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    onSubmit(title.trim(), description.trim(), deadline, priority);

    // Reset form
    setTitle('');
    setDescription('');
    setDeadline(new Date());
    setPriority('medium');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor="#6b7280"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your task"
        placeholderTextColor="#6b7280"
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDeadlinePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {deadline.toLocaleString()}
        </Text>
      </TouchableOpacity>
      {showDeadlinePicker && (
        <DateTimePicker
          value={deadline}
          mode="datetime"
          onChange={handleDeadlineChange}
        />
      )}

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {(['low', 'medium', 'high'] as Priority[]).map(value => {
          const isActive = priority === value;
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.priorityChip,
                isActive && styles.priorityChipActive,
              ]}
              onPress={() => setPriority(value)}
            >
              <Text
                style={[
                  styles.priorityChipText,
                  isActive && styles.priorityChipTextActive,
                ]}
              >
                {value.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#e5e7eb',
    marginBottom: 10,
    backgroundColor: '#020617',
    fontSize: 14,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  priorityChip: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  priorityChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  priorityChipText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
  priorityChipTextActive: {
    color: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 15,
  },
});

