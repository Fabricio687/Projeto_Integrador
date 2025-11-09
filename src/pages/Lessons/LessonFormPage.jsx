import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import lessonsService from '../../services/lessons.service';
import coursesService from '../../services/courses.service';
import useAuth from '../../hooks/useAuth';

export default function LessonFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    course: location.state?.courseId || '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    resources: []
  });

  const editingLesson = location.state?.lesson;

  useEffect(() => {
    if (editingLesson) {
      setFormData({
        course: editingLesson.course?._id || editingLesson.course || '',
        title: editingLesson.title || '',
        description: editingLesson.description || '',
        date: editingLesson.date ? new Date(editingLesson.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: editingLesson.date ? new Date(editingLesson.date).toTimeString().split(':').slice(0, 2).join(':') : '08:00',
        resources: editingLesson.resources || []
      });
    }
  }, [editingLesson]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesService.getAll();
        setCourses(res.data?.data || []);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      // Combinar data e hora
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const payload = {
        course: formData.course,
        title: formData.title,
        description: formData.description,
        date: dateTime.toISOString(),
        resources: formData.resources
      };

      if (editingLesson) {
        await lessonsService.update(editingLesson._id, payload);
      } else {
        await lessonsService.create(payload);
      }
      
      navigate('/lessons');
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      alert(error?.response?.data?.message || 'Erro ao salvar aula');
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
              {editingLesson ? 'Editar' : 'Nova'} Aula
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {editingLesson ? 'Atualize as informações da aula' : 'Preencha os dados para criar uma nova aula'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/lessons')}>
            Voltar
          </Button>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Input
            label="Título da Aula *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Ex: Aula 1 - Introdução"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              rows={4}
              placeholder="Descreva o conteúdo da aula..."
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
              label="Hora *"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : editingLesson ? 'Atualizar' : 'Criar'} Aula
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/lessons')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}






