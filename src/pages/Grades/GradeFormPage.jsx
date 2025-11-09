import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import gradesService from '../../services/grades.service';
import coursesService from '../../services/courses.service';
import usersService from '../../services/users.service';

export default function GradeFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    courseName: '',
    grade: '',
    maxGrade: 100,
    type: 'exam',
    date: new Date().toISOString().split('T')[0],
    weight: 0.3,
    description: ''
  });

  const editingGrade = location.state?.grade;

  useEffect(() => {
    if (editingGrade) {
      setFormData({
        student: editingGrade.student?._id || editingGrade.student || '',
        course: editingGrade.course?._id || editingGrade.course || '',
        courseName: editingGrade.courseName || editingGrade.course?.name || '',
        grade: editingGrade.grade || '',
        maxGrade: editingGrade.maxGrade || 100,
        type: editingGrade.type || 'exam',
        date: editingGrade.date ? new Date(editingGrade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        weight: editingGrade.weight || 0.3,
        description: editingGrade.description || ''
      });
    }
  }, [editingGrade]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar cursos
        const coursesRes = await coursesService.getAll();
        setCourses(coursesRes.data?.data || coursesRes.data || []);
        
        // Buscar alunos
        const usersRes = await usersService.getAll();
        const studentsList = (usersRes.data?.data || usersRes.data || []).filter(
          user => user.role === 'student'
        );
        setStudents(studentsList);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar cursos e alunos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Atualizar courseName quando curso for selecionado
  useEffect(() => {
    if (formData.course) {
      const selectedCourse = courses.find(c => c._id === formData.course);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          courseName: selectedCourse.name
        }));
      }
    }
  }, [formData.course, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const payload = {
        student: formData.student,
        course: formData.course || null,
        courseName: formData.courseName,
        grade: parseFloat(formData.grade),
        maxGrade: parseFloat(formData.maxGrade),
        type: formData.type,
        date: new Date(formData.date).toISOString(),
        weight: parseFloat(formData.weight),
        description: formData.description
      };

      if (editingGrade) {
        await gradesService.update(editingGrade._id, payload);
      } else {
        await gradesService.create(payload);
      }
      
      navigate('/grades');
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      alert(error?.response?.data?.message || error?.response?.data?.errors?.join(', ') || 'Erro ao salvar nota');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {editingGrade ? 'Editar' : 'Nova'} Nota
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {editingGrade ? 'Atualize as informações da nota' : 'Preencha os dados para lançar uma nova nota'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/grades')}>
            Voltar
          </Button>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Aluno *</label>
            <div className="relative">
              <select
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all duration-200 appearance-none"
                required
                disabled={!!editingGrade}
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.registration} - {student.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Curso *</label>
            <div className="relative">
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all duration-200 appearance-none"
                required
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
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo de Avaliação *</label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all duration-200 appearance-none"
                required
              >
                <option value="exam">Prova</option>
                <option value="assignment">Trabalho</option>
                <option value="project">Projeto</option>
                <option value="final">Avaliação Final</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nota *"
              type="number"
              min="0"
              max={formData.maxGrade}
              step="0.1"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
              placeholder="Ex: 8.5"
            />

            <Input
              label="Nota Máxima *"
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={formData.maxGrade}
              onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Peso (0 a 1) *"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
              placeholder="Ex: 0.3 para 30%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              rows={3}
              placeholder="Observações sobre a avaliação..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : editingGrade ? 'Atualizar' : 'Lançar'} Nota
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/grades')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}



