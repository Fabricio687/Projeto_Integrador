// src/components/auth/RegisterForm.jsx
import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import CourseSelector from '../ui/CourseSelector';
import useAuth from '../../hooks/useAuth';
import coursesService from '../../services/courses.service';

export default function RegisterForm() {
  const { register, login, loading, error, setError } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    semester: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        
        // Buscar cursos do backend
        const response = await coursesService.getAll();
        if (response && response.data && response.data.data) {
          setCourses(response.data.data);
        } else if (response && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error('Formato de resposta inválido:', response);
          setCourses([]);
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    
    fetchCourses();
  }, []);

  const onChange = (e) => {
    setError(null);
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Buscar o curso selecionado para pegar o nome
    const selectedCourse = courses.find(c => c._id === form.course || c.code === form.course);
    const courseName = selectedCourse ? selectedCourse.name : form.course;
    
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      course: courseName, // Enviar o nome do curso
      semester: parseInt(form.semester) || 1,
    };
    const res = await register(payload);
    if (res.ok && res.data) {
      // Fazer login automaticamente após registro
      if (res.data.token && res.data.user) {
        await login(res.data.user, res.data.token);
      } else {
        window.location.replace('/login');
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Nome" name="name" value={form.name} onChange={onChange} required />
        <Input label="E-mail" name="email" type="email" value={form.email} onChange={onChange} required />
        <Input label="Senha" name="password" type="password" value={form.password} onChange={onChange} required />
        <div className="block">
          <label className="mb-1 block text-sm font-medium text-neutral-700">Curso *</label>
          <CourseSelector
            name="course"
            value={form.course}
            onChange={(e) => onChange({ target: { name: 'course', value: e.target.value } })}
            required
          />
        </div>
        <Input label="Semestre" name="semester" type="number" min="1" max="10" value={form.semester} onChange={onChange} required />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button disabled={loading} className="w-full">
        {loading ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  );
}
