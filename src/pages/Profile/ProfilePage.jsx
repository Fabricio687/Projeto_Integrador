// src/pages/Profile/ProfilePage.jsx
import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import CourseSelector from '../../components/ui/CourseSelector';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/users.service';
import coursesService from '../../services/courses.service';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    registration: '',
    course: '',
    semester: 1,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        registration: user.registration || '',
        course: user.course || '',
        semester: user.semester || 1,
      });
    }
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await coursesService.getAll();
      setCourses(res.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Buscar o curso selecionado para pegar o nome
      const selectedCourse = courses.find(c => c._id === form.course || c.name === form.course || c.code === form.course);
      const courseName = selectedCourse ? selectedCourse.name : form.course;
      
      const payload = {
        name: form.name.trim(),
        course: courseName,
        semester: parseInt(form.semester) || 1,
      };

      const response = await userService.updateProfile(payload);
      
      // Atualizar o usuário no contexto
      const userData = response.data?.user || response.data;
      const token = response.data?.token || localStorage.getItem('portal_aluno_token');
      
      if (userData && token) {
        await login(userData, token);
      }
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ 
        type: 'error', 
        text: error?.response?.data?.message || 'Erro ao atualizar perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <h1 className="text-xl font-semibold text-neutral-900 mb-2">Meu Perfil</h1>
        <p className="text-sm text-neutral-600">
          Gerencie suas informações pessoais
        </p>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              disabled
              className="bg-neutral-50"
            />
            <Input
              label="Matrícula"
              name="registration"
              value={form.registration}
              disabled
              className="bg-neutral-50"
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Curso</label>
              <CourseSelector
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              />
            </div>
            <Input
              label="Semestre"
              name="semester"
              type="number"
              min="1"
              max="10"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) || 1 })}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button disabled={loading} type="submit">
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm({
                name: user?.name || '',
                email: user?.email || '',
                registration: user?.registration || '',
                course: user?.course || '',
                semester: user?.semester || 1,
              })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
