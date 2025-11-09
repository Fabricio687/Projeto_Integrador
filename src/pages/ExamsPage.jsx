// src/pages/ExamsPage.jsx
import Card from '../components/ui/Card';
import ExamsList from '../components/exams/ExamsList';
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import coursesService from '../services/courses.service';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const canManage = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await coursesService.getAll();
        const coursesData = res.data?.data || [];
        setCourses(coursesData);
        
        if (user?.course && coursesData.length > 0) {
          const userCourse = coursesData.find(c => 
            c.name === user.course || c.code === user.course || c._id === user.course
          );
          if (userCourse) {
            setCourseId(userCourse._id);
          }
        } else if (coursesData.length > 0) {
          setCourseId(coursesData[0]._id);
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    };
    
    fetchCourses();
  }, [user?.course]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-base font-semibold text-neutral-900">Provas</h1>
            <p className="text-sm text-neutral-600">Acompanhe o cronograma de avaliações por curso.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all duration-200 appearance-none"
              >
                <option value="">Selecione um curso</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {canManage && (
              <Button
                onClick={() => navigate('/exams/new', { state: { courseId } })}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                Nova Prova
              </Button>
            )}
          </div>
        </div>
      </Card>

      {courseId ? (
        <ExamsList courseId={courseId} canManage={canManage} />
      ) : (
        <Card>
          <p className="text-sm text-neutral-600 text-center py-8">
            Selecione um curso para ver as provas
          </p>
        </Card>
      )}
    </div>
  );
}
