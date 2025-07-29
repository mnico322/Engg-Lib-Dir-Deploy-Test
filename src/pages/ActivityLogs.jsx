import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(
        collection(db, 'activity_logs'),
        orderBy('timestamp', 'desc')
      );
      const logsSnapshot = await getDocs(q);
      const logsList = logsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logsList);
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Activity Logs</h2>

      <input
        type="text"
        placeholder="Filter by admin email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Admin Email</th>
            <th>Action</th>
            <th>Target User</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs
            .filter(log =>
              log.adminEmail.toLowerCase().includes(searchEmail.toLowerCase())
            )
            .map(log => (
              <tr key={log.id}>
                <td>{log.adminEmail}</td>
                <td>{log.action}</td>
                <td>{log.targetUser}</td>
                <td>{log.timestamp?.toDate().toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
