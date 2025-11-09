import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import CourseSelector from '../../components/ui/CourseSelector';
import usersService from '../../services/users.service';
import coursesService from '../../services/courses.service';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registration: '',
    course: '',
    courseId: '', // ID do curso selecionado
    semester: 1,
    role: 'student'
  });

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await coursesService.getAll();
      setCourses(res.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.registration?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter) {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersService.getAll();
      setUsers(res.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Buscar o nome do curso selecionado
      const selectedCourse = courses.find(c => c._id === formData.courseId || c.name === formData.course);
      const courseName = selectedCourse ? selectedCourse.name : formData.course;

      const submitData = {
        ...formData,
        course: courseName
      };
      delete submitData.courseId; // Remover courseId antes de enviar

      if (editing) {
        const updateData = { ...submitData };
        if (!updateData.password) delete updateData.password;
        await usersService.update(editing._id, updateData);
      } else {
        await usersService.create(submitData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        registration: '',
        course: '',
        courseId: '',
        semester: 1,
        role: 'student'
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert(error?.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const handleEdit = (user) => {
    setEditing(user);
    // Encontrar o ID do curso pelo nome
    const courseMatch = courses.find(c => c.name === user.course);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      registration: user.registration || '',
      course: user.course || '',
      courseId: courseMatch?._id || '',
      semester: user.semester || 1,
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await usersService.remove(id);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário');
    }
  };

  if (loading && users.length === 0) return <Loading />;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Gerenciar Usuários</h1>
            <p className="text-sm text-neutral-600 mt-1">Cadastre e gerencie alunos, professores e administradores</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', email: '', password: '', registration: '', course: '', courseId: '', semester: 1, role: 'student' }); }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Buscar por nome, email ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-48 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
          >
            <option value="">Todos os perfis</option>
            <option value="student">Alunos</option>
            <option value="teacher">Professores</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </Card>

      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar' : 'Novo'} Usuário</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label={editing ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editing}
              />
              <Input
                label="Matrícula"
                value={formData.registration}
                onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Curso</label>
                <CourseSelector
                  value={formData.courseId}
                  onChange={(e) => {
                    const selectedCourse = courses.find(c => c._id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      courseId: e.target.value,
                      course: selectedCourse ? selectedCourse.name : ''
                    });
                  }}
                  placeholder="Selecione um curso"
                />
              </div>
              <Input
                label="Semestre"
                type="number"
                min="1"
                max="10"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Perfil</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
                  required
                >
                  <option value="student">Aluno</option>
                  <option value="teacher">Professor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? 'Salvar' : 'Criar'}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Nome</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Email</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Matrícula</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Curso</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Perfil</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="py-3 px-4 text-sm text-neutral-900">{user.name}</td>
                <td className="py-3 px-4 text-sm text-neutral-600">{user.email}</td>
                <td className="py-3 px-4 text-sm text-neutral-600">{user.registration || '-'}</td>
                <td className="py-3 px-4 text-sm text-neutral-600">{user.course || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'teacher' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Professor' : 'Aluno'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(user)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <p className="text-center text-neutral-600 py-8">Nenhum usuário encontrado</p>
        </Card>
      )}
    </div>
  );
}


