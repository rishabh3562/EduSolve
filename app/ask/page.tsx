'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { postDoubt ,supabase} from '@/lib/supabase';
import { askFormDataType, User } from '@/lib/types';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
];

export default function AskDoubt() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]); // State to store the list of teachers

  // Explicitly define the type for form data
  const [formData, setFormData] = useState<askFormDataType>({
    title: '',
    description: '',
    subject: '',
    studentId: user?.id || '',
    teacherId: '',
  });

  useEffect(() => {
    // Fetch the list of teachers from the database
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher');
      if (error) {
        console.error('Error fetching teachers:', error);
      } else {
        setTeachers(data);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a doubt');
      return;
    }

    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }

    setIsSubmitting(true);
    try {
      await postDoubt({
        title: formData.title!,
        description: formData.description,
        subject: formData.subject,
        studentId: user.id,
        teacherId: formData.teacherId,
      });

      toast.success('Doubt submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting doubt:', error);
      toast.error('Failed to submit doubt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ask a Doubt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., How to solve quadratic equations?"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject || ''} // Ensure it's never undefined
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher</Label>
                <Select
                  value={formData.teacherId || ''} // Ensure it's never undefined
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, teacherId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your doubt in detail..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Doubt'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}