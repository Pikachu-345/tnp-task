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
          if (err.response?.status === 404) {
              setError('Share link invalid or data not found.');
          } else if (err.response?.status === 401 || err.response?.status === 403) {
              setError('Unauthorized access. This share link may have expired or is invalid.');
          }
          else {
              setError(err.response?.data?.message || err.message || 'Failed to fetch student data.');
          }
        } else {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-gray-700 max-w-md text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredStudents.length === 0 && studentData.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-8  flex-col">
        <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-gray-700 w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Shared Student Data</h1>
          <div className="mb-6">
            <label htmlFor="emailFilter" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
              Filter by Email:
            </label>
            <input
              type="email"
              id="emailFilter"
              placeholder="Enter email to filter..."
              className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg">No students match your filter criteria.</p>
        </div>
      </div>
    );
  }

  if (studentData.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-gray-700 max-w-md text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">No Data Available</h2>
                <p className="text-gray-600 dark:text-gray-300">The share link is valid, but no student data was found.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl dark:shadow-gray-700 w-full max-w-4xl flex flex-col h-[calc(100vh-4rem)]"> 
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Shared Student Data</h1>

        <div className="mb-6">
          <label htmlFor="emailFilter" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Filter by Email:
          </label>
          <input
            type="email"
            id="emailFilter"
            placeholder="Enter email to filter..."
            className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>

        <div className="flex-grow overflow-y-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"> 
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700"> 
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Roll No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.roll_no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {student.roll_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {student.first_name +" "+student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
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
