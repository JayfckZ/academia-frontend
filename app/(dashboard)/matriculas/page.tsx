'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Switch,
  Chip,
  Autocomplete
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RoleGuard from '@/app/components/dashboard/RoleGuard'
import Toast from '@/app/components/dashboard/Toast'
import { apiFetch } from '@/app/lib/api'

interface Plan {
  id: string
  name: string
  duration: number
  durationType: string
  price: number
  active?: boolean
}

interface Student {
  id: string
  name: string
  cpf: string
}

interface Enrollment {
  id: string
  studentId: string
  planId: string
  startDate: string
  endDate: string
  status: string
  student: Student
  plan: Plan
}

type ChipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

export default function MatriculasPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [studentOptions, setStudentOptions] = useState<Student[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null
  )
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const [formData, setFormData] = useState({
    studentId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setToast({ open: true, message, severity })
    },
    []
  )

  const fetchPlansData = async () => {
    const res = await apiFetch('/plans')
    if (!res.ok) throw new Error()
    const data = await res.json()
    const planList = Array.isArray(data) ? data : data.data || []
    return planList.filter((p: Plan) => p.active)
  }

  const fetchEnrollmentsData = async (currentPage: number, limit: number) => {
    const res = await apiFetch(
      `/enrollments?page=${currentPage + 1}&limit=${limit}`
    )
    if (!res.ok) throw new Error()
    const data = await res.json()

    let list = []
    let count = 0

    if (Array.isArray(data)) {
      if (Array.isArray(data[0])) {
        list = data[0]
        count = data[1] || 0
      } else {
        list = data
        count = data.length
      }
    } else {
      list = data.enrollments || data.data || []
      count = data.total || data.count || list.length
    }

    return { list, count }
  }

  const loadEnrollments = useCallback(() => {
    fetchEnrollmentsData(page, rowsPerPage)
      .then(({ list, count }) => {
        setEnrollments(list)
        setTotalCount(count)
      })
      .catch(() => showToast('Erro ao carregar matrículas', 'error'))
  }, [page, rowsPerPage, showToast])

  useEffect(() => {
    fetchPlansData()
      .then(setPlans)
      .catch(() => showToast('Erro ao carregar planos', 'error'))
  }, [showToast])

  useEffect(() => {
    fetchEnrollmentsData(page, rowsPerPage)
      .then(({ list, count }) => {
        setEnrollments(list)
        setTotalCount(count)
      })
      .catch(() => showToast('Erro ao carregar matrículas', 'error'))
  }, [page, rowsPerPage, showToast])

  const handleSearchStudent = async (query: string) => {
    if (query.trim().length < 2) return
    try {
      const res = await apiFetch(
        `/students/search?q=${encodeURIComponent(query)}`
      )
      if (res.ok) {
        const data = await res.json()
        setStudentOptions(Array.isArray(data) ? data : data.data || [])
      }
    } catch {}
  }

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      planId: '',
      startDate: new Date().toISOString().split('T')[0]
    })
    setEditingEnrollment(null)
    setStudentOptions([])
    setModalOpen(false)
  }

  const handleEdit = (enrollment: Enrollment) => {
    setFormData({
      studentId: enrollment.studentId,
      planId: enrollment.planId,
      startDate: enrollment.startDate.split('T')[0]
    })
    setEditingEnrollment(enrollment)
    setModalOpen(true)
  }

  const handleToggleStatus = async (enrollment: Enrollment) => {
    try {
      const newStatus = enrollment.status === 'ACTIVE' ? 'CANCELED' : 'ACTIVE'
      const res = await apiFetch(`/enrollments/${enrollment.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) throw new Error()

      showToast('Status da matrícula atualizado', 'success')
      loadEnrollments()
    } catch {
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const handleSave = async () => {
    try {
      const url = editingEnrollment
        ? `/enrollments/${editingEnrollment.id}`
        : '/enrollments'
      const method = editingEnrollment ? 'PUT' : 'POST'

      const payload = editingEnrollment
        ? { startDate: formData.startDate }
        : formData

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(err.message || 'Erro ao processar matrícula', 'error')
        return
      }

      showToast(
        `Matrícula ${editingEnrollment ? 'atualizada' : 'realizada'} com sucesso`,
        'success'
      )
      resetForm()
      loadEnrollments()
    } catch {
      showToast('Erro de conexão', 'error')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date)
  }

  const formatDuration = (duration: number, type: string) => {
    const types: Record<string, string> = {
      DAYS: duration === 1 ? 'Dia' : 'Dias',
      WEEKS: duration === 1 ? 'Semana' : 'Semanas',
      MONTHS: duration === 1 ? 'Mês' : 'Meses',
      YEARS: duration === 1 ? 'Ano' : 'Anos'
    }
    return `${duration} ${types[type] || type}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'CANCELED':
        return 'error'
      case 'EXPIRED':
        return 'warning'
      case 'SUSPENDED':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativa'
      case 'CANCELED':
        return 'Cancelada'
      case 'EXPIRED':
        return 'Expirada'
      case 'SUSPENDED':
        return 'Suspensa'
      default:
        return status
    }
  }

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION']}
      fallback={
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Acesso negado. Seu cargo não permite visualizar as matrículas.
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Gestão de Matrículas
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Nova Matrícula
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid rgba(255, 255, 255, 0.05)',
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Aluno</TableCell>
                <TableCell>Plano</TableCell>
                <TableCell>Início</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => {
                const isActive = enrollment.status === 'ACTIVE'
                return (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.student?.name}</TableCell>
                    <TableCell>{enrollment.plan?.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-fira-code)' }}>
                      {formatDate(enrollment.startDate)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-fira-code)' }}>
                      {formatDate(enrollment.endDate)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(enrollment.status)}
                        color={getStatusColor(enrollment.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={isActive}
                        onChange={() => handleToggleStatus(enrollment)}
                        color="success"
                        size="small"
                      />
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(enrollment)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
        />
      </Paper>

      <Dialog open={modalOpen} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEnrollment ? 'Editar Matrícula' : 'Realizar Nova Matrícula'}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}
          >
            {editingEnrollment ? (
              <>
                <TextField
                  label="Aluno"
                  value={editingEnrollment.student?.name}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Plano"
                  value={editingEnrollment.plan?.name}
                  disabled
                  fullWidth
                />
              </>
            ) : (
              <>
                <Autocomplete
                  options={studentOptions}
                  getOptionLabel={(option) => `${option.name} (${option.cpf})`}
                  onInputChange={(e, newInputValue) =>
                    handleSearchStudent(newInputValue)
                  }
                  onChange={(e, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      studentId: newValue?.id || ''
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Buscar Aluno (Nome ou CPF)" />
                  )}
                  noOptionsText="Digite para buscar..."
                />

                <TextField
                  select
                  label="Selecionar Plano"
                  name="planId"
                  value={formData.planId}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {plans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.name} (
                      {formatDuration(plan.duration, plan.durationType)}) -{' '}
                      {formatCurrency(plan.price)}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            <TextField
              label="Data de Início"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={resetForm} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              (!formData.studentId && !editingEnrollment) ||
              (!formData.planId && !editingEnrollment)
            }
          >
            {editingEnrollment ? 'Salvar Alteração' : 'Confirmar Matrícula'}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </RoleGuard>
  )
}
