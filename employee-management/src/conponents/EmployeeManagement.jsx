import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Users, DollarSign, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card, CardContent } from './ui/card';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    salary: ''
  });

  const API_URL = 'https://webapi-2b3x.onrender.com/api/employee';

  // Calculate summary statistics
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
  const departments = [...new Set(employees.map(emp => emp.department))].length;

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = selectedEmployee ? `${API_URL}/${selectedEmployee.id}` : API_URL;
    const method = selectedEmployee ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save employee');
      await fetchEmployees();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete employee');
      await fetchEmployees();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(employee);
    setFormData(employee || { name: '', department: '', salary: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setFormData({ name: '', department: '', salary: '' });
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.5
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-8">
        {/* Header with Glassmorphism */}
        <div className="mb-8 bg-white bg-opacity-70 backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-gray-600">Manage your organization's workforce efficiently</p>
        </div>

        {/* Statistics Cards with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white bg-opacity-70 backdrop-blur-lg border border-white border-opacity-20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-70 backdrop-blur-lg border border-white border-opacity-20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-gradient-to-br from-green-500 to-green-600 p-3 mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Salary</p>
                <p className="text-2xl font-bold text-gray-900">Ksh {totalSalary.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-70 backdrop-blur-lg border border-white border-opacity-20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-3 mr-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 bg-white bg-opacity-70 backdrop-blur-lg border border-white border-opacity-20"
              placeholder="Search employees or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Employee Table */}
        <Card className="bg-white bg-opacity-70 backdrop-blur-lg border border-white border-opacity-20 shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Salary</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-white hover:bg-opacity-50 transition-colors duration-200">
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-blue-200 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                      {employee.department}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">Ksh {employee.salary.toLocaleString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
                      onClick={() => handleOpenModal(employee)}
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="hover:bg-red-700 transition-all duration-200"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Modals with updated styling */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-700 bg-opacity-90 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold ">
              {selectedEmployee ? 'Edit Employee' : 'Add Employee'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Department</label>
              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Salary</label>
              <Input
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseModal}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {selectedEmployee ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray bg-opacity-90 backdrop-blur-lg">
            <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white">
            Are you sure you want to delete <span className="font-semibold">{selectedEmployee?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleDelete(selectedEmployee?.id)}
              className="hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployeeManagement;