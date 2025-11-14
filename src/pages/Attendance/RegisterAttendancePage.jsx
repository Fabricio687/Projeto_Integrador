import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import coursesService from '../../services/courses.service';
import attendanceService from '../../services/attendance.service';
import { CheckCircle, XCircle, Clock, AlertCircle, Users, Calendar, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const statusOptions = [
  { value: 'present', label: 'Presente', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { value: 'absent', label: 'Falta', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { value: 'late', label: 'Atraso', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { value: 'excused', label: 'Justificado', icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
];

const RegisterAttendancePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState({}); // { studentId: { status, justification } }
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coursesService.getAll();
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError('Erro ao carregar cursos');
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getCourseStudents(courseId);
      if (response.success && response.data) {
        setStudents(response.data.students || []);
        setSelectedCourse(response.data.course);
        // Inicializar todos os alunos como presentes
        const initialAttendances = {};
        response.data.students.forEach(student => {
          initialAttendances[student._id] = {
            status: 'present',
            justification: ''
          };
        });
        setAttendances(initialAttendances);
      }
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      setError('Erro ao carregar alunos do curso');
      toast.error('Erro ao carregar alunos do curso');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendances(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleJustificationChange = (studentId, justification) => {
    setAttendances(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        justification
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      toast.error('Selecione um curso');
      return;
    }

    if (students.length === 0) {
      toast.error('Nenhum aluno encontrado no curso');
      return;
    }

    try {
      setSaving(true);
      const attendanceRecords = students.map(student => ({
        studentId: student._id,
        status: attendances[student._id]?.status || 'present',
        justification: attendances[student._id]?.justification || ''
      }));

      const response = await attendanceService.createMultipleAttendances({
        courseId: selectedCourse._id,
        date: attendanceDate,
        attendances: attendanceRecords
      });

      if (response.success) {
        toast.success(`${response.data.length} registro(s) de presença salvo(s) com sucesso!`);
        navigate('/dashboard/teacher');
      }
    } catch (err) {
      console.error('Erro ao salvar presenças:', err);
      toast.error(err.response?.data?.message || 'Erro ao salvar presenças');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !selectedCourse) {
    return (
      <div className="p-6">
        <Loading text="Carregando cursos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Registrar Presença</h1>
        <p className="text-sm text-neutral-600">Registre a presença dos alunos em suas aulas</p>
      </div>

      {/* Seleção de Curso e Data */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Curso
            </label>
            <select
              value={selectedCourse?._id || ''}
              onChange={(e) => {
                const course = courses.find(c => c._id === e.target.value);
                setSelectedCourse(course ? { _id: course._id, name: course.name, code: course.code } : null);
              }}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um curso</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} - {course.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data da Aula
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Lista de Alunos */}
      {selectedCourse && students.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Alunos - {selectedCourse.name}
                </h2>
                <p className="text-sm text-neutral-600">
                  {students.length} aluno(s) encontrado(s)
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar Presenças'}
              </button>
            </div>

            <div className="space-y-3">
              {students.map((student) => {
                const attendance = attendances[student._id] || { status: 'present', justification: '' };
                const statusConfig = statusOptions.find(s => s.value === attendance.status) || statusOptions[0];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={student._id}
                    className={`p-4 border rounded-lg ${statusConfig.borderColor} ${statusConfig.bgColor}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                          <div>
                            <p className="font-medium text-neutral-900">{student.name}</p>
                            <p className="text-sm text-neutral-600">
                              {student.registration} - {student.email}
                            </p>
                          </div>
                        </div>

                        {/* Botões de Status */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {statusOptions.map((option) => {
                            const OptionIcon = option.icon;
                            return (
                              <button
                                key={option.value}
                                onClick={() => handleStatusChange(student._id, option.value)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                  attendance.status === option.value
                                    ? `${option.bgColor} ${option.color} border-2 ${option.borderColor}`
                                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                                }`}
                              >
                                <OptionIcon className="w-4 h-4" />
                                {option.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Campo de Justificativa */}
                        {attendance.status !== 'present' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Justificativa (opcional)
                            </label>
                            <textarea
                              value={attendance.justification || ''}
                              onChange={(e) => handleJustificationChange(student._id, e.target.value)}
                              placeholder="Digite a justificativa..."
                              rows={2}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Botão Salvar no Final */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Todas as Presenças'}
            </button>
          </div>
        </>
      )}

      {selectedCourse && students.length === 0 && !loading && (
        <Card className="p-6">
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500">Nenhum aluno encontrado neste curso.</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="text-red-800">
            <p className="font-semibold mb-2">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegisterAttendancePage;




