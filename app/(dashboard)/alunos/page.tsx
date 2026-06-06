'use client'

import { useState, useEffect, useCallback, ElementType } from 'react'
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
  IconButton,
  InputAdornment,
  InputBaseComponentProps,
  Switch,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import RoleGuard from '@/app/components/dashboard/RoleGuard'
import Toast from '@/app/components/dashboard/Toast'
import { apiFetch } from '@/app/lib/api'
import {
  CpfInput,
  PhoneInput,
  formatCpf,
  formatPhone
} from '@/app/components/dashboard/Masks'

interface Student {
  id: string
  registrationNumber: string
  name: string
  email: string
  cpf: string
  phone: string | null
  birthDate: string
  status: boolean
}

export default function AlunosPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: ''
  })

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setToast({ open: true, message, severity })
    },
    []
  )

  const fetchStudentsData = async (
    currentPage: number,
    limit: number,
    query: string
  ) => {
    const isSearch = query.trim().length >= 2
    const endpoint = isSearch
      ? `/students/search?q=${encodeURIComponent(query)}`
      : `/students?page=${currentPage + 1}&limit=${limit}`

    const res = await apiFetch(endpoint)
    if (!res.ok) throw new Error()
    const data = await res.json()

    return { data, isSearch }
  }

  const loadStudents = useCallback(() => {
    fetchStudentsData(page, rowsPerPage, searchQuery)
      .then(({ data, isSearch }) => {
        if (isSearch) {
          const list = Array.isArray(data) ? data : data.data || []
          setStudents(list)
          setTotalCount(list.length)
        } else {
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
            list = data.students || data.data || []
            count = data.total || data.count || list.length
          }

          setStudents(list)
          setTotalCount(count)
        }
      })
      .catch(() => showToast('Erro ao carregar alunos', 'error'))
  }, [page, rowsPerPage, searchQuery, showToast])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', cpf: '', phone: '', birthDate: '' })
    setEditingId(null)
    setModalOpen(false)
  }

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      cpf: student.cpf,
      phone: student.phone || '',
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : ''
    })
    setEditingId(student.id)
    setModalOpen(true)
  }

  const handleToggleStatus = async (student: Student) => {
    try {
      const res = await apiFetch(`/students/${student.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: !student.status })
      })

      if (!res.ok) throw new Error()

      showToast('Status atualizado com sucesso', 'success')
      loadStudents()
    } catch {
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/students/${editingId}` : '/students'
      const method = editingId ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        cpf: formData.cpf,
        phone: formData.phone
      }

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(err.message || 'Erro ao salvar aluno', 'error')
        return
      }

      showToast(
        `Aluno ${editingId ? 'atualizado' : 'matriculado'} com sucesso`,
        'success'
      )
      resetForm()
      loadStudents()
    } catch {
      showToast('Erro de conexão', 'error')
    }
  }

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION', 'TRAINER']}
      fallback={
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Acesso negado. Seu cargo não permite visualizar alunos.
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 4,
          gap: 2
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Gestão de Alunos
        </Typography>

        <Box
          sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}
        >
          <TextField
            size="small"
            placeholder="Buscar por nome ou CPF..."
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }
            }}
          />

          <RoleGuard allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION']}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
            >
              Matricular
            </Button>
          </RoleGuard>
        </Box>
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
                <TableCell>Matrícula</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell sx={{ fontFamily: 'var(--font-fira-code)' }}>
                    {student.registrationNumber}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{formatCpf(student.cpf)}</TableCell>
                  <TableCell>
                    {student.phone ? formatPhone(student.phone) : student.email}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.status ? 'Ativo' : 'Inativo'}
                      color={student.status ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <RoleGuard allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION']}>
                      <Switch
                        checked={student.status}
                        onChange={() => handleToggleStatus(student)}
                        color="success"
                        size="small"
                      />
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(student)}
                      >
                        <EditIcon />
                      </IconButton>
                    </RoleGuard>
                  </TableCell>
                </TableRow>
              ))}
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
          {editingId ? 'Editar Aluno' : 'Nova Matrícula'}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            <TextField
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                fullWidth
                slotProps={{
                  input: {
                    inputComponent:
                      CpfInput as unknown as ElementType<InputBaseComponentProps>
                  }
                }}
              />
              <TextField
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                slotProps={{
                  input: {
                    inputComponent:
                      PhoneInput as unknown as ElementType<InputBaseComponentProps>
                  }
                }}
              />
            </Box>
            <TextField
              label="Data de Nascimento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
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
          <Button onClick={handleSave} variant="contained">
            Salvar Matrícula
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
