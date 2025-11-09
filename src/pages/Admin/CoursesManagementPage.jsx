import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import coursesService from '../../services/courses.service';
import usersService from '../../services/users.service';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 4,
    professor: '',
    schedule: '',
    room: '',
    description: '',
    semester: 1
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await usersService.getAll('teacher');
      setTeachers(res.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await coursesService.update(editing._id, formData);
      } else {
        await coursesService.create(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({
        name: '',
        code: '',
        credits: 4,
        professor: '',
        schedule: '',
        room: '',
        description: '',
        semester: 1
      });
      fetchCourses();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      alert(error?.response?.data?.message || 'Erro ao salvar curso');
    }
  };

  const handleEdit = (course) => {
    setEditing(course);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits,
      professor: course.professor,
      schedule: course.schedule,
      room: course.room,
      description: course.description || '',
      semester: course.semester || 1
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    try {
      await coursesService.remove(id);
      fetchCourses();
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      alert('Erro ao deletar curso');
    }
  };

  if (loading && courses.length === 0) return <Loading />;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Gerenciar Cursos</h1>
            <p className="text-sm text-neutral-600 mt-1">Cadastre e gerencie os cursos disponíveis</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', code: '', credits: 4, professor: '', schedule: '', room: '', description: '', semester: 1 }); }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Button>
        </div>
      </Card>

      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar' : 'Novo'} Curso</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Curso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Código"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Créditos <span className="text-red-500">*</span>
                  <span className="text-xs text-neutral-500 ml-2">(Carga horária do curso)</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
                  placeholder="Ex: 4"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Geralmente entre 2-6 créditos. Representa a carga horária semanal do curso.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Professor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100 bg-white"
                  required
                >
                  <option value="">Selecione um professor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher.name}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Horário"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                required
                placeholder="Ex: Segunda 14:00-16:00"
              />
              <Input
                label="Sala"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                required
              />
              <Input
                label="Semestre"
                type="number"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? 'Salvar' : 'Criar'}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course._id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-neutral-900">{course.code}</h3>
                <p className="text-sm text-neutral-600">{course.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(course)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(course._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-xs text-neutral-600">
              <p><strong>Professor:</strong> {course.professor}</p>
              <p><strong>Horário:</strong> {course.schedule}</p>
              <p><strong>Sala:</strong> {course.room}</p>
              <p><strong>Créditos:</strong> {course.credits}</p>
              <p className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course.students?.length || 0} alunos
              </p>
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <Card>
          <p className="text-center text-neutral-600 py-8">Nenhum curso cadastrado</p>
        </Card>
      )}
    </div>
  );
}


