'use client'; 

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation'; 
import axios from 'axios';
import { getSharedStudentDataApi } from '@/services/api';

interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
  roll_no: string;
}

export default function PublicSharePage() {
  const params = useParams(); 
  const shareToken = params.token as string;
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [emailFilter, setEmailFilter] = useState<string>('');

  
  useEffect(() => {
    if (!shareToken) {
      setError('Share link is invalid or missing token.');
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responseData = await getSharedStudentDataApi(shareToken);

        if (Array.isArray(responseData)) { 
          setStudentData(responseData);
        } else { 
          setError('No student data found or unexpected data format.');
          setStudentData([]);
        }
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          console.error('Axios error fetching shared data:', err.response || err.message);
          if (err.response?.status === 404) {
              setError('Share link invalid or data not found.');
          } else if (err.response?.status === 401 || err.response?.status === 403) {
              setError('Unauthorized access. This share link may have expired or is invalid.');
          }
          else {
              setError(err.response?.data?.message || err.message || 'Failed to fetch student data.');
          }
        } else {
          console.error('Error fetching shared data:', err);
          setError(err.message || 'An unexpected error occurred.');
        }
        setStudentData([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [shareToken]);           
                
  const filteredStudents = useMemo(() => {
    if (!emailFilter) {
      return studentData; 
    }
    const lowercasedFilter = emailFilter.toLowerCase();
    return studentData.filter(student =>
      student.email.toLowerCase().includes(lowercasedFilter)
    );
  }, [studentData, emailFilter]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredStudents.length === 0 && studentData.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shared Student Data</h1>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Filter by email..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>
          <p className="text-gray-600 text-center">No students match your filter criteria.</p>
        </div>
      </div>
    );
  }

  if (studentData.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">No Data Available</h2>
                <p className="text-gray-600">The share link is valid, but no student data was found.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shared Student Data</h1>

        <div className="mb-6">
          <label htmlFor="emailFilter" className="block text-gray-700 text-sm font-bold mb-2">
            Filter by Email:
          </label>
          <input
            type="email"
            id="emailFilter"
            placeholder="Enter email to filter..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.roll_no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.roll_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.first_name +" "+student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}