import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import coursesService from '../../services/courses.service';
import attendanceService from '../../services/attendance.service';
import useAuth from '../../hooks/useAuth';
import { CheckCircle, XCircle, Clock, AlertCircle, Users, Calendar, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const statusOptions = [
  { 
    value: 'present', 
    label: 'Presente', 
    icon: CheckCircle, 
    color: 'text-green-600 dark:text-green-400', 
    bgColor: 'bg-green-50 dark:bg-green-500/20', 
    borderColor: 'border-green-200 dark:border-green-500/30' 
  },
  { 
    value: 'absent', 
    label: 'Falta', 
    icon: XCircle, 
    color: 'text-red-600 dark:text-red-400', 
    bgColor: 'bg-red-50 dark:bg-red-500/20', 
    borderColor: 'border-red-200 dark:border-red-500/30' 
  },
  { 
    value: 'late', 
    label: 'Atraso', 
    icon: Clock, 
    color: 'text-yellow-600 dark:text-yellow-400', 
    bgColor: 'bg-yellow-50 dark:bg-yellow-500/20', 
    borderColor: 'border-yellow-200 dark:border-yellow-500/30' 
  },
  { 
    value: 'excused', 
    label: 'Justificado', 
    icon: AlertCircle, 
    color: 'text-blue-600 dark:text-blue-400', 
    bgColor: 'bg-blue-50 dark:bg-blue-500/20', 
    borderColor: 'border-blue-200 dark:border-blue-500/30' 
  }
];

const RegisterAttendancePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]); // Array de IDs dos alunos selecionados
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
      
      // Verificar estrutura da resposta
      let coursesData = [];
      if (response.data?.success && response.data?.data) {
        coursesData = response.data.data;
      } else if (response.data?.data) {
        coursesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response.success && response.data) {
        coursesData = response.data;
      }
      
      // Se for professor, filtrar apenas cursos onde ele é o professor
      if (user?.role === 'teacher' && user?.name) {
        coursesData = coursesData.filter(course => course.professor === user.name);
      }
      
      setCourses(coursesData);
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
      
      console.log('Resposta completa:', response);
      
      // Verificar estrutura da resposta
      let studentsData = [];
      let courseData = null;
      
      // Tentar diferentes estruturas de resposta
      // Backend retorna: { success: true, data: { course: {...}, students: [...] } }
      if (response?.data?.success && response?.data?.data) {
        studentsData = response.data.data.students || [];
        courseData = response.data.data.course;
      } else if (response?.data?.data) {
        studentsData = response.data.data.students || [];
        courseData = response.data.data.course;
      } else if (response?.success && response?.data) {
        studentsData = response.data.students || [];
        courseData = response.data.course;
      } else if (response?.data?.students) {
        studentsData = response.data.students;
        courseData = response.data.course;
      } else if (response?.students) {
        studentsData = response.students;
        courseData = response.course;
      } else if (Array.isArray(response?.data)) {
        studentsData = response.data;
      } else if (Array.isArray(response)) {
        studentsData = response;
      }
      
      console.log('Alunos encontrados:', studentsData);
      console.log('Curso encontrado:', courseData);
      
      if (studentsData.length === 0) {
        toast.warning('Nenhum aluno encontrado neste curso');
      } else {
        toast.success(`${studentsData.length} aluno(s) encontrado(s)`);
      }
      
      setStudents(studentsData);
      
      // Se não veio courseData na resposta, buscar do array de cursos
      if (!courseData && courseId) {
        const course = courses.find(c => c._id === courseId);
        if (course) {
          courseData = {
            _id: course._id,
            name: course.name,
            code: course.code
          };
        }
      }
      
      setSelectedCourse(courseData);
      
      // Limpar seleções anteriores
      setSelectedStudents([]);
      setAttendances({});
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao carregar alunos do curso';
      setError(errorMsg);
      toast.error(errorMsg);
      setStudents([]);
      setSelectedCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        // Remover da seleção
        const newSelected = prev.filter(id => id !== studentId);
        // Remover também os dados de presença
        setAttendances(prevAtt => {
          const newAtt = { ...prevAtt };
          delete newAtt[studentId];
          return newAtt;
        });
        return newSelected;
      } else {
        // Adicionar à seleção e inicializar como presente
        setAttendances(prev => ({
          ...prev,
          [studentId]: {
            status: 'present',
            justification: ''
          }
        }));
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    const allIds = students.map(s => s._id);
    setSelectedStudents(allIds);
    // Inicializar todos como presentes
    const initialAttendances = {};
    allIds.forEach(id => {
      initialAttendances[id] = {
        status: 'present',
        justification: ''
      };
    });
    setAttendances(initialAttendances);
  };

  const handleDeselectAll = () => {
    setSelectedStudents([]);
    setAttendances({});
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

    if (selectedStudents.length === 0) {
      toast.error('Selecione pelo menos um aluno para registrar presença');
      return;
    }

    try {
      setSaving(true);
      // Registrar apenas para alunos selecionados
      const attendanceRecords = selectedStudents.map(studentId => ({
        studentId: studentId,
        status: attendances[studentId]?.status || 'present',
        justification: attendances[studentId]?.justification || ''
      }));

      const response = await attendanceService.createMultipleAttendances({
        courseId: selectedCourse._id,
        date: attendanceDate,
        attendances: attendanceRecords
      });

      // Verificar diferentes estruturas de resposta
      const responseData = response.data || response;
      let success = false;
      let count = 0;
      let message = '';
      
      if (responseData?.success) {
        success = true;
        count = responseData.data?.length || responseData.length || attendanceRecords.length;
        message = responseData.message || `${count} registro(s) de presença salvo(s) com sucesso!`;
      } else if (response.success) {
        success = true;
        count = response.data?.length || attendanceRecords.length;
        message = response.message || `${count} registro(s) de presença salvo(s) com sucesso!`;
      } else if (response.status === 201 || response.status === 200) {
        success = true;
        count = responseData?.data?.length || responseData?.length || attendanceRecords.length;
        message = responseData?.message || `${count} registro(s) de presença salvo(s) com sucesso!`;
      }
      
      if (success) {
        toast.success(message);
        
        // Recarregar alunos para mostrar que foi salvo (opcional)
        // Mas não limpar para permitir mais registros
      } else {
        throw new Error(responseData?.message || 'Resposta inválida do servidor');
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
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#E6EAF0] mb-2">Registrar Presença</h1>
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Registre a presença dos alunos em suas aulas</p>
      </div>

      {/* Seleção de Curso e Data */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-[#E6EAF0] mb-2">
              Curso
            </label>
            <select
              value={selectedCourse?._id || ''}
              onChange={(e) => {
                const courseId = e.target.value;
                if (courseId) {
                  fetchStudents(courseId);
                } else {
                  setSelectedCourse(null);
                  setStudents([]);
                  setSelectedStudents([]);
                  setAttendances({});
                }
              }}
              disabled={loading}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecione um curso</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-[#E6EAF0] mb-2">
              Data da Aula
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-250"
            />
          </div>
        </div>
      </Card>

      {/* Loading ao buscar alunos */}
      {selectedCourse?._id && loading && (
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loading text="Carregando alunos do curso..." />
          </div>
        </Card>
      )}

      {/* Lista de Alunos */}
      {selectedCourse && !loading && students.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#E6EAF0]">
                  Alunos - {selectedCourse.name}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
                  {students.length} aluno(s) encontrado(s) • {selectedStudents.length} selecionado(s)
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedStudents.length > 0 && (
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1.5 text-sm text-neutral-600 dark:text-[#9CA3AF] hover:text-neutral-900 dark:hover:text-[#E6EAF0] border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
                  >
                    Desmarcar Todos
                  </button>
                )}
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 text-sm text-neutral-600 dark:text-[#9CA3AF] hover:text-neutral-900 dark:hover:text-[#E6EAF0] border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-250"
                >
                  Selecionar Todos
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => {
                const isSelected = selectedStudents.includes(student._id);
                const attendance = attendances[student._id] || { status: 'present', justification: '' };
                const statusConfig = statusOptions.find(s => s.value === attendance.status) || statusOptions[0];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={student._id}
                    className={`p-4 border rounded-lg transition-all duration-250 ${
                      isSelected 
                        ? `${statusConfig.borderColor} ${statusConfig.bgColor} border-2` 
                        : 'border-neutral-200 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(30,38,54,0.6)] opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Checkbox de Seleção */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleStudentToggle(student._id)}
                          className="mt-1 w-5 h-5 text-accent-blue border-neutral-300 dark:border-[rgba(255,255,255,0.2)] rounded focus:ring-accent-blue focus:ring-2 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {isSelected && <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />}
                            <div>
                              <p className={`font-medium ${isSelected ? 'text-neutral-900 dark:text-[#E6EAF0]' : 'text-neutral-500 dark:text-[#6B7280]'}`}>
                                {student.name}
                              </p>
                              <p className={`text-sm ${isSelected ? 'text-neutral-600 dark:text-[#9CA3AF]' : 'text-neutral-400 dark:text-[#6B7280]'}`}>
                                {student.registration} - {student.email}
                              </p>
                            </div>
                          </div>

                          {/* Botões de Status - Apenas se selecionado */}
                          {isSelected && (
                            <>
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
                                          : 'bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-700 dark:text-[#E6EAF0] border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] hover:bg-neutral-50 dark:hover:bg-[rgba(255,255,255,0.05)]'
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
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-[#E6EAF0] mb-1">
                                    Justificativa (opcional)
                                  </label>
                                  <textarea
                                    value={attendance.justification || ''}
                                    onChange={(e) => handleJustificationChange(student._id, e.target.value)}
                                    placeholder="Digite a justificativa..."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-[rgba(255,255,255,0.1)] rounded-md bg-white dark:bg-[rgba(30,38,54,0.6)] text-neutral-900 dark:text-[#E6EAF0] placeholder-neutral-400 dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-sm transition-all duration-250"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Botão Salvar no Final */}
          {selectedStudents.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || selectedStudents.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-[#4AB0E8] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-250 shadow-soft-dark"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Salvando...' : `Salvar Presenças (${selectedStudents.length} aluno${selectedStudents.length > 1 ? 's' : ''})`}
              </button>
            </div>
          )}
        </>
      )}

      {selectedCourse && students.length === 0 && !loading && (
        <Card className="p-6">
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-neutral-400 dark:text-[#6B7280] mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-[#9CA3AF]">Nenhum aluno encontrado neste curso.</p>
            <p className="text-sm text-neutral-400 dark:text-[#6B7280] mt-2">
              Verifique se há alunos inscritos neste curso.
            </p>
          </div>
        </Card>
      )}

      {!selectedCourse && !loading && (
        <Card className="p-6">
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-neutral-400 dark:text-[#6B7280] mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-[#9CA3AF]">Selecione um curso para ver os alunos.</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/20">
          <div className="text-red-800 dark:text-red-400">
            <p className="font-semibold mb-2">Erro</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                if (selectedCourse?._id) {
                  fetchStudents(selectedCourse._id);
                }
              }}
              className="mt-3 px-4 py-2 bg-red-600 dark:bg-accent-red text-white rounded-lg hover:bg-red-700 dark:hover:bg-[#E55A5A] transition-all duration-250 text-sm"
            >
              Tentar Novamente
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegisterAttendancePage;




