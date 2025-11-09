import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import examsService from '../../services/exams.service';
import coursesService from '../../services/courses.service';

export default function ExamFormPage() {
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
    maxGrade: 10,
    weight: 0.3
  });

  const editingExam = location.state?.exam;

  useEffect(() => {
    if (editingExam) {
      setFormData({
        course: editingExam.course?._id || editingExam.course || '',
        title: editingExam.title || '',
        description: editingExam.description || '',
        date: editingExam.date ? new Date(editingExam.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: editingExam.date ? new Date(editingExam.date).toTimeString().split(':').slice(0, 2).join(':') : '08:00',
        maxGrade: editingExam.maxGrade || 10,
        weight: editingExam.weight || 0.3
      });
    }
  }, [editingExam]);

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
        maxGrade: parseFloat(formData.maxGrade),
        weight: parseFloat(formData.weight)
      };

      if (editingExam) {
        await examsService.update(editingExam._id, payload);
      } else {
        await examsService.create(payload);
      }
      
      navigate('/exams');
    } catch (error) {
      console.error('Erro ao salvar prova:', error);
      alert(error?.response?.data?.message || 'Erro ao salvar prova');
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
              {editingExam ? 'Editar' : 'Nova'} Prova
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {editingExam ? 'Atualize as informações da prova' : 'Preencha os dados para criar uma nova prova'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/exams')}>
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
            label="Título da Prova *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Ex: Prova 1 - Avaliação Parcial"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              rows={4}
              placeholder="Descreva o conteúdo da prova..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nota Máxima"
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={formData.maxGrade}
              onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
              required
            />

            <Input
              label="Peso (0 a 1)"
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : editingExam ? 'Atualizar' : 'Criar'} Prova
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/exams')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}






