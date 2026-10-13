import { createContext, use, useState, type PropsWithChildren } from 'react';

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  program: string;
  phone?: string;
  createdAt: string;
};

export type NewStudent = Omit<Student, 'id' | 'createdAt'>;

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    firstName: 'Awa',
    lastName: 'Diallo',
    email: 'awa.diallo@ecole.com',
    age: 21,
    program: 'Informatique',
    phone: '+221 77 123 45 67',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: '2',
    firstName: 'Lucas',
    lastName: 'Martin',
    email: 'lucas.martin@ecole.com',
    age: 23,
    program: 'Génie civil',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
  {
    id: '3',
    firstName: 'Fatou',
    lastName: 'Ndiaye',
    email: 'fatou.ndiaye@ecole.com',
    age: 20,
    program: 'Gestion',
    phone: '+221 76 987 65 43',
    createdAt: '2026-09-03T09:00:00.000Z',
  },
];

type StudentsContextValue = {
  students: Student[];
  getStudent: (id: string) => Student | undefined;
  addStudent: (student: NewStudent) => Student;
  removeStudent: (id: string) => void;
};

const StudentsContext = createContext<StudentsContextValue | null>(null);

export function StudentsProvider({ children }: PropsWithChildren) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const getStudent = (id: string) => students.find((s) => s.id === id);

  const addStudent = (data: NewStudent) => {
    const student: Student = {
      ...data,
      id: Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [student, ...prev]);
    return student;
  };

  const removeStudent = (id: string) => setStudents((prev) => prev.filter((s) => s.id !== id));

  return (
    <StudentsContext value={{ students, getStudent, addStudent, removeStudent }}>
      {children}
    </StudentsContext>
  );
}

export function useStudents() {
  const ctx = use(StudentsContext);
  if (!ctx) throw new Error('useStudents must be used within a StudentsProvider');
  return ctx;
}
